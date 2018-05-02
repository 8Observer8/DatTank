/*
 * @author ohmed
 * JSON -> bin pack convertor
*/

function convert () {

    var input = document.querySelector('#input').value;

    try {

        input = JSON.parse( input );

    } catch ( err ) {

        alert('Not valid input JSON.');
        return;

    }

    //

    var loader = new THREE.JSONLoader();
    var object = loader.parse( input );
    var geometry = object.geometry;
    var buffGeometry = new THREE.BufferGeometry().fromGeometry( object.geometry );

    //

    var packBinObject = {
        bin:        false,
        metadata:   {
            metadata:   input.metadata,
            materials:  input.materials
        },
        materials:  input.materials
    };

    //

    var binObjLength = 0;
    var byteOffset = 0;

    for ( var attrName in buffGeometry.attributes ) {

        if ( attrName === 'color' || attrName === 'normal' ) continue;
        binObjLength += buffGeometry.attributes[ attrName ].array.length * Int16Array.BYTES_PER_ELEMENT;

    }

    packBinObject.bin = new ArrayBuffer( binObjLength );

    for ( var attrName in buffGeometry.attributes ) {

        if ( attrName === 'color' || attrName === 'normal' ) continue;

        if ( buffGeometry.attributes[ attrName ].array instanceof Float32Array ) {

            var array = new Int16Array( packBinObject.bin, byteOffset, buffGeometry.attributes[ attrName ].array.length );
            for ( var i = 0, il = buffGeometry.attributes[ attrName ].array.length; i < il; i ++ ) {

                if ( attrName === 'uv' ) {
                
                    array[ i ] = Math.round( 10000 * buffGeometry.attributes[ attrName ].array[ i ] );

                } else {

                    array[ i ] = Math.round( 1000 * buffGeometry.attributes[ attrName ].array[ i ] );

                }

            }

        }

        byteOffset += buffGeometry.attributes[ attrName ].array.length * Int16Array.BYTES_PER_ELEMENT;

    }

    //

    var a = document.createElement("a");
    document.body.appendChild( a );
    a.style = "display: none";
    var blob = new Blob( [ packBinObject.bin ], { type: "application/octet-stream" } );
    var url = window.URL.createObjectURL( blob );
    a.href = url;
    a.download = 'model.bin';
    a.click();
    window.URL.revokeObjectURL( url );

    setTimeout( function () {
    
        var a = document.createElement("a");
        document.body.appendChild( a );
        a.style = "display: none";
        var blob = new Blob( [ JSON.stringify( packBinObject.metadata ) ], { type: "text/plain" } );
        var url = window.URL.createObjectURL( blob );
        a.href = url;
        a.download = 'model.conf';
        a.click();
        window.URL.revokeObjectURL( url );

    }, 500 );

};
