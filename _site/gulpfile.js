var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('compress', function() {
  return gulp.src('js/lib/*.js')
  	.pipe(concat('app.js'))
  	.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('default', ['compress']);