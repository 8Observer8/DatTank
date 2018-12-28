/*
 * @author ohmed
 * Production environment config file
*/

export let StagingEnvironment = {

    name:           'Staging environment',

    web: {
        host:       'http://167.99.255.211',
        port:       8086,
        socketPort: 8085,
    },

    master: {
        host:       '167.99.255.211',
        port:       3100,
    },

};
