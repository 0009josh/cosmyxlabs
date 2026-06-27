(function () {
	'use strict';

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	if (window.matchMedia('(pointer: coarse)').matches) return;

	const CARDS  = '.service-card, .portfolio-card, .diferencial-card, .depoimento-card';
	const MAX    = 10;
	const PERSP  = 900;

	document.querySelectorAll(CARDS).forEach(function (card) {
		card.addEventListener('mouseenter', function () {
			card.style.transition = 'transform .12s ease, box-shadow .12s ease';
		});

		card.addEventListener('mousemove', function (e) {
			const r  = card.getBoundingClientRect();
			const x  = (e.clientX - r.left)  / r.width  - 0.5;
			const y  = (e.clientY - r.top)    / r.height - 0.5;
			const rx = -y * MAX;
			const ry =  x * MAX;
			card.style.transform =
				'perspective(' + PERSP + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(8px)';
			card.style.boxShadow =
				(-ry * 1.4) + 'px ' + (rx * 1.4) + 'px 36px rgba(0,87,255,.13)';
		});

		card.addEventListener('mouseleave', function () {
			card.style.transition = 'transform .5s ease, box-shadow .5s ease';
			card.style.transform  = 'perspective(' + PERSP + 'px) rotateX(0deg) rotateY(0deg) translateZ(0)';
			card.style.boxShadow  = '';
		});
	});
})();
