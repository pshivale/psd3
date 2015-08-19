var gulp = require('gulp');
var jshint = require('gulp-jshint');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var prettify = require('gulp-jsbeautifier');
var Server = require('karma').Server;

gulp.task('default', ['lint','maxCss','maxJs','minCss','minJs', 'format-js','prettify-html','prettify-css']);

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
  gulp.src('psd3.*', {base: "."})
    .pipe(gulp.dest('../pshivale.github.io/psd3'));
  gulp.src('samples/**/*', {base:"."})
    .pipe(gulp.dest('../pshivale.github.io/psd3/'));

});

gulp.task('format-js', function() {
  gulp.src('src/**/*.js')
    .pipe(prettify({indentSize: 4, mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('src'));

  gulp.src('spec/**/*.js')
    .pipe(prettify({indentSize: 4, mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('spec'))
});

gulp.task('prettify-html', function() {
  gulp.src('samples/**/*.html')
    .pipe(prettify({indentSize: 4}))
    .pipe(gulp.dest('samples'))
});

gulp.task('prettify-css', function() {
  gulp.src('src/**/*.css')
    .pipe(prettify({indentSize: 4}))
    .pipe(gulp.dest('src'))
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});