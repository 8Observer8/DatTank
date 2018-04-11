/*
 * @author ohmed
 * DatTank Player network handler
*/

import { Network } from "./../network/Core.Network";

//

class PlayerNetwork {

    public respawn ( tank: string ) {

        Network.send( 'ArenaPlayerRespawn', false, tank );

    };

};

//

export { PlayerNetwork };
