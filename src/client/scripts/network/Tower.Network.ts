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

        if ( this.filter( data ) ) return;

        let newTeamId = data[1];
        let killerId = data[2];

        this.tower.changeTeam( newTeamId, killerId );

    };

    //

    public dispose () {

        Network.removeMessageListener( 'TowerRotateTop', this.setTopRotation );
        Network.removeMessageListener( 'TowerMakeShot', this.setShoot );
        Network.removeMessageListener( 'TowerChangeTeam', this.changeTeam );
        Network.removeMessageListener( 'TowerSetHealth', this.setHealth );

    };

    public init ( tower ) {

        this.tower = tower;

        //

        this.setTopRotation = this.setTopRotation.bind( this );
        this.setShoot = this.setShoot.bind( this );
        this.changeTeam = this.changeTeam.bind( this );
        this.setHealth = this.setHealth.bind( this );

        //

        Network.addMessageListener( 'TowerRotateTop', this.setTopRotation );
        Network.addMessageListener( 'TowerMakeShot', this.setShoot );
        Network.addMessageListener( 'TowerChangeTeam', this.changeTeam );
        Network.addMessageListener( 'TowerSetHealth', this.setHealth );

    };

};

//

export { TowerNetwork };
