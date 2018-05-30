/*
 * @author ohmed
 * Production environment config file
*/

export let StagingEnvironment = {

    name:           'Staging environment',

    web: {
        host:       'http://dattank.com',
        socketPort: 8085
    },

    master: {
        host:       '165.227.160.4',
        port:       3100,
    }

};
