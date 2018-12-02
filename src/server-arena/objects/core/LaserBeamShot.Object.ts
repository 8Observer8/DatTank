/*
 * @author ohmed
 * Laser beam object
*/

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';
import { TankObject } from './Tank.Object';
import { TowerObject } from './Tower.Object';

//

export class LaserBeamShotObject {

    private static numIds: number = 1;

    private arena: ArenaCore;
    public id: number;
    public active: boolean = false;
    public owner: TankObject | TowerObject;
    public position: OMath.Vec3 = new OMath.Vec3();
    public angle: number = 0;

    public range: number = 200;
    public readonly type: string = 'LaserBeam';

    public size: OMath.Vec3 = new OMath.Vec3( 2, 2, 2 );
    public raycastResult: any;
    public ray: any;

    private dPos: number = 0;
    private speed: number = 1;

    private shootDuration: number = 0;

    //

    public activate ( position: OMath.Vec3, angle: number, range: number, owner: TankObject | TowerObject ) : void {

        this.dPos = 0;
        this.shootDuration = 0;
        this.active = true;
        this.position.set( position.x, 8, position.z );

        this.range = range;
        this.angle = angle;
        this.owner = owner;

    };

    public update ( delta: number, time: number ) : void {

        if ( ! this.active ) {

            return;

        }

        //

        if ( this.raycastResult && this.raycastResult.body ) {

            if ( this.raycastResult.body.name === 'Tank' || this.raycastResult.body.name === 'Tower' ) {

                const target = this.raycastResult.body.parent as TankObject | TowerObject;
                target.hit( this.owner );

            }

            this.raycastResult = false;

        }

        //

        this.position.copy( this.owner.position );
        this.angle = this.owner.rotation;

        this.dPos += delta * this.speed;
        this.arena.collisionManager.raycast( this );

        this.shootDuration += delta;

        if ( this.shootDuration > 100 && this.owner instanceof TankObject ) {

            this.owner.changeAmmo( - 1 );
            this.shootDuration = 0;

        }

    };

    public deactivate () : void {

        this.active = false;

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        if ( LaserBeamShotObject.numIds > 1000 ) LaserBeamShotObject.numIds = 0;
        this.id = LaserBeamShotObject.numIds ++;

        this.arena = arena;

    };

};
