/*
 * @author ohmed
 * DatTank Bot object
*/

var Bot = function ( arena ) {

    this.player = false;
    this.arena = arena;
    this.login = '';

    this.moveDuration = false;
    this.rotateBaseDuration = false;

    while ( this.login === '' ) {

        this.login = Bot.LoginBase[ Math.floor( Bot.LoginBase.length * Math.random() ) ];

        if ( this.login !== false ) {

            for ( var i = 0; i < this.arena.botManager.bots.length; i ++ ) {

                if ( this.login === this.arena.botManager.bots[ i ].login ) {

                    this.login = '';

                }

            }

        }

    }

    this.lastTopRotate = 0;

    //

    this.init();

};

Bot.prototype = {};

//

Bot.prototype.init = function () {

    var tank;

    if ( Math.random() <= 0.3 ) {

        tank = 'USAT54';

    } else if ( Math.random() > 0.3 && Math.random() <= 0.6 ) {

        tank = 'D32';

    } else if ( Math.random() > 0.6 ) {

        tank = 'UKBlackPrince';

    }

    this.player = this.arena.addPlayer({ login: this.login, tank: tank, socket: false });
    this.player.ammo = 10000000;
    this.player.bot = this;

};

Bot.prototype.die = function () {

    var scope = this;
    var maxKills = Math.floor( Math.random() * 60 ) + 8;

    //

    if ( scope.arena.playerManager.players.length - scope.arena.botManager.bots.length < scope.arena.botManager.botNum && scope.player.kills < maxKills ) {

        setTimeout( scope.player.respawn.bind( scope.player ), 3000 );

    } else {

        setTimeout( function () {

            if ( scope.arena.disposed ) return;
            scope.arena.botManager.remove( scope );
            scope.arena.removePlayer( scope.player );

        }, 2000 );

    }

};

Bot.prototype.update = function () {

    if ( this.player.status !== Game.Player.Alive ) return;

    //

    if ( ! this.player.moveDirection.x ) {

        var x = ( Math.random() > 0.5 ) ? 1 : -1;
        this.player.move( x, this.player.moveDirection.y );
        this.moveDuration = Math.floor( 8000 * Math.random() ) + 1000;

    } 

    if ( this.rotateBaseDuration === false ) {

        var y = Math.floor( 3 * Math.random() ) - 1;
        this.player.move( this.player.moveDirection.x, y );
        this.rotateBaseDuration = Math.floor( 500 * Math.random() ) + 500;

    }

    //

    if ( this.moveDuration !== false || this.rotateBaseDuration !== false ) {

        this.moveDuration = ( this.moveDuration !== false ) ? this.moveDuration - 40 : false;
        this.rotateBaseDuration = ( this.rotateBaseDuration !== false ) ? this.rotateBaseDuration - 40 : false;

        if ( this.moveDuration <= 0 && this.moveDuration !== false ) {

            this.player.move( 0, this.player.moveDirection.y );
            this.moveDuration = false;

        }

        if ( this.rotateBaseDuration <= 0 && this.rotateBaseDuration !== false ) {

            this.player.move( this.player.moveDirection.x, 0 );
            this.rotateBaseDuration = false;

        }

    }

    //

    var target = false;
    var minDist = 1000;
    var players = this.arena.playerManager.players;
    var towers = this.arena.towerManager.towers;
    var distance;

    // search for Player target

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        var player = players[ i ];

        if ( player.team === this.player.team || player.status !== Game.Player.Alive ) continue;

        distance = Math.sqrt( Math.pow( player.position.x - this.player.position.x, 2 ) + Math.pow( player.position.z - this.player.position.z, 2 ) );

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

            distance = Math.sqrt( Math.pow( tower.position.x - this.player.position.x, 2 ) + Math.pow( tower.position.z - this.player.position.z, 2 ) );

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

        rotation += Math.PI / 2 - this.player.rotation;

        delta = utils.formatAngle( rotation ) - utils.formatAngle( this.player.rotationTop );

        if ( Math.abs( delta ) > Math.PI ) {

            if ( delta > 0 ) {

                delta = - 2 * Math.PI + delta;

            } else {

                delta = 2 * Math.PI + delta;

            }

        }

        if ( Math.abs( delta / 2 ) > 0.1 && Date.now() - this.lastTopRotate > 400 ) {

            this.player.rotationTop += delta / 2;
            this.player.rotationTop = utils.formatAngle( this.player.rotationTop );
            this.player.rotateTop( this.player.rotationTop );

            this.lastTopRotate = Date.now();

        }

        if ( Math.random() < 0.3 && minDist < 280 ) {

            this.player.shoot();

        }

    }

};

Bot.prototype.dispose = function () {

    // nothing here yet

};

//

Bot.LoginBase = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 
    'calzone', 'augmenton', 'celianaro', 'pantor', 'elementalium', 'gazer', 'velent', 'oddio', 'taker', 'windmill',
    'soliter', 'roadkiller', 'bambuno', 'tratatar', 'sulfurio', 'helioss', 'seba', 'tracy', 'sandman', 'wooka', 'killdrop', 'warang',
    'HEqpOPMaJI', 'X_A_M', 'Vadic', '@did@s', 'Alliance', 'TRAKTORIST', 'MaJoR$', 'DeRJkiY', ']{olyan@', 'kaban', 'Semkiv', 'Agent',
    'CJIeCaPb', 'Delros',  'T0rM@Z', 'MAKAROV', 'T0rM@Z', 'Adas', 'bandit', 'Chetkii', 'Artuomchik', 'buben', 'DonKarleone', 'accura2k_',
    'GOPNIK', 'KabaniyKlyk', 'Kermit', 'KoLяN4Uk', 'KraCaV4nK', 'limon4ello', 'master_of_ceremony', 'Mr_Zaza', 'Biwen', 'ne_zli', 'NURCHIK',
    'StrannicK', 'Tîgrrr', 'Timent', 'Vision', 'X_A_M_E_P', 'Marckiz', 'bigman', 'creed', 'DarkFantastik', 'SlowPok', 'NaGiBatoR',
    'FRESH_MEAT', 'LegendarY', 'Rabbit_wolf', 'iJseven', 'Ha_KoJleHu_OJleHu', 'Vertyxan', 'kirpa', 'dindi', 'dildo', 'moskva', 'opz',
    'x_Evil_x', 'cTaTucT_kycToDpoT', 'TaNkIsT228', 'LaRDeN', 'EHOT', 'CruzTanks', 'Mazay_Ded', 'Dark_Foch', 'FL1pSTaR', 'SkyDog',
    'Nevrox', 'AWAJA', 'GrizeR', 'Jove_V_KyStax', 'Zybinjo', 'Pro1004EloVe4Ek', 'Ben_Laden', 'DeLviR', 'SkyLiTeR', '_fly_', '4ypa-4yps',
    'your mom', 'ok', 'ffff', '123', 'lol', 'lalaka', 'burzum', 'zeka', 'korb', 'zimba', 'koss', 'russka kurva', 'kol', 'atari', 'kombo',
    'per4uk', 'qwddcc', 'qwerty', 'zopa', 'timba', 'karramba', 'abdul', 'dx', 'ed', 'eddy', 'freeman', 'wow', 'tom', 'sin', 'cos', 'io',
    'datkiller', 'paul', 'lucifer', 'zomb', 'zombie', 'zombie666', 'devil', 'moskal', 'USSR', 'ripper', 'felix', '911', 'mamal', 'sdf',
    'kiss', 'die_wegan', 'jelly', 'oppa', 'dizer', 'dendy', 'paranoid', 'android', 'mathafaka', 'sirian', 'ajar', 'asian', 'nervos',
    'gblz', 'trevor', 'lol poney', 'matardar', 'diego', 'sniper', 'kemper', 'datend', 'kiba', 'andromeda', 'feedback', 'shotback',
    'wtf', 'dat kurwa', 'dfbgnhg', 'andy', 'фффф', 'опачик', 'pavel', 'T52', 'NZT', 'D3', 'Bimba', 'makaka', 'мразь', '...', 'kibaba',
    'kebab', 'nazzi', 'nippy', 'romb', 'opa', 'zip', 'rarka', 'limbo', '21k', 'kilo', 'jesus', 'kepasa', 'kantor', '456453425', 'upyr',
    'kinchasa', 'lover', 'marta', 'ochkar', 'poseidon', 'zeus', 'stalker', 'vova', 'vovchik', 'poop', 'yamaha', 'сука', 'упячка',
    'танк', 'кузя', 'kolyan', 'zadrot', 'lamp', 'kozavka', 'dikar', 'artist', 'kopa', 'chicken', 'orbea', 'z358', 'hjgdfd', 'sdfdgdg'
];

//

module.exports = Bot;
