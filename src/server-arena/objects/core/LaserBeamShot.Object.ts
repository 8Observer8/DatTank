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

    public range: number;
    public readonly type: string = 'LaserBeam';

    public size: OMath.Vec3 = new OMath.Vec3( 2, 2, 2 );
    public raycastResult: any;
    public ray: any;

    // @ts-ignore
    private dPos: number = 0;
    // @ts-ignore
    private speed: number;
    private yPos: number;
    private dAngle: number;
    private offset: number;

    //

    public activate ( offset: number, yPos: number, dAngle: number, range: number, shotSpeed: number, owner: TankObject | TowerObject ) : void {

        this.active = true;

        this.owner = owner;
        this.range = range;
        this.speed = shotSpeed;

        this.offset = offset;
        this.angle = owner.rotation;
        this.dAngle = dAngle;
        this.yPos = yPos;

    };

    public update ( delta: number, time: number ) : void {

        if ( ! this.active ) {

            return;

        }

        //

        if ( this.raycastResult && this.raycastResult.body ) {

            this.dPos = this.raycastResult.distance;

            if ( this.raycastResult.body.name === 'Tank' || this.raycastResult.body.name === 'Tower' ) {

                const target = this.raycastResult.body.parent as TankObject | TowerObject;
                target.hit( this.owner );

            }

            this.raycastResult = false;

        } else {

            if ( this.dPos < this.range ) {

                this.dPos += delta * this.speed;

            }

        }

        //

        this.angle = Math.PI / 2 - this.owner.rotation;

        this.position.set( this.owner.position.x, this.owner.position.y + this.yPos, this.owner.position.z );
        this.position.x += this.offset * Math.cos( this.angle + this.dAngle );
        this.position.z += this.offset * Math.sin( this.angle + this.dAngle );

        this.arena.collisionManager.raycast( this );

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
