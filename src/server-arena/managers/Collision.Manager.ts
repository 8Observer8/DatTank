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
            body:       new Cannon.Body({ mass: ( isDynamic ) ? 1000 : 0 }),
            sensor:     false,
            collision:  false
        };

        if ( type === 'box' ) {

            shape = new Cannon.Box( new Cannon.Vec3( object.size.x / 2, object.size.y / 2, object.size.z / 2 ) );

        } else if ( type === 'circle' ) {

            shape = new Cannon.Cylinder( object.radius, object.radius, 20, 8 );

        }

        collisionBox.body.position.set( object.position.x, object.position.y, object.position.z );
        collisionBox.body.quaternion.setFromEuler( 0, object.rotation, 0, 'XYZ' );

        collisionBox.body['parent'] = object;
        collisionBox.body['name'] = object.type;
        collisionBox.body.addShape( shape );
        collisionBox.body.type = ( ! isDynamic ) ? Cannon.Body.STATIC : Cannon.Body.DYNAMIC;

        if ( isDynamic ) {

            collisionBox.body.addEventListener( 'collide', function ( e: any ) {

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

        // for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

        //     if ( this.objects[ i ].parent.type + this.objects[ i ].parent.id === object.type + object.id ) {

        //         this.world.removeBody( this.objects[ i ].body );
        //         continue;

        //     }

        //     newObjectList.push( this.objects[ i ] );

        // }

        // this.objects = newObjectList;

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
