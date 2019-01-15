/*
 * @author ohmed
 * Basic start server
*/

process.on('uncaughtException', ( err ) => {

    console.log( new Date().toISOString(), err );

});

//

import { Game } from './Game';

//

Game.init();

//

console.log( '> DatTank ArenaServer started.' );
