var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('compress-site', function() {
  return gulp.src('js/lib/site/*.js')
  	.pipe(concat('app.js'))
  	.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('compress-cube', function() {
  return gulp.src('js/lib/cube/*.js')
  	.pipe(concat('cube.js'))
  	.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('default', ['compress-site', 'compress-cube']);