/*
 * @author ohmed
 * DatTank Team core file
*/

import { PlayerCore } from "./Player.Core";
import * as OMath from "./../OMath/Core.OMath";

//

class TeamCore {

    private static colors = {
        '0':        '#ff0000',
        '1':        '#00ff00',
        '2':        '#0000ff',
        '3':        '#fcaa12',
        '1000':     '#aaaaaa'
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
