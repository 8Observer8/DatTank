/*
 * @author ohmed
 * DatTank Resource manager
*/

import * as THREE from 'three';
import * as JSZip from 'JSZip';

//

class ResourceManagerCore {

    public static instance: ResourceManagerCore;

    private models: any[] = [];
    private textures: THREE.Texture[] = [];
    private sounds: THREE.AudioBuffer[] = [];

    private loadedModels: number = 0;
    private loadedTextures: number = 0;
    private loadedSounds: number = 0;
    public loadedPacks: string[] = [];

    private modelLoader: THREE.JSONLoader = new THREE.JSONLoader();
    private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    private audioLoader: THREE.AudioLoader = new THREE.AudioLoader();

    //

    private modelsList: string[] = [];

    private texturesList: string[] = [
        'smoke.png',
        'brick.jpg',

        'shadows.png',

        'Tank-shadow.png',

        'explosion1.png',
        'tower-texture.png',
        'Decorations.jpg',
        'Boxes.jpg',
        'traces.png',

        'garage-ceiling.jpeg',
        'garage-ground1.jpg',
        'garage-ground2.jpg',
        'garage-wall1.jpg',
        'garage-wall2.jpg',

        'tanks/hulls/IS2001.jpg',
        'tanks/hulls/TigerS8.jpg',
        'tanks/hulls/OrbitT32s.jpg',
        'tanks/hulls/MG813.jpg',
        'tanks/hulls/DTEK72.jpg',

        'tanks/cannons/Plasma-g1.jpg',
        'tanks/cannons/Plasma-g2.jpg',
        'tanks/cannons/Plasma-double.jpg',
        'tanks/cannons/Plasma-triple.jpg',
        'tanks/cannons/Razer-v1.jpg',
        'tanks/cannons/Razer-v2.jpg',
        'tanks/cannons/Razer-double.jpg',
    ];

    private soundsList: string[] = [
        'tank_shooting.wav',
        'tank_moving.wav',
        'tank_explosion.wav',
        'box_pick.wav',
        'coin_pick.wav',
    ];

    private packsList: string[] = [
        'ingame',
    ];

    private packs = {
        garage: {
            url: '/resources/garage.pack',
            models: [
                'Garage',
                'hulls/IS2001',
                'hulls/OrbitT32s',
                'hulls/TigerS8',
                'hulls/MG813',
                'hulls/DTEK72',
                'cannons/Plasma-g1',
                'cannons/Plasma-g2',
                'cannons/Plasma-double',
                'cannons/Plasma-triple',
                'cannons/Plasma-zero',
                'cannons/Razer-v1',
                'cannons/Razer-v2',
                'cannons/Razer-double',
            ],
        },
        ingame: {
            url: '/resources/ingame.pack',
            models: [
                'decorations/Rock1',
                'decorations/Rock2',
                'decorations/Rock3',
                'decorations/Rock4',
                'decorations/Tree1',
                'decorations/Tree2',
                'decorations/Tree3',
                'decorations/Tree4',
                'decorations/Tree5',
                'decorations/Tree6',
                'decorations/Tree7',
                'decorations/Tree8',
                // 'decorations/Ruin1',
                'boxes/AmmoBox',
                'boxes/HealthBox',
                'boxes/CoinBox',
                'towers/T1-bottom',
                'towers/T1-top',
            ],
        },
    };

    //

    public init () : void {

        console.log( 'ResourceManager inited.' );

        this.loadPack('garage', () => {

            // nothing here

        });

    };

    private loadPack ( packName: string, callback: () => void ) : void {

        let processedItems = 0;
        const request = new XMLHttpRequest();
        const pack = this.packs[ packName ];

        request.addEventListener( 'load', ( event ) => {

            if ( ! event.target ) return;
            const data = event.target['response'];
            const decoder = new JSZip();

            decoder.loadAsync( data ).then( ( zip ) => {

                for ( let i = 0, il = pack.models.length; i < il; i ++ ) {

                    const modelName = pack.models[ i ];

                    zip.file( modelName + '.conf' ).async('text').then( ( configData ) => {

                        const config = JSON.parse( configData );

                        zip.file( modelName + '.bin' ).async('arraybuffer').then( ( buffer ) => {

                            const model = {
                                name:       modelName + '.json',
                                geometry:   new THREE.BufferGeometry(),
                                material:   [] as any[],
                            };

                            for ( let j = 0, jl = config['meta'].materials; j < jl; j ++ ) {

                                model.material.push( new THREE.MeshLambertMaterial({ color: 0xaaaaaa }) );

                            }

                            //

                            const facesCount = config['meta']['faces'];
                            const verticesCount = facesCount * 3;

                            // set model attributes

                            const position = new Int16Array( buffer, 0, 3 * verticesCount );
                            const newPos = new Float32Array( position.length );
                            const positionAttr = new THREE.BufferAttribute( newPos, 3 );

                            for ( let j = 0, jl = position.length; j < jl; j ++ ) {

                                newPos[ j ] = position[ j ] / 1000;

                            }

                            model.geometry.addAttribute( 'position', positionAttr );
                            model.geometry.computeVertexNormals();

                            if ( config.meta.uvs !== false ) {

                                const uvs = new Int16Array( buffer, 2 * 3 * verticesCount, 2 * verticesCount );
                                const newUvs = new Float32Array( uvs.length );
                                const uvsAttr = new THREE.BufferAttribute( newUvs, 2 );

                                for ( let j = 0, jl = uvs.length; j < jl; j ++ ) {

                                    newUvs[ j ] = uvs[ j ] / 10000;

                                }

                                model.geometry.addAttribute( 'uv', uvsAttr );

                            }

                            // set model groups

                            for ( let j = 0, jl = config.groups.length; j < jl; j ++ ) {

                                model.geometry.groups.push({
                                    start:          config.groups[ j ][0],
                                    materialIndex:  config.groups[ j ][1],
                                    count:          config.groups[ j ][2],
                                });

                            }

                            // set model morph buffers if needed

                            const morphTargetsCount = config['meta']['morphTargets'];

                            if ( morphTargetsCount ) {

                                model.geometry.morphAttributes.position = [];
                                model.geometry['morphTargets'] = [];

                                for ( let j = 0, jl = config.animations.length; j < jl; j ++ ) {

                                    for ( let k = 0, kl = config.animations[ j ].end - config.animations[ j ].start; k < kl; k ++ ) {

                                        model.geometry['morphTargets'].push({ name: config.animations[ j ].name + k });

                                    }

                                }

                                for ( let j = 0; j < morphTargetsCount; j ++ ) {

                                    const morphInput = new Int16Array( buffer, 2 * ( 5 + 3 * j ) * verticesCount, 3 * verticesCount );
                                    const morph = new Float32Array( morphInput.length );

                                    for ( let k = 0, kl = morphInput.length; k < kl; k ++ ) {

                                        morph[ k ] = morphInput[ k ] / 1000;

                                    }

                                    const morphAttr = new THREE.Float32BufferAttribute( morph, 3 );
                                    model.geometry.morphAttributes.position.push( morphAttr );

                                }

                            }

                            //

                            this.models.push( model );
                            processedItems ++;

                            if ( processedItems === pack.models.length ) {

                                callback();
                                this.loadedPacks.push( packName );

                            }

                        });

                    });

                }

            });

        });

        request.open( 'GET', pack.url, true );
        request.responseType = 'arraybuffer';
        request.send( null );

    };

    private loadModel ( modelName: string, callback: () => void ) : void {

        this.modelLoader.load( 'resources/models/' + modelName, ( g, m ) => {

            let geometry: THREE.BufferGeometry | THREE.Geometry;

            g.computeFlatVertexNormals();

            if ( modelName.indexOf('Tree') !== -1 || modelName.indexOf('Rock') !== -1 ) {

                geometry = new THREE.BufferGeometry().fromGeometry( g );

            } else {

                geometry = g;

            }

            const data = {
                name:       modelName,
                geometry,
                material:   m,
            };

            this.models.push( data );
            this.loadedModels ++;

            callback();

        });

    };

    private loadTexture ( textureName: string, callback: () => void ) : void {

        this.textureLoader.load( 'resources/textures/' + textureName, ( texture ) => {

            texture.name = textureName;
            this.textures.push( texture );
            this.loadedTextures ++;

            callback();

        });

    };

    private loadSound ( soundName: string, callback: () => void ) : void {

        this.audioLoader.load( 'resources/sounds/' + soundName, ( buffer: THREE.AudioBuffer ) => {

            buffer['name'] = soundName;
            this.sounds.push( buffer );
            this.loadedSounds ++;

            callback();

        }, () => {
            // nothing here
        }, () => {
            // nothing here
        } );

    };

    public load ( onProgress: ( value: number ) => void, onFinish: () => void ) : void {

        const loadedItems = this.loadedModels + this.loadedTextures + this.loadedSounds;
        const progress = loadedItems / ( loadedItems + this.soundsList.length + this.modelsList.length + this.texturesList.length );

        if ( this.packsList.length ) {

            this.loadPack( this.packsList.pop() as string, this.load.bind( this, onProgress, onFinish ) );

            if ( onProgress ) {

                onProgress( progress );

            }

            return;

        }

        if ( this.modelsList.length ) {

            this.loadModel( this.modelsList.pop() as string, this.load.bind( this, onProgress, onFinish ) );

            if ( onProgress ) {

                onProgress( progress );

            }

            return;

        }

        if ( this.texturesList.length ) {

            this.loadTexture( this.texturesList.pop() as string, this.load.bind( this, onProgress, onFinish ) );

            if ( onProgress ) {

                onProgress( progress );

            }

            return;

        }

        if ( this.soundsList.length ) {

            this.loadSound( this.soundsList.pop() as string, this.load.bind( this, onProgress, onFinish ) );

            if ( onProgress ) {

                onProgress( progress );

            }

            return;

        }

        if ( onFinish ) {

            onProgress( progress );
            onFinish();

        }

    };

    public getModel ( name: string ) : THREE.Mesh | undefined {

        for ( let i = 0, il = this.models.length; i < il; i ++ ) {

            if ( this.models[ i ].name === name + '.json' ) {

                return this.models[ i ];

            }

        }

        console.warn( 'Model "' + name + '" was not found in Game.ResourceManager.' );

        return undefined;

    };

    public getTexture ( name: string ) : THREE.Texture | undefined {

        for ( let i = 0, il = this.textures.length; i < il; i ++ ) {

            if ( this.textures[ i ].name === name ) {

                return this.textures[ i ];

            }

        }

        console.warn( 'Texture "' + name + '" was not found in Game.ResourceManager.' );

        return undefined;

    };

    public getSound ( name: string ) : THREE.AudioBuffer | undefined {

        for ( let i = 0, il = this.sounds.length; i < il; i ++ ) {

            if ( this.sounds[ i ]['name'] === name ) {

                return this.sounds[ i ];

            }

        }

        console.warn( 'Sound "' + name + '" was not found in Game.ResourceManager.' );

        return undefined;

    };

    //

    constructor () {

        if ( ResourceManagerCore.instance ) {

            return ResourceManagerCore.instance;

        }

        ResourceManagerCore.instance = this;

    };

};

//

export let ResourceManager = new ResourceManagerCore();
