/*
 * @author ohmed
 * DatTank Collision manager sys
*/

import * as p2 from "p2";

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";

//

class CollisionManager {

    public arena: ArenaCore;

    private world: p2.World;
    private objects: Array<any> = [];

    //

    public isPlaceFree ( position: OMath.Vec3, radius: number ) {

        let body, shape;
        let n = this.world.narrowphase;
        let dummyBody = new p2.Body({ position: [ position.x, position.y ] });
        let dummyShape = new p2.Circle({ radius: radius });
        dummyBody.addShape( dummyShape );

        let hitTestVec = p2.vec2.create();

        // Check bodies

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            body = this.objects[ i ].body;

            for ( let j = 0, jl = body.shapes.length; j !== jl; j ++ ) {

                shape = body.shapes[ j ];

                // Get shape world position + angle

                p2.vec2.rotate( hitTestVec, shape.position, body.angle );
                p2.vec2.add( hitTestVec, hitTestVec, body.position );

                let angle = shape.angle + body.angle;

                if ( ( shape instanceof p2.Circle && n['circleCircle']( dummyBody, dummyShape, dummyBody.position, 0, body, shape, body.position, 0, true ) ) ||
                     ( shape instanceof p2.Convex && n['circleConvex']( dummyBody, dummyShape, dummyBody.position, 0, body, shape, body.position, angle, true ) ) ) {

                    return false;

                }

            }

        }

        return true;

    };

    public addObject ( object: any, type: string = 'circle', isDynamic: boolean ) {

        let shape;
        let collisionBox = {
            parent:     object,
            type:       type,
            body:       new p2.Body({ mass: ( isDynamic ) ? 1000 : 0, position: [ object.position.x, object.position.z ] }),
            sensor:     false,
            collision:  false
        };

        if ( type === 'box' ) {

            shape = new p2.Box({ width: object.sizeX, height: object.sizeZ });

        } else if ( type === 'circle' ) {

            shape = new p2.Circle({ radius: object.radius });

        }

        collisionBox.body['parent'] = object;
        collisionBox.body.damping = 0;
        collisionBox.sensor = true;
        shape.sensor = true;
        collisionBox.body.addShape( shape );

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

        let object;

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            object = this.objects[ i ];
            if ( ! object ) continue;

            if ( object.parent.type === 'Tank' ) {

                object.body.position[0] = ( object.parent.deltaPosition ) ? object.parent.position.x + 3 * object.parent.deltaPosition.x : object.parent.position.x;
                object.body.position[1] = ( object.parent.deltaPosition ) ? object.parent.position.z + 3 * object.parent.deltaPosition.z : object.parent.position.z;
                object.body.angle = object.parent.rotation;

            } else if ( object.parent.type === 'Bullet' ) {

                if ( object.parent.active ) {

                    object.parent.update( delta );
                    object.body.position[0] = object.parent.position.x;
                    object.body.position[1] = object.parent.position.z;

                    if ( Math.abs( object.body.position[0] ) > 1270 || Math.abs( object.body.position[1] ) > 1270 ) {

                        object.parent.detonate();

                    }

                }

            }

        }

        //

        this.world.step( delta / 1000 );

        //

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            object = this.objects[ i ];

            if ( object.parent.type !== 'Tank' ) continue;

            if ( Math.abs( object.parent.position.x + object.parent.deltaPosition.x ) > 1270 ||
                 Math.abs( object.parent.position.z + object.parent.deltaPosition.z ) > 1270 ) {

                object.parent.move( 0, object.parent.moveDirection.y );
                continue;

            }

            if ( ! object.collision && object.parent.deltaPosition ) {

                object.parent.position.x += object.parent.deltaPosition.x;
                object.parent.position.z += object.parent.deltaPosition.z;

                object.parent.deltaPosition.x = 0;
                object.parent.deltaPosition.z = 0;

            } else {

                object.parent.move( 0, object.parent.moveDirection.y );

            }

        }

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

                        object.parent.explode( target.parent );

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

        this.world = new p2.World({ gravity: [ 0, 0 ] });
        this.world.applyDamping = false;
        this.world.applyGravity = false;
        this.world.applySpringForces = false;

        this.world.on( 'beginContact', this.collisionStart, this );
        this.world.on( 'endContact', this.collisionEnd, this );

    };

};

//

export { CollisionManager };
