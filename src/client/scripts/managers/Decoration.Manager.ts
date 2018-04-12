/*
 * @author ohmed
 * DatTank Arena decoration manager
*/

class DecorationManagerCore {

    private static instance: DecorationManagerCore;

    //

    constructor () {

        if ( DecorationManagerCore.instance ) {

            return DecorationManagerCore.instance;

        }

        DecorationManagerCore.instance = this;

    };

};

//

export let DecorationManager = new DecorationManagerCore();
