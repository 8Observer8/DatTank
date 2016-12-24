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

        for ( var i = 0; i < this.arena.bots.length; i ++ ) {

            if ( this.login === this.arena.bots[ i ].login ) {

                this.login = false;

            } 

        } 

    }

    this.init();

};

Bot.prototype = {};

Bot.prototype.init = function () {

    var tank = ( Math.random() < 0.5 ) ? 'USAT54' : 'UKBlackPrince';
    this.player = new DT.Player({ login: this.login, tank: tank });
    this.player.ammo = 10000000;
    this.arena.addPlayer( this.player );

    this.player.bot = this;

    this.updateInterval = setInterval( this.update.bind( this ), 100 );

};

Bot.prototype.update = function () {

    var isMove = Math.random();

    if ( this.removed ) {

        this.dispose();
        return;

    }

    if ( this.player.health <= 0 ) return;

    //

    if ( isMove < 0.02 ) {

        var x = Math.floor( 2000 * ( Math.random() - 0.5 ) );
        var z = Math.floor( 2000 * ( Math.random() - 0.5 ) );
        this.player.moveToPoint({ x: x, y: 0, z: z });
        return;

    }

    //

    var target = false;
    var minDist = 100000;

    for ( var i = 0, il = this.arena.players.length; i < il; i ++ ) {

        var player = this.arena.players[ i ];

        if ( player.team === this.player.team ) continue;

        var distance = Math.sqrt( Math.pow( player.position.x - this.player.position.x, 2 ) + Math.pow( player.position.z - this.player.position.z, 2 ) );

        if ( distance < minDist ) {

            minDist = distance;
            target = player;

        }

    }

    // todo: need to unificate next part of code someday.

    if ( ! target || minDist > 200 ) {

        for ( var i = 0, il = this.arena.towers.length; i < il; i ++ ) {

            var tower = this.arena.towers[ i ];

            if ( tower.team === this.player.team ) continue;

            var distance = Math.sqrt( Math.pow( tower.position.x - this.player.position.x, 2 ) + Math.pow( tower.position.z - this.player.position.z, 2 ) );

            if ( distance < minDist ) {

                minDist = distance;
                target = tower;

            }

        }

        if ( target && minDist < 200 ) {

            var angle = Math.atan2( target.position.x - this.player.position.x, target.position.z - this.player.position.z ) - Math.PI / 2;
            this.player.rotateTop({ topAngle: utils.formatAngle( angle - this.player.rotation ), baseAngle: this.player.rotation });

            if ( Math.random() < 0.3 ) {

                this.player.shoot();

            }

        }

    } else if ( target && minDist < 200 ) {

        var angle = Math.atan2( target.position.x - this.player.position.x, target.position.z - this.player.position.z ) - Math.PI / 2;
        this.player.rotateTop({ topAngle: utils.formatAngle( angle - this.player.rotation ), baseAngle: this.player.rotation });

        if ( Math.random() < 0.3 ) {

            this.player.shoot();

        }

    }

};

Bot.prototype.dispose = function () {

    clearInterval( this.updateInterval );

};

//

module.exports = Bot;
