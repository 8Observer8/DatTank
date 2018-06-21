/*
 * @author ohmed
 * DatTank Collision manager sys
*/

import * as Cannon from "cannon";
import * as p2 from "p2";

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";

//

class CollisionManager {

    public arena: ArenaCore;

    private world: Cannon.World;
    private objects: Array<any> = [];

    //

    public isPlaceFree ( position: OMath.Vec3, radius: number ) {

        // let body, shape;
        // let n = this.world.narrowphase;
        // let dummyBody = new p2.Body({ position: [ position.x, position.z ] });
        // let dummyShape = new p2.Circle({ radius: radius });
        // dummyBody.addShape( dummyShape );

        // let hitTestVec = p2.vec2.create();

        // // Check bodies

        // for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

        //     body = this.objects[ i ].body;

        //     for ( let j = 0, jl = body.shapes.length; j !== jl; j ++ ) {

        //         shape = body.shapes[ j ];

        //         // Get shape world position + angle

        //         p2.vec2.rotate( hitTestVec, shape.position, body.angle );
        //         p2.vec2.add( hitTestVec, hitTestVec, body.position );

        //         let angle = shape.angle + body.angle;

        //         if ( ( shape instanceof p2.Circle && n['circleCircle']( dummyBody, dummyShape, dummyBody.position, 0, body, shape, body.position, 0, true ) ) ||
        //              ( shape instanceof p2.Convex && n['circleConvex']( dummyBody, dummyShape, dummyBody.position, 0, body, shape, body.position, angle, true ) ) ) {

        //             return false;

        //         }

        //     }

        // }

        return true;

    };

    public addObject ( object: any, type: string = 'circle', isDynamic: boolean ) {

        let shape;
        let collisionBox = {
            parent:     object,
            type:       type,
            body:       new Cannon.Body({ mass: ( isDynamic ) ? 100 : 0 }),
            sensor:     false,
            collision:  false
        };

        if ( type === 'box' ) {

            shape = new Cannon.Box( new Cannon.Vec3( object.size.x / 2, 10, object.size.z / 2 ) );

        } else if ( type === 'circle' ) {

            shape = new Cannon.Cylinder( object.radius, object.radius, 20, 8 );

        }

        collisionBox.body.position.set( object.position.x, 40, object.position.z );
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

                this.world.removeBody( this.objects[ i ].body );
                continue;

            }

            newObjectList.push( this.objects[ i ] );

        }

        this.objects = newObjectList;

    };

    public clear () {

        this.world.clear();
        this.objects = null;

    };

    public update ( delta: number, time: number ) {

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            let object = this.objects[ i ];
            if ( ! object ) continue;

            if ( object.parent.type === 'Tank' ) {

                let velocity = new Cannon.Vec3();
                object.body.getVelocityAtWorldPoint( new Cannon.Vec3( 0, 0, 0 ), velocity );

                if ( velocity.distanceTo( new Cannon.Vec3() ) < 300 && object.parent.moveDirection.x ) {
                
                    let forceAmount = 1000;
                    let force = new Cannon.Vec3( forceAmount * Math.sin( object.parent.rotation ), 0, forceAmount * Math.cos( object.parent.rotation ) );
                    if ( object.parent.moveDirection.x < 0 ) force = force.negate();
                    object.body.applyLocalImpulse( force, new Cannon.Vec3( 0, 0, 0 ), delta );
                    console.log( force, object.body.position, velocity.distanceTo( new Cannon.Vec3() ) );

                } else {

                    object.body.velocity.x /= 2;
                    object.body.velocity.y /= 2;
                    object.body.velocity.z /= 2;

                }

                object.parent.position.set( object.body.position.x, object.body.position.y, object.body.position.z );

            }

        //         object.body.position[0] = ( object.parent.deltaPosition ) ? object.parent.position.x + 3 * object.parent.deltaPosition.x : object.parent.position.x;
        //         object.body.position[1] = ( object.parent.deltaPosition ) ? object.parent.position.z + 3 * object.parent.deltaPosition.z : object.parent.position.z;
        //         object.body.angle = object.parent.rotation;

        //     } else if ( object.parent.type === 'Bullet' ) {

        //         if ( object.parent.active ) {

        //             object.parent.update( delta );
        //             object.body.position[0] = object.parent.position.x;
        //             object.body.position[1] = object.parent.position.z;

        //             if ( Math.abs( object.body.position[0] ) > 1270 || Math.abs( object.body.position[1] ) > 1270 ) {

        //                 object.parent.detonate();

        //             }

        //         }

        //     }

        }

        //

        this.world.step( delta / 1000 );

        //

        // for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

        //     object = this.objects[ i ];

        //     if ( object.parent.type !== 'Tank' ) continue;

        //     if ( Math.abs( object.parent.position.x + object.parent.deltaPosition.x ) > 1270 ||
        //          Math.abs( object.parent.position.z + object.parent.deltaPosition.z ) > 1270 ) {

        //         object.parent.setMovement( 0, object.parent.moveDirection.y );
        //         continue;

        //     }

        //     if ( ! object.collision && object.parent.deltaPosition ) {

        //         object.parent.position.x += object.parent.deltaPosition.x;
        //         object.parent.position.z += object.parent.deltaPosition.z;

        //         object.parent.deltaPosition.x = 0;
        //         object.parent.deltaPosition.z = 0;

        //     } else {

        //         object.parent.setMovement( 0, object.parent.moveDirection.y );

        //     }

        // }

    };

    //

    private collisionStart ( event: any ) {

        let object, target, obstacle;

        for ( let i = 0; i < this.objects.length; i ++ ) {

            object = this.objects[ i ];

            if ( event.bodyA === object.body || event.bodyB === object.body ) {

                obstacle = ( event.bodyA === object.body ) ? event.bodyB : event.bodyA;

                if ( object.parent.type === 'Tank' && obstacle.parent.type !== 'Bullet' && obstacle.parent.type !== 'Box' ) {

                    object.collision = true;

                } else if ( object.parent.type === 'Bullet' && object.parent.active && obstacle.parent.type !== 'Box' ) {

                    target = ( event.bodyA == object.body ) ? event.bodyB : event.bodyA;
                    if ( target.parent.type !== 'Bullet' ) {

                        object.parent.detonate( target.parent );

                    }

                } else if ( object.parent.type === 'Tank' && obstacle.parent.type === 'Box' && ! obstacle.parent.removed ) {

                    obstacle.parent.pickUp( object.parent );
                    this.arena.boxManager.remove( obstacle.parent );

                }

            }

        }

    };

    private collisionEnd ( event: any ) {

        let object, obstacle;

        for ( let i = 0; i < this.objects.length; i ++ ) {

            object = this.objects[ i ];

            if ( event.bodyA === object.body || event.bodyB === object.body ) {

                obstacle = ( event.bodyA === object.body ) ? event.bodyB : event.bodyA;

                if ( object.parent.type === 'Tank' && obstacle.parent.type !== 'Bullet' ) {

                    object.collision = false;

                }

            }

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

        // init world

        this.world = new Cannon.World();
        this.world.gravity.set( 0, -9.82, 0 );

        // add ground

        let groundShape = new Cannon.Plane();
        let groundBody = new Cannon.Body({ mass: 0 });
        groundBody['name'] = 'ground';
        groundBody.addShape( groundShape );
        groundBody.quaternion.setFromAxisAngle( new Cannon.Vec3( 1, 0, 0 ), - Math.PI / 2 );
        this.world.addBody( groundBody );

        // this.world = new p2.World({ gravity: [ 0, 0 ] });
        // this.world.applyDamping = false;
        // this.world.applyGravity = false;
        // this.world.applySpringForces = false;

    };

};

//

export { CollisionManager };
