/*
 * @author ohmed
 * Bullet object
*/

import * as OMath from "./../../OMath/Core.OMath";
import { ArenaCore } from "./../../core/Arena.Core";
import { TankObject } from "./Tank.Object";
import { TowerObject } from "./Tower.Object";

//

class BulletObject {

    private static numIds: number = 1;

    private arena: ArenaCore;
    public id: number;
    public active: boolean = false;
    public owner: TankObject | TowerObject;
    public size: OMath.Vec3 = new OMath.Vec3( 20, 20, 20 );
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public angle: number = 0;
    public flytime: number = 0;
    public speed: number = 1.8;
    public readonly type: string = 'Bullet';

    //

    public activate ( position: OMath.Vec3, angle: number, owner: TankObject | TowerObject ) {

        this.active = true;
        this.position.set( position.x, 8, position.z );

        this.angle = angle;
        this.flytime = 300;
        this.owner = owner;
    
        //
    
        this.arena.collisionManager.addObject( this, 'box', true, true );

    };

    public detonate ( target?: TankObject | TowerObject ) {

        if ( target && target.id === this.owner.id ) return;

        this.active = false;     
        this.arena.network.explosion( this, ( target && target.hit ) ? 1 : 0 );

        //

        if ( target && target.hit ) {

            target.hit( this.owner );

        }

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        if ( BulletObject.numIds > 1000 ) BulletObject.numIds = 0;
        this.id = BulletObject.numIds ++;
        this.arena = arena;

    };

};

//

export { BulletObject };
