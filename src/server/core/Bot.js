/*
 * @author ohmed
 * DatTank Bot object
*/

var Bot = function ( arena ) {

    this.player = false;
    this.arena = arena;
    this.login = false;

    var logins = [ '¥Rebook¥', 'BratoK', 'Terrorist', 'Mahno', 'Skuzi', 'Suzuki', 'Myron', 'horror', 'zuzu', 'o_0', 'HEqpOPMaJI', 'X_A_M', 
    'Vadic', '@did@s', 'Alliance', 'TRAKTORIST', 'MaJoR$', 'DeRJkiY', ']{olyan@', 'kaban', 'Semkiv', 'Agent', 'CJIeCaPb', 'Delros', 
    'T0rM@Z', 'MAKAROV', 'T0rM@Z', 'Adas', 'bandit', 'Chetkii', 'Artuomchik', 'buben', 'DonKarleone', 'accura2k_', 'GOPNIK', 
    'KabaniyKlyk', 'Kermit', 'KoLяN4Uk', 'KraCaV4nK', 'limon4ello', 'master_of_ceremony', 'Mr_Zaza', 'Biwen', 'ne_zli', 'NURCHIK',
    'StrannicK', 'Tîgrrr', 'Timent', 'Vision', 'X_A_M_E_P', 'Marckiz', 'bigman', 'creed', 'DarkFantastik', 'SlowPok', 'NaGiBatoR',
    'Mam_ya_ebashy', 'LLI_K_O_JI_b_H_U_K', 'FRESH_MEAT', 'LegendarY', 'Rabbit_wolf', 'iJseven', 'Ha_KoJleHu_OJleHu', 'Vertyxan',
    'x_Evil_x', 'cTaTucT_kycToDpoT', 'TaNkIsT228', 'LaRDeN', 'EHOT', 'CruzTanks', 'Mazay_Ded', 'Dark_Foch', 'FL1pSTaR', 'SkyDog',
    'Nevrox', 'AWAJA', 'GrizeR', 'Jove_V_KyStax', 'Zybinjo', 'Pro1004EloVe4Ek', 'Ben_Laden', 'DeLviR', 'SkyLiTeR', '_fly_', '4ypa-4yps' 
    ]; 

    while ( this.login === false ) {

        this.login = logins[ Math.floor( logins.length * Math.random() ) ];

        for ( var i = 0; i < this.arena.botManager.bots.length; i ++ ) {

            if ( this.login === this.arena.botManager.bots[ i ].login ) {

                this.login = false;

            } 

        } 

    }

    this.init();

};

Bot.prototype = {};

Bot.prototype.init = function () {

    var tank = ( Math.random() < 0.5 ) ? 'USAT54' : 'UKBlackPrince';
    this.player = new Game.Player( this.arena, { login: this.login, tank: tank, socket: false });
    this.player.ammo = 10000000;
    this.arena.addPlayer( this.player );

    this.player.bot = this;

    this.updateInterval = setInterval( this.update.bind( this ), 40 );

};

Bot.prototype.update = function () {

    var isMove = Math.random();

    if ( this.removed ) {

        this.dispose();
        return;

    }

    if ( this.player.status !== Game.Player.Alive ) return;

    //

    if ( isMove < 0.2 && this.player.movePath === false ) {

        var x = Math.floor( 2200 * ( Math.random() - 0.5 ) );
        var z = Math.floor( 2200 * ( Math.random() - 0.5 ) );
        this.player.moveToPoint({ x: x, y: 0, z: z });

    }

    //

    var target = false;
    var minDist = 1000;
    var players = this.arena.playerManager.players;
    var towers = this.arena.towerManager.towers;

    // search for Player target

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        var player = players[ i ];

        if ( player.team === this.player.team ) continue;

        var distance = Math.sqrt( Math.pow( player.position.x - this.player.position.x, 2 ) + Math.pow( player.position.z - this.player.position.z, 2 ) );

        if ( distance <= minDist ) {

            minDist = distance;
            target = player;

        }

    }

    // if ! target search for Tower target

    if ( ! target || minDist > 280 ) {

        minDist = 1000;

        for ( var i = 0, il = towers.length; i < il; i ++ ) {

            var tower = towers[ i ];

            if ( tower.team === this.player.team ) continue;

            var distance = Math.sqrt( Math.pow( tower.position.x - this.player.position.x, 2 ) + Math.pow( tower.position.z - this.player.position.z, 2 ) );

            if ( distance <= minDist ) {

                minDist = distance;
                target = tower;

            }

        }

    }

    if ( target && minDist < 280 ) {

        var dx = target.position.x - this.player.position.x;
        var dz = target.position.z - this.player.position.z;
        var rotation, delta;

        if ( dz === 0 && dx !== 0 ) {

            rotation = ( dx > 0 ) ? - Math.PI : 0;

        } else {

            rotation = - Math.PI / 2 - Math.atan2( dz, dx );

        }

        rotation += Math.PI / 2;

        delta = utils.formatAngle( rotation ) - utils.formatAngle( this.player.rotationTop );

        if ( Math.abs( delta ) > Math.PI ) {

            if ( delta > 0 ) {

                delta = - 2 * Math.PI + delta;

            } else {

                delta = 2 * Math.PI + delta;

            }

        }

        if ( Math.abs( delta / 2 ) > 0.1 ) {

            this.player.rotationTop += delta / 2;
            this.player.rotationTop = utils.formatAngle( this.player.rotationTop );
            this.player.rotateTop( this.player.rotationTop );

        }

        if ( Math.random() < 0.3 && minDist < 280 ) {

            this.player.shoot();

        }

    }

};

Bot.prototype.dispose = function () {

    clearInterval( this.updateInterval );

};

//

module.exports = Bot;
