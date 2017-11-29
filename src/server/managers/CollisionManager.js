/*
 * @author ohmed
 * Arena collision manager
*/

var SAT = require('sat');

var CollisionManager = function ( arena, params ) {

    this.arena = arena;

    this.map = {};
    this.objects = [];

};

CollisionManager.prototype.checkCollision = function ( objectA, objectB, newPosition ) {

    if ( objectA.id === objectB.id ) return false;

    var r1 = Math.sqrt( Math.pow( Math.max( objectA.sizeX, objectA.sizeZ ), 2 ) );
    var objAsat = new SAT.Circle( new SAT.Vector(objectA.position.x,objectA.position.z ), r1 );
    var objBsat = new SAT.Box( new SAT.Vector( objectB.position.x,objectB.position.z ), 20, 20 ).toPolygon();
    objBsat.setAngle( objectB.rotation );

    var response = new SAT.Response();
    var collided = SAT.testPolygonCircle(objBsat, objAsat, response );

    if ( collided ) {

        objectB.position.x -= response.overlapV.x;
        objectB.position.z -= response.overlapV.y;
        return true;

    } else {

        return false;

    }

};

CollisionManager.prototype.checkBulletCollision = function ( object, bullet ) {

    if ( object.id === bullet.ownerId ) return false;

    var r = Math.sqrt( 2 * Math.pow( Math.max( object.sizeX, object.sizeZ ), 2 ) );
    var dist = Math.sqrt( Math.pow( object.position.x - bullet.position.x, 2 ) + Math.pow( object.position.z - bullet.position.z, 2 ) );

    return dist < r;

};

CollisionManager.prototype.addObject = function ( position, sizeX, sizeY, sizeZ, id ) {

    this.objects.push({
        position:   { x: position.x, y: position.y, z: position.z },
        sizeX:      sizeX,
        sizeY:      sizeY,
        sizeZ:      sizeZ,
        id:         id
    });

};

CollisionManager.prototype.addPlayer = function ( player ) {

    this.objects.push({
        position:   player.position,
        sizeX:      player.sizeX,
        sizeY:      player.sizeY,
        sizeZ:      player.sizeZ,
        id:         player.id,
    });

};

CollisionManager.prototype.moveTank = function ( direction, player, delta ) {

    var moveDelta = Math.sqrt( Math.pow( player.moveDirection.x, 2 ) + Math.pow( player.moveDirection.y, 2 ) );
    var newPosition = {
        x:  player.moveDirection.x > 0 ? player.position.x + ( player.moveSpeed  * Math.sin( player.rotation )  * delta ) : player.position.x - ( player.moveSpeed  * Math.sin( player.rotation ) * delta ),
        y:  0,
        z:  player.moveDirection.z > 0 ? player.position.z + ( player.moveSpeed  * Math.sin( player.rotation )  * delta ) : player.position.z - ( player.moveSpeed  * Math.sin( player.rotation ) * delta )
    };

    if ( Math.abs( newPosition.x ) > 1270 || Math.abs( newPosition.z ) > 1270 ) {

        if ( player.moveDirection.x > 0 ) {

            player.position.x -= ( player.moveSpeed * Math.sin( player.rotation ) * delta );
            player.position.z -= ( player.moveSpeed * Math.cos( player.rotation ) * delta );

        } else if ( player.moveDirection.x < 0 ) {

            player.position.x += ( player.moveSpeed * Math.sin( player.rotation ) * delta );
            player.position.z += ( player.moveSpeed * Math.cos( player.rotation ) * delta );

        }

        return false;

    }

    //

    for ( var i = 0, il = this.objects.length; i < il; i ++ ) {

        if ( this.checkCollision( this.objects[ i ], player, newPosition ) ) {

            return false;

        }

    }

    return true;

};

CollisionManager.prototype.moveBullet = function ( bullet, delta ) {

    for ( var j = 0; j < 4; j ++ ) {

        var x = bullet.position.x + Math.cos( bullet.angle ) * delta;
        var z = bullet.position.z - Math.sin( bullet.angle ) * delta;

        bullet.position.x = x;
        bullet.position.z = z;

        for ( var i = 0; i < this.objects.length; i ++ ) {

            if ( this.checkBulletCollision( this.objects[ i ], bullet ) ) {

                return this.objects[ i ];

            }

        }

    }

    return false;

};

CollisionManager.prototype.getPlayerById = function ( playerId ) {

    for ( var i = 0, il = this.objects.length; i < il; i ++ ) {

        if ( this.objects[ i ].id === playerId ) {

            return this.objects[ i ];

        }

    }

    return false;

};

CollisionManager.prototype.removePlayer = function ( player ) {

    var object = this.getPlayerById( player.id );

    if ( object ) this.objects.splice( this.objects.indexOf( object ), 1 );

};

CollisionManager.prototype.update = function ( delta ) {

    // todo

};

//

module.exports = CollisionManager;