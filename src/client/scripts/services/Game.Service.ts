/*
 * @author ohmed
 * DatTank global Game service [api requests]
*/

class GameService {

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
