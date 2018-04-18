/*
 * @author ohmed
 * DatTank Arena object
*/

Game.Arena.prototype.showExplosion = function ( data ) {

    var bulletId = data[0];
    var ownerId = data[1];

    //

    var shooter = this.playerManager.getById( ownerId );
    if ( shooter ) {

        shooter = shooter.tank;

    } else {

        shooter = this.towerManager.getById( ownerId );

    }

    if ( shooter ) {

        var bulletsPool = shooter.bullets;
        for ( var j = 0, jl = bulletsPool.length; j < jl; j ++ ) {

            if ( bulletsPool[ j ].bulletId === bulletId ) {

                bulletsPool[ j ].visible = false;
                bulletsPool[ j ].trace.visible = false;
                break;

            }

        }

    }

};

Game.Arena.prototype.update = function ( time, delta ) {

    // remove out of range players

    var playersToRemove = [];

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        var player = this.playerManager.players[ i ];

        if ( ! player || player.id === this.me.id ) continue;
        if ( Utils.getDistance( player.position, this.me.position ) > this.viewRange ) {

            playersToRemove.push( player );

        }

    }

    for ( var i = 0, il = playersToRemove.length; i < il; i ++ ) {

        this.playerManager.remove( playersToRemove[ i ] );

    }

    // remove out of range towers

    var towersToRemove = [];

    for ( var i = 0, il = this.towerManager.towers.length; i < il; i ++ ) {

        var tower = this.towerManager.towers[ i ];
        if ( ! tower ) continue;

        if ( Utils.getDistance( tower.position, this.me.position ) > this.viewRange ) {

            towersToRemove.push( tower );

        }

    }

    for ( var i = 0, il = towersToRemove.length; i < il; i ++ ) {

        this.towerManager.remove( towersToRemove[ i ] );

    }

    // remove out of range boxes

    var boxesToRemove = [];

    for ( var i = 0, il = this.boxManager.boxes.length; i < il; i ++ ) {

        var box = this.boxManager.boxes[ i ];
        if ( ! box ) continue;

        if ( Utils.getDistance( box.position, this.me.position ) > this.viewRange ) {

            boxesToRemove.push( box );

        }

    }

    for ( var i = 0, il = boxesToRemove.length; i < il; i ++ ) {

        this.boxManager.remove( boxesToRemove[ i ] );

    }

};
