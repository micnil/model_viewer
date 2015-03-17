# model_viewer 
A webGL 3D model viewer with Leap Motion interaction. This is made for a course in Human Computer Interaction at Nanyang Technological University in Singapore. The assignment stated that the Model Viewer should be able to load two given object files with a certain format (see below).

```
Vertex 1  0.0174077 0.0764197 0.0626345 {normal=(0.0502809 0.839018 0.541776)}
Vertex 2  0.0836575 0.0492556 0.0570304 {normal=(0.781032 0.491585 0.385141)}
Vertex 3  0.00887946 0.0767859 0.0592854 {normal=(-0.320167 0.889981 0.324696)}
Vertex 4  0.028748 0.0688098 0.0495087 {normal=(0.926122 0.318873 0.201541)}
Vertex 5  0.0111302 0.0646941 0.0729961 {normal=(0.0245692 0.427633 0.903619)}
								.
								.
								.
Face 1  32410 10377 10380
Face 2  2273 10380 10377
Face 3  10380 3539 32410
Face 4  10377 32410 8287
Face 5  32410 32409 18408
								.
								.
								.							
```

The example objects are in the objects folder. Drag and drop the files over the canvas to load the objects.
Project made with the THREE.js framework.