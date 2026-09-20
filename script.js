/* Irtaza Javed — portfolio.
   No dependencies. Everything below degrades to a plain, readable page:
   if this file fails to load, the markup and CSS still render the site.

   Reduced motion is honoured once, up front, and every optional behaviour
   checks it — the page should be static and complete, not half-animated. */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(hover: none)').matches;

  /* ------------------------------------------------------------------ year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------------- theme */
  /* The inline script in <head> has already set data-theme to "dark" or
     "light". This only flips it, stores the choice, and keeps the button
     labelled with the theme it would switch TO. */
  (function theme() {
    var btn = document.getElementById('theme-toggle');
    var txt = document.getElementById('theme-txt');
    if (!btn) return;

    var systemLight = window.matchMedia('(prefers-color-scheme: light)');

    function paint() {
      var now = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = now === 'dark' ? 'light' : 'dark';
      if (txt) txt.textContent = next === 'light' ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      root.setAttribute('data-theme-source', 'user');
      try { localStorage.setItem('theme', next); } catch (e) {}
      paint();
    });

    // Keep following the system until the visitor chooses for themselves.
    function onSystem(e) {
      if (root.getAttribute('data-theme-source') === 'user') return;
      root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
      paint();
    }
    if (systemLight.addEventListener) systemLight.addEventListener('change', onSystem);
    else if (systemLight.addListener) systemLight.addListener(onSystem);

    paint();
  })();

  /* ------------------------------------------------- split headlines into words */
  /* Done in JS so the HTML stays readable prose. Each word gets a clipping
     span and an inner <i> that slides up, so the reveal wipes rather than
     fades. Spaces are kept between spans or the words run together. */
  if (!reduced) {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'w';
        var inner = document.createElement('i');
        inner.textContent = word;
        inner.style.transitionDelay = (i * 55) + 'ms';
        span.appendChild(inner);
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ---------------------------------------------------------------- reveal */
  var targets = document.querySelectorAll('.up, [data-split]');

  if (reduced || !('IntersectionObserver' in window)) {
    // Fail toward visible: the cost of getting this wrong is a blank page.
    for (var i = 0; i < targets.length; i++) targets[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    targets.forEach(function (el) {
      var sibs = el.parentElement ? el.parentElement.children : [el];
      var idx = Array.prototype.indexOf.call(sibs, el);
      if (!el.hasAttribute('data-split')) {
        el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
      }
      io.observe(el);
    });
  }

  /* ------------------------------------------- scroll: nav, progress, rail */
  var nav = document.querySelector('.nav');
  var bar = document.getElementById('progress-bar');
  var rail = document.getElementById('plan');
  var railTrack = document.getElementById('rail-track');
  var railBar = document.getElementById('rail-bar');
  var railPin = rail ? rail.querySelector('.rail-pin') : null;

  /* Pure, so it can be tested without a browser: how far the rail track has
     travelled at a given scroll position. Clamped at both ends, and a track
     narrower than the viewport travels zero rather than a negative amount. */
  function railOffset(y, top, height, viewportH, trackW, viewportW) {
    var span = height - viewportH;
    var p = span > 0 ? (y - top) / span : 0;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    var travel = trackW - viewportW;
    if (travel < 0) travel = 0;
    return { p: p, x: -travel * p };
  }

  /* The usual `if (ticking) return` guard wedges permanently if the rAF it
     schedules never runs — the flag stays true and every later scroll is
     dropped. A timeout releases it, so the worst case is a coarser update
     rather than a dead page. */
  var scheduled = false;
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    var run = function () { scheduled = false; update(); };
    if (window.requestAnimationFrame) {
      var id = window.requestAnimationFrame(run);
      setTimeout(function () {
        if (!scheduled) return;
        if (window.cancelAnimationFrame) window.cancelAnimationFrame(id);
        run();
      }, 250);
    } else {
      setTimeout(run, 16);
    }
  }

  function update() {
    {
      var y = window.scrollY || window.pageYOffset;

      if (nav) nav.classList.toggle('stuck', y > 8);

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }

      // The rail only runs while CSS has actually pinned it. Below the
      // breakpoint, and under reduced motion, the stylesheet makes it a
      // normal stack and this must not touch the transform.
      if (railTrack && railPin && getComputedStyle(railPin).position === 'sticky') {
        var r = railOffset(y, rail.offsetTop, rail.offsetHeight, window.innerHeight,
                           railTrack.scrollWidth, window.innerWidth);
        railTrack.style.transform = 'translate3d(' + r.x + 'px,0,0)';
        if (railBar) railBar.style.transform = 'scaleX(' + r.p + ')';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------- spotlight */
  if (!reduced && !coarse) {
    document.querySelectorAll('[data-spot]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        el.classList.add('lit');
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('lit'); });
    });
  }

  /* ------------------------------------------------------------------ tilt */
  if (!reduced && !coarse) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = el.hasAttribute('data-depth') ? 9 : 5;
      var frame = null;
      el.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';

      el.addEventListener('pointermove', function (e) {
        if (frame) return;
        frame = requestAnimationFrame(function () {
          frame = null;
          var r = el.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transition = 'transform 0.1s linear';
          el.style.transform =
            'perspective(900px) rotateY(' + (px * max * 2) + 'deg) rotateX(' +
            (-py * max * 2) + 'deg) translateZ(0)';
        });
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = '';
      });
    });
  }

  /* -------------------------------------------------------------- magnetic */
  if (!reduced && !coarse) {
    document.querySelectorAll('.mag').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
        el.style.transition = 'transform 0.12s linear';
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------- the slab */
  /* A real box in CSS 3D: drag to spin it, let go and the momentum carries,
     then it settles back into a slow idle rotation. The loop is paused while
     the slab is off-screen so an idle tab is not burning frames. */
  (function slab() {
    var el = document.getElementById('slab');
    if (!el || reduced) return;

    var ry = -22, rx = -6;      // current rotation
    var vy = 0.12, vx = 0;      // velocity, deg per frame
    var dragging = false, visible = true, raf = null;
    var lastX = 0, lastY = 0, moved = 0;
    var hint = document.getElementById('slab-hint');

    function draw() {
      el.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    }

    function loop() {
      if (!dragging) {
        ry += vy;
        rx += vx;
        // Decay toward the idle spin rather than toward zero, so it never
        // just stops dead after a throw.
        vy += (0.12 - vy) * 0.04;
        vx *= 0.9;
        rx += (-6 - rx) * 0.03;          // ease back to a slight downward tilt
        if (ry > 360) ry -= 360; else if (ry < -360) ry += 360;
        draw();
      }
      raf = visible ? requestAnimationFrame(loop) : null;
    }

    el.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0;
      lastX = e.clientX; lastY = e.clientY;
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      ry += dx * 0.45;
      rx = Math.max(-38, Math.min(38, rx - dy * 0.28));   // clamp: never upside down
      vy = dx * 0.45; vx = -dy * 0.28;
      draw();
    });

    function release(e) {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      if (e && e.pointerId != null && el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      if (moved > 12 && hint) hint.style.opacity = '0';
    }
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      }, { threshold: 0 }).observe(el);
    }

    draw();
    raf = requestAnimationFrame(loop);
  })();
})();
