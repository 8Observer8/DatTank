/*
 * @author ohmed
 * Arena collision manager
*/

var p2 = require('p2');

//

var CollisionManager = function ( arena, params ) {

    var scope = this;

    scope.arena = arena;

    scope.map = {};
    scope.objects = [];

    //

    scope.world = new p2.World({ gravity: [ 0, 0 ] });

    scope.world.on( 'beginContact', function ( event ) {

        for ( var i = 0; i < scope.objects.length; i ++ ) {

            var object = scope.objects[ i ];

            if ( event.bodyA == object.body || event.bodyB == object.body ) {

                if ( object.parent.type === 'Player' ) {

                    object.collision = true;

                }

            }

        }

    });

    scope.world.on( 'endContact', function ( event ) {

        for ( var i = 0; i < scope.objects.length; i ++ ) {

            var object = scope.objects[ i ];

            if ( event.bodyA == object.body || event.bodyB == object.body ) {

                if ( object.parent.type === 'Player' ) {

                    object.collision = false;

                }

            }

        }

    });

};

CollisionManager.prototype = {};

//

CollisionManager.prototype.checkBulletCollision = function ( object, bullet ) {

    return false;

    if ( object.id === bullet.ownerId ) return false;

    var r = Math.sqrt( 2 * Math.pow( Math.max( object.sizeX, object.sizeZ ), 2 ) );
    var dist = Math.sqrt( Math.pow( object.position.x - bullet.position.x, 2 ) + Math.pow( object.position.z - bullet.position.z, 2 ) );

    return dist < r;

};

CollisionManager.prototype.addObject = function ( object, type ) {

    type = type || 'circle';
    var shape;

    var collisionBox = {
        parent:     object,
        type:       type,
        body:       new p2.Body({ mass: 1000, position: [ object.position.x, object.position.z ] }),
        sensor:     false,
        collision:  false
    };

    if ( type === 'box' ) {

        shape = new p2.Box({ width: object.sizeX, height: object.sizeZ });

    } else if ( type === 'circle' ) {

        shape = new p2.Circle({ radius: object.radius });

    }

    collisionBox.body.damping = 0;
    collisionBox.sensor = shape;
    shape.sensor = true;
    collisionBox.body.addShape( shape );

    //

    this.world.addBody( collisionBox.body );
    this.objects.push( collisionBox );
    object.collisionBox = collisionBox;

};

CollisionManager.prototype.moveBullet = function ( bullet, delta ) {

    for ( var j = 0; j < 4; j ++ ) {

        var x = bullet.position.x + Math.cos( bullet.angle ) * delta;
        var z = bullet.position.z - Math.sin( bullet.angle ) * delta;

        bullet.position.x = x;
        bullet.position.z = z;

        for ( var i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.checkBulletCollision( this.objects[ i ], bullet ) ) {

                return this.objects[ i ];

            }

        }

    }

    return false;

};

CollisionManager.prototype.getObjectById = function ( id ) {

    for ( var i = 0, il = this.objects.length; i < il; i ++ ) {

        if ( this.objects[ i ].parent.id === id ) {

            return this.objects[ i ];

        }

    }

    return false;

};

CollisionManager.prototype.update = function ( delta ) {

    for ( var i = 0, il = this.objects.length; i < il; i ++ ) {

        var object = this.objects[ i ];

        object.body.position[0] = ( object.parent.deltaPosition ) ? object.parent.position.x + 3 * object.parent.deltaPosition.x : object.parent.position.x;
        object.body.position[1] = ( object.parent.deltaPosition ) ? object.parent.position.z + 3 * object.parent.deltaPosition.z : object.parent.position.z;
        object.body.angle = object.parent.rotation;

    }

    this.world.step( delta / 1000 );

    for ( var i = 0, il = this.objects.length; i < il; i ++ ) {

        var object = this.objects[ i ];

        if ( Math.abs( object.body.position[0] ) > 1270 || Math.abs( object.body.position[1] ) > 1270 ) {

            object.parent.move( 0, object.parent.moveDirection.y );
            continue;
            
        }

        if ( ! object.collision && object.parent.deltaPosition ) {

            object.parent.position.x += object.parent.deltaPosition.x;
            object.parent.position.z += object.parent.deltaPosition.z;

            object.parent.deltaPosition.x = 0;
            object.parent.deltaPosition.z = 0;

        } else if ( object.parent.type === 'Player' ) {

            object.parent.move( 0, object.parent.moveDirection.y );

        }

    }

};

CollisionManager.prototype.removeObject = function ( id ) {

    var object = this.getObjectById( id );
    if ( object ) this.objects.splice( this.objects.indexOf( object ), 1 );

};

//

module.exports = CollisionManager;
