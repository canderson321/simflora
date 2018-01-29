//Object prototype for chunk of tree
function Section(group, mesh, branchTime) {
	this.group = group;
	this.mesh = mesh;
	this.childSections = [];
	this.timestamp = Date.now();
	this.branchTime = branchTime;
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
	this.treeObject = new THREE.Group();
	console.log(this.treeObject);
	this.treeObject.add(trunkMesh);

	this.trunk = new Section(this.treeObject, trunkMesh, 5);

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
		var branch = new Section(branchGroup, branchMesh, 2);
		branch.length = 0;

		parentSection.childSections.push(branch);
		this.branches.push(branch);

		//manipulate position and rotation
		var eu = rotateAndTilt(Math.random() * 25 + 25, Math.random() * 360);
		branchGroup.quaternion.setFromEuler(eu);
		branchGroup.position.y = parentSection.length;


	};
	
	var depth = 0;
	var maxDepth = 6;
//this should allow us to setup different rules for different mesh types, triggering on different conditions, but the time stuff is
	this.updateSection = function(section) {
		depth++;
		var age = (Date.now() - section.timestamp + 1)/1000;
		
		section.length = Math.log(age / section.branchTime + 1) / depth;
		
		//section.length = age*.1;
		section.mesh.scale.set(section.length, section.length, section.length);
		
		if (section.childSections.length === 0 && depth < maxDepth) {
			this.newBranch(section);
		};


		if (age > section.branchTime && section.childSections.length === 1 && depth < maxDepth) {
			this.newBranch(section);
			this.newBranch(section);
		};
		
		var self = this;
		section.childSections.forEach(function(childSection) {
			childSection.group.position.y = section.length;
			self.updateSection(childSection);
		});
		depth--;
	};

};


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
		birch.updateSection(birch.trunk);
		birch.treeObject.rotation.y += 0.03;
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	};
	animate();
});
