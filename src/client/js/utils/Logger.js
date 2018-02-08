/*
 * @author ohmed
 * DatTank events logger
*/

Game.Logger = function () {

    // nothing here

};

Game.Logger.prototype = {};

//

Game.Logger.prototype.newEvent = function ( eventName, category ) {

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
