/*global THREE, requestAnimationFrame, console*/

var LateralCamera, FrontalCamera, TopCamera, cameraInUse, scene, renderer;
var g0, g1, g2, g3, g4, g5, g6, g7;

var geometry, material, mesh;

var ball;

function createCube(x, y, z, width, height, depth, g) {
    'use strict';

    var cube = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    geometry = new THREE.CubeGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material);
    /*mesh.position.set(x, y, z);*/
    cube.add(mesh);
    
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    g.add(cube);
}

function createTorus(x, y, z, g) {
    'use strict';
    
    var torus = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });

    const radius = 3;  // ui: radius
    const tubeRadius = 1.5;  // ui: tubeRadius
    const radialSegments = 8;  // ui: radialSegments
    const tubularSegments = 24;  // ui: tubularSegments
   
    geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    mesh = new THREE.Mesh(geometry, material);
    /*mesh.position.set(x, y, z);*/
    torus.add(mesh);
    
    torus.position.x = x;
    torus.position.y = y;
    torus.position.z = z;

    g.add(torus);
}

function createCylinder(x, y, z, len, rot, g) {
    'use strict';
    
    var cylinder = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xf0f8ff, wireframe: true });

    const radiusTop = 1;  // ui: radiusTop
    const radiusBottom = 1;  // ui: radiusBottom
    const height = len;  // ui: height
    const radialSegments = 8;  // ui: radialSegments

    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
   
    mesh = new THREE.Mesh(geometry, material);
    /*mesh.position.set(x, y, z);
    mesh.rotation.x = rot;*/
    cylinder.add(mesh);

    cylinder.rotation.x = rot;
    
    cylinder.position.x = x;
    cylinder.position.y = y;
    cylinder.position.z = z;

    g.add(cylinder);

}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    

    scene.add(new THREE.AxisHelper(10));

    g0 = new THREE.Object3D();
    g1 = new THREE.Object3D();
    g2 = new THREE.Object3D();
    g3 = new THREE.Object3D();
    g4 = new THREE.Object3D();
    g5 = new THREE.Object3D();
    /*g6 = new THREE.Object3D();
    g7 = new THREE.Object3D();
    g8 = new THREE.Object3D();*/
    
    createTorus(0, 0, 10, g0);
    createCylinder(0, 0, 0, 20, Math.PI/2, g0);
    g0.position.set(0,0,12.5);
    
    g1.add(g0);
    createCube(0,0,0,20,5,5,g1);
    createCylinder(0, 0, -7.5, 10, Math.PI / 2, g1);
    createCube(0,0,-15,5,5,5,g1);
    g1.position.set(0,-2.5,0);

    g2.add(g1);
    createCylinder(0, 12.5, 0, 25, 0, g2);
    g2.rotation.y= -Math.PI/4;
    g2.position.set(0,-27.5,0);

    g3.add(g2);
    createCube(0,0,0,5,5,5, g3);
    createCylinder(0,0,-12.5,20, Math.PI / 2, g3);
    g3.position.set(0,0,27.5);

    g4.add(g3);
    createCube(0,0,0,20,10,10,g4);
    createCylinder(0,20,0,30, 0,g4);
    //g4.rotation.y possivel
    g4.position.set(0,-40,0);

    g5.add(g4)
    createCube(0,0,0,10,10,10,g5);
    g5.position.set(0,30,0);//temp
    scene.add(g5);
}

function createCamera() {
    'use strict';
    LateralCamera = new THREE.OrthographicCamera(window.innerWidth/-15,
                                         window.innerWidth/15,
                                         window.innerHeight/15,
                                         window.innerHeight/-15,
                                         1,
                                         1000);
    LateralCamera.position.x = 50;
    LateralCamera.position.y = 0;
    LateralCamera.position.z = 0;
    LateralCamera.lookAt(scene.position);

    FrontalCamera = new THREE.OrthographicCamera(window.innerWidth/-15,
                                        window.innerWidth/15,
                                        window.innerHeight/15,
                                        window.innerHeight/-15,
                                        1,
                                        1000);
    FrontalCamera.position.x = 0;
    FrontalCamera.position.y = 0;
    FrontalCamera.position.z = 50;
    FrontalCamera.lookAt(scene.position);

    TopCamera = new THREE.OrthographicCamera(window.innerWidth/-15,
                                        window.innerWidth/15,
                                        window.innerHeight/15,
                                        window.innerHeight/-15,
                                        1,
                                        1000);
    TopCamera.position.x = 0;
    TopCamera.position.y = 50;
    TopCamera.position.z = 0;
    TopCamera.lookAt(scene.position);
}

function onKeyDown(e) {
    'use strict';
    
    switch (e.keyCode) {
    case 49: //1
        cameraInUse = 1;
        break;
    case 50: //2
        cameraInUse = 2;
        break;
    case 51: //3
        cameraInUse = 3;
        break;
    case 52: //4
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    }
}

function render() {
    'use strict';
    if(cameraInUse == 1)
        renderer.render(scene, FrontalCamera);
    else if(cameraInUse == 2)
        renderer.render(scene, TopCamera);
    else if(cameraInUse == 3)
        renderer.render(scene, LateralCamera);
    else
        renderer.render(scene, FrontalCamera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
   
    createScene();
    createCamera();
    
    render();
    
    window.addEventListener("keydown", onKeyDown);
}

function animate() {
    'use strict';
    
    render();
    
    requestAnimationFrame(animate);
}