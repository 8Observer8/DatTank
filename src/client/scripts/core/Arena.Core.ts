/*
 * @author ohmed
 * DatTank Arena core
*/

import { TeamManager } from "./../managers/Team.Manager";
import { PlayerManager } from "./../managers/Player.Manager";
import { TowerManager } from "./../managers/Tower.Manager";
import { BoxManager } from "./../managers/Box.Manager";

//

class ArenaCore {

    private serverIP: string;
    private serverID: string;

    public teams: TeamManager = new TeamManager();
    public players: PlayerManager = new PlayerManager();
    public towers: TowerManager = new TowerManager();
    public boxes: BoxManager = new BoxManager();

    //

    preInit ( ip: string, id: string ) {

        this.serverIP = ip;
        this.serverID = id;

    };

};

//

export { ArenaCore };
