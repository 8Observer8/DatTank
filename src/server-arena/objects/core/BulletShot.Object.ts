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
    public active: boolean = false;
    public owner: TankObject | TowerObject;
    public radius: number = 10;
    public startPosition: OMath.Vec3 = new OMath.Vec3();
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public angle: number = 0;
    public speed: number = 1.8;
    public range: number = 200;
    public readonly type: string = 'Bullet';

    //

    public activate ( position: OMath.Vec3, angle: number, range: number, owner: TankObject | TowerObject ) : void {

        this.active = true;
        this.position.set( position.x, 8, position.z );
        this.startPosition.set( position.x, 8, position.z );

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

    constructor ( arena: ArenaCore, params: any ) {

        if ( BulletShotObject.numIds > 1000 ) BulletShotObject.numIds = 0;
        this.id = BulletShotObject.numIds ++;
        this.arena = arena;

    };

};
