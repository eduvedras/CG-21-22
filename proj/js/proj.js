/*global THREE, requestAnimationFrame, console*/

var LateralCamera, FrontalCamera, TopCamera, cameraInUse, scene, renderer;

var geometry, material, mesh;

var ball;

function createCube(x, y, z, width, height, depth) {
    'use strict';

    var cube = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    geometry = new THREE.CubeGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    cube.add(mesh);

    scene.add(cube);
    
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
}

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createBall(x, y, z) {
    'use strict';
    
    ball = new THREE.Object3D();
    ball.userData = { jumping: true, step: 0 };
    
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);
    
    ball.add(mesh);
    ball.position.set(x, y, z);
    
    scene.add(ball);
}


function createTable(x, y, z) {
    'use strict';
    
    var table = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
   
    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, -1, -8);
    addTableLeg(table, -25, -1, 8);
    addTableLeg(table, 25, -1, 8);
    addTableLeg(table, 25, -1, -8);
    
    scene.add(table);
    
    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function createTorus(x, y, z) {
    'use strict';
    
    var torus = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });

    const radius = 3;  // ui: radius
    const tubeRadius = 1.5;  // ui: tubeRadius
    const radialSegments = 8;  // ui: radialSegments
    const tubularSegments = 24;  // ui: tubularSegments
   
    geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    torus.add(mesh);
    
    scene.add(torus);
    
    torus.position.x = x;
    torus.position.y = y;
    torus.position.z = z;
}

function createCylinder(x, y, z, len, rot) {
    'use strict';
    
    var cylinder = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xf0f8ff, wireframe: true });

    const radiusTop = 1;  // ui: radiusTop
    const radiusBottom = 1;  // ui: radiusBottom
    const height = len;  // ui: height
    const radialSegments = 8;  // ui: radialSegments

    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
   
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = rot;
    cylinder.add(mesh);
    
    scene.add(cylinder);
    
    cylinder.position.x = x;
    cylinder.position.y = y;
    cylinder.position.z = z;

}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    

    scene.add(new THREE.AxisHelper(10));
    
    createTorus(0, 0, 5);
    createCylinder(0, 0, 0, 20, Math.PI / 2);
    createCube(0,0,-6.3,20,5,5);
    createCylinder(0, 7.5, -6.3, 25, 0);
    createCube(0,15,-6.3,5,5,5);
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