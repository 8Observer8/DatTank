/*
 * @author ohmed
 * DatTank networking
*/

'use strict';

DT.Network = function () {

    var scope = this;

    this.connected = 0;

    this.transport = false;
    var reconnect = false;

    this.init = function () {

        if ( this.transport ) {

            return;

        }

        //

        this.transport = eio.Socket( DT.socketHost );
        this.transport.binaryType = 'blob';

        //

        this.transport.on( 'open', function () {

            scope.connected = 1;

            if ( reconnect ) {

                reconnect = false;
                setTimeout( scope.send.bind( scope, 'reconnect', { arena: DT.arena.id, id: DT.arena.me.id }), 10 );
                console.log( 'reconnected' );
                return;

            }

            console.log( 'Connected to server.' );

        });

        this.transport.on( 'close', function ( param ) {

            console.log('Network closed.');

            scope.connected = 0;

            scope.transport = false;
            reconnect = true;

            scope.init();

        });        

        this.transport.on( 'error', function ( param ) {

            if ( param.gameplay ) {

                // todo

            }

            if ( param.system ) {

                // todo

            }

        });

        this.transport.on( 'message', function ( param ) {

            var data = false;
            var event = false;

            if ( typeof param === 'string' ) {
            
                param = JSON.parse( param );
                data = param.data;
                event = param.event;

                switch ( event ) {

                    case 'joinArena':

                        core.joinArena( data );
                        break;

                    case 'playerJoined':

                        var player = new DT.Player( false, data );
                        DT.arena.addPlayer( player );
                        break;

                    case 'respawn':

                        var player = DT.arena.getPlayerById( data.player.id );

                        if ( ! player ) {

                            console.warn( '[Network:MOVE] Player not fond in list.' );
                            return;

                        }

                        player.respawn( true, data.player );

                        break;

                    case 'resetArena':

                        DT.arena.clear();
                        ui.showWinners( data.winnerTeam );
                        break;

                    case 'playerLeft':

                        if ( DT.arena.getPlayerById( data.id ) ) {

                            DT.arena.removePlayer( DT.arena.getPlayerById( data.id ) );

                        }

                        ui.updateLeaderboard( DT.arena.players, DT.arena.me );
                        break;

                    default:

                        // nothing here
                        break;

                }

            } else {

                var arrayBuffer;
                var fileReader = new FileReader();

                fileReader.onload = function() {

                    var event = new Uint16Array( this.result, 0, 2 )[0];
                    var data = new Uint16Array( this.result, 2 );

                    switch ( event ) {

                        case 1:     // rotateTop

                            var playerId = data[0];
                            var topAngle = data[1] / 100;

                            var player = DT.arena.getPlayerById( playerId );

                            if ( ! player ) {

                                console.warn( '[Network:MOVE] Player not fond in list.' );
                                return;

                            }

                            player.rotateTop( topAngle, true );

                            break;

                        case 2:     // move

                            var playerId = data[0];
                            var path = [];

                            for ( var i = 1, il = data.length; i < il; i ++ ) {

                                path.push( data[ i ] - 2000 );

                            }

                            var player = DT.arena.getPlayerById( playerId );

                            if ( ! player ) {

                                console.warn( '[Network:MOVE] Player not fond in list.' );
                                return;

                            }

                            player.processPath( path );
                            break;

                        case 3:     // shoot

                            var playerId = data[0];
                            var player = DT.arena.getPlayerById( playerId );

                            if ( ! player ) {

                                console.warn( '[Network:MOVE] Player not fond in list.' );
                                return;

                            }

                            player.shoot( data[ 1 ] );
                            break;

                        case 4:     // hit

                            var playerId = data[0];
                            var player = DT.arena.getPlayerById( playerId );

                            if ( ! player ) {

                                console.warn( '[Network:MOVE] Player not fond in list.' );
                                return;

                            }

                            player.health = data[1];
                            player.hit();
                            break;

                        case 5:     // die

                            var playerId = data[0];
                            var killerId = data[1];

                            var player = DT.arena.getPlayerById( playerId );
                            var killer = DT.arena.getPlayerById( killerId );

                            if ( ! player || ! killer ) {

                                console.warn( '[Network:MOVE] Player not fond in list.' );
                                return;

                            }

                            player.die( killer );
                            break;

                        case 100:

                            var playerId = data[0];

                            var player = DT.arena.getPlayerById( playerId );
                            if ( ! player ) return;

                            player.move( new THREE.Vector3( data[1] - 1000, 0, data[2] - 1000 ), true );
                            break;

                        default:

                            // nothing here
                            break;

                    }
                
                };

                fileReader.readAsArrayBuffer( param );

            }

        });

    };

};

DT.Network.prototype = {};

DT.Network.prototype.send = function ( event, data, view ) {

    if ( ! this.transport ) {

        console.error( 'No network socket connection.' );
        return false;

    }

    if ( data instanceof ArrayBuffer || data === undefined ) {

        if ( ! data ) {

            data = new ArrayBuffer( 2 );
            view = new Uint16Array( data );

        }

        switch ( event ) {

            case 'rotateTop':

                view[0] = 1;
                break;

            case 'move':

                view[0] = 2;
                break;

            case 'shoot':

                view[0] = 3;
                break;

            case 'hit':

                view[0] = 4;
                break;

            case 'die':

                view[0] = 5;
                break;

            case 'respawn':

                view[0] = 6;
                break;

            case 'move1':

                view[0] = 7;
                break;

            default:

                // nothing here
                break;

        }

        this.transport.send( data );

    } else {

        data.event = event;
        this.transport.send( JSON.stringify( data ) );

    }

    return true;

};
