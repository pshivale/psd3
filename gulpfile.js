var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('default', ['minCss','minJs']);

gulp.task('minCss', function() {
  gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(concat('psd3.min.css'))
        .pipe(gulp.dest('.'));
});


gulp.task('minJs', function() {
  return gulp.src('src/js/*.js')
    //.pipe(uglify())
    .pipe(concat('psd3.min.js'))
    .pipe(gulp.dest('.'));
});