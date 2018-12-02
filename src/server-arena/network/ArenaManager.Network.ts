/*
 * @author ohmed
 * DatTank ArenaManager Network handler
*/

import * as ws from 'ws';

import { Network } from './Core.Network';
import { ArenaManager } from '../managers/core/Arena.Manager';

//

export class ArenaManagerNetwork {

    private arenaJoinRequest ( data: any, socket: ws ) : void {

        ArenaManager.playerJoin( data, socket );

    };

    constructor () {

        this.arenaJoinRequest = this.arenaJoinRequest.bind( this );

        //

        Network.addMessageListener( 'ArenaJoinRequest', this.arenaJoinRequest );

    };

};
