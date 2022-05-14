/*global THREE, requestAnimationFrame, console*/

var LateralCamera, FrontalCamera, TopCamera, cameraInUse, scene, renderer;

var geometry, material, mesh;

var ball;

function addTableLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(2, 6, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
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

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    

    scene.add(new THREE.AxisHelper(10));
    
    createTable(0, 8, 0);
    createBall(0, 0, 15);
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
    case 83:  //S
    case 115: //s
        ball.userData.jumping = !ball.userData.jumping;
        break;
    case 69:  //E
    case 101: //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
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
    
    if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }
    render();
    
    requestAnimationFrame(animate);
}