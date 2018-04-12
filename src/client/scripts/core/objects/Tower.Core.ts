/*
 * @author ohmed
 * DatTank Tower general class
*/

import { Arena } from "./../Arena.Core";

import { TowerNetwork } from "./../../network/Tower.Network";
import { TowerGfx } from "./../../graphics/objects/Tower.Gfx";
import { TeamCore } from "./../Team.Core";
import { TeamManager } from "./../../managers/Team.Manager";

//

let TowerList = {};

//

class TowerCore {

    public id: number;
    public team: TeamCore;

    public health: number;
    public rotation: number;
    public position = { x: 0, y: 0, z: 0 };

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

    //

    constructor ( params ) {

        this.team = TeamManager.getById( params.team );
        this.health = params.health;
        this.rotation = params.rotation;

        this.position.x = params.position.x;
        this.position.y = params.position.y;
        this.position.z = params.position.z;

    };

};

//

export { TowerCore };
