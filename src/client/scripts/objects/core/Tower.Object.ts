/*
 * @author ohmed
 * DatTank Tower Object class
*/

import { Arena } from "./../../core/Arena.Core";

import * as OMath from "./../../OMath/Core.OMath";
import { Logger } from "./../../utils/Logger";
import { TowerNetwork } from "./../../network/Tower.Network";
import { TowerGfx } from "./../../graphics/objects/Tower.Gfx";
import { TeamCore } from "./../../core/Team.Core";
import { TeamManager } from "./../../managers/Team.Manager";
import { HealthChangeLabelManager } from "./../../managers/HealthChangeLabel.Manager";
import { BulletManager } from "./../../managers/Bullet.Manager";
import { CollisionManager } from "./../../managers/Collision.Manager";

//

class TowerObject {

    public id: number;
    public team: TeamCore;

    public bullet: number;
    public rpm: number;
    public armour: number;

    public health: number;
    public rotation: number;
    public topRotation: number;
    public targetTopRotation: number;
    public position: OMath.Vec3 = new OMath.Vec3();
    public size: OMath.Vec3 = new OMath.Vec3( 50, 40, 50 );

    public title: string;

    protected network: TowerNetwork = new TowerNetwork();
    protected gfx: TowerGfx = new TowerGfx();

    //

    public makeShot ( bulletId: number, position: OMath.Vec3, directionRotation: number ) {

        if ( this.health <= 0 ) return;

        BulletManager.showBullet( bulletId, position, directionRotation );
        this.gfx.shoot();

    };

    public changeTeam ( newOwnerTeamId: number, killerId?: number ) {

        if ( killerId !== undefined ) {

            this.health = 100;

            if ( killerId === Arena.meId ) {

                Logger.newEvent( 'TowerCached', 'game' );

            }

        }

        //

        let team = TeamManager.getById( newOwnerTeamId );

        if ( team ) {

            this.team = team;
            this.gfx.changeTeam( this.team.color, killerId === undefined );
            this.gfx.label.update( this.health, this.armour, this.team.color );

        }

    };

    public setTopRotation ( currentAngle: number, targetAngle?: number ) {

        if ( targetAngle === undefined ) {

            targetAngle = currentAngle;

        }

        //

        this.topRotation = currentAngle;
        this.targetTopRotation = targetAngle;

        this.gfx.setTopRotation( this.topRotation );

    };

    public setHealth ( value: number ) {

        if ( this.health - value !== 0 ) {

            HealthChangeLabelManager.showHealthChangeLabel( new OMath.Vec3( this.position.x + 5 * ( Math.random() - 0.5 ), this.position.y, this.position.z + 5 * ( Math.random() - 0.5 ) ), value - this.health );

        }

        this.health = value;
        this.gfx.label.update( this.health, this.armour, this.team.color );

    };

    public update ( time: number, delta: number ) {

        let deltaRot = OMath.formatAngle( this.targetTopRotation ) - OMath.formatAngle( this.topRotation );

        if ( deltaRot > Math.PI ) {

            if ( deltaRot > 0 ) {

                deltaRot = - 2 * Math.PI + deltaRot;

            } else {

                deltaRot = 2 * Math.PI + deltaRot;

            }

        }

        if ( Math.abs( deltaRot ) > 0.01 ) {

            this.topRotation = OMath.formatAngle( this.topRotation + OMath.sign( deltaRot ) / 30 * ( delta / 50 ) );
            this.gfx.setTopRotation( this.topRotation );

        }

        this.gfx.update( time, delta );

    };

    public dispose () {

        this.gfx.dispose();
        this.network.dispose();
        CollisionManager.removeObject( this );

    };

    public init () {

        this.gfx.init( this );
        this.network.init( this );
        this.setTopRotation( this.topRotation );

        this.changeTeam( this.team.id );

        CollisionManager.addObject( this, 'box', false );

    };

    //

    constructor ( params: any ) {

        this.id = params.id;
        let team = TeamManager.getById( params.team );
        if ( ! team ) return;

        this.health = params.health;
        this.rotation = 0; // params.rotation;
        this.topRotation = params.rotation;
        this.targetTopRotation = params.newRotation;

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.gfx.setPosition( this.position );

    };

};

//

// get all towers and put into 'TowersList' object

import { T1Tower } from "./../../objects/towers/T1.Tower";

let TowerList = {
    T1:     T1Tower,
    getById: ( towerId: number ) => {

        for ( let item in TowerList ) {

            if ( typeof item === "string" ) {

                if ( TowerList[ item ].tid === towerId ) {

                    return item;

                }

            }

        }

        return null;

    }
};

//

export { TowerObject };
export { TowerList };
