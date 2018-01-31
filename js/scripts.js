function rotateAndTilt(x, y) {
	return new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ');
};

function Time() {
	var daysPerYear = 4;
	this.dayRad = 0;
	this.seasonRad = 0;

	this.update = function() {
		this.dayRad = ((Date.now() / 3000) % 2) * Math.PI;
		this.seasonRad = ((Date.now() / (3000 * daysPerYear)) % 2) * Math.PI;
	}
}

var growthStart = false;

$(document).ready(function() {
	document.getElementById('hideMessage').addEventListener( 'click', function(event) {
		growthStart = true;
		document.getElementById('welcome').style.display = 'none';
	})

	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight);
	// renderer.shadowMapEnabled = true;
	document.body.appendChild( renderer.domElement);

	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, .7, 5);
	camera.lookAt(new THREE.Vector3(0, 5, 0));

	var scene = new THREE.Scene();

	var lighting = new Lighting();
	scene.add(lighting.group);

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

	var controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', function() {renderer.render(scene, camera);});

	function animate() {
		requestAnimationFrame(animate);
		scene.rotation.y = time.seasonRad;
		time.update();
		TWEEN.update();
		maple.update(time);
		roots.update(time);
		lighting.update(time);
		renderer.render(scene, camera);
	};
	animate();
});
