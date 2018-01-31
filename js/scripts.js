
function Time() {
	var daysPerSeason = 8;
	this.dayRad = 0;
	this.seasonRad = 0;
	
	this.update = function() {
		this.dayRad = ((Date.now() / 1000) % 2) * Math.PI;
		this.seasonRad = ((Date.now() / (1000 * daysPerSeason)) % 2) * Math.PI;
	}
}

var scene;

$(document).ready(function() {
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement);

	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 3, 25);
	camera.lookAt(new THREE.Vector3(0, 5, 0));

	scene = new THREE.Scene();

	var lighting = new Lighting();
	scene.add(lighting.group);

	var maple = new MaplePart(undefined);
	scene.add(maple.group);
	var soil = new Soil();
	scene.add(soil.group)


	// var domEvents   = new THREEx.DomEvents(camera, renderer.domElement)
	// var sunClicked = false;
	// domEvents.addEventListener(sunMoon.sunLight, 'click', function(event) {
	// 	if (sunClicked === false) {
	// 		sunClicked = true;
	// 	} else {
	// 		sunClicked = false;
	// 	}
	// })
	
	var time = new Time();

	var controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', function() {renderer.render(scene, camera);});

	function animate() {
		requestAnimationFrame(animate);
		//scene.rotation.y += 0.002;
		time.update();
		maple.update(time);
		lighting.update();
		renderer.render(scene, camera);
	};
	animate();
});
