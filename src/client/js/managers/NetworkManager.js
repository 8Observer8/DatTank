/*
 * @author ohmed
 * DatTank networking
*/

Game.NetworkManager = function () {

};

Game.NetworkManager.prototype.init = function ( callback ) {

    // register network events

    this.registerEvent( 'ArenaJoinResponse', 'in', 'json', 1 );
    this.registerEvent( 'ArenaPlayerJoined', 'in', 'json', 2 );
    this.registerEvent( 'ArenaPlayerRespawn', 'in', 'json', 3 );
    this.registerEvent( 'ArenaPlayerRespawn', 'out', 'json', 4 );
    this.registerEvent( 'ArenaPlayerLeft', 'in', 'json', 6 );
    this.registerEvent( 'ArenaLeaderboardUpdate', 'in', 'json', 7 );

    //

    this.registerEvent( 'PlayersInRange', 'in', 'bin', 50 );
    this.registerEvent( 'TowersInRange', 'in', 'bin', 60 );
    this.registerEvent( 'BoxesInRange', 'in', 'bin', 70 );

    this.registerEvent( 'PlayerFriendlyFire', 'in', 'bin', 80 );

    this.registerEvent( 'PlayerNewLevel', 'in', 'bin', 90 );
    this.registerEvent( 'PlayerTankUpdateStats', 'out', 'bin', 91 );

    this.registerEvent( 'PlayerTankRotateTop', 'in', 'bin', 100 );
    this.registerEvent( 'PlayerTankRotateTop', 'out', 'bin', 101 );

    this.registerEvent( 'PlayerTankMove', 'in', 'bin', 111 );
    this.registerEvent( 'PlayerTankMove', 'out', 'bin', 112 );

    this.registerEvent( 'PlayerTankShoot', 'in', 'bin', 115 );
    this.registerEvent( 'PlayerTankShoot', 'out', 'bin', 116 );

    this.registerEvent( 'PlayerTankUpdateHealth', 'in', 'bin', 117 );
    this.registerEvent( 'PlayerTankUpdateAmmo', 'in', 'bin', 118 );

    //

    this.registerEvent( 'TowerRotateTop', 'in', 'bin', 200 );
    this.registerEvent( 'TowerShoot', 'in', 'bin', 201 );
    this.registerEvent( 'TowerChangeTeam', 'in', 'bin', 202 );
    this.registerEvent( 'TowerUpdateHealth', 'in', 'bin', 203 );

    //

    this.registerEvent( 'BulletHit', 'in', 'bin', 300 );
    this.registerEvent( 'BoxRemove', 'in', 'bin', 301 );

};

Game.NetworkManager.prototype.send = function ( eventName, data, view ) {

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

Game.NetworkManager.prototype.triggerMessageListener = function ( eventId, data ) {

    if ( ! this.events.in[ eventId ] ) {

        console.warn( '[NETWORK] Event with ID:' + eventId + ' not found.' );
        return;

    }

    //

    var eventName = this.events.in[ eventId ].name;
    var eventType = this.events.in[ eventId ].dataType;
    var listeners = this.messageListeners[ eventName ] || [];

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
