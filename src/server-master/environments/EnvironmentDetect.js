/*
 * @author ohmed
 * DatTank environment manager
*/

var environment;

if ( __dirname.indexOf('/dattank-master-prod/') !== -1 ) {

    environment = require('./ProductionEnvironment.js');

} else if ( __dirname.indexOf('/dattank-master-stage/') !== -1 ) {

    environment = require('./StageEnvironment.js');

} else {

    environment = require('./LocalEnvironment.js');

}

//

module.exports = environment;
