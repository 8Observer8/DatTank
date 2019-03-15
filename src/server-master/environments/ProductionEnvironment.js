/*
 * @author ohmed
 * Production environment config file
*/

var config = {

    name:           'Production environment',

    web: {
        host:       'https://dattank.io',
        port:       80,
        socketPort: 8085
    },

    fbApp: {
        key:    'app-key',
        secret: 'unicorns-rulez',
        cbUrl:  'https://dattank.io/auth/facebook/callback'
    }

};

//

module.exports = config;
