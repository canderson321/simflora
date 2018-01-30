function Lighting() {
	this.timeStamp = Date.now();

	var ambient = new THREE.AmbientLight(0x606060);

	var sunGeometry = new THREE.SphereGeometry( .4, 16, 16 );
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

	this.update = function() {
		// if (sunClicked === true) {
			var radians = (Date.now() - this.timeStamp)/1000;
			ambient.intensity = Math.sin(radians)/2 + 1;
			sunLight.intensity = .5;//Math.sin(radians) + .5;
			// moonLight.intensity = .5;//-Math.sin(radians) + .5;
			sunLight.position.x = 10*Math.cos(radians) + 0;
			sunLight.position.y = 10*Math.sin(radians) + 0;

			// moonLight.position.x = -10*Math.cos(radians) + 0;
			// moonLight.position.y = -10*Math.sin(radians) + 0;
		// }
	};

	this.group = new THREE.Group();
	this.group.add(ambient);
	this.group.add(sunLight);
	// this.group.add(moonLight);
};
