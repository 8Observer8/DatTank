/*
 * @author ohmed
 * DatTank Tower network handler
*/

import { Network } from "./../network/Core.Network";
import { TowerCore } from "./../core/objects/Tower.Core";

//

class TowerNetwork {

    private tower: TowerCore;

    //

    private filter ( data ) : boolean {

        var towerId = ( data.id ) ? data.id : data[0];
        if ( this.tower.id !== towerId ) return false;

        return true;

    };

    //

    private setTopRotation ( event ) {

        // todo

    };

    private shoot ( event ) {

        // todo

    };

    private updateLeaderboard ( event ) {

        // todo

    };

    private setHealth ( event ) {

        // todo

    };

    //

    public init ( tower ) {

        this.tower = tower;

        //

        Network.addMessageListener( 'TowerRotateTop', this.setTopRotation.bind( this ) );
        Network.addMessageListener( 'TowerShoot', this.shoot.bind( this ) );
        Network.addMessageListener( 'TowerChangeTeam', this.updateLeaderboard.bind( this ) );
        Network.addMessageListener( 'TowerSetHealth', this.setHealth.bind( this ) );

    };

};

//

export { TowerNetwork };
