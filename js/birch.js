function BirchTree(level) {
	
	this.level = level;
	
	this.childSections = [];
	this.timestamp = Date.now();
	this.height = 0;
	this.group = new THREE.Group();
	this.mesh;
	
	this.branchTime = 2;
	this.numBranches = 2;
	this.straight = true;
	
	var birchBark;
	var geometry;
	

	
	if (this.level === 0) {
		
		birchBark = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.branchTime = 5;
		
	} else if (this.level < 3) {
		
		birchBark = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		
	} else if (this.level === 4) {
		
		birchBark = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.BoxGeometry( 0.4, 1, 0.00001 );
		this.numBranches = 2;
		this.straight = false;
		
	} else{
		
		birchBark = new THREE.MeshLambertMaterial( {color: 0xe8d8c1} );
		geometry = new THREE.CylinderGeometry(.07, .1, 1, 3, 1, true );
		this.branchTime = 1;
		this.numBranches = 0;
		this.straight = false;
		
	}
	
	
	geometry.translate(0, .5, 0);
	this.mesh = new THREE.Mesh(geometry, birchBark);
}