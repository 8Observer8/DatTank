/*
 * @author ohmed
 * DatTank Bot Core
*/

import * as OMath from '../OMath/Core.OMath';
import { ArenaCore } from './Arena.Core';
import { PlayerCore } from './Player.Core';
import { TankObject } from '../objects/core/Tank.Object';
import { TowerObject } from '../objects/core/Tower.Object';

//

enum ACTION { NOTHING = -1, ESCAPE = 0, CHAISE = 1 };

//

export class BotCore {

    private static LoginBase = [
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        'calzone', 'augmenton', 'celianaro', 'pantor', 'elementalium', 'gazer', 'velent', 'oddio', 'taker', 'windmill',
        'soliter', 'roadkiller', 'bambuno', 'tratatar', 'sulfurio', 'helioss', 'seba', 'tracy', 'sandman', 'wooka', 'killdrop', 'warang',
        'HEqpOPMaJI', 'X_A_M', 'Vadic', '@did@s', 'Alliance', 'TRAKTORIST', 'MaJoR$', 'DeRJkiY', ']{olyan@', 'kaban', 'Semkiv', 'Agent',
        'CJIeCaPb', 'Delros',  'T0rM@Z', 'MAKAROV', 'T0rM@Z', 'Adas', 'bandit', 'Chetkii', 'Artuomchik', 'buben', 'DonKarleone', 'accura2k_',
        'GOPNIK', 'KabaniyKlyk', 'Kermit', 'KoLяN4Uk', 'KraCaV4nK', 'limon4ello', 'master_of_ceremony', 'Mr_Zaza', 'Biwen', 'ne_zli', 'NURCHIK',
        'StrannicK', 'Tîgrrr', 'Timent', 'Vision', 'X_A_M_E_P', 'Marckiz', 'bigman', 'creed', 'DarkFantastik', 'SlowPok', 'NaGiBatoR',
        'FRESH_MEAT', 'LegendarY', 'Rabbit_wolf', 'iJseven', 'Ha_KoJleHu_OJleHu', 'Vertyxan', 'kirpa', 'dindi', 'dildo', 'moskva', 'opz',
        'x_Evil_x', 'cTaTucT_kycToDpoT', 'TaNkIsT228', 'LaRDeN', 'EHOT', 'CruzTanks', 'Mazay_Ded', 'Dark_Foch', 'FL1pSTaR', 'SkyDog',
        'Nevrox', 'AWAJA', 'GrizeR', 'Jove_V_KyStax', 'Zybinjo', 'Pro1004EloVe4Ek', 'Ben_Laden', 'DeLviR', 'SkyLiTeR', '_fly_', '4ypa-4yps',
        'your mom', 'ok', 'ffff', '123', 'lol', 'lalaka', 'burzum', 'zeka', 'korb', 'zimba', 'koss', 'russka kurva', 'kol', 'atari', 'kombo',
        'per4uk', 'qwddcc', 'qwerty', 'zopa', 'timba', 'karramba', 'abdul', 'dx', 'ed', 'eddy', 'freeman', 'wow', 'tom', 'sin', 'cos', 'io',
        'datkiller', 'paul', 'lucifer', 'zomb', 'zombie', 'zombie666', 'devil', 'moskal', 'USSR', 'ripper', 'felix', '911', 'mamal', 'sdf',
        'kiss', 'die_wegan', 'jelly', 'oppa', 'dizer', 'dendy', 'paranoid', 'android', 'mathafaka', 'sirian', 'ajar', 'asian', 'nervos',
        'gblz', 'trevor', 'lol poney', 'matardar', 'diego', 'sniper', 'kemper', 'datend', 'kiba', 'andromeda', 'feedback', 'shotback',
        'wtf', 'dat kurwa', 'dfbgnhg', 'andy', 'фффф', 'опачик', 'pavel', 'T52', 'NZT', 'D3', 'Bimba', 'makaka', 'мразь', '...', 'kibaba',
        'kebab', 'nazzi', 'nippy', 'romb', 'opa', 'zip', 'rarka', 'limbo', '21k', 'kilo', 'jesus', 'kepasa', 'kantor', '456453425', 'upyr',
        'kinchasa', 'lover', 'marta', 'ochkar', 'poseidon', 'zeus', 'stalker', 'vova', 'vovchik', 'poop', 'yamaha', 'сука', 'упячка',
        'танк', 'кузя', 'kolyan', 'zadrot', 'lamp', 'kozavka', 'dikar', 'artist', 'kopa', 'chicken', 'orbea', 'z358', 'hjgdfd', 'sdfdgdg',
    ];

    //

    public id: number;
    public player: PlayerCore;
    public removed: boolean = false;
    public login: string;

    public tankConfig = {
        tank:       'IS2001',
        cannon:     'Plasma-g1',
        armor:      'X-shield',
        engine:     'KX-v8',
    };

    private target: TankObject | TowerObject | null;
    private action: ACTION;
    private maxKills: number;
    private readonly delayAfterSpawn: number = 2200;

    private arena: ArenaCore;

    //

    public levelUp () : void {

        const statId = Math.floor( Math.random() * 4 );
        this.player.tank.updateStats( statId );

    };

    public die () : void {

        const players = this.arena.playerManager.getPlayers();
        const bots = this.arena.botManager.getBots();
        const botNum = this.arena.botManager.botNum;

        if ( players.length - bots.length < botNum && this.player.kills < this.maxKills ) {

            setTimeout( this.player.respawn.bind( this.player, this.tankConfig ), 3000 );

        } else {

            setTimeout( () => {

                if ( this.arena.disposed ) return;
                this.arena.botManager.remove( this );

            }, 2000 );

        }

    };

    private pickLogin () : string {

        let login = '';
        const bots = this.arena.botManager.getBots();

        while ( login === '' ) {

            login = BotCore.LoginBase[ Math.floor( BotCore.LoginBase.length * Math.random() ) ] || '';

            if ( ! login ) {

                for ( let i = 0, il = bots.length; i < il; i ++ ) {

                    if ( login === bots[ i ].login ) {

                        login = '';

                    }

                }

            }

        }

        return login;

    };

    private init () : void {

        this.arena.addPlayer({ login: this.login, tankConfig: this.tankConfig, socket: false }, ( player: PlayerCore ) => {

            this.player = player;
            player.tank.ammo = 10000000;
            player.bot = this;

        });

    };

    private calcTankStrength ( target: TankObject | TowerObject ) : number {

        if ( target.health < 20 ) return 0;

        if ( target instanceof TankObject ) {

            if ( target.ammo < 8 ) return 0;
            return ( target.health * target.cannon.rpm * target.base.cannonCoef * target.cannon.damage * target.armor.armor );

        } else {

            return target.health * target.rpm * target.damage * target.armor;

        }

    };

    private updateMovement () : void {

        if ( Math.abs( this.player.tank.position.x ) > 1400 || Math.abs( this.player.tank.position.z ) > 1400 ) {

            this.die();
            return;

        }

        if ( this.action === ACTION.NOTHING ) {

            this.player.tank.setMovement( 0, 0 );

        } else if ( ( this.action === ACTION.ESCAPE || this.action === ACTION.CHAISE ) && this.target ) {

            let dx = this.target.position.x - this.player.tank.position.x;
            let dz = this.target.position.z - this.player.tank.position.z;

            if ( this.action === ACTION.ESCAPE ) {

                dx *= -1;
                dz *= -1;

            }

            const dist = Math.sqrt( dx * dx + dz * dz );
            const angle = OMath.formatAngle( Math.atan2( dx, dz ) );

            const viewRange = 20;
            const newPos1 = this.player.tank.position.clone();
            newPos1.x += viewRange * dx / dist;
            newPos1.z += viewRange * dz / dist;
            const newPos2 = this.player.tank.position.clone();
            newPos1.x += 1.2 * viewRange * dx / dist;
            newPos1.z += 1.2 * viewRange * dz / dist;

            const freeDirection = this.player.arena.collisionManager.isPlaceFree( newPos1, 15, [ this.player.tank.id ] ) && this.player.arena.collisionManager.isPlaceFree( newPos2, 5, [ this.player.tank.id ] );
            const x = ( this.action === ACTION.CHAISE && dist < this.player.tank.cannon.range ) ? 0 : 1;
            let y = ( Math.abs( angle - this.player.tank.rotation ) > 0.1 ) ? OMath.sign( angle - this.player.tank.rotation ) : 0;

            if ( ! freeDirection ) y = 1;

            this.player.tank.setMovement( x, y );

        }

    };

    private findTask () : void {

        const tanks = this.arena.tankManager.getTanks();
        const towers = this.arena.towerManager.getTowers();

        let target = null;
        let minDist = 2000;
        let distance;

        // search for Player target

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            const tank = tanks[ i ];

            if ( tank.team.id === this.player.team.id || tank.health <= 0 ) continue;

            distance = tank.position.distanceTo( this.player.tank.position );

            if ( distance <= minDist ) {

                if ( this.calcTankStrength( this.player.tank ) > this.calcTankStrength( tank ) ) {

                    this.action = ACTION.CHAISE;

                } else if ( 1.2 * this.calcTankStrength( this.player.tank ) < this.calcTankStrength( tank ) ) {

                    this.action = ACTION.ESCAPE;

                }

                minDist = distance;
                target = tank;

            }

        }

        // if ! target search for Tower target

        if ( ! target || minDist > 280 ) {

            minDist = 1000;

            for ( let i = 0, il = towers.length; i < il; i ++ ) {

                const tower = towers[ i ];

                if ( tower.team === this.player.team ) continue;

                distance = this.player.tank.position.distanceTo( tower.position );

                if ( distance <= minDist ) {

                    minDist = distance;
                    target = tower;

                    if ( this.calcTankStrength( this.player.tank ) > this.calcTankStrength( tower ) ) {

                        this.action = ACTION.CHAISE;

                    } else if ( 1.2 * this.calcTankStrength( this.player.tank ) < this.calcTankStrength( tower ) ) {

                        this.action = ACTION.ESCAPE;

                    }

                }

            }

        }

        //

        if ( ! target ) {

            this.action = ACTION.NOTHING;

        }

        this.target = target;

        //

        if ( target && minDist < this.player.tank.cannon.range ) {

            const dx = this.player.tank.position.x - target.position.x;
            const dz = this.player.tank.position.z - target.position.z;
            let rotation;
            let deltaAngle;

            rotation = Math.atan2( dx, dz ) + Math.PI / 2 - this.player.tank.rotation;
            deltaAngle = OMath.formatAngle( rotation );
            deltaAngle = ( deltaAngle > Math.PI ) ? deltaAngle - 2 * Math.PI : deltaAngle;
            deltaAngle = ( deltaAngle < - Math.PI ) ? - deltaAngle + 2 * Math.PI : deltaAngle;

            if ( deltaAngle < 0.2 ) {

                this.player.tank.makeShot();

            }

        }

    };

    public update ( delta: number, time: number ) : void {

        if ( this.player.tank.health <= 0 ) return;
        if ( Date.now() - this.player.spawnTime < this.delayAfterSpawn ) return;

        //

        this.updateMovement();
        this.findTask();

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;
        this.maxKills = Math.floor( Math.random() * 60 ) + 8;
        this.login = this.pickLogin();

        this.init();

    };

};
