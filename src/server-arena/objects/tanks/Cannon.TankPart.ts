/*
 * @author ohmed
 * Tank Cannon part
*/

import { TankObject } from '../core/Tank.Object';

//

export class CannonTankPart {

    public tank: TankObject;
    public nid: number;
    public title: string;

    public shootType: string;
    public rpm: number;
    public damage: number;
    public overheat: number;
    public range: number;

    public temperature: number;

    private shootingInterval: any;

    //

    constructor ( tank: TankObject, params: any, level: number ) {

        this.tank = tank;
        this.nid = params.nid;
        this.title = params.title;

        this.shootType = params.shootType;
        this.rpm = params.levels[ level ].rpm;
        this.damage = params.levels[ level ].damage;
        this.overheat = params.levels[ level ].overheat;
        this.range = params.levels[ level ].range;

        this.temperature = 0;

    };

    //

    public startShooting () : void {

        clearInterval( this.shootingInterval );
        this.shootingInterval = setInterval( () => {

            this.makeShot();

        }, 100 );

        this.makeShot();

    };

    public stopShooting () : void {

        clearInterval( this.shootingInterval );

    };

    public makeShot () : void {

        if ( this.shootType === 'bullet' ) {

            this.bulletShot();

        } else if ( this.shootType === 'laser' ) {

            this.laserShot();

        } else if ( this.shootType === 'fire' ) {

            this.fireShot();

        } else {

            return console.log('Unknown cannon shoot type.');

        }

    };

    //

    private laserShot () : void {

        // todo

    };

    private bulletShot () : void {

        // todo

    };

    private fireShot () : void {

        // todo

    };

};
