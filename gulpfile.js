var gulp     = require('gulp');
var concat   = require('gulp-concat');
var uglify   = require('gulp-uglify');
var notify   = require('gulp-notify');
var clean    = require('gulp-clean');
var nodemon  = require('gulp-nodemon');

var paths = {
  vendors: ['bower_components/jquery/dist/jquery.min.js', 'bower_components/handlebars/handlebars.min.js','./bower_components/ember/ember.js'],
  scripts: ['public/js/*.js'],
  images: ['public/images/**/*']
};

gulp.task('vendors', function() {
  return gulp.src(paths.vendors)
      .pipe(concat('vendors.min.js'))
      .pipe(gulp.dest('public/js/dest'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
      .pipe(concat('main.js'))
      .pipe(gulp.dest('public/js/dest'));
});

gulp.task('clean', function() {
  return gulp.src(['public/js/dest', 'public/images/dest' ], {read: false})
      .pipe(clean());
});

gulp.task('webserver', function() {
  nodemon({ script: 'app.js' })
  .on('restart', function() {
    console.log('restart');
  });
});

gulp.task('default', ['clean'], function(){
  gulp.start('vendors','scripts', 'webserver');
});

gulp.task('upload', ['clean'], function(){
  gulp.start('vendors','scripts');
});