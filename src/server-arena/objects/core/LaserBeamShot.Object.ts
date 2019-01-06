/*
 * @author ohmed
 * Laser beam object
*/

import * as Cannon from 'cannon';

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';
import { TankObject } from './Tank.Object';
import { TowerObject } from './Tower.Object';

//

export class LaserBeamShotObject {

    private static numIds: number = 1;

    private arena: ArenaCore;
    public id: number;
    public shotId: number;
    public active: boolean = false;
    public owner: TankObject | TowerObject;
    public position: OMath.Vec3 = new OMath.Vec3();
    public angle: number = 0;

    public range: number;
    public readonly type: string = 'LaserBeam';
    public size: OMath.Vec3 = new OMath.Vec3( 2, 2, 2 );

    private dPos: number = 0;
    private speed: number;
    private yPos: number;
    private dAngle: number;
    private offset: number;

    private ray: Cannon.Ray = new Cannon.Ray();
    private sinceLastRaycast: number = 0;
    private raycastDelay: number = 200;

    //

    private collisionEvent ( intersect: any ) : any {

        if ( intersect.body.parent.id === this.owner.id ) return;

        if ( intersect.body.name === 'Tank' || intersect.body.name === 'Tower' ) {

            const target = intersect.body.parent as TankObject | TowerObject;
            target.hit( this.owner );

        }

        this.dPos = intersect.distance;

    };

    public activate ( offset: number, yPos: number, dAngle: number, range: number, shotSpeed: number, owner: TankObject | TowerObject ) : void {

        this.sinceLastRaycast = 0;
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

        if ( this.dPos < this.range ) {

            this.dPos += delta * this.speed;

        }

        //

        this.angle = Math.PI / 2 - this.owner.rotation;

        this.position.set( this.owner.position.x, this.owner.position.y + this.yPos, this.owner.position.z );
        this.position.x += this.offset * Math.cos( this.angle + this.dAngle );
        this.position.z += this.offset * Math.sin( this.angle + this.dAngle );

        this.sinceLastRaycast += delta;

        if ( this.sinceLastRaycast > this.raycastDelay ) {

            this.arena.collisionManager.raycast( this );
            this.sinceLastRaycast = 0;

        }

    };

    public deactivate () : void {

        this.active = false;

    };

    //

    constructor ( arena: ArenaCore ) {

        if ( LaserBeamShotObject.numIds > 1000 ) LaserBeamShotObject.numIds = 1;
        this.id = LaserBeamShotObject.numIds ++;

        this.ray['mode'] = Cannon.Ray['ALL'];
        this.ray['callback'] = this.collisionEvent.bind( this );

        this.arena = arena;

    };

};
