/*
 * @author ohmed
 * DatTank Tank label graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../../OMath/Core.OMath';

//

export class TankLabelGfx {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private sprite: THREE.Sprite;

    //

    public update ( health: number, armor: number, teamColor: number, overheating: number, login: string, isMe: boolean ) : void {

        if ( ! this.ctx ) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect( 0, 0, width, height );

        // overheating label

        let offset = 20;

        this.ctx.shadowColor = 'rgba( 0, 0, 0, 1 )';
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowBlur = 1;

        if ( overheating !== - 1 && isMe ) {

            let overheatColor = '#44ce00';
            if ( overheating > 40 ) overheatColor = '#e5c510';
            if ( overheating > 80 ) {

                overheatColor = '#ff0000';

            }

            this.ctx.fillStyle = 'rgba( 255, 255, 255, ' + overheating / 100 + ')';
            this.ctx.font = 'normal 12px Roboto';
            this.ctx.textAlign = 'left';
            this.ctx.fillText( 'gun overheated!', 164, 15 );

            this.ctx.fillStyle = overheatColor;
            this.ctx.fillRect( 0, 20, width * overheating / 100, 2 );
            offset = 23;

        }

        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowColor = 'rgba( 0, 0, 0, 0.3 )';
        this.ctx.shadowBlur = 2;

        // draw health red bg

        this.ctx.fillStyle = OMath.intToHex( OMath.darkerColor( teamColor, 0.3 ) );
        this.ctx.fillRect( 0, offset, 300, 10 );

        // draw health green indicator

        this.ctx.fillStyle = OMath.intToHex( teamColor );
        this.ctx.fillRect( 0, offset, width * ( health / 100 ), 10 );

        // draw health 'amount' lines based on armor

        this.ctx.strokeStyle = 'rgba( 0, 0, 0, 0.3 )';

        for ( let i = 0, il = 3 * armor / 50; i < il; i ++ ) {

            this.ctx.beginPath();
            this.ctx.moveTo( i * width / il, offset );
            this.ctx.lineTo( i * width / il, 10 + offset );
            this.ctx.stroke();

        }

        //

        if ( isMe ) {

            this.sprite.scale.set( 0.7 * 47, 0.7 * 12, 1 );
            this.sprite.position.y = 30;

        } else {

            this.ctx.shadowColor = 'rgba( 0, 0, 0, 1 )';
            this.ctx.shadowBlur = 4;

            // draw player login

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '26px Tahoma';
            this.ctx.textAlign = 'left';
            this.ctx.fillText( login, 30, 35 + offset );

            // draw team color rect

            this.ctx.fillStyle = OMath.intToHex( teamColor );
            this.ctx.fillRect( 0, 12 + offset, 25, 25 );

        }

        ( this.sprite.material as THREE.SpriteMaterial ).map!.needsUpdate = true;

    };

    public dispose () : void {

        const material = this.sprite.material as THREE.SpriteMaterial;
        material.map!.dispose();

    };

    public init ( target: THREE.Object3D ) : void {

        target.add( this.sprite );

    };

    //

    constructor () {

        this.canvas = document.createElement( 'canvas' );
        this.canvas.width = 256;
        this.canvas.height = 64;

        this.ctx = this.canvas.getContext('2d');
        if ( ! this.ctx ) {

            console.error('Context undefined.');
            return;

        }

        const material = new THREE.SpriteMaterial({ alphaTest: 0.1, map: new THREE.Texture( this.canvas ), color: 0xffffff, fog: true });
        this.sprite = new THREE.Sprite( material );

        this.sprite.position.set( 0, 40, 0 );
        this.sprite.scale.set( 47, 12, 1 );

    };

};