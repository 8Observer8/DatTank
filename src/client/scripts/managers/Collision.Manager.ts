/*
 * @author ohmed
 * DatTank Arena collision manager
*/


import * as Cannon from "cannon";
import * as THREE from "three";
import * as OMath from "./../OMath/Core.OMath";

import { GfxCore } from "./../graphics/Core.Gfx";

//

class CollisionManagerCore {

    private static instance: CollisionManagerCore;

    private world: Cannon.World;
    private objects: Array<any> = [];

    //

    public addObject ( object, type, isDynamic ) {

        let shape;
        let collisionBox = {
            parent:     object,
            type:       type,
            body:       new Cannon.Body({ mass: ( isDynamic ) ? 1000 : 0 }),
            sensor:     false,
            collision:  false,
            visualObj:  null
        };

        if ( type === 'box' ) {

            shape = new Cannon.Box( new Cannon.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );

            // collision box

            let visualObj = new THREE.Mesh( new THREE.BoxGeometry( object.size.x, object.size.y, object.size.z ), new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.2, transparent: true }) );
            // GfxCore.scene.add( visualObj );
            collisionBox.visualObj = visualObj;

        } else if ( type === 'circle' ) {

            shape = new Cannon.Cylinder( object.radius, object.radius, 40, 6 );

            // collision cylinder

            let visualObj = new THREE.Mesh( new THREE.CylinderGeometry( object.radius, object.radius, 40 ), new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.2, transparent: true }) );
            // GfxCore.scene.add( visualObj );
            collisionBox.visualObj = visualObj;

        }

        collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );
        collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );

        collisionBox.body['parent'] = object;
        collisionBox.body['name'] = object.type;
        collisionBox.body.addShape( shape );
        collisionBox.body.type = ( ! isDynamic ) ? Cannon.Body.STATIC : Cannon.Body.DYNAMIC;

        if ( isDynamic ) {

            collisionBox.body.addEventListener( 'collide', function ( e ) {

                if ( e.body['name'] !== 'ground' ) {

                    console.log( collisionBox.body['name'], e.body['name'] );

                }

            });

        }

        //

        this.world.addBody( collisionBox.body );
        this.objects.push( collisionBox );
        object.collisionBox = collisionBox;

    };

    public removeObject ( object: any ) {

        let newObjectList = [];

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.objects[ i ].parent.type + this.objects[ i ].parent.id === object.type + object.id ) {

                this.world.remove( this.objects[ i ].body );
                continue;

            }

            newObjectList.push( this.objects[ i ] );

        }

        this.objects = newObjectList;

    };

    public update ( time: number, delta: number ) {

        if ( delta === 0 ) return;

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            let object = this.objects[ i ];
            if ( ! object ) continue;

            if ( object.parent.type === 'Tank' ) {

                let speed = object.body.velocity.distanceTo( new Cannon.Vec3( 0, object.body.velocity.y, 0 ) );

                if ( speed < 140 && object.parent.moveDirection.x ) {

                    let forceAmount = 5000 * ( 1 - speed / 140 );
                    let force = new Cannon.Vec3( 0, 0, forceAmount );
                    if ( object.parent.moveDirection.x < 0 ) force = force.negate();
                    object.body.applyLocalImpulse( force, new Cannon.Vec3( 0, 0, 0 ), delta );

                } else {

                    object.body.velocity.x /= 1 + 0.05 * ( delta / 20 );
                    object.body.velocity.z /= 1 + 0.05 * ( delta / 20 );

                }

                let direction = ( object.parent.moveDirection.x > 0 ) ? 0 : Math.PI;
                let vx = speed * Math.sin( object.parent.rotation + direction );
                let vz = speed * Math.cos( object.parent.rotation + direction );
                let forwardVelocity = new Cannon.Vec3( vx, 0, vz ).distanceTo( new Cannon.Vec3() );
                let movementDirecton = Math.sign( object.body.velocity.x * Math.sin( object.parent.rotation ) );

                if ( speed > 5 && object.parent.moveDirection.x !== 0 ) {

                    object.body.velocity.x += ( vx - object.body.velocity.x ) / 8 * ( delta / 20 );
                    object.body.velocity.z += ( vz - object.body.velocity.z ) / 8 * ( delta / 20 );

                }

                //

                let dfv = forwardVelocity - object.parent['prevForwardVelocity'];
                dfv = movementDirecton * dfv;
                object.parent.gfx.rotateTankXAxis( - Math.sign( dfv ) * Math.min( Math.abs( dfv ), 8 ) / 100 / Math.PI );
                object.parent['prevForwardVelocity'] = forwardVelocity;

                //

                object.parent.position.set( object.body.position.x, object.body.position.y - 10, object.body.position.z );
                object.body.quaternion.setFromEuler( 0, object.parent.rotation, 0, 'XYZ' );

            }

            object.visualObj.position.set( object.body.position.x, object.body.position.y + ( ( object.parent.size ) ? object.parent.size.y / 2 : 40 ), object.body.position.z );
            object.visualObj.quaternion.set( object.body.quaternion.x, object.body.quaternion.y, object.body.quaternion.z, object.body.quaternion.w );

        }

        this.world.step( delta / 1000 );

    };

    public init () {

        // init world

        this.world = new Cannon.World();
        this.world.gravity.set( 0, -20, 0 );
        this.world.defaultContactMaterial.contactEquationStiffness = 200000;
        this.world.defaultContactMaterial.friction = 0;

        // add ground

        let groundShape = new Cannon.Plane();
        let groundBody = new Cannon.Body({ mass: 0 });
        groundBody['name'] = 'ground';
        groundBody.addShape( groundShape );
        groundBody.quaternion.setFromAxisAngle( new Cannon.Vec3( 1, 0, 0 ), - Math.PI / 2 );
        this.world.addBody( groundBody );

        // add map borders

        this.addObject( { rotation: 0, position: new OMath.Vec3(   1315, 0,      0 ), size: new OMath.Vec3( 30, 100, 2630 ) }, 'box', false );
        this.addObject( { rotation: 0, position: new OMath.Vec3( - 1315, 0,      0 ), size: new OMath.Vec3( 30, 100, 2630 ) }, 'box', false );
        this.addObject( { rotation: 0, position: new OMath.Vec3(      0, 0,   1315 ), size: new OMath.Vec3( 2630, 100, 30 ) }, 'box', false );
        this.addObject( { rotation: 0, position: new OMath.Vec3(      0, 0, - 1315 ), size: new OMath.Vec3( 2630, 100, 30 ) }, 'box', false );

    };

    //

    constructor () {

        if ( CollisionManagerCore.instance ) {

            return CollisionManagerCore.instance;

        }

        CollisionManagerCore.instance = this;

    };

};

//

export let CollisionManager = new CollisionManagerCore();
