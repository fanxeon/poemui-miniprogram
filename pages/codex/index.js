var tabbarNavigation = require('../../common/utils/tabbar-navigation');
var backgroundPreference = require('../../common/utils/page-background-preference');
var codexPage = require('../../common/services/codex-page');

function getWindowHeight() {
  return wx.getWindowInfo ? Number(wx.getWindowInfo().windowHeight) : 0;
}

Page({
  data: {
    activeTab: 'codex',
    tabbarItems: tabbarNavigation.getItems(),
    codePage: null,
    skills: [],
    codePageLoadState: 'loading',
    codePageLoadingState: 'idle',
    codePageError: '',
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
    this.loadCodePage();
  },

  onShow: function onShow() {
    this.scheduleMeasureLayout();
  },

  onReady: function onReady() {
    this.scheduleMeasureLayout();
  },

  onUnload: function onUnload() {
    this._codePageRequestId = (this._codePageRequestId || 0) + 1;
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
  },

  loadCodePage: function loadCodePage() {
    var self = this;
    var requestId = (this._codePageRequestId || 0) + 1;
    this._codePageRequestId = requestId;
    this.setData({
      codePageLoadState: 'loading',
      codePageLoadingState: 'loading',
      codePageError: ''
    });
    return codexPage.load().then(function onLoaded(result) {
      if (self._codePageRequestId !== requestId) return result;
      var page = result && result.page ? result.page : null;
      self.setData({
        codePage: page,
        skills: result && Array.isArray(result.skills) ? result.skills : [],
        codePageLoadState: page ? 'ready' : 'empty',
        codePageLoadingState: 'success',
        codePageError: ''
      });
      return result;
    }).catch(function onLoadFailed(error) {
      if (self._codePageRequestId !== requestId) return null;
      self.setData({
        codePage: null,
        skills: [],
        codePageLoadState: 'error',
        codePageLoadingState: 'idle',
        codePageError: '暂时无法读取云端 Code 内容，请稍后重试。'
      });
      return null;
    });
  },

  onRetryCodePage: function onRetryCodePage() {
    this.loadCodePage();
  }
});
