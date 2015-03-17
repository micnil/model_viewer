"use strict";
/*global $THREE */

var VIEWER = VIEWER || {};

VIEWER.scene = new THREE.Scene();
VIEWER.renderer = new THREE.WebGLRenderer();
VIEWER.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 40000 );
VIEWER.cameraPivot = new THREE.Object3D();

VIEWER.objects = [];

VIEWER.main = function (){

    VIEWER.scene.add(VIEWER.cameraPivot);
    VIEWER.cameraPivot.add(VIEWER.camera);

    //initializing renderer
    VIEWER.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( VIEWER.renderer.domElement );
    VIEWER.renderer.shadowMapEnabled = true;
    
    //add listeners
    window.addEventListener('resize', VIEWER.event.onWindowResize, false );
    VIEWER.renderer.domElement.addEventListener("dragover", function(e){e.preventDefault();}, true);
    VIEWER.renderer.domElement.addEventListener("drop", function(e){
    e.preventDefault(); 
    VIEWER.event.loadObject(e.dataTransfer.files[0]);
    }, true);
    window.addEventListener('keydown', VIEWER.event.keyHandler, true );

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x222222);
    VIEWER.scene.add(ambientLight);

    // directional lighting
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 20000, 20000 );

    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 50;
    spotLight.shadowCameraFar = 30000;
    spotLight.shadowCameraFov = 30;
    VIEWER.scene.add(spotLight);


    //setup camera
    VIEWER.camera.position.z = 0.3;
    VIEWER.camera.position.y = 0.3;
    VIEWER.camera.position.x = 0.3;
    VIEWER.camera.lookAt(new THREE.Vector3(0,0,0));


    var render = function () {
        requestAnimationFrame( render );  
        
        VIEWER.renderer.render(VIEWER.scene, VIEWER.camera);
    };
    render();
};
