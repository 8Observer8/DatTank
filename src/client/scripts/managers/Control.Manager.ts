/*
 * @author ohmed
 * DatTank Controls core
*/

import * as THREE from 'three';

import { GfxCore } from '../graphics/Core.Gfx';
import * as OMath from '../OMath/Core.OMath';

import { Arena } from '../core/Arena.Core';

//

class ControlsManagerCore {

    private static instance: ControlsManagerCore;

    private pressedKey = {};
    private mousePos: OMath.Vec2 = new OMath.Vec2( 0.5, 0.5 );

    private moveX = 0;
    private moveZ = 0;

    private intersectPlane: THREE.Mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), new THREE.MeshBasicMaterial({ visible: false }) );

    //

    private startShooting () : void {

        if ( Arena.me.tank ) {

            Arena.me.tank.startShooting();

        }

    };

    private stopShooting () : void {

        if ( Arena.me.tank ) {

            Arena.me.tank.stopShooting();

        }

    };

    private startMoving () : void {

        if ( Arena.me.tank ) {

            Arena.me.tank.move( this.moveX, this.moveZ );

        }

    };

    //

    private oncontextmenu () : boolean {

        return false;

    };

    private mouseDown ( event: MouseEvent ) : void {

        this.mousePos.x = ( event.clientX / GfxCore.windowWidth ) * 2 - 1;
        this.mousePos.y = - ( event.clientY / GfxCore.windowHeight ) * 2 + 1;
        const mouseKeyPressed = event.which;

        switch ( mouseKeyPressed ) {

            case 1:
            case 2:
            case 3:

                this.startShooting();
                break;

        }

    };

    private mouseMove ( event: MouseEvent ) : void {

        this.mousePos.x = ( event.clientX / GfxCore.windowWidth ) * 2 - 1;
        this.mousePos.y = - ( event.clientY / GfxCore.windowHeight ) * 2 + 1;

    };

    private mouseUp ( event: MouseEvent ) : void {

        this.mousePos.x = ( event.clientX / GfxCore.windowWidth ) * 2 - 1;
        this.mousePos.y = - ( event.clientY / GfxCore.windowHeight ) * 2 + 1;
        const mouseKeyPressed = event.which;

        switch ( mouseKeyPressed ) {

            case 1:
            case 2:
            case 3:

                this.stopShooting();
                break;

        }

    };

    public mouseInit () : void {

        const viewport = $('#viewport #renderport, #kill-events');

        viewport.off('mousedown');
        viewport.off('mousemove');
        viewport.off('mouseup');
        viewport.off('contextmenu');

        viewport.bind( 'mousedown', this.mouseDown.bind( this ) );
        viewport.bind( 'mousemove', this.mouseMove.bind( this ) );
        viewport.bind( 'mouseup', this.mouseUp.bind( this ) );
        viewport.bind( 'contextmenu', this.oncontextmenu.bind( this ) );

    };

    //

    private keyDown ( event: KeyboardEvent ) : void {

        if ( this.pressedKey[ '' + event.keyCode ] === true ) return;
        this.pressedKey[ '' + event.keyCode ] = true;

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w

                if ( this.moveX === 1 ) return;
                this.moveX = 1;
                this.startMoving();

                break;

            case 37: // left
            case 65: // a

                if ( this.moveZ === 1 ) return;
                this.moveZ = 1;
                this.startMoving();

                break;

            case 40: // down
            case 83: // s

                if ( this.moveX === - 1 ) return;
                this.moveX = - 1;
                this.startMoving();

                break;

            case 39: // right
            case 68: // d

                if ( this.moveZ === - 1 ) return;
                this.moveZ = - 1;
                this.startMoving();

                break;

            case 32: // space

                this.startShooting();
                break;

        }

    };

    private keyUp ( event: KeyboardEvent ) : void {

        let newDirection;
        delete this.pressedKey[ '' + event.keyCode ];

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w

                newDirection = ( this.pressedKey[ 40 ] || this.pressedKey[ 83 ] ) ? -1 : 0;
                if ( this.moveX === newDirection ) break;
                this.moveX = newDirection;
                this.startMoving();
                break;

            case 37: // left
            case 65: // a

                newDirection = ( this.pressedKey[ 39 ] || this.pressedKey[ 68 ] ) ? -1 : 0;
                if ( this.moveZ === newDirection ) break;
                this.moveZ = newDirection;
                this.startMoving();
                break;

            case 40: // down
            case 83: // s

                newDirection = ( this.pressedKey[ 38 ] || this.pressedKey[ 87 ] ) ? 1 : 0;
                if ( this.moveX === newDirection ) break;
                this.moveX = newDirection;
                this.startMoving();
                break;

            case 39: // right
            case 68: // d

                newDirection = ( this.pressedKey[ 37 ] || this.pressedKey[ 65 ] ) ? 1 : 0;
                if ( this.moveZ === newDirection ) break;
                this.moveZ = newDirection;
                this.startMoving();
                break;

            case 32: // space

                this.stopShooting();
                break;

        }

    };

    private keyInit () : void {

        $( document ).bind( 'keydown', this.keyDown.bind( this ) );
        $( document ).bind( 'keyup', this.keyUp.bind( this ) );

    };

    //

    public update ( time: number, delta: number ) : void {

        // nothing here

    };

    public init () : void {

        this.intersectPlane.position.y = 20;
        this.intersectPlane.rotation.x = - Math.PI / 2;
        GfxCore.scene.add( this.intersectPlane );
        this.intersectPlane.updateMatrixWorld( true );

        this.keyInit();
        this.mouseInit();

    };

    //

    constructor () {

        if ( ControlsManagerCore.instance ) {

            return ControlsManagerCore.instance;

        }

        ControlsManagerCore.instance = this;

    };

};

//

export let ControlsManager = new ControlsManagerCore();
