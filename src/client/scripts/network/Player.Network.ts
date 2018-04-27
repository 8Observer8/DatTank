/*
 * @author ohmed
 * DatTank Player network handler
*/

import { Network } from "./../network/Core.Network";
import { PlayerCore } from "./../core/Player.Core";

//

class PlayerNetwork {

    private player: PlayerCore;

    //

    private filter ( data ) : boolean {

        var playerId = ( data.id ) ? data.id : data[0];
        if ( this.player.id !== playerId ) return true;

        return false;

    };

    //

    public setStatsUpdate ( statsId: number ) {

        let buffer = new ArrayBuffer( 4 );
        let bufferView = new Int16Array( buffer );
        bufferView[1] = statsId;

        Network.send( 'PlayerTankUpdateStats', buffer, bufferView );

    };

    private setRespawn ( data ) {

        if ( this.filter( data ) ) return;

        this.player.respawn( data.player );

    };

    private setLevel ( data ) {

        if ( this.filter( data ) ) return;

        let bulletLevel = data[1];

        this.player.newLevel( bulletLevel );

    };

    //

    public respawn ( tank: string ) {

        Network.send( 'PlayerRespawn', false, tank );

    };

    //

    public init ( player: PlayerCore ) {

        this.player = player;

        //

        Network.addMessageListener( 'PlayerRespawn', this.setRespawn.bind( this ) );
        Network.addMessageListener( 'PlayerNewLevel', this.setLevel.bind( this ) );

    };

};

//

export { PlayerNetwork };
