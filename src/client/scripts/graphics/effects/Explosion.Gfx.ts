/*
 * @author ohmed
 * DatTank Bullet explosion graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../OMath/Core.OMath';
import { ResourceManager } from '../../managers/Resource.Manager';
import { GfxCore } from '../Core.Gfx';

//

export class ExplosionGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private sprite: THREE.Sprite;
    private time: number;

    private maps: THREE.Texture[] = [];

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.active ) return;
        this.time += delta;

        if ( this.time > 50 ) {

            const map = ( this.sprite.material as THREE.SpriteMaterial ).map!;

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

        this.object.updateMatrixWorld( true );

    };

    public setActive ( position: OMath.Vec3, type: number ) : void {

        switch ( type ) {

            case 0:

                ( this.sprite.material as THREE.SpriteMaterial ).map = this.maps[0];
                break;

            case 1:

                ( this.sprite.material as THREE.SpriteMaterial ).map = this.maps[1];
                break;

        }

        //

        this.time = 0;
        this.object.position.set( position.x, position.y, position.z );
        this.object.visible = true;
        this.active = true;

    };

    public init () : void {

        const map1 = ResourceManager.getTexture( 'explosion2.png' )!.clone();
        map1.uuid = ResourceManager.getTexture( 'explosion2.png' )!.uuid;
        map1.wrapS = THREE.RepeatWrapping;
        map1.wrapT = THREE.RepeatWrapping;
        map1.repeat.set( 0.25, 0.25 );
        map1.offset.set( 0, 0.75 );
        map1.needsUpdate = true;
        this.maps.push( map1 );

        const map2 = ResourceManager.getTexture( 'explosion3.png' )!.clone();
        map2.uuid = ResourceManager.getTexture( 'explosion3.png' )!.uuid;
        map2.wrapS = THREE.RepeatWrapping;
        map2.wrapT = THREE.RepeatWrapping;
        map2.repeat.set( 0.25, 0.25 );
        map2.offset.set( 0, 0.75 );
        map2.needsUpdate = true;
        this.maps.push( map2 );

        //

        const material = new THREE.SpriteMaterial({ color: 0xffffff, opacity: 0.7, fog: true });
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
