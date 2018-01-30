function Soil() {
	var topPoints = [];
	for ( var i = 10; i >= 0; i-- ) {
		topPoints.push(new THREE.Vector2(i, Math.cos(Math.PI/20*i)));
	}
	var bottomPoints = [];
	for ( var i = 0; i <= 10; i++ ) {
		bottomPoints.push(new THREE.Vector2(i, -2*(1+Math.cos(Math.PI/10*i))));
	}

	var topGeometry = new THREE.LatheGeometry( topPoints );
	topGeometry.computeFaceNormals();
	topGeometry.computeVertexNormals();
	var bottomGeometry = new THREE.LatheGeometry( bottomPoints );

	var topMaterial = new THREE.MeshLambertMaterial( { color: 0xa1ba32 } );
	var bottomMaterial = new THREE.MeshLambertMaterial( { color: 0x917054 } );
	var top = new THREE.Mesh( topGeometry, topMaterial );

	var bottom = new THREE.Mesh( bottomGeometry, bottomMaterial );

	this.group = new THREE.Group();
	this.group.add(top);
	this.group.add(bottom);
	this.group.scale.set(.3, .3, .3)
};
