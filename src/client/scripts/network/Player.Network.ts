/*
 * @author ohmed
 * DatTank Player network handler
*/

import { Network } from '../network/Core.Network';
import { PlayerCore } from '../core/Player.Core';

//

export class PlayerNetwork {

    private player: PlayerCore;
    private buffers = {};

    //

    private filter ( data: any ) : boolean {

        const playerId = ( data.id ) ? data.id : data[0];
        if ( this.player.id !== playerId ) return true;

        return false;

    };

    //

    private setRespawn ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.player.respawn( data );

    };

    private setLevel ( data: any ) : void {

        if ( this.filter( data ) ) return;

        // const playerLevel = data[1];
        // this.player.newLevel( playerLevel );

    };

    private setArenaLevel ( data: any ) : void {

        if ( this.filter( data ) ) return;

        const playerArenaLevel = data[1];
        this.player.newArenaLevel( playerArenaLevel );

    };

    private setStats ( data: any ) : void {

        if ( this.filter( data ) ) return;

        const xp = data[2] * 10000 + data[1];
        const coins = data[4] * 10000 + data[3];
        const level = data[5];
        const levelBonuses = data[6];

        this.player.updateStats( xp, coins, level, levelBonuses );

    };

    //

    public respawn ( params: any ) : void {

        let buffer;
        let bufferView;

        if ( ! this.buffers['Respawn'] ) {

            buffer = new ArrayBuffer( 12 );
            bufferView = new Int16Array( buffer );

            this.buffers['Respawn'] = {
                buffer,
                view:       bufferView,
            };

        } else {

            buffer = this.buffers['Respawn'].buffer;
            bufferView = this.buffers['Respawn'].view;

        }

        //

        bufferView[1] = this.player.id;
        bufferView[2] = params.hull;
        bufferView[3] = params.cannon;
        bufferView[4] = params.armor;
        bufferView[5] = params.engine;

        //

        Network.send( 'PlayerRespawn', buffer, bufferView );

    };

    public sendChatMessage ( message: string ) : void {

        Network.send( 'PlayerChatMessage', false, {
            playerId: this.player.id,
            message,
        });

    };

    //

    public dispose () : void {

        Network.removeMessageListener( 'PlayerRespawn', this.setRespawn );
        Network.removeMessageListener( 'PlayerNewLevel', this.setLevel );
        Network.removeMessageListener( 'PlayerNewArenaLevel', this.setLevel );
        Network.removeMessageListener( 'PlayerStatsUpdate', this.setStats );

    };

    public init ( player: PlayerCore ) : void {

        this.player = player;

        //

        this.setRespawn = this.setRespawn.bind( this );
        this.setLevel = this.setLevel.bind( this );
        this.setArenaLevel = this.setArenaLevel.bind( this );
        this.setStats = this.setStats.bind( this );

        //

        Network.addMessageListener( 'PlayerRespawn', this.setRespawn );
        Network.addMessageListener( 'PlayerNewLevel', this.setLevel );
        Network.addMessageListener( 'PlayerNewArenaLevel', this.setArenaLevel );
        Network.addMessageListener( 'PlayerStatsUpdate', this.setStats );

    };

};
