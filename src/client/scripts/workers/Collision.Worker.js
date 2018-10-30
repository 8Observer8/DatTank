
importScripts( '/libs/Cannon.js' );

//

var world;
var objects = [];
var inited = false;
var lastUpdate = 0;
var coef = 0;
var delta = 0;

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
            coef = delta / 20;
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

    } else if ( type === 'circle' ) {

        shape = new CANNON.Cylinder( object.radius, object.radius, 40, 6 );

    }

    collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );
    collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );

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

            object.body.velocity.set( 0, 0, 0 );

        } else {

            var speed = object.body.velocity.distanceTo( new CANNON.Vec3( 0, object.body.velocity.y, 0 ) );

            object.body.position.x += objectInfo.posCorrection.x;
            object.body.position.z += objectInfo.posCorrection.z;

            if ( speed < objectInfo.maxSpeed && objectInfo.moveDirection.x ) {

                var forceAmount = objectInfo.power * ( 1 - speed / objectInfo.maxSpeed );
                var force = new CANNON.Vec3( 0, 0, forceAmount );
                if ( objectInfo.moveDirection.x < 0 ) force = force.negate();
                object.body.applyLocalImpulse( force, new CANNON.Vec3( 0, 0, 0 ) );

            } else {

                object.body.velocity.x /= 1 + 0.05 * coef;
                object.body.velocity.z /= 1 + 0.05 * coef;

            }

            if ( object.body.velocity.y > 0 ) {

                object.body.velocity.y = Math.min( object.body.velocity.y, 4 );

            } else {

                object.body.velocity.y = Math.max( object.body.velocity.y, - 4 );

            }

            var direction = ( objectInfo.moveDirection.x > 0 ) ? 0 : Math.PI;
            var vx = speed * Math.sin( objectInfo.rotation + direction );
            var vz = speed * Math.cos( objectInfo.rotation + direction );
            var forwardVelocity = new CANNON.Vec3( vx, 0, vz ).distanceTo( new CANNON.Vec3() );
            var movementDirection = Math.sign( object.body.velocity.x * Math.sin( objectInfo.rotation ) );

            if ( speed > 5 && objectInfo.moveDirection.x !== 0 ) {

                object.body.velocity.x += ( vx - object.body.velocity.x ) / 8 * coef;
                object.body.velocity.z += ( vz - object.body.velocity.z ) / 8 * coef;

            }

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
                position:       { x: object.body.position.x, y: object.body.position.y - 10, z: object.body.position.z }
            });

            //

            object.body.quaternion.setFromEuler( 0, objectInfo.rotation, 0, 'XYZ' );

        }

    }

    world.step( 1 / 60, delta / 1000, 5 );

    self.postMessage({ type: 'update', objects: objectsParams });

};

function initWorld () {

    // init world

    world = new CANNON.World();
    world.gravity.set( 0, -9.8, 0 );
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
