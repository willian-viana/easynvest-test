var gulp        = require('gulp'),
    less        = require('gulp-less'),
    inject      = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/**/*.less',
  srcJS: 'src/**/*.js',
  srcImages: 'src/**/*.png',
  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpCSS: 'tmp/**/*.css',
  tmpJS: 'tmp/**/*.js',
  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};

gulp.task('templates', function() {
  return gulp.src(paths.srcHTML)
      .pipe(gulp.dest('./tmp'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.srcJS)
      .pipe(gulp.dest('./tmp/scripts'));
});

gulp.task('less', function () {
  return gulp.src(paths.srcCSS)
    .pipe(less())
    .pipe(gulp.dest('./tmp/css'));
});

gulp.task('assets', function() {
  return gulp.src(paths.srcImages)
    .pipe(gulp.dest('./tmp/'))
})

gulp.task('copy', ['templates', 'less', 'assets', 'scripts']);

gulp.task('inject', ['copy'], function() {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.tmp));
})

gulp.task('serve', ['inject'], function () {
  browserSync.init({
    server: paths.tmp
  })
  gulp.watch(paths.srcHTML, ['templates', 'inject'])
  gulp.watch(paths.srcCSS, ['styles'])
  gulp.watch(paths.srcJS, ['scripts'])
  gulp.watch(paths.src).on('change', browserSync.reload);
});

gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
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
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);
gulp.task('default', ['serve']);

