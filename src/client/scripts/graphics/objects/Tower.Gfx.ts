/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';

import { ResourceManager } from "./../../managers/Resource.Manager";

//

class TowerGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private topMesh: THREE.Mesh;
    private baseMesh: THREE.Mesh;

    private animations = {};
    private sounds: Array<object>;

    //

    public init ( towerTitle: string ) {

        var materials;
        var tankBaseModel = ResourceManager.getModel( towerTitle + '-base' );
        var tankTopModel = ResourceManager.getModel( towerTitle + '-top' );

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

export { TowerGfx };
