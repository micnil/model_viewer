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

        // frame/gesture events
        this.controller.on('frame', this.onFrame);
        this.controller.on('gesture', this.onGesture);

        this.controller.connect();

    },

    onFrame: function (frame) {
        "use strict";
        console.log("frame");
        //TODO: draw finger tops to scene?
        if(frame.hands.length > 0){

            var hand = frame.hands[0];

            if(hand.thumb.extended && hand.palmNormal[1] < 0){
                console.log("thumb extended");
                VIEWER.navigation.handleFlight(hand);
            }
        }
    },

    onGesture: function (gesture, frame) {
        "use strict";
        switch (gesture.type){
            case "circle":
                console.log("Circle Gesture");
            break;
            case "keyTap":
                console.log("Key Tap Gesture");
            break;
            case "screenTap":
                console.log("Screen Tap Gesture");
            break;
            case "swipe":
                console.log("Swipe Gesture");
            break;
        }
    },

    handleFlight: function (hand) {
        var palmNormal = new THREE.Vector3().fromArray(hand.palmNormal),
            palmDirection = new THREE.Vector3().fromArray(hand.palmDirection),
            quaternion = new THREE.Quaternion();

        quaternion.setFromUnitVectors(palmNormal, new THREE.Vector3(0, -1, 0));
        VIEWER.camera.translateX(quaternion.z);
        VIEWER.camera.translateZ(-quaternion.x);
        VIEWER.cameraPivot.
        VIEWER.camera.updateMatrixWorld();
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
        VIEWER.leapActive = true;
    },

    onStreamingStop: function () {
        "use strict";
        console.log("event: Streaming Stopped");
        VIEWER.leapActive = false;
    }
};