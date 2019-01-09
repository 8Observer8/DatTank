/*
 * @author ohmed
 * Production environment config file
*/

var config = {

    name:           'Production environment',

    web: {
        host:       'http://dattank.com',
        port:       80,
        socketPort: 8085
    },

    fbApp: {
        key:    '1845382232185797',
        secret: 'a0fd8deff479d4655cafe7592f88d2a7',
        cbUrl:  'http://localhost:8092/auth/facebook/callback'
    }

};

//

module.exports = config;
