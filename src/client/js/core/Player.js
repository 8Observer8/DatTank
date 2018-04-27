
Game.Player.prototype.newLevel = function ( bonusLevels ) {

    setTimeout( function () {
    
        ui.showTankStatsUpdate( bonusLevels );

    }, 3000 );

    this.bonusLevels = bonusLevels;

};

Game.Player.prototype.updateStats = function ( name ) {

    var stats = {
        'speed':          0,
        'rpm':            1,
        'armour':         2,
        'gun':            3,
        'ammo-capacity':  4
    };

    switch ( name ) {

        case 'speed':

            this.tank.speed += 3;
            this.moveSpeed = this.originalMoveSpeed * this.tank.speed / 40;
            break;

        case 'rpm':

            this.tank.rpm *= 1.1;
            break;

        case 'armour':

            this.tank.armour += 10;
            break;

        case 'gun':

            this.tank.bullet += 5;
            break;

        case 'ammo-capacity':

            this.tank.ammoCapacity += 15;
            break;

        default:

            return false;

    }

    //

    var buffer = new ArrayBuffer( 4 );
    var bufferView = new Int16Array( buffer );
    var statsId = stats[ name ];

    //

    bufferView[1] = statsId;

    network.send( 'PlayerTankUpdateStats', buffer, bufferView );

};
