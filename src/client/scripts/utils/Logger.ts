/*
 * @author ohmed
 * DatTank events logger
*/

class Logger {

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

};

//

export { Logger };
