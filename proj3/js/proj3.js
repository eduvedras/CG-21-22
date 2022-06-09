/*global THREE, requestAnimationFrame, console*/

//import * as THREE from 'three';

var FixedPerspCamera, FrontalCamera, MobilePerspCamera, cameraInUse, v1R, v1L, v2R, v2L, v3R, v3L, left, up, right, down,front,back, scene, renderer, clock;
var dz,cz,toRemove=null;
var width=200, height=130, cameraRatio = (width/height);
var first_origami;
/**
 * teta = latitute
 * fi = longitude
 */
var fi = 2*Math.PI*Math.random();
var teta = 2*Math.PI*Math.random();
var oldfi = fi;
var oldteta = teta;
var anglefi, angleteta;
var firstQ = new Array();
var secondQ = new Array();
var thirdQ = new Array();
var fourthQ = new Array();
var fifthQ = new Array();
var sixthQ = new Array();
var seventhQ = new Array();
var eighthQ = new Array();
var g0, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12,g13,g14,g15,g16,g17,g18,g19,g20,g21,g22,g23,g24,g25,g26,g27, gf,rocket;
const R = 50,body_length = 3;
var geometry, material, mesh;


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

function distance(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y -pos2.y) ** 2 + (pos1.z - pos2.z) ** 2);
}



function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxesHelper(10));

    gf = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xfa0e00});

    /**
     * Acho que para fazermos os origamis é suposto usarmos esta bufferGeometry 
     * (é aquela malha de triangulos que eles falam)
     */
     var geometry = new THREE.BufferGeometry();



    /**
     * Isto vão ser os vertices dos triangulos que vamos criar.
     * Os vértices tem de ser postos no array em sentido anti-horário
     * para a face que queremos criar aparecer, se quisermos por exemplo ver
     * um triangulo de trás e de frente, temos de criar dois triangulos e meter
     * os vertices no array em ordem contrária
     */
    var vertices = new Float32Array( [
        /**Triangulo da direita */
        0,-10,0,
        Math.cos(Math.PI/4)*10,0,Math.sin(Math.PI/4)*10,
        0,10,0,
        /**--------- */

        /**Triangulo da esquerda */
        -Math.cos(Math.PI/4)*10,0,Math.sin(Math.PI/4)*10,
        0,-10,0,
        0,10,0,
        /**--------- */

        /**Agora os mesmos triangulos mas declarados ao contrário
         * para se poder ver durante a rotação:
         */
         0,10,0,
         Math.cos(Math.PI/4)*10,0,Math.sin(Math.PI/4)*10,
         0,-10,0,

        0,10,0,
        0,-10,0,
        -Math.cos(Math.PI/4)*10,0,Math.sin(Math.PI/4)*10

        /* (btw, meti rotação nas setas esq e dir só para dar para ver)*/
        /**--------- */
    ] );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    first_origami = new THREE.Mesh( geometry, material );
    gf.add(first_origami);

    scene.add(gf);
}

function createCamera() {
    'use strict';
    FixedPerspCamera = new THREE.PerspectiveCamera(70,
                                            window.innerWidth / window.innerHeight,
                                            1,
                                            1000);
    FixedPerspCamera.position.x = 70;
    FixedPerspCamera.position.y = 70;
    FixedPerspCamera.position.z = 70;
    FixedPerspCamera.lookAt(scene.position);

    var aspectRatio = window.innerWidth/window.innerHeight;
	
    if(aspectRatio > cameraRatio) {
        FrontalCamera = new THREE.OrthographicCamera(height*aspectRatio / (-2), 
                                        height*aspectRatio/ (2), 
                                        height / 2, 
                                        height / (-2),
                                        1,
                                        1000);
    }
    else{
        FrontalCamera = new THREE.OrthographicCamera(
                                        width / (-2), 
                                        width / (2), 
                                        (width/aspectRatio) / 2, 
                                        (width/aspectRatio) / (-2),
                                        1,
                                        1000);
    }
    FrontalCamera.position.x = 0;
    FrontalCamera.position.y = 0;
    FrontalCamera.position.z = 100;
    FrontalCamera.lookAt(scene.position);

    MobilePerspCamera = new THREE.PerspectiveCamera(70,
                                            window.innerWidth / window.innerHeight,
                                            1,
                                            1000);
    MobilePerspCamera.position.set(
        (1.8*R)*Math.sin(fi+Math.PI/10)*Math.cos(teta),
        (1.8*R)*Math.cos(fi+Math.PI/10),
        (1.8*R)*Math.sin(fi+Math.PI/10)*Math.sin(teta));
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
    }
}

function onKeyUp(e) {
    'use strict';
    
    switch (e.keyCode) {
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
    } 
    
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        FixedPerspCamera.aspect = window.innerWidth / window.innerHeight;
        FixedPerspCamera.updateProjectionMatrix();
        MobilePerspCamera.aspect = window.innerWidth / window.innerHeight;
        MobilePerspCamera.updateProjectionMatrix();
        
        var newAspectRatio = window.innerWidth/window.innerHeight;
		if (newAspectRatio > cameraRatio){
			FrontalCamera.left = (height * newAspectRatio)/(-2);
			FrontalCamera.right = (height * newAspectRatio)/2;
			FrontalCamera.bottom = (height)/(-2);
			FrontalCamera.top = (height)/2;			
		}
		else{
			FrontalCamera.left = (width)/(-2);
			FrontalCamera.right = (width)/2;
			FrontalCamera.bottom = (width/ newAspectRatio)/(-2);
			FrontalCamera.top = (width/ newAspectRatio)/2;
		}
        FrontalCamera.updateProjectionMatrix();

    }


}



function movement(deltaTime){
    const angle = deltaTime * 4;
    const vel = deltaTime * 8;
    if(left == true){
        first_origami.rotateY(-angle);
    }
    if(right == true){
        first_origami.rotateY(angle);
    }

}

function render() {
    'use strict';
    if(cameraInUse == 1)
        renderer.render(scene, FrontalCamera);
    else if(cameraInUse == 2)
        renderer.render(scene, FixedPerspCamera);
    else if(cameraInUse == 3)
        renderer.render(scene, MobilePerspCamera);
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
    
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    let deltaTime = clock.getDelta();


    movement(deltaTime);

    
    render();
    
    requestAnimationFrame(animate);
}