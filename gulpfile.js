var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');


/*----server-----*/
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

gulp.watch ('build/**/*').on('change' , browserSync.reload);

});

// gulp pack

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
    .pipe(pug({
      // Your options in here.
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

//gulp sass style

gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('build/css'));
  });
  
  gulp.task('sass:watch', function () {
    gulp.watch('build/styles/main.scss', ['sass']);
  });


  //spritesmith

  gulp.task('sprite', function(cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));
  
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
  });

  //rimraf

  gulp.task('clean', function del(cb) {
    rimraf('build', cb);
 });

 //copy fonts

 gulp.task ('copy:fonts', function(){
     return gulp.src('./source/fonts/**/*.*')
        .pipe (gulp.dest('build/fonts'));
    });
 
 //copy fonts

 gulp.task ('copy:images', function(){
    return gulp.src('./source/images/**/*.*')
       .pipe (gulp.dest('build/images'));
   });
 //copy
 gulp.task ('copy', gulp.parallel('copy:fonts', 'copy:images'));

 //Watches
 gulp.task('watch', function(){
    gulp.watch('source/template/**/*.png', gulp.series('templates:compile'));
    gulp.watch('source/styles/88/8.scss', gulp.series('styles:compile'));
 });

 gulp.task('default', gulp.series(
     'clean', 
     gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
     gulp.parallel('watch', 'server')
 ));