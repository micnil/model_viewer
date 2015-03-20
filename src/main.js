var VIEWER = VIEWER || {};

VIEWER.scene = new THREE.Scene();
VIEWER.renderer = new THREE.WebGLRenderer();
VIEWER.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 40000);
VIEWER.cameraPivot = new THREE.Object3D();
VIEWER.leapActive = false;

VIEWER.objects = []; //for all THREE.mesh

VIEWER.main = function () {
    "use strict";

    var axisHelper = new THREE.AxisHelper(0.02),
        axisPosition = new THREE.Object3D();

    // Adding a camera pivot in origin for keyboard rotation
    VIEWER.scene.add(VIEWER.cameraPivot);
    VIEWER.cameraPivot.add(VIEWER.camera);

    //initializing renderer
    VIEWER.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(VIEWER.renderer.domElement);
    VIEWER.renderer.shadowMapEnabled = true;

    //add listeners
    window.addEventListener('resize', function (){
        VIEWER.event.onWindowResize(axisPosition);}, false);
    //Drag and drop object file on canvas
    VIEWER.renderer.domElement.addEventListener("dragover", function (e) {
        e.preventDefault(); }, true);
    VIEWER.renderer.domElement.addEventListener("drop", function (e) {
        e.preventDefault();
        VIEWER.event.loadObject(e.dataTransfer.files[0]);
    }, true);
    window.addEventListener('keydown', VIEWER.event.keyHandler, true);

    //add reference grid
    var gridHelper = new THREE.GridHelper(50, 2);
    VIEWER.scene.add( gridHelper );

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x222222);
    VIEWER.scene.add(ambientLight);

    // directional lighting
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 20000, 20000);

    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowCameraNear = 50;
    spotLight.shadowCameraFar = 30000;
    spotLight.shadowCameraFov = 30;
    VIEWER.scene.add(spotLight);

    VIEWER.scene.add(axisHelper);
    VIEWER.camera.add(axisPosition);
    axisPosition.position.set(0.8, 0.8, 0.5);
    axisPosition.position.unproject(VIEWER.camera);

    //setting up camera
    VIEWER.camera.position.set(50, 50, 50);
    VIEWER.camera.lookAt(new THREE.Vector3(0, 0, 0));

    var render = function () {
        requestAnimationFrame(render);

        axisHelper.position.setFromMatrixPosition(axisPosition.matrixWorld);

        VIEWER.renderer.render(VIEWER.scene, VIEWER.camera);
    };

    render();

    VIEWER.navigation.init();
};

/**
 * To focus the camera on a object.
 * @param  {Array} objectMaxValues Array with 3 elements
 * corresponding to the max values of each vertice component
 * @param  {Array} objectMinValues objectMaxValues Array with 3 elements
 * corresponding to the min values of each vertice component
 */
VIEWER.focusCamera = function (objectMaxValues, objectMinValues) {
    "use strict";
    //using The Law of Sines
    var distanceFromCenter = Math.abs(((objectMaxValues[1] - objectMinValues[1]) /
        Math.sin(VIEWER.camera.fov)) * Math.sin((180 - VIEWER.camera.fov)/2))*2,
        center = new THREE.Vector3(
            (objectMaxValues[0] - objectMinValues[0])/2,
            (objectMaxValues[1] - objectMinValues[1])/2,
            (objectMaxValues[2] - objectMinValues[2])/2);

    VIEWER.cameraPivot.position.copy(center);
    VIEWER.camera.position.set(distanceFromCenter/3, distanceFromCenter/3, distanceFromCenter);
    VIEWER.camera.lookAt(new THREE.Vector3(0, 0, 0));
};

/**
 * Will handle all Leap motion control related
 */
VIEWER.navigation = {

    controller: null,

    init: function () {
        "use strict";

        this.controller = new Leap.Controller({
                     enableGestures: true,
                     frameEventName: 'animationFrame',
                     loopWhileDisconnected: false
                     });

        // controller connect events
        this.controller.on('connect', this.onConnect);
        this.controller.on('deviceAttached', this.onDeviceAttached);
        this.controller.on('deviceDisonnected', this.onDeviceDisconnect);
        this.controller.on('deviceRemoved', this.onDeviceRemove);
        this.controller.on('deviceStopped', this.onDeviceStop);
        this.controller.on('deviceStreaming', this.onDeviceStream);
        this.controller.on('disconnect', this.onDisconnect);
        this.controller.on('streamingStarted', this.onStreamingStart);
        this.controller.on('streamingStopped', this.onStreamingStop);

        // frame events
        this.controller.on('frame', this.onFrame);

        this.controller.connect();

    },

    onFrame: function (frame) {
        "use strict";
        console.log("frame");
    },

    ///////////////////////////////////////
    // Controller Status Event Functions //
    ///////////////////////////////////////

    onConnect: function () {
        "use strict";
        console.log("event: Established connection to websocket server");
        document.getElementById("status").innerHTML = "Leap Motion: Connected but not Streaming";
    },

    onDeviceAttached: function () {
        "use strict";
        console.log("event: Device Attached");
    },

    onDeviceDisconnect: function () {
        "use strict";
        console.log("event: Device Disconnected");
    },

    onDeviceRemove: function () {
        "use strict";
        console.log("event: Device Removed");
    },

    onDeviceStop: function () {
        "use strict";
        console.log("event: Device Stopped Streaming");
        document.getElementById("status").innerHTML = "Leap Motion: Connected but not Streaming";
    },

    onDeviceStream: function () {
        "use strict";
        console.log("event: Device Streaming");
    },

    onDisconnect: function () {
        "use strict";
        console.log("event: disconnected from websocket");
    },

    onStreamingStart: function () {
        "use strict";
        console.log("event: Streaming Start");
        document.getElementById("status").innerHTML = "Leap Motion: Connected and Streaming";
    },

    onStreamingStop: function () {
        "use strict";
        console.log("event: Streaming Stopped");
    }
};