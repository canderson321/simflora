function BirchPart(level) {
	
	this.level = level;
	console.log(level);
	
	this.childParts = [];
	this.timestamp = Date.now();
	this.height = 0;
	this.group = new THREE.Group();
	this.mesh;
	
	this.branchTime = 2;
	this.numBranches = 4;
	this.straight = true;
	this.minBranchAngle = 25;
	this.maxBranchAngle = 50;
	
	var material;
	var geometry;
	

	
	if (this.level === 0) {
		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.branchTime = 5;
		this.numBranches = 5;
		
	} else if (this.level < 5) {
		
		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.numBranches = 3
		this.minBranchAngle = 25;
		this.maxBranchAngle = 65;
		
	} else if (this.level === 6) {
		
		material = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.numBranches = 0;
		this.straight = true;
		
	} else {
		
		material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
		geometry = new THREE.BoxGeometry( 0.25, 0.5, 0.00001 );
		geometry.translate(0, -0.25, 0);
		this.numBranches = 0;
		this.straight = false;
		
	}
	
	
	geometry.translate(0, .5, 0);
	this.mesh = new THREE.Mesh(geometry, material);
	this.group.add(this.mesh);
}