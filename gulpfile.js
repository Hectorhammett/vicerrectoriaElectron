var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task("sass",function(){
  return gulp.src('./sass/materialize-src/sass/materialize.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('./css'));
});
