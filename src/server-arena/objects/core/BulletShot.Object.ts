/*
 * @author ohmed
 * Bullet object
*/

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';
import { TankObject } from './Tank.Object';
import { TowerObject } from './Tower.Object';

//

export class BulletShotObject {

    private static numIds: number = 1;

    private arena: ArenaCore;
    public id: number;
    public shotId: number;
    public active: boolean = false;
    public owner: TankObject | TowerObject;
    public radius: number = 10;
    public startPosition: OMath.Vec3 = new OMath.Vec3();
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number;
    public angle: number;
    public speed: number;
    public range: number;
    public readonly type: string = 'Bullet';

    //

    public deactivate () : void {

        // nothing here

    };

    public activate ( position: OMath.Vec3, angle: number, range: number, shotSpeed: number, owner: TankObject | TowerObject ) : void {

        this.active = true;
        this.position.set( position.x, 8, position.z );
        this.startPosition.set( position.x, 8, position.z );

        this.speed = shotSpeed;
        this.range = range;
        this.angle = angle;
        this.owner = owner;

        //

        this.arena.collisionManager.addObject( this, 'circle', true, true );

    };

    public detonate ( target: TankObject | TowerObject | null, position: any ) : void {

        if ( target && target.id === this.owner.id ) return;

        position = position || this.position;
        this.active = false;
        this.arena.network.explosion( this, position, ( target && target.hit ) ? 1 : 0 );

        //

        if ( target && target.hit ) {

            target.hit( this.owner );

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        if ( BulletShotObject.numIds > 1000 ) BulletShotObject.numIds = 1;
        this.id = BulletShotObject.numIds ++;
        this.arena = arena;

    };

};
