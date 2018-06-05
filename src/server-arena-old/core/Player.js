
Player.prototype.changeScore = function ( delta ) {

    this.score += delta;

    //

    var level = 0;
    var levels = [ 0, 10, 30, 60, 100, 150, 250, 340, 500, 650, 1000, 1400, 1900, 2500, 3000, 3800, 4500, 5500, 6700, 7200, 8700, 9800, 12000 ];

    while ( levels[ level ] <= this.score ) {

        level ++;

    }

    level --;

    if ( this.level + this.bonusLevels < level || delta < 0 ) {

        if ( this.socket ) {

            this.networkBuffers['NewLevel'] = this.networkBuffers['NewLevel'] || {};
            var buffer = this.networkBuffers['NewLevel'].buffer || new ArrayBuffer( 6 );
            var bufferView = this.networkBuffers['NewLevel'].bufferView || new Int16Array( buffer );
            this.networkBuffers['NewLevel'].buffer = buffer;
            this.networkBuffers['NewLevel'].bufferView = bufferView;

            this.bonusLevels = level - this.level;
            bufferView[ 1 ] = this.id;
            bufferView[ 2 ] = this.bonusLevels;

            networkManager.send( 'PlayerNewLevel', this.socket, buffer, bufferView );

        } else {

            this.bot.levelUp();

        }

    }

};

Player.prototype.updateStats = function ( statId ) {

    var stats = [ 'speed', 'rpm', 'armour', 'gun', 'ammoCapacity' ];
    var levelsStats = {
        speed:          [ 5, 3, 2, 2, 2, 3, 1, 3, 3, 2, 5, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
        rpm:            [ 30, 20, 20, 15, 10, 15, 20, 20, 30, 40, 30, 20, 10, 10, 20, 30, 20, 10, 20, 20, 20, 10, 15 ],
        armour:         [ 40, 30, 20, 20, 30, 40, 50, 20, 30, 50, 30, 20, 10, 10, 20, 20, 30, 20, 10, 15, 20, 10, 10 ],
        gun:            [ 20, 15, 15, 20, 15, 10, 5, 5, 10, 15, 20, 30, 35, 40, 20, 10, 15, 15, 20, 10, 10, 10, 30 ],
        ammoCapacity:   [ 30, 20, 20, 40, 30, 20, 5, 5, 10, 20, 15, 20, 15, 30, 20, 10, 15, 15, 10, 10, 10, 20, 30 ]
    };
    var statName = stats[ statId ];

    console.log( 'zz', this.level, this.bonusLevels );

    if ( this.bonusLevels <= 0 ) return false;

    switch ( statName ) {

        case 'speed':

            this.tank.speed += levelsStats['speed'][ this.level + 1 ];
            this.moveSpeed = this.originalMoveSpeed * this.tank.speed / 40;
            break;

        case 'rpm':

            this.tank.rpm += levelsStats['rpm'][ this.level + 1 ];
            break;

        case 'armour':

            this.tank.armour += levelsStats['armour'][ this.level + 1 ];
            break;

        case 'gun':

            this.tank.bullet += levelsStats['gun'][ this.level + 1 ];
            break;

        case 'ammoCapacity':

            this.tank.ammoCapacity += levelsStats['ammoCapacity'][ this.level + 1 ];
            break;

        default:

            return false;

    }

    //

    this.bonusLevels --;
    this.level ++;

};

Player.prototype.update = function ( delta, time ) {

    var scope = this;
    if ( scope.status !== Player.Alive ) return;

    // regeneration

    this.sinceHitTime += delta;
    if ( this.sinceHitTime > this.sinceHitRegeneraionLimit ) {

        if ( this.sinceRegenerationTime > this.sinceRegenerationLimit ) {

            this.changeHealth( 2 );
            this.sinceRegenerationTime = 0;

        } else {

            this.sinceRegenerationTime += delta;

        }

    }

    // check boxes in range

    var newBoxesInRange = [];

    for ( var i = 0, il = scope.arena.boxManager.boxes.length; i < il; i ++ ) {

        var box = scope.arena.boxManager.boxes[ i ];

        if ( scope.isObjectInRange( box ) ) {

            if ( scope.inRangeOf[ 'b-' + box.id ] ) continue;

            scope.inRangeOf[ 'b-' + box.id ] = box;
            newBoxesInRange.push( box );

        } else {

            delete scope.inRangeOf[ 'b-' + box.id ];

        }

    }

    if ( this.socket && newBoxesInRange.length ) {

        var boxDataSize = 8;
        var buffer = new ArrayBuffer( 2 + boxDataSize * newBoxesInRange.length );
        var bufferView = new Uint16Array( buffer );
        var box;

        for ( var i = 1, il = boxDataSize * newBoxesInRange.length + 1; i < il; i += boxDataSize ) {

            box = newBoxesInRange[ ( i - 1 ) / boxDataSize ];

            bufferView[ i + 0 ] = box.id;
            bufferView[ i + 1 ] = Game.Box.Types[ box.boxType ];
            bufferView[ i + 2 ] = box.position.x;
            bufferView[ i + 3 ] = box.position.z;

        }

        networkManager.send( 'ArenaBoxesInRange', scope.socket, buffer, bufferView );

    }

    // check towers in range

    var newTowersInRange = [];

    for ( var i = 0, il = scope.arena.towerManager.towers.length; i < il; i ++ ) {

        var tower = scope.arena.towerManager.towers[ i ];

        if ( scope.isObjectInRange( tower ) ) {

            if ( scope.inRangeOf[ 't-' + tower.id ] ) continue;

            scope.inRangeOf[ 't-' + tower.id ] = tower;
            tower.inRangeOf[ 'p-' + scope.id ] = scope;
            newTowersInRange.push( tower );

        } else {

            delete scope.inRangeOf[ 't-' + tower.id ];
            delete tower.inRangeOf[ 'p-' + scope.id ];

        }

    }

    if ( this.socket && newTowersInRange.length ) {

        var params = 6;
        var towerDataSize = 12;
        var buffer = new ArrayBuffer( 2 + towerDataSize * newTowersInRange.length );
        var bufferView = new Int16Array( buffer );
        var tower, offset;

        for ( var i = 0, il = newTowersInRange.length; i < il; i ++ ) {

            tower = newTowersInRange[ i ];
            offset = 1 + params * i;

            bufferView[ offset + 0 ] = tower.id;
            bufferView[ offset + 1 ] = tower.team.id;
            bufferView[ offset + 2 ] = tower.position.x;
            bufferView[ offset + 3 ] = tower.position.z;
            bufferView[ offset + 4 ] = tower.rotation * 1000;
            bufferView[ offset + 5 ] = tower.health;

        }

        networkManager.send( 'ArenaTowersInRange', scope.socket, buffer, bufferView );

    }

    // check players in range

    var newPlayersInRange = [];

    for ( var i = 0, il = scope.arena.playerManager.players.length; i < il; i ++ ) {

        var player = scope.arena.playerManager.players[ i ];

        if ( scope.isObjectInRange( player ) ) {

            if ( scope.inRangeOf[ 'p-' + player.id ] ) continue;

            scope.inRangeOf[ 'p-' + player.id ] = player;
            newPlayersInRange.push( player );

        } else {

            delete scope.inRangeOf[ 'p-' + player.id ];

        }

    }

    if ( this.socket && newPlayersInRange.length ) {

        var playerDataSize = 22 + 13 * 2;
        var buffer = new ArrayBuffer( 2 + playerDataSize * newPlayersInRange.length );
        var bufferView = new Int16Array( buffer );
        var player;
        var item = 0;

        for ( var i = 1, il = ( playerDataSize / 2 ) * newPlayersInRange.length + 1; i < il; i += playerDataSize / 2 ) {

            player = newPlayersInRange[ item ];

            bufferView[ i + 0 ] = player.id;
            bufferView[ i + 1 ] = player.team.id;
            bufferView[ i + 2 ] = player.position.x;
            bufferView[ i + 3 ] = player.position.z;
            bufferView[ i + 4 ] = player.rotation * 1000;
            bufferView[ i + 5 ] = player.topRotation * 1000;
            bufferView[ i + 6 ] = player.health;
            bufferView[ i + 7 ] = player.moveDirection.x;
            bufferView[ i + 8 ] = player.moveDirection.y;
            bufferView[ i + 9 ] = player.tank.typeId;
            bufferView[ i + 10 ] = player.ammo;

            for ( var j = 0, jl = player.login.length; j < jl; j ++ ) {

                if ( player.login[ j ] ) {

                    bufferView[ i + 11 + j ] = + player.login[ j ].charCodeAt( 0 ).toString( 10 );

                }

            }

            item ++;

        }

        networkManager.send( 'ArenaPlayersInRange', scope.socket, buffer, bufferView );

    }

    // update player AWSD movement

    if ( scope.moveDirection.x !== 0 || scope.moveDirection.y !== 0 ) {

        if ( scope.moveDirection.x > 0 ) {

            scope.deltaPosition.x = + scope.moveSpeed * Math.sin( scope.rotation ) * delta;
            scope.deltaPosition.z = + scope.moveSpeed * Math.cos( scope.rotation ) * delta;

        } else if ( scope.moveDirection.x < 0 ) {

            scope.deltaPosition.x = - scope.moveSpeed * Math.sin( scope.rotation ) * delta;
            scope.deltaPosition.z = - scope.moveSpeed * Math.cos( scope.rotation ) * delta;

        } else {

            scope.deltaPosition.x = 0;
            scope.deltaPosition.z = 0;

        }

        //

        if ( scope.moveDirection.y > 0 ) {

            scope.rotation += 0.001 * delta;

        } else if ( scope.moveDirection.y < 0 ) {

            scope.rotation -= 0.001 * delta;

        }

    }

};
