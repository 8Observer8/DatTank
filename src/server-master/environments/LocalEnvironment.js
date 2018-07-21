/*
 * @author ohmed
 * Local dev environment config file
*/

var config = {

    name:           'Local dev environment',

    web: {
        host:       'http://localhost',
        port:       8092
    },

    fbApp: {
        key:    '1845382232185797',
        secret: 'a0fd8deff479d4655cafe7592f88d2a7',
        cbUrl:  'http://localhost:8092/auth/facebook/callback'
    }

};

//

module.exports = config;
