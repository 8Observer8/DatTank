/*
 * @author ohmed
 * DatTank arena-server item
*/

var ArenaServer = function ( aid, ip ) {

    this.aid = aid;
    this.ip = ip;

    this.lastStatusUpdate = false;
    this.players = 0;

};

ArenaServer.prototype = {};

//

module.exports = ArenaServer;
