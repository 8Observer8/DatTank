/*
 * @author ohmed
 * DatTank Arena collision manager
*/

class CollisionManagerCore {

    private static instance: CollisionManagerCore;

    private worker: any;
    private objects = [];
    private lastUpdateTime: number = 0;
    public updateRate: number = 40;

    //

    public addObject ( object, type, isDynamic ) {

        this.worker.postMessage({ type: 'addObject', object: {
                id: object.id,
                type: object.type,
                radius: object.radius,
                size: { x: object.size.x, y: object.size.y, z: object.size.z },
                position: { x: object.position.x, y: object.position.y, z: object.position.z },
                rotation: object.rotation
            },
            shapeType: type,
            isDynamic: isDynamic
        });

        this.objects.push( object );

    };

    public removeObject ( object: any ) {

        let newObjectList = [];

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.objects[ i ].type === object.type && this.objects[ i ].id === object.id ) continue;
            newObjectList.push( this.objects[ i ] );

        }

        this.objects = newObjectList;

        this.worker.postMessage({ type: 'removeObject', id: object.type + '-' + object.id });

    };

    public update ( time: number, delta: number ) {

        let objects = {};
        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            let object = this.objects[ i ];
            if ( object.type !== 'Tank' ) continue;

            objects[ object.type + '-' + object.id ] = {
                speed: object.speed,
                health: object.health,
                rotation: object.rotation,
                moveDirection: { x: object.moveDirection.x, y: object.moveDirection.y },
                posCorrection: { x: object.positionCorrectionDelta.x, y: object.positionCorrectionDelta.y, z: object.positionCorrectionDelta.z }
            };

            object.positionCorrection.x -= object.positionCorrectionDelta.x;
            object.positionCorrection.z -= object.positionCorrectionDelta.z;
            object.positionCorrectionDelta.set( 0, 0, 0 );

        }

        this.worker.postMessage({ type: 'update', objects: objects });

    };

    private workerMessage ( event ) {

        switch ( event.data.type ) {

            case 'ready':

                this.worker.postMessage({ type: 'init' });
                break;

            case 'update':

                let objects = event.data.objects;
                this.lastUpdateTime = this.lastUpdateTime || Date.now();
                let delta = Date.now() - this.lastUpdateTime;

                for ( let i = 0, il = objects.length; i < il; i ++ ) {

                    let objParent = this.getObject( objects[ i ].id, objects[ i ].type );
                    if ( ! objParent ) continue;

                    objParent.acceleration = objects[ i ].acceleration;
                    objParent.updateMovement( delta );
                    objParent.position.set( objects[ i ].position.x, objects[ i ].position.y, objects[ i ].position.z );

                }

                this.lastUpdateTime = Date.now();
                this.updateRate = delta || 1;

                break;

        }

    };

    private getObject ( id: number, type: string ) {

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            if ( this.objects[ i ].type + '-' + this.objects[ i ].id === type + '-' + id ) {

                return this.objects[ i ];

            }

        }

        return null;

    };

    public init () {

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
