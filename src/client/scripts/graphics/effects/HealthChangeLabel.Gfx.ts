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
    private time: number;
    private visibleTime: number = 3000;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) {

        if ( ! this.active ) return;
        this.time += delta;

        this.object.position.y += this.time / this.visibleTime;

        if ( this.time > this.visibleTime / 4 ) {

            this.sprite.material.opacity = 0.5 - ( this.time - this.visibleTime / 4 ) / ( 3 * this.visibleTime / 4 );

        }

        if ( this.time > this.visibleTime ) {

            this.deactivate();

        }

    };

    public dispose () {

        // todo

    };

    public deactivate () {

        this.active = false;
        this.object.visible = false;

    };

    public setActive ( position: OMath.Vec3, healthChange: number ) {

        let canvas, ctx;
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

        this.sprite.material.map = new THREE.Texture( canvas );
        this.sprite.material.map.needsUpdate = true;
        this.sprite.material.opacity = 0.5;
        this.object.position.set( position.x, position.y, position.z );
        this.object.visible = true;
        this.active = true;
        this.time = 0;

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
