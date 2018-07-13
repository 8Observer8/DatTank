/*
 * @author ohmed
 * Production environment config file
*/

export let ProductionEnvironment = {

    name:           'Production environment',

    web: {
        host:       'http://dattank.com',
        socketPort: 80
    },

    master: {
        host:       '165.227.160.4',
        port:       3100,
    }

};
