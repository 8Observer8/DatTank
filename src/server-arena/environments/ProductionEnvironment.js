/*
 * @author ohmed
 * Production environment config file
*/

var config = {

    name:           'Production environment',

    web: {
        host:       'http://dattank.com',
        socketPort: 8085
    },

    master: {
        host:       'http://localhost',
        port:       3100,
    }

};

//

module.exports = config;
