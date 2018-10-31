/*
 * @author ohmed
 * Gulp build file
*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var spawn = require('child_process').spawn;
var ts = require('gulp-typescript');

var browserify = require('browserify');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

//

var masterProcess = false;
var arenaProcesses = [];

// Resources build

gulp.task( 'resources', function () {

    return gulp.src('./src/client/resources/**/*')
        .pipe(gulp.dest('./bin/client/resources/'));

});

// Libs build

gulp.task( 'libs', function () {

    return gulp.src('./src/client/libs/**/*')
        .pipe(gulp.dest('./bin/client/libs/'));

});

// TS build

gulp.task( 'brf', function () {

    var b = browserify({
        entries:    './src/client/scripts/Game.ts',
        transform:  babelify,
        debug:      ! argv.prod
    });

    b.plugin('tsify', { "lib": ["es6", "dom"] });
    b.transform({ global: true }, 'browserify-shim');

    if ( argv.prod ) {

        b.plugin('tinyify', { flat: false });
        b.transform('uglifyify', { global: true });

    }

    return b.bundle()
        .pipe( source('bundle.js') )
        .pipe( buffer() )
        .pipe( gulp.dest('./bin/client/scripts') )
        .pipe( gulpif( argv.prod, uglify() ) );

});

// JS

gulp.task( 'js', function () {

    return gulp.src('./src/client/scripts/**/*.js')
        .pipe( gulp.dest('./bin/client/scripts/') );

});

// CSS

gulp.task( 'css', function () {

    return gulp.src('./src/client/css/*')
        .pipe( concat('all.css') )
        .pipe( gulp.dest('./bin/client/css/') );

});

// HTML

gulp.task( 'html', function () {

    return gulp.src('./src/client/**/*.html')
        .pipe( gulp.dest('./bin/client/') );

});

// Master-Server

gulp.task( 'server-master', function () {

    return gulp.src('./src/server-master/**/*')
        .pipe( gulp.dest('./bin/server-master/') );

});

gulp.task( 'start-server-master', function ( done ) {

    restartMasterServer();
    return done();

});

// Arena-Server

gulp.task( 'server-arena', function () {

    return gulp.src('./src/server-arena/**/*.ts')
        .pipe(ts({
            "noImplicitAny": true,
            "suppressImplicitAnyIndexErrors": true,
            "lib": [
                "dom",
                "es6"
            ],
        }))
        .pipe( gulp.dest('./bin/server-arena') );

});

gulp.task( 'start-server-arena', function ( done ) {

    restartArenaServer();
    return done();

});

// RUN

gulp.task( 'run', gulp.series( 'resources', 'js', 'libs', 'brf', 'html', 'css', 'server-master', 'start-server-master', 'server-arena', 'start-server-arena' ));

// Watch

gulp.task( 'watch', function () {

    gulp.watch( './src/client/css/*', gulp.series( 'css' ) );
    gulp.watch( './src/client/resources/**/*', gulp.series( 'resources' ) );
    gulp.watch( './src/client/**/*.html', gulp.series( 'html' ) );
    gulp.watch( './src/client/scripts/**/*.js', gulp.series( 'js' ) );
    gulp.watch( './src/client/scripts/**/*.ts', gulp.series( 'brf' ) );
    gulp.watch( './src/client/libs/**/*', gulp.series( 'libs' ) );
    gulp.watch( './src/server-master/**/*', gulp.series( 'server-master', 'start-server-master' ) );
    gulp.watch( './src/server-arena/**/*', gulp.series( 'server-arena', 'start-server-arena' ) );

});

// Default

gulp.task( 'default', gulp.parallel( 'watch', 'run' ) );

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
