/*
 * @author ohmed
 * DatTank Tower general class
*/

import { Arena } from "./../Arena.Core";

import * as OMath from "./../../OMath/Core.OMath";
import { TowerNetwork } from "./../../network/Tower.Network";
import { TowerGfx } from "./../../graphics/objects/Tower.Gfx";
import { TeamCore } from "./../Team.Core";
import { TeamManager } from "./../../managers/Team.Manager";
import { HealthChangeLabelManager } from "./../../managers/HealthChangeLabel.Manager";
import { BulletManager } from "./../../managers/Bullet.Manager";

//

class TowerCore {

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

    public title: string;

    protected network: TowerNetwork = new TowerNetwork();
    protected gfx: TowerGfx = new TowerGfx();

    //

    public makeShot ( bulletId: number, position: OMath.Vec3, directionRotation: number ) {

        if ( this.health <= 0 ) return;

        BulletManager.showBullet( bulletId, position, directionRotation );
        this.gfx.shoot();

    };

    public changeTeam ( team: TeamCore, newOwnerId: number ) {

        // todo

    };

    public setTopRotation ( currentAngle: number, targetAngle?: number ) {

        if ( targetAngle === undefined ) {

            targetAngle = currentAngle;

        }

        //

        this.topRotation = currentAngle;
        this.targetTopRotation = targetAngle;

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

    public init () {

        this.gfx.init( this );
        this.network.init( this );
        this.setTopRotation( this.topRotation );

    };

    //

    constructor ( params ) {

        this.id = params.id;
        this.team = TeamManager.getById( params.team );
        this.health = params.health;
        this.rotation = 0; // params.rotation;
        this.topRotation = params.rotation;

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.gfx.setPosition( this.position );

    };

};

//

// get all towers and put into 'TowersList' object

import { T1Tower } from "./../../objects/towers/T1.Tower";

let TowerList = {
    T1:     T1Tower,
    getById: function ( towerId ) {

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

export { TowerCore };
export { TowerList };
