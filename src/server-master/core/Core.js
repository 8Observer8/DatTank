/*
 * @author ohmed
 * DatTank master-server core
*/

var Core = function () {

    this.networkManager = false;
    this.arenaServersManager = false;
    this.playerManager = false;

};

Core.prototype = {};

//

Core.prototype.init = function () {

    this.networkManager = new DT.NetworkManager();
    this.arenaServersManager = new DT.ArenaServersManager();
    this.playerManager = new DT.PlayerManager();

};

//

module.exports = new Core();
