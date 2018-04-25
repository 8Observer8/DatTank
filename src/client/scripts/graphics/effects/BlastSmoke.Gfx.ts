/*
 * @author ohmed
 * DatTank BlastSmoke gfx object class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class BlastSmokeGfx {

    private sprites: Array<THREE.Sprite> = [];
    private spriteNumber: number = 5;
    private object: THREE.Object3D = new THREE.Object3D();
    private time: number;
    private duration: number = 500;

    public active: boolean = false;

    //

    public dispose () {

        // todo

    };

    public update ( time: number, delta: number ) {

        if ( ! this.active ) return;

        this.time += delta;
        let progress = this.time / this.duration;
        let enabled = false;

        for ( var i = 0, il = this.sprites.length; i < il; i ++ ) {

            let sprite = this.sprites[ i ];
            let scale = progress + ( 0.2 + progress ) * i;
            sprite.position.z = ( 0.1 + progress ) * i * OMath.sign( this.object.position.z );

            if ( progress < 0.1 ) {

                sprite.material.opacity = progress / 0.1;

            } else {

                sprite.material.opacity = 1 - ( progress - 0.1 ) / 0.9;

            }

            if ( sprite.material.opacity >= 0 ) {

                enabled = true;

            }

            sprite.scale.set( scale, scale, scale );

        }

        if ( ! enabled ) {

            this.active = false;
            this.object.visible = false;

        }

    };

    public show () {

        for ( var i = 0, il = this.sprites.length; i < il; i ++ ) {

            this.sprites[ i ].material.opacity = 0.5;
            this.sprites[ i ].scale.set( 1, 1, 1 );

        }

        this.time = 0;
        this.active = true;
        this.object.visible = true;

    };

    public init ( target: THREE.Object3D, offset: OMath.Vec3 ) {

        let map = ResourceManager.getTexture( 'smoke.png' );
        let material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true, transparent: true });

        material.depthTest = true;
        material.depthWrite = false;

        this.object.position.x += offset.x;
        this.object.position.y += offset.y;
        this.object.position.z += offset.z;

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

        this.object.visible = false;

        target.add( this.object );

    };

};

//

export { BlastSmokeGfx };
