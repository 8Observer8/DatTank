/*
 * @author ohmed
 * Gulp build file
*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var spawn = require('child_process').spawn;

//

var masterProcess = false;
var arenaProcesses = [];

// Resources build

gulp.task( 'resources', function () {

    gulp.src('./src/client/resources/**/*')
        .pipe(gulp.dest('./bin/client/resources/'));

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

// Master-Server

gulp.task( 'server-master', function () {

    gulp.src('./src/server-master/**/*')
        .pipe( gulp.dest('./bin/server-master/') );

    //

    restartMasterServer();

});

gulp.task( 'server-master', function () {

    gulp.src('./src/server-master/**/*')
        .pipe( gulp.dest('./bin/server-master/') );

    //

    restartMasterServer();

});

// Arena-Server

gulp.task( 'server-arena', function () {

    gulp.src('./src/server-arena/**/*')
        .pipe( gulp.dest('./bin/server-arena/') );

    //

    restartArenaServer();

});

gulp.task( 'server-arena', function () {

    gulp.src('./src/server-arena/**/*')
        .pipe( gulp.dest('./bin/server-arena/') );

    //

    restartArenaServer();

});

// RUN

gulp.task( 'run', [ 'resources', 'js', 'html', 'css', 'server-master', 'server-arena' ], function () {

    restartMasterServer();
    restartArenaServer();

});

// Watch

gulp.task( 'watch', function () {

    gulp.watch( './src/client/css/*', ['css']);
    gulp.watch( './src/client/*', ['html'] );
    gulp.watch( './src/client/js/**/*', ['js'] );
    gulp.watch( './src/server-master/**/*', ['server-master'] );
    gulp.watch( './src/server-arena/**/*', ['server-arena'] );

});

// Default

gulp.task( 'default', [ 'watch', 'run' ] );

//

function restartMasterServer () {

    if ( masterProcess ) {

        masterProcess.kill();

    }

    //

    masterProcess = spawn( 'node', [ './bin/server-master/Server.js' ], { stdio: 'inherit' } )

    masterProcess.on( 'close', function ( code ) {

        if ( code === 8 ) {

            gulp.log('Error detected, waiting for changes...');

        }

    });

};

function restartArenaServer () {

    for ( var i = 0, il = arenaProcesses.length; i < il; i ++ ) {

        arenaProcesses[ i ].kill();

    }

    //

    var arenaProcess = spawn( 'node', [ './bin/server-arena/Server.js' ], { stdio: 'inherit' } )

    arenaProcess.on( 'close', function ( code ) {

        if ( code === 8 ) {

            gulp.log('Error detected, waiting for changes...');

        }

    });

    arenaProcesses.push( arenaProcess );

};

process.on( 'exit', function () {

    if ( masterProcess ) {

        masterProcess.kill();

    }

    for ( var i = 0, il = arenaProcesses.length; i < il; i ++ ) {

        arenaProcesses[ i ].kill();

    }

});
