(function () {
	'use strict';

	if (typeof THREE === 'undefined') return;

	const canvas = document.getElementById('hero-canvas');
	if (!canvas) return;

	const wrap = canvas.parentElement;

	/* ── Renderer ── */
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(0x000000, 0);

	/* ── Camera ── */
	const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
	camera.position.z = 5.5;

	/* ── Scene ── */
	const scene = new THREE.Scene();

	/* ── Esfera wireframe principal (icosaedro) ── */
	const icoGeo  = new THREE.IcosahedronGeometry(1.8, 3);
	const edgesGeo = new THREE.EdgesGeometry(icoGeo);
	const edgesMat = new THREE.LineBasicMaterial({
		color: 0x4488ff,
		transparent: true,
		opacity: 0.75,
	});
	const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
	scene.add(wireframe);

	/* ── Esfera interna sólida (reflexo) ── */
	const innerMat = new THREE.MeshBasicMaterial({
		color: 0x0033cc,
		transparent: true,
		opacity: 0.07,
		side: THREE.BackSide,
	});
	const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 3), innerMat);
	scene.add(inner);

	/* ── Anel orbital 1 ── */
	const ring1 = new THREE.Mesh(
		new THREE.TorusGeometry(2.5, 0.012, 8, 120),
		new THREE.MeshBasicMaterial({ color: 0x6699ff, transparent: true, opacity: 0.45 })
	);
	ring1.rotation.x = Math.PI / 3;
	scene.add(ring1);

	/* ── Anel orbital 2 ── */
	const ring2 = new THREE.Mesh(
		new THREE.TorusGeometry(3.0, 0.008, 8, 140),
		new THREE.MeshBasicMaterial({ color: 0x3366ff, transparent: true, opacity: 0.28 })
	);
	ring2.rotation.x = Math.PI / 6;
	ring2.rotation.y = Math.PI / 5;
	scene.add(ring2);

	/* ── Anel orbital 3 (fino, inclinado) ── */
	const ring3 = new THREE.Mesh(
		new THREE.TorusGeometry(2.0, 0.006, 8, 100),
		new THREE.MeshBasicMaterial({ color: 0x88aaff, transparent: true, opacity: 0.35 })
	);
	ring3.rotation.x = Math.PI / 2;
	ring3.rotation.y = Math.PI / 3;
	scene.add(ring3);

	/* ── Partículas ── */
	const N = 160;
	const pos = new Float32Array(N * 3);
	for (let i = 0; i < N; i++) {
		const theta = Math.random() * Math.PI * 2;
		const phi   = Math.acos(2 * Math.random() - 1);
		const r     = 2.8 + Math.random() * 1.8;
		pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
		pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
		pos[i * 3 + 2] = r * Math.cos(phi);
	}
	const pGeo = new THREE.BufferGeometry();
	pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
	const pMat = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 0.05,
		transparent: true,
		opacity: 0.55,
	});
	const particles = new THREE.Points(pGeo, pMat);
	scene.add(particles);

	/* ── Luz pontual azul (glow) ── */
	const light = new THREE.PointLight(0x4488ff, 2, 10);
	light.position.set(2, 2, 3);
	scene.add(light);

	/* ── Resize ── */
	function resize() {
		const w = wrap.offsetWidth;
		const h = wrap.offsetHeight || w * 0.78;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}
	resize();
	window.addEventListener('resize', resize);

	/* ── Mouse parallax ── */
	let mx = 0, my = 0, tx = 0, ty = 0;
	window.addEventListener('mousemove', function (e) {
		mx = (e.clientX / window.innerWidth  - 0.5) * 2;
		my = (e.clientY / window.innerHeight - 0.5) * 2;
	});

	/* ── Loop de animação ── */
	const clock = new THREE.Clock();

	function animate() {
		requestAnimationFrame(animate);
		const t = clock.getElapsedTime();

		tx += (mx * 0.35 - tx) * 0.04;
		ty += (-my * 0.25 - ty) * 0.04;

		wireframe.rotation.y = t * 0.14 + tx;
		wireframe.rotation.x = t * 0.07 + ty;
		inner.rotation.y = wireframe.rotation.y;
		inner.rotation.x = wireframe.rotation.x;

		ring1.rotation.y = t * 0.12;
		ring1.rotation.z = t * 0.04;

		ring2.rotation.x = Math.PI / 6 + t * 0.09;
		ring2.rotation.z = t * 0.07;

		ring3.rotation.y = t * 0.18;
		ring3.rotation.x = Math.PI / 2 + t * 0.05;

		particles.rotation.y = t * 0.04;
		particles.rotation.x = t * 0.02;

		renderer.render(scene, camera);
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		renderer.render(scene, camera);
	} else {
		animate();
	}
})();
