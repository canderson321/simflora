function rotateAndTilt(x, y) {
	return new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ');
};

function BirchPart(parentPart) {
	this.childParts = [];
	this.timestamp = Date.now();
	this.group = new THREE.Group();
	this.mesh;

	this.branchTime = 2;
	this.numBranches = 4;
	this.straight = true;
	this.minBranchAngle = 25;
	this.maxBranchAngle = 50;

	if (parentPart === undefined) {
		this.level = 1;
	} else {
		this.level = parentPart.level + 1;
		parentPart.group.add(this.group);
		var minAngle = parentPart.minBranchAngle;
		var maxAngle = parentPart.maxBranchAngle;
		this.group.quaternion.setFromEuler(rotateAndTilt(Math.random() * (maxAngle-minAngle) + minAngle, Math.random() * 360));
	};
	console.log(this.level);

	var material;
	var geometry;
	if (this.level === 0) {
		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.branchTime = 5;
		this.numBranches = 5;

	} else if (this.level < 5) {

		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.numBranches = 3
		this.minBranchAngle = 25;
		this.maxBranchAngle = 65;

	} else if (this.level === 5) {

		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.numBranches = 3;
		this.straight = true;
		this.minBranchAngle = 90;
		this.maxBranchAngle = 90;

	} else {

		material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
		material.side = THREE.DoubleSide;

		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( -0.2, 0.1, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, 0.5, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0.2, 0.1, 0 ) );

		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) ); // counter-clockwise winding order
		geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
		geometry.translate(0, -0.5, 0);

		this.numBranches = 0;
		this.straight = false;

	};
	geometry.translate(0, .5, 0);
	this.mesh = new THREE.Mesh(geometry, material);
	this.group.add(this.mesh);
};

BirchPart.prototype.update = function() {
	var age = (Date.now() - this.timestamp + 1)/1000;
	var growthFactor = Math.log(age / this.branchTime + 1) / this.level;

	this.mesh.scale.set(growthFactor, growthFactor, growthFactor);

	if (this.straight) {
		this.childParts.push(new BirchPart(this));
		this.straight = false;;
	};

	while (age > this.branchTime && this.childParts.length < this.numBranches && this.level < 7) {
		this.childParts.push(new BirchPart(this));
	};

	var self = this;
	self.childParts.forEach(function(childPart) {
		childPart.group.position.y = growthFactor;
		childPart.update();
	});
};
