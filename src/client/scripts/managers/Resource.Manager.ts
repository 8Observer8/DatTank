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
    public loadedPacks: Array<string> = [];

    private modelLoader: THREE.JSONLoader = new THREE.JSONLoader();
    private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    private audioLoader: THREE.AudioLoader = new THREE.AudioLoader();

    //

    private modelsList: string[] = [];

    private texturesList: string[] = [
        'smoke.png',
        'Grass.png',
        'brick.jpg',

        'shadows.png',

        'Tank-shadow.png',

        'explosion1.png',
        'explosion2.png',
        'explosion3.png',
        'tower-texture.png',
        'Decorations.jpg',
        'Boxes.jpg',

        'IS2.png'
    ];

    private soundsList: string[] = [
        'tank_shooting.wav',
        'tank_moving.wav',
        'tank_explosion.wav',
        'box_pick.wav'
    ];

    private packsList: string[] = [
        'ingame'
    ];

    private packs = {
        garage: {
            url: '/resources/garage.pack',
            models: [
                'Garage',
                'tanks/IS2'
            ]
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
                'towers/T1-bottom',
                'towers/T1-top'
            ]
        }
    };

    //

    public init () {

        console.log( 'ResourceManager inited.' );

        this.loadPack('garage', function () {

            // nothing here

        });

    };

    private loadPack ( packName: string, callback: () => void ) {

        let processedItems = 0;
        let request = new XMLHttpRequest();
        let pack = this.packs[ packName ];

        request.addEventListener( 'load', ( event ) => {

            if ( ! event.target ) return;
            let data = event.target['response'];
            let decoder = new JSZip();
            decoder.loadAsync( data ).then( ( zip ) => {

                for ( let i = 0, il = pack.models.length; i < il; i ++ ) {

                    let modelName = pack.models[ i ];

                    zip.file( modelName + '.conf' ).async('text').then( ( configData ) => {

                        let config = JSON.parse( configData );

                        zip.file( modelName + '.bin' ).async('arraybuffer').then( ( buffer ) => {

                            let model = {
                                name:       modelName + '.json',
                                geometry:   new THREE.BufferGeometry(),
                                material:   [] as any[]
                            };

                            for ( let i = 0, il = config['meta'].materials; i < il; i ++ ) {

                                model.material.push( new THREE.MeshLambertMaterial({ color: 0xaaaaaa }) );

                            }

                            //

                            let facesCount = config['meta']['faces'];
                            let verticesCount = facesCount * 3;

                            // set model attributes

                            let position = new Int16Array( buffer, 0, 3 * verticesCount );
                            let newPos = new Float32Array( position.length );
                            let positionAttr = new THREE.BufferAttribute( newPos, 3 );

                            for ( var j = 0, jl = position.length; j < jl; j ++ ) {

                                newPos[ j ] = position[ j ] / 1000;

                            }

                            model.geometry.addAttribute( 'position', positionAttr );
                            model.geometry.computeVertexNormals();

                            if ( config.meta.uvs !== false ) {

                                let uvs = new Int16Array( buffer, 2 * 3 * verticesCount, 2 * verticesCount );
                                let newUvs = new Float32Array( uvs.length );
                                let uvsAttr = new THREE.BufferAttribute( newUvs, 2 );

                                for ( var j = 0, jl = uvs.length; j < jl; j ++ ) {

                                    newUvs[ j ] = uvs[ j ] / 10000;

                                }

                                model.geometry.addAttribute( 'uv', uvsAttr );

                            }

                            // set model groups

                            for ( let i = 0, il = config.groups.length; i < il; i ++ ) {

                                model.geometry.groups.push({
                                    start:          config.groups[ i ][0],
                                    materialIndex:  config.groups[ i ][1],
                                    count:          config.groups[ i ][2]
                                });

                            }

                            // set model morph buffers if needed

                            var morphTargetsCount = config['meta']['morphTargets'];

                            if ( morphTargetsCount ) {

                                model.geometry.morphAttributes.position = [];
                                model.geometry['morphTargets'] = [];

                                for ( let i = 0, il = config.animations.length; i < il; i ++ ) {

                                    for ( let j = 0, jl = config.animations[ i ].end - config.animations[ i ].start; j < jl; j ++ ) {

                                        model.geometry['morphTargets'].push({ name: config.animations[ i ].name + j });

                                    }

                                }

                                for ( var j = 0; j < morphTargetsCount; j ++ ) {

                                    let morphInput = new Int16Array( buffer, 2 * ( 5 + 3 * j ) * verticesCount, 3 * verticesCount );
                                    let morph = new Float32Array( morphInput.length );

                                    for ( var k = 0, kl = morphInput.length; k < kl; k ++ ) {

                                        morph[ k ] = morphInput[ k ] / 1000;

                                    }

                                    let morphAttr = new THREE.Float32BufferAttribute( morph, 3 );
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

    private loadModel ( modelName: string, callback: () => void ) {

        this.modelLoader.load( 'resources/models/' + modelName, ( g, m ) => {

            let geometry: THREE.BufferGeometry | THREE.Geometry;

            g.computeFlatVertexNormals();

            if ( modelName.indexOf('Tree') !== -1 || modelName.indexOf('Rock') !== -1 ) {

                geometry = new THREE.BufferGeometry().fromGeometry( g );

            } else {

                geometry = g;

            }

            let data = {
                name:       modelName,
                geometry:   geometry,
                material:   m
            };

            this.models.push( data );
            this.loadedModels ++;

            callback();

        });

    };

    private loadTexture ( textureName: string, callback: () => void ) {

        this.textureLoader.load( 'resources/textures/' + textureName, ( texture ) => {

            texture.name = textureName;
            this.textures.push( texture );
            this.loadedTextures ++;

            callback();

        });

    };

    private loadSound ( soundName: string, callback: () => void ) {

        this.audioLoader.load( 'resources/sounds/' + soundName, ( buffer: THREE.AudioBuffer ) => {

            buffer['name'] = soundName;
            this.sounds.push( buffer );
            this.loadedSounds ++;

            callback();

        }, () => {}, () => {} );

    };

    public load ( onProgress: ( value: number ) => void, onFinish: () => void ) {

        let loadedItems = this.loadedModels + this.loadedTextures + this.loadedSounds;
        let progress = loadedItems / ( loadedItems + this.soundsList.length + this.modelsList.length + this.texturesList.length );

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

        for ( var i = 0, il = this.models.length; i < il; i ++ ) {

            if ( this.models[ i ].name === name + '.json' ) {

                return this.models[ i ];

            }

        }

        console.warn( 'Model "' + name + '" was not found in Game.ResourceManager.' );

        return undefined;

    };

    public getTexture ( name: string ) : THREE.Texture | undefined {

        for ( var i = 0, il = this.textures.length; i < il; i ++ ) {

            if ( this.textures[ i ].name === name ) {

                return this.textures[ i ];

            }

        }

        console.warn( 'Texture "' + name + '" was not found in Game.ResourceManager.' );

        return undefined;

    };

    public getSound ( name: string ) : THREE.AudioBuffer | undefined {

        for ( var i = 0, il = this.sounds.length; i < il; i ++ ) {

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
