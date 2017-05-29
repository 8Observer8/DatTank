Game.Skybox = function() {

    var material = new THREE.MeshBasicMaterial( {  map: THREE.ImageUtils.loadTexture('resources/img/sky_photo6.jpg'), side: THREE.BackSide, fog: true } );

    var geometry =  new THREE.SphereGeometry( 2500, 60, 40 );

    geometry.computeBoundingSphere();

    geometry.frustumCulled = false;

    var skyboxMesh = new THREE.Mesh( geometry, material );

    skyboxMesh.frustumCulled = false;

    return skyboxMesh;

}