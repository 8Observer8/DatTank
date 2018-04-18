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

        if ( this.tower.id !== towerId ) return true;

        return false;

    };

    //

    private setTopRotation ( data ) {

        if ( this.filter( data ) ) return;

        this.tower.setTopRotation( data[1] / 1000, data[2] / 1000 );

    };

    private shoot ( data ) {

        // todo

    };

    private updateLeaderboard ( data ) {

        // todo

    };

    private setHealth ( data ) {

        if ( this.filter( data ) ) return;

        this.tower.setHealth( data[1] );

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
