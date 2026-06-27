(function () {
	'use strict';

	// Mobile menu toggle
	const toggle = document.querySelector('.menu-toggle');
	const nav    = document.querySelector('.primary-nav');

	if (toggle && nav) {
		toggle.addEventListener('click', function () {
			const expanded = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!expanded));
			nav.classList.toggle('is-open');
		});
	}

	// Marca link ativo no nav
	const links = document.querySelectorAll('nav a');
	links.forEach(function (link) {
		if (link.href === window.location.href) {
			link.classList.add('active');
		}
	});
})();
