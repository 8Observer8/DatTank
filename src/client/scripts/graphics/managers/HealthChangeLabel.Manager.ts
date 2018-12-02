/*
 * @author ohmed
 * DatTank Arena health change label manager
*/

import { HealthChangeLabelGfx } from '../effects/labels/HealthChangeLabel.Gfx';
import * as OMath from '../../OMath/Core.OMath';

//

class HealthChangeLabelManagerCore {

    private static instance: HealthChangeLabelManagerCore;

    private pool: HealthChangeLabelGfx[] = [];
    private poolSize: number = 30;

    //

    public getNewHealthChangeLabel () : HealthChangeLabelGfx | null {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].active === false ) {

                return this.pool[ i ];

            }

        }

        return null;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            this.pool[ i ].update( time, delta );

        }

    };

    public showHealthChangeLabel ( position: OMath.Vec3, healthChange: number ) : void {

        const healthChangeLabel = this.getNewHealthChangeLabel();
        if ( ! healthChangeLabel ) return;
        healthChangeLabel.setActive( position, healthChange );

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const healthChangeLabel = new HealthChangeLabelGfx();
            healthChangeLabel.init();
            this.pool.push( healthChangeLabel );

        }

    };

    //

    constructor () {

        if ( HealthChangeLabelManagerCore.instance ) {

            return HealthChangeLabelManagerCore.instance;

        }

        HealthChangeLabelManagerCore.instance = this;

    };

};

//

export let HealthChangeLabelManager = new HealthChangeLabelManagerCore();
