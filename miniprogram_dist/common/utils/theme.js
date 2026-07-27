var platformInfo = require('./platform-info');

function getSystemTheme() {
  var info = platformInfo.getAppBaseInfo();
  return info.theme === 'dark' ? 'dark' : 'light';
}

function resolveTheme(theme) {
  if (theme === 'auto') {
    return getSystemTheme();
  }
  if (theme === 'dark') {
    return 'dark';
  }
  return 'light';
}

module.exports = {
  getSystemTheme: getSystemTheme,
  resolveTheme: resolveTheme,
};
