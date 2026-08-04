(function () {
  'use strict';

  var THEME_KEY = 'foundry-toolkit-changelog-theme';
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var search = document.getElementById('search');
  var results = document.getElementById('results');
  var navEmpty = document.getElementById('nav-empty');
  var contentEmpty = document.getElementById('content-empty');
  var releaseSelect = document.getElementById('release-select');
  var releases = Array.prototype.slice.call(document.querySelectorAll('.release'));
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav__item'));
  var releaseOptions = releaseSelect
    ? Array.prototype.slice.call(releaseSelect.querySelectorAll('option'))
    : [];

  // Theme

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  function readStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  var stored = readStoredTheme();
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        /* Storage can be blocked; the theme still applies for this page view. */
      }
    });
  }

  // Filtering

  var searchIndex = releases.map(function (release) {
    return {
      element: release,
      id: release.id,
      text: (release.textContent || '').toLowerCase(),
    };
  });

  function filter(query) {
    var normalized = query.trim().toLowerCase();
    var matchedIds = {};
    var matches = 0;

    searchIndex.forEach(function (entry) {
      var isMatch = normalized === '' || entry.text.indexOf(normalized) !== -1;
      entry.element.hidden = !isMatch;
      if (isMatch) {
        matchedIds[entry.id] = true;
        matches += 1;
      }
    });

    navItems.forEach(function (item) {
      item.hidden = !matchedIds[item.getAttribute('data-target')];
    });

    releaseOptions.forEach(function (option) {
      option.hidden = !matchedIds[option.value.slice(1)];
    });

    document.querySelectorAll('.nav__group').forEach(function (group) {
      var visible = group.querySelectorAll('.nav__item:not([hidden])').length;
      group.hidden = visible === 0;
    });

    if (navEmpty) {
      navEmpty.hidden = matches !== 0;
    }
    if (contentEmpty) {
      contentEmpty.hidden = matches !== 0;
    }
    if (results) {
      results.hidden = normalized === '';
      results.textContent =
        matches === 1 ? '1 matching release' : matches + ' matching releases';
    }
  }

  if (search) {
    search.addEventListener('input', function () {
      filter(search.value);
    });

    // Restore a filter that survived a reload (e.g. browser form restoration).
    if (search.value) {
      filter(search.value);
    }
  }

  if (releaseSelect) {
    releaseSelect.addEventListener('change', function () {
      window.location.hash = releaseSelect.value;
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === '/' && search && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
  });

  // Active release highlighting

  function setActive(id) {
    navItems.forEach(function (item) {
      item.classList.toggle('is-active', item.getAttribute('data-target') === id);
    });
    if (releaseSelect && releaseSelect.value !== '#' + id) {
      releaseSelect.value = '#' + id;
    }
  }

  if ('IntersectionObserver' in window && releases.length > 0) {
    var visible = new Set();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });

        for (var i = 0; i < releases.length; i += 1) {
          if (visible.has(releases[i].id)) {
            setActive(releases[i].id);
            return;
          }
        }
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    );

    releases.forEach(function (release) {
      observer.observe(release);
    });
  }

  if (window.location.hash) {
    setActive(window.location.hash.slice(1));
  } else if (releases.length > 0) {
    setActive(releases[0].id);
  }
})();
