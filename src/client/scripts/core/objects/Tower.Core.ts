/*
 * @author ohmed
 * DatTank Tower general class
*/

import { Arena } from "./../Arena.Core";

import * as OMath from "./../../OMath/Core.OMath";
import { TowerNetwork } from "./../../network/Tower.Network";
import { TowerGfx } from "./../../graphics/objects/Tower.Gfx";
import { TeamCore } from "./../Team.Core";
import { TeamManager } from "./../../managers/Team.Manager";

//

class TowerCore {

    public id: number;
    public team: TeamCore;

    public bullet: number;
    public rpm: number;
    public armour: number;

    public health: number;
    public rotation: number;
    public position: OMath.Vec3 = new OMath.Vec3();

    public title: string;

    protected network: TowerNetwork = new TowerNetwork();
    protected gfx: TowerGfx = new TowerGfx();

    //

    public shoot ( bulletId: number ) {

        // todo

    };

    public changeTeam ( team: TeamCore, newOwnerId: number ) {

        // todo

    };

    public update ( time: number, delta: number ) {

        // todo

    };

    public init () {

        this.gfx.init( this );

    };

    //

    constructor ( params ) {

        this.team = TeamManager.getById( params.team );
        this.health = params.health;
        this.rotation = params.rotation;

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.gfx.setPosition( this.position );

    };

};

//

// get all towers and put into 'TowersList' object

import { T1Tower } from "./../../objects/towers/T1.Tower";

let TowerList = {
    T1:     T1Tower,
    getById: function ( towerId ) {

        for ( let item in TowerList ) {

            if ( typeof item === "string" ) {

                if ( TowerList[ item ].tid === towerId ) {

                    return item;

                }

            }

        }

        return null;

    }
};

//

export { TowerCore };
export { TowerList };
