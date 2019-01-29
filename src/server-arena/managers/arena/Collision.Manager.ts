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

    public getObjectsCount () : number {

        return this.objects.length;

    };

    public raycast ( params: any ) : void {

        const ray = params.ray as Cannon.Ray;
        ray.from.set( params.position.x, params.position.y - 20, params.position.z );
        ray.to.set( params.dPos * Math.cos( params.angle ) + params.position.x, params.position.y - 20, params.dPos * Math.sin( params.angle ) + params.position.z );
        ray['_updateDirection']();
        ray['intersectBodies']( this.world.bodies );

    };

    public isPlaceFree ( position: OMath.Vec3, radius: number, skip: number[] = [], ignoreBoxes: boolean = false ) : boolean {

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

            if ( this.objects[ i ].parent.type === 'Box' && ignoreBoxes ) continue;

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
            type,
            parent:         object,
            body:           new Cannon.Body({ mass: ( isDynamic ) ? 5000 : 0 }),
            sensor:         false,
            collision:      false,
            needsToRemove:  false,
        };

        if ( type === 'box' ) {

            shape = new Cannon.Box( new Cannon.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );
            collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );
            collisionBox.body.addShape( shape as Cannon.Shape );

        } else if ( type === 'circle' ) {

            shape = new Cannon.Cylinder( object.radius, object.radius, 100, 8 );
            const q = new Cannon.Quaternion().setFromEuler( - Math.PI / 2, 0, 0, 'XYZ' );
            collisionBox.body.addShape( shape, new Cannon.Vec3(), q );

        } else if ( type === 'tank' ) {

            shape = new Cannon.Box( new Cannon.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );
            collisionBox.body.addShape( shape as Cannon.Shape, new Cannon.Vec3( 0, 0, 0 ) );

            const q = new Cannon.Quaternion().setFromEuler( - Math.PI / 2, 0, 0, 'XYZ' );

            shape = new Cannon.Cylinder( 0.55 * object.size.x, 0.55 * object.size.x, object.size.y / 2, 8 );
            collisionBox.body.addShape( shape, new Cannon.Vec3( 0, 0, object.size.z / 3 ), q );

            shape = new Cannon.Cylinder( 0.55 * object.size.x, 0.55 * object.size.x, object.size.y / 2, 8 );
            collisionBox.body.addShape( shape, new Cannon.Vec3( 0, 0, - object.size.z / 3 ), q );

            collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );
            collisionBox.body.angularDamping = 0.97;

        }

        if ( onlyIntersect ) collisionBox.body.collisionResponse = false;

        collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );

        collisionBox.body['parent'] = object;
        collisionBox.body['name'] = object.type;
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

        this.world.step( 1 / 20, delta / 1000, 5 );

        //

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            const object = this.objects[ i ];
            if ( ! object ) continue;

            //

            if ( object.parent.type === 'Tank' ) {

                if ( object.parent.moveDirection.y > 0 ) {

                    const force = new Cannon.Vec3( 0, 0, 65000 * coef );
                    object.body.applyLocalImpulse( force.negate(), new Cannon.Vec3(   5, 0, 0 ) );
                    object.body.applyLocalImpulse( force, new Cannon.Vec3( - 5, 0, 0 ) );

                } else if ( object.parent.moveDirection.y < 0 ) {

                    const force = new Cannon.Vec3( 0, 0, 65000 * coef );
                    object.body.applyLocalImpulse( force, new Cannon.Vec3(   5, 0, 0 ) );
                    object.body.applyLocalImpulse( force.negate(), new Cannon.Vec3( - 5, 0, 0 ) );

                }

                //

                const rot = { x: 0, y: 0, z: 0 };
                object.body.quaternion.toEuler( rot );
                object.parent.rotation = rot.y;

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

                //

                const dv = object.body.velocity.length() * Math.sin( velocityAngle - object.parent.rotation );
                object.body.applyLocalImpulse( new Cannon.Vec3( - 0.6 * object.body.mass * dv * coef, 0, 0 ), new Cannon.Vec3( 0, 0, 0 ) );

                //

                object.parent.position.set( object.body.position.x, object.body.position.y, object.body.position.z );

            } else if ( object.parent.type === 'Bullet' ) {

                if ( object.parent.active === false ) {

                    this.removeObject( object.parent );
                    continue;

                }

                if ( OMath.Vec3.dist( object.parent.position, object.parent.startPosition ) > object.parent.range ) {

                    object.parent.detonate( null, null );
                    continue;

                }

                //

                const bulletSpeed = 1200;
                object.body.velocity.set( bulletSpeed * Math.sin( object.parent.angle ), 0, bulletSpeed * Math.cos( object.parent.angle ) );
                object.parent.position.set( object.body.position.x, object.body.position.y, object.body.position.z );

            }

        }

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
        this.world.gravity.set( 0, - 30, 0 );
        this.world.defaultContactMaterial.contactEquationStiffness = 500000;
        this.world.defaultContactMaterial.friction = 0;
        this.world.defaultContactMaterial.restitution = 0.2;
        this.world.solver.iterations = 5;

        // add ground

        const groundShape = new Cannon.Plane();
        const groundBody = new Cannon.Body({ mass: 0 });
        groundBody['name'] = 'ground';
        groundBody.addShape( groundShape );
        groundBody.quaternion.setFromAxisAngle( new Cannon.Vec3( 1, 0, 0 ), - Math.PI / 2 );
        this.world.addBody( groundBody );

        // add map borders

        this.addObject( { rotation: 0, position: new OMath.Vec3(   1330, 0,      0 ), size: new OMath.Vec3( 60, 1000, 2630 ) }, 'box', false );
        this.addObject( { rotation: 0, position: new OMath.Vec3( - 1330, 0,      0 ), size: new OMath.Vec3( 60, 1000, 2630 ) }, 'box', false );
        this.addObject( { rotation: 0, position: new OMath.Vec3(      0, 0,   1330 ), size: new OMath.Vec3( 2630, 1000, 60 ) }, 'box', false );
        this.addObject( { rotation: 0, position: new OMath.Vec3(      0, 0, - 1330 ), size: new OMath.Vec3( 2630, 1000, 60 ) }, 'box', false );

    };

};
