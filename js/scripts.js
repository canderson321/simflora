
//Get an Euler Rotation for a given x and y rotation
function rotateAndTilt(x, y) {
	return new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ');
}

//we'd make one of these constructors for every plant type
function Tree(Type) {

	this.trunk = new Type(0);


	//we'd make one of these for every type of obj eg trunk, branch, twig, leaf
	this.newBranch = function(parentPart) {

		var branch = new Type(parentPart.level + 1);
		parentPart.group.add(branch.group);
		parentPart.childParts.push(branch);
		var minAngle = parentPart.minBranchAngle;
		var maxAngle = parentPart.maxBranchAngle;

		//manipulate position and rotation
		branch.group.quaternion.setFromEuler(rotateAndTilt(Math.random() * (maxAngle-minAngle) + minAngle, Math.random() * 360));
		branch.group.position.y = parentPart.height;

	};

	var depth = 0;
//this should allow us to setup different rules for different mesh types, triggering on different conditions, but the time stuff is
	this.updateSection = function(part) {
		depth++;
		var age = (Date.now() - part.timestamp + 1)/1000;

		part.height = Math.log(age / part.branchTime + 1) / depth;

		part.mesh.scale.set(part.height, part.height, part.height);

		if (part.straight) {
			this.newBranch(part);
			part.straight = false;;
		};


		while (age > part.branchTime && part.childParts.length < part.numBranches && depth < 7) {
			this.newBranch(part);
		};

		var self = this;
		part.childParts.forEach(function(childSection) {
			childSection.group.position.y = part.height;
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
	camera.position.set(0, 3, 25);
	camera.lookAt(new THREE.Vector3(0, 5, 0));


	//setup scene
	var scene = new THREE.Scene();


	//Setting up lighting
	var light = new THREE.AmbientLight( 0x606060 );
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.rotation.x -= 35;
	directionalLight.rotation.y += 35;
	scene.add( directionalLight );
	scene.add( light );

	//Set up sun and moon light sources
	var sunGeometry = new THREE.SphereGeometry( .4, 16, 16 );
	var sunLight = new THREE.PointLight( 0xffffee, 1, 100, 2 );
	var sunMaterial = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	});
	sunLight.add( new THREE.Mesh( sunGeometry, sunMaterial ));
	sunLight.position.set( 0, 10, 0 );
	sunLight.castShadow = true;
	scene.add( sunLight );

	var moonGeometry = new THREE.SphereGeometry( .2 )
	var moonLight = new THREE.PointLight( 0x9badff, 1, 100, 2 )
	var moonMaterial = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: .2,
		color: 0x000000
	});
	moonLight.add( new THREE.Mesh( moonGeometry, moonMaterial ));
	moonLight.position.set( 0, -10, 0 );
	scene.add( moonLight );

	//make sun clickable
	var domEvents   = new THREEx.DomEvents(camera, renderer.domElement)
	var sunClicked = false;
	domEvents.addEventListener(sunLight, 'click', function(event) {
		if (sunClicked === false) {
			sunClicked = true;
		} else {
			sunClicked = false;
		}
	})

	//add mouse control
	var controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );


	//make new birch object, add it's trunk mesh to scene
	var tree = new Tree(BirchPart);
	scene.add(tree.trunk.group);

	//make lathe
	var topPoints = [];
	for ( var i = 10; i >= 0; i-- ) {
		topPoints.push(new THREE.Vector2(i, Math.cos(Math.PI/20*i)));
	}
	var bottomPoints = [];
	for ( var i = 0; i <= 10; i++ ) {
		bottomPoints.push(new THREE.Vector2(i, -2*(1+Math.cos(Math.PI/10*i))));
	}
	var topGeometry = new THREE.LatheGeometry( topPoints );
	topGeometry.computeFaceNormals();
	topGeometry.computeVertexNormals();
	var bottomGeometry = new THREE.LatheGeometry( bottomPoints );

	var topMaterial = new THREE.MeshLambertMaterial( { color: 0xa1ba32 } );
	var bottomMaterial = new THREE.MeshLambertMaterial( { color: 0x917054 } );
	var top = new THREE.Mesh( topGeometry, topMaterial );
	// var helper = new THREE.FaceNormalsHelper(top, 2, 0x00ff00, 1 );
	// var helper = new THREE.VertexNormalsHelper(top, 2, 0x00ff00, 1 );


	var bottom = new THREE.Mesh( bottomGeometry, bottomMaterial );

	var soil = new THREE.Group();
	soil.add(top);
	soil.add(bottom);
	soil.scale.set(.3, .3, .3)
	scene.add( soil );
	// scene.add(helper);

	//setup animation loop
	var t = 0;
	function animate() {
		tree.updateSection(tree.trunk);
		tree.trunk.group.rotation.y += 0.005;
		requestAnimationFrame(animate);
		renderer.render(scene, camera);

		// if (sunClicked === true) {
			t += 0.01;
			light.intensity = Math.sin(t);
			sunLight.intensity = Math.sin(t) + .5;
			moonLight.intensity = -Math.sin(t) + .5;
			sunLight.position.x = 10*Math.cos(t) + 0;
			sunLight.position.y = 10*Math.sin(t) + 0;

			moonLight.position.x = -10*Math.cos(t) + 0;
			moonLight.position.y = -10*Math.sin(t) + 0;
		// }

	};
	animate();
});
