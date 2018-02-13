/*
 * @author ohmed
 * DatTank master-server db connection
*/

var mongoose = require('mongoose');

//

mongoose.connect( 'mongodb://localhost/DatTank' );

var connection = mongoose.connection;

connection.once( 'open', function (  ) {

    console.log( '> DatTank MasterServer: MongoDB connection succeeded.' );

});

//

module.exports = {
    mongoose:       mongoose,
    connection:     connection,
    models:         {
        topPlayers:     require('./TopPlayers')
    }
};
