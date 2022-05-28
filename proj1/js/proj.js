/*global THREE, requestAnimationFrame, console*/

var LateralCamera, FrontalCamera, TopCamera, cameraInUse, v1R, v1L, v2R, v2L, v3R, v3L, left, up, right, down,front,back, scene, renderer, clock;
var dz,cz;
var g0, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12,g13,g14,g15,g16,g17,g18,g19,g20,g21,g22,g23,g24,g25,g26,g27, gf;

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

function createGeneralizedCylinder(x, y, z, rotx, roty, rotz, g) {
    'use strict';
    
    var cylinder = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x008000, wireframe: true });

    class CustomSinCurve extends THREE.Curve {
        constructor(scale) {
          super();
          this.scale = scale;
        }
        getPoint(t) {
          const tx = t * 3 - 1.5;
          const ty = Math.sin(2 * Math.PI * t);
          const tz = 0;
          return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
      
    const path = new CustomSinCurve(4);
    const tubularSegments = 20;  // ui: tubularSegments
    const radius = 1;  // ui: radius
    const radialSegments = 8;  // ui: radialSegments
    const closed = false;  // ui: closed
    const geometry = new THREE.TubeGeometry(
        path, tubularSegments, radius, radialSegments, closed);
   
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
    g13 = new THREE.Object3D();
    g14 = new THREE.Object3D();
    g15 = new THREE.Object3D();
    g16 = new THREE.Object3D();
    g17 = new THREE.Object3D();
    g18 = new THREE.Object3D();
    g19 = new THREE.Object3D();
    g20 = new THREE.Object3D();
    g21 = new THREE.Object3D();
    g22 = new THREE.Object3D();
    g23 = new THREE.Object3D();
    g24 = new THREE.Object3D();
    g25 = new THREE.Object3D();
    g26 = new THREE.Object3D();
    g27 = new THREE.Object3D();
    gf = new THREE.Object3D();
    
    
    createTorus(0, 0, 10, 0, 0, 0, g0);
    g1.add(g0);
    createCylinder(0, 0, 0, 20, Math.PI/2, 0, 0, g1);
    g1.position.set(0,0,12.5);
    
    g2.add(g1);
    createCube(0,0,0,20,5,5,g2);
    g3.add(g2);
    createCylinder(0, 0, -7.5, 10, Math.PI/2, 0, 0, g3);
    g4.add(g3);
    createCube(0,0,-15,5,5,5,g4);
    g4.position.set(0,-2.5,0);
    
    g5.add(g4);
    createCylinder(0, 12.5, 0, 25, 0, 0, 0, g5);
    g5.rotation.y= Math.PI/4;
    g5.position.set(0,-27.5,0);

    g6.add(g5);
    createCube(0,0,0,5,5,5, g6);
    g7.add(g6);
    createCylinder(0,0,-12.5,20, Math.PI / 2, 0, 0, g7);
    g7.position.set(0,0,27.5);

    g8.add(g7);
    createCube(0,0,0,20,10,10,g8);
    g9.add(g8);
    createCylinder(0,20,0,30, 0, 0, 0, g9);
    g9.position.set(0,-40,0);


    g10.add(g9);
    createCube(0,0,0,10,10,10,g10);
    g11.add(g10);
    createCylinder(-12.5, 0, 0, 15, 0, 0, Math.PI/2, g11);
    g12.add(g11);
    createCube(-22.5, 0, 0, 5, 5, 5, g12);
    
    g13.add(g12);
    createCylinder(0,0,-15,20,Math.PI/2,0,0,g13);
    g13.position.set(0,0,30);


    gf.add(g13);
    createSphere(0,0,0,5,gf);

    createCone(0,0,0,0,0,0,7,10,g14);
    g15.add(g14);
    createCylinder(8.5,2,0,10,0,0,-Math.PI/3,g15);
    g16.add(g15);
    createTorusKnot(18,8,0,g16);
    g17.add(g16);
    createCylinder(-8.5,2,0,10,0,0,Math.PI/3,g17);
    g18.add(g17);
    createTorusKnot(-18,8,0,g18);
    g18.position.set(0,-5,0);



    g19.add(g18);
    createCylinder(5,4.5,-8,20,-Math.PI/4,0,-Math.PI/8,g19);
    g20.add(g19);
    createCone(8,17,-14,0,0,0,7,10,g20);
    g20.position.set(-8,-17,14);


    g21.add(g20);
    createCylinder(-7.5,3,0,10,0,0,Math.PI/4,g21);
    g22.add(g21);
    createTorus(-15,8,0, Math.PI/4, 0, 0,g22);
    g22.position.set(15,-8,0);



    g23.add(g22);
    createCylinder(0,3,-3,10,-Math.PI/4,0,0,g23);
    g24.add(g23);
    createCone(0,10,-10,-Math.PI/4,0,0,7,10,g24);
    g24.position.set(0,-10,10);


    g25.add(g24);
    createCylinder(10,6,-5,20,-Math.PI/4,0, -Math.PI/4,g25);
    g26.add(g25);
    createGeneralizedCylinder(18,12,-10,0,0,0,g26);
    g26.position.set(7,3,-4);

    g27.add(g26);
    createCylinder(-10,0,0,20,0,0, -Math.PI/2,g27);
    g27.position.set(25,0,0);
    g27.rotation.x= Math.PI/3;


    gf.add(g27);

    gf.position.set(0,5,0);
    
    scene.add(gf);
}

function createCamera() {
    'use strict';
    LateralCamera = new THREE.OrthographicCamera(window.innerWidth/-10,
                                         window.innerWidth/10,
                                         window.innerHeight/10,
                                         window.innerHeight/-10,
                                         1,
                                         1000);
    LateralCamera.position.x = 100;
    LateralCamera.position.y = 0;
    LateralCamera.position.z = 0;
    LateralCamera.lookAt(scene.position);

    FrontalCamera = new THREE.OrthographicCamera(window.innerWidth/-10,
                                        window.innerWidth/10,
                                        window.innerHeight/10,
                                        window.innerHeight/-10,
                                        1,
                                        1000);
    FrontalCamera.position.x = 0;
    FrontalCamera.position.y = 0;
    FrontalCamera.position.z = 100;
    FrontalCamera.lookAt(scene.position);

    TopCamera = new THREE.OrthographicCamera(window.innerWidth/-10,
                                        window.innerWidth/10,
                                        window.innerHeight/10,
                                        window.innerHeight/-10,
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
        wire();
        break;
    case 81: //Q
    case 113://q
        v1R=true;
        break;
    case 87: //W
    case 119://w
        v1L=true;
        break;
    case 65: //A
    case 97://a
        v2R=true;
        break;
    case 83: //S
    case 115://s
        v2L=true;
        break;
    case 90: //Z
    case 122://z
        v3R=true;
        break;
    case 88: //X
    case 120://x
        v3L=true;
        break;
    case 37: //left arrow
        left = true;
        break;
    case 38: //up arrow
        up = true;
        break;
    case 39: //right arrow
        right = true;
        break;
    case 40: //down arrow
        down = true;
        break;
    case 68: //D
    case 100: //d
        dz = true;
        break;
    case 67: //C
    case 99: //c
        cz = true;
        break;
    }   
}

function onKeyUp(e) {
    'use strict';
    
    switch (e.keyCode) {
    case 81: //Q
    case 113://q
        v1R=false;
        break;
    case 87: //W
    case 119://w
        v1L=false;
        break;
    case 65: //A
    case 97://a
        v2R=false;
        break;
    case 83: //S
    case 115://s
        v2L=false;
        break;
    case 90: //Z
    case 122://z
        v3R=false;
        break;
    case 88: //X
    case 120://x
        v3L=false;
        break;
    case 37: //left arrow
        left = false;
        break;
    case 38: //up arrow
        up = false;
        break;
    case 39: //right arrow
        right = false;
        break;
    case 40: //down arrow
        down = false;
        break;
    case 68: //D
    case 100: //d
        dz = false;
        break;
    case 67: //C
    case 99: //c
        cz = false;
        break;
    } 
    
}

function movement(deltaTime){

    const angle = deltaTime * 4;
    const vel = deltaTime * 8;
    if(v1R == true){
        gf.rotateY(angle);
    }
    if(v1L == true){
        gf.rotateY(-angle);
    }
    if(v2R == true){
        g13.rotateZ(angle);
    }
    if(v2L == true){
        g13.rotateZ(-angle);
    }
    if(v3R == true){
        g9.rotateY(angle);
    }
    if(v3L == true){
        g9.rotateY(-angle);
    }
    if(left == true){
        gf.translateX(-vel);
    }
    if(right == true){
        gf.translateX(vel);
    }
    if(down == true){
        gf.translateY(-vel);
    }
    if(up == true){
        gf.translateY(vel);
    }
    if(dz == true){
        gf.translateZ(-vel);
    }
    if(cz == true){
        gf.translateZ(vel);
    }

}

function wire(){
    gf.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = !node.material.wireframe;
        }
    });
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