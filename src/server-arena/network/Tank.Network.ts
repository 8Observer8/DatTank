/*
 * @author ohmed
 * DatTank Tank Object Network handler
*/

import * as ws from 'ws';

import { Network } from '../network/Core.Network';
import { TankObject } from '../objects/core/Tank.Object';
import { TowerObject } from '../objects/core/Tower.Object';
import { BoxObject } from '../objects/core/Box.Object';
import { BulletObject } from '../objects/core/Bullet.Object';
import { ArenaCore } from '../core/Arena.Core';

//

export class TankNetwork {

    private arena: ArenaCore;
    private tank: TankObject;
    private buffers: object = {};

    //

    private filter ( data: Int16Array, socket: ws ) : boolean {

        const tankId = data[0];
        if ( this.tank.id !== tankId ) return true;
        if ( socket['player'].tank.id !== tankId ) return true;
        return false;

    };

    // network events handlers

    private setMovement ( data: Int16Array, socket: ws ) : void {

        if ( this.filter( data, socket ) ) return;

        const x = data[1];
        const y = data[2];
        this.tank.setMovement( x, y );

    };

    private setShootStart ( data: Int16Array, socket: ws ) : void {

        if ( this.filter( data, socket ) ) return;

        this.tank.startShooting();

    };

    private setShootStop ( data: Int16Array, socket: ws ) : void {

        if ( this.filter( data, socket ) ) return;

        this.tank.stopShooting();

    };

    // send via network

    public friendlyFire () : void {

        this.buffers['FriendlyFire'] = this.buffers['FriendlyFire'] || {};
        const buffer = this.buffers['FriendlyFire'].buffer || new ArrayBuffer( 4 );
        const bufferView = this.buffers['FriendlyFire'].bufferView || new Uint16Array( buffer );
        this.buffers['FriendlyFire'].buffer = buffer;
        this.buffers['FriendlyFire'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;

        Network.send( 'TankFriendlyFire', this.tank.player.socket, buffer, bufferView );

    };

    public updateHealth ( killer?: TankObject | TowerObject ) : void {

        this.buffers['ChangeHealth'] = this.buffers['ChangeHealth'] || {};
        const buffer = this.buffers['ChangeHealth'].buffer || new ArrayBuffer( 8 );
        const bufferView = this.buffers['ChangeHealth'].bufferView || new Int16Array( buffer );
        this.buffers['ChangeHealth'].buffer = buffer;
        this.buffers['ChangeHealth'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = this.tank.health;
        bufferView[ 3 ] = ( killer ) ? killer.id : -1;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankChangeHealth', buffer, bufferView );

    };

    public updateAmmo () : void {

        if ( ! this.tank.player.socket ) return;

        this.buffers['ChangeAmmo'] = this.buffers['ChangeAmmo'] || {};
        const buffer = this.buffers['ChangeAmmo'].buffer || new ArrayBuffer( 6 );
        const bufferView = this.buffers['ChangeAmmo'].bufferView || new Int16Array( buffer );
        this.buffers['ChangeAmmo'].buffer = buffer;
        this.buffers['ChangeAmmo'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = this.tank.ammo;

        Network.send( 'TankSetAmmo', this.tank.player.socket, buffer, bufferView );

    };

    public makeShoot ( bullet: BulletObject ) : void {

        this.buffers['MakeShot'] = this.buffers['MakeShot'] || {};
        const buffer = this.buffers['MakeShot'].buffer || new ArrayBuffer( 14 );
        const bufferView = this.buffers['MakeShot'].bufferView || new Int16Array( buffer );
        this.buffers['MakeShot'].buffer = buffer;
        this.buffers['MakeShot'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;
        bufferView[2] = bullet.id;
        bufferView[3] = bullet.position.x;
        bufferView[4] = bullet.position.z;
        bufferView[5] = ( - this.tank.rotation ) * 1000;
        bufferView[6] = this.tank.cannon.temperature;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankMakeShot', buffer, bufferView );

    };

    public updateMovement () : void {

        this.buffers['SetMovement'] = this.buffers['SetMovement'] || {};
        const buffer = this.buffers['SetMovement'].buffer || new ArrayBuffer( 14 );
        const bufferView = this.buffers['SetMovement'].bufferView || new Int16Array( buffer );
        this.buffers['SetMovement'].buffer = buffer;
        this.buffers['SetMovement'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = this.tank.moveDirection.x;
        bufferView[ 3 ] = this.tank.moveDirection.y;
        bufferView[ 4 ] = this.tank.position.x;
        bufferView[ 5 ] = this.tank.position.z;
        bufferView[ 6 ] = this.tank.rotation * 1000;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankMove', buffer, bufferView );

    };

    public updateBoxesInRange ( boxes: BoxObject[] ) : void {

        if ( ! this.tank.player.socket ) return;
        if ( boxes.length === 0 ) return;

        //

        const boxDataSize = 8;
        const buffer = new ArrayBuffer( 2 + boxDataSize * boxes.length );
        const bufferView = new Int16Array( buffer );

        for ( let i = 1, il = boxDataSize * boxes.length + 1; i < il; i += boxDataSize ) {

            const box = boxes[ ( i - 1 ) / boxDataSize ];

            bufferView[ i + 0 ] = box.id;
            bufferView[ i + 1 ] = box.typeId;
            bufferView[ i + 2 ] = box.position.x;
            bufferView[ i + 3 ] = box.position.z;

        }

        Network.send( 'ArenaBoxesInRange', this.tank.player.socket, buffer, bufferView );

    };

    public updateTowersInRange ( towers: TowerObject[] ) : void {

        if ( ! this.tank.player.socket ) return;
        if ( towers.length === 0 ) return;

        //

        const towerDataSize = 14;
        const buffer = new ArrayBuffer( 2 + towerDataSize * towers.length );
        const bufferView = new Int16Array( buffer );
        let offset;

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            const tower = towers[ i ];
            offset = 1 + ( towerDataSize / 2 ) * i;

            bufferView[ offset + 0 ] = tower.id;
            bufferView[ offset + 1 ] = tower.team.id;
            bufferView[ offset + 2 ] = tower.position.x;
            bufferView[ offset + 3 ] = tower.position.z;
            bufferView[ offset + 4 ] = tower.rotation * 1000;
            bufferView[ offset + 5 ] = tower.health;
            bufferView[ offset + 6 ] = tower.newRotation * 1000;

        }

        Network.send( 'ArenaTowersInRange', this.tank.player.socket, buffer, bufferView );

    };

    public updateTanksInRange ( tanks: TankObject[] ) : void {

        if ( ! this.tank.player.socket ) return;
        if ( tanks.length === 0 ) return;

        //

        const tankDataSize = 24 * 2 + 13 * 2;
        const buffer = new ArrayBuffer( 2 + tankDataSize * tanks.length );
        const bufferView = new Int16Array( buffer );
        let item = 0;

        for ( let i = 1, il = ( tankDataSize / 2 ) * tanks.length + 1; i < il; i += tankDataSize / 2 ) {

            const tank = tanks[ item ];

            bufferView[ i +  0 ] = tank.id;
            bufferView[ i +  1 ] = tank.team.id;
            bufferView[ i +  2 ] = tank.position.x;
            bufferView[ i +  3 ] = tank.position.y;
            bufferView[ i +  4 ] = tank.position.z;
            bufferView[ i +  5 ] = ( tank.rotation % ( 2 * Math.PI ) ) * 1000;
            bufferView[ i +  6 ] = tank.health;
            bufferView[ i +  7 ] = tank.moveDirection.x;
            bufferView[ i +  8 ] = tank.moveDirection.y;
            bufferView[ i +  9 ] = tank.ammo;
            bufferView[ i + 10 ] = tank.player.id;

            bufferView[ i + 11 ] = tank.base.nid;
            bufferView[ i + 12 ] = tank.base.speedCoef;
            bufferView[ i + 13 ] = tank.base.ammoCapacity;
            bufferView[ i + 14 ] = tank.base.armorCoef;
            bufferView[ i + 15 ] = tank.cannon.nid;
            bufferView[ i + 16 ] = tank.cannon.range;
            bufferView[ i + 17 ] = tank.cannon.rpm;
            bufferView[ i + 18 ] = tank.cannon.overheat;
            bufferView[ i + 19 ] = tank.armor.nid;
            bufferView[ i + 20 ] = tank.armor.armor;
            bufferView[ i + 21 ] = tank.engine.nid;
            bufferView[ i + 22 ] = tank.engine.maxSpeed;
            bufferView[ i + 23 ] = tank.engine.power;

            for ( let j = 0, jl = tank.player.login.length; j < jl; j ++ ) {

                if ( tank.player.login[ j ] ) {

                    bufferView[ i + 24 + j ] = + tank.player.login[ j ].charCodeAt( 0 ).toString( 10 );

                }

            }

            item ++;

        }

        //

        Network.send( 'ArenaTanksInRange', this.tank.player.socket, buffer, bufferView );

    };

    //

    public dispose () : void {

        Network.removeMessageListener( 'TankMove', this.setMovement );
        Network.removeMessageListener( 'TankStartShooting', this.setShootStart );
        Network.removeMessageListener( 'TankStopShooting', this.setShootStop );

    };

    constructor ( tank: TankObject ) {

        this.arena = tank.player.arena;
        this.tank = tank;

        //

        this.setMovement = this.setMovement.bind( this );
        this.setShootStart = this.setShootStart.bind( this );
        this.setShootStop = this.setShootStop.bind( this );

        //

        Network.addMessageListener( 'TankMove', this.setMovement );
        Network.addMessageListener( 'TankStartShooting', this.setShootStart );
        Network.addMessageListener( 'TankStopShooting', this.setShootStop );

    };

};
