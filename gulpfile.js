const { src, dest, series, watch, parallel } = require('gulp');

const removeCommentsCss = require('gulp-strip-css-comments');
const autoprefixer      = require('gulp-autoprefixer');
const sass              = require('gulp-sass')(require('sass'));
const cleanCSS          = require('gulp-clean-css');
const del               = require('del');
const concat            = require('gulp-concat');
const sync              = require('browser-sync').create();
const babel             = require('gulp-babel');
const uglify            = require('gulp-uglify');


const html = () => {
    return src('./src/index.html')
        .pipe(dest('./app'));
};


const scriptsDev = () => {
    return src("./src/js/widthControl.js")
        .pipe(dest("./app/js"))
};

const scriptsBuild = () => {
    return src("./src/js/widthControl.js")
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify({
            keep_fnames: true
        }))
        .pipe(dest("./app/js"));
};

const scriptsBuildDist = () => {
    return src("./src/js/widthControl.js")
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify({
            keep_fnames: true
        }))
        .pipe(dest("./WidthControl"));
}


const scssDev = () => {
   return src('./src/scss/style.scss')
       .pipe(sass({
            outputStyle:'expanded'
        }))
       .pipe(concat('./css/style.css'))
       .pipe(dest('./app'));
};

const scssBuild = () => {
   return src('./src/scss/style.scss')
        .pipe(sass({
            outputStyle:'compressed'
        }))
        .pipe(removeCommentsCss())
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(concat('./css/style.css'))
        .pipe(dest('./app'));
};


const clear = () => {
    return del('./app');
};

const clearScripts = () => {
    return del("./WidthControl");
};


const serve = () => {
    sync.init({
        server: './app/'
    });

    watch('./src/index.html',			series(html)).on('change', sync.reload);
    watch("./src/js/widthControl.js",	series(scriptsDev)).on('change', sync.reload);
    watch('./src/scss/**/*.scss',		series(scssDev)).on('change', sync.reload);
};


exports.buildScripts = series(clearScripts, scriptsBuildDist);
exports.build = series(clear, parallel(scssBuild, html, scriptsBuild));
exports.serve = series(clear, parallel(scssDev, html, scriptsDev, serve));
