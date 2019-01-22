
importScripts( '/libs/Cannon.js' );

//

var world;
var objects = [];
var inited = false;
var lastUpdate = 0;
var delta = 0;
var deltaStack = 0;

//

self.onmessage = function ( e ) {

    var data = e.data;

    switch ( data.type ) {

        case 'init':

            initWorld();
            break;

        case 'addObject':

            addObject( data.object, data.shapeType, data.isDynamic );
            break;

        case 'removeObject':

            removeObject( data.id );
            break;

        case 'update':

            var time = Date.now();
            lastUpdate = lastUpdate || time;
            delta = time - lastUpdate;
            update( delta, data.objects );
            lastUpdate = time;
            break;

    }

};

//

function addObject ( object, type, isDynamic ) {

    if ( ! inited ) return;

    var shape;
    var collisionBox = {
        id:         object.id,
        objType:    object.type,
        type:       type,
        body:       new CANNON.Body({ mass: ( isDynamic ) ? 5000 : 0 }),
    };

    if ( type === 'box' ) {

        shape = new CANNON.Box( new CANNON.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );
        collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );
        collisionBox.body.addShape( shape );

    } else if ( type === 'circle' ) {

        shape = new CANNON.Cylinder( object.radius, object.radius, 100, 8 );
        const q = new CANNON.Quaternion().setFromEuler( - Math.PI / 2, 0, 0, 'XYZ' );
        collisionBox.body.addShape( shape, new CANNON.Vec3(), q );

    } else if ( type === 'tank' ) {

        shape = new CANNON.Box( new CANNON.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );
        collisionBox.body.addShape( shape, new CANNON.Vec3( 0, 0, 0 ) );

        const q = new CANNON.Quaternion().setFromEuler( - Math.PI / 2, 0, 0, 'XYZ' );

        shape = new CANNON.Cylinder( 0.55 * object.size.x, 0.55 * object.size.x, object.size.y / 2, 8 );
        collisionBox.body.addShape( shape, new CANNON.Vec3( 0, 0, object.size.z / 3 ), q );

        shape = new CANNON.Cylinder( 0.55 * object.size.x, 0.55 * object.size.x, object.size.y / 2, 8 );
        collisionBox.body.addShape( shape, new CANNON.Vec3( 0, 0, - object.size.z / 3 ), q );

        collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );
        collisionBox.body.angularDamping = 0.95;

    }

    collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );
    collisionBox.body.type = ( ! isDynamic ) ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC;

    //

    world.addBody( collisionBox.body );
    objects.push( collisionBox );

};

function removeObject ( objectId ) {

    if ( ! inited ) return;

    var newObjectList = [];

    for ( var i = 0, il = objects.length; i < il; i ++ ) {

        if ( objects[ i ].objType + '-' + objects[ i ].id === objectId ) {

            world.remove( objects[ i ].body );
            continue;

        }

        newObjectList.push( objects[ i ] );

    }

    objects = newObjectList;

};

function update ( delta, objectsInfo ) {

    if ( ! inited ) return;
    if ( delta === 0 ) return;

    //

    var coef = delta / 50;
    var objectsParams = [];

    for ( var i = 0, il = objects.length; i < il; i ++ ) {

        var object = objects[ i ];
        var objectInfo = objectsInfo[ object.objType + '-' + object.id ];
        if ( ! object ) continue;
        if ( object.objType !== 'Tank' ) continue;

        //

        if ( objectInfo.position !== false ) {

            object.body.position.x = objectInfo.position.x;
            object.body.position.y = objectInfo.position.y;
            object.body.position.z = objectInfo.position.z;

        }

        //

        if ( objectInfo.moveDirection.y > 0 ) {

            var force = new CANNON.Vec3( 0, 0, 65000 * coef );
            object.body.applyLocalImpulse( force.negate(), new CANNON.Vec3(   5, 0, 0 ) );
            object.body.applyLocalImpulse( force, new CANNON.Vec3( - 5, 0, 0 ) );

        } else if ( objectInfo.moveDirection.y < 0 ) {

            var force = new CANNON.Vec3( 0, 0, 65000 * coef );
            object.body.applyLocalImpulse( force, new CANNON.Vec3(   5, 0, 0 ) );
            object.body.applyLocalImpulse( force.negate(), new CANNON.Vec3( - 5, 0, 0 ) );

        }

        //

        const rot = { x: 0, y: 0, z: 0 };
        object.body.quaternion.toEuler( rot );

        if ( objectInfo.rotation !== false ) {

            object.body.quaternion.setFromEuler( 0, objectInfo.rotation, 0, 'XYZ' );

        } else {

            objectInfo.rotation = rot.y;

        }

        //

        var speed = object.body.velocity.distanceTo( new CANNON.Vec3( 0, object.body.velocity.y, 0 ) );
        var maxSpeed = 3 * objectInfo.maxSpeed;
        var velocityAngle = Math.atan2( object.body.velocity.x, object.body.velocity.z );
        var movementDirection = Math.sign( object.body.velocity.x * Math.sin( objectInfo.rotation ) );

        if ( objectInfo.moveDirection.x !== 0 ) {

            if ( speed < maxSpeed ) {

                speed = ( movementDirection === objectInfo.moveDirection.x ) ? speed : - speed;

                var forceAmount = objectInfo.power * ( 1 - speed / maxSpeed );
                var force = new CANNON.Vec3( 0, 0, forceAmount * coef );
                if ( objectInfo.moveDirection.x < 0 ) force = force.negate();
                object.body.applyLocalImpulse( force, new CANNON.Vec3( 0, 0, 0 ) );

            }

        } else {

            object.body.applyLocalImpulse( new CANNON.Vec3( 0, 0, - 0.05 * movementDirection * object.body.mass * object.body.velocity.length() * coef ), new CANNON.Vec3( 0, 0, 0 ) );

        }

        //

        var direction = ( objectInfo.moveDirection.x > 0 ) ? 0 : Math.PI;
        var vx = speed * Math.sin( rot.y + direction );
        var vz = speed * Math.cos( rot.y + direction );
        var forwardVelocity = new CANNON.Vec3( vx, 0, vz ).distanceTo( new CANNON.Vec3() );

        //

        object['prevForwardVelocity'] = object['prevForwardVelocity'] || forwardVelocity;
        var dfv = forwardVelocity - object['prevForwardVelocity'];
        dfv = movementDirection * dfv;
        object['prevForwardVelocity'] = forwardVelocity;
        object.acceleration = - Math.sign( dfv ) * Math.min( Math.abs( dfv ), 8 ) / 200 / Math.PI;

        //

        const dv = object.body.velocity.length() * Math.sin( velocityAngle - objectInfo.rotation );
        object.body.applyLocalImpulse( new CANNON.Vec3( - 0.2 * object.body.mass * dv * coef, 0, 0 ), new CANNON.Vec3( 0, 0, 0 ) );

    }

    //

    world.step( 1 / 20, delta / 1000, 5 );

    //

    for ( var i = 0, il = objects.length; i < il; i ++ ) {

        var object = objects[ i ];
        var objectInfo = objectsInfo[ object.objType + '-' + object.id ];
        if ( ! object ) continue;
        if ( object.objType !== 'Tank' ) continue;

        //

        var rot = { x: 0, y: 0, z: 0 };
        object.body.quaternion.toEuler( rot );

        //

        objectsParams.push({
            id:                     object.id,
            type:                   object.objType,
            acceleration:           object.acceleration,
            position:               { x: object.body.position.x, y: object.body.position.y, z: object.body.position.z },
            rotation:               rot.y,
            velocity:               forwardVelocity,
            angularVelocity:        { x: object.body.angularVelocity.x, y: object.body.angularVelocity.y, z: object.body.angularVelocity.z },
            directionVelocity:      { x: object.body.velocity.x, y: object.body.velocity.y, z: object.body.velocity.z }
        });

    }

    //

    self.postMessage({ type: 'update', objects: objectsParams });

};

function initWorld () {

    // init world

    world = new CANNON.World();
    world.gravity.set( 0, - 30, 0 );
    world.defaultContactMaterial.contactEquationStiffness = 500000;
    world.defaultContactMaterial.friction = 0;
    world.defaultContactMaterial.restitution = 0.2;
    world.solver.iterations = 5;

    // add ground

    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody['name'] = 'ground';
    groundBody.addShape( groundShape );
    groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), - Math.PI / 2 );
    world.addBody( groundBody );

    //

    inited = true;

    // add map borders

    addObject({ rotation: 0, position: new CANNON.Vec3(   1330, 0,      0 ), size: new CANNON.Vec3( 60, 100, 2630 ) }, 'box', false );
    addObject({ rotation: 0, position: new CANNON.Vec3( - 1330, 0,      0 ), size: new CANNON.Vec3( 60, 100, 2630 ) }, 'box', false );
    addObject({ rotation: 0, position: new CANNON.Vec3(      0, 0,   1330 ), size: new CANNON.Vec3( 2630, 100, 60 ) }, 'box', false );
    addObject({ rotation: 0, position: new CANNON.Vec3(      0, 0, - 1330 ), size: new CANNON.Vec3( 2630, 100, 60 ) }, 'box', false );

};

//

self.postMessage({ type: 'ready' });
