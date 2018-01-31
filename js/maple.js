function MaplePart(parentPart, type) {
	this.childParts = [];
	this.timestamp = Date.now();
	this.growth = 0.00001;
	this.group = new THREE.Group();
	this.mesh;

	this.straight = true;
	this.lengthFactor = 1;
	this.widthFactor = 0.65;

	this.type = type;
	if (type === "trunk") {
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
	if (type === "leaf") {
		this.level = 5;
		this.budGrowth = 5;
		material = new THREE.MeshLambertMaterial( {color: 0xb57566} );
		geometry = new THREE.CylinderGeometry(.014, .04, 0.5, 3, 1, true );
		geometry.translate(0, 0.25, 0);
		var stem = new THREE.Mesh(geometry, material);

		material = new THREE.MeshStandardMaterial( {color: 0x68ff03} );
		material.side = THREE.DoubleSide;

		geometry = new THREE.Geometry();

		geometry.vertices.push( new THREE.Vector3( 0, 24, 0 ) ); // 0
		geometry.vertices.push( new THREE.Vector3( 3, 18, 0 ) ); // 1
		geometry.vertices.push( new THREE.Vector3( 8, 20, 0 ) ); // 2
		geometry.vertices.push( new THREE.Vector3( 5, 14, 0 ) ); // 3
		geometry.vertices.push( new THREE.Vector3( 7, 10, 0 ) ); // 4
		geometry.vertices.push( new THREE.Vector3( 0, 11, 0 ) ); // 5

		geometry.vertices.push( new THREE.Vector3( -3, 18, 0 ) ); // 6
		geometry.vertices.push( new THREE.Vector3( -8, 20, 0 ) ); // 7
		geometry.vertices.push( new THREE.Vector3( -5, 14, 0 ) ); // 8
		geometry.vertices.push( new THREE.Vector3( -7, 10, 0 ) ); // 9

		geometry.faces.push( new THREE.Face3( 0, 4, 5 ) );
		geometry.faces.push( new THREE.Face3( 0, 5, 9 ) );
		geometry.faces.push( new THREE.Face3( 1, 2, 3 ) );
		geometry.faces.push( new THREE.Face3( 6, 8, 7 ) );

		geometry.scale(1 / 12.0, 1 / 18.0, 1 / 12.0);
		geometry.translate(0, -0.6, 0);

		this.numChildren = 0;
		this.lengthFactor = .6;
		this.widthFactor = 0.4;
		this.leafState = "grow";
		this.tweenRunning = false;

	} else if (this.level === 1) {
		material = new THREE.MeshLambertMaterial( {color: 0xa89d81} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 5, 1, true );
		this.budGrowth = 7;
		this.numChildren = 6;
		this.minAngle = 20;
		this.maxAngle = 60;
		this.lengthFactor = .6;
		this.widthFactor = .35;
		this.childParts.push(new MaplePart(this, undefined));
		this.childParts.push(new MaplePart(this, "leaf"));
		this.childParts.push(new MaplePart(this, "leaf"));
		this.group.position.y = .1;

	} else if (this.level < 6) {

		material = new THREE.MeshLambertMaterial( {color: 0xa89d81} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.budGrowth = 7;
		this.numChildren = 5;
		this.minAngle = 20;
		this.maxAngle = 60;
		this.lengthFactor = Math.random()*.6 + .3;
		this.widthFactor = .35;

		this.type = "branch";

		this.childParts.push(new MaplePart(this, "leaf"));
		this.childParts.push(new MaplePart(this, "leaf"));
	} else if (this.level === 6) {

		material = new THREE.MeshLambertMaterial( {color: 0xa89d81} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.budGrowth = 6;
		this.numChildren = 5;
		this.minAngle = 90;
		this.maxAngle = 90;
		this.lengthFactor = Math.random()*.6 + .3;
		this.widthFactor = 0.35;
		this.type = "twig";

		this.childParts.push(new MaplePart(this, "leaf"));
		this.childParts.push(new MaplePart(this, "leaf"));
	};

	geometry.translate(0, .5, 0);
	this.mesh = new THREE.Mesh(geometry, material);
	if (this.type === "leaf") {
		this.mesh.add(stem);
	};
	this.group.add(this.mesh);

};

MaplePart.prototype.update = function(time, lastTime) {

	var timeDelta = time.delta/1000;
	var growthiness = Math.sin(Math.PI/8 + time.seasonRad) + .3;
	if (growthiness > 0) this.growth = this.growth + timeDelta*growthiness;

	if (this.growth < 60) {
		var growthFactor = Math.log(this.growth/12+1) / (this.level*1.1 + 1);
	} else {
		growthFactor = Math.log(60/12+1) / (this.level*1.1 + 1);
	}

	var heightFactor = this.lengthFactor;
	if (this.type === "leaf") {

		if (time.currentSeason === "FA" && time.lastSeason === "SU") {
			if (!this.tweenRunning) {
				this.tween = new TWEEN.Tween(this.mesh.material.color).to({r: 0.85, g: 1, b: 0 }, 2000);
				var otherTween = new TWEEN.Tween(this.mesh.material.color).to({r: 1, g: 0.3984375, b: 0 }, 1000);
				this.tween.delay(Math.random() * 1000);

				var self = this;
				otherTween.onComplete(function(obj){
					self.leafState = "fall";
				});

				this.tween.chain(otherTween);

				this.tween.start();
				this.tweenRunning = true;
			}
		} else {
			this.tweenRunning = false;
		}

		if (time.currentSeason === "SP" && time.lastSeason === "WI" && this.leafState === "fall" ) {
			this.mesh.material.color.setHex(0x68ff03);
			this.leafState = "grow"
		}

		if(this.leafState === "fall") {
			this.growth = 0.000001;
		} else {
			this.mesh.scale.set(growthFactor * this.widthFactor, growthFactor * heightFactor, growthFactor * this.widthFactor);
		}


	} else {
		this.mesh.scale.set(growthFactor * this.widthFactor, growthFactor * heightFactor, growthFactor * this.widthFactor);

		while (this.growth > this.budGrowth && this.childParts.length < this.numChildren && this.level < 6) {
			this.childParts.push(new MaplePart(this, undefined));
		};


		var self = this;
		self.childParts.forEach(function(childPart) {
			if (childPart.type === "leaf" && childPart.leafState === "fall") {
				var vector = self.group.localToWorld( new THREE.Vector3( 0, -1, 0 ) );
				vector.normalize();
				childPart.group.position.x += vector.x * 0.005;
				childPart.group.position.y += vector.y * 0.005;
				childPart.group.position.z += vector.z * 0.005;
			} else {
				childPart.group.position.y = growthFactor * heightFactor;
				childPart.group.position.x = 0;
				childPart.group.position.z = 0;
			}
			childPart.update(time);
		});
	}

	this.group.updateMatrix();


};
