// including plugins
var fs = require('fs'),
    gulp = require('gulp'),
    minifyCss = require("gulp-clean-css"),
    uglify = require("gulp-uglify"),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    postcss = require('gulp-postcss'),
    pxtorem = require('gulp-pxtorem'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass');
    pump = require('pump');

    eval(fs.readFileSync('./local-config.js')+'');

var pxtoremOptions = {
    replace: true,
    propWhiteList: ['font', 'font-size', 'line-height', 'letter-spacing', 'height', 'width', 'margin', 'padding']
};

var postcssOptions = {
};

/* SCSS Path */
var paths = {
    scss: 'sass/style.scss'
};

var reload = browserSync.reload; // For manual browser reload.

//task
gulp.task('minify-js', function (cb) {
    pump([
      gulp.src('js/*.js'),
      uglify(),
      rename(function (path) {
          path.basename += ".min";
          path.extname = ".js";
      }),
      browserSync.reload({
        stream: true
      }),
      gulp.dest('dist/')
    ],
    cb
  );
});

//task
gulp.task('browserSync', function() {
  browserSync.init({
    proxy: localURL
  });
});

/* Sass task */
gulp.task('sass', function () {
  return gulp.src('sass/style.scss')
  .pipe(rename('main.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// task
gulp.task('minify-css', ['sass'], function () {
    gulp.src('css/main.css') // path to your file
        .pipe(minifyCss())
        .pipe(pxtorem(pxtoremOptions, postcssOptions))
        .pipe(autoprefixer({
			browsers: ['> 1%', 'IE 9', 'IE 10', 'IE 11', 'iOS 7', 'iOS 6'],
			cascade: false
		}))
        .pipe(rename('main.min.css'))
        .pipe(browserSync.reload({
          stream: true
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['sass', 'minify-css', 'minify-js','browserSync'], function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('./sass/style.scss', ['sass']);
  gulp.watch('css/main.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  gulp.watch('./**/*.php').on('change', browserSync.reload);
});
gulp.task('build', ['sass', 'minify-css', 'minify-js']);
