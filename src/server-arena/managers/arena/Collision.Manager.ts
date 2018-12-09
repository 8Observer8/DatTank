/*
 * @author ohmed
 * DatTank Collision manager sys
*/

import * as Cannon from 'cannon';

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';

//

export class CollisionManager {

    public arena: ArenaCore;

    private world: Cannon.World;
    private objects: any[] = [];

    //

    public raycast ( params: any ) : void {

        params.raycastResult = params.raycastResult || new Cannon.RaycastResult();
        params.ray = params.ray || new Cannon.Ray();

        const ray = params.ray;
        ray.from.set( params.position.x, params.position.y, params.position.z );
        ray.to.set( params.dPos * Math.cos( params.angle ) + params.position.x, params.position.y, params.dPos * Math.sin( params.angle ) + params.position.z );

        ray['intersectBodies']( this.world.bodies, params.raycastResult );

    };

    public isPlaceFree ( position: OMath.Vec3, radius: number, skip: number[] = [] ) : boolean {

        if ( Math.abs( position.x ) > 1250 || Math.abs( position.z ) > 1250 ) return false;

        let body;
        let shape;
        const n = this.world['narrowphase'];
        const dummyBody = new Cannon.Body({ mass: 0 });
        dummyBody.position.set( position.x, position.y, position.z );
        dummyBody.type = Cannon.Body.STATIC;
        dummyBody.collisionResponse = false;

        const dummyShape = new Cannon.Cylinder( radius, radius, 100, 8 );
        dummyBody.addShape( dummyShape );

        // Check bodies

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            body = this.objects[ i ].body;
            shape = body.shapes[0];

            if ( skip.indexOf( this.objects[ i ].parent.id ) !== -1 ) continue;

            if ( shape instanceof Cannon.Box ) {

                const tmpResult = n.result;
                n.result = [];
                n.currentContactMaterial = this.world.defaultContactMaterial;

                n['boxConvex']( shape, dummyShape, body.position, dummyBody.position, body.quaternion, dummyBody.quaternion, body, dummyBody );
                const result = n.result.length;
                n.result = tmpResult;
                n.currentContactMaterial = false;

                if ( result ) {

                    return false;

                }

            } else if ( shape instanceof Cannon.Cylinder ) {

                const tmpResult = n.result;
                n.result = [];
                n.currentContactMaterial = this.world.defaultContactMaterial;

                n['convexConvex']( shape, dummyShape, body.position, dummyBody.position, body.quaternion, dummyBody.quaternion, body, dummyBody );

                const result = n.result.length;
                n.result = tmpResult;
                n.currentContactMaterial = false;

                if ( result ) {

                    return false;

                }

            }

        }

        return true;

    };

    public addObject ( object: any, type: string = 'circle', isDynamic: boolean, onlyIntersect?: boolean ) : any {

        // if object is already in world and not yet removed remove immediately

        this.removeObject( object );

        //

        let shape;
        const collisionBox = {
            parent:     object,
            type,
            body:       new Cannon.Body({ mass: ( isDynamic ) ? 5000 : 0 }),
            sensor:     false,
            collision:  false,
        };

        if ( type === 'box' ) {

            shape = new Cannon.Box( new Cannon.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );
            collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );

        } else if ( type === 'circle' ) {

            shape = new Cannon.Cylinder( object.radius, object.radius, 100, 8 );
            collisionBox.body.quaternion.setFromEuler( - Math.PI / 2, 0, 0, 'XYZ' );

        }

        if ( onlyIntersect ) collisionBox.body.collisionResponse = false;

        collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );

        collisionBox.body['parent'] = object;
        collisionBox.body['name'] = object.type;
        collisionBox.body.addShape( shape as Cannon.Shape );
        collisionBox.body.type = ( ! isDynamic ) ? Cannon.Body.STATIC : Cannon.Body.DYNAMIC;

        if ( isDynamic ) {

            collisionBox.body.addEventListener( 'collide', this.collisionEvent.bind( this, object ) );

        }

        //

        this.world.addBody( collisionBox.body );
        this.objects.push( collisionBox );
        object.collisionBox = collisionBox;

        return collisionBox;

    };

    public removeObject ( object: any ) : void {

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.objects[ i ].parent.type + this.objects[ i ].parent.id === object.type + object.id ) {

                this.objects[ i ].needsToRemove = true;

            }

        }

    };

    public clear () : void {

        this.world.solver.removeAllEquations();

        const bodies = this.world.bodies;
        let i = bodies.length;

        while ( i -- ) {

            this.world.remove( bodies[ i ] );

        }

        this.objects.length = 0;

    };

    public update ( delta: number, time: number ) : void {

        this.cleanUpObjects();
        const coef = delta / 50;

        //

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            const object = this.objects[ i ];
            if ( ! object ) continue;

            if ( object.parent.type === 'Tank' ) {

                if ( object.parent.moveDirection.y > 0 ) {

                    object.body.angularVelocity.set( 0, 0.9, 0 );

                } else if ( object.parent.moveDirection.y < 0 ) {

                    object.body.angularVelocity.set( 0, - 0.9, 0 );

                } else {

                    object.body.angularVelocity.y = 0; // /= 1 + 0.4 * delta / 60;
                    // object.parent.network.updateMovement();

                }

                const rot = { x: 0, y: 0, z: 0 };
                object.body.quaternion.toEuler( rot );
                object.parent.rotation = rot.y;
                object.parent.rotation = Math.floor( object.parent.rotation * 1000 ) / 1000;
                object.body.quaternion.setFromEuler( 0, object.parent.rotation, 0, 'XYZ' );

                //

                let speed = object.body.velocity.distanceTo( new Cannon.Vec3( 0, object.body.velocity.y, 0 ) );
                const maxSpeed = object.parent.getMaxSpeed() * 3;
                const velocityAngle = Math.atan2( object.body.velocity.x, object.body.velocity.z );
                const movementDirection = Math.sign( object.body.velocity.x * Math.sin( object.parent.rotation ) );

                if ( object.parent.moveDirection.x !== 0 ) {

                    if ( speed < maxSpeed ) {

                        speed = ( movementDirection === object.parent.moveDirection.x ) ? speed : - speed;

                        const forceAmount = object.parent.getEnginePower() * ( 1 - speed / maxSpeed );
                        let force = new Cannon.Vec3( 0, 0, forceAmount * coef );
                        if ( object.parent.moveDirection.x < 0 ) force = force.negate();
                        object.body.applyLocalImpulse( force, new Cannon.Vec3( 0, 0, 0 ) );

                    }

                } else {

                    object.body.applyLocalImpulse( new Cannon.Vec3( 0, 0, - 0.05 * movementDirection * object.body.mass * object.body.velocity.length() * coef ), new Cannon.Vec3( 0, 0, 0 ) );

                }

                if ( object.body.velocity.y > 0 ) {

                    object.body.velocity.y = Math.min( object.body.velocity.y, 8 );

                } else {

                    object.body.velocity.y = Math.max( object.body.velocity.y, - 50 );

                }

                //

                const dv = object.body.velocity.length() * Math.sin( velocityAngle - object.parent.rotation );
                object.body.applyLocalImpulse( new Cannon.Vec3( - object.body.mass * dv * coef, 0, 0 ), new Cannon.Vec3( 0, 0, 0 ) );

                if ( Math.abs( object.body.velocity.x ) < 1 ) object.body.velocity.x = 0;
                if ( Math.abs( object.body.velocity.y ) < 1 ) object.body.velocity.y = 0;
                if ( Math.abs( object.body.velocity.z ) < 1 ) object.body.velocity.z = 0;

                //

                object.parent.position.set( object.body.position.x, object.body.position.y - 10, object.body.position.z );

            } else if ( object.parent.type === 'Bullet' ) {

                if ( object.parent.active === false ) {

                    this.removeObject( object.parent );
                    continue;

                }

                if ( OMath.Vec3.dist( object.parent.position, object.parent.startPosition ) > object.parent.range ) {

                    object.parent.detonate( null, null );
                    return;

                }

                if ( object.body.velocity.distanceTo( new Cannon.Vec3( 0, object.body.velocity.y, 0 ) ) === 0 ) {

                    const bulletSpeed = 1200;
                    object.body.velocity.set( bulletSpeed * Math.sin( object.parent.angle ), 0, bulletSpeed * Math.cos( object.parent.angle ) );

                }

                object.body.velocity.y = 0;
                object.parent.position.set( object.body.position.x, object.body.position.y, object.body.position.z );

            }

        }

        //

        this.world.step( 1 / 60, delta / 1000, 5 );

    };

    //

    private cleanUpObjects () : void {

        const newObjectList = [];

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.objects[ i ].needsToRemove ) {

                this.world.remove( this.objects[ i ].body );
                continue;

            }

            newObjectList.push( this.objects[ i ] );

        }

        this.objects = newObjectList;

    };

    private collisionEvent ( object: any, event: any ) : void {

        if ( event.body['name'] === 'ground' ) return;

        if ( object.type === 'Tank' ) {

            object.network.syncState();

        }

        if ( event.body['name'] === 'Box' && object.type === 'Tank' ) {

            if ( event.body.parent.removed || object.health <= 0 ) return;
            event.body.parent.pickUp( object );

        }

        if ( object.type === 'Bullet' && event.body.collisionResponse === true ) {

            if ( ! object.active ) return;

            if ( object.owner.id !== event.body.parent.id ) {

                object.detonate( event.body.parent, event.target.position );

            }

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

        // init world

        this.world = new Cannon.World();
        this.world.gravity.set( 0, -30, 0 );
        this.world.defaultContactMaterial.contactEquationStiffness = 500000;
        this.world.defaultContactMaterial.friction = 0;
        this.world.defaultContactMaterial.restitution = 0.2;
        this.world.solver.iterations = 20;

        // add ground

        const groundShape = new Cannon.Plane();
        const groundBody = new Cannon.Body({ mass: 0 });
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

};
