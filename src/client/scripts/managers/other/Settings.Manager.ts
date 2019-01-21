/*
 * @author ohmed
 * DatTank Settings manager
*/

//

class SettingsManagerCore {

    private static instance: SettingsManagerCore;

    //

    constructor () {

        if ( SettingsManagerCore.instance ) {

            return SettingsManagerCore.instance;

        }

        SettingsManagerCore.instance = this;

    };

};

//

export let SettingsManager = new SettingsManagerCore();
