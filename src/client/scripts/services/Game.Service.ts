/*
 * @author ohmed
 * DatTank global Game service [api requests]
*/

class GameService {

    public auth ( pid, sid, callback ) {

        $.get('/api/auth', { pid: pid, sid: sid }, function ( response ) {

            let pid = response.pid;
            let sid = response.sid;

            return callback( pid, sid );

        });

    };

    public getFreeArena ( callback ) {

        $.get('/api/getFreeArena', function ( response ) {

            let serverData = response;
            callback( serverData );
    
        });

    };

    public getTopPlayers ( callback ) {

        $.get('/api/getTopPlayers', function ( response ) {

            let players = response;
            callback( players );

        });

    };

};

//

export { GameService };
