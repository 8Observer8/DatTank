/*
 * @author ohmed
 * Staging test environment config file
*/

var config = {

    name:           'Staging test environment',

    web: {
        host:       'http://localhost',
        socketPort: 8085
    },

    master: {
        host:       'localhost',
        port:       3100,
    }

};

//

module.exports = config;
