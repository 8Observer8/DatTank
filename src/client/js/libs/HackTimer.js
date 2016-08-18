/*
 * @author ohmed
 * utils for Interval/Timer work in browser background without pausing
 */

(function ( namespace ) {

    try {

        var blob = new Blob(["\
            var fakeIdToId = {};\
            onmessage = function ( event ) {\
                var data = event.data,\
                name = data.name,\
                fakeId = data.fakeId,\
                time;\
                if( data.hasOwnProperty('time') ) {\
                    time = data.time;\
                }\
                switch ( name ) {\
                    case 'setInterval':\
                        fakeIdToId[ fakeId ] = setInterval( function () {\
                            postMessage({ fakeId: fakeId });\
                        }, time);\
                        break;\
                    case 'clearInterval':\
                        if ( fakeIdToId.hasOwnProperty( fakeId ) ) {\
                            clearInterval( fakeIdToId[ fakeId ] );\
                            delete fakeIdToId[ fakeId ];\
                        }\
                        break;\
                    case 'setTimeout':\
                        fakeIdToId[ fakeId ] = setTimeout( function () {\
                            postMessage({ fakeId: fakeId });\
                            if ( fakeIdToId.hasOwnProperty( fakeId ) ) {\
                                delete fakeIdToId[ fakeId ];\
                            }\
                        }, time);\
                        break;\
                    case 'clearTimeout':\
                        if ( fakeIdToId.hasOwnProperty( fakeId ) ) {\
                            clearTimeout( fakeIdToId[ fakeId ] );\
                            delete fakeIdToId[ fakeId ];\
                        }\
                        break;\
                }\
            }\
        "]);

        // Obtain a blob URL reference to our worker 'file'.
        workerScript = window.URL.createObjectURL( blob );

    } catch ( error ) {

        return NWE.Logger.log( 'Blob not supported :(' + error );

    }

    var worker;
    var fakeIdToCallback = {};
    var lastFakeId = 0;
    var maxFakeId = 0x7FFFFFFF; // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer

    if ( typeof ( Worker ) !== 'undefined' ) {

        function getFakeId () {

            while ( fakeIdToCallback.hasOwnProperty( lastFakeId ) ) {

                if ( lastFakeId === maxFakeId ) {

                    lastFakeId = 0;

                } else {

                    lastFakeId ++;

                }

            }

            return lastFakeId;

        };

        try {

            worker = new Worker( workerScript );

            namespace.setInterval = function ( callback, time ) {

                var fakeId = getFakeId ();

                fakeIdToCallback[ fakeId ] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call( arguments, 2 )
                };

                worker.postMessage ({
                    name: 'setInterval',
                    fakeId: fakeId,
                    time: time
                });

                return fakeId;

            };

            namespace.clearInterval = function ( fakeId ) {

                if ( fakeIdToCallback.hasOwnProperty( fakeId ) ) {

                    delete fakeIdToCallback[ fakeId ];
                    worker.postMessage ({
                        name: 'clearInterval',
                        fakeId: fakeId
                    });

                }

            };

            namespace.setTimeout = function ( callback, time ) {

                var fakeId = getFakeId();

                fakeIdToCallback[ fakeId ] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call( arguments, 2 ),
                    isTimeout: true
                };

                worker.postMessage ({
                    name: 'setTimeout',
                    fakeId: fakeId,
                    time: time
                });

                return fakeId;

            };

            namespace.clearTimeout = function ( fakeId ) {

                if ( fakeIdToCallback.hasOwnProperty( fakeId ) ) {

                    delete fakeIdToCallback[ fakeId ];
                    worker.postMessage ({
                        name: 'clearTimeout',
                        fakeId: fakeId
                    });

                }

            };

            worker.onmessage = function ( event ) {

                var data = event.data;
                var fakeId = data.fakeId;
                var request;
                var parameters;
                var callback;

                if ( fakeIdToCallback.hasOwnProperty( fakeId ) ) {

                    request = fakeIdToCallback[ fakeId ];
                    callback = request.callback;
                    parameters = request.parameters;

                    if ( request.hasOwnProperty( 'isTimeout' ) && request.isTimeout ) {

                        delete fakeIdToCallback[ fakeId ];

                    }

                }

                if ( callback ) callback.apply( window, parameters );

            };

            worker.onerror = function ( event ) {

                console.log( event );

            };

            console.log ( 'Initialisation succeeded' );

        } catch ( error )  {

            console.log( 'Initialisation failed' );
            console.error( error );

        }

    } else {

        return console.log( 'Initialisation failed - HTML5 Web Worker is not supported' );

    }

}) ( window );
