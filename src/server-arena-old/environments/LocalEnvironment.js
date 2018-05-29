/*
 * @author ohmed
 * Local dev environment config file
*/

var config = {

    name:           'Local dev environment',

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
