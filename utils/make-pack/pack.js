/*
 * @author ohmed
 * pack generating files
*/

var cmd = require('node-cmd');
var Promise = require('bluebird');
const getAsync = Promise.promisify( cmd.get, { multiArgs: true, context: cmd } );

// generate ingame-pack

getAsync(`
    cd ../../models/json/ingame
    zip -r ingame.pack .
    rsync -av ingame.pack ../../../src/client/resources/ingame.pack
`).then( data => {

    console.log( 'Success building ingame.pack' );

}).catch(err => {

    console.log( 'cmd err', err );

});

// generate garage.pack

getAsync(`
    cd ../../models/json/garage
    zip -r garage.pack .
    rsync -av garage.pack ../../../src/client/resources/garage.pack
`).then( data => {

    console.log( 'Success building garage.pack' );

}).catch(err => {

    console.log( 'cmd err', err );

});
