/*
 * @author ohmed
 * DatTank Team core file
*/

import { PlayerCore } from "./Player.Core";

//

class TeamCore {

    static colours = {
        '0':        '#ff0000',
        '1':        '#00ff00',
        '2':        '#0000ff',
        '3':        '#fcaa12',
        '1000':     '#aaaaaa'
    };

    static names = {
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

    //

    constructor ( params ) {

        // todo

    };

};

export { TeamCore };
