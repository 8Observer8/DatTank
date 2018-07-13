/*
 * @author ohmed
 * DatTank Large Object explosion graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { ResourceManager } from "./../../managers/Resource.Manager";
import { GfxCore } from "./../Core.Gfx";

//

class LargeExplosionGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private sprite: THREE.Sprite;
    private time: number;
    private duration: number = 1000;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) {

        if ( ! this.active ) return;
        this.time += delta;

        let progress = this.time / this.duration;
        let map = this.sprite.material.map;

        map.offset.x = Math.floor( 20 * progress ) % 5;
        map.offset.y = Math.floor( Math.floor( 20 * progress ) / 5 );

        this.sprite.scale.x = 30 + 3 * Math.sin( progress );
        this.sprite.scale.y = 30 + 3 * Math.sin( progress );

        if ( progress >= 1 ) {

            this.active = false;

        }

        this.object.updateMatrixWorld( true );

    };

    public dispose () {

        // todo

    };

    public setActive ( position: OMath.Vec3 ) {

        this.object.position.set( position.x, position.y, position.z );
        this.object.visible = true;
        this.active = true;

    };

    public init () {

        let map, material;

        map = ResourceManager.getTexture( 'explosion1.png' ).clone();
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 0.2, 0.25 );
        map.offset.set( 0, 0.75 );
        map.needsUpdate = true;

        material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true });
        this.sprite = new THREE.Sprite( material );

        this.sprite.position.z = -15;
        this.sprite.position.y = 37;
        this.sprite.position.x = Math.random() * 3 - 1.5;
        this.sprite.material.opacity = 0.8 - 0.8 / 5;
        let scale = 80;
        this.sprite.scale.set( scale, scale, scale );
        this.object.add( this.sprite );
        this.object.visible = false;
        this.object.name = 'LargeExplosion';

        //

        if ( ! GfxCore.coreObjects['largeExplosions'] ) {

            GfxCore.coreObjects['largeExplosions'] = new THREE.Object3D();
            GfxCore.coreObjects['largeExplosions'].name = 'LargeExplosions';
            GfxCore.scene.add( GfxCore.coreObjects['largeExplosions'] );

        }

        GfxCore.coreObjects['largeExplosions'].add( this.object );
        
    };

};

//

export { LargeExplosionGfx };
