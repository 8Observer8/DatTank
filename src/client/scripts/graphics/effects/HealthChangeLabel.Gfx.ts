/*
 * @author ohmed
 * DatTank HealthChange floating label graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";

//

class HealthChangeLabelGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private sprite: THREE.Sprite;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) {

        // todo

    };

    public dispose () {

        // todo

    };

    public setActive ( position: OMath.Vec3, healthChange: number ) {

        let canvas, ctx, sprite, material;
        let text = ( healthChange >= 0 ) ? '+' + Math.round( healthChange ) : Math.round( healthChange );
        let color = ( healthChange >= 0 ) ? '#00ff00' : '#ff0000';
    
        canvas = document.createElement( 'canvas' );
        canvas.width = 128;
        canvas.height = 64;
    
        ctx = canvas.getContext('2d');

        ctx.shadowColor = '#000';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;

        ctx.fillStyle = color;
        ctx.font = '35px Tahoma';
        ctx.textAlign = 'left';
        ctx.fillText( text, 30, 35 );

        this.sprite.material.map = canvas;
        this.sprite.material.map.needsUpdate = true;

    };

    public init () {

        let material = new THREE.SpriteMaterial({ color: 0xffffff, fog: true });
        this.sprite = new THREE.Sprite( material );
        this.sprite.position.set( 0, 35, 0 );
        this.sprite.scale.set( 24, 12, 1 );

        this.object.add( this.sprite );
        
        //

        if ( ! GfxCore.coreObjects['health-change-label'] ) {

            GfxCore.coreObjects['health-change-label'] = new THREE.Object3D();
            GfxCore.coreObjects['health-change-label'].name = 'HealthChangeLabels';
            GfxCore.scene.add( GfxCore.coreObjects['health-change-label'] );

        }

        GfxCore.coreObjects['health-change-label'].add( this.object );

    };

};

//

export { HealthChangeLabelGfx };
