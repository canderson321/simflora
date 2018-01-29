function Section(group, mesh, timestamp) {
	this.group = group;
	this.mesh = mesh;
	this.childSections = [];
	this.timestamp = timestamp;
	this.length = 0;
}

//Get an Euler Rotation for a given x and y rotation
function rotateAndTilt(x, y) {
	return new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ');
}

//we'd make one of these constructors for every plant type
function Birch() {
	var birchBark = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
	var geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
	geometry.translate(0, .5, 0);

	var trunkMesh = new THREE.Mesh(geometry, birchBark);
	trunkGroup = new THREE.Group();
	trunkGroup.add(trunkMesh);

	this.trunk = new Section(trunkGroup, trunkMesh, Date.now());

	this.branches = [];


//we'd make one of these for every type of obj eg trunk, branch, twig, leaf
	this.newBranch = function(parentSection) {
		var birchBark = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		var geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		geometry.translate(0, .5, 0);

		var branchMesh = new THREE.Mesh(geometry, birchBark);
		var branchGroup = new THREE.Group();
		branchGroup.add(branchMesh);

		parentSection.group.add(branchGroup);
		var branch = new Section(branchGroup, branchMesh, Date.now());
		branch.length = 0;

		parentSection.childSections.push(branch);
		this.branches.push(branch);

		//manipulate position and rotation
		var eu = rotateAndTilt(Math.random() * 25 + 25, Math.random() * 360);
		branchGroup.quaternion.setFromEuler(eu);
		branchGroup.position.y = parentSection.length;


	};

//this should allow us to setup different rules for different mesh types, triggering on different conditions, but the time stuff is
	this.trunkRules = function(trunk) {
		var age = (Date.now() - trunk.timestamp)/1000;
		trunk.length = age*.1;
		trunk.mesh.scale.set(trunk.length, trunk.length, trunk.length);

		trunk.childSections.forEach(function(childSection) {
			childSection.group.position.y = trunk.length;
		});

		if (age > 5 && trunk.childSections.length === 0) {
			this.newBranch(trunk);
			this.newBranch(trunk);
			this.newBranch(trunk);
		};
	};

	this.branchRules = function(branch) {
		var age = (Date.now() - branch.timestamp)/1000;
		branch.length = age*.1;
		branch.mesh.scale.set(branch.length, branch.length, branch.length);

		branch.childSections.forEach(function(childSection) {
			childSection.group.position.y = branch.length;
		});

		if (age > 2 && branch.childSections.length === 0) {
			this.newBranch(branch);
			this.newBranch(branch);
			this.newBranch(branch);
		};
	};
};

//funky, should be a method calling each of the rules for each member of each array of nodes
function applyRules(birch) {
	birch.trunkRules(birch.trunk);
	birch.branches.forEach(function(branch) {
		birch.branchRules(branch);
	});
};
// //check mesh objects against rules for that plant, recursively
// function applyRules(plant, group) {
// 	plant.rules(group);
// 	group.children.forEach(function(child) {
// 		//when you scale a parent it scales all children, so they all have to be divided by that scale to equilize
// 		child.scale.divide(group.scale);
// 		applyRules(plant, child);
// 	});
// };

$(document).ready(function() {

	//setup renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement);
	//setup camera
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 2, 20);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	//setup scene
	var scene = new THREE.Scene();
	//Setting up lighting
	var light = new THREE.AmbientLight( 0x606060 );
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.rotation.x -= 35;
	directionalLight.rotation.y += 35;
	scene.add( directionalLight );
	scene.add( light );

	//make new birch object, add it's trunk mesh to scene
	var birch = new Birch();
	scene.add(birch.trunk.group);

	//setup animation loop
	function animate() {
		requestAnimationFrame(animate);
		applyRules(birch);
		renderer.render(scene, camera);
	};
	animate();
});
