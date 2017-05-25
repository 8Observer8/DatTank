Game.Skybox = function() {

    var material = new THREE.MeshBasicMaterial( {  map: THREE.ImageUtils.loadTexture('resources/img/sky2.jpg'), side: THREE.BackSide } );

    var skyboxMesh = new THREE.Mesh( new THREE.SphereGeometry( 4000, 60, 40 ), material );

    return skyboxMesh;

}