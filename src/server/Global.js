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

// import game managers

global.DT.BoxManager = require('./managers/BoxManager');
global.DT.Network = require('./managers/NetworkManager');
global.DT.ArenaManager = require('./managers/ArenaManager');

// import main objects

global.DT.Arena = require('./core/Arena');
global.DT.Team = require('./core/Team');
global.DT.Tower = require('./core/Tower');
global.DT.Player = require('./core/Player');
global.DT.Bot = require('./core/Bot');

// import tank units

global.DT.Tank = require('./objects/core/Tank');

global.DT.Tank.USAT54 = require('./objects/tanks/USA-T54');
global.DT.Tank.UKBlackPrince = require('./objects/tanks/UK-BlackPrince');

// import Improvement boxes

global.DT.Box = require('./objects/core/Box');
global.DT.Box.Health = require('./objects/boxes/Health');
global.DT.Box.Ammo = require('./objects/boxes/Ammo');
