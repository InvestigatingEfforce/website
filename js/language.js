/* ============================================================
   LANGUAGE SELECTOR — Google Translate powered
   Self-contained: injects HTML into .search-bar__inner
   ============================================================ */

(function () {
  'use strict';

  var LANGUAGES = [
    { code: 'en', label: 'English',    flag: '\uD83C\uDDEC\uD83C\uDDE7' },
    { code: 'zh-CN', label: '\u4E2D\u6587',  flag: '\uD83C\uDDE8\uD83C\uDDF3' },
    { code: 'ko', label: '\uD55C\uAD6D\uC5B4',   flag: '\uD83C\uDDF0\uD83C\uDDF7' },
    { code: 'it', label: 'Italiano',   flag: '\uD83C\uDDEE\uD83C\uDDF9' },
    { code: 'es', label: 'Espa\u00F1ol',    flag: '\uD83C\uDDEA\uD83C\uDDF8' },
    { code: 'fr', label: 'Fran\u00E7ais',   flag: '\uD83C\uDDEB\uD83C\uDDF7' },
    { code: 'de', label: 'Deutsch',    flag: '\uD83C\uDDE9\uD83C\uDDEA' },
    { code: 'pt', label: 'Portugu\u00EAs', flag: '\uD83C\uDDE7\uD83C\uDDF7' },
    { code: 'ja', label: '\u65E5\u672C\u8A9E',   flag: '\uD83C\uDDEF\uD83C\uDDF5' },
    { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439',  flag: '\uD83C\uDDF7\uD83C\uDDFA' },
    { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',  flag: '\uD83C\uDDF8\uD83C\uDDE6' },
    { code: 'hi', label: '\u0939\u093F\u0928\u094D\u0926\u0940',   flag: '\uD83C\uDDEE\uD83C\uDDF3' }
  ];

  // Wait for DOM
  function init() {
    var bar = document.querySelector('.search-bar__inner');
    if (!bar) return;

    // Inject hidden Google Translate element
    var gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden';
    document.body.appendChild(gtDiv);

    // Build selector HTML
    var wrapper = document.createElement('div');
    wrapper.className = 'lang-sel';
    wrapper.innerHTML =
      '<button class="lang-sel__btn" aria-label="Select language" aria-expanded="false">' +
        '<svg class="lang-sel__globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">' +
          '<circle cx="12" cy="12" r="10"/>' +
          '<path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/>' +
        '</svg>' +
        '<span class="lang-sel__code">EN</span>' +
        '<svg class="lang-sel__caret" viewBox="0 0 10 6" fill="currentColor" width="8" height="8"><path d="M0 0l5 6 5-6z"/></svg>' +
      '</button>' +
      '<div class="lang-sel__menu" hidden></div>';

    var menu = wrapper.querySelector('.lang-sel__menu');
    LANGUAGES.forEach(function (lang) {
      var item = document.createElement('button');
      item.className = 'lang-sel__item' + (lang.code === 'en' ? ' lang-sel__item--active' : '');
      item.dataset.lang = lang.code;
      item.innerHTML = '<span class="lang-sel__flag">' + lang.flag + '</span>' + lang.label;
      menu.appendChild(item);
    });

    // Insert at start of search bar (left side)
    bar.insertBefore(wrapper, bar.firstChild);

    // Toggle dropdown
    var btn = wrapper.querySelector('.lang-sel__btn');
    var codeEl = wrapper.querySelector('.lang-sel__code');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.hasAttribute('hidden');
      menu.toggleAttribute('hidden', !open);
      btn.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', function () {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menu.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Language selection
    menu.addEventListener('click', function (e) {
      var item = e.target.closest('.lang-sel__item');
      if (!item) return;

      var lang = item.dataset.lang;

      // Update active state
      menu.querySelectorAll('.lang-sel__item').forEach(function (el) {
        el.classList.remove('lang-sel__item--active');
      });
      item.classList.add('lang-sel__item--active');

      // Update button label
      codeEl.textContent = lang === 'zh-CN' ? 'ZH' : lang.toUpperCase();

      // Close menu
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');

      // Trigger Google Translate
      if (lang === 'en') {
        // Restore original — remove Google Translate frame
        var frame = document.querySelector('.goog-te-banner-frame');
        if (frame) frame.style.display = 'none';
        document.body.style.top = '';
        // Reset via cookie
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
        location.reload();
        return;
      }

      // Set translation cookie and trigger
      document.cookie = 'googtrans=/en/' + lang + '; path=/;';
      document.cookie = 'googtrans=/en/' + lang + '; path=/; domain=.' + location.hostname;

      // If Google Translate already loaded, trigger change via select
      var sel = document.querySelector('.goog-te-combo');
      if (sel) {
        sel.value = lang;
        sel.dispatchEvent(new Event('change'));
      } else {
        // Reload to pick up the cookie
        location.reload();
      }
    });

    // Load Google Translate script
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: LANGUAGES.map(function (l) { return l.code; }).filter(function (c) { return c !== 'en'; }).join(','),
        layout: google.translate.TranslateElement.InlineLayout.NONE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    var script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Detect current language from cookie on load
    var match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match) {
      var current = match[1];
      var langObj = LANGUAGES.find(function (l) { return l.code === current; });
      if (langObj) {
        codeEl.textContent = current === 'zh-CN' ? 'ZH' : current.toUpperCase();
        menu.querySelectorAll('.lang-sel__item').forEach(function (el) {
          el.classList.toggle('lang-sel__item--active', el.dataset.lang === current);
        });
      }
    }
  }

  // Hide the Google Translate top bar that appears
  var hideStyle = document.createElement('style');
  hideStyle.textContent =
    '.goog-te-banner-frame{display:none!important}' +
    'body{top:0!important}' +
    '.goog-te-gadget{display:none!important}' +
    '#goog-gt-tt{display:none!important}' +
    '.goog-te-balloon-frame{display:none!important}' +
    '.goog-tooltip{display:none!important}' +
    '.goog-tooltip:hover{display:none!important}' +
    '.goog-text-highlight{background:none!important;box-shadow:none!important}';
  document.head.appendChild(hideStyle);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
