/*
 * @author ohmed
 * DatTank Team core file
*/

import { PlayerCore } from "./Player.Core";
import * as OMath from "./../OMath/Core.OMath";

//

class TeamCore {

    public static colors = {
        '0':        0xff0000,
        '1':        0x00ff00,
        '2':        0x0000ff,
        '3':        0xfcaa12,
        '1000':     0xaaaaaa
    };

    private static names = {
        '0':        'Red',
        '1':        'Green',
        '2':        'Blue',
        '3':        'Orange',
        '1000':     'Neutral'
    };

    //

    public id: number;
    public color: number;
    public name: string;
    public spawnPosition: OMath.Vec3 = new OMath.Vec3;

    //

    constructor ( params ) {

        this.id = params.id;
        this.color = TeamCore.colors[ this.id ];
        this.name = TeamCore.names[ this.id ];
        this.spawnPosition.set( params.spawnPosition.x, params.spawnPosition.y, params.spawnPosition.z );

    };

};

export { TeamCore };
