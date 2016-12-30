/*
 * @author ohmed
 * Gulp build file
*/

var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var nodemon = require('gulp-nodemon');
var order = require('gulp-order');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');

//

// Resources build

gulp.task( 'resources', function () {

    gulp.src('./src/client/resources/**/*')
        .pipe(gulp.dest('./bin/client/resources/'))
        .pipe(connect.reload());

});

// JS build

gulp.task( 'js', function () {

    gulp.src([ './src/client/js/libs/*' ])
        .pipe( gulpif( argv.prod, uglify() ) )
        .pipe(order([
            'three.js',
            '*'
        ]))
        .pipe( concat('libs.js') )
        .pipe( gulp.dest('./bin/client/js/') )
        .pipe( connect.reload() );

    gulp.src([ './src/client/js/**/*', '!./src/client/js/libs/*' ])
        .pipe( gulpif( argv.prod, uglify() ) )
        .pipe(order([
            'libs/three.js',
            'libs/*.js',
            'core/Game.js',
            'core/**/*',
            'objects/core/**/*',
            '**/*'
        ]))
        .pipe( concat('all.js') )
        .pipe( gulp.dest('./bin/client/js/') )
        .pipe( connect.reload() );

});

// CSS

gulp.task( 'css', function () {

    gulp.src('./src/client/css/*')
        .pipe( concat('all.css') )
        .pipe( gulp.dest('./bin/client/css/') )
        .pipe( connect.reload() );

});

// HTML

gulp.task( 'html', function () {

    gulp.src('./src/client/*.html')
        .pipe( gulp.dest('./bin/client/') )
        .pipe( connect.reload() );

});

// Server

gulp.task( 'server', function () {

    gulp.src('./src/server/**/*')
        .pipe( gulp.dest('./bin/server/') )
        .pipe( connect.reload() );

});

// Connect

gulp.task( 'connect', function () {

    connect.server({
        root: 'public',
        livereload: true
    });

});

// RUN

gulp.task( 'run', [ 'resources', 'js', 'html', 'css', 'server' ], function () {

    nodemon({
        delay: 10,
        script: './bin/server/server.js',
        cwd: '',
        args: [],
        ext: 'html js css'
    })
    .on('restart', function () {

        console.log('server restarted!');

    });

});

// Watch

gulp.task( 'watch', function () {

    gulp.watch( './src/client/css/*', ['css']);
    gulp.watch( './src/client/*', ['html'] );
    gulp.watch( './src/client/js/**/*', ['js'] );
    gulp.watch( './src/server/**/*', ['server'] );

});

// Default

gulp.task( 'default', [ 'watch', 'run' ] );
