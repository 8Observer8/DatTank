/*
 * @author ohmed
 * DatTank Tank ground traces graphics class
*/

import * as THREE from 'three';
import * as OMath from '../../../OMath/Core.OMath';

import { GfxCore } from '../../Core.Gfx';
import { ResourceManager } from '../../../managers/other/Resource.Manager';
//

export class TankTracesGfx {

    private material = {
        uniforms: {
            map: { value: new THREE.Texture() },
            fogColor: { value: new THREE.Vector3() },
            fogDensity: { value: 0 },
        },
        vertexShader: `
            varying float vAlpha;
            varying vec2 vUv;
            varying float fogDepth;
            attribute float alpha;
            void main( void ) {
                vAlpha = alpha;
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                fogDepth = -mvPosition.z;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            #define whiteCompliment(a) ( 1.0 - saturate( a ) )
            const float LOG2 = 1.442695;
            uniform sampler2D map;
            varying float vAlpha;
            varying vec2 vUv;
            uniform vec3 fogColor;
            varying float fogDepth;
            uniform float fogDensity;
            void main( void ) {
                vec4 m = texture2D( map, vUv );
                gl_FragColor = vec4( m.rgb, vAlpha * m.a );
                float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );
                gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
            }
        `,
    };

    private target: THREE.Object3D;
    private prevPosition: OMath.Vec3 = new OMath.Vec3();
    private traceLength: number = 15;
    private trackWidth: number = 3;
    private tankWidth: number = 13.5;
    private object: THREE.Object3D = new THREE.Object3D();

    private leftTrace: THREE.Mesh;
    private rightTrace: THREE.Mesh;

    private route: number[][] = [];
    private offset: number = 0;

    //

    public dispose () : void {

        if ( ! GfxCore.coreObjects['tank-traces'] || ! this.object ) return;
        GfxCore.coreObjects['tank-traces'].remove( this.object );

    };

    public hide () : void {

        this.object.visible = false;

    };

    public update ( time: number, delta: number ) : void {

        const pos = this.target.position.clone();
        const rot = this.target.rotation.y;
        this.object.position.set( pos.x, pos.y, pos.z );
        this.object.updateMatrixWorld( true );

        //

        const lTraceGeo = this.leftTrace.geometry as THREE.BufferGeometry;
        const ltPositions = lTraceGeo.attributes['position'] as THREE.BufferAttribute;
        const ltAlpha = lTraceGeo.attributes['alpha'] as THREE.BufferAttribute;
        const ltUVs = lTraceGeo.attributes['uv'] as THREE.BufferAttribute;

        const rTraceGeo = this.rightTrace.geometry as THREE.BufferGeometry;
        const rtPositions = rTraceGeo.attributes['position'] as THREE.BufferAttribute;
        const rtAlpha = rTraceGeo.attributes['alpha'] as THREE.BufferAttribute;
        const rtUVs = rTraceGeo.attributes['uv'] as THREE.BufferAttribute;
        const width = this.trackWidth;

        const a: number[][] = [];
        let textureDir = 1;

        for ( let i = 0, il = this.traceLength * 2; i < il; i += 2 ) {

            const segmentId = i / 2;
            const routPoint = this.route[ segmentId ] || [ pos.x, pos.y, pos.z, 0 ];
            const angle = routPoint[3];
            const wx = width * Math.sin( Math.PI / 2 - angle );
            const wz = - width * Math.cos( Math.PI / 2 - angle );

            a[0] = [ routPoint[0] - pos.x - wx, routPoint[1] - 10, routPoint[2] - pos.z - wz ];
            a[1] = [ routPoint[0] - pos.x + wx, routPoint[1] - 10, routPoint[2] - pos.z + wz ];

            //

            const xOffset = this.tankWidth * Math.sin( Math.PI / 2 - angle );
            const zOffset = - this.tankWidth * Math.cos( Math.PI / 2 - angle );
            const alpha = 0.5 * segmentId / this.traceLength / 2;

            ltPositions.setXYZ( i + 0, a[0][0] + xOffset, a[0][1], a[0][2] + zOffset );
            ltPositions.setXYZ( i + 1, a[1][0] + xOffset, a[1][1], a[1][2] + zOffset );

            rtPositions.setXYZ( i + 0, a[0][0] - xOffset, a[0][1], a[0][2] - zOffset );
            rtPositions.setXYZ( i + 1, a[1][0] - xOffset, a[1][1], a[1][2] - zOffset );

            ltAlpha.setX( i + 0, alpha );
            ltAlpha.setX( i + 1, alpha );

            rtAlpha.setX( i + 0, alpha );
            rtAlpha.setX( i + 1, alpha );

            const v = 5 * ( textureDir === 1 ? routPoint[4] / this.traceLength : 1 - routPoint[4] / this.traceLength );

            ltUVs.setXY( i + 0, 0, v );
            ltUVs.setXY( i + 1, 1, v );

            rtUVs.setXY( i + 0, 0, v );
            rtUVs.setXY( i + 1, 1, v );

            if ( routPoint[4] === this.traceLength - 1 ) textureDir = -1;

        }

        ltPositions.needsUpdate = true;
        rtPositions.needsUpdate = true;

        ltAlpha.needsUpdate = true;
        rtAlpha.needsUpdate = true;

        ltUVs.needsUpdate = true;
        rtUVs.needsUpdate = true;

        //

        if ( this.prevPosition.distanceTo( pos ) < 7 ) return;

        if ( this.route.length >= this.traceLength ) this.route.shift();
        this.offset = ( this.offset + 1 ) % this.traceLength;
        this.route.push( [ pos.x, GfxCore.landscape.getPointHeight( pos.x, pos.z ) + 1, pos.z, rot, this.offset ] );

        this.prevPosition.copy( pos );

    };

    public init ( target: THREE.Object3D ) : void {

        this.target = target;
        this.prevPosition.set( this.target.position.x, this.target.position.y, this.target.position.z );

        const vertices = new Float32Array( this.traceLength * 2 * 3 );
        const alphas = new Float32Array( this.traceLength * 2 * 1 );
        const uvs = new Float32Array( this.traceLength * 2 * 2 );
        const geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
        geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
        geometry.boundingSphere = new THREE.Sphere( new THREE.Vector3(), 400 );

        const material = new THREE.ShaderMaterial( {
            uniforms:       this.material.uniforms,
            vertexShader:   this.material.vertexShader,
            fragmentShader: this.material.fragmentShader,
            transparent:    true,
            side:           THREE.DoubleSide,
            depthWrite:     false,
            fog:            true,
        });

        this.leftTrace = new THREE.Mesh( geometry, material );
        this.rightTrace = new THREE.Mesh( geometry.clone(), material.clone() );

        this.leftTrace.drawMode = THREE.TriangleStripDrawMode;
        this.rightTrace.drawMode = THREE.TriangleStripDrawMode;

        ( this.leftTrace.material as THREE.ShaderMaterial ).uniforms.map.value = ResourceManager.getTexture('traces.png')!;
        ( this.leftTrace.material as THREE.ShaderMaterial ).uniforms.map.value.wrapS = ( this.leftTrace.material as THREE.ShaderMaterial ).uniforms.map.value.wrapT = THREE.RepeatWrapping;
        ( this.leftTrace.material as THREE.ShaderMaterial ).uniforms.map.value.needsUpdate = true;

        ( this.rightTrace.material as THREE.ShaderMaterial ).uniforms.map.value = ResourceManager.getTexture('traces.png')!;
        ( this.rightTrace.material as THREE.ShaderMaterial ).uniforms.map.value.wrapS = ( this.rightTrace.material as THREE.ShaderMaterial ).uniforms.map.value.wrapT = THREE.RepeatWrapping;
        ( this.rightTrace.material as THREE.ShaderMaterial ).uniforms.map.value.needsUpdate = true;

        this.object.add( this.leftTrace );
        this.object.add( this.rightTrace );

        //

        if ( ! GfxCore.coreObjects['tank-traces'] ) {

            GfxCore.coreObjects['tank-traces'] = new THREE.Object3D();
            GfxCore.coreObjects['tank-traces'].name = 'TankTraces';
            GfxCore.scene.add( GfxCore.coreObjects['tank-traces'] );

        }

        GfxCore.coreObjects['tank-traces'].add( this.object );

    };

};
