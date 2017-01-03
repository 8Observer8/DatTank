/*
 * @author ohmed
 * DatTank networking
*/

Game.NetworkManager = function () {

    this.connected = false;
    this.transport = false;
    this.messageListeners = {};

    this.initCallback = false;

};

Game.NetworkManager.prototype = {};

Game.NetworkManager.prototype.init = function ( callback ) {

    // register network events

    this.registerEvent( 'ArenaJoinRequest', 'out', 'json', 0 );
    this.registerEvent( 'ArenaJoinResponce', 'in', 'json', 1 );

    this.registerEvent( 'TankRotateTop', 'in', 'bin', 100 );
    this.registerEvent( 'TankRotateTop', 'out', 'bin', 101 );

    //

    this.initCallback = callback;

    if ( this.transport ) {

        console.error( '[NETWORK] Connection already established.' );
        return;

    }

    // establish connection

    this.transport = new WebSocket( 'ws://' + window.location.host.split(':')[0] + ':8085/ws/game' );
    this.transport.binaryType = 'arraybuffer';

    // add event handlers

    this.transport.addEventListener( 'open', this.onConnect.bind( this ) );
    this.transport.addEventListener( 'close', this.onDisconnected.bind( this ) );
    this.transport.addEventListener( 'error', this.onError.bind( this ) );
    this.transport.addEventListener( 'message', this.onMessage.bind( this ) );

};

Game.NetworkManager.prototype.onConnect = function () {

    this.connected = true;
    this.initCallback();

    //

    console.log( '[NETWORK] Connected to server.' );

};

Game.NetworkManager.prototype.onMessage = function ( event ) {

    var eventId = new Int16Array( event.data, 0, 1 )[ 0 ];
    var content = new Int16Array( event.data, 2 );

    this.triggerMessageListener( eventId, content );

    // function parseStringMessage ( message ) {

    //     switch ( event ) {

    //         case 'playerJoined':

    //             if ( ! arena ) return;
    //             var player = new Game.Player( arena, data );
    //             arena.playerManager.add( player );
    //             break;

    //         case 'respawn':

    //             var player = arena.playerManager.getById( data.player.id );

    //             if ( ! player ) {

    //                 console.warn( '[Network:MOVE] Player not fond in list.' );
    //                 return;

    //             }

    //             player.respawn( true, data.player );

    //             break;

    //         case 'playerLeft':

    //             if ( arena.playerManager.getById( data.id ) ) {

    //                 arena.playerManager.remove( arena.playerManager.getById( data.id ) );

    //             }

    //             ui.updateLeaderboard( arena.playerManager.players, arena.me );
    //             break;

    //         case 'addBox':

    //             arena.boxManager.add( data );
    //             break;

    //         case 'pickedBox':

    //             arena.boxManager.remove( data.id );
    //             break;

    //         case 'gotBox':

    //             arena.me.gotBox( data.box, data.value );
    //             break;

    //     }

    // };

    // function parseBinMessage ( data ) {

    //     switch ( event ) {

    //         case 2:     // move

    //             var playerId = data[0];
    //             var path = [];

    //             for ( var i = 1, il = data.length; i < il; i ++ ) {

    //                 path.push( data[ i ] - 2000 );

    //             }

    //             var player = arena.playerManager.getById( playerId );

    //             if ( ! player ) {

    //                 console.warn( '[Network:MOVE] Player not fond in list.' );
    //                 return;

    //             }

    //             player.processPath( path );
    //             break;

    //         case 3:     // shoot

    //             var playerId = data[0];
    //             var player = arena.playerManager.getById( playerId );

    //             if ( ! player ) {

    //                 console.warn( '[Network:SHOOT] Player not fond in list.' );
    //                 return;

    //             }

    //             player.shoot( data[ 1 ], data[ 2 ] );
    //             break;

    //         case 4:     // hit

    //             var targetId = data[0];

    //             if ( targetId < 10000 ) {

    //                 var player = arena.playerManager.getById( targetId );

    //                 if ( ! player ) {

    //                     console.warn( '[Network:HIT] Player not fond in list.' );
    //                     return;

    //                 }

    //                 player.updateHealth( data[1] );

    //             } else {

    //                 targetId -= 10000;

    //                 var tower = arena.towerManager.getById( targetId );
    //                 tower.updateHealth( data[1] );

    //             }

    //             break;

    //         case 5:     // die

    //             var playerId = data[0];
    //             var killerId = data[1];

    //             var player = arena.playerManager.getById( playerId );
    //             var killer;

    //             if ( killerId < 10000 ) {

    //                 killer = arena.playerManager.getById( killerId );

    //             } else {

    //                 killer = arena.towerManager.getById( killerId - 10000 );

    //             }

    //             if ( ! player ) {

    //                 console.warn( '[Network:DIE] Player not fond in list.' );
    //                 return;

    //             }

    //             player.die( killer );
    //             break;

    //         case 100:

    //             var playerId = data[0];

    //             var player = arena.playerManager.getById( playerId );
    //             if ( ! player ) return;

    //             var path = [];
    //             for ( var i = 0, il = data.length / 2 - 2; i < il; i ++ ) {

    //                 path.push({ x: data[ 1 + 2 * i + 0 ], y: 0, z: data[ 1 + 2 * i + 1 ] });

    //             }

    //             player.moveByPath( path, { x: data[ data.length - 2 ], y: 0, z: data[ data.length - 1 ] } );
    //             break;

    //         case 200:

    //             var towerId = data[0];
    //             var tower = arena.towerManager.getById( towerId );
    //             tower.rotateTop( data[1] / 1000 );
    //             break;

    //         case 210:

    //             var towerId = data[0];
    //             var shootId = data[1];
    //             var tower = arena.towerManager.getById( towerId );

    //             if ( ! tower ) {

    //                 console.warn( '[Network:TowerShoot] Tower not fond in list.' );
    //                 return;

    //             }

    //             tower.shoot( shootId ).onHit( function ( target ) {

    //                 if ( tower.team === 1000 || tower.team.id !== target.owner.team.id ) {

    //                     var buffer = new ArrayBuffer( 8 );
    //                     var bufferView = new Uint16Array( buffer );

    //                     bufferView[ 1 ] = target.owner.id;
    //                     bufferView[ 2 ] = shootId;
    //                     bufferView[ 3 ] = 10000 + towerId;

    //                     network.send( 'hit', buffer, bufferView );

    //                 }

    //             });

    //             break;

    //         case 400:

    //             var towerId = data[0];
    //             var teamId = data[1];
    //             var tower = arena.towerManager.getById( towerId );
    //             var team = arena.teamManager.getById( teamId );

    //             if ( ! tower ) {

    //                 console.warn( '[Network:TowerChangeTeam] Tower not fond in list.' );
    //                 return;

    //             }

    //             if ( ! team ) {

    //                 console.warn( '[Network:TowerChangeTeam] Team not fond in list.' );
    //                 return;

    //             }

    //             tower.changeTeam( team );

    //             break;

    //     }

    // };

};

Game.NetworkManager.prototype.onDisconnected = function () {

    this.connected = false;
    this.transport = false;

    this.init();

    //

    console.log( '[NETWORK] Connection closed.' );

};

Game.NetworkManager.prototype.onError = function ( err ) {

    // todo: handle error

    //

    console.error( '[NETWORK] Connection error: ', err );

};

Game.NetworkManager.prototype.send = function ( eventName, data, view ) {

    if ( ! this.transport ) {

        console.error( '[NETWORK:SEND_MESSAGE] No network socket connection.' );
        return false;

    }

    if ( ! this.events.out[ eventName ] ) {

        console.error( '[NETWORK:SEND_MESSAGE] No event "' + eventName + '" registered.' );
        return false;

    }

    if ( ! data ) {

        data = JSON.stringify( view );
        data = TextEncoder.encode( data );

        var newData = new Uint16Array( data.length + 1 );

        for ( var i = 0, il = data.length; i < il; i ++ ) {

            newData[ i + 1 ] = data[ i ];

        }

        data = newData;
        data[0] = this.events.out[ eventName ].id;

    } else {

        view[0] = this.events.out[ eventName ].id;

    }

    this.transport.send( data, { binary: true, mask: true } );

};

Game.NetworkManager.prototype.addMessageListener = function ( eventName, callback ) {

    this.messageListeners[ eventName ] = this.messageListeners[ eventName ] || [];
    this.messageListeners[ eventName ].push( callback );

};

Game.NetworkManager.prototype.triggerMessageListener = function ( eventId, data ) {

    if ( ! this.events.in[ eventId ] ) {

        console.warn( '[NETWORK] Event with ID:' + eventId + ' not found.' );
        return;

    }

    //

    var eventName = this.events.in[ eventId ].name;
    var eventType = this.events.in[ eventId ].dataType;
    var listeners = this.messageListeners[ eventName ] || [];
    var content;

    if ( eventType === 'json' ) {

        data = new Uint16Array( data, 2 );
        data = TextEncoder.decode( data );
        data = JSON.parse( data );

    } else {

        data = new Int16Array( data, 2 );

    }

    for ( var i = 0, il = listeners.length; i < il; i ++ ) {

        if ( listeners[ i ] ) {

            listeners[ i ]( data, eventName );

        }

    }

};

Game.NetworkManager.prototype.registerEvent = function ( eventName, ioType, dataType, eventId ) {

    if ( ! this.events[ ioType ] ) {

        console.error( 'Wrong event IO type.' );
        return;

    }

    if ( ioType === 'out' ) {

        this.events.out[ eventName ] = {
            id:         eventId,
            name:       eventName,
            dataType:   dataType
        };

    } else {

        this.events.in[ eventId ] = {
            id:         eventId,
            name:       eventName,
            dataType:   dataType
        };

    }

};

Game.NetworkManager.prototype.events = {
    in:     {},
    out:    {}
};
