/*
 * @author: ohmed
 * DT PathFinder core
*/

Game.PathFinder = function () {

    this.workers = [];
    this.maxWorkers = 2;
    this.debug = true;

    this.init();

};

Game.PathFinder.prototype = {};

Game.PathFinder.prototype.init = function () {

    var worker;

    for ( var i = 0, il = this.maxWorkers; i < il; i ++ ) {

        worker = this.initWorker();
        this.workers.push( worker );

    }

};

Game.PathFinder.prototype.reset = function () {

    for ( var i = 0, il = this.workers.length; i < il; i ++ ) {

        this.workers[ i ].postMessage({ method: 'stop' });

    }

    this.workers = [];

    //

    this.init();

};

Game.PathFinder.prototype.initWorker = function ( param ) {

    var self = this;

    var worker = new Worker('js/pathFinder/WebWorker.js');

    worker.addEventListener( 'message', function ( event ) {

        var data = event.data;

        switch ( data.method ) {

            case 'findPath':

                var path = self.deCompressPath( data.path );

                worker.state = 'free';
                worker.callback( path, param );
                break;

            case 'free':

                worker.state = 'free';
                break;

        }

    }, false );

    worker.state = 'free';

    return worker;

};

Game.PathFinder.prototype.getFreeWorker = function () {

    for ( var i = 0, il = this.workers.length; i < il; i ++ ) {

        if ( this.workers[ i ].state === 'free' ) {

            return this.workers[ i ];

        }

    }

    return false;

};

Game.PathFinder.prototype.placeObject = function ( position1, position2 ) {

    for ( var i = 0, il = this.workers.length; i < il; i ++ ) {

        this.workers[ i ].postMessage({
            method:     'placeObject',
            position1:   position1,
            position2:   position2
        });

    }

};

Game.PathFinder.prototype.placeObjects = function ( params ) {

    for ( var i = 0, il = this.workers.length; i < il; i ++ ) {

        this.workers[ i ].postMessage({
            method:     'placeObjects',
            params:     params
        });

    }

};

Game.PathFinder.prototype.findPath = function ( start, end, callback ) {

    var worker = this.getFreeWorker();

    if ( ! worker ) {

        setTimeout( this.findPath.bind( this, start, end, callback ), 100 );
        return false;

    }

    worker.callback = function () {

        callback.apply( this, arguments );

    };

    start = { x: Math.round( start.x ), y: Math.round( start.y ), z: Math.round( start.z ) };
    end = { x: Math.round( end.x ), y: Math.round( end.y ), z: Math.round( end.z ) };

    worker.state = 'busy';

    worker.postMessage({
        method: 'findPath',
        start:  start,
        end:    end
    });

};

Game.PathFinder.prototype.constructMap = function () {

    for ( var i = 0, il = this.workers.length; i < il; i ++ ) {

        this.workers[ i ].postMessage({
            method:     'constructMap'
        });

    }

};

Game.PathFinder.prototype.deCompressPath = function ( keyPath ) {

    var path = [];
    var s, e;

    for ( var i = 1, il = keyPath.length; i < il; i ++ ) {

        if ( keyPath[ i - 1 ].x - keyPath[ i ].x === 0 ) {

            if ( keyPath[ i - 1 ].z - keyPath[ i ].z < 0 ) s2 = 1; else s2 = -1;

            for ( var k = keyPath[ i - 1 ].z; k != keyPath[ i ].z; k += s2 ) {

                path.push( { x: keyPath[ i - 1 ].x, y: 0 - 5, z: k } );

            }

            continue;

        }

        if ( Math.abs( keyPath[ i - 1 ].z - keyPath[ i ].z ) === 0 ) {

            if ( keyPath[ i - 1 ].x - keyPath[ i ].x < 0 ) s1 = 1; else s1 = -1;

            for ( var k = keyPath[ i - 1 ].x; k != keyPath[ i ].x; k += s1 ) {

                path.push( { x: k, y: 0 - 5, z: keyPath[ i - 1 ].z } );

            }

            continue;

        }

        if ( Math.abs( keyPath[ i - 1 ].z - keyPath[ i ].z ) === Math.abs( keyPath[ i - 1 ].x - keyPath[ i ].x ) ) {

            var s1, s2;

            if ( keyPath[ i - 1 ].x - keyPath[ i ].x < 0 ) s1 = 1; else s1 = -1;
            if ( keyPath[ i - 1 ].z - keyPath[ i ].z < 0 ) s2 = 1; else s2 = -1;

            var cord = [];

            for ( var k = keyPath[ i - 1 ].x; k != keyPath[ i ].x; k += s1 ) {

                cord.push( { x: k, y: 0 - 5, z: 0 } );

            }

            var p = 0;

            for ( var k = keyPath[ i - 1 ].z; k != keyPath[ i ].z; k += s2 ) {

                cord[ p ].z = k;
                p ++;

            }

            for ( var k = 0, kl = cord.length; k < kl; k ++ ) {

                path.push( cord[ k ] );

            }

            continue;

        }

    }

    var newPath = [];

    for ( var i = 0, il = path.length; i < il; i ++ ) {

        newPath.push( path[ i ].x );
        newPath.push( path[ i ].z );

    }

    return newPath;

};
