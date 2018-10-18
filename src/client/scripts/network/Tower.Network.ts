/*
 * @author ohmed
 * DatTank Tower network handler
*/

import { Network } from '../network/Core.Network';
import { TowerObject } from '../objects/core/Tower.Object';
import * as OMath from '../OMath/Core.OMath';

//

export class TowerNetwork {

    private tower: TowerObject;

    //

    private filter ( data: any ) : boolean {

        const towerId = ( data.id ) ? data.id : data[0];
        if ( this.tower.id !== towerId ) return true;

        return false;

    };

    //

    private setTopRotation ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tower.setTopRotation( data[1] / 1000, data[2] / 1000 );

    };

    private setShoot ( data: any ) : void {

        if ( this.filter( data ) ) return;

        const bulletId = data[1];
        const x = data[2];
        const y = 20;
        const z = data[3];
        const directionRotation = data[4] / 1000;

        this.tower.makeShot( bulletId, new OMath.Vec3( x, y, z ), directionRotation );

    };

    private setHealth ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tower.setHealth( data[1] );

    };

    private changeTeam ( data: any ) : void {

        if ( this.filter( data ) ) return;

        const newTeamId = data[1];
        const killerId = data[2];

        this.tower.changeTeam( newTeamId, killerId );

    };

    //

    public dispose () : void {

        Network.removeMessageListener( 'TowerRotateTop', this.setTopRotation );
        Network.removeMessageListener( 'TowerMakeShot', this.setShoot );
        Network.removeMessageListener( 'TowerChangeTeam', this.changeTeam );
        Network.removeMessageListener( 'TowerSetHealth', this.setHealth );

    };

    public init ( tower: TowerObject ) : void {

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
