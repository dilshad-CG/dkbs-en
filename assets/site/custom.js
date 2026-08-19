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

    // wire the slider's OWN arrows (not the nested blocklist arrows inside slides)
    var arrowsScope = slider.querySelector('.mosaic-slider__arrows_wrapper') || slider;
    var prevBtns = arrowsScope.querySelectorAll('.mosaic-slider__arrow--prev, .mosaic-slider__preview_arrow--prev');
    var nextBtns = arrowsScope.querySelectorAll('.mosaic-slider__arrow--next, .mosaic-slider__preview_arrow--next');
    Array.prototype.forEach.call(prevBtns, function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); prev(); restart(); });
    });
    Array.prototype.forEach.call(nextBtns, function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); next(); restart(); });
    });

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

  // Replace the empty builder map placeholder with an embedded Google map
  function initMap() {
    var MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.159076364032!2d28.0871061!3d-26.061057099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95725f1029391d%3A0xe49142459a640669!2sTau%20Mining%20Consultants!5e0!3m2!1sen!2sza!4v1787171442143!5m2!1sen!2sza';
    var maps = document.querySelectorAll('.mosaic-map');
    Array.prototype.forEach.call(maps, function (m) {
      if (m.querySelector('iframe')) return;
      m.innerHTML = '<iframe src="' + MAP_SRC + '" title="Location map" ' +
        'style="width:100%;height:100%;min-height:400px;border:0;display:block;" ' +
        'allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      m.style.overflow = 'hidden';
      m.style.minHeight = '400px';
    });
  }

  function boot() { initSlider(); initMap(); }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
