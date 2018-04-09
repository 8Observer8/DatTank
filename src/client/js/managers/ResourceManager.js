/*
 * @author ohmed
 * DatTank resource manager object
*/

Game.ResourceManager = function () {

    this.modelList = [
        'IS2-bottom.json',
        'IS2-top.json',

        'T29-bottom.json',
        'T29-top.json',

        'T44-bottom.json',
        'T44-top.json',

        'T54-bottom.json',
        'T54-top.json',

        'Tower_base.json',
        'Tower_top.json',

        'health_box.json',
        'ammo_box.json',

        'tree1.json',
        'tree2.json',
        'tree3.json',
        'tree4.json',
        'tree5.json',
        'tree6.json',
        'tree7.json',
        'tree8.json',

        'stone1.json',
        'stone2.json',
        'stone3.json',
        'stone4.json',

        'oldCastle.json'
    ];

    this.texturesList = [
        'smoke.png',
        'Ground.jpg',
        'Grass.png',
        'Base-ground.png',
        'brick.jpg',

        'tree1-shadow.png',
        'tree2-shadow.png',
        'tree3-shadow.png',
        'tree4-shadow.png',
        'tree5-shadow.png',
        'tree6-shadow.png',
        'tree7-shadow.png',
        'tree8-shadow.png',

        'stone1-shadow.png',
        'stone2-shadow.png',
        'stone3-shadow.png',
        'stone4-shadow.png',

        'shadowHouse.png',

        'shadowTank.png',

        'explosion1.png',
        'explosion2.png'
    ];

    this.soundsList = [
        'tank_shooting.wav',
        'tank_moving.wav',
        'tank_explosion.wav',
        'box_pick.wav'
    ];

};

Game.ResourceManager.prototype = {};

//

Game.ResourceManager.prototype.loadModel = function ( modelName, callback ) {

    var scope = this;
    var loader = new THREE.JSONLoader();

    //

    loader.load( 'resources/models/' + modelName, function ( g, m ) {

        var data = {
            name:       modelName,
            geometry:   false,
            material:   m
        };

        g.computeFlatVertexNormals();

        if ( modelName.indexOf('tree') !== -1 || modelName.indexOf('stone') !== -1 ) {

            data.geometry = new THREE.BufferGeometry().fromGeometry( g );

        } else {

            data.geometry = g;

        }

        scope.models.push( data );

        scope.modelsLoaded ++;

        callback();

    });

};

Game.ResourceManager.prototype.loadTexture = function ( textureName, callback ) {

    var scope = this;

    var textureLoader = new THREE.TextureLoader();

    textureLoader.load( 'resources/textures/' + textureName, function ( texture ) {

        texture.name = textureName;
        scope.textures.push( texture );

        scope.texturesLoaded ++;

        callback();

    });

};

Game.ResourceManager.prototype.loadSound = function ( soundName, callback ) {

    var scope = this;

    var soundLoader = new THREE.AudioLoader();

    soundLoader.load( 'resources/sounds/' + soundName, function ( buffer ) {

        buffer.name = soundName;
        scope.sounds.push( buffer );
        scope.soundsLoaded ++;

        callback();

    });

};

Game.ResourceManager.prototype.load = function ( onProgress, onEnd ) {

    var progress = ( this.modelsLoaded + this.texturesLoaded + this.soundsLoaded ) / ( this.soundsLoaded + this.soundsList.length + this.modelsLoaded + this.modelList.length + this.texturesLoaded + this.texturesList.length )

    if ( this.modelList.length ) {

        this.loadModel( this.modelList.pop(), this.load.bind( this, onProgress, onEnd ) );

        if ( onProgress ) {

            onProgress( progress );

        }

        return;

    }

    if ( this.texturesList.length ) {

        this.loadTexture( this.texturesList.pop(), this.load.bind( this, onProgress, onEnd ) );

        if ( onProgress ) {

            onProgress( progress );

        }

        return;

    }

    if ( this.soundsList.length ) {

        this.loadSound( this.soundsList.pop(), this.load.bind( this, onProgress, onEnd ) );

        if ( onProgress ) {

            onProgress( progress );

        }

        return;

    }

    if ( onEnd ) {

        onProgress( progress );
        onEnd();

    }

};

Game.ResourceManager.prototype.getModel = function ( modelName ) {

    for ( var i = 0, il = this.models.length; i < il; i ++ ) {

        if ( this.models[ i ].name === modelName ) {

            return this.models[ i ];

        }

    }

    console.warn( 'Model "' + modelName + '" was not found in Game.ResourceManager.' );

    return false;

};

Game.ResourceManager.prototype.getTexture = function ( textureName ) {

    for ( var i = 0, il = this.textures.length; i < il; i ++ ) {

        if ( this.textures[ i ].name === textureName ) {

            return this.textures[ i ];

        }

    }

    console.warn( 'Texture "' + textureName + '" was not found in Game.ResourceManager.' );

    return false;

};

Game.ResourceManager.prototype.getSound = function ( soundName ) {

    for ( var i = 0, il = this.sounds.length; i < il; i ++ ) {

        if ( this.sounds[ i ].name === soundName ) {

            return this.sounds[ i ];

        }

    }

    console.warn( 'Sound "' + soundName + '" was not found in Game.ResourceManager.' );

    return false;

};
