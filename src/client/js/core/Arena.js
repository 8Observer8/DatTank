/*
 * @author ohmed
 * DatTank Arena object
*/

DT.Arena = function () {

    this.players = [];
    this.teams = [];
    this.towers = [];
    this.me = false;

    this.boxManager = new DT.BoxManager();
    this.pathFinder = new DT.PathFinder();

    //

    this.currentTime = false;

};

DT.Arena.prototype = {};

DT.Arena.prototype.init = function ( params ) {

    this.id = params.id;
    this.reset( params );

};

DT.Arena.prototype.clear = function () {

    this.teams = [];

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        this.players[ i ].dispose();

    }

    this.players = [];

};

DT.Arena.prototype.reset = function ( params ) {

    this.me = ( params.me !== undefined ) ? params.me : false;

    // init obstacles

    this.pathFinder.reset();
    ui.clearKills();

    view.addObsticles( params.obstacles );

    // add teams

    for ( var i = 0; i < params.teams.length; i ++ ) {

        this.teams.push( new DT.Team( params.teams[ i ] ) );

    }

    // add / init existing players

    for ( var i = 0, il = params.players.length; i < il; i ++ ) {

        var playerParams = params.players[ i ];
        var player = new DT.Player( this, playerParams );

        this.addPlayer( player );

    }

    // add boxes

    for ( var i = 0, il = params.boxes.length; i < il; i ++ ) {

        this.boxManager.addBox( params.boxes[ i ] );

    }

    // add towers

    this.addTowers( params.towers );

    //

    this.currentTime = params.currentTime;

    //

    ui.updateLeaderboard( this.players, this.me );
    ui.updateTeamScore( this.teams );

    ui.updateAmmo( this.me.ammo );
    ui.updateHealth( this.me.health );

};

DT.Arena.prototype.addTowers = function ( params ) {

    var sizeX = 130;
    var sizeZ = 130;
    var placingObjects = [];

    for ( var i = 0, il = params.length; i < il; i ++ ) {

        var tower = new DT.Tower( params[ i ] );
        this.towers.push( tower );
        placingObjects.push( [ new THREE.Vector3( tower.position.x - sizeX / 2, 0, tower.position.z - sizeZ / 2 ), new THREE.Vector3( tower.position.x + sizeX / 2, 0, tower.position.z + sizeZ / 2 ) ] );

    }

    DT.arena.pathFinder.placeObjects( placingObjects );

};

DT.Arena.prototype.getPlayerById = function ( playerId ) {

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === playerId ) {

            return this.players[ i ];

        }

    }

    return false;

};

DT.Arena.prototype.getTowerById = function ( towerId ) {

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        if ( this.towers[ i ].id === towerId ) {

            return this.towers[ i ];

        }

    }

    return false;

};

DT.Arena.prototype.getTeamById = function ( teamId ) {

    for ( var i = 0, il = this.teams.length; i < il; i ++ ) {

        if ( this.teams[ i ].id === teamId ) {

            return this.teams[ i ];

        }

    }

    return false;

};

DT.Arena.prototype.addPlayer = function ( player ) {

    if ( player.id === this.me ) {

        this.me = player;

        view.sunLight.position.set( player.position.x - 100, view.sunLight.position.y, player.position.z + 100 );
        view.sunLight.target = player.tank.object;
        view.sunLight.target.updateMatrixWorld();

    }

    this.players.push( player );

    //

    ui.updateLeaderboard( this.players, this.me );

};

DT.Arena.prototype.removePlayer = function ( player ) {

    var newPlayersList = [];

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === player.id ) continue;

        newPlayersList.push( this.players[ i ] );

    }

    player.dispose();

    this.players = newPlayersList;

};

DT.Arena.prototype.clear = function () {

    this.players = [];
    this.teams = [];

};
