/*
 * @author ohmed
 * DatTank Player network handler
*/

import { Network } from "./../network/Core.Network";
import { PlayerCore } from "./../core/Player.Core";

//

class PlayerNetwork {

    private player: PlayerCore;
    private buffers = {};

    //

    private filter ( data ) : boolean {

        var playerId = ( data.id ) ? data.id : data[0];
        if ( this.player.id !== playerId ) return true;

        return false;

    };

    //

    private setRespawn ( data ) {

        if ( this.filter( data ) ) return;

        this.player.respawn( data );

    };

    private setLevel ( data ) {

        if ( this.filter( data ) ) return;

        let bulletLevel = data[1];

        this.player.newLevel( bulletLevel );

    };

    private setKillSerie ( data ) {

        if ( this.filter( data ) ) return;

        console.log( this.player.username, data[1] );

    };

    //

    public statsUpdate ( statsId: number ) {

        let buffer, bufferView;

        if ( ! this.buffers['StatsUpdate'] ) {

            buffer = new ArrayBuffer( 6 );
            bufferView = new Int16Array( buffer );

            this.buffers['StatsUpdate'] = {
                buffer:     buffer,
                view:       bufferView
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

    public respawn ( tankId: number ) {

        let buffer, bufferView;

        if ( ! this.buffers['Respawn'] ) {

            buffer = new ArrayBuffer( 6 );
            bufferView = new Int16Array( buffer );

            this.buffers['Respawn'] = {
                buffer:     buffer,
                view:       bufferView
            };

        } else {

            buffer = this.buffers['Respawn'].buffer;
            bufferView = this.buffers['Respawn'].view;

        }

        //

        bufferView[1] = this.player.id;
        bufferView[2] = tankId;

        Network.send( 'PlayerRespawn', buffer, bufferView );

    };

    public sendChatMessage ( message: string ) {

        Network.send( 'PlayerChatMessage', false, {
            playerId: this.player.id,
            message: message
        });

    };

    //

    public dispose () {

        Network.removeMessageListener( 'PlayerRespawn', this.setRespawn );
        Network.removeMessageListener( 'PlayerNewLevel', this.setLevel );
        Network.removeMessageListener( 'PlayerKillSerie', this.setKillSerie );

    };

    public init ( player: PlayerCore ) {

        this.player = player;

        //

        this.setRespawn = this.setRespawn.bind( this );
        this.setLevel = this.setLevel.bind( this );
        this.setKillSerie = this.setKillSerie.bind( this );

        //

        Network.addMessageListener( 'PlayerRespawn', this.setRespawn );
        Network.addMessageListener( 'PlayerNewLevel', this.setLevel );
        Network.addMessageListener( 'PlayerKillSerie', this.setKillSerie );

    };

};

//

export { PlayerNetwork };
