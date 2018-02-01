function Soil() {
	var topPoints = [];
	for ( var i = 10; i >= 0; i-- ) {
		topPoints.push(new THREE.Vector2(i, Math.cos(Math.PI/20*i)));
	}
	var bottomPoints = [];
	for ( var i = 0; i <= 10; i++ ) {
		bottomPoints.push(new THREE.Vector2(i, -2*(1+Math.cos(Math.PI/10*i))));
	}

	var geometry = new THREE.LatheGeometry( topPoints );
	var material = new THREE.MeshLambertMaterial( { color: 0x508552 } );
	this.top = new THREE.Mesh( geometry, material );

	var geometry = new THREE.LatheGeometry( bottomPoints );
	var material = new THREE.MeshLambertMaterial( { color: 0x917054 } );
	var bottom = new THREE.Mesh( geometry, material );

	this.group = new THREE.Group();
	this.group.add(this.top);
	this.group.add(bottom);

	var material = new THREE.MeshLambertMaterial( {color: 0x694f3a} );

	for (var i = 0; i < 90; i++) {
		var size = Math.random()*.7 + .25;
		var geometry = new THREE.BoxGeometry(size, size, size);
		var x = 1 + Math.random() * 6;
		geometry.translate(x, 0, 0);
		var clod = new THREE.Mesh(geometry, material);
		clod.position.y = -3*(1+Math.cos(Math.PI/10*x))*Math.random() - .4;
		clod.quaternion.setFromEuler(rotateAndTilt(Math.random() * 90, Math.random() * 360));
		this.group.add(clod);

	};


	var stoneMaterial = new THREE.MeshLambertMaterial( {color: 0x656b59} );
	var snowMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
	this.snowGroup = new THREE.Group();
	this.group.add(this.snowGroup);

	for (var i = 0; i < 8; i++) {
		var radius = Math.random() + .5;
		var stoneGeometry = new THREE.SphereGeometry(radius, 8, 8 );
		var snowGeometry = new THREE.SphereGeometry(radius*.8, 8, 8);

		var x = 2 + Math.random() * 6.5;
		stoneGeometry.translate(x, 0, 0);
		snowGeometry.translate(x, 0, 0);

		var stone = new THREE.Mesh( stoneGeometry, stoneMaterial );
		var snow = new THREE.Mesh(snowGeometry, snowMaterial);

		position = Math.cos(Math.PI/20*x);
		eu = rotateAndTilt(Math.random() * 90, Math.random() * 360);

		stone.position.y = position;
		snow.position.y = position;
		stone.quaternion.setFromEuler(eu);
		snow.quaternion.setFromEuler(eu);
		stone.scale.set(1, .5, 1);
		snow.scale.set(1, .5, 1);

		this.group.add(stone);
		this.snowGroup.add(snow);
	};

	this.group.scale.set(.05, .05, .05);


	//, ,
	this.winterTween = new TWEEN.Tween(this.top.material.color).to({r: 1, g: 1, b: 1 }, 500);
	this.springTween = new TWEEN.Tween(this.top.material.color).to({r: 0.314, g: 0.522, b: 0.322 }, 1000);
	this.top.castShadow = true;
	this.top.receiveShadow = true;
};

Soil.prototype.update = function(time) {
	var snowHeight = -Math.sin(time.seasonRad)*.3;
	if (snowHeight > 0) this.snowGroup.position.y = -Math.sin(time.seasonRad)*.3;

	if (time.currentSeason === "WI" && time.lastSeason === "FA") {
		this.springTween.stop();
		this.winterTween.start();
	} else if (time.currentSeason === "SP" && time.lastSeason === "WI") {
		this.winterTween.stop();
		this.springTween.start();
	}
}
