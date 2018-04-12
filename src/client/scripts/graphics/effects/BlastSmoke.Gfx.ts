/*
 * @author ohmed
 * DatTank BlastSmoke gfx object class
*/

import * as THREE from 'three';

import { ResourceManager } from "./../../managers/Resource.Manager";

//

class BlastSmokeGfx {

    public id: number;
    public enabled: boolean;

    private sprites: Array<THREE.Sprite>;
    private spriteNumber: number = 5;
    private object: THREE.Object3D = new THREE.Object3D();

    //

    public dispose () {

        // todo

    };

    public update () {

        if ( ! this.enabled ) return;

        for ( var i = 0; i < this.spriteNumber; i ++ ) {

            let sprite = this.sprites[ i ];
            let scale = 1 + i / 5;

            sprite.scale.set( scale, scale, scale );
            sprite.material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
            sprite.visible = true;

        }

    };

    //

    constructor () {

        let map = ResourceManager.getTexture( 'smoke.png' );
        let material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true, transparent: true });

        material.depthTest = true;
        material.depthWrite = false;

        for ( var i = 0; i < this.spriteNumber; i ++ ) {

            let sprite = new THREE.Sprite( material );
            let scale = 1 + i / 5;

            sprite.position.x = 0;
            sprite.position.y = 0;
            sprite.position.z = 5 + i / 7;
            sprite.material = sprite.material.clone();
            sprite.material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
            sprite.scale.set( scale, scale, scale );

            this.sprites.push( sprite );
            this.object.add( sprite );
    
        }

    };

};

//

export { BlastSmokeGfx };
