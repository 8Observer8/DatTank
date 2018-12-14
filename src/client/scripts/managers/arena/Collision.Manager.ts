/*
 * @author ohmed
 * DatTank Arena collision manager
*/

import * as OMath from '../../OMath/Core.OMath';

//

class CollisionManagerCore {

    private static instance: CollisionManagerCore;

    private worker: any;
    private objects: any = [];
    private lastUpdateTime: number = 0;
    public updateRate: number;

    //

    public addObject ( object: any, type: string, isDynamic: boolean ) : void {

        this.worker.postMessage({ type: 'addObject', object: {
                id:         object.id,
                type:       object.type,
                radius:     object.radius,
                size:       ( type === 'box' ) ? { x: object.size.x, y: object.size.y, z: object.size.z } : { x: 0, y: 0, z: 0 },
                position:   { x: object.position.x, y: object.position.y, z: object.position.z },
                rotation:   object.rotation,
            },
            shapeType: type,
            isDynamic,
        });

        this.objects.push( object );

    };

    public removeObject ( object: any ) : void {

        const newObjectList = [];

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.objects[ i ].type === object.type && this.objects[ i ].id === object.id ) continue;
            newObjectList.push( this.objects[ i ] );

        }

        this.objects = newObjectList;
        this.worker.postMessage({ type: 'removeObject', id: object.type + '-' + object.id });

    };

    public update ( time: number, delta: number ) : void {

        const objects = {};

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            const object = this.objects[ i ];
            if ( object.type !== 'Tank' ) continue;

            objects[ object.type + '-' + object.id ] = {
                speed:          object.speed,
                health:         object.health,
                position:       object.stateNeedsCorrect ? { x: object.positionCorrection.x, z: object.positionCorrection.z } : false,
                rotation:       object.stateNeedsCorrect ? object.rotationCorrection : false,
                moveDirection:  { x: object.moveDirection.x, y: object.moveDirection.y },
                maxSpeed:       object.hull.speedCoef * object.engine.maxSpeed,
                power:          object.engine.power,
            };

            //

            if ( object.stateNeedsCorrect ) {

                object.rotationCorrectValue = OMath.formatAngle( object.rotationCorrection - object.gfx.object.rotation.y );
                object.rotationCorrection = 0;

                object.positionCorrectValue.set( object.positionCorrection.x - object.gfx.object.position.x, object.positionCorrection.y - object.gfx.object.position.y, object.positionCorrection.z - object.gfx.object.position.z );
                object.positionCorrection.set( 0, 0, 0 );

                object.stateNeedsCorrect = false;

            }

        }

        //

        this.worker.postMessage({ type: 'update', objects });

    };

    private workerMessage ( event: any ) : void {

        switch ( event.data.type ) {

            case 'ready':

                this.worker.postMessage({ type: 'init' });
                break;

            case 'update':

                const objects = event.data.objects;
                this.lastUpdateTime = this.lastUpdateTime || Date.now();
                const delta = Date.now() - this.lastUpdateTime;

                for ( let i = 0, il = objects.length; i < il; i ++ ) {

                    const objParent = this.getObject( objects[ i ].id, objects[ i ].type );
                    if ( ! objParent ) continue;

                    objParent.acceleration = objects[ i ].acceleration;
                    objParent.velocity = objects[ i ].velocity;
                    objParent.updateMovement( delta, objects[ i ].directionVelocity, objects[ i ].angularVelocity );

                }

                this.lastUpdateTime = Date.now();
                this.updateRate = delta || 1;

                break;

        }

    };

    private getObject ( id: number, type: string ) : any {

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.objects[ i ].type + '-' + this.objects[ i ].id === type + '-' + id ) {

                return this.objects[ i ];

            }

        }

        return null;

    };

    public init () : void {

        this.worker = new Worker('/scripts/workers/Collision.Worker.js');
        this.worker.onmessage = this.workerMessage.bind( this );

    };

    //

    constructor () {

        if ( CollisionManagerCore.instance ) {

            return CollisionManagerCore.instance;

        }

        CollisionManagerCore.instance = this;

        //

        this.init();

    };

};

//

export let CollisionManager = new CollisionManagerCore();
