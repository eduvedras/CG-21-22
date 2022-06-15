/*global THREE, requestAnimationFrame, console*/

//import * as THREE from 'three';

var FixedPerspCamera, FrontalCamera, PauseCamera, VRCamera,VRPrespCamera, isPause = false, isFixedPerspCamera = true, isFrontalCamera = false, scene, pausescene, renderer, clock;
var width=200, height=130, cameraRatio = (width/height);
var first_origami, second_origami, third_origami;
var left1, left2, left3, right1, right2, right3, light = true;
var directionalLight, lightH1 = true, lightH2 = true, lightH3 = true, spotLight1, spotLight2, spotLight3,pause = false;
var isBasicMaterial = false, isLambertMaterial = false;
var geometry2, geometry3, materialList,materialCList,materialSList,materialC,materialS,pauseMaterial;
var cubeList = new Array();
var spotList = new Array();

var gcubes, gorigamis, gf, gpause;
var geometry, material, mesh;

function createCube(x, y, z, width, height, depth,g) {
    'use strict';

    var geometryC = new THREE.BoxGeometry(width, height, depth);
    var meshC = new THREE.Mesh(geometryC, materialC);

    meshC.receiveShadow = true;
    
    meshC.position.set(x,y,z);
    cubeList.push(meshC);
    g.add(meshC);
}

function spotlight(x,y,z,origami){
    var hol = new THREE.Object3D();
    var Hlight = new THREE.SpotLight( 0xffffff );
        
    var sphere = new THREE.Object3D();

    const radius = 1;  // ui: radius
    const widthSegments = 12;  // ui: widthSegments
    const heightSegments = 8;  // ui: heightSegments
    
    //var materialS = new THREE.MeshPhongMaterial({ color: 0xffffc2});
    var geometryS = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    var meshS = new THREE.Mesh(geometryS, materialS);
    spotList.push(meshS);

    meshS.castShadow = true;
    
    sphere.add(meshS);
    
    hol.add(sphere);

    var cone = new THREE.Object3D();

    const height = 1;  // ui: height
    const radialSegments = 16;  // ui: radialSegments
    geometryS = new THREE.ConeGeometry(radius, height, radialSegments);
    meshS = new THREE.Mesh(geometryS, materialS);
    spotList.push(meshS);
    cone.add(meshS);

    meshS.castShadow = true;
    
    cone.rotateX(3*Math.PI/4);
    cone.position.set(0,-0.8,0.8);

    hol.add(cone);

    hol.position.set(x,y + 1,z - 1);

    Hlight.position.set(x,y+2,z - 2);
    
    //Hlight.target = origami;
    Hlight.target.position.set(origami.position.x, 11, origami.position.z);
    Hlight.target.updateMatrixWorld();

    gorigamis.add( Hlight );

    gorigamis.add(hol);

    return Hlight;
}

function createPauseScene(){
    pausescene = new THREE.Scene();
    geometry = new THREE.PlaneGeometry(width/4, height/4);

    var pauseTextureUrl = "https://cld.pt/dl/download/dc42ff37-1e80-4535-aecb-1f2980cb894a/Group%2020.png";
    pauseMaterial = new THREE.MeshBasicMaterial();

    var onLoadMaterial = function (texture){
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        pauseMaterial.map = texture;
        pauseMaterial.needsUpdate = true;
    }
    
    var pauseLoader = new THREE.TextureLoader();
    pauseLoader.load(pauseTextureUrl,onLoadMaterial);
    gpause = new THREE.Mesh(geometry, pauseMaterial);
    //gpause.visible = false;

    //pausescene.add(scene);
    pausescene.add(gpause);

}



function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxesHelper(10));

    gcubes = new THREE.Object3D();
    gorigamis = new THREE.Object3D();
    gf = new THREE.Object3D();
    gpause = new THREE.Object3D();

    materialCList = [new THREE.MeshPhongMaterial({    
                            color: "brown",
                            //map: new THREE.TextureLoader().load("https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png"),
                            side: THREE.DoubleSide, }),
                    new THREE.MeshLambertMaterial({
                            color: "brown",
                            //map: new THREE.TextureLoader().load("https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png"),
                            side: THREE.DoubleSide,}),
                    new THREE.MeshBasicMaterial({
                            color: "brown",
                            //map: new THREE.TextureLoader().load("https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png"),
                            side: THREE.DoubleSide, }),    
    ]

    materialC = materialCList[0];

    materialSList = [new THREE.MeshPhongMaterial({    
                            color: "yellow",
                            //map: new THREE.TextureLoader().load("https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png"),
                            side: THREE.DoubleSide, }),
                    new THREE.MeshLambertMaterial({
                            color: "yellow",
                            //map: new THREE.TextureLoader().load("https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png"),
                            side: THREE.DoubleSide,}),
                    new THREE.MeshBasicMaterial({
                            color: "yellow",
                            //map: new THREE.TextureLoader().load("https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png"),
                            side: THREE.DoubleSide, }),
    ]

    materialS = materialSList[0];

    //Aqui temos q inserir o objeto de pausa
    /*geometry = new THREE.PlaneGeometry(width/4, height/4);

    var pauseTextureUrl = "https://cld.pt/dl/download/dc42ff37-1e80-4535-aecb-1f2980cb894a/Group%2020.png";
    pauseMaterial = new THREE.MeshBasicMaterial();

    var onLoadMaterial = function (texture){
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        pauseMaterial.map = texture;
        pauseMaterial.needsUpdate = true;
    }
    
    var pauseLoader = new THREE.TextureLoader();
    pauseLoader.load(pauseTextureUrl,onLoadMaterial);
    gpause = new THREE.Mesh(geometry, pauseMaterial);
    gpause.visible = false;

    gf.add(gpause);*/

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
    
    /**
     * padrão 1: https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png
     * padrão 2: https://cld.pt/dl/download/7158693d-c818-4eac-b18a-c6fd9913c5d0/padrao2.jpg
     * padrão 3: https://cld.pt/dl/download/54b8cffb-b1d2-4017-8092-c6749c741f3c/padrao3.jpg
     */
    
    materialList = [new THREE.MeshPhongMaterial({    
                            color: "white",
                            side: THREE.DoubleSide, }),
                    new THREE.MeshLambertMaterial({
                            color: "white",
                            side: THREE.DoubleSide, }),
                    new THREE.MeshBasicMaterial({
                            color: "white",
                            //map: new THREE.TextureLoader().load("https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png"),
                            side: THREE.DoubleSide, }),
                ]
    
    var url1 = "https://cld.pt/dl/download/79429ddb-9e8f-497e-82f8-6bbeeed8cd8c/padrao1.png";
    var url2 = "https://cld.pt/dl/download/7158693d-c818-4eac-b18a-c6fd9913c5d0/padrao2.jpg";
    var url3 = "https://cld.pt/dl/download/54b8cffb-b1d2-4017-8092-c6749c741f3c/padrao3.jpg";
    material = materialList[0];
    var onLoad1 = function (texture){
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.05,0.05);
        materialList[0].map = texture;
        materialList[0].needsUpdate = true;
        materialList[1].map = texture;
        materialList[1].needsUpdate = true;
        materialList[2].map = texture;
        materialList[2].needsUpdate = true;
    }
    
    var loader1 = new THREE.TextureLoader();
    loader1.load(url1,onLoad1);

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
    geometry.setAttribute( 'uv', new THREE.BufferAttribute( vertices, 3 ));
    geometry.computeVertexNormals();
    first_origami = new THREE.Mesh( geometry, material );
    first_origami.position.set(-12,-5,0);
    first_origami.castShadow = true;
    first_origami.receiveShadow = true;
    gorigamis.add(first_origami);

    geometry2 = new THREE.BufferGeometry();

    var vertices2 = new Float32Array( [

        /**Triangulo da cima direita */
        0,-15.3,0,
        Math.cos(Math.PI/4)*3.3,1.4,Math.sin(Math.PI/4)*3.3,
        0,4.7,0,
        /**--------- */

        /**Triangulo da cima esquerda */
        0,-15.3,0,
        -Math.cos(Math.PI/4)*-3.3,1.4,Math.sin(Math.PI/4)*-3.3,
        0,4.7,0,
        /**--------- */

        /**Triangulo da meio direita */
        //0,0,0,
        0.22,0,-0.2,
        Math.cos(Math.PI/4)*3.3,1.4,Math.sin(Math.PI/4)*3.3,
        0,-15.3,0,
        /**--------- */

        /**Triangulo da meio esquerda */
        0.22,0,0.2,
        -Math.cos(Math.PI/4)*-3.3,1.4,Math.sin(Math.PI/4)*-3.3,
        0,-15.3,0,
        /**--------- */

        /**Triangulo da baixo direita */
        0.22,0,-0.2,
        Math.cos(Math.PI/4.5)*2.8,-1.2,Math.sin(Math.PI/4.5)*2.8,
        0,-15.3,0,
        /**--------- */

        /**Triangulo da baixo esquerda */
        0.22,0,0.2,
        -Math.cos(Math.PI/4.5)*-2.8,-1.2,Math.sin(Math.PI/4.5)*-2.8,
        0,-15.3,0,
        /**--------- */

        /*Triangulo de tras*/
        0,-1.2,0,
        -Math.cos(Math.PI/3.6)*-2.8,-1.2,Math.sin(Math.PI/3.6)*-2.8,
        0,-15.3,0,

        /*Triangulo de tras*/
        0,-1.2,0,
        Math.cos(Math.PI/3.8)*2.8,-1.2,Math.sin(Math.PI/3.8)*2.8,
        0,-15.3,0,


    ] );
    geometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices2, 3 ) );
    geometry2.setAttribute( 'uv', new THREE.BufferAttribute( vertices2, 3 ));
    geometry2.computeVertexNormals();
    
    second_origami = new THREE.Mesh( geometry2, material );
    second_origami.castShadow = true;
    second_origami.receiveShadow = true;
    gorigamis.add(second_origami);

    geometry3 = new THREE.BufferGeometry();

    var vertices3 = new Float32Array( [

        /**Trapezio de baixo */
        0,0,0,
        0,0,9.9,
        -Math.sin(Math.PI/8)*-3.35,Math.cos(Math.PI/8)*-3.35,6.6,

        0,0,0,
        -Math.sin(Math.PI/8)*-2.4,Math.cos(Math.PI/8)*-2.4,1.5,
        -Math.sin(Math.PI/8)*-3.35,Math.cos(Math.PI/8)*-3.35,6.6,

        /**--------- */

        0,0,0,
        0,0,9.9,
        -Math.sin(-Math.PI/8)*-3.35,Math.cos(-Math.PI/8)*-3.35,6.6,

        0,0,0,
        -Math.sin(-Math.PI/8)*-2.4,Math.cos(-Math.PI/8)*-2.4,1.5,
        -Math.sin(-Math.PI/8)*-3.35,Math.cos(-Math.PI/8)*-3.35,6.6,

        /**--------- */

        /**Trapezio do meio */
        0,0,0,
        0.5,0,5.25,
        -Math.sin(Math.PI/8)*-2.4,Math.cos(Math.PI/8)*-2.4,1.5,

        0.5,0,5.25,
        -Math.sin(Math.PI/8)*-2.4,Math.cos(Math.PI/8)*-2.4,1.5,
        -Math.sin(Math.PI/8)*-3.35,Math.cos(Math.PI/8)*-3.35,6.6,

        /**-------- */

        /**Trapezio do meio */
        0,0,0,
        -0.5,0,5.25,
        -Math.sin(-Math.PI/8)*-2.4,Math.cos(-Math.PI/8)*-2.4,1.5,

        -0.5,0,5.25,
        -Math.sin(-Math.PI/8)*-2.4,Math.cos(-Math.PI/8)*-2.4,1.5,
        -Math.sin(-Math.PI/8)*-3.35,Math.cos(-Math.PI/8)*-3.35,6.6,

        /**-------- */

        /**Trapezio de fora */
        0,0,0,
        0.5,0,5.25,
        -Math.sin(Math.PI/7)*-2.4,Math.cos(Math.PI/7)*-2.4,1.5,

        0.5,0,5.25,
        -Math.sin(Math.PI/7)*-2.4,Math.cos(Math.PI/7)*-2.4,1.5,
        -Math.sin(Math.PI/7)*-2.85,Math.cos(Math.PI/7)*-2.85,4,

        /**-------- */
        0,0,0,
        -0.5,0,5.25,
        -Math.sin(-Math.PI/7)*-2.4,Math.cos(-Math.PI/7)*-2.4,1.5,

        -0.5,0,5.25,
        -Math.sin(-Math.PI/7)*-2.4,Math.cos(-Math.PI/7)*-2.4,1.5,
        -Math.sin(-Math.PI/7)*-2.85,Math.cos(-Math.PI/7)*-2.85,4,

        /**----------- */

        /** Pescoco */
        0,0,0,
        -Math.sin(Math.PI/7)*-2.4,Math.cos(Math.PI/7)*-2.4,1.5,
        Math.sin(Math.PI/20)*2.9,5.8,Math.cos(Math.PI/20)*2.9,

        0,0,0,
        Math.sin(Math.PI/20)*2.9,5.8,Math.cos(Math.PI/20)*2.9,
        0,6.25,2.25,

        /**-------- */

        0,0,0,
        -Math.sin(-Math.PI/7)*-2.4,Math.cos(-Math.PI/7)*-2.4,1.5,
        Math.sin(-Math.PI/20)*2.9,5.8,Math.cos(-Math.PI/20)*2.9,

        0,0,0,
        Math.sin(-Math.PI/20)*2.9,5.8,Math.cos(-Math.PI/20)*2.9,
        0,6.25,2.25,

        /** cabeca */
        /**------- */
        0,3.7,0.5,
        0,6.25,2.25,
        Math.sin(Math.PI/20)*2.9,5.8,Math.cos(Math.PI/20)*2.9,

        0,3.7,0.5,
        0,6.25,2.25,
        Math.sin(-Math.PI/20)*2.9,5.8,Math.cos(-Math.PI/20)*2.9,




    ] );
    geometry3.setAttribute( 'position', new THREE.BufferAttribute( vertices3, 3 ) );
    geometry3.setAttribute( 'uv', new THREE.BufferAttribute( vertices3, 3 ));
    geometry3.computeVertexNormals();
    
    third_origami = new THREE.Mesh( geometry3, material );
    third_origami.position.set(12,-9,0);
    third_origami.castShadow = true;
    third_origami.receiveShadow = true;
    gorigamis.add(third_origami);


    gorigamis.position.set(0,17,0);

    gf.add(gcubes);
    gf.add(gorigamis);

    spotLight1 = spotlight(-12,-17,14.5,first_origami);
    spotLight1.visible = true;
    spotLight1.castShadow = true;
    spotLight2 = spotlight(0,-17,14.5,second_origami);
    spotLight2.visible = true;
    spotLight2.castShadow = true;
    spotLight3 = spotlight(12,-17,14.5,third_origami);
    spotLight3.visible = true;
    spotLight3.castShadow = true;


    scene.add(gf);

    directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set(50,50,25);
    directionalLight.castShadow = true;
    directionalLight.visible = true;

    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -15;

    directionalLight.shadow.mapSize.width = 1000;
    directionalLight.shadow.mapSize.height = 1000;

    var directionHelper = new THREE.DirectionalLightHelper(directionalLight,3);
    scene.add(directionalLight);
    //scene.add(directionHelper);
    var directionHelper1 = new THREE.DirectionalLightHelper(spotLight1,3);
    //scene.add(directionHelper1);
    var directionHelper2 = new THREE.SpotLightHelper(spotLight2,3);
    //scene.add(directionHelper2);
    var helperS = new THREE.CameraHelper( directionalLight.shadow.camera );
    //scene.add( helperS );
    var helperS1 = new THREE.CameraHelper( spotLight1.shadow.camera );
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
    FixedPerspCamera.position.x = 30;
    FixedPerspCamera.position.y = 30;
    FixedPerspCamera.position.z = 30;
    FixedPerspCamera.lookAt(scene.position);

    var aspectRatio = window.innerWidth/window.innerHeight;
	
    if(aspectRatio > cameraRatio) {
        FrontalCamera = new THREE.OrthographicCamera(height*aspectRatio / (-3), 
                                        height*aspectRatio/ (3), 
                                        height / 3, 
                                        height / (-3),
                                        1,
                                        1000);
    }
    else{
        FrontalCamera = new THREE.OrthographicCamera(
                                        width / (-3), 
                                        width / (3), 
                                        (width/aspectRatio) / 3, 
                                        (width/aspectRatio) / (-3),
                                        1,
                                        1000);
    }
    FrontalCamera.position.x = 0;
    FrontalCamera.position.y = 0;
    FrontalCamera.position.z = 100;
    FrontalCamera.lookAt(scene.position);

    if(aspectRatio > cameraRatio) {
        PauseCamera = new THREE.OrthographicCamera(height*aspectRatio / (-3), 
                                        height*aspectRatio/ (3), 
                                        height / 3, 
                                        height / (-3),
                                        1,
                                        1000);
    }
    else{
        PauseCamera = new THREE.OrthographicCamera(
                                        width / (-3), 
                                        width / (3), 
                                        (width/aspectRatio) / 3, 
                                        (width/aspectRatio) / (-3),
                                        1,
                                        1000);
    }
    PauseCamera.position.x = 0;
    PauseCamera.position.y = 0;
    PauseCamera.position.z = 100;
    PauseCamera.lookAt(pausescene.position);
    

    VRPrespCamera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    VRPrespCamera.position.x = 15;
    VRPrespCamera.position.y = 15;
    VRPrespCamera.position.z = 15;
    VRPrespCamera.lookAt(scene.position);
    VRCamera = new THREE.StereoCamera();

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
    case 51://3
        reset();
        break;
    case 82: //R
    case 114: //r
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
    case 32: //Space
        if(isPause == false){
            isPause = true;
            //gpause.visible = true;
        }
        else{
            isPause = false;
            //gpause.visible = false;
        }
        break;
    case 83: //S
    case 115: //s
        if(isBasicMaterial == false){
            isBasicMaterial = true;
        }
        else{
            isBasicMaterial = false;
        }
        break;
    case 65: //A
    case 97: //a
        if(isLambertMaterial == true){
            isLambertMaterial = false;
        }
        else isLambertMaterial = true;
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
    if(left3 == true){
        third_origami.rotateY(-angle);
    }
    if(right3 == true){
        third_origami.rotateY(angle);
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
    if(lightH3 == true){
        spotLight3.visible = true;
    }
    if(lightH3 == false){
        spotLight3.visible = false;
    }
    if(isBasicMaterial == true){
        material = materialList[2];
        materialC = materialCList[2];
        materialS = materialSList[2];
    }
    else if(isLambertMaterial == true){
        material = materialList[1];
        materialC = materialCList[1];
        materialS = materialSList[1];
    }
    else{
        material = materialList[0];
        materialC = materialCList[0];
        materialS = materialSList[0];
    }
    first_origami.material = material;
    second_origami.material = material;
    third_origami.material = material;
    for(var i = 0; i < cubeList.length; i++){
       cubeList[i].material = materialC;
    }
    for(var j = 0; j < spotList.length; j++){
        spotList[j].material = materialS;
    }
}

function reset(){
    first_origami.rotation.set(0,0,0);
    second_origami.rotation.set(0,0,0);
    third_origami.rotation.set(0,0,0);
    lightH1 = true;
    lightH2 = true;
    lightH3 = true;
    light = true;
    //gpause.visible = false;
    //pause = false;
    isLambertMaterial = false;
    isBasicMaterial = false;
    material = materialList[0];
    materialC = materialCList[0];
    materialS = materialSList[0];
    isFixedPerspCamera = true
}

function render() {
    'use strict';
    renderer.autoClear = false;
    renderer.clear();
    if(renderer.xr.isPresenting){
        VRCamera.update(VRPrespCamera);
        renderer.render(scene,VRCamera.cameraL);
        renderer.render(scene, VRCamera.cameraR);
        return;
    }
    if(isFrontalCamera)
        renderer.render(scene, FrontalCamera);
    if(isFixedPerspCamera)
        renderer.render(scene, FixedPerspCamera);
    if(isPause){
        renderer.clearDepth();
        renderer.render(pausescene, PauseCamera);
    }
    
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
    document.body.appendChild( VRButton.createButton( renderer ) );

    renderer.xr.enabled = true;

    clock = new THREE.Clock(true);
   
    createScene();
    createPauseScene();
    createCamera();
    
    
    window.addEventListener("keypress", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function update(){
    

    lights();
    if(isPause){
        gpause.scale.set(0.5,0.5,0.5);
        gpause.position.set(0,0,95);
        gpause.lookAt(new THREE.Vector3(0,0,100));
        return;
    }
    let deltaTime = clock.getDelta();
    movement(deltaTime);
    
}

function animate() {
    'use strict';
    renderer.setAnimationLoop( function () {
        update();
        render();
    } );
}