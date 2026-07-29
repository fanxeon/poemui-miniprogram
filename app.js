var visualConfig = require('poemui-miniprogram/common/utils/visual-config');
var themeUtils = require('poemui-miniprogram/common/utils/theme');

function normalizeSystemTheme(event) {
  if (event && event.theme === 'dark') return 'dark';
  if (event && event.theme === 'light') return 'light';
  if (event) return 'light';
  return themeUtils.getSystemTheme();
}

function syncSystemTheme(source, event) {
  return visualConfig.set({
    theme: normalizeSystemTheme(event)
  }, {
    persist: false,
    source: source
  });
}

App({
  onLaunch: function () {
    visualConfig.restore();
    syncSystemTheme('miniprogram-system-theme:launch');
  },
  onShow: function () {
    syncSystemTheme('miniprogram-system-theme:show');
  },
  onThemeChange: function (event) {
    syncSystemTheme('miniprogram-system-theme:change', event);
  }
});
