/*
 * @author ohmed
 * DatTank Collision manager sys
*/

import * as Cannon from "cannon";

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";

//

class CollisionManager {

    public arena: ArenaCore;

    private world: Cannon.World;
    private objects: Array<any> = [];

    //

    public isPlaceFree ( position: OMath.Vec3, radius: number ) {

        let body, shape;
        let n = this.world['narrowphase'];
        let dummyBody = new Cannon.Body({ mass: 0 });
        dummyBody.position.set( position.x, position.y, position.z );
        dummyBody.type = Cannon.Body.STATIC;
        dummyBody.collisionResponse = false;

        let dummyShape = new Cannon.Box( new Cannon.Vec3( radius / 2, 100, radius / 2 ) );
        dummyBody.addShape( dummyShape );

        // Check bodies

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            body = this.objects[ i ].body;
            shape = body.shapes[0];

            if ( shape instanceof Cannon.Box ) {

                let tmpResult = n.result;
                n.result = [];
                n.currentContactMaterial = this.world.defaultContactMaterial;

                n['boxBox']( shape, dummyShape, body.position, dummyBody.position, body.quaternion, dummyBody.quaternion, body, dummyBody );

                let result = n.result.length;
                n.result = tmpResult;
                n.currentContactMaterial = false;

                if ( result ) {

                    return false;

                }

            }

        }

        return true;

    };

    public addObject ( object: any, type: string = 'circle', isDynamic: boolean, onlyIntersect?: boolean ) {

        let shape;
        let collisionBox = {
            parent:     object,
            type:       type,
            body:       new Cannon.Body({ mass: ( isDynamic ) ? 1000 : 0 }),
            sensor:     false,
            collision:  false
        };

        if ( type === 'box' ) {

            shape = new Cannon.Box( new Cannon.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );

        } else if ( type === 'circle' ) {

            shape = new Cannon.Cylinder( object.radius, object.radius, 20, 8 );

        }

        if ( onlyIntersect ) collisionBox.body.collisionResponse = false;

        collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );
        collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );

        collisionBox.body['parent'] = object;
        collisionBox.body['name'] = object.type;
        collisionBox.body.addShape( shape );
        collisionBox.body.type = ( ! isDynamic ) ? Cannon.Body.STATIC : Cannon.Body.DYNAMIC;

        if ( isDynamic ) {

            collisionBox.body.addEventListener( 'collide', this.collisionEvent.bind( this, object ) );

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

    public clear () {

        // this.world.clear();
        this.objects = null;

    };

    public update ( delta: number, time: number ) {

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

                if ( speed > 5 && object.parent.moveDirection.x !== 0 ) {

                    object.body.velocity.x += ( vx - object.body.velocity.x ) / 8 * ( delta / 20 );
                    object.body.velocity.z += ( vz - object.body.velocity.z ) / 8 * ( delta / 20 );

                }

                //

                object.parent.position.set( object.body.position.x, object.body.position.y - 10, object.body.position.z );
                object.body.quaternion.setFromEuler( 0, object.parent.rotation, 0, 'XYZ' );

            }

        }

        //

        this.world.step( delta / 1000 );

    };

    //

    private collisionEvent ( object: any, event: any ) {

        if ( event.body['name'] === 'ground' ) return;

        if ( event.body['name'] === 'Box' && object.type === 'Tank' ) {

            event.body.parent.pickUp( object );
            this.arena.boxManager.remove( event.body.parent );

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

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

    };

};

//

export { CollisionManager };
