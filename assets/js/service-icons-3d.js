(function () {
	'use strict';

	if (typeof THREE === 'undefined') return;

	var SHAPES = {
		icosahedron:  function () { return new THREE.IcosahedronGeometry(1, 1); },
		tetrahedron:  function () { return new THREE.TetrahedronGeometry(1.15, 0); },
		box:          function () { return new THREE.BoxGeometry(1.4, 1.4, 1.4); },
		octahedron:   function () { return new THREE.OctahedronGeometry(1.15, 0); },
		torus:        function () { return new THREE.TorusGeometry(.75, .32, 8, 14); },
		dodecahedron: function () { return new THREE.DodecahedronGeometry(1, 0); },
	};

	var scenes = [];

	document.querySelectorAll('.service-icon-canvas').forEach(function (canvas) {
		var shape = canvas.dataset.shape || 'icosahedron';
		var wrap  = canvas.parentElement;
		var size  = wrap.clientWidth || 72;

		var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(size, size);

		var scene  = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
		camera.position.z = 3.5;

		var geo  = new THREE.EdgesGeometry(SHAPES[shape]());
		var mat  = new THREE.LineBasicMaterial({ color: 0x0057FF, transparent: true, opacity: 0.9 });
		var mesh = new THREE.LineSegments(geo, mat);
		scene.add(mesh);

		scenes.push({ renderer: renderer, scene: scene, camera: camera, mesh: mesh });
	});

	function tick() {
		requestAnimationFrame(tick);
		for (var i = 0; i < scenes.length; i++) {
			var s = scenes[i];
			s.mesh.rotation.x += 0.008;
			s.mesh.rotation.y += 0.013;
			s.renderer.render(s.scene, s.camera);
		}
	}

	if (scenes.length) tick();
})();
