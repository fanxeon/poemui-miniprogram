var visualConfig = require('poemui-miniprogram/common/utils/visual-config');
var themeUtils = require('poemui-miniprogram/common/utils/theme');

var PAGE_BACKGROUND = {
  light: '#ffffff',
  dark: '#09090b'
};

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

function syncNativePageBackground(config) {
  if (!wx.setBackgroundColor) return;
  var resolvedTheme = themeUtils.resolveTheme(config && config.theme);
  var backgroundColor = PAGE_BACKGROUND[resolvedTheme] || PAGE_BACKGROUND.light;
  wx.setBackgroundColor({
    backgroundColor: backgroundColor,
    backgroundColorTop: backgroundColor,
    backgroundColorBottom: backgroundColor
  });
}

App({
  onLaunch: function () {
    visualConfig.restore();
    syncSystemTheme('miniprogram-system-theme:launch');
    this._unsubscribeNativePageBackground = visualConfig.subscribe(syncNativePageBackground);
  },
  onShow: function () {
    syncSystemTheme('miniprogram-system-theme:show');
  },
  onThemeChange: function (event) {
    syncSystemTheme('miniprogram-system-theme:change', event);
  }
});
