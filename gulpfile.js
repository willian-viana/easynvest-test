var gulp = require('gulp'),
    less = require('gulp-less');

gulp.task('templates', function() {
  return gulp.src('./src/**/**.html')
      .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts', function() {
  return gulp.src('./src/**/**.js')
      .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('less', function () {
  return gulp.src('./styles/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});


