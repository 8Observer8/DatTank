/*
 * @author ohmed
 * DatTank Arena health change label manager
*/

import { HealthChangeLabelGfx } from "./../graphics/effects/HealthChangeLabel.Gfx";
import * as OMath from "./../OMath/Core.OMath";

//

class HealthChangeLabelManagerCore {

    private static instance: HealthChangeLabelManagerCore;

    private pool: Array<HealthChangeLabelGfx> = [];
    private poolSize: number = 30;

    //

    public getNewHealthChangeLabel () {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].active === false ) {

                return this.pool[ i ];

            }

        }

        return null;

    };

    public update ( time: number, delta: number ) {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            this.pool[ i ].update( time, delta );

        }

    };

    public showHealthChangeLabel ( position: OMath.Vec3, healthChange: number ) {

        let healthChangeLabel = this.getNewHealthChangeLabel();
        healthChangeLabel.setActive( position, healthChange );

    };

    public init () {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            let healthChangeLabel = new HealthChangeLabelGfx();
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
