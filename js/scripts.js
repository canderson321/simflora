function rotateAndTilt(x, y) {
	return new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, 0, 'YXZ');
};

function Time() {
	var daysPerYear = 4;
	this.summerDate = Math.PI / 4;
	this.fallDate = Math.PI * 3 / 4;
	this.winterDate = Math.PI * 5 / 4;
	this.springDate = Math.PI * 7 / 4;

	this.currentSeason = "";
	this.lastSeason = ""

	this.dayRad = 0;
	this.seasonRad = 0;

	this.update = function() {
		this.dayRad = ((Date.now() / 3000) % 2) * Math.PI;
		this.seasonRad = ((Date.now() / (3000 * daysPerYear)) % 2) * Math.PI;
		this.lastSeason = this.currentSeason;
		this.currentSeason = this.getSeason();
		//console.log(this.currentSeason);
	}

	this.getSeason = function() {
		if (this.seasonRad > this.summerDate && this.seasonRad <= this.fallDate)
			return "SU";
		else if (this.seasonRad > this.fallDate && this.seasonRad <= this.winterDate)
			return "FA";
		else if (this.seasonRad > this.winterDate && this.seasonRad <= this.springDate)
			return "WI";
		else
			return "SP";
	}
	this.update();
}

function Stars() {
	this.group = new THREE.Group();
	var material = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	});
	for (var i = 0; i < 2000; i++) {
		var radius = .04//Math.random()*.005 + .005;
		var geometry = new THREE.SphereGeometry(radius, 2, 2 );
		var distance = 7 + Math.random()*15;
		geometry.translate(distance, distance, distance);
		var star = new THREE.Mesh( geometry, material );
		// star.position.y = distance;
		star.quaternion.setFromEuler(rotateAndTilt(Math.random() * 360, Math.random() * 360));
		this.group.add(star);

	};
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

	var controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', function() {renderer.render(scene, camera);});

	function animate() {
		requestAnimationFrame(animate);
		scene.rotation.y += .001;
		time.update();
		TWEEN.update();
		soil.update(time)
		maple.update(time);
		roots.update(time);
		lighting.update(time);
		renderer.render(scene, camera);
	};
	animate();
});
