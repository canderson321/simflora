function rotateAndTilt(x, y) {
	return new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ');
};


function Stars() {
	this.group = new THREE.Group();
	var material = new THREE.MeshStandardMaterial( {emissive: 0xffffee, emissiveIntensity: 1, color: 0x000000 });
	var starField = new THREE.Geometry();
	for (var i = 0; i < 1000; i++) {
		var radius = .05//Math.random()*.005 + .005;
		var geometry = new THREE.SphereGeometry(radius, 2, 2 );
		var distance = 7 + Math.random()*15;
		geometry.translate(distance, distance, distance);
		var star = new THREE.Mesh( geometry );
		star.quaternion.setFromEuler(rotateAndTilt(Math.random() * 360, Math.random() * 360));
		star.updateMatrix();
		starField.merge(star.geometry, star.matrix);
	};
	var bufferGeo = new THREE.BufferGeometry();
	bufferGeo.fromGeometry(starField)
	this.group.add(new THREE.Mesh(bufferGeo, material));
}
var growthStart = false;

$(document).ready(function() {
	document.getElementById('hideMessage').addEventListener( 'click', function(event) {
		growthStart = true;
		document.getElementById('welcome').style.display = 'none';
	})

	document.getElementById("timeRate").oninput = function() {
		timeRate = document.getElementById("timeRate").value;
	}

	document.getElementById("resetIcon").addEventListener( 'click', function(event) {
		
	})

	Geometry();

	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.setSize( window.innerWidth, window.innerHeight);
	// renderer.shadowMapEnabled = true;
	document.body.appendChild( renderer.domElement);

	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, .3, 2.5);
	camera.lookAt(new THREE.Vector3(0, 5, 0));

	var scene = new THREE.Scene();

	var lighting = new Lighting();
	scene.add(lighting.group);

	var stars = new Stars();
	scene.add(stars.group);

	var maple = new MaplePart(undefined, "trunk");
	scene.add(maple.group);

	var soil = new Soil();
	scene.add(soil.group);

	var roots = new RootPart(undefined);
	roots.group.rotation.x = Math.PI;
	scene.add(roots.group);


	//var audio = new Audio('audio_file.mp3');
	//audio.play();

	var time = new Time();

	var controls = new THREE.OrbitControls(camera,  renderer.domElement);
	controls.addEventListener('change', function() {renderer.render(scene, camera);});


	function animate() {
		requestAnimationFrame(animate);
		scene.rotation.y += .001;
		time.update(1);
		TWEEN.update();
		soil.update(time)
		maple.update(time);
		roots.update(time);
		lighting.update(time);
		renderer.render(scene, camera);
		lastTime = Date.now();
	};
	animate();
});
