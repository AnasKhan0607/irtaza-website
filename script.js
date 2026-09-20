// Irtaza Javed — portfolio.
// Three small things: the year, a border on the nav once it is scrolled past,
// and a fade-in for anything carrying .reveal. No dependencies, no framework.

(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- theme toggle -------------------------------------------------------
  // The stored value is applied by the inline script in <head>, before paint.
  // This only handles clicks and keeps the label describing the NEXT state.
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var systemLight = window.matchMedia('(prefers-color-scheme: light)');

    var current = function () {
      var set = document.documentElement.dataset.theme;
      if (set === 'light' || set === 'dark') return set;
      return systemLight.matches ? 'light' : 'dark';
    };

    var label = function () {
      toggle.setAttribute('aria-label',
        current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    };

    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });

    // Follow the system while the visitor has not chosen for themselves.
    var onSystem = function () {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (e) {}
      if (stored !== 'light' && stored !== 'dark') {
        delete document.documentElement.dataset.theme;
        label();
      }
    };
    if (systemLight.addEventListener) systemLight.addEventListener('change', onSystem);
    else if (systemLight.addListener) systemLight.addListener(onSystem);

    label();
  }

  var reveals = document.querySelectorAll('.reveal');

  // No IntersectionObserver, or the visitor asked for less motion: show
  // everything at once. The failure mode of getting this wrong is a blank
  // page, so it fails toward visible.
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

  reveals.forEach(function (el) {
    // Stagger siblings so a row of cards arrives in sequence rather than
    // all at once. Index within the parent, not the document, or late
    // sections inherit a long delay from everything above them.
    var siblings = el.parentElement ? el.parentElement.children : [el];
    var index = Array.prototype.indexOf.call(siblings, el);
    el.style.transitionDelay = Math.min(index, 5) * 70 + 'ms';
    observer.observe(el);
  });
})();
