/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';

import { ResourceManager } from "./../../managers/Resource.Manager";

//

class TankGfx {

    public object: THREE.Object3D = new THREE.Object3D();

    private topMesh: THREE.Mesh;
    private baseMesh: THREE.Mesh;

    private animations = {};
    private sounds: Array<object>;

    //

    public init ( tankTitle: string ) {

        var materials;
        var tankBaseModel = ResourceManager.getModel( tankTitle + '-base' );
        var tankTopModel = ResourceManager.getModel( tankTitle + '-top' );

        // todo

    };

    public setTopRotation ( angle: number ) {

        // todo

    };

    public destroy () {

        this.animations['deathAction1'].stop();
        this.animations['deathAction1'].play();

        this.animations['deathAction2'].stop();
        this.animations['deathAction2'].play();

        setTimeout( () => {

            this.animations['deathAction1'].paused = true;
            this.animations['deathAction2'].paused = true;

        }, 1100 );

        this.sounds['explosion'].play();

    };

};

//

export { TankGfx };
