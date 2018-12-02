/*
 * @author ohmed
 * Laser beam object
*/

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';
import { TankObject } from './Tank.Object';
import { TowerObject } from './Tower.Object';

//

export class LaserBeamShotObject {

    private static numIds: number = 1;

    public id: number;
    public active: boolean = false;
    public owner: TankObject | TowerObject;
    public position: OMath.Vec3 = new OMath.Vec3();
    public angle: number = 0;

    public range: number = 200;
    public readonly type: string = 'LaserBeam';

    //

    public activate ( position: OMath.Vec3, angle: number, range: number, owner: TankObject | TowerObject ) : void {

        this.active = true;
        this.position.set( position.x, 8, position.z );

        this.range = range;
        this.angle = angle;
        this.owner = owner;

    };

    public updatePosRot ( position: OMath.Vec3, angle: number ) : void {

        this.position.copy( position );
        this.angle = angle;

    };

    public deactivate () : void {

        this.active = false;

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        if ( LaserBeamShotObject.numIds > 1000 ) LaserBeamShotObject.numIds = 0;
        this.id = LaserBeamShotObject.numIds ++;

    };

};
