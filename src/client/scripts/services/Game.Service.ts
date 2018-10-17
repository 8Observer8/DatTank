/*
 * @author ohmed
 * DatTank global Game service [api requests]
*/

class GameService {

    public getGarageConfig ( callback: ( objects: any[] ) => void ) {

        $.get('/api/garage/getObjects', function ( response ) {

            let objects = response;
            return callback( objects );

        });

    };

    public getFreeArena ( callback: ( data: any ) => void ) {

        $.get('/api/getFreeArena', function ( response ) {

            let serverData = response;
            return callback( serverData );

        });

    };

    public getTopPlayers ( callback: ( players: any[] ) => void ) {

        $.get('/api/getTopPlayers', function ( response ) {

            let players = response;
            return callback( players );

        });

    };

};

//

export { GameService };
