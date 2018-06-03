/*
 * @author ohmed
 * DatTank Tower Object Network handler
*/

import { Network } from "./../network/Core.Network";
import { TowerObject } from "./../objects/core/Tower.Object";
import { ArenaCore } from "./../core/Arena.Core";
import { BulletObject } from "./../objects/core/Bullet.Object";

//

class TowerNetwork {

    private arena: ArenaCore;
    private buffers: object = {};
    private tower: TowerObject;

    //

    public makeShot ( bullet: BulletObject ) {

        this.buffers['MakeShot'] = this.buffers['MakeShot'] || {};
        let buffer = this.buffers['MakeShot'].buffer || new ArrayBuffer( 12 );
        let bufferView = this.buffers['MakeShot'].bufferView || new Int16Array( buffer );
        this.buffers['MakeShot'].buffer = buffer;
        this.buffers['MakeShot'].bufferView = bufferView;

        bufferView[1] = this.tower.id;
        bufferView[2] = bullet.id;
        bufferView[3] = bullet.position.x;
        bufferView[4] = bullet.position.z;
        bufferView[5] = ( - this.tower.rotation - Math.PI / 2 ) * 1000;

        this.arena.network.sendEventToPlayersInRange( 'TowerMakeShot', buffer, bufferView );

    };

    public setHealth () {

        this.buffers['SetHealth'] = this.buffers['SetHealth'] || {};
        let buffer = this.buffers['SetHealth'].buffer || new ArrayBuffer( 6 );
        let bufferView = this.buffers['SetHealth'].bufferView || new Int16Array( buffer );
        this.buffers['SetHealth'].buffer = buffer;
        this.buffers['SetHealth'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tower.id;
        bufferView[ 2 ] = this.tower.health;

        this.arena.network.sendEventToPlayersInRange( 'TowerSetHealth', buffer, bufferView );

    };

    public changeTeam ( killerId: number ) {

        this.buffers['changeTeam'] = this.buffers['changeTeam'] || {};
        let buffer = this.buffers['changeTeam'].buffer || new ArrayBuffer( 8 );
        let bufferView = this.buffers['changeTeam'].bufferView || new Int16Array( buffer );
        this.buffers['changeTeam'].buffer = buffer;
        this.buffers['changeTeam'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tower.id;
        bufferView[ 2 ] = this.tower.team.id;
        bufferView[ 3 ] = killerId;

        this.arena.network.sendEventToPlayersInRange( 'TowerChangeTeam', buffer, bufferView );

    };

    public setTopRotation () {

        this.buffers['rotateTop'] = this.buffers['rotateTop'] || {};
        var buffer = this.buffers['rotateTop'].buffer || new ArrayBuffer( 8 );
        var bufferView = this.buffers['rotateTop'].bufferView || new Int16Array( buffer );
        this.buffers['rotateTop'].buffer = buffer;
        this.buffers['rotateTop'].bufferView = bufferView;

        //

        bufferView[1] = this.tower.id;
        bufferView[2] = Math.floor( 1000 * this.tower.rotation );
        bufferView[3] = Math.floor( 1000 * this.tower.newRotation );

        this.arena.network.sendEventToPlayersInRange( 'TowerRotateTop', buffer, bufferView );

    };

    //

    constructor ( tower: TowerObject ) {

        this.arena = tower.arena;
        this.tower = tower;

    };

};

//

export { TowerNetwork };
