/*
 * @author ohmed
 * DatTank networking
*/

DT.Network = function () {

    this.connected = 0;
    this.transport = false;
    this.tryToReconnect = false;

    this.initCallback = false;

};

DT.Network.prototype = {};

DT.Network.prototype.init = function ( callback ) {

    this.initCallback = callback;

    if ( this.transport ) {

        console.error( '[NETWORK] Connection already established.' );
        return;

    }

    //

    this.transport = new WebSocket( 'ws://' + window.location.host.split(':')[0] + ':8085/ws/game' );
    this.transport.binaryType = 'arraybuffer';

    //

    this.transport.addEventListener( 'open', this.connect.bind( this ) );
    this.transport.addEventListener( 'close', this.disconnected.bind( this ) );
    this.transport.addEventListener( 'error', this.error.bind( this ) );
    this.transport.addEventListener( 'message', this.message.bind( this ) );

};

DT.Network.prototype.connect = function () {

    this.connected = 1;

    if ( this.tryToReconnect ) {

        this.reconnect();
        return;

    }

    //

    this.initCallback();

    console.log( '[NETWORK] Connected to server.' );

};

DT.Network.prototype.reconnect = function () {

    var scope = this;

    this.tryToReconnect = false;
    setTimeout( scope.send.bind( scope, 'reconnect', { arena: DT.arena.id, id: DT.arena.me.id }), 10 );

    //

    console.log( '[NETWORK] Reconnected to server.' );

};

DT.Network.prototype.message = function ( event ) {

    var data = event.data;
    var event = false;

    if ( typeof data === 'string' ) {

        parseStringMessage( data );

    } else {

        parseBinMessage( data );

    }

    //

    function parseStringMessage ( message ) {

        message = JSON.parse( message );
        data = message.data;
        event = message.event;

        switch ( event ) {

            case 'joinArena':

                core.joinArena( data );
                break;

            case 'playerJoined':

                var player = new DT.Player( DT.arena, data );
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

            case 'addBox':

                DT.arena.boxManager.addBox( data );
                break;

            case 'pickedBox':

                DT.arena.boxManager.removeBox( data.id );
                break;

            case 'gotBox':

                DT.arena.me.gotBox( data.box, data.value );
                break;

            case 'TowerRotateTop':

                console.log( data );
                break;

            default:

                console.error( '[NETWORK:GOT_MESSAGE] Unknown event occurred.' );
                break;

        }

    };

    function parseBinMessage ( data ) {

        var event = new Uint16Array( data, 0, 2 )[0];
        var data = new Uint16Array( data, 2 );

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

                    console.warn( '[Network:SHOOT] Player not fond in list.' );
                    return;

                }

                player.shoot( data[ 1 ], data[ 2 ] );
                break;

            case 4:     // hit

                var targetId = data[0];

                if ( targetId < 10000 ) {

                    var player = DT.arena.getPlayerById( targetId );

                    if ( ! player ) {

                        console.warn( '[Network:HIT] Player not fond in list.' );
                        return;

                    }

                    player.updateHealth( data[1] );

                } else {

                    targetId -= 10000;

                    var tower = DT.arena.getTowerById( targetId );
                    tower.updateHealth( data[1] );

                }

                break;

            case 5:     // die

                var playerId = data[0];
                var killerId = data[1];

                var player = DT.arena.getPlayerById( playerId );
                var killer;

                if ( killerId < 10000 ) {

                    killer = DT.arena.getPlayerById( killerId );

                } else {

                    killer = DT.arena.getTowerById( killerId - 10000 );

                }

                if ( ! player ) {

                    console.warn( '[Network:DIE] Player not fond in list.' );
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

            case 200:

                var towerId = data[0];
                var tower = DT.arena.getTowerById( towerId );
                tower.rotateTop( data[1] / 100 );
                break;

            case 210:

                var towerId = data[0];
                var shootId = data[1];
                var tower = DT.arena.getTowerById( towerId );

                if ( ! tower ) {

                    console.warn( '[Network:TowerShoot] Tower not fond in list.' );
                    return;

                }

                tower.shoot( shootId ).onHit( function ( target ) {

                    if ( tower.team === 1000 || tower.team.id !== target.owner.team.id ) {

                        var buffer = new ArrayBuffer( 8 );
                        var bufferView = new Uint16Array( buffer );

                        bufferView[ 1 ] = target.owner.id;
                        bufferView[ 2 ] = shootId;
                        bufferView[ 3 ] = 10000 + towerId;

                        network.send( 'hit', buffer, bufferView );

                    }

                });

                break;

            case 400:

                var towerId = data[0];
                var teamId = data[1];
                var tower = DT.arena.getTowerById( towerId );
                var team = DT.arena.getTeamById( teamId );

                if ( ! tower ) {

                    console.warn( '[Network:TowerChangeTeam] Tower not fond in list.' );
                    return;

                }

                if ( ! team ) {

                    console.warn( '[Network:TowerChangeTeam] Team not fond in list.' );
                    return;

                }

                tower.changeTeam( team );

                break;

            default:

                console.error( '[NETWORK:GOT_MESSAGE] Unknown event "' + event + '" occurred.' );
                break;

        }

    };

};

DT.Network.prototype.disconnected = function () {

    this.connected = 0;
    this.transport = false;
    this.tryToReconnect = true;

    this.init();

    //

    console.log( '[NETWORK] Connection closed.' );

};

DT.Network.prototype.error = function ( err ) {

    console.error( '[NETWORK] Connection error: ', err );

};

DT.Network.prototype.send = function ( event, data, view ) {

    if ( ! this.transport ) {

        console.error( '[NETWORK:SEND_MESSAGE] No network socket connection.' );
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

            case 'PlayerTankRotateBase':

                view[0] = 100;
                break;

            case 'PlayerTankMove':

                view[0] = 101;
                break;

            default:

                console.error( '[NETWORK:SEND_MESSAGE] Unknown event "' + event + '" occurred.' );
                break;

        }

        this.transport.send( data );

    } else {

        data.event = event;
        this.transport.send( JSON.stringify( data ) );

    }

    return true;

};
