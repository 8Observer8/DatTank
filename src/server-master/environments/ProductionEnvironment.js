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
        key:    '178574662917890',
        secret: '076201bbaa326d7ba0ab2fce011f068d',
        cbUrl:  'https://dattank.io/auth/facebook/callback'
    }

};

//

module.exports = config;
