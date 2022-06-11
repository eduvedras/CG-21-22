/*global THREE, requestAnimationFrame, console*/

//import * as THREE from 'three';

var FixedPerspCamera, FrontalCamera, isFixedPerspCamera = true, isFrontalCamera = false, scene, renderer, clock;
var width=200, height=130, cameraRatio = (width/height);
var first_origami, second_origami;
var left1, left2, left3, right1, right2, right3, light = true;
var directionalLight, lightH1 = true, lightH2 = true, lightH3 = true, spotLight1, spotLight2, spotLight3,pause = false;
var geometry, geometry2;

var gcubes, gorigamis, gf, gpause;
var geometry, material, mesh;

function createCube(x, y, z, width, height, depth, g) {
    'use strict';

    var cube = new THREE.Object3D();
    
    var materialC = new THREE.MeshLambertMaterial({ color: 0x00ff00,});

    var geometryC = new THREE.BoxGeometry(width, height, depth);
    var meshC = new THREE.Mesh(geometryC, materialC);

    meshC.receiveShadow = true;
    
    cube.add(meshC);

    cube.position.set(x,y,z);

    g.add(cube);
}

function spotlight(x,y,z,origami){
    var hol = new THREE.Object3D();
    var Hlight = new THREE.SpotLight( 0xffffff );
        
    var sphere = new THREE.Object3D();

    const radius = 1;  // ui: radius
    const widthSegments = 12;  // ui: widthSegments
    const heightSegments = 8;  // ui: heightSegments
    
    var materialS = new THREE.MeshPhongMaterial({ color: 0xff0000});
    var geometryS = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    var meshS = new THREE.Mesh(geometryS, materialS);

    meshS.castShadow = true;
    meshS.receiveShadow = true;
    
    sphere.add(meshS);
    
    hol.add(sphere);

    var cone = new THREE.Object3D();
    
    materialS = new THREE.MeshPhongMaterial({ color: 0x1260cc});

    const height = 1;  // ui: height
    const radialSegments = 16;  // ui: radialSegments
    geometryS = new THREE.ConeGeometry(radius, height, radialSegments);
   
    meshS = new THREE.Mesh(geometryS, materialS);
    cone.add(meshS);

    cone.rotateX(3*Math.PI/4);
    cone.position.set(0,-0.8,0.8);

    hol.add(cone);

    hol.position.set(x,y + 1,z - 1);

    Hlight.position.set(x,y+1,z-1);
    
    Hlight.target = origami;
    Hlight.target.updateMatrixWorld();

    gorigamis.add( Hlight );

    gorigamis.add(hol);

    return Hlight;
}



function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxesHelper(10));

    gcubes = new THREE.Object3D();
    gorigamis = new THREE.Object3D();
    gf = new THREE.Object3D();
    gpause = new THREE.Object3D();

    //Aqui temos q inserir o objeto de pausa
    createCube(20,20,20,10,10,10,gpause);
    gpause.visible = false;

    gf.add(gpause);

    createCube(0,0,0,20,30,30,gcubes);
    createCube(0,-5,20,20,20,10,gcubes);
    createCube(0,-10,30,20,10,10,gcubes);

    gcubes.position.set(0,-15,0);

    gcubes.scale.set(2,1,1);
    /**
     * Acho que para fazermos os origamis é suposto usarmos esta bufferGeometry 
     * (é aquela malha de triangulos que eles falam)
     */
    geometry = new THREE.BufferGeometry();

    //const texture = new THREE.TextureLoader();
    //const p1 = texture.load("js/padrao2.jpg"); 
    material = new THREE.MeshPhongMaterial({    color: "white",
                                                //map: new THREE.TextureLoader().load("js/padrao2.jpg"),
                                                side: THREE.DoubleSide, });
    //material = new THREE.MeshBasicMaterial({ color: 0xfa0e00});

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

    ] );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.computeVertexNormals();
    first_origami = new THREE.Mesh( geometry, material );
    first_origami.position.set(-12,-5,0);
    first_origami.castShadow = true;
    gorigamis.add(first_origami);

    geometry2 = new THREE.BufferGeometry();

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

    ] );
    geometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices2, 3 ) );
    geometry2.computeVertexNormals();
    second_origami = new THREE.Mesh( geometry2, material );
    second_origami.castShadow = true;
    gorigamis.add(second_origami);

    gorigamis.position.set(0,17,0);

    gf.add(gcubes);
    gf.add(gorigamis);

    spotLight1 = spotlight(-12,-17,14.5,first_origami);
    spotLight1.visible = true;
    spotLight1.castShadow = true;
    spotLight2 = spotlight(0,-17,14.5,second_origami);
    spotLight2.visible = true;
    spotLight2.castShadow = true;


    scene.add(gf);

    directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set(50,50,25);
    directionalLight.castShadow = true;
    directionalLight.visible = true;

    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 18;
    directionalLight.shadow.camera.bottom = -15;

    directionalLight.shadow.mapSize.width = 1000;
    directionalLight.shadow.mapSize.height = 1000;

    var directionHelper = new THREE.DirectionalLightHelper(directionalLight,3);
    scene.add(directionalLight);
    scene.add(directionHelper);
    var directionHelper1 = new THREE.DirectionalLightHelper(spotLight1,3);
    scene.add(directionHelper1);
    var directionHelper2 = new THREE.DirectionalLightHelper(spotLight2,3);
    scene.add(directionHelper2);
    //var helperS = new THREE.CameraHelper( directionalLight.shadow.camera );
    //scene.add( helperS );
    //var helperS1 = new THREE.CameraHelper( spotLight1.shadow.camera );
    //scene.add( helperS1 );
    var helperS2 = new THREE.CameraHelper( spotLight2.shadow.camera );
    scene.add( helperS2 );
}

function createCamera() {
    'use strict';
    FixedPerspCamera = new THREE.PerspectiveCamera(70,
                                            window.innerWidth / window.innerHeight,
                                            1,
                                            1000);
    FixedPerspCamera.position.x = 10;
    FixedPerspCamera.position.y = 50;
    FixedPerspCamera.position.z = 0;
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

}

function onKeyDown(e) {
    'use strict';
    
    switch (e.keyCode) {
    case 49: //1
        isFixedPerspCamera = true;
        isFrontalCamera = false;
        break;
    case 50: //2
        isFrontalCamera = true;
        isFixedPerspCamera = false;
        break;
    case 81: //Q
    case 113: //q
        left1 = true;
        break;
    case 87: //W
    case 119: //w
        right1 = true;
        break;
    case 69: //E
    case 101: //e
        left2 = true;
        break;
    case 82: //R
    case 114: //r
        if(pause == true){
            reset();
            break;
        }
        right2 = true;
        break;
    case 84: //T
    case 116: //t
        left3 = true;
        break;
    case 89: //Y
    case 121: //y
        right3 = true;
        break;
    case 68: //D
    case 100: //d
        if(light == false)
            light = true;
        else
            light = false;
        break;
    case 90: //Z
    case 122: //z
        if(lightH1 == false)
            lightH1 = true;
        else
            lightH1 = false;
        break;
    case 88: //X
    case 120: //x
        if(lightH2 == false)
            lightH2 = true;
        else
            lightH2 = false;
        break;
    case 67: //C
    case 99: //c
        if(lightH3 == false)
            lightH3 = true;
        else
            lightH3 = false;
        break;
    case 83: //S
        if(pause == false){
            pause = true;
            gpause.visible = true;
        }
        else{
            pause = false;
            gpause.visible = false;
        }
        break;
    }
}

function onKeyUp(e) {
    'use strict';
    
    switch (e.keyCode) {
        case 81: //Q
        case 113: //q
            left1 = false;
            break;
        case 87: //W
        case 119: //w
            right1 = false;
            break;
        case 69: //E
        case 101: //e
            left2 = false;
            break;
        case 82: //R
        case 114: //r
            right2 = false;
            break;
        case 84: //T
        case 116: //t
            left3 = false;
            break;
        case 89: //Y
        case 121: //y
            right3 = false;
            break;
    } 
    
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        FixedPerspCamera.aspect = window.innerWidth / window.innerHeight;
        FixedPerspCamera.updateProjectionMatrix();
        
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
    if(left1 == true){
        first_origami.rotateY(-angle);
    }
    if(right1 == true){
        first_origami.rotateY(angle);
    }
    if(left2 == true){
        second_origami.rotateY(-angle);
    }
    if(right2 == true){
        second_origami.rotateY(angle);
    }
}

function lights(){
    if(light == true){
        directionalLight.visible = true;
    }
    if(light == false){
        directionalLight.visible = false;
    }
    if(lightH1 == true){
        spotLight1.visible = true;
    }
    if(lightH1 == false){
        spotLight1.visible = false;
    }
    if(lightH2 == true){
        spotLight2.visible = true;
    }
    if(lightH2 == false){
        spotLight2.visible = false;
    }
    /*if(lightH3 == true){
        spotLight3.visible = true;
    }
    if(lightH3 == false){
        spotLight3.visible = false;
    }*/
}

function reset(){
    first_origami.rotation.set(0,0,0);
    second_origami.rotation.set(0,0,0);
    //third_origami
    lightH1 = true;
    lightH2 = true;
    lightH3 = true;
    light = true;
    gpause.visible = false;
    pause = false;
}

function render() {
    'use strict';
    if(isFrontalCamera)
        renderer.render(scene, FrontalCamera);
    if(isFixedPerspCamera)
        renderer.render(scene, FixedPerspCamera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock(true);
   
    createScene();
    createCamera();
    
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function update(){
    let deltaTime = clock.getDelta();

    if(pause == true){
        return;
    }
    else{
        lights();
        movement(deltaTime);
    }

}

function animate() {
    'use strict';
    update();
    render();
    
    requestAnimationFrame(animate);
}