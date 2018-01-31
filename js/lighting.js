function Lighting() {
	this.timeStamp = Date.now();

	var ambient = new THREE.AmbientLight(0x606060);

	var sunGeometry = new THREE.SphereGeometry( .1, 16, 16 );
	var sunLight = new THREE.DirectionalLight( 0xffffee, 1, 100, 2 );
	var sunMaterial = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	});
	sunLight.add( new THREE.Mesh( sunGeometry, sunMaterial ));
	sunLight.position.set( 0, 10, 0 );
	sunLight.castShadow = true;

	// var moonGeometry = new THREE.SphereGeometry( .2 )
	// var moonLight = new THREE.PointLight( 0x9badff, 1, 100, 2 )
	// var moonMaterial = new THREE.MeshStandardMaterial( {
	// 	emissive: 0xffffee,
	// 	emissiveIntensity: .2,
	// 	color: 0x000000
	// });
	// moonLight.add( new THREE.Mesh( moonGeometry, moonMaterial ));
	// moonLight.position.set( 0, -10, 0 );

	//seasonal lights
		var winterLight = new THREE.AmbientLight( 0x998acc, .05, 100, 2);
		// winterLight.position.set(0, 10, 0);

		var summerLight = new THREE.AmbientLight( 0xfffa00, .1, 100, 2 );
		// summerLight.position.set(0, 10, 0);

		// var fallLight = new THREE.AmbientLight( 0xff93a5, .5, 100, 2);
		// fallLight.position.set(0, 10, 0);

		// var springLight = new THREE.AmbientLight( 0x84ff88, .5, 100, 2);
		// springLight.position.set(0, 10, 0)

	this.update = function(time) {
		var radians = (Date.now() - this.timeStamp)/1000;
		sunLight.intensity = 1.5;//Math.sin(radians) + .5;
		// moonLight.intensity = .5;//-Math.sin(radians) + .5;
		sunLight.position.x = 2*Math.cos(time.dayRad) + 0;
		sunLight.position.y = 2*Math.sin(time.dayRad) + 0;
		// moonLight.position.x = -10*Math.cos(radians) + 0;
		// moonLight.position.y = -10*Math.sin(radians) + 0;
		ambient.intensity = Math.abs(Math.cos(time.dayRad))/3 + 1.5;
		winterLight.intensity = -Math.sin(time.seasonRad)/3;
		//fallLight.intensity = Math.cos((time.seasonRad+Math.PI)/2);
		summerLight.intensity = Math.sin(time.seasonRad)/3;// + Math.PI/8)/2;
		//springLight.intensity = Math.sin((time.seasonRad-Math.PI)/2);
	};

	this.group = new THREE.Group();
	this.group.add(ambient);
	this.group.add(sunLight);
	this.group.add(winterLight);
	this.group.add(summerLight);
	//this.group.add(fallLight);
	//this.group.add(springLight);
	// this.group.add(moonLight);
};
