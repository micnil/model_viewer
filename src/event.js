VIEWER.event = {

    onWindowResize: function (axisPosition) {
        "use strict";
        VIEWER.camera.aspect = (window.innerWidth / window.innerHeight);
        VIEWER.camera.updateProjectionMatrix();

        VIEWER.renderer.setSize(window.innerWidth, window.innerHeight);

        //TODO repositioning the axishelper
        //console.log(axisPosition.position);
    },

    /**
     * Temporary keyboard interaction, untill leap motion part is done.
     * @param  {event} e Keydown event object
     */
    keyHandler: function (e) {
        "use strict";
        if (e.keyCode === 39) {
            VIEWER.cameraPivot.rotation.y += 0.05;
            VIEWER.cameraPivot.updateMatrixWorld();
        }
        if (e.keyCode === 37) {
            VIEWER.cameraPivot.rotation.y -= 0.05;
            VIEWER.cameraPivot.updateMatrixWorld();
        }
    },

    /**
     * Given a .m object file, this function will get vertices, normals
     * and indices and create a THREE.mesh and put it in the VIEWER.objects
     * array
     * @param  {file} file The file that should be processed
     */
    loadObject:  function (file) {
        "use strict";

        var reader = new FileReader();

        reader.onload = function () {
            var fileInput = reader.result,
                verticeLines = fileInput.match(/Vertex.*(\n)/g),
                faceLines = fileInput.match(/Face.*(\n)/g),
                vertices = new Float32Array(verticeLines.length * 3),
                normals = new Float32Array(verticeLines.length * 3),
                indices = new Uint32Array(faceLines.length * 3),
                objectMaxValues = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE], // [xMax, yMax, zMax]
                objectMinValues = [Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE], // [xMin, yMin, zMin]
                numbers;


            //get all vertices and normals from file
            for (var i = 0; i<verticeLines.length; i++) {

                numbers = verticeLines[i].match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
                numbers = numbers.map(parseFloat);

                vertices[i * 3 + 0] = numbers[1];
                if (objectMaxValues[0]<numbers[1]) {objectMaxValues[0] = numbers[1]; }
                if (objectMinValues[0]>numbers[1]) {objectMinValues[0] = numbers[1]; }

                vertices[i * 3 + 1] = numbers[2];
                if (objectMaxValues[1]<numbers[2]) {objectMaxValues[1] = numbers[2]; }
                if (objectMinValues[1]>numbers[2]) {objectMinValues[1] = numbers[2]; }

                vertices[i * 3 + 2] = numbers[3];
                if (objectMaxValues[2]<numbers[3]) {objectMaxValues[2] = numbers[3]; }
                if (objectMinValues[2]>numbers[3]) {objectMinValues[2] = numbers[3]; }

                normals[i * 3 + 0] = numbers[4];
                normals[i * 3 + 1] = numbers[5];
                normals[i * 3 + 2] = numbers[6];
            }

            //rescale object to reasonable size
            for (i = 0; i<vertices.length; i++){
                vertices[i] /= objectMaxValues[1];
            }

            //get all indices from file
            for (i = 0; i<faceLines.length; i++) {

                numbers = faceLines[i].match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
                numbers = numbers.map(Number);

                // -1 becasue indices are numered from 1
                indices[i * 3 + 0] = numbers[1] - 1;
                indices[i * 3 + 1] = numbers[2] - 1;
                indices[i * 3 + 2] = numbers[3] - 1;
            }

            var material = new THREE.MeshPhongMaterial( {
                color: 0xdddddd,
                specular: 0x000000,
                shininess: 10,
                shading: THREE.SmoothShading } ),
                geometry = new THREE.BufferGeometry();
            geometry.addAttribute('index', new THREE.BufferAttribute(indices, 1));
            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

            var mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = false;
            mesh.receiveShadow = true;

            VIEWER.scene.add(mesh);
            VIEWER.objects.push(mesh);
            //VIEWER.focusCamera(objectMaxValues, objectMinValues);

            console.log("finished loading");
        };

        reader.readAsText(file);
    }
};
