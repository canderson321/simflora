function Soil() {
	var topPoints = [];
	for ( var i = 10; i >= 0; i-- ) {
		topPoints.push(new THREE.Vector2(i, Math.cos(Math.PI/20*i)));
	}
	var bottomPoints = [];
	for ( var i = 0; i <= 10; i++ ) {
		bottomPoints.push(new THREE.Vector2(i, -2*(1+Math.cos(Math.PI/10*i))));
	}

	var topGeometry = new THREE.LatheGeometry( topPoints, 12);
	var topMaterial = new THREE.MeshLambertMaterial( { color: 0x344b37 } );

	this.top = new THREE.Mesh( topGeometry, topMaterial );
	this.top.castShadow = true;
	this.top.receiveShadow = true;

	var rimGeometry = new THREE.TorusGeometry(10, .5, 16, 12);
	// rimGeometry.translate(-.25, 0, 0);
	// var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	this.rim = new THREE.Mesh(rimGeometry, topMaterial);
	this.rim.rotation.x = Math.PI/2;
	this.rim.position.y = -.5;

	this.group = new THREE.Group();
	this.stoneSnow = new THREE.Group();
	this.groundSnow = new THREE.Group();
	this.stoneMoss = new THREE.Group();

	this.group.add(this.stoneSnow);
	this.group.add(this.stoneMoss);
	this.group.add(this.groundSnow);

	var snowMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	this.snowTop = new THREE.Mesh( topGeometry, snowMaterial );
	this.snowTop.position.y = -.05;
	// this.snowTop.castShadow = true;
	this.snowTop.receiveShadow = true;


	var snowRimGeometry = new THREE.TorusGeometry(10, .45, 16, 12);
	this.snowRim = new THREE.Mesh(snowRimGeometry, snowMaterial);
	this.snowRim.rotation.x = Math.PI/2;
	this.snowRim.position.y = -.5;
	// this.snowTop.add(this.snowRim);
	// this.snowTop.scale.set(1, 1, .95);
	this.groundSnow.add(this.snowTop);
	this.groundSnow.add(this.snowRim);

	var bottomGeometry = new THREE.LatheGeometry( bottomPoints, 12 );
	var bottomMaterial = new THREE.MeshLambertMaterial( { color: 0x917054 } );
	this.bottom = new THREE.Mesh( bottomGeometry, bottomMaterial );
	this.bottom.position.y = -.8;
	this.bottom.castShadow = true;
	//bottom.receiveShadow = true;

	this.group.add(this.top);
	this.group.add(this.rim);

	// this.group.add(this.snow)
	this.group.add(this.bottom);

	var material = new THREE.MeshLambertMaterial( {color: 0x423224} );

	for (var i = 0; i < 90; i++) {
		var size = Math.random()*.7 + .25;
		var geometry = new THREE.BoxGeometry(size, size, size);
		var x = 1 + Math.random() * 6;
		geometry.translate(x, 0, 0);
		var clod = new THREE.Mesh(geometry, material);
		clod.position.y = -3*(1+Math.cos(Math.PI/10*x))*Math.random() - .5;
		clod.quaternion.setFromEuler(rotateAndTilt(Math.random() * 90, Math.random() * 360));
		this.group.add(clod);
		//clod.castShadow = true;
		clod.receiveShadow = true;

	};


	var stoneMaterial = new THREE.MeshLambertMaterial( {color: 0x656b59} );
	var mossMaterial = new THREE.MeshLambertMaterial( {color: 0x4d5e35} );

	for (var i = 0; i < 8; i++) {
		var radius = Math.random() + .5;
		var stoneGeometry = new THREE.SphereGeometry(radius, 8, 8 );
		var snowGeometry = new THREE.SphereGeometry(radius*.9, 8, 8);
		var mossGeometry = new THREE.SphereGeometry(radius*.95, 8, 8);


		var x = 2 + Math.random() * 6.5;
		stoneGeometry.translate(x, 0, 0);
		snowGeometry.translate(x, 0, 0);
		mossGeometry.translate(x, 0, 0);

		var stone = new THREE.Mesh( stoneGeometry, stoneMaterial );
		var snow = new THREE.Mesh(snowGeometry, snowMaterial);
		var moss = new THREE.Mesh(mossGeometry, mossMaterial);

		// stone.castShadow = true;

		position = Math.cos(Math.PI/20*x);
		eu = rotateAndTilt(Math.random() * 90, Math.random() * 360);

		stone.position.y = position;
		snow.position.y = position;
		moss.position.y = position;

		stone.quaternion.setFromEuler(eu);
		snow.quaternion.setFromEuler(eu);
		moss.quaternion.setFromEuler(eu);

		stone.scale.set(1, .5, 1);
		snow.scale.set(1, .5, 1);
		moss.scale.set(1, .5, 1);

		this.group.add(stone);
		this.stoneSnow.add(snow);
		this.stoneMoss.add(moss);
	};

	this.stoneMoss.position.y = .07
	this.group.scale.set(.05, .05, .05);


	//, ,
	// this.winterTween = new TWEEN.Tween(this.top.material.color).to({r: 1, g: 1, b: 1 }, 500);
	// this.springTween = new TWEEN.Tween(this.top.material.color).to({r: 0.314, g: 0.522, b: 0.322 }, 1000);
};

Soil.prototype.update = function(time) {


	var snowHeight = -Math.sin(time.seasonRad)*.3;
	if (snowHeight > 0) {
		this.stoneSnow.position.y = -Math.sin(time.seasonRad)*.4;
		this.groundSnow.position.y = -Math.sin(time.seasonRad)*.09;
		this.groundSnow.scale.set(1, 1 + snowHeight*.2, 1)

	}

	// if (time.currentSeason === "WI" && time.lastSeason === "FA") {
	// 	this.springTween.stop();
	// 	this.winterTween.start();
	// } else if (time.currentSeason === "SP" && time.lastSeason === "WI") {
	// 	this.winterTween.stop();
	// 	this.springTween.start();
	// }
}
