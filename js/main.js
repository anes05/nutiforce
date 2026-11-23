/* ============================================================
   MAIN.JS — slider + mobile nav
   ============================================================ */

(function () {
  'use strict';

  /* ── Hero Slider ── */

  var wrapper  = document.getElementById('slidesWrapper');
  var dotsEl   = document.getElementById('sliderDots');
  var slides   = wrapper ? wrapper.querySelectorAll('.slide') : [];
  var total    = slides.length;
  var current  = 0;
  var timer    = null;

  function goTo(n) {
    current = (n + total) % total;
    wrapper.style.transform = 'translateX(-' + current * 100 + '%)';
    dotsEl.querySelectorAll('.slider-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  function initSlider() {
    if (!wrapper || !dotsEl || total === 0) return;

    /* Build dots */
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.setAttribute('aria-label', 'Aller à la diapositive ' + (i + 1));
      dot.dataset.index = i;
      dotsEl.appendChild(dot);
    });

    document.getElementById('sliderPrev').addEventListener('click', function () {
      goTo(current - 1);
      startAuto();
    });
    document.getElementById('sliderNext').addEventListener('click', function () {
      goTo(current + 1);
      startAuto();
    });

    dotsEl.addEventListener('click', function (e) {
      var dot = e.target.closest('.slider-dot');
      if (dot) { goTo(+dot.dataset.index); startAuto(); }
    });

    /* Swipe support */
    var startX = 0;
    wrapper.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    wrapper.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });

    startAuto();
  }

  /* ── Mobile Nav ── */

  function initNav() {
    var toggle    = document.getElementById('navToggle');
    var mobileNav = document.getElementById('mobileNav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden',  isOpen ? 'false' : 'true');
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', function () {
    initSlider();
    initNav();
  });

}());
