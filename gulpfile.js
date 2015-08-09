var gulp = require('gulp');
var jshint = require('gulp-jshint');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('default', ['lint','maxCss','maxJs','minCss','minJs']);

gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('maxCss', function() {
  gulp.src('src/css/*.css')
        .pipe(concat('psd3.css'))
        .pipe(gulp.dest('.'));
});


gulp.task('maxJs', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('psd3.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('minCss', function() {
  gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(concat('psd3.min.css'))
        .pipe(gulp.dest('.'));
});


gulp.task('minJs', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('psd3.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('copyDemos', function() {
  gulp.src('psd3.min.*', {base: "."})
    .pipe(gulp.dest('../pshivale.github.io/psd3'));
  gulp.src('samples/**/*', {base:"."})
    .pipe(gulp.dest('../pshivale.github.io/psd3/'));

});
