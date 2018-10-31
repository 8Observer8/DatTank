/*
 * @author ohmed
 * DatTank Box graphics class
*/

import * as THREE from 'three';

import { GfxCore } from '../Core.Gfx';
import { BoxObject } from '../../objects/core/Box.Object';
import { ResourceManager } from '../../managers/Resource.Manager';
import { BoxManager } from '../../managers/Box.Manager';

//

export class BoxGfx {

    private animTime: number = 600 * Math.random() * Math.PI * 2;
    private mesh: THREE.Mesh;
    private box: BoxObject;

    private pickedAnimation = {
        enabled:    false,
        progress:   0,
        duration:   600,
    };

    //

    public dispose () : void {

        GfxCore.coreObjects['boxes'].remove( this.mesh );

    };

    public pick () : void {

        const sound = new THREE.PositionalAudio( GfxCore.audioListener );
        sound.position.copy( this.mesh.position );
        sound.setBuffer( ResourceManager.getSound( this.box.pickSound ) as THREE.AudioBuffer );

        sound.setRefDistance( 200 );
        sound.play();
        this.pickedAnimation.enabled = true;

    };

    public update ( time: number, delta: number ) : void {

        if ( ! this.pickedAnimation.enabled ) {

            this.animTime += delta;
            this.mesh.rotation.y = Math.sin( this.animTime / 600 );
            this.mesh.position.y = Math.sin( this.animTime / 300 ) + 20;
            this.mesh.updateMatrixWorld( true );

        } else {

            this.mesh.scale.multiplyScalar( 0.93 );
            this.mesh.position.y += 1;
            this.mesh.updateMatrixWorld( true );
            this.pickedAnimation.progress += delta / this.pickedAnimation.duration;

        }

        if ( this.pickedAnimation.progress >= 1 ) {

            BoxManager.remove( [ this.box.id ] );
            this.pickedAnimation.enabled = false;

        }

    };

    public init ( box: BoxObject ) : void {

        const boxModel = ResourceManager.getModel( 'boxes/' + box.type )!;

        this.box = box;
        this.mesh = new THREE.Mesh( boxModel.geometry, boxModel.material );
        this.mesh.material[0].map = ResourceManager.getTexture('Boxes.jpg');
        this.mesh.name = box.type;
        this.mesh.scale.set( 20, 20, 20 );

        this.mesh.position.x = box.position.x;
        this.mesh.position.y = box.position.y;
        this.mesh.position.z = box.position.z;
        this.mesh.updateMatrixWorld( true );

        //

        if ( ! GfxCore.coreObjects['boxes'] ) {

            GfxCore.coreObjects['boxes'] = new THREE.Object3D();
            GfxCore.coreObjects['boxes'].name = 'Boxes';
            GfxCore.scene.add( GfxCore.coreObjects['boxes'] );

        }

        GfxCore.coreObjects['boxes'].add( this.mesh );

    };

};
