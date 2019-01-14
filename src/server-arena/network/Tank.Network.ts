/*
 * @author ohmed
 * DatTank Tank Object Network handler
*/

import * as ws from 'ws';

import { Network } from '../network/Core.Network';
import { TankObject } from '../objects/core/Tank.Object';
import { TowerObject } from '../objects/core/Tower.Object';
import { BoxObject } from '../objects/core/Box.Object';
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

        this.tank.cannon.startShooting();

    };

    private setShootStop ( data: Int16Array, socket: ws ) : void {

        if ( this.filter( data, socket ) ) return;

        this.tank.cannon.stopShooting();

    };

    private setUpgrade ( data: Int16Array, socket: ws ) : void {

        if ( this.filter( data, socket ) ) return;

        const statsId = data[1];
        this.tank.upgrade( statsId );

    };

    // send via network

    public upgrade () : void {

        this.buffers['TankUpgrade'] = this.buffers['TankUpgrade'] || {};
        const buffer = this.buffers['TankUpgrade'].buffer || new ArrayBuffer( 10 );
        const bufferView = this.buffers['TankUpgrade'].bufferView || new Uint16Array( buffer );
        this.buffers['TankUpgrade'].buffer = buffer;
        this.buffers['TankUpgrade'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;
        bufferView[2] = this.tank.engine.maxSpeed;
        bufferView[3] = this.tank.engine.power / 100;
        bufferView[4] = this.tank.armor.armor;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankUpgrade', buffer, bufferView );

    };

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

    public makeShoot ( shotId: number ) : void {

        this.buffers['MakeShot'] = this.buffers['MakeShot'] || {};
        const buffer = this.buffers['MakeShot'].buffer || new ArrayBuffer( 8 );
        const bufferView = this.buffers['MakeShot'].bufferView || new Int16Array( buffer );
        this.buffers['MakeShot'].buffer = buffer;
        this.buffers['MakeShot'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;
        bufferView[2] = shotId;
        bufferView[3] = this.tank.cannon.temperature;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankMakeShot', buffer, bufferView );

    };

    public startShooting ( shotId: number ) : void {

        this.buffers['StartShooting'] = this.buffers['StartShooting'] || {};
        const buffer = this.buffers['StartShooting'].buffer || new ArrayBuffer( 8 );
        const bufferView = this.buffers['StartShooting'].bufferView || new Int16Array( buffer );
        this.buffers['StartShooting'].buffer = buffer;
        this.buffers['StartShooting'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;
        bufferView[2] = shotId;
        bufferView[3] = this.tank.cannon.temperature;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankStartShooting', buffer, bufferView );

    };

    public stopShooting ( shotId: number ) : void {

        this.buffers['StopShooting'] = this.buffers['StopShooting'] || {};
        const buffer = this.buffers['StopShooting'].buffer || new ArrayBuffer( 6 );
        const bufferView = this.buffers['StopShooting'].bufferView || new Int16Array( buffer );
        this.buffers['StopShooting'].buffer = buffer;
        this.buffers['StopShooting'].bufferView = bufferView;

        bufferView[1] = this.tank.id;
        bufferView[2] = shotId;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankStopShooting', buffer, bufferView );

    };

    public syncState () : void {

        this.buffers['SyncState'] = this.buffers['SyncState'] || {};
        const buffer = this.buffers['SyncState'].buffer || new ArrayBuffer( 12 );
        const bufferView = this.buffers['SyncState'].bufferView || new Int16Array( buffer );
        this.buffers['SyncState'].buffer = buffer;
        this.buffers['SyncState'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;
        bufferView[2] = this.tank.position.x * 10;
        bufferView[3] = this.tank.position.y * 10;
        bufferView[4] = this.tank.position.z * 10;
        bufferView[5] = this.tank.rotation * 1000;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankSyncState', buffer, bufferView );

    };

    public updateMovement () : void {

        this.buffers['SetMovement'] = this.buffers['SetMovement'] || {};
        const buffer = this.buffers['SetMovement'].buffer || new ArrayBuffer( 8 );
        const bufferView = this.buffers['SetMovement'].bufferView || new Int16Array( buffer );
        this.buffers['SetMovement'].buffer = buffer;
        this.buffers['SetMovement'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = this.tank.moveDirection.x;
        bufferView[ 3 ] = this.tank.moveDirection.y;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankMove', buffer, bufferView );

    };

    public updateBoxesInRange ( newBoxes: BoxObject[], boxesToRemoveIds: number[] ) : void {

        if ( ! this.tank.player.socket ) return;
        if ( newBoxes.length === 0 && boxesToRemoveIds.length === 0 ) return;

        //

        const boxDataSize = 8;
        const buffer = new ArrayBuffer( 2 + 2 + boxDataSize * newBoxes.length + 2 * boxesToRemoveIds.length );
        const bufferView = new Int16Array( buffer );

        bufferView[1] = newBoxes.length;

        for ( let i = 1, il = boxDataSize * newBoxes.length + 1; i < il; i += boxDataSize ) {

            const box = newBoxes[ ( i - 1 ) / boxDataSize ];

            bufferView[ 1 + i + 0 ] = box.id;
            bufferView[ 1 + i + 1 ] = box.typeId;
            bufferView[ 1 + i + 2 ] = box.position.x;
            bufferView[ 1 + i + 3 ] = box.position.z;

        }

        //

        for ( let i = 0, il = boxesToRemoveIds.length; i < il; i ++ ) {

            bufferView[ i + boxDataSize * newBoxes.length + 1 + 1 ] = boxesToRemoveIds[ i ];

        }

        //

        Network.send( 'ArenaBoxesInRange', this.tank.player.socket, buffer, bufferView );

    };

    public updateTowersInRange ( newTowers: TowerObject[], towersToRemoveIds: number[] ) : void {

        if ( ! this.tank.player.socket ) return;
        if ( newTowers.length === 0 && towersToRemoveIds.length === 0 ) return;

        //

        const towerDataSize = 14;
        const buffer = new ArrayBuffer( 2 + 2 + towerDataSize * newTowers.length + 2 * towersToRemoveIds.length );
        const bufferView = new Int16Array( buffer );
        let offset;

        bufferView[1] = newTowers.length;

        for ( let i = 0, il = newTowers.length; i < il; i ++ ) {

            const tower = newTowers[ i ];
            offset = 1 + 1 + ( towerDataSize / 2 ) * i;

            bufferView[ offset + 0 ] = tower.id;
            bufferView[ offset + 1 ] = tower.team.id;
            bufferView[ offset + 2 ] = tower.position.x;
            bufferView[ offset + 3 ] = tower.position.z;
            bufferView[ offset + 4 ] = tower.rotation * 1000;
            bufferView[ offset + 5 ] = tower.health;
            bufferView[ offset + 6 ] = tower.newRotation * 1000;

        }

        //

        for ( let i = 0, il = towersToRemoveIds.length; i < il; i ++ ) {

            bufferView[ i + towerDataSize * newTowers.length + 1 + 1 ] = towersToRemoveIds[ i ];

        }

        //

        Network.send( 'ArenaTowersInRange', this.tank.player.socket, buffer, bufferView );

    };

    public updateTanksInRange ( newTanks: TankObject[], tanksToRemoveIds: number[] ) : void {

        if ( ! this.tank.player.socket ) return;
        if ( newTanks.length === 0 && tanksToRemoveIds.length === 0 ) return;

        //

        let size = 0;

        for ( let i = 0, il = newTanks.length; i < il; i ++ ) {

            size += 20; // general
            size += 13; // login
            size += ( newTanks[ i ].id === this.tank.id ) ? 5 : 0; // personal

        }

        const buffer = new ArrayBuffer( ( 1 + 1 + size + tanksToRemoveIds.length ) * 2 );
        const bufferView = new Int16Array( buffer );
        let item = 0;
        let offset = 2;

        bufferView[1] = newTanks.length;

        for ( let i = 0, il = newTanks.length; i < il; i ++ ) {

            const tank = newTanks[ item ];

            bufferView[ offset +  0 ] = tank.player.id;
            bufferView[ offset +  1 ] = tank.player.level;
            bufferView[ offset +  2 ] = tank.team.id;
            bufferView[ offset +  3 ] = tank.id;
            bufferView[ offset +  4 ] = tank.moveDirection.x;
            bufferView[ offset +  5 ] = tank.moveDirection.y;
            bufferView[ offset +  6 ] = tank.position.x;
            bufferView[ offset +  7 ] = tank.position.y;
            bufferView[ offset +  8 ] = tank.position.z;
            bufferView[ offset +  9 ] = ( tank.rotation % ( 2 * Math.PI ) ) * 1000;
            bufferView[ offset + 10 ] = tank.health;

            bufferView[ offset + 11 ] = tank.hull.nid;
            bufferView[ offset + 12 ] = tank.hull.speedCoef;
            bufferView[ offset + 13 ] = tank.cannon.nid;
            bufferView[ offset + 14 ] = tank.cannon.range;
            bufferView[ offset + 15 ] = tank.armor.nid;
            bufferView[ offset + 16 ] = tank.armor.armor;
            bufferView[ offset + 17 ] = tank.engine.nid;
            bufferView[ offset + 18 ] = tank.engine.maxSpeed;
            bufferView[ offset + 19 ] = tank.engine.power / 100;

            offset += 20;

            for ( let j = 0, jl = tank.player.login.length; j < jl; j ++ ) {

                if ( tank.player.login[ j ] ) {

                    bufferView[ offset + j ] = + tank.player.login[ j ].charCodeAt( 0 ).toString( 10 );

                }

            }

            //

            offset += 13;

            if ( tank.id === this.tank.id ) {

                bufferView[ offset + 0 ] = tank.ammo;
                bufferView[ offset + 1 ] = tank.hull.ammoCapacity;
                bufferView[ offset + 2 ] = tank.hull.armorCoef;
                bufferView[ offset + 3 ] = tank.cannon.rpm;
                bufferView[ offset + 4 ] = tank.cannon.overheat;
                offset += 5;

            }

            item ++;

        }

        //

        for ( let i = 0, il = tanksToRemoveIds.length; i < il; i ++ ) {

            bufferView[ i + offset ] = tanksToRemoveIds[ i ];

        }

        //

        Network.send( 'ArenaTanksInRange', this.tank.player.socket, buffer, bufferView );

    };

    //

    public dispose () : void {

        Network.removeMessageListener( 'TankMove', this.setMovement );
        Network.removeMessageListener( 'TankStartShooting', this.setShootStart );
        Network.removeMessageListener( 'TankStopShooting', this.setShootStop );
        Network.removeMessageListener( 'TankUpgrade', this.setUpgrade );

    };

    constructor ( tank: TankObject ) {

        this.arena = tank.player.arena;
        this.tank = tank;

        //

        this.setMovement = this.setMovement.bind( this );
        this.setShootStart = this.setShootStart.bind( this );
        this.setShootStop = this.setShootStop.bind( this );
        this.setUpgrade = this.setUpgrade.bind( this );

        //

        Network.addMessageListener( 'TankMove', this.setMovement );
        Network.addMessageListener( 'TankStartShooting', this.setShootStart );
        Network.addMessageListener( 'TankStopShooting', this.setShootStop );
        Network.addMessageListener( 'TankUpgrade', this.setUpgrade );

    };

};
