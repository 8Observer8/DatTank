/*
 * @author ohmed
 * DatTank events logger
*/

class LoggerCore {

    private static instance: LoggerCore;

    //

    public newEvent ( eventName: string, category: string ) {

        if ( ! eventName ) {

            console.log( 'Unknown event "' + eventName + '".' );
            return;

        }

        category = category || 'arena';

        ga('send', {
            hitType:        'event',
            eventCategory:  category,
            eventAction:    eventName
        });

    };

    constructor () {

        if ( LoggerCore.instance ) {

            return LoggerCore.instance;

        }

        LoggerCore.instance = this;

    };

};

//

export let Logger = new LoggerCore();
