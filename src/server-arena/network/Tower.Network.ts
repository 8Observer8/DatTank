/*
 * @author ohmed
 * DatTank Tower Object Network handler
*/

import { TowerObject } from '../objects/core/Tower.Object';
import { ArenaCore } from '../core/Arena.Core';
import { BulletObject } from '../objects/core/Bullet.Object';

//

export class TowerNetwork {

    private arena: ArenaCore;
    private buffers: object = {};
    private tower: TowerObject;

    //

    public makeShot ( bullet: BulletObject ) : void {

        this.buffers['MakeShot'] = this.buffers['MakeShot'] || {};
        const buffer = this.buffers['MakeShot'].buffer || new ArrayBuffer( 12 );
        const bufferView = this.buffers['MakeShot'].bufferView || new Int16Array( buffer );
        this.buffers['MakeShot'].buffer = buffer;
        this.buffers['MakeShot'].bufferView = bufferView;

        bufferView[1] = this.tower.id;
        bufferView[2] = bullet.id;
        bufferView[3] = bullet.position.x;
        bufferView[4] = bullet.position.z;
        bufferView[5] = ( - this.tower.rotation - Math.PI / 2 ) * 1000;

        this.arena.network.sendEventToPlayersInRange( this.tower.position, 'TowerMakeShot', buffer, bufferView );

    };

    public updateHealth () : void {

        this.buffers['SetHealth'] = this.buffers['SetHealth'] || {};
        const buffer = this.buffers['SetHealth'].buffer || new ArrayBuffer( 6 );
        const bufferView = this.buffers['SetHealth'].bufferView || new Int16Array( buffer );
        this.buffers['SetHealth'].buffer = buffer;
        this.buffers['SetHealth'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tower.id;
        bufferView[ 2 ] = this.tower.health;

        this.arena.network.sendEventToPlayersInRange( this.tower.position, 'TowerSetHealth', buffer, bufferView );

    };

    public changeTeam ( killerId: number ) : void {

        this.buffers['changeTeam'] = this.buffers['changeTeam'] || {};
        const buffer = this.buffers['changeTeam'].buffer || new ArrayBuffer( 8 );
        const bufferView = this.buffers['changeTeam'].bufferView || new Int16Array( buffer );
        this.buffers['changeTeam'].buffer = buffer;
        this.buffers['changeTeam'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tower.id;
        bufferView[ 2 ] = this.tower.team.id;
        bufferView[ 3 ] = killerId;

        this.arena.network.sendEventToPlayersInRange( this.tower.position, 'TowerChangeTeam', buffer, bufferView );

    };

    public updateTopRotation () : void {

        this.buffers['SetTopRotation'] = this.buffers['SetTopRotation'] || {};
        const buffer = this.buffers['SetTopRotation'].buffer || new ArrayBuffer( 8 );
        const bufferView = this.buffers['SetTopRotation'].bufferView || new Int16Array( buffer );
        this.buffers['SetTopRotation'].buffer = buffer;
        this.buffers['SetTopRotation'].bufferView = bufferView;

        //

        bufferView[1] = this.tower.id;
        bufferView[2] = Math.floor( 1000 * this.tower.rotation );
        bufferView[3] = Math.floor( 1000 * this.tower.newRotation );

        this.arena.network.sendEventToPlayersInRange( this.tower.position, 'TowerRotateTop', buffer, bufferView );

    };

    //

    constructor ( tower: TowerObject ) {

        this.arena = tower.arena;
        this.tower = tower;

    };

};
