var platformInfo = require('./platform-info');

var NAVBAR_CONTENT_FALLBACK_RPX = 96;
var TABBAR_CONTENT_HEIGHT_RPX = 112;

function finite(value, fallback) {
  var number = Number(value);
  return isFinite(number) ? number : fallback;
}

function rpxToPx(value, windowWidth) {
  return finite(value, 0) * Math.max(0, finite(windowWidth, 0)) / 750;
}

function readMenuButtonRect() {
  try {
    if (typeof wx !== 'undefined' && typeof wx.getMenuButtonBoundingClientRect === 'function') {
      return wx.getMenuButtonBoundingClientRect() || {};
    }
  } catch (error) {
    // 胶囊几何不可用时使用 Navbar 的公开 fallback 节奏。
  }
  return {};
}

function resolveNavbarHeight(windowInfo, menuButtonRect) {
  var info = windowInfo || {};
  var rect = menuButtonRect || {};
  var statusBarHeight = Math.max(0, finite(info.statusBarHeight, finite(info.safeArea && info.safeArea.top, 0)));
  var top = finite(rect.top, NaN);
  var bottom = finite(rect.bottom, NaN);
  var height = finite(rect.height, NaN);
  if ((!isFinite(height) || height <= 0) && isFinite(top) && isFinite(bottom)) {
    height = bottom - top;
  }
  var contentHeight = rpxToPx(NAVBAR_CONTENT_FALLBACK_RPX, info.windowWidth);
  if (isFinite(top) && isFinite(height) && height > 0 && top >= statusBarHeight) {
    contentHeight = (top - statusBarHeight) * 2 + height;
  }
  return statusBarHeight + Math.max(0, contentHeight);
}

function resolveTabbarHeight(windowInfo) {
  var info = windowInfo || {};
  var safeAreaBottom = finite(info.safeArea && info.safeArea.bottom, finite(info.windowHeight, 0));
  var safeBottomInset = Math.max(0, finite(info.windowHeight, 0) - safeAreaBottom);
  return rpxToPx(TABBAR_CONTENT_HEIGHT_RPX, info.windowWidth) + safeBottomInset;
}

function getLayout() {
  var windowInfo = platformInfo.getWindowInfo();
  var windowHeight = Math.max(0, finite(windowInfo && windowInfo.windowHeight, 0));
  var navbarHeight = resolveNavbarHeight(windowInfo, readMenuButtonRect());
  var tabbarHeight = resolveTabbarHeight(windowInfo);
  var contentHeight = Math.max(1, Math.round(windowHeight - navbarHeight - tabbarHeight));
  return {
    windowHeight: windowHeight,
    navbarHeight: navbarHeight,
    tabbarHeight: tabbarHeight,
    contentHeight: contentHeight,
    contentHeightStyle: contentHeight + 'px'
  };
}

function getInitialLayout() {
  return getLayout();
}

function getContentHeight() {
  return getLayout().contentHeightStyle;
}

function getInitialContentHeight() {
  return getContentHeight();
}

module.exports = {
  getLayout: getLayout,
  getInitialLayout: getInitialLayout,
  getContentHeight: getContentHeight,
  getInitialContentHeight: getInitialContentHeight,
  resolveNavbarHeight: resolveNavbarHeight,
  resolveTabbarHeight: resolveTabbarHeight
};
