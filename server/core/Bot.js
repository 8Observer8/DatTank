/*
 * @author ohmed
 * DatTank Bot object
*/

var Bot = function ( arena ) {

    this.player = false;
    this.arena = arena;

    var logins = [ 'putin', 'hehe', 'terrorist', 'mahno', 'kurva', 'romko', 'skuzi', 'suzuki', 'human', 'myron', 'horror', 'tank', 'dat-tank', 'ok', 'test', 'zuzu', '0_0', 'o_0', 'fish' ];

    this.login = logins[ Math.floor( logins.length * Math.random() ) ];

    //

    this.init();

};

Bot.prototype = {};

Bot.prototype.init = function () {

    this.player = new DT.Player({ login: this.login });
    this.arena.addPlayer( this.player );

    this.updateInterval = setInterval( this.update.bind( this ), 100 );

};

Bot.prototype.update = (function () {

    var moveBuffer = new ArrayBuffer( 6 );
    var moveBufferView = new Uint16Array( moveBuffer );

    return function () {

        var isMove = Math.random();

        if ( this.player.health <= 0 ) return;

        //

        if ( isMove < 0.02 ) {

            var x = Math.floor( 2000 * Math.random() );
            var z = Math.floor( 2000 * Math.random() );

            moveBufferView[ 1 ] = this.player.id;
            moveBufferView[ 2 ] = x;
            moveBufferView[ 3 ] = z;

            DT.Network.announce( this.arena.room, 'moveBot', moveBuffer, moveBufferView );
            return;

        }

        //

        var target = false;
        var minDist = 100000;

        for ( var i = 0, il = this.arena.players.length; i < il; i ++ ) {

            var player = this.arena.players[ i ];

            if ( player.team === this.player.team ) continue;

            var distance = Math.sqrt( Math.pow( player.position[0] - this.player.position[0], 2 ) + Math.pow( player.position[2] - this.player.position[2], 2 ) );

            if ( distance < minDist ) {

                minDist = distance;
                target = player;

            }

        }

        if ( target && minDist < 200 ) {

            var angle = Math.atan2( target.position[0] - this.player.position[0], target.position[2] - this.player.position[2] ) - Math.PI / 2;
            this.player.rotateTop({ topAngle: formatAngle( angle - this.player.rotation ), baseAngle: this.player.rotation });

            if ( Math.random() < 0.3 ) {

                this.player.shoot();

            }

        }

    };

}) ();

Bot.prototype.dispose = function () {

    clearInterval( this.updateInterval );

};

var formatAngle = function ( a ) {

    a = a % ( 2 * Math.PI );

    if ( a < 0 ) {

        a += 2 * Math.PI;

    }

    return a;

};

//

module.exports = Bot;
