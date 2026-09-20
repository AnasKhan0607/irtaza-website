// Irtaza Javed — personal site.
// Three small things: the year, a border on the nav once it is scrolled past,
// and a fade-in for anything carrying .reveal. No dependencies.

(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var reveals = document.querySelectorAll('.reveal');

  // No IntersectionObserver, or the visitor asked for less motion: show
  // everything immediately rather than leaving the page blank.
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    for (var i = 0; i < reveals.length; i++) reveals[i].classList.add('in');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  reveals.forEach(function (el, index) {
    // Stagger siblings slightly so a row of cards arrives in sequence.
    el.style.transitionDelay = (index % 4) * 70 + 'ms';
    observer.observe(el);
  });
})();
