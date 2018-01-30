function rotateAndTilt(x, y) {
	return new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ');
};

function BirchPart(parentPart) {
	this.childParts = [];
	this.timestamp = Date.now();
	this.group = new THREE.Group();
	this.mesh;

	this.terminalAge = 2;
	this.straight = true;
	this.lengthFactor = 1;
	this.widthFactor = 0.65;
	
	this.type = "";

	if (parentPart === undefined) {
		this.level = 1;
	} else {
		this.level = parentPart.level + 1;
		parentPart.group.add(this.group);
		var minAngle = parentPart.minAngle;
		var maxAngle = parentPart.maxAngle;
		this.group.quaternion.setFromEuler(rotateAndTilt(Math.random() * (maxAngle-minAngle) + minAngle, Math.random() * 360));
	};

	var material;
	var geometry;
	if (this.level === 1) {
		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.terminalAge = 5;
		this.numChildren = 5;
		this.minAngle = 25;
		this.maxAngle = 50;
		this.lengthFactor = 0.8;
		this.type = "trunk";

	} else if (this.level < 5) {

		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.numChildren = 3
		this.minAngle = 25;
		this.maxAngle = 65;
		this.type = "branch";

	} else if (this.level === 5) {

		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.numChildren = 3;
		this.straight = true;
		this.minAngle = 90;
		this.maxAngle = 90;
		this.widthFactor = 0.5;
		this.type = "twig";

	} else {

		material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
		material.side = THREE.DoubleSide;

		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( -0.4, 0.2, 0.15 ) );
		geometry.vertices.push( new THREE.Vector3( 0, 1, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0.4, 0.2, 0.15 ) );

		geometry.faces.push( new THREE.Face3( 0, 1, 2 ) ); // counter-clockwise winding order
		geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
		geometry.translate(0, -0.5, 0);

		this.numChildren = 0;
		this.straight = false;
		this.type = "leaf";
		this.leafState = "grow";

	};
	geometry.translate(0, .5, 0);
	this.mesh = new THREE.Mesh(geometry, material);
	this.group.add(this.mesh);
};

BirchPart.prototype.update = function(time) {
	var age = (Date.now() - this.timestamp + 1)/1000;
	var growthFactor = Math.log(age / this.terminalAge + 1) / this.level;
	
	var heightFactor = this.lengthFactor;
	if (this.type === "leaf") {
		if (time.seasonRad > 5 * Math.PI / 4 && time.seasonRad < (7 * Math.PI / 4)) {
			this.timestamp = Date.now();
		}
	}
		
	
	this.mesh.scale.set(growthFactor * this.widthFactor, growthFactor * heightFactor, growthFactor * this.widthFactor);
	

	if (this.straight) {
		this.childParts.push(new BirchPart(this));
		this.straight = false;
	};

	while (age > this.terminalAge && this.childParts.length < this.numChildren && this.level <= 7) {
		this.childParts.push(new BirchPart(this));
	};

	var self = this;
	self.childParts.forEach(function(childPart) {
		childPart.group.position.y = growthFactor * heightFactor;
		childPart.update(time);
	});
};
