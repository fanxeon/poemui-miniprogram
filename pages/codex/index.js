var tabbarNavigation = require('../../common/utils/tabbar-navigation');
var backgroundPreference = require('../../common/utils/page-background-preference');

var INSTALL_CODE = 'npm i poemui-miniprogram -S --production';
var USAGE_CODE = [
  '// page.json',
  '{',
  '  "usingComponents": {',
  '    "pui-button": "poemui-miniprogram/button/button"',
  '  }',
  '}',
  '',
  '<!-- page.wxml -->',
  '<pui-button theme="primary">开始</pui-button>'
].join('\n');

function getWindowHeight() {
  return wx.getWindowInfo ? Number(wx.getWindowInfo().windowHeight) : 0;
}

Page({
  data: {
    activeTab: 'codex',
    tabbarItems: tabbarNavigation.getItems(),
    installCode: INSTALL_CODE,
    usageCode: USAGE_CODE,
    backgroundGradientEnabled: backgroundPreference.get(),
    contentHeight: '1px',
    layoutReady: false
  },

  onLoad: function onLoad() {
    var self = this;
    backgroundPreference.restore();
    this._unsubscribeBackgroundPreference = backgroundPreference.subscribe(function onPreferenceChange(enabled) {
      self.setData({ backgroundGradientEnabled: Boolean(enabled) });
    });
    this._windowResizeHandler = this.onWindowResize.bind(this);
    if (wx.onWindowResize) wx.onWindowResize(this._windowResizeHandler);
  },

  onShow: function onShow() {
    this.scheduleMeasureLayout();
  },

  onReady: function onReady() {
    this.scheduleMeasureLayout();
  },

  onUnload: function onUnload() {
    clearTimeout(this._measureTimer);
    if (this._unsubscribeBackgroundPreference) this._unsubscribeBackgroundPreference();
    if (wx.offWindowResize && this._windowResizeHandler) wx.offWindowResize(this._windowResizeHandler);
  },

  onWindowResize: function onWindowResize() {
    this.scheduleMeasureLayout();
  },

  scheduleMeasureLayout: function scheduleMeasureLayout() {
    clearTimeout(this._measureTimer);
    this._measureTimer = setTimeout(this.measureLayout.bind(this), 0);
  },

  measureLayout: function measureLayout() {
    var windowHeight = getWindowHeight();
    if (!windowHeight || !this.createSelectorQuery) return;
    var query = this.createSelectorQuery();
    query.select('#codex-navbar').boundingClientRect();
    query.select('#codex-tabbar').boundingClientRect();
    query.exec(function onMeasured(rects) {
      var navbarHeight = rects && rects[0] ? Number(rects[0].height) : 0;
      var tabbarHeight = rects && rects[1] ? Number(rects[1].height) : 0;
      if (!navbarHeight || !tabbarHeight) return;
      this.setData({
        contentHeight: Math.max(1, Math.floor(windowHeight - navbarHeight - tabbarHeight)) + 'px',
        layoutReady: true
      });
    }.bind(this));
  },

  onTabChange: function onTabChange(event) {
    var value = event && event.detail ? event.detail.value : '';
    tabbarNavigation.navigateToTab(value, this.data.activeTab);
  }
});
