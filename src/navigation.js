/**
 * Will handle all Leap motion control related stuff
 */
VIEWER.navigation = (function () {
    "use strict";
    var controller = null,
        navigationMode = null,
        interactionSphere = {
            //in millimeters
            center: 200,
            radius: 80,
            normalizePoint: function (point) {
                return new THREE.Vector3(point[0] / this.radius,
                    (point[1] - this.center) / this.radius,
                    point[2] / this.radius);
            }
        }

    function init() {
        "use strict";
        controller = new Leap.Controller({
             enableGestures: true,
             frameEventName: 'animationFrame',
             loopWhileDisconnected: false
             });

        // controller connect events
        controller.on('connect', onConnect);
        controller.on('deviceAttached', onDeviceAttached);
        controller.on('deviceDisonnected', onDeviceDisconnect);
        controller.on('deviceRemoved', onDeviceRemove);
        controller.on('deviceStopped', onDeviceStop);
        controller.on('deviceStreaming', onDeviceStream);
        controller.on('disconnect', onDisconnect);
        controller.on('streamingStarted', onStreamingStart);
        controller.on('streamingStopped', onStreamingStop);

        // frame/gesture events
        controller.on('frame', onFrame);
        controller.on('gesture', onGesture);

        controller.connect();

    }

    function updateNavigationMode(hand){
        if (hand.thumb.extended && hand.palmNormal[1] < 0)
        {
            // flight mode
            console.log("thumb extended");
            navigationMode = "flight";
        } else if (
            !hand.pinky.extended &&
            !hand.ringFinger.extended &&
            !hand.middleFinger.extended &&
            !hand.thumb.extended &&
            hand.indexFinger.extended)
        {
            // select mode
            console.log("indexFinger extended");
            navigationMode = "select";
        } else {
            navigationMode = null;
        }
    }

    function onFrame (frame) {
        "use strict";
        console.log("frame");
        //TODO: draw fingertops to scene?

        if(frame.hands.length > 0){

            var hand = frame.hands[0];
            updateNavigationMode(hand);


            if(navigationMode === "flight"){
                handleFlight(hand);
            } else if (navigationMode === "select") {
                //Pointing
                //handleSelect(hand);
            }
        }
    }

    function onGesture(gesture) { //,frame
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
    }

    function handleFlight(hand) {

        var pos = hand.palmPosition,
            spherePos = interactionSphere.normalizePoint(pos),
            normSpherePos = spherePos.clone().normalize(),
            m;

        //Translations
        if(spherePos.length()>1){
            m = VIEWER.camera.matrix.clone();
            var yRad = new THREE.Euler().setFromRotationMatrix(m,"YZX").y,
                movement = new THREE.Vector3().subVectors(spherePos, normSpherePos);

            m.getInverse(m);

            var forward = new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0), yRad);
            VIEWER.camera.translateOnAxis(forward.transformDirection(m), movement.z);

            var up = new THREE.Vector3(0,1,0).transformDirection(m);
            VIEWER.camera.translateOnAxis(up, movement.y);

            var right = new THREE.Vector3(1,0,0);
            VIEWER.camera.translateOnAxis(right, movement.x);
        }

        VIEWER.camera.updateMatrix();
        VIEWER.camera.updateMatrixWorld();

        //Rotations

        // Pitch
        m = VIEWER.camera.matrix.clone();
        var xRad = new THREE.Euler().setFromRotationMatrix(m,"YZX").x;
        if (hand.pitch()>0.15 && xRad < Math.PI / 2 ) {
            VIEWER.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (hand.pitch()-0.15)*0.1);
        } else if (hand.pitch()<-0.15 && xRad > -Math.PI / 2) {
            VIEWER.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (hand.pitch()+0.15)*0.1);
        }

        VIEWER.camera.updateMatrix();
        VIEWER.camera.updateMatrixWorld();

        //Yaw
        m = VIEWER.camera.matrix.clone();
        if (hand.yaw()>0.15) {
            m.getInverse(m);
            VIEWER.camera.rotateOnAxis(new THREE.Vector3(0, -1, 0).transformDirection(m), (hand.yaw()-0.15)*0.1);
        } else if (hand.yaw()<-0.15) {
            m.getInverse(m)
            VIEWER.camera.rotateOnAxis(new THREE.Vector3(0, -1, 0).transformDirection(m), (hand.yaw()+0.15)*0.1);
        }
    }


    ///////////////////////////////////////
    // Controller Status Event Functions //
    ///////////////////////////////////////

    function onConnect() {
        "use strict";
        console.log("event: Established connection to websocket server");
        document.getElementById("status").innerHTML =
        "Leap Motion: Connected but not Streaming";
    }

    function onDeviceAttached() {
        "use strict";
        console.log("event: Device Attached");
    }

    function onDeviceDisconnect() {
     "use strict";
     console.log("event: Device Disconnected");
    }

    function onDeviceRemove() {
        "use strict";
        console.log("event: Device Removed");
    }

    function onDeviceStop() {
        "use strict";
        console.log("event: Device Stopped Streaming");
        document.getElementById("status").innerHTML =
        "Leap Motion: Connected but not Streaming";
    }

    function onDeviceStream() {
        "use strict";
        console.log("event: Device Streaming");
    }

    function onDisconnect() {
        "use strict";
        console.log("event: disconnected from websocket");
    }

    function onStreamingStart() {
        "use strict";
        console.log("event: Streaming Start");
        document.getElementById("status").innerHTML = "Leap Motion: Connected and Streaming";
        VIEWER.leapActive = true;
    }

    function onStreamingStop() {
        "use strict";
        console.log("event: Streaming Stopped");
        VIEWER.leapActive = false;
    }

    //Public functions and variables
    return {
        controller: controller,

        init: init,
/*        onFrame: onFrame,
        onGesture: onGesture,
        handleFlight: handleFlight,*/

/*        onConnect: onConnect,
        onDeviceAttached: onDeviceAttached,
        onDeviceDisconnect: onDeviceDisconnect,
        onDeviceRemove: onDeviceRemove,
        onDeviceStop: onDeviceStop,
        onDeviceStream: onDeviceStream,
        onDisconnect: onDisconnect,
        onStreamingStart: onStreamingStart,
        onStreamingStop: onStreamingStop*/
    };
})();