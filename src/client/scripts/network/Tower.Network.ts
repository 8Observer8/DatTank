/*
 * @author ohmed
 * DatTank Tower network handler
*/

import { Network } from "./../network/Core.Network";
import { TowerCore } from "./../core/objects/Tower.Core";
import * as OMath from "./../OMath/Core.OMath";

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

    private setShoot ( data ) {

        if ( this.filter( data ) ) return;

        let bulletId = data[1];
        let x = data[2];
        let y = 20;
        let z = data[3];
        let directionRotation = data[4] / 1000;

        this.tower.makeShot( bulletId, new OMath.Vec3( x, y, z ), directionRotation );

    };

    private setHealth ( data ) {

        if ( this.filter( data ) ) return;

        this.tower.setHealth( data[1] );

    };

    private changeTeam ( data ) {

        // todo

    };

    //

    public init ( tower ) {

        this.tower = tower;

        //

        Network.addMessageListener( 'TowerRotateTop', this.setTopRotation.bind( this ) );
        Network.addMessageListener( 'TowerMakeShot', this.setShoot.bind( this ) );
        Network.addMessageListener( 'TowerChangeTeam', this.changeTeam.bind( this ) );
        Network.addMessageListener( 'TowerSetHealth', this.setHealth.bind( this ) );

    };

};

//

export { TowerNetwork };
