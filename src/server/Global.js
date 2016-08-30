/*
 * @author ohmed
 * Global params for server
*/

var os = require('os');
var argparse = require('argparse');

//

var parser = new argparse.ArgumentParser();

parser.addArgument(['--debug'], {
    action: 'storeTrue',
    defaultValue: false
});

var args = parser.parseArgs();

global.DEBUG = args.debug;
global.SOCKET_PORT = 8085;

//

global.utils = require('./utils/Utils');

global.DT = require('./core/DT');

global.DT.Arena = require('./core/Arena');
global.DT.Team = require('./core/Team');
global.DT.Player = require('./core/Player');
global.DT.Bot = require('./core/Bot');

global.DT.Network = require('./core/Network');
global.DT.ArenaManager = require('./core/ArenaManager');

//

global.DT.Tank = require('./units/core/Tank');

global.DT.Tank.USAT54 = require('./units/tanks/USA-T54');
global.DT.Tank.UKBlackPrince = require('./units/tanks/UK-BlackPrince');

//

var Rooms = require('engine.io-rooms');
var engine = require('engine.io');

global.io = engine.listen( SOCKET_PORT );
io = Rooms( io );
