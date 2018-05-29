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
        host:       '165.227.160.4',
        port:       3100,
    }

};

//

module.exports = config;
