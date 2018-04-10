/*
 * @author ohmed
 * DatTank Arena core
*/

import { TeamManager } from "./../managers/Team.Manager";
import { PlayerManager } from "./../managers/Player.Manager";
import { TowerManager } from "./../managers/Tower.Manager";
import { BoxManager } from "./../managers/Box.Manager";

import { PlayerCore } from "./Player.Core";

//

class ArenaCore {

    private serverIP: string;
    private serverID: string;

    public teams: TeamManager = new TeamManager();
    public players: PlayerManager = new PlayerManager();
    public towers: TowerManager = new TowerManager();
    public boxes: BoxManager = new BoxManager();

    public me: PlayerCore;

    //

    public preInit ( ip: string, id: string ) {

        this.serverIP = ip;
        this.serverID = id;

    };

    public init () {

        // todo

    };

    public newTowers ( data ) {

        // todo

    };

    public newPlayers ( data ) {

        // todo

    };

    public newBoxes ( data ) {

        // todo

    };

    private update ( time: number, delta: number ) {

        // todo

    };

};

//

export { ArenaCore };
