/*
 * @author ohmed
 * DatTank master-server global params
*/

global.DT = require('./core/Core');
global.DT.ArenaServer = require('./core/ArenaServer');

global.DT.PlayerManager = require('./managers/PlayerManager');
global.DT.NetworkManager = require('./managers/NetworkManager');
global.DT.ArenaServersManager = require('./managers/ArenaServersManager');

global.environment = require('./environments/EnvironmentDetect');
global.DB = require('./db/Connection');
