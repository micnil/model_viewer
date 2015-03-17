"use strict";
/*global THREE, VIEWER, window */
/*jslint indent: 4, maxerr: 50, vars: true, regexp: true, sloppy: true */

VIEWER.event = {

    onWindowResize: function () {

        VIEWER.camera.aspect = (window.innerWidth / window.innerHeight);
        VIEWER.camera.updateProjectionMatrix();

        VIEWER.renderer.setSize(window.innerWidth, window.innerHeight);

    },

    /**
    * Temporary keyboard interaction, untill leap motion part is done.
    */
    keyHandler: function (e) {
        if (e.keyCode === 39) {
            VIEWER.cameraPivot.rotation.y += 0.05;
        }
        if (e.keyCode === 37) {
            VIEWER.cameraPivot.rotation.y -= 0.05;
        }
    },

    /**
    * Given a .m object file, this function will get vertices, normals
    * and indices and create a THREE.mesh and put it in the VIEWER.objects
    * array
    */
    loadObject:  function (file) {

        var reader = new FileReader();

        reader.onload = function () {
            var fileInput = reader.result,
                verticeLines = fileInput.match(/Vertex.*(\n)/g),
                faceLines = fileInput.match(/Face.*(\n)/g),
                vertices = new Float32Array(verticeLines.length * 3),
                normals = new Float32Array(verticeLines.length * 3),
                indices = new Uint32Array(faceLines.length * 3),
                numbers;

            for (var i = 0; i<verticeLines.length; i++) {

                numbers = verticeLines[i].match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
                numbers = numbers.map(parseFloat);

                vertices[i * 3 + 0] = numbers[1];
                vertices[i * 3 + 1] = numbers[2];
                vertices[i * 3 + 2] = numbers[3];

                normals[i * 3 + 0] = numbers[4];
                normals[i * 3 + 1] = numbers[5];
                normals[i * 3 + 2] = numbers[6];
            }

            for (i = 0; i<faceLines.length; i++) {

                numbers = faceLines[i].match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
                numbers = numbers.map(Number);

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
            geometry.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ) );
            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

            var mesh = new THREE.Mesh( geometry, material );
            mesh.castShadow = false;
            mesh.receiveShadow = true;

            VIEWER.scene.add(mesh);
            VIEWER.objects.push(mesh);

            console.log("finished loading");
        };

        reader.readAsText(file);
    }
};
