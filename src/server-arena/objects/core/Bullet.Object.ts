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
    public ownerId: number;
    public position: OMath.Vec3 = new OMath.Vec3();
    public angle: number = 0;
    public flytime: number = 0;
    public speed: number = 1.8;
    public radius: number = 10;
    public readonly type: string = 'Bullet';

    //

    public activate ( position: OMath.Vec3, angle: number, ownerId: number ) {

        this.active = true;
        this.position.set( position.x, 25, position.z );

        this.angle = angle;
        this.flytime = 220;
        this.ownerId = ownerId;
    
        //
    
        this.arena.collisionManager.addObject( this, 'circle', true );

    };

    public detonate ( target?: TankObject | TowerObject ) {

        if ( target && target.id === this.ownerId ) return;

        this.active = false;
        this.arena.collisionManager.removeObject( this );        
        this.arena.network.explosion( this );

        //

        if ( target && target.hit ) {

            target.hit( this.ownerId );

        }

    };

    public update ( delta: number, time: number ) {

        this.position.x = this.position.x + this.speed * Math.sin( this.angle ) * delta;
        this.position.z = this.position.z + this.speed * Math.cos( this.angle ) * delta;
    
        this.flytime -= delta;
    
        if ( this.flytime < 0 ) {
    
            this.detonate();
    
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
