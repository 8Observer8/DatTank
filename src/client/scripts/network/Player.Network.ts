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

        const bulletLevel = data[1];
        this.player.newLevel( bulletLevel );

    };

    //

    public statsUpdate ( statsId: number ) : void {

        let buffer;
        let bufferView;

        if ( ! this.buffers['StatsUpdate'] ) {

            buffer = new ArrayBuffer( 6 );
            bufferView = new Int16Array( buffer );

            this.buffers['StatsUpdate'] = {
                buffer,
                view:       bufferView,
            };

        } else {

            buffer = this.buffers['StatsUpdate'].buffer;
            bufferView = this.buffers['StatsUpdate'].view;

        }

        //

        bufferView[1] = this.player.id;
        bufferView[2] = statsId;

        Network.send( 'PlayerTankUpdateStats', buffer, bufferView );

    };

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
        bufferView[2] = params.base;
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

        Network.removeMessageListener( 'PlayerRespawn', this.setRespawn.bind( this ) );
        Network.removeMessageListener( 'PlayerNewLevel', this.setLevel.bind( this ) );

    };

    public init ( player: PlayerCore ) : void {

        this.player = player;

        //

        this.setRespawn = this.setRespawn.bind( this );
        this.setLevel = this.setLevel.bind( this );

        //

        Network.addMessageListener( 'PlayerRespawn', this.setRespawn );
        Network.addMessageListener( 'PlayerNewLevel', this.setLevel );

    };

};
