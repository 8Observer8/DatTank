/*
 * @author ohmed
 * Global params for server
*/

global.environment = require('./environments/EnvironmentDetect');

//

global.utils = require('./utils/Utils');
global.Game = require('./core/Game');
global.Game.Vec2 = require('./utils/Vector2');
global.Game.Vec3 = require('./utils/Vector3');

// import game managers

global.Game.DecorationManager = require('./managers/DecorationManager');
global.Game.BoxManager = require('./managers/BoxManager');
global.Game.NetworkManager = require('./managers/NetworkManager');
global.Game.PlayerManager = require('./managers/PlayerManager');
global.Game.BotManager = require('./managers/BotManager');
global.Game.TeamManager = require('./managers/TeamManager');
global.Game.TowerManager = require('./managers/TowerManager');
global.Game.ArenaManager = require('./managers/ArenaManager');
global.Game.CollisionManager = require('./managers/CollisionManager');

// import main objects

global.Game.EventDispatcher = require('./core/EventDispatcher');
global.Game.Arena = require('./core/Arena');
global.Game.Team = require('./core/Team');
global.Game.Player = require('./core/Player');
global.Game.Bot = require('./core/Bot');
global.Game.Bullet = require('./core/Bullet');

// import tank units

global.Game.Tower = require('./objects/core/Tower');

global.Game.Tank = require('./objects/core/Tank');

global.Game.Tank.USAT54 = require('./objects/tanks/USA-T54');
global.Game.Tank.UKBlackPrince = require('./objects/tanks/UK-BlackPrince');
global.Game.Tank.D32 = require('./objects/tanks/D-32');

global.Game.Decoration = require('./objects/core/Decoration');

global.Game.Decoration.Tree1 = require('./objects/decorations/Tree1');
global.Game.Decoration.Tree2 = require('./objects/decorations/Tree2');
global.Game.Decoration.Tree3 = require('./objects/decorations/Tree3');
global.Game.Decoration.Tree4 = require('./objects/decorations/Tree4');
global.Game.Decoration.Tree5 = require('./objects/decorations/Tree5');
global.Game.Decoration.Tree6 = require('./objects/decorations/Tree6');
global.Game.Decoration.Tree7 = require('./objects/decorations/Tree7');
global.Game.Decoration.Tree8 = require('./objects/decorations/Tree8');
global.Game.Decoration.Tree9 = require('./objects/decorations/Tree9');
global.Game.Decoration.Tree10 = require('./objects/decorations/Tree10');
global.Game.Decoration.Tree11 = require('./objects/decorations/Tree11');

global.Game.Decoration.Stones1 = require('./objects/decorations/Stones1');
global.Game.Decoration.Stones2 = require('./objects/decorations/Stones2');
global.Game.Decoration.Stones3 = require('./objects/decorations/Stones3');
global.Game.Decoration.Stones4 = require('./objects/decorations/Stones4');
global.Game.Decoration.Stones5 = require('./objects/decorations/Stones5');
global.Game.Decoration.Stones6 = require('./objects/decorations/Stones6');
global.Game.Decoration.Stones7 = require('./objects/decorations/Stones7');
global.Game.Decoration.Stones8 = require('./objects/decorations/Stones8');

global.Game.Decoration.OldCastle = require('./objects/decorations/OldCastle');

// import Improvement boxes

global.Game.Box = require('./objects/core/Box');
global.Game.Box.Health = require('./objects/boxes/Health');
global.Game.Box.Ammo = require('./objects/boxes/Ammo');

//

global.game = new Game();
global.networkManager = new Game.NetworkManager();
