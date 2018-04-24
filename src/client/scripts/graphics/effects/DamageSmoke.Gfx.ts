/*
 * @author ohmed
 * DatTank Damage smoke graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { TankGfx } from '../objects/Tank.Gfx';
import { ResourceManager } from '../../managers/Resource.Manager';

//

class DamageSmokeGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private sprites: Array<THREE.Sprite> = [];
    private spriteNumber: number = 10;
    private time: number;
    private smokeDuration: number = 3000;
    private spriteTimeOffset: number = 3000 / 10;
    private inactiveSprites: number = 0;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) {

        if ( ! this.active && this.inactiveSprites === this.sprites.length ) {
            
            this.object.visible = false;
            return;

        }

        this.time += delta;

        for ( var i = 0, il = this.sprites.length; i < il; i ++ ) {

            let sprite = this.sprites[ i ];
            let progress = ( ( this.time + i * this.spriteTimeOffset ) % this.smokeDuration ) / this.smokeDuration;

            if ( sprite['inactive'] !== true && ! this.active && progress > 0.95 ) {

                sprite['inactive'] = true;
                this.inactiveSprites ++;

            }

            if ( sprite['inactive'] ) continue;

            sprite.position.y = 25 + 30 * progress;
            sprite.position.z = 2;

            if ( progress < 0.3 ) {
            
                sprite.material.opacity = progress / 0.6;

            } else {

                sprite.material.opacity = ( 1 - ( progress - 0.3 ) / 0.6 ) / 2;

            }

            let scale = 35 + 35 * progress;
            sprite.scale.set( scale, scale, scale );

        }

    };

    public show () {

        this.time = 0;
        this.object.visible = true;
        this.inactiveSprites = 0;
        this.active = true;

        for ( var i = 0, il = this.sprites.length; i < il; i ++ ) {

            this.sprites[ i ]['inactive'] = false;

        }

    };

    public hide () {

        this.active = false;

    };

    public init ( target: THREE.Object3D ) {

        let map = ResourceManager.getTexture( 'smoke.png' );
        let material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true, transparent: true });
        let sprite = new THREE.Sprite( material );
        let scale;

        material.depthTest = true;
        material.depthWrite = false;
        this.object.visible = false;

        //

        for ( var i = 0; i < this.spriteNumber; i ++ ) {

            sprite = sprite.clone();
            sprite.position.z = -15;
            sprite.position.y = 7 * i;
            sprite.position.x = Math.random() * 3 - 1.5;
            sprite.material = sprite.material.clone();
            sprite.material.opacity = 0;
            scale = ( 10 + Math.random() * 30 );
            sprite.scale.set( scale, scale, scale );
            this.object.add( sprite );
            this.sprites.push( sprite );

        }

        //

        target.add( this.object );

    };

};

//

export { DamageSmokeGfx };
