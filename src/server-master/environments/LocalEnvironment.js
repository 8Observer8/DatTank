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
        key:    'app-key',
        secret: 'unicorns-rulez',
        cbUrl:  'http://localhost:8092/auth/facebook/callback'
    }

};

//

module.exports = config;
