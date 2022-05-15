/*global THREE, requestAnimationFrame, console*/

var LateralCamera, FrontalCamera, TopCamera, cameraInUse, v1R, v1L, v2R, v2L, v3R, v3L, left, up, right, down, scene, renderer, clock;
var resetX, resetY, initX, initY;
var g0, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, gf;

var geometry, material, mesh;

function createCube(x, y, z, width, height, depth, g) {
    'use strict';

    var cube = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    geometry = new THREE.CubeGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material);
    
    cube.add(mesh);

    cube.position.set(x,y,z);

    g.add(cube);
}

function createTorus(x, y, z, rotx, roty, rotz, g) {
    'use strict';
    
    var torus = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });

    const radius = 3;  // ui: radius
    const tubeRadius = 1.5;  // ui: tubeRadius
    const radialSegments = 8;  // ui: radialSegments
    const tubularSegments = 24;  // ui: tubularSegments
   
    geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    mesh = new THREE.Mesh(geometry, material);
    
    torus.add(mesh);

    torus.rotation.set(rotx, roty, rotz);
    
    torus.position.set(x,y,z);

    g.add(torus);
}

function createTorusKnot(x, y, z, g) {
    'use strict';
    
    var torus = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });

    const radius = 3.5;  // ui: radius
    const tubeRadius = 1.5;  // ui: tubeRadius
    const radialSegments = 8;  // ui: radialSegments
    const tubularSegments = 64;  // ui: tubularSegments
    const p = 2;  // ui: p
    const q = 3;  // ui: q
    const geometry = new THREE.TorusKnotGeometry(
        radius, tubeRadius, tubularSegments, radialSegments, p, q);
    mesh = new THREE.Mesh(geometry, material);
    
    torus.add(mesh);
    
    torus.position.set(x,y,z);

    g.add(torus);
}

function createCylinder(x, y, z, len, rotx, roty, rotz, g) {
    'use strict';
    
    var cylinder = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xf0f8ff, wireframe: true });

    const radiusTop = 1;  // ui: radiusTop
    const radiusBottom = 1;  // ui: radiusBottom
    const height = len;  // ui: height
    const radialSegments = 8;  // ui: radialSegments

    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
   
    mesh = new THREE.Mesh(geometry, material);
    cylinder.add(mesh);

    cylinder.rotation.set(rotx, roty, rotz);

    cylinder.position.set(x,y,z);

    g.add(cylinder);

}

function createCone(x, y, z, rotx, roty, rotz, r, h, g) {
    'use strict';
    
    var cone = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x1260cc, wireframe: true });

    const radius = r;  // ui: radius
    const height = h;  // ui: height
    const radialSegments = 16;  // ui: radialSegments
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
   
    mesh = new THREE.Mesh(geometry, material);
    cone.add(mesh);

    cone.rotation.set(rotx, roty, rotz);
    
    cone.position.set(x,y,z);

    g.add(cone);

}

function createSphere(x, y, z, r, g) {
    'use strict';
    
    var sphere = new THREE.Object3D();
    sphere.userData = { jumping: true, step: 0 };

    const radius = r;  // ui: radius
    const widthSegments = 12;  // ui: widthSegments
    const heightSegments = 8;  // ui: heightSegments
    
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    mesh = new THREE.Mesh(geometry, material);
    
    sphere.add(mesh);
    sphere.position.set(x, y, z);
    
    scene.add(sphere);

    g.add(sphere);
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
    g6 = new THREE.Object3D();
    g7 = new THREE.Object3D();
    g8 = new THREE.Object3D();
    g9 = new THREE.Object3D();
    g10 = new THREE.Object3D();
    g11 = new THREE.Object3D();
    g12 = new THREE.Object3D();
    gf = new THREE.Object3D();
    
    createTorus(0, 0, 10, 0, 0, 0, g0);
    createCylinder(0, 0, 0, 20, Math.PI/2, 0, 0, g0);
    g0.position.set(0,0,12.5);
    
    g1.add(g0);
    createCube(0,0,0,20,5,5,g1);
    createCylinder(0, 0, -7.5, 10, Math.PI/2, 0, 0, g1);
    createCube(0,0,-15,5,5,5,g1);
    g1.position.set(0,-2.5,0);

    g2.add(g1);
    createCylinder(0, 12.5, 0, 25, 0, 0, 0, g2);
    g2.rotation.y= Math.PI/4;
    g2.position.set(0,-27.5,0);

    g3.add(g2);
    createCube(0,0,0,5,5,5, g3);
    createCylinder(0,0,-12.5,20, Math.PI / 2, 0, 0, g3);
    g3.position.set(0,0,27.5);

    g4.add(g3);
    createCube(0,0,0,20,10,10,g4);
    createCylinder(0,20,0,30, 0, 0, 0, g4);
    g4.position.set(0,-40,0);

    g5.add(g4)
    createCube(0,0,0,10,10,10,g5);
    createCylinder(-12.5, 0, 0, 15, 0, 0, Math.PI/2, g5);
    createCube(-22.5, 0, 0, 5, 5, 5, g5);
    //g5.rotation.y= Math.PI/4;
    g5.position.set(-8,-24,15);
    
    g6.add(g5)
    createCylinder(-5.5,-11,9,20,0,Math.PI/3,-Math.PI/4,g6);//y=15

    gf.add(g6);
    createSphere(0,0,0,5,gf);

    createCone(0,0,0,0,0,0,7,10,g7);
    createCylinder(8.5,2,0,10,0,0,-Math.PI/3,g7);
    createTorusKnot(18,8,0,g7);
    createCylinder(-8.5,2,0,10,0,0,Math.PI/3,g7);
    createTorusKnot(-18,8,0,g7);
    //rotacao possivel
    g7.position.set(0,-5,0);

    g8.add(g7);
    createCylinder(5,4.5,-8,20,-Math.PI/4,0,-Math.PI/8,g8);
    createCone(8,17,-14,0,0,0,7,10,g8);
    g8.position.set(-8,-17,14);
    //rot

    g9.add(g8);
    createCylinder(-7.5,3,0,10,0,0,Math.PI/4,g9);
    createTorus(-15,8,0, Math.PI/4, 0, 0,g9);
    g9.position.set(15,-8,0);

    g10.add(g9);
    createCylinder(0,3,-3,10,-Math.PI/4,0,0,g10);
    createCone(0,10,-10,-Math.PI/4,0,0,7,10,g10);
    g10.position.set(0,-10,10);

    g11.add(g10);
    createCylinder(10,6,-5,20,-Math.PI/4,0, -Math.PI/4,g11);
    createSphere(20.5,13,-13.5,5,g11);
    g11.position.set(7,3,-4);

    g12.add(g11);
    createCylinder(-10,0,0,20,0,0, -Math.PI/2,g12);
    g12.position.set(25,0,0);
    g12.rotation.x= Math.PI/3;

    gf.add(g12);

    initX = 0;
    initY = 35;
    gf.position.set(initX,initY,0);
    

    scene.add(gf);
}

function createCamera() {
    'use strict';
    LateralCamera = new THREE.OrthographicCamera(window.innerWidth/-12,
                                         window.innerWidth/12,
                                         window.innerHeight/12,
                                         window.innerHeight/-12,
                                         1,
                                         1000);
    LateralCamera.position.x = 100;
    LateralCamera.position.y = 0;
    LateralCamera.position.z = 0;
    LateralCamera.lookAt(scene.position);

    FrontalCamera = new THREE.OrthographicCamera(window.innerWidth/-12,
                                        window.innerWidth/12,
                                        window.innerHeight/12,
                                        window.innerHeight/-12,
                                        1,
                                        1000);
    FrontalCamera.position.x = 0;
    FrontalCamera.position.y = 0;
    FrontalCamera.position.z = 100;
    FrontalCamera.lookAt(scene.position);

    TopCamera = new THREE.OrthographicCamera(window.innerWidth/-12,
                                        window.innerWidth/12,
                                        window.innerHeight/12,
                                        window.innerHeight/-12,
                                        1,
                                        1000);
    TopCamera.position.x = 0;
    TopCamera.position.y = 100;
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
    case 81: //Q
    case 113://q
        //gf.rotateY(0.1);
        v1R=1;
        //setTimeout(function(){v1R = 0},1000);
        
        break;
    case 87: //W
    case 119://w
        //gf.rotateY(-0.1); 
        v1L=1;
        //setTimeout(function(){v1L = 0},1000);
        break;
    case 65: //A
    case 97://a
        //g12.rotateX(0.1); 
        v2R=1;
        //setTimeout(function(){v2R = 0},1000);
        
        break;
    case 83: //S
    case 115://s
        //g12.rotateX(-0.1); 
        v2L=1;
        //setTimeout(function(){v2L = 0},1000);
        
        break;
    case 90: //Z
    case 122://z
        //g4.rotateY(0.1); 
        v3R=1;
        //setTimeout(function(){v3R = 0},1000);
        
        break;
    case 88: //X
    case 120://x
        //g4.rotateY(-0.1);
        v3L=1;
        //setTimeout(function(){v3L = 0},1000);
        
        break;
    case 37: //left arrow
        left = 1;
        break;
    case 38: //up arrow
        up = 1;
        break;
    case 39: //right arrow
        right = 1;
        break;
    case 40: //down arrow
        down = 1;
        break;
    case 68: //D
    case 100: //d
        resetX = 1;
        break;
    case 67: //C
    case 99: //c
        resetY = 1;
        break;
    }   
}

function onKeyUp(e) {
    'use strict';
    
    switch (e.keyCode) {
    case 81: //Q
    case 113://q
        //gf.rotateY(0.1);
        v1R=0;
        //setTimeout(function(){v1R = 0},1000);
        
        break;
    case 87: //W
    case 119://w
        //gf.rotateY(-0.1); 
        v1L=0;
        //setTimeout(function(){v1L = 0},1000);
        break;
    case 65: //A
    case 97://a
        //g12.rotateX(0.1); 
        v2R=0;
        //setTimeout(function(){v2R = 0},1000);
        
        break;
    case 83: //S
    case 115://s
        //g12.rotateX(-0.1); 
        v2L=0;
        //setTimeout(function(){v2L = 0},1000);
        
        break;
    case 90: //Z
    case 122://z
        //g4.rotateY(0.1); 
        v3R=0;
        //setTimeout(function(){v3R = 0},1000);
        
        break;
    case 88: //X
    case 120://x
        //g4.rotateY(-0.1);
        v3L=0;
        //setTimeout(function(){v3L = 0},1000);
        break;
    case 37: //left arrow
        left = 0;
        break;
    case 38: //up arrow
        up = 0;
        break;
    case 39: //right arrow
        right = 0;
        break;
    case 40: //down arrow
        down = 0;
        break;
    case 68: //D
    case 100: //d
        resetX = 0;
        break;
    case 67: //C
    case 99: //c
        resetY = 0;
        break;
    } 
    
}

function movement(deltaTime){

    const angle = deltaTime * 4;
    const vel = deltaTime * 8;
    if(v1R == 1){
        gf.rotateY(angle);
        //v1R = 0;
        //setTimeout(function(){v1R = 0},1000);
    }
    if(v1L == 1){
        gf.rotateY(-angle);
        //v1L = 0;
        //setTimeout(function(){v1L = 0},1000);
    }
    if(v2R == 1){
        g12.rotateX(angle);
        //v2R = 0;
        //setTimeout(function(){v2R = 0},1000);
    }
    if(v2L == 1){
        g12.rotateX(-angle);
        //v2L = 0;
        //setTimeout(function(){v2L = 0},1000);
    }
    if(v3R == 1){
        g4.rotateY(angle);
        //v3R = 0;
        //setTimeout(function(){v3R = 0},1000);
    }
    if(v3L == 1){
        g4.rotateY(-angle);
        //v3L = 0;
        //setTimeout(function(){v3L = 0},1000);
    }
    if(left == 1){
        gf.translateX(-vel);
    }
    if(right == 1){
        gf.translateX(vel);
    }
    if(down == 1){
        gf.translateY(-vel);
    }
    if(up == 1){
        gf.translateY(vel);
    }
    if(resetX == 1){
        gf.position.x = initX;
    }
    if(resetY == 1){
        gf.position.y = initY;
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

    clock = new THREE.Clock(true);
   
    createScene();
    createCamera();
    
    render();
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

function animate() {
    'use strict';

    let deltaTime = clock.getDelta();

    movement(deltaTime);
    
    render();
    
    requestAnimationFrame(animate);
}