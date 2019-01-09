/*
 * @author ohmed
 * DatTank arena-server item
*/

var ArenaServer = function ( aid, ip ) {

    this.aid = aid;
    this.ip = ip;

    this.lastStatusUpdate = false;
    this.players = 0;
    this.bots = 0;
    this.boxes = 0;
    this.bullets = 0;

};

ArenaServer.prototype = {};

//

module.exports = ArenaServer;
