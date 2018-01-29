
//Get an Euler Rotation for a given x and y rotation
function rotateAndTilt(x, y) {
	return new THREE.Euler( x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ' );
}

//Recursively builds tree out of 'stickObject's for 'n' iterations
function getTree(n, stickObject, branchScale) {
	
	//Parent will be the stick that other sticks stick out of
	var parent = stickObject.clone();
	
	if (n > 1) {
		
		//Getting child (branch) from next iteration, scaling down, and cloning twice
		var child1 = getTree(n-1, stickObject, branchScale);
		child1.scale.set(branchScale, branchScale, branchScale);
		var child2 = child1.clone();
		var child3 = child1.clone();
		var child4 = child1.clone();
		
		//Adding branches to parent
		parent.add(child1);
		parent.add(child2);
		parent.add(child3);
		parent.add(child4)
		
		//Manipulating child position and rotation
		var eu;
		eu = rotateAndTilt(Math.random() * 25 + 25, Math.random() * 360);
		child1.quaternion.setFromEuler(eu);
		child1.position.y += 1;
		
		eu = rotateAndTilt(Math.random() * 25 + 25, Math.random() * 360);
		child2.quaternion.setFromEuler(eu);
		child2.position.y += 1;
		
		eu = rotateAndTilt(Math.random() * 25 + 25, Math.random() * 360);
		child3.quaternion.setFromEuler(eu);
		child3.position.y += 1;
		
		eu = rotateAndTilt(Math.random() * 10 - 5, Math.random() * 360);
		child4.quaternion.setFromEuler(eu);
		child4.position.y += 1;
	}
	return parent;
}


function Graphics() {
	//Setting up scene
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.set(0, 0, 5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	var scene = new THREE.Scene();
	
	
	//Size of branch in relation to parent
	var branchScale = 0.7;
	
	//Creates a single 'stickObject' (cylinder) to build the tree out of
	var green = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
	var geometry = new THREE.CylinderGeometry( branchScale * 0.1, 0.1, 1, 3, 1, true );
	geometry.translate(0, 0.5, 0);
	var cylinder = new THREE.Mesh( geometry, green );
	
	//Building tree and adding it to the scene
	var tree = getTree(7, cylinder, branchScale);
	tree.position.y -= 1.5;
	scene.add( tree );
	
	//Setting up lighting
	var light = new THREE.AmbientLight( 0x606060 );
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.rotation.x -= 35;
	directionalLight.rotation.y += 35;
	scene.add( directionalLight );
	scene.add( light );

	//Animation Loop
	var self = this;
	Graphics.prototype.animate = function() {
		requestAnimationFrame( self.animate );
		renderer.render( scene, camera );
		tree.rotation.y += 0.003;
	}
}




