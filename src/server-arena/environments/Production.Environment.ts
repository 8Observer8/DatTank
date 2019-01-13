/*
 * @author ohmed
 * Production environment config file
*/

export let ProductionEnvironment = {

    name:           'Production environment',

    web: {
        host:       'http://dattank.io',
        port:       80,
    },

    arena: {
        host:       'fr-arena-s1.dattank.io',
        socketPort: 80,
    },

    master: {
        host:       '167.99.255.211',
        port:       3100,
    },

};
