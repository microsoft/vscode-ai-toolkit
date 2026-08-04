(function () {
  'use strict';

  var THEME_KEY = 'foundry-toolkit-changelog-theme';
  var WINDOWS_COMMAND =
    'powershell -ex AllSigned -c "Invoke-RestMethod \'https://aka.ms/foundry-devpack-install.ps1\' | Invoke-Expression"';
  var UNIX_COMMAND = 'curl -fsSL https://aka.ms/foundry-devpack-install.sh | bash';
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var platformTabs = Array.prototype.slice.call(
    document.querySelectorAll('[data-platform-tab]'),
  );
  var commandElement = document.querySelector('[data-install-command]');
  var copyButton = document.querySelector('[data-copy-command]');
  var statusElement = document.querySelector('[data-copy-status]');

  function readStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      );
    }
  }

  var storedTheme = readStoredTheme();
  var prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        window.localStorage.setItem(THEME_KEY, nextTheme);
      } catch (error) {
        // The selected theme still applies when browser storage is unavailable.
      }
    });
  }

  function commandFor(platform) {
    return platform === 'unix' ? UNIX_COMMAND : WINDOWS_COMMAND;
  }

  function setPlatform(platform) {
    platformTabs.forEach(function (tab) {
      tab.setAttribute(
        'aria-selected',
        String(tab.getAttribute('data-platform-tab') === platform),
      );
    });
    if (commandElement) {
      commandElement.textContent = commandFor(platform);
    }
    if (statusElement) {
      statusElement.textContent = '';
    }
  }

  platformTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      setPlatform(tab.getAttribute('data-platform-tab'));
    });
  });

  var detectedPlatform =
    (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  setPlatform(/mac|linux|android/i.test(detectedPlatform) ? 'unix' : 'windows');

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  function reportCopy(message) {
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  if (copyButton && commandElement) {
    copyButton.addEventListener('click', function () {
      var command = commandElement.textContent;
      var copyPromise =
        navigator.clipboard && window.isSecureContext
          ? navigator.clipboard.writeText(command)
          : Promise.resolve(fallbackCopy(command));

      copyPromise
        .then(function (result) {
          if (result === false) {
            throw new Error('The browser rejected the copy command.');
          }
          reportCopy('Command copied.');
          copyButton.classList.add('is-copied');
          copyButton.querySelector('span').textContent = 'Copied';
          window.setTimeout(function () {
            copyButton.classList.remove('is-copied');
            copyButton.querySelector('span').textContent = 'Copy';
          }, 1800);
        })
        .catch(function () {
          reportCopy('Copy failed. Select the command and copy it manually.');
        });
    });
  }
})();
