/*
 * @author ohmed
 * DatTank Arena core
*/

class ArenaCore {

    private serverIP: string;
    private serverID: string;

    preInit ( ip: string, id: string ) {

        this.serverIP = ip;
        this.serverID = id;

    };

};

//

export { ArenaCore };
