function SunMoon(light) {
	this.timeStamp = Date.now();

	var sunGeometry = new THREE.SphereGeometry( .4, 16, 16 );
	this.sunLight = new THREE.PointLight( 0xffffee, 1, 100, 2 );
	var sunMaterial = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	});
	this.sunLight.add( new THREE.Mesh( sunGeometry, sunMaterial ));
	this.sunLight.position.set( 0, 10, 0 );
	this.sunLight.castShadow = true;

	var moonGeometry = new THREE.SphereGeometry( .2 )
	this.moonLight = new THREE.PointLight( 0x9badff, 1, 100, 2 )
	var moonMaterial = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: .2,
		color: 0x000000
	});
	this.moonLight.add( new THREE.Mesh( moonGeometry, moonMaterial ));
	this.moonLight.position.set( 0, -10, 0 );

	this.update = function() {
		// if (sunClicked === true) {
			var radians = (Date.now() - this.timeStamp)/1000;
			light.intensity = Math.sin(radians);
			this.sunLight.intensity = Math.sin(radians) + .5;
			this.moonLight.intensity = -Math.sin(radians) + .5;
			this.sunLight.position.x = 10*Math.cos(radians) + 0;
			this.sunLight.position.y = 10*Math.sin(radians) + 0;

			this.moonLight.position.x = -10*Math.cos(radians) + 0;
			this.moonLight.position.y = -10*Math.sin(radians) + 0;
		// }
	};
};
