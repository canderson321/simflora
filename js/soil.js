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
	var top = new THREE.Mesh( geometry, material );

	var geometry = new THREE.LatheGeometry( bottomPoints );
	var material = new THREE.MeshLambertMaterial( { color: 0x917054 } );
	var bottom = new THREE.Mesh( geometry, material );

	var material = new THREE.MeshLambertMaterial( {color: 0x694f3a} );


	this.group = new THREE.Group();
	this.group.add(top);
	this.group.add(bottom);

	for (var i = 0; i < 90; i++) {
		var size = Math.random()/2 + .25;
		var geometry = new THREE.BoxGeometry(size, size, size);
		var x = 1 + Math.random() * 6;
		geometry.translate(x, 0, 0);
		var clod = new THREE.Mesh( geometry, material );
		clod.position.y = -3*(1+Math.cos(Math.PI/10*x))*Math.random() - .4;
		clod.quaternion.setFromEuler(rotateAndTilt(Math.random() * 90, Math.random() * 360));
		this.group.add(clod);

	};

	var material = new THREE.MeshLambertMaterial( {color: 0x656b59} );
	for (var i = 0; i < 8; i++) {
		var radius = Math.random() + .5;
		var geometry = new THREE.SphereGeometry(radius, 32, 32 );
		var x = 2 + Math.random() * 6.5;
		geometry.translate(x, 0, 0);
		var stone = new THREE.Mesh( geometry, material );
		stone.position.y = Math.cos(Math.PI/20*x);
		stone.quaternion.setFromEuler(rotateAndTilt(Math.random() * 90, Math.random() * 360));
		stone.scale.set(1, .5, 1);

		this.group.add(stone);
	};

	this.group.scale.set(.09, .09, .09)
};
