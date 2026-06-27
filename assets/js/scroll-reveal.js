(function () {
	'use strict';

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	var els = document.querySelectorAll('[data-reveal]');
	if (!els.length) return;

	if (!('IntersectionObserver' in window)) {
		els.forEach(function (el) { el.classList.add('is-visible'); });
		return;
	}

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

	els.forEach(function (el) { observer.observe(el); });
})();
