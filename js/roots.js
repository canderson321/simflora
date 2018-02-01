function RootPart(parentPart) {
	this.childParts = [];
	this.timestamp = Date.now();
	this.growth = .00001
	this.group = new THREE.Group();
	this.mesh;

	this.type = "";

	if (parentPart === undefined) {
		this.level = 1;
		this.budGrowth = 1;
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
			this.budGrowth = 7;
			this.numChildren = 2
			this.minAngle = 0;
			this.maxAngle = 30;
			this.lengthFactor = 1 * Math.random();
			this.widthFactor = 0.35;
			this.type = "root";

		} else {

			material = new THREE.MeshLambertMaterial( {color: 0xa89d81} );
			geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
			this.budGrowth = 7;
			this.numChildren = 1;
			this.minAngle = 10;
			this.maxAngle = 30;
			this.lengthFactor = 1.2*Math.random() + .1;
			this.widthFactor = 0.3;
			this.type = "rootlet";

		}
		geometry.translate(0, .5, 0);
		this.mesh = new THREE.Mesh(geometry, material);
		this.group.add(this.mesh);
	};
};

RootPart.prototype.update = function(time) {
	var timeDelta = time.delta/1000;
	var growthiness = Math.sin(Math.PI/8 + time.seasonRad) + .3;
	if (growthiness > 0) this.growth = this.growth + timeDelta*growthiness;

	var heightFactor = this.lengthFactor;

	var growthFactor = undefined;
	if (this.level > 1) {
		if (this.growth < 40) {
			growthFactor = Math.log(this.growth/12+1) / (this.level*1.2 + 1);
		} else {
			growthFactor = Math.log(40/12+1) / (this.level*1.2 + 1);
		};
		this.mesh.scale.set(growthFactor * this.widthFactor, growthFactor * heightFactor, growthFactor * this.widthFactor);
	};

	while (this.growth > this.budGrowth && this.childParts.length < this.numChildren && this.level <= 5) {
		this.childParts.push(new RootPart(this));
	};

	var self = this;
	self.childParts.forEach(function(childPart) {
		childPart.update(time);

			if (self.level > 1) childPart.group.position.y = growthFactor * heightFactor;

	});
};
