/*global THREE, requestAnimationFrame, console*/

var FixedPerspCamera, FrontalCamera, MobilePerspCamera, cameraInUse, v1R, v1L, v2R, v2L, v3R, v3L, left, up, right, down, scene, renderer, clock;
var dz,cz,toRemove=null;
var width=200, height=130, cameraRatio = (width/height);
/**
 * teta = latitute
 * fi = longitude
 */
var fi = 2*Math.PI*Math.random();
var teta = 2*Math.PI*Math.random();
var anglefi, angleteta;
var firstQ = new Array();
var secondQ = new Array();
var thirdQ = new Array();
var fourthQ = new Array();
var fifthQ = new Array();
var sixthQ = new Array();
var seventhQ = new Array();
var eighthQ = new Array();
var gf,rocket;
const R = 50,body_length = 3;
var geometry, material, mesh;

class collObject extends THREE.Object3D {

    constructor(type){
        super();
        if(type == 0){
            this.self = this.createCube();
            this.radius = 1.2;
        }
        if(type == 1){
            this.self = this.createCylinder();
            this.radius = 1.2;
        }
        if(type == 2){
            this.self = this.createCone();
            this.radius = 1.2;
        }
        if(type == "Rocket"){
            this.self = this.createRocket();
            this.radius = 2.5;
        }
    }

    createCube() {
        'use strict';
    
        anglefi = 2*Math.PI*Math.random();
        angleteta = 2*Math.PI*Math.random();
    
        var cube = new THREE.Object3D();
        
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    
        geometry = new THREE.BoxGeometry(2.3, 2.3, 2.3);
        mesh = new THREE.Mesh(geometry, material);
        
        cube.add(mesh);
    
        cube.position.set(
            (1.2*R)*Math.sin(anglefi)*Math.cos(angleteta),
            (1.2*R)*Math.cos(anglefi),
            (1.2*R)*Math.sin(anglefi)*Math.sin(angleteta));
    
        gf.add(cube);
        return cube;
    
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
        return cylinder;
        
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
        return cone;
    
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
        const propellent_radius = 0.8;
        const propellent_length = 1.7;
        const propellent_x = body_radius/1.5;
        const propellent_y = -propellent_length/2-body_length/4;
        const propellent_z = body_radius/1.5;
    
        material = new THREE.MeshBasicMaterial({ color: 0x32CD32, wireframe: true });
        geometry = new THREE.CapsuleGeometry(propellent_radius,propellent_radius,propellent_length);
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
        group2.add(new THREE.AxesHelper(10));
        let next_position = new THREE.Vector3(
            (1.2*R)*Math.sin(fi-Math.PI/10)*Math.cos(teta),
            (1.2*R)*Math.cos(fi-Math.PI/10),
            (1.2*R)*Math.sin(fi-Math.PI/10)*Math.sin(teta)
        );
        group2.lookAt(next_position);
        group2.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
        gf.add(group2);
        return group2;
    }

    hasColl(coll) {
        return distance(this.self.position, coll.self.position) < (this.radius + coll.radius);
    }

}

function createSphere(x, y, z, r, g) {
    'use strict';
    
    var sphere = new THREE.Object3D();
    sphere.userData = { jumping: true, step: 0 };

    const radius = r;  // ui: radius
    const widthSegments = 22;  // ui: widthSegments
    const heightSegments = 18;  // ui: heightSegments
    
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
    createSphere(0,0,0,R,gf);
    rocket = new collObject("Rocket");

    let aux;

    for(let i = 0; i<20;i++){
        aux = new collObject(Math.floor(Math.random()*3));
        if(aux.self.position.x + aux.radius >= 0 && aux.self.position.y + aux.radius >= 0 && aux.self.position.z + aux.radius >= 0){
            firstQ.push(aux);
        }
        if(aux.self.position.x + aux.radius >= 0 && aux.self.position.y + aux.radius >= 0 && aux.self.position.z - aux.radius < 0){
            secondQ.push(aux);
        }
        if(aux.self.position.x - aux.radius < 0 && aux.self.position.y + aux.radius >= 0 && aux.self.position.z - aux.radius <= 0){
            thirdQ.push(aux);
        }
        if(aux.self.position.x - aux.radius < 0 && aux.self.position.y + aux.radius >= 0 && aux.self.position.z + aux.radius > 0){
            fourthQ.push(aux);
        }
        if(aux.self.position.x + aux.radius >= 0 && aux.self.position.y - aux.radius < 0 && aux.self.position.z + aux.radius >= 0){
            fifthQ.push(aux);
        }
        if(aux.self.position.x + aux.radius >= 0 && aux.self.position.y - aux.radius < 0 && aux.self.position.z - aux.radius < 0){
            sixthQ.push(aux);
        }
        if(aux.self.position.x - aux.radius < 0 && aux.self.position.y - aux.radius < 0 && aux.self.position.z - aux.radius <= 0){
            seventhQ.push(aux);
        }
        if(aux.self.position.x - aux.radius < 0 && aux.self.position.y - aux.radius < 0 && aux.self.position.z + aux.radius > 0){
            eighthQ.push(aux);
        }
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
        (1.8*R)*Math.sin(fi+Math.PI/10)*Math.cos(teta),
        (1.8*R)*Math.cos(fi+Math.PI/10),
        (1.8*R)*Math.sin(fi+Math.PI/10)*Math.sin(teta));
    MobilePerspCamera.lookAt(rocket.self.position);
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

function detectCollisions(){
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z + rocket.radius >= 0){
        collisions(firstQ);
    }
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z - rocket.radius < 0){
        collisions(secondQ);
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z - rocket.radius <= 0){
        collisions(thirdQ);
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z + rocket.radius > 0){
        collisions(fourthQ);
    }
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z + rocket.radius >= 0){
        collisions(fifthQ);
    }
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z - rocket.radius < 0){
        collisions(sixthQ);
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z - rocket.radius <= 0){
        collisions(seventhQ);
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z + rocket.radius > 0){
        collisions(eighthQ);
    }
}

function collisions(collidableList){
    for (var i = 0; i < collidableList.length; i ++ ){
        if(rocket.hasColl(collidableList[i])){
            let correction_vector = new THREE.Vector3(
                rocket.self.position.x-collidableList[i].self.position.x,
                rocket.self.position.y-collidableList[i].self.position.y,
                rocket.self.position.z-collidableList[i].self.position.z
            );
            let current_dist = Math.sqrt(
                Math.pow(correction_vector.x,2)+
                Math.pow(correction_vector.y,2)+
                Math.pow(correction_vector.z,2));
            let wanted_dist = rocket.radius+collidableList[i].radius;
            toRemove = collidableList[i];
            correction_vector.normalize();
            correction_vector.x = correction_vector.x*Math.sqrt(wanted_dist-current_dist)
            correction_vector.y = correction_vector.y*Math.sqrt(wanted_dist-current_dist)
            correction_vector.z = correction_vector.z*Math.sqrt(wanted_dist-current_dist)
            rocket.self.translateOnAxis(correction_vector,wanted_dist-current_dist);                    
            rocket.self.position.normalize();
            rocket.self.position.x = rocket.self.position.x*1.2*R;
            rocket.self.position.y = rocket.self.position.y*1.2*R;
            rocket.self.position.z = rocket.self.position.z*1.2*R;
            collidableList.splice(i,1);
        }
    }
}

function clearCollisions(){
    if(toRemove!=null){
        gf.remove(toRemove.self);
        toRemove=null;
    }
}

function movement(deltaTime){

    const angle = deltaTime * 1;
    let collidableList;
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z + rocket.radius >= 0){
        collidableList = firstQ;
    }
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z - rocket.radius < 0){
        collidableList = secondQ;
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z - rocket.radius <= 0){
        collidableList = thirdQ;
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y + rocket.radius >= 0 && rocket.self.position.z + rocket.radius > 0){
        collidableList = fourthQ;
    }
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z + rocket.radius >= 0){
        collidableList = fifthQ;
    }
    if(rocket.self.position.x + rocket.radius >= 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z - rocket.radius < 0){
        collidableList = sixthQ;
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z - rocket.radius <= 0){
        collidableList = seventhQ;
    }
    if(rocket.self.position.x - rocket.radius < 0 && rocket.self.position.y - rocket.radius < 0 && rocket.self.position.z + rocket.radius > 0){
        collidableList = eighthQ;
    }

    
    if(left == true){
        teta += angle;
        next_position = new THREE.Vector3(
            (1.2*R)*Math.sin(fi)*Math.cos(teta+angle),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta+angle)
        
        );
        rocket.self.position.set(
            (1.2*R)*Math.sin(fi)*Math.cos(teta),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta)
        );
        for (var i = 0; i < collidableList.length; i ++ ){
            if(rocket.hasColl(collidableList[i])){
                toRemove = collidableList[i];
                let wanted_dist = rocket.radius+collidableList[i].radius;
                let correction_vector = new THREE.Vector3(
                    rocket.self.position.x-collidableList[i].self.position.x,
                    rocket.self.position.y-collidableList[i].self.position.y,
                    rocket.self.position.z-collidableList[i].self.position.z
                );
                let current_dist = Math.sqrt(
                    Math.pow(correction_vector.x,2)+
                    Math.pow(correction_vector.y,2)+
                    Math.pow(correction_vector.z,2));
                let correction_dist = wanted_dist - current_dist; 
                teta -= correction_dist/R;
                collidableList.splice(i,1);
            }
        }
        MobilePerspCamera.position.set(
            (1.8*R)*Math.sin(fi)*Math.cos(teta-Math.PI/10),
            (1.8*R)*Math.cos(fi),
            (1.8*R)*Math.sin(fi)*Math.sin(teta-Math.PI/10)
        );
        


    }
    if(right == true){
        teta -= angle;
        next_position = new THREE.Vector3(
            (1.2*R)*Math.sin(fi)*Math.cos(teta-angle),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta-angle)
        );
        rocket.self.position.set(
            (1.2*R)*Math.sin(fi)*Math.cos(teta),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta)
        );
        for (var i = 0; i < collidableList.length; i ++ ){
            if(rocket.hasColl(collidableList[i])){
                toRemove = collidableList[i];
                let wanted_dist = rocket.radius+collidableList[i].radius;
                let correction_vector = new THREE.Vector3(
                    rocket.self.position.x-collidableList[i].self.position.x,
                    rocket.self.position.y-collidableList[i].self.position.y,
                    rocket.self.position.z-collidableList[i].self.position.z
                );
                let current_dist = Math.sqrt(
                    Math.pow(correction_vector.x,2)+
                    Math.pow(correction_vector.y,2)+
                    Math.pow(correction_vector.z,2));
                let correction_dist = wanted_dist - current_dist;
                teta += correction_dist/R;
                collidableList.splice(i,1);
            }
        }
        MobilePerspCamera.position.set(
            (1.8*R)*Math.sin(fi)*Math.cos(teta+Math.PI/10),
            (1.8*R)*Math.cos(fi),
            (1.8*R)*Math.sin(fi)*Math.sin(teta+Math.PI/10)
        );
    }
    if(down == true){
        fi += angle;

        next_position = new THREE.Vector3(
            (1.2*R)*Math.sin(fi+angle)*Math.cos(teta),
            (1.2*R)*Math.cos(fi+angle),
            (1.2*R)*Math.sin(fi+angle)*Math.sin(teta)
        );
        rocket.self.position.set(
            (1.2*R)*Math.sin(fi)*Math.cos(teta),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta)
        );
        for (var i = 0; i < collidableList.length; i ++ ){
            if(rocket.hasColl(collidableList[i])){
                toRemove = collidableList[i];
                let wanted_dist = rocket.radius+collidableList[i].radius;
                let correction_vector = new THREE.Vector3(
                    rocket.self.position.x-collidableList[i].self.position.x,
                    rocket.self.position.y-collidableList[i].self.position.y,
                    rocket.self.position.z-collidableList[i].self.position.z
                );
                let current_dist = Math.sqrt(
                    Math.pow(correction_vector.x,2)+
                    Math.pow(correction_vector.y,2)+
                    Math.pow(correction_vector.z,2));
                let correction_dist = wanted_dist - current_dist;
                fi -= correction_dist/R;
                collidableList.splice(i,1);
            }
        }
        MobilePerspCamera.position.set(
            (1.8*R)*Math.sin(fi-Math.PI/10)*Math.cos(teta),
            (1.8*R)*Math.cos(fi-Math.PI/10),
            (1.8*R)*Math.sin(fi-Math.PI/10)*Math.sin(teta)
        );
    }
    if(up == true){
        fi -= angle;

        next_position = new THREE.Vector3(
            (1.2*R)*Math.sin(fi-angle)*Math.cos(teta),
            (1.2*R)*Math.cos(fi-angle),
            (1.2*R)*Math.sin(fi-angle)*Math.sin(teta)
        );
        rocket.self.position.set(
            (1.2*R)*Math.sin(fi)*Math.cos(teta),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta)
        );
        for (var i = 0; i < collidableList.length; i ++ ){
            if(rocket.hasColl(collidableList[i])){
                toRemove = collidableList[i];
                let wanted_dist = rocket.radius+collidableList[i].radius;
                let correction_vector = new THREE.Vector3(
                    rocket.self.position.x-collidableList[i].self.position.x,
                    rocket.self.position.y-collidableList[i].self.position.y,
                    rocket.self.position.z-collidableList[i].self.position.z
                );
                let current_dist = Math.sqrt(
                    Math.pow(correction_vector.x,2)+
                    Math.pow(correction_vector.y,2)+
                    Math.pow(correction_vector.z,2));
                let correction_dist = wanted_dist - current_dist;
                fi += correction_dist/R;
                collidableList.splice(i,1);
            }
        }
        MobilePerspCamera.position.set(
            (1.8*R)*Math.sin(fi+Math.PI/10)*Math.cos(teta),
            (1.8*R)*Math.cos(fi+Math.PI/10),
            (1.8*R)*Math.sin(fi+Math.PI/10)*Math.sin(teta)
        );
    }
    if(left == true || right == true || down == true || up == true){
        rocket.self.position.set(
            (1.2*R)*Math.sin(fi)*Math.cos(teta),
            (1.2*R)*Math.cos(fi),
            (1.2*R)*Math.sin(fi)*Math.sin(teta)
        );
        rocket.self.lookAt(next_position);
        rocket.self.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
        
        MobilePerspCamera.lookAt(rocket.self.position);
        
        
        if(up == true && Math.floor(((fi+Math.PI/3.799
        )/Math.PI))%2!=0){
            MobilePerspCamera.rotateZ(Math.PI);
        }
        if(down == true && Math.floor(((fi-Math.PI/3.799)/Math.PI))%2!=0){
            MobilePerspCamera.rotateZ(Math.PI);
        }
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

function update(){
    let deltaTime = clock.getDelta();
    clearCollisions();
    movement(deltaTime);
    
}

function animate() {
    'use strict';

    update();
    
    render();
    
    requestAnimationFrame(animate);
}