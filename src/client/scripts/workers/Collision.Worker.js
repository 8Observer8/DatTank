
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

            lastUpdate = lastUpdate || Date.now();
            delta = Date.now() - lastUpdate;
            update( delta, data.objects );
            lastUpdate = Date.now();
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

    } else if ( type === 'circle' ) {

        shape = new CANNON.Cylinder( object.radius, object.radius, 100, 8 );
        collisionBox.body.quaternion.setFromEuler( - Math.PI / 2, 0, 0, 'XYZ' );

    }

    collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );

    collisionBox.body.addShape( shape );
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

    var objectsParams = [];

    for ( var i = 0, il = objects.length; i < il; i ++ ) {

        var object = objects[ i ];
        var objectInfo = objectsInfo[ object.objType + '-' + object.id ];
        if ( ! object ) continue;
        if ( object.objType !== 'Tank' ) continue;

        if ( objectInfo.health <= 0 ) {

            objectInfo.moveDirection.x = 0;
            objectInfo.moveDirection.y = 0;

        }

        var speed = object.body.velocity.distanceTo( new CANNON.Vec3( 0, object.body.velocity.y, 0 ) );
        var maxSpeed = 3 * objectInfo.maxSpeed;

        if ( objectInfo.position !== false ) {

            object.body.position.x = objectInfo.position.x;
            object.body.position.z = objectInfo.position.z;

        }

        const rot = { x: 0, y: 0, z: 0 };
        object.body.quaternion.toEuler( rot );
        objectInfo.rotation = ( objectInfo.rotation !== false ) ? objectInfo.rotation : rot.y;
        object.body.quaternion.setFromEuler( 0, objectInfo.rotation, 0, 'XYZ' );

        //

        if ( objectInfo.moveDirection.y > 0 ) {

            object.body.angularVelocity.set( 0, 0.9, 0 );

        } else if ( objectInfo.moveDirection.y < 0 ) {

            object.body.angularVelocity.set( 0, - 0.9, 0 );

        } else {

            object.body.angularVelocity.y = 0; // /= 1 + 0.4 * delta / 60;

        }

        //

        if ( objectInfo.moveDirection.x !== 0 ) {

            if ( speed < maxSpeed ) {

                var forceAmount = objectInfo.power * ( 1 - speed / maxSpeed );
                var force = new CANNON.Vec3( 0, 0, forceAmount * delta / 60 );
                if ( objectInfo.moveDirection.x < 0 ) force = force.negate();
                object.body.applyLocalImpulse( force, new CANNON.Vec3( 0, 0, 0 ) );

            }

        } else {

            object.body.velocity.x /= 1 + 0.07 * delta / 60;
            object.body.velocity.z /= 1 + 0.07 * delta / 60;

        }

        if ( object.body.velocity.y > 0 ) {

            object.body.velocity.y = Math.min( object.body.velocity.y, 8 );

        } else {

            object.body.velocity.y = Math.max( object.body.velocity.y, - 50 );

        }

        //

        const velocityAngle = Math.atan2( object.body.velocity.x, object.body.velocity.z );
        const dv = object.body.velocity.length() * Math.sin( velocityAngle - objectInfo.rotation );
        object.body.applyLocalImpulse( new CANNON.Vec3( - object.body.mass * dv, 0, 0 ), new CANNON.Vec3( 0, 0, 0 ) );

        //

        var direction = ( objectInfo.moveDirection.x > 0 ) ? 0 : Math.PI;
        var vx = speed * Math.sin( objectInfo.rotation + direction );
        var vz = speed * Math.cos( objectInfo.rotation + direction );

        var forwardVelocity = new CANNON.Vec3( vx, 0, vz ).distanceTo( new CANNON.Vec3() );
        var movementDirection = Math.sign( object.body.velocity.x * Math.sin( objectInfo.rotation ) );

        //

        object['prevForwardVelocity'] = object['prevForwardVelocity'] || forwardVelocity;
        var dfv = forwardVelocity - object['prevForwardVelocity'];
        dfv = movementDirection * dfv;
        object['prevForwardVelocity'] = forwardVelocity;

        //

        objectsParams.push({
            id:             object.id,
            type:           object.objType,
            acceleration:   - Math.sign( dfv ) * Math.min( Math.abs( dfv ), 8 ) / 100 / Math.PI,
            position:       { x: object.body.position.x, y: object.body.position.y - 10, z: object.body.position.z },
            velocity:       forwardVelocity,
            rotation:       objectInfo.rotation
        });

    }

    //

    delta += deltaStack;

    while ( delta >= 32 ) {

        var d = 32;
        world.step( 1 / 30, d / 1000, 5 );
        delta -= d;

    }

    if ( delta ) {

        deltaStack = delta;

    }

    self.postMessage({ type: 'update', objects: objectsParams });

};

function initWorld () {

    // init world

    world = new CANNON.World();
    world.gravity.set( 0, -30, 0 );
    world.defaultContactMaterial.contactEquationStiffness = 200000;
    world.defaultContactMaterial.friction = 0;
    world.defaultContactMaterial.restitution = 0.2;
    world.solver.iterations = 20;

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

    addObject({ rotation: 0, position: new CANNON.Vec3(   1315, 0,      0 ), size: new CANNON.Vec3( 30, 100, 2630 ) }, 'box', false );
    addObject({ rotation: 0, position: new CANNON.Vec3( - 1315, 0,      0 ), size: new CANNON.Vec3( 30, 100, 2630 ) }, 'box', false );
    addObject({ rotation: 0, position: new CANNON.Vec3(      0, 0,   1315 ), size: new CANNON.Vec3( 2630, 100, 30 ) }, 'box', false );
    addObject({ rotation: 0, position: new CANNON.Vec3(      0, 0, - 1315 ), size: new CANNON.Vec3( 2630, 100, 30 ) }, 'box', false );

};

//

self.postMessage({ type: 'ready' });
