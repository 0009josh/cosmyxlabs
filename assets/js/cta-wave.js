(function () {
	'use strict';

	if (typeof THREE === 'undefined') return;

	const canvas = document.getElementById('cta-canvas');
	if (!canvas) return;

	const wrap = canvas.parentElement;

	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
	renderer.setClearColor(0x000000, 0);

	const scene  = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
	camera.position.set(0, 6, 10);
	camera.lookAt(0, 0, 0);

	/* ── Plano wireframe ondulado ── */
	const geo = new THREE.PlaneGeometry(24, 14, 72, 46);
	const mat = new THREE.MeshBasicMaterial({
		color: 0x0057ff,
		wireframe: true,
		transparent: true,
		opacity: 0.16,
	});
	const plane = new THREE.Mesh(geo, mat);
	plane.rotation.x = -Math.PI / 2.8;
	scene.add(plane);

	const posAttr = geo.attributes.position;
	const baseY   = new Float32Array(posAttr.count);
	for (let i = 0; i < posAttr.count; i++) {
		baseY[i] = posAttr.getY(i);
	}

	/* ── Resize ── */
	function resize() {
		const w = wrap.offsetWidth;
		const h = wrap.offsetHeight || 420;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}
	resize();
	window.addEventListener('resize', resize);

	/* ── Loop ── */
	const clock = new THREE.Clock();

	function animate() {
		requestAnimationFrame(animate);
		const t = clock.getElapsedTime();

		for (let i = 0; i < posAttr.count; i++) {
			const x = posAttr.getX(i);
			const z = posAttr.getZ(i);
			posAttr.setY(i,
				baseY[i] +
				Math.sin(x * 0.5 + t * 0.9) * 0.45 +
				Math.sin(z * 0.4 + t * 0.7) * 0.3  +
				Math.sin((x - z) * 0.35 + t * 0.5) * 0.2
			);
		}
		posAttr.needsUpdate = true;
		renderer.render(scene, camera);
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		renderer.render(scene, camera);
	} else {
		animate();
	}
})();
