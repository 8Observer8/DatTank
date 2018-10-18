/*
 * @author ohmed
 * DatTank global Game service [api requests]
*/

export class GameService {

    public getGarageConfig ( callback: ( objects: any[] ) => void ) : void {

        $.get('/api/garage/getObjects', ( response ) => {

            const objects = response;
            return callback( objects );

        });

    };

    public getFreeArena ( callback: ( data: any ) => void ) : void {

        $.get('/api/getFreeArena', ( response ) => {

            const serverData = response;
            return callback( serverData );

        });

    };

    public getTopPlayers ( callback: ( players: any[] ) => void ) : void {

        $.get('/api/getTopPlayers', ( response ) => {

            const players = response;
            return callback( players );

        });

    };

};
