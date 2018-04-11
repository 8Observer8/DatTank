/*
 * @author ohmed
 * DatTank Box graphics class
*/

import * as THREE from 'three';

import { ResourceManager } from "./../../managers/Resource.Manager";

//

class BoxGfx {

    private animTime: number = 600 * Math.random() * Math.PI * 2;
    private mesh: THREE.Mesh;

    //

    public remove () {

        // todo

    };

    public update ( time: number, delta: number ) {

        this.animTime += delta;
        this.mesh.rotation.y = Math.sin( this.animTime / 600 );
        this.mesh.position.y = Math.sin( this.animTime / 300 ) + 20;

    };

    public init () {

        // todo

    };

};

//

export { BoxGfx };
