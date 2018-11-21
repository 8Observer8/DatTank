/*
 * @author ohmed
 * DatTank Player Object Network handler
*/

import * as ws from 'ws';

import { GarageManager } from '../managers/Garage.Manager';
import { Network } from '../network/Core.Network';
import { PlayerCore } from '../core/Player.Core';
import { ArenaCore } from '../core/Arena.Core';

//

export class PlayerNetwork {

    private player: PlayerCore;
    private arena: ArenaCore;
    private buffers: object = {};

    //

    private filter ( data: Int16Array, socket: ws ) : boolean {

        const playerId = data[0];
        if ( this.player.id !== playerId ) return true;
        if ( socket['player'].id !== playerId ) return true;
        return false;

    };

    // network events handlers

    private setRespawn ( data: Int16Array, socket: ws ) : void {

        if ( this.filter( data, socket ) ) return;

        const baseId = data[1];
        const cannonId = data[2];
        const armorId = data[3];
        const engineId = data[4];

        const base = GarageManager.getBaseById( baseId );
        const cannon = GarageManager.getCannonById( cannonId );
        const armor = GarageManager.getArmorById( armorId );
        const engine = GarageManager.getEngineById( engineId );

        if ( ! base || ! cannon || ! armor || ! engine ) return;

        //

        this.player.respawn({ base: base.id, cannon: cannon.id, armor: armor.id, engine: engine.id });

    };

    private setTankStatsUpdate ( data: Int16Array, socket: ws ) : void {

        if ( this.filter( data, socket ) ) return;

        const statsId = data[1];
        this.player.tank.updateStats( statsId );

    };

    // send via network

    public updateStats () : void {

        this.buffers['UpdateStats'] = this.buffers['UpdateStats'] || {};
        const buffer = this.buffers['UpdateStats'].buffer || new ArrayBuffer( 14 );
        const bufferView = this.buffers['UpdateStats'].bufferView || new Int16Array( buffer );
        this.buffers['UpdateStats'].buffer = buffer;
        this.buffers['UpdateStats'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.player.id;
        bufferView[ 2 ] = this.player.xp % 10000;
        bufferView[ 3 ] = Math.floor( this.player.xp / 10000 );
        bufferView[ 4 ] = this.player.coins % 10000;
        bufferView[ 5 ] = Math.floor( this.player.coins / 10000 );
        bufferView[ 6 ] = this.player.level;

        Network.send( 'PlayerStatsUpdate', this.player.socket, buffer, bufferView );

    };

    public warnCheater () : void {

        // nothing here yet
        console.log('Cheater detected.');

    };

    public confirmRespawn () : void {

        this.arena.network.sendEventToAllPlayers( 'PlayerRespawn', null, this.player.toJSON() );

    };

    public updateLevel () : void {

        this.buffers['NewLevel'] = this.buffers['NewLevel'] || {};
        const buffer = this.buffers['NewLevel'].buffer || new ArrayBuffer( 6 );
        const bufferView = this.buffers['NewLevel'].bufferView || new Int16Array( buffer );
        this.buffers['NewLevel'].buffer = buffer;
        this.buffers['NewLevel'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.player.id;
        bufferView[ 2 ] = this.player.level;

        Network.send( 'PlayerNewLevel', this.player.socket, buffer, bufferView );

    };

    public killSerie ( serie: number ) : void {

        this.arena.network.sendEventToPlayersInRange( this.player.tank.position, 'ArenaKillSerie', null, {
            id:     this.player.id,
            login:  this.player.login,
            team:   this.player.team.id,
            serie,
        });

    };

    //

    public dispose () : void {

        Network.removeMessageListener( 'PlayerRespawn', this.setRespawn );
        Network.removeMessageListener( 'PlayerTankUpdateStats', this.setTankStatsUpdate );

    };

    constructor ( player: PlayerCore ) {

        this.player = player;
        this.arena = player.arena;

        //

        this.setRespawn = this.setRespawn.bind( this );
        this.setTankStatsUpdate = this.setTankStatsUpdate.bind( this );

        //

        Network.addMessageListener( 'PlayerRespawn', this.setRespawn );
        Network.addMessageListener( 'PlayerTankUpdateStats', this.setTankStatsUpdate );

    };

};
