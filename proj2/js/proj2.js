/*global THREE, requestAnimationFrame, console*/

var FixedPerspCamera, FrontalCamera, MobilePerspCamera, cameraInUse, v1R, v1L, v2R, v2L, v3R, v3L, left, up, right, down,front,back, scene, renderer, clock;
var dz,cz;
var width=200, height=130, cameraRatio = (width/height);
/**
 * teta = latitute
 * fi = longitude
 */
var fi = 2*Math.PI*Math.random();
var teta = 2*Math.PI*Math.random();
var oldfi = fi;
var oldteta = teta;
var anglefi, angleteta;
var g0, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12,g13,g14,g15,g16,g17,g18,g19,g20,g21,g22,g23,g24,g25,g26,g27, gf,rocket;
const R = 50,body_length = 3;
var geometry, material, mesh;
/**
 * disposição dos objetos -> não tem de estar ligados obrigatório hierarquia
 * grafo de cena -> só é obrigatório apresentar 3 objetos (aconselha se fazer para os mais dificeis)
 * movimentar -> d e c para mexer no eixo z
 * submeter no moodle
 */

class collObject extends THREE.Object3D {

    constructor(type){
        super();
        if(type == 0){
            this.self = this.createCube();
        }
        if(type == 1){
            this.self = this.createCylinder();
        }
        if(type == 2){
            this.self = this.createCone();
        }
        if(type == "Rocket"){
            this.self = this.createRocket();
        }
    }

    createCube() {
        'use strict';
    
        anglefi = 2*Math.PI*Math.random();
        angleteta = 2*Math.PI*Math.random();
    
        var cube = new THREE.Object3D();
        
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    
        geometry = new THREE.CubeGeometry(2.3, 2.3, 2.3);
        mesh = new THREE.Mesh(geometry, material);
        
        cube.add(mesh);
    
        cube.position.set(
            (1.2*R)*Math.sin(anglefi)*Math.cos(angleteta),
            (1.2*R)*Math.cos(anglefi),
            (1.2*R)*Math.sin(anglefi)*Math.sin(angleteta));
    
        gf.add(cube);
    
    }
    
    createCylinder() {
        'use strict';
        
        anglefi = 2*Math.PI*Math.random();
        angleteta = 2*Math.PI*Math.random();
    
        var cylinder = new THREE.Object3D();
        
        material = new THREE.MeshBasicMaterial({ color: 0xf0f8ff, wireframe: true });
    
        const radiusTop = 1.2;  // ui: radiusTop
        const radiusBottom = 1.2;  // ui: radiusBottom
        const height = 2.4;  // ui: height
        const radialSegments = 8;  // ui: radialSegments
    
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
       
        mesh = new THREE.Mesh(geometry, material);
        cylinder.add(mesh);
    
        cylinder.position.set(
            (1.2*R)*Math.sin(anglefi)*Math.cos(angleteta),
            (1.2*R)*Math.cos(anglefi),
            (1.2*R)*Math.sin(anglefi)*Math.sin(angleteta));
    
        gf.add(cylinder);
        
    }
    
    createCone() {
        'use strict';
    
        anglefi = 2*Math.PI*Math.random();
        angleteta = 2*Math.PI*Math.random();
        
        var cone = new THREE.Object3D();
        
        material = new THREE.MeshBasicMaterial({ color: 0x1260cc, wireframe: true });
    
        const radius = 1.2;  // ui: radius
        const height = 2.4;  // ui: height
        const radialSegments = 16;  // ui: radialSegments
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
       
        mesh = new THREE.Mesh(geometry, material);
        cone.add(mesh);
        
        cone.position.set(
            (1.2*R)*Math.sin(anglefi)*Math.cos(angleteta),
            (1.2*R)*Math.cos(anglefi),
            (1.2*R)*Math.sin(anglefi)*Math.sin(angleteta));
    
        gf.add(cone);
    
    }
    
    createRocket(){
        var body = new THREE.Object3D();
        var nose = new THREE.Object3D();
        var group1 = new THREE.Object3D();
        var group2 = new THREE.Object3D();
        var propellent1 = new THREE.Object3D();
        var propellent2 = new THREE.Object3D();
        var propellent3 = new THREE.Object3D();
        var propellent4 = new THREE.Object3D();
    
    
        const body_radius = 2;
        const propellent_radius = 1;
        const propellent_length = 1.7;
        const propellent_x = body_radius+propellent_radius/2;
        const propellent_y = -propellent_length/2-body_length/4;
        const propellent_z = body_radius+propellent_radius/2;
    
        material = new THREE.MeshBasicMaterial({ color: 0x256278, wireframe: true });
        geometry = new THREE.CylinderGeometry(propellent_radius,propellent_radius,propellent_length);
        mesh = new THREE.Mesh(geometry,material);
        propellent1.add(mesh);
        propellent1.position.set(propellent_x,propellent_y,propellent_z);
    
        mesh = new THREE.Mesh(geometry,material);
        propellent2.add(mesh);
        propellent2.position.set(-propellent_x,propellent_y,propellent_z);
    
        mesh = new THREE.Mesh(geometry,material);
        propellent3.add(mesh);
        propellent3.position.set(propellent_x,propellent_y,-propellent_z);
    
        mesh = new THREE.Mesh(geometry,material);
        propellent4.add(mesh);
        propellent4.position.set(-propellent_x,propellent_y,-propellent_z);
        
        group1.add(propellent1);
        group1.add(propellent2);
        group1.add(propellent3);
        group1.add(propellent4);
        material = new THREE.MeshBasicMaterial({ color: 0x47c6f5, wireframe: true });
     
        geometry = new THREE.CylinderGeometry(body_radius,body_radius,body_length);
        mesh = new THREE.Mesh(geometry,material);
        body.add(mesh);
    
        material = new THREE.MeshBasicMaterial({ color: 0xed8f2b, wireframe : true});
        geometry = new THREE.CylinderGeometry(0,body_radius,body_length/3);
        mesh = new THREE.Mesh(geometry,material);
        nose.add(mesh);
        nose.position.set(0,body_length/2+body_length/6,0);
    
        group2.add(body);
        group2.add(nose);
        group2.add(group1);
    
        group2.position.set(
                (1.2*R)*Math.sin(fi)*Math.cos(teta),
                (1.2*R)*Math.cos(fi),
                (1.2*R)*Math.sin(fi)*Math.sin(teta));
        group2.rotation.set(0,0,-Math.PI/2);
        gf.add(group2);
        return group2;
        
    }
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

    gf = new THREE.Object3D();
    createSphere(0,0,0,R,gf);
    rocket = new collObject("Rocket");

    for(let i = 0; i<20;i++){
        new collObject(Math.floor(Math.random()*3))
    }
    
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
        (1.5*R)*Math.sin(fi)*Math.cos(teta),
        (1.5*R)*Math.cos(fi),
        (1.5*R)*Math.sin(fi)*Math.sin(teta));
    MobilePerspCamera.lookAt(rocket.position);
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
        teta -= angle;
        
    }
    if(right == true){
        teta += angle;
        
    }
    if(down == true){
        fi += angle;
       
    }
    if(up == true){
        fi -= angle;
        
    }
    if(left == true || right == true || down == true || up == true){
        /*let direction = new THREE.Vector3(50*((1.2*R)*Math.sin(fi)*Math.cos(teta)-rocket.position.x),
                    50*((1.2*R)*Math.cos(fi)-rocket.position.y),
                    50*((1.2*R)*Math.sin(fi)*Math.sin(teta)-rocket.position.z));

        //direction.normalize();
        console.log(direction.x);
        console.log(direction.y);
        console.log(direction.z);
        rocket.lookAt(direction);*/

        rocket.self.position.set(
            (1.2*R)*Math.sin(fi)*Math.cos(teta),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta)
        )

        MobilePerspCamera.position.set(
            rocket.self.position.x - 10,
            rocket.self.position.y + 10,
            rocket.self.position.z //+ direction.z * 30
        );
        MobilePerspCamera.lookAt(rocket.self.position);
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