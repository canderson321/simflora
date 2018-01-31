function RootPart(parentPart) {
	this.childParts = [];
	this.timestamp = Date.now();
	this.group = new THREE.Group();
	this.mesh;

	this.straight = true;

	this.type = "";

	if (parentPart === undefined) {
		this.level = 1;
		this.terminalAge = 1;
		this.numChildren = 10;
		this.minAngle = 10;
		this.maxAngle = 80;

		this.type = "base";
	} else {
		this.level = parentPart.level + 1;
		parentPart.group.add(this.group);
		var minAngle = parentPart.minAngle;
		var maxAngle = parentPart.maxAngle;
		this.group.quaternion.setFromEuler(rotateAndTilt(Math.random() * (maxAngle-minAngle) + minAngle, Math.random() * 360));


		var material;
		var geometry;
		if (this.level < 4) {

			material = new THREE.MeshLambertMaterial( {color: 0xa89d81} );
			geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
			this.terminalAge = 7;
			this.numChildren = 2
			this.minAngle = 0;
			this.maxAngle = 35;
			this.lengthFactor = 1.3 * Math.random();
			this.widthFactor = 0.5;
			this.type = "root";

		} else {//if (this.level === 5) {

			material = new THREE.MeshLambertMaterial( {color: 0xa89d81} );
			geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
			this.terminalAge = 7;
			this.numChildren = 1;
			// this.straight = true;
			this.minAngle = 10;
			this.maxAngle = 30;
			this.lengthFactor = 1.8*Math.random();
			this.widthFactor = 0.5;
			this.type = "root";

		}// else {
		// 	material = new THREE.MeshLambertMaterial( {color: 0x992600} );
		// 	geometry = new THREE.CylinderGeometry(.014, .04, 0.5, 3, 1, true );
		// 	geometry.translate(0, 0.25, 0);
		// 	this.stem = new THREE.Mesh(geometry, material);
		//
		//
		// 	material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
		// 	material.side = THREE.DoubleSide;
		//
		// 	geometry = new THREE.Geometry();
		//
		// 	geometry.scale(1.0 / 12.0, 1.0 / 18.0, 1.0 / 12.0);
		// 	geometry.translate(0, -0.6, 0);
		//
		// 	// geometry = new THREE.Geometry();
		// 	// geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		// 	// geometry.vertices.push( new THREE.Vector3( -0.4, 0.2, 0.15 ) );
		// 	// geometry.vertices.push( new THREE.Vector3( 0, 1, 0 ) );
		// 	// geometry.vertices.push( new THREE.Vector3( 0.4, 0.2, 0.15 ) );
		//
		// 	// geometry.faces.push( new THREE.Face3( 0, 1, 2 ) ); // counter-clockwise winding order
		// 	// geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
		// 	// geometry.translate(0, -0.5, 0);
		//
		// 	this.numChildren = 0;
		// 	this.straight = false;
		// 	this.type = "clod";
		//
		// };
		geometry.translate(0, .5, 0);
		this.mesh = new THREE.Mesh(geometry, material);
		this.group.add(this.mesh);
	};
};

RootPart.prototype.update = function(time) {
	var age = (Date.now() - this.timestamp + 1)/1000;

	var heightFactor = this.lengthFactor;
	// if (this.type === "leaf") {
	// 	if (time.seasonRad > 5 * Math.PI / 4 && this.leafState === "grow") {
	// 		this.leafState = "fall";
	// 	} else if (time.seasonRad < (7 * Math.PI / 4) && time.leafState === "fall") {
	// 		this.timestamp = Date.now();
	// 		this.leafState = "grow"
	// 	}
	// }


	if (this.level > 1) {
		if (age < 60) {
			var growthFactor = Math.log(age/12+1) / (this.level + 1);
		} else {
			var growthFactor = Math.log(60/12+1) / (this.level + 1);
		};
		this.mesh.scale.set(growthFactor * this.widthFactor, growthFactor * heightFactor, growthFactor * this.widthFactor);
	};

	// if (this.straight) {
	// 	this.childParts.push(new RootPart(this));
	// 	this.straight = false;
	// };

	while (age > this.terminalAge && this.childParts.length < this.numChildren && this.level <= 5) {
		this.childParts.push(new RootPart(this));
	};

	var self = this;
	self.childParts.forEach(function(childPart) {
		childPart.update(time);
		// if (childPart.type === "leaf") {
		// 	if (childPart.leafState === "grow" || true) {
		// 		childPart.group.position.y = growthFactor * heightFactor;
		// 	} else {
		//
		// 		childPart.group.position += childPart.group.localToWorld( new THREE.Vector3( 0, -1, 0 ) );
		// 	}
		// } else {
			if (self.level > 1) childPart.group.position.y = growthFactor * heightFactor;
		// }
	});
};
