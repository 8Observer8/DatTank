/*
 * @author ohmed
 * DatTank networking
*/

Game.NetworkManager = function () {

    this.connected = false;
    this.transport = false;

    this.initCallback = false;

};

Game.NetworkManager.prototype = {};

Game.NetworkManager.prototype.init = function ( callback ) {

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

Game.NetworkManager.prototype.connect = function () {

    this.connected = true;
    this.initCallback();

    //

    console.log( '[NETWORK] Connected to server.' );

};

Game.NetworkManager.prototype.reconnect = function () {

    // todo

};

Game.NetworkManager.prototype.message = function ( event ) {

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
        var arena = Game.arena;

        switch ( event ) {

            case 'joinArena':

                game.joinArena( data );
                break;

            case 'playerJoined':

                if ( ! arena ) return;
                var player = new Game.Player( arena, data );
                arena.playerManager.add( player );
                break;

            case 'respawn':

                var player = arena.playerManager.getById( data.player.id );

                if ( ! player ) {

                    console.warn( '[Network:MOVE] Player not fond in list.' );
                    return;

                }

                player.respawn( true, data.player );

                break;

            case 'playerLeft':

                if ( arena.playerManager.getById( data.id ) ) {

                    arena.playerManager.remove( arena.playerManager.getById( data.id ) );

                }

                ui.updateLeaderboard( arena.playerManager.players, arena.me );
                break;

            case 'addBox':

                arena.boxManager.add( data );
                break;

            case 'pickedBox':

                arena.boxManager.remove( data.id );
                break;

            case 'gotBox':

                arena.me.gotBox( data.box, data.value );
                break;

            default:

                console.error( '[NETWORK:GOT_MESSAGE] Unknown event occurred.' );
                break;

        }

    };

    function parseBinMessage ( data ) {

        var event = new Uint16Array( data, 0, 2 )[0];
        var data = new Int16Array( data, 2 );
        var arena = Game.arena;

        switch ( event ) {

            case 1:     // rotateTop

                var playerId = data[0];
                var topAngle = data[1] / 1000;

                var player = arena.playerManager.getById( playerId );

                if ( ! player ) {

                    console.warn( '[Network:MOVE] Player not fond in list.' );
                    return;

                }

                player.rotateTop( topAngle );

                break;

            case 2:     // move

                var playerId = data[0];
                var path = [];

                for ( var i = 1, il = data.length; i < il; i ++ ) {

                    path.push( data[ i ] - 2000 );

                }

                var player = arena.playerManager.getById( playerId );

                if ( ! player ) {

                    console.warn( '[Network:MOVE] Player not fond in list.' );
                    return;

                }

                player.processPath( path );
                break;

            case 3:     // shoot

                var playerId = data[0];
                var player = arena.playerManager.getById( playerId );

                if ( ! player ) {

                    console.warn( '[Network:SHOOT] Player not fond in list.' );
                    return;

                }

                player.shoot( data[ 1 ], data[ 2 ] );
                break;

            case 4:     // hit

                var targetId = data[0];

                if ( targetId < 10000 ) {

                    var player = arena.playerManager.getById( targetId );

                    if ( ! player ) {

                        console.warn( '[Network:HIT] Player not fond in list.' );
                        return;

                    }

                    player.updateHealth( data[1] );

                } else {

                    targetId -= 10000;

                    var tower = arena.towerManager.getById( targetId );
                    tower.updateHealth( data[1] );

                }

                break;

            case 5:     // die

                var playerId = data[0];
                var killerId = data[1];

                var player = arena.playerManager.getById( playerId );
                var killer;

                if ( killerId < 10000 ) {

                    killer = arena.playerManager.getById( killerId );

                } else {

                    killer = arena.towerManager.getById( killerId - 10000 );

                }

                if ( ! player ) {

                    console.warn( '[Network:DIE] Player not fond in list.' );
                    return;

                }

                player.die( killer );
                break;

            case 100:

                var playerId = data[0];

                var player = arena.playerManager.getById( playerId );
                if ( ! player ) return;

                var path = [];
                for ( var i = 0, il = data.length / 2 - 2; i < il; i ++ ) {

                    path.push({ x: data[ 1 + 2 * i + 0 ], y: 0, z: data[ 1 + 2 * i + 1 ] });

                }

                player.moveByPath( path, { x: data[ data.length - 2 ], y: 0, z: data[ data.length - 1 ] } );
                break;

            case 200:

                var towerId = data[0];
                var tower = arena.towerManager.getById( towerId );
                tower.rotateTop( data[1] / 1000 );
                break;

            case 210:

                var towerId = data[0];
                var shootId = data[1];
                var tower = arena.towerManager.getById( towerId );

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
                var tower = arena.towerManager.getById( towerId );
                var team = arena.teamManager.getById( teamId );

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

Game.NetworkManager.prototype.disconnected = function () {

    this.connected = false;
    this.transport = false;

    this.init();

    //

    console.log( '[NETWORK] Connection closed.' );

};

Game.NetworkManager.prototype.error = function ( err ) {

    // todo: handle error

    //

    console.error( '[NETWORK] Connection error: ', err );

};

Game.NetworkManager.prototype.send = function ( event, data, view ) {

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

            case 'PlayerTankMoveToPoint':

                view[0] = 102;
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

Game.NetworkManager.events = {
    in:     {},
    out:    {}
};
