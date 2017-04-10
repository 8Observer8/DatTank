/*
 * @author ohmed
 * Gulp build file
*/

var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var nodemon = require('gulp-nodemon');
var order = require('gulp-order');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var spawn = require('child_process').spawn;

//

var nodeProcess;

// Resources build

gulp.task( 'resources', function () {

    gulp.src('./src/client/resources/**/*')
        .pipe(gulp.dest('./bin/client/resources/'))
        .pipe(connect.reload());

});

// JS build

gulp.task( 'js', function () {

    gulp.src([ './src/client/js/**/*' ])
        .pipe( gulpif( argv.prod, uglify() ) )
        .pipe( gulp.dest('./bin/client/js/') );

});

// CSS

gulp.task( 'css', function () {

    gulp.src('./src/client/css/*')
        .pipe( concat('all.css') )
        .pipe( gulp.dest('./bin/client/css/') );

});

// HTML

gulp.task( 'html', function () {

    gulp.src('./src/client/*.html')
        .pipe( gulpif( argv.prod, useref() ) )
        .pipe( gulpif( argv.prod, gulpif( '*.js', uglify() ) ) )
        .pipe( gulp.dest('./bin/client/') );

});

// Server

gulp.task( 'server', function () {

    gulp.src('./src/server/**/*')
        .pipe( gulp.dest('./bin/server/') );

    //

    restartServer();

});

// RUN

gulp.task( 'run', [ 'resources', 'js', 'html', 'css', 'server' ], function () {

    restartServer();

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

//

function restartServer () {

    if ( nodeProcess ) nodeProcess.kill();
    nodeProcess = spawn( 'node', [ './bin/server/Server.js' ], { stdio: 'inherit' } )

    nodeProcess.on( 'close', function ( code ) {

        if ( code === 8 ) {

            gulp.log('Error detected, waiting for changes...');

        }

    });

};

process.on( 'exit', function () {

    if ( nodeProcess ) nodeProcess.kill();

});
