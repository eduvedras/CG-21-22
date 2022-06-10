/*global THREE, requestAnimationFrame, console*/

//import * as THREE from 'three';

var FixedPerspCamera, FrontalCamera, MobilePerspCamera, cameraInUse, v1R, v1L, v2R, v2L, v3R, v3L, left, up, right, down,front,back, scene, renderer, clock;
var dz,cz,toRemove=null;
var width=200, height=130, cameraRatio = (width/height);
var first_origami, second_origami;
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
var gcubes, gorigamis, gf;
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

function createCube(x, y, z, width, height, depth, g) {
    'use strict';

    var cube = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material);
    
    cube.add(mesh);

    cube.position.set(x,y,z);

    g.add(cube);
}



function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxesHelper(10));

    gcubes = new THREE.Object3D();
    gorigamis = new THREE.Object3D();
    gf = new THREE.Object3D();

    createCube(0,0,0,20,30,20,gcubes);
    createCube(0,-5,15,20,20,10,gcubes);
    createCube(0,-10,25,20,10,10,gcubes);

    gcubes.position.set(0,-15,0);

    gcubes.scale.set(2,1,1);
    /**
     * Acho que para fazermos os origamis é suposto usarmos esta bufferGeometry 
     * (é aquela malha de triangulos que eles falam)
     */
     var geometry = new THREE.BufferGeometry();

     const texture = new THREE.TextureLoader();
     const p1 = texture.load("./padrao2.jpg"); 
     material = new THREE.MeshStandardMaterial({ map: p1 });

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
    first_origami.position.set(-12,-5,0);
    gorigamis.add(first_origami);

    var geometry2 = new THREE.BufferGeometry();

    var vertices2 = new Float32Array( [

        /**Triangulo da cima direita */
        0,0,0,
        Math.cos(Math.PI/4)*3.3,1.4,Math.sin(Math.PI/4)*3.3,
        0,4.7,0,
        /**--------- */

        /**Triangulo da cima esquerda */
        0,0,0,
        -Math.cos(Math.PI/4)*-3.3,1.4,Math.sin(Math.PI/4)*-3.3,
        0,4.7,0,
        /**--------- */

        /**Triangulo da cima direita */
        0,4.7,0,
        Math.cos(Math.PI/4)*3.3,1.4,Math.sin(Math.PI/4)*3.3,
        0,0,0,
        /**--------- */

        /**Triangulo da cima esquerda */
        0,4.7,0,
        -Math.cos(Math.PI/4)*-3.3,1.4,Math.sin(Math.PI/4)*-3.3,
        0,0,0,
        /**--------- */



        /**Triangulo da meio direita */
        0,0,0,
        Math.cos(Math.PI/4)*3.3,1.4,Math.sin(Math.PI/4)*3.3,
        Math.cos(Math.PI/4)*2.8,-1.2,Math.sin(Math.PI/4)*2.8,
        /**--------- */

        /**Triangulo da meio esquerda */
        0,0,0,
        -Math.cos(Math.PI/4)*-3.3,1.4,Math.sin(Math.PI/4)*-3.3,
        -Math.cos(Math.PI/4)*-2.8,-1.2,Math.sin(Math.PI/4)*-2.8,
        /**--------- */

        /**Triangulo da meio direita */
        Math.cos(Math.PI/4)*2.8,-1.2,Math.sin(Math.PI/4)*2.8,
        Math.cos(Math.PI/4)*3.3,1.4,Math.sin(Math.PI/4)*3.3,
        0,0,0,
        /**--------- */

        /**Triangulo da meio esquerda */
        -Math.cos(Math.PI/4)*-2.8,-1.2,Math.sin(Math.PI/4)*-2.8,
        -Math.cos(Math.PI/4)*-3.3,1.4,Math.sin(Math.PI/4)*-3.3,
        0,0,0,
        /**--------- */


        /**Triangulo da baixo direita */
        0,0,0,
        Math.cos(Math.PI/4)*2.8,-1.2,Math.sin(Math.PI/4)*2.8,
        0,-15.3,0,
        /**--------- */

        /**Triangulo da baixo esquerda */
        0,0,0,
        -Math.cos(Math.PI/4)*-2.8,-1.2,Math.sin(Math.PI/4)*-2.8,
        0,-15.3,0,
        /**--------- */

        /**Triangulo da baixo direita */
        0,-15.3,0,
        Math.cos(Math.PI/4)*2.8,-1.2,Math.sin(Math.PI/4)*2.8,
        0,0,0,
        /**--------- */

        /**Triangulo da baixo esquerda */
        0,-15.3,0,
        -Math.cos(Math.PI/4)*-2.8,-1.2,Math.sin(Math.PI/4)*-2.8,
        0,0,0,
        /**--------- */

    ] );
    geometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices2, 3 ) );
    second_origami = new THREE.Mesh( geometry2, material );
    gorigamis.add(second_origami);

    gorigamis.position.set(0,17,0);

    gf.add(gcubes);
    gf.add(gorigamis);

    scene.add(gf);
}

function createCamera() {
    'use strict';
    FixedPerspCamera = new THREE.PerspectiveCamera(70,
                                            window.innerWidth / window.innerHeight,
                                            1,
                                            1000);
    FixedPerspCamera.position.x = 50;
    FixedPerspCamera.position.y = 50;
    FixedPerspCamera.position.z = 50;
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
        second_origami.rotateY(-angle);
    }
    if(right == true){
        second_origami.rotateY(angle);
    }

}

function render() {
    'use strict';
    if(cameraInUse == 2)
        renderer.render(scene, FrontalCamera);
    else if(cameraInUse == 1)
        renderer.render(scene, FixedPerspCamera);
    else if(cameraInUse == 3)
        renderer.render(scene, MobilePerspCamera);
    else
        renderer.render(scene, FixedPerspCamera);
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