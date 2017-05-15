/*
 * @author ohmed
 * Arena collision manager
*/

var CollisionManager = function ( arena, params ) {

    this.arena = arena;

    this.map = {};
    this.bullets = [];
    this.objects = [];

};

CollisionManager.prototype.checkCollision = function ( objectA, objectB, newPosition ) {

    var r1 = Math.sqrt( 2 * Math.pow( Math.max( objectA.sizeX, objectA.sizeZ ), 2 ) );
    var r2 = Math.sqrt( 2 * Math.pow( Math.max( objectB.sizeX, objectB.sizeZ ), 2 ) );

    var dist = Math.sqrt( Math.pow( objectA.position.x - newPosition.x, 2 ) + Math.pow( objectA.position.z - newPosition.z, 2 ) );

    //

    if ( dist < r1 + r2 ) {

        return true;

    } else {

        return false;

    }

};

CollisionManager.prototype.addObject = function ( position, sizeX, sizeY, sizeZ ) {

    this.objects.push({
        position:   { x: position.x, y: position.y, z: position.z },
        sizeX:      sizeX,
        sizeY:      sizeY,
        sizeZ:      sizeZ
    });

};

CollisionManager.prototype.moveTank = function ( direction, player, delta ) {

    var moveDelta = Math.sqrt( Math.pow( player.moveDirection.x, 2 ) + Math.pow( player.moveDirection.y, 2 ) );
    var newPosition = {
        x:  player.position.x - Math.sign( player.moveDirection.x ) / moveDelta * player.moveSpeed * delta,
        y:  0,
        z:  player.position.z + Math.sign( player.moveDirection.y ) / moveDelta * player.moveSpeed * delta
    };

    //

    if ( Math.abs( newPosition.x ) > 1270 || Math.abs( newPosition.z ) > 1270 ) {

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

    return true;

};

CollisionManager.prototype.update = function ( delta ) {

    // todo

};

//

module.exports = CollisionManager;
