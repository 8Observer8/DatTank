/*
 * @author ohmed
 * DatTank Bullet explosion graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { ResourceManager } from "./../../managers/Resource.Manager";
import { GfxCore } from "./../Core.Gfx";

//

class ExplosionGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private sprite: THREE.Sprite;
    private time: number;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) {

        if ( ! this.active ) return;
        this.time += delta;

        if ( this.time > 50 ) {

            let map = this.sprite.material.map;

            if ( map.offset.y >= 0 ) {

                map.offset.x += 0.25;
                this.time = 0;

                if ( map.offset.x === 1 && map.offset.y !== 0 ) {

                    map.offset.x = 0;
                    map.offset.y -= 0.25;

                } else if ( map.offset.y === 0 && map.offset.x === 1 ) {

                    this.sprite.scale.set( 80, 80, 80 );
                    this.object.visible = false;
                    this.active = false;
                    map.offset.set( 0, 1 );

                }

            }

        }

    };

    public dispose () {

        // todo

    };

    public setActive ( position: OMath.Vec3 ) {

        this.time = 0;
        this.object.position.set( position.x, position.y, position.z );
        this.object.visible = true;
        this.active = true;

    };

    public init () {

        let map = ResourceManager.getTexture( 'explosion2.png' ).clone();
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 0.25, 0.25 );
        map.offset.set( 0, 0.75 );
        map.needsUpdate = true;

        let material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, opacity: 0.7, fog: true });
        this.sprite = new THREE.Sprite( material );

        this.sprite.scale.set( 80, 80, 80 );
        this.object.visible = false;
        this.object.add( this.sprite );
        this.object.name = 'Explosion';

        //

        if ( ! GfxCore.coreObjects['explosions'] ) {

            GfxCore.coreObjects['explosions'] = new THREE.Object3D();
            GfxCore.coreObjects['explosions'].name = 'Explosions';
            GfxCore.scene.add( GfxCore.coreObjects['explosions'] );

        }

        GfxCore.coreObjects['explosions'].add( this.object );

    };

};

//

export { ExplosionGfx };
