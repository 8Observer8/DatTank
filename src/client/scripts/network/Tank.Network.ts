/*
 * @author ohmed
 * DatTank Tank network handler
*/

import { Network } from "./../network/Core.Network";
import { TankCore } from "./../core/objects/Tank.Core";

//

class TankNetwork {

    private tank: TankCore;

    //

    private filter ( data ) : boolean {

        var tankId = ( data.id ) ? data.id : data[0];
        if ( this.tank.id !== tankId ) return false;

        return true;

    };

    //

    private setMove ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setMovement( data[1], data[2], data[3], data[4], data[5] );

    };

    private setRotateTop ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setTopRotation( data[1] / 1000 );

    };

    private setFriendlyFire ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.friendlyFire();

    };

    private setShoot ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.shoot( data[1] );

    };

    private setHealth ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setHealth( data[1], data[2] );

    };

    private setAmmo ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setAmmo( data[1] );

    };

    //

    public init ( tank ) {

        this.tank = tank;

        //

        Network.addMessageListener( 'TankFriendlyFire', this.setFriendlyFire.bind( this ) );
        Network.addMessageListener( 'TankMove', this.setMove.bind( this ) );
        Network.addMessageListener( 'TankRotateTop', this.setRotateTop.bind( this ) );
        Network.addMessageListener( 'TankShoot', this.setShoot.bind( this ) );
        Network.addMessageListener( 'TankSetHealth', this.setHealth.bind( this ) );
        Network.addMessageListener( 'TankSetAmmo', this.setAmmo.bind( this ) );

    };

};

//

export { TankNetwork };
