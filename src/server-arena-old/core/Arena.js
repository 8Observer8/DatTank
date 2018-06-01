
Arena.prototype.sendEventToPlayersInRange = function ( position, event, buffer, bufferView ) {

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        var player = this.playerManager.players[ i ];
        var dx = position.x - player.position.x;
        var dy = position.z - player.position.z;

        if ( Math.sqrt( dx * dx + dy * dy ) > 600 ) continue;
        if ( ! player.socket ) continue;

        networkManager.send( event, player.socket, buffer, bufferView );

    }

};

Arena.prototype.announce = function ( eventName, data, view, players ) {

    players = players || this.playerManager.players;

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        if ( players[ i ].socket ) {

            networkManager.send( eventName, players[ i ].socket, data, view );

        }

    }

};

Arena.prototype.updateLeaderboard = function () {

    function update () {

        if ( this.disposed ) return;

        var players = [];
        var teams = [];

        //

        function sortByProperty ( array, property ) {

            for ( var i = 0; i < array.length; i ++ ) {

                for ( var j = i; j < array.length; j ++ ) {

                    if ( array[ i ][ property ] < array[ j ][ property ] ) {

                        var tmp = array[ i ];
                        array[ i ] = array[ j ];
                        array[ j ] = tmp;

                    }

                }

            }

            return array;

        };

        //

        sortByProperty( this.playerManager.players, 'score' );

        for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

            players.push({
                id:         this.playerManager.players[ i ].id,
                login:      this.playerManager.players[ i ].login,
                team:       this.playerManager.players[ i ].team.id,
                kills:      this.playerManager.players[ i ].kills,
                score:      this.playerManager.players[ i ].score
            });

        }

        //

        for ( var i = 0, il = this.teamManager.teams.length; i < il; i ++ ) {

            if ( this.teamManager.teams[ i ].id === 1000 ) continue;

            teams.push({
                id:         this.teamManager.teams[ i ].id,
                score:      Math.floor( 100 * this.teamManager.teams[ i ].towers / this.towerManager.towers.length )
            });

        }

        //

        this.announce( 'ArenaLeaderboardUpdate', null, { players: players, teams: teams } );

    };

    //

    clearTimeout( this.leaderboardUpdateTimeout );
    this.leaderboardUpdateTimeout = setTimeout( update.bind( this ), 200 );

};
