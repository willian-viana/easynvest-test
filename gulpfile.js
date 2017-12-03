var gulp        = require('gulp'),
    less        = require('gulp-less'),
    inject      = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    buffer      = require('vinyl-buffer'),
    livereload  = require('gulp-livereload'),
    rename      = require('gulp-rename'),
    source      = require('vinyl-source-stream'),
    sourceMaps  = require('gulp-sourcemaps');

var paths = {
    js : {
      src: './src/scripts/main.js',
      outputDirTemp: './tmp/scripts',
      outputDir: './dist/scripts',
      mapDir: './maps',
      outputFile: 'bundle.js'
    },
    html : {
      src: './src/**/*.html',
      outputDirTemp: './tmp',
      outputDir: './dist',
      distIndex: './dist/index.html'
    },
    css : {
      src: './src/**/*.less',
      outputDirTemp: './tmp/**/*.css',
      outputDir: './dist/**/*.css',
    },
    json : {
      src: './src/data.json',
      outputDirTemp : './tmp',
      outputDir : './dist',
      outputFile : 'data.json'
    }
};

gulp.task('templates', function() {
  return gulp.src(paths.html.src)
      .pipe(gulp.dest('./tmp'));
});

gulp.task('less', function () {
  return gulp.src(paths.css.src)
    .pipe(less())
    .pipe(gulp.dest('./tmp/css'));
});

gulp.task('assets', function() {
  return gulp.src(paths.srcImages)
    .pipe(gulp.dest('./tmp'))
})

gulp.task('json', function() {
  return gulp.src(paths.json.src)
    .pipe(gulp.dest('./tmp'))
})

function bundle(bundler) {
  return bundler
    .bundle()
    .pipe(source(paths.js.src))
    .pipe(buffer())
    .pipe(rename('bundle.js'))
    .pipe(sourceMaps.init({ loadMaps: true }))
    .pipe(sourceMaps.write('./maps'))
    .pipe(gulp.dest('./tmp/scripts'))
    .pipe(livereload());
}

gulp.task('bundle', function () {
  var bundler = browserify(paths.js.src)
    .transform(babelify, { presets: ['es2015'] });
  return bundle(bundler);
});

gulp.task('copy', ['templates', 'less', 'assets', 'bundle', 'json']);

gulp.task('inject', ['copy'], function() {
  var css = gulp.src(paths.css.outputDirTemp);
  var js  = gulp.src('./tmp/scripts/bundle.js')
  return gulp.src(paths.html.outputDirTemp)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject(js, { relative: true }))
    .pipe(gulp.dest(paths.tmp));
})

gulp.task('serve', ['inject'], function () {
  browserSync.init({
    server: paths.tmp
  })
  gulp.watch(paths.html.src, ['templates', 'inject'])
  gulp.watch(paths.css.src, ['styles'])
  gulp.watch(paths.js.src, ['bundle'])
  gulp.watch(paths.src).on('change', browserSync.reload);
});

gulp.task('html:dist', function () {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function () {
  return gulp.src(paths.css.src)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('js:dist', function () {
  return gulp.src(paths.js.src)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('assets:dist', function () {
  return gulp.src(paths.srcImages)
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('copy:dist', ['html:dist', 'css:dist', 'assets:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], function () {
  var css = gulp.src(paths.css.outputDir);
  var js = gulp.src(paths.js.outputDir);
  return gulp.src(paths.html.distIndex)
    .pipe(inject(css, { relative: true }))
    .pipe(inject(js, { relative: true }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);
gulp.task('default', ['serve']);
