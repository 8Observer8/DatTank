/*
 * @author ohmed
 * DatTank Resource manager
*/

class ResourceManager {

    private models;
    private textures;
    private sounds;

    private loadedModels: number = 0;
    private loadedTextures: number = 0;
    private loadedSounds: number = 0;

    private modelsList = [

    ];

    private texturesList = [

    ];

    private soundsList = [

    ];

    //

    public init () {

        console.log( 'ResourceManager inited.' );

    };

    private loadModel ( modelName: string, callback: void ) {

        // todo

    };

    private loadTexture ( textureName: string, callback: void ) {

        // todo

    };

    private loadSound ( soundName: string, callback: void ) {

        // todo

    };

    public load ( onProgress: void, onFinish: void ) {

        // todo

    };

    public getModel ( name: string ) {

        // todo

    };

    public getTexture ( name: string ) {

        // todo

    };

    public getSound ( name: string ) {

        // todo

    };

};

//

export { ResourceManager };
