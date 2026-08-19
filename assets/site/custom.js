/* Custom hero slider (Click Genius) — replaces the inert builder slider
   with a responsive auto-rotating fade carousel. */
(function () {
  function initSlider() {
    var slider = document.querySelector('.mosaic-slider');
    if (!slider) return;
    var list = slider.querySelector('.mosaic-slider__list');
    if (!list) return;
    var items = Array.prototype.filter.call(
      list.children,
      function (c) { return /mosaic-slider__item__outer/.test(c.className); }
    );
    if (items.length < 2) return;

    var idx = 0, timer = null;

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'cg-dots';
    var dots = items.map(function (_, i) {
      var d = document.createElement('button');
      d.className = 'cg-dot';
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', function () { show(i); restart(); });
      dotsWrap.appendChild(d);
      return d;
    });
    slider.appendChild(dotsWrap);

    function show(n) {
      idx = (n + items.length) % items.length;
      items.forEach(function (it, i) { it.classList.toggle('cg-active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('cg-active', i === idx); });
    }
    function next() { show(idx + 1); }
    function prev() { show(idx - 1); }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(next, 5500); }

    // wire existing builder arrows (any prev/next variant)
    var prevBtn = slider.querySelector('[class*="arrow--prev"]');
    var nextBtn = slider.querySelector('[class*="arrow--next"]');
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); next(); restart(); });

    // pause on hover (desktop)
    slider.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    // basic swipe (mobile)
    var x0 = null;
    slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
      x0 = null;
    }, { passive: true });

    show(0);
    restart();
  }

  if (document.readyState !== 'loading') initSlider();
  else document.addEventListener('DOMContentLoaded', initSlider);
})();
