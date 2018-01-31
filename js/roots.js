function RootPart(parentPart) {
	this.childParts = [];
	this.timestamp = Date.now();
	this.group = new THREE.Group();
	this.mesh;

	this.type = "";

	if (parentPart === undefined) {
		this.level = 1;
		this.terminalAge = 1;
		this.numChildren = 9;
		this.minAngle = 0;
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
			this.maxAngle = 30;
			this.lengthFactor = 1.2 * Math.random();
			this.widthFactor = 0.45;
			this.type = "root";

		} else {

			material = new THREE.MeshLambertMaterial( {color: 0xa89d81} );
			geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
			this.terminalAge = 7;
			this.numChildren = 1;
			this.minAngle = 10;
			this.maxAngle = 30;
			this.lengthFactor = 1.3*Math.random() + .1;
			this.widthFactor = 0.45;
			this.type = "rootlet";

		}
		geometry.translate(0, .5, 0);
		this.mesh = new THREE.Mesh(geometry, material);
		this.group.add(this.mesh);
	};
};

RootPart.prototype.update = function(time) {
	var age = (Date.now() - this.timestamp + 1)/1000;

	var heightFactor = this.lengthFactor;

	if (this.level > 1) {
		if (age < 40) {
			var growthFactor = Math.log(age/12+1) / (this.level + 1);
		} else {
			var growthFactor = Math.log(40/12+1) / (this.level + 1);
		};
		this.mesh.scale.set(growthFactor * this.widthFactor, growthFactor * heightFactor, growthFactor * this.widthFactor);
	};

	while (age > this.terminalAge && this.childParts.length < this.numChildren && this.level <= 5) {
		this.childParts.push(new RootPart(this));
	};

	var self = this;
	self.childParts.forEach(function(childPart) {
		childPart.update(time);

			if (self.level > 1) childPart.group.position.y = growthFactor * heightFactor;

	});
};
