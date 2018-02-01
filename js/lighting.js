function Lighting() {
	this.timeStamp = Date.now();

	var ambient = new THREE.AmbientLight(0x606060);

	var sunGeometry = new THREE.SphereGeometry( .04, 16, 16 );
	var sunLight = new THREE.DirectionalLight( 0xfffed3, 1, 100, 2 );
	var sunMaterial = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	});
	sunLight.add( new THREE.Mesh( sunGeometry, sunMaterial ));
	sunLight.position.set( 0, 1.2, 0 );
	sunLight.castShadow = true;
	
	
	
	
	var texture = new THREE.TextureLoader().load( "https://i.imgur.com/LplOZKW.png" );

	var flareColor = new THREE.Color( 0xffffff );

	this.lensFlare = new THREE.LensFlare( texture, 120, 0.0, THREE.AdditiveBlending, flareColor);
	sunLight.add(this.lensFlare);

	

	this.innerPlane = new THREE.Group();
	this.innerPlane.add(sunLight);
	this.outerPlane = new THREE.Group();
	this.outerPlane.add(this.innerPlane);


	//seasonal lights
		var winterLight = new THREE.AmbientLight( 0xb9c5eb, .05, 100, 2);

		var summerLight = new THREE.AmbientLight( 0xffd505, .1, 100, 2 );


	this.update = function(time) {
		var radians = (Date.now() - this.timeStamp)/1000;
		this.innerPlane.rotation.x = time.dayRad;
		this.outerPlane.rotation.z = .384 - .384*Math.sin(time.seasonRad);

		ambient.intensity = Math.abs(Math.cos(time.dayRad))*.6 + 1.4;
		winterLight.intensity = -Math.sin(time.seasonRad)*.4;
		
	};

	this.group = new THREE.Group();
	this.group.add(ambient);
	this.group.add(this.outerPlane);
	this.group.add(winterLight);
	this.group.add(summerLight);
	//this.group.add(this.lensFlare);
};
