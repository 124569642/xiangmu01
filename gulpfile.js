var gulp = require('gulp');
    
  gulp.task('copy-index',function(){
     	gulp.src("index01.html").pipe(gulp.dest("D:/pc"))
     });
    gulp.task("copy-js",function(){
     	gulp.src("js/*.js").pipe(gulp.dest("D:/pc"));
     });
  gulp.task('watch',function(){
     	gulp.watch("index.html",["copy-index"]);
     	gulp.watch("js/*.js",["copy-js"]);
     });
