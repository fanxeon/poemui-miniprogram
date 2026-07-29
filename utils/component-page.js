var backgroundPreference = require('../common/utils/page-background-preference');

function getWindowHeight() {
  return wx.getWindowInfo ? wx.getWindowInfo().windowHeight : 0;
}

function createComponentPage(config) {
  var source = config || {};
  var page = {
    data: Object.assign({
      pageTitle: source.title || '',
      navbarHeight: 'var(--pui-navbar-content-height-fallback)',
      scrollAreaHeight: '1px',
      layoutReady: false,
      backgroundGradientEnabled: backgroundPreference.get()
    }, source.data || {}),

    onLoad: function () {
      var self = this;
      backgroundPreference.restore();
      this._unsubscribeBackgroundPreference = backgroundPreference.subscribe(function onBackgroundPreferenceChange(gradientEnabled) {
        self.setData({ backgroundGradientEnabled: Boolean(gradientEnabled) });
      });
      this._windowResizeHandler = this.onWindowResize.bind(this);
      if (wx.onWindowResize) {
        wx.onWindowResize(this._windowResizeHandler);
      }
      if (typeof source.onLoad === 'function') {
        source.onLoad.call(this);
      }
    },

    onShow: function () {
      this.scheduleMeasureLayout();
      if (typeof source.onShow === 'function') {
        source.onShow.call(this);
      }
    },

    onReady: function () {
      this.scheduleMeasureLayout();
      if (typeof source.onReady === 'function') {
        source.onReady.call(this);
      }
    },

    onUnload: function () {
      clearTimeout(this._measureTimer);
      if (this._unsubscribeBackgroundPreference) this._unsubscribeBackgroundPreference();
      if (wx.offWindowResize && this._windowResizeHandler) {
        wx.offWindowResize(this._windowResizeHandler);
      }
      if (typeof source.onUnload === 'function') {
        source.onUnload.call(this);
      }
    },

    onWindowResize: function () {
      this.scheduleMeasureLayout();
    },

    scheduleMeasureLayout: function () {
      clearTimeout(this._measureTimer);
      this._measureTimer = setTimeout(this.measureLayout.bind(this), 0);
    },

    measureLayout: function () {
      var windowHeight = Number(getWindowHeight());
      if (!windowHeight || !this.createSelectorQuery) {
        return;
      }

      this.createSelectorQuery()
        .select('#component-navbar')
        .boundingClientRect(function (navbarRect) {
          var navbarHeight = navbarRect && Number(navbarRect.height);
          if (!navbarHeight) {
            return;
          }
          var layout = {
            navbarHeight: Math.max(1, Math.floor(navbarHeight)),
            scrollAreaHeight: Math.max(1, Math.floor(windowHeight - navbarHeight))
          };
          this.setData({
            navbarHeight: layout.navbarHeight + 'px',
            scrollAreaHeight: layout.scrollAreaHeight + 'px',
            layoutReady: true
          });
          if (typeof source.onLayoutMeasured === 'function') {
            source.onLayoutMeasured.call(this, layout);
          }
        }.bind(this))
        .exec();
    },

    onBack: function () {
      wx.navigateBack({
        delta: 1,
        fail: function () {
          wx.reLaunch({ url: '/pages/index/index' });
        }
      });
    },

    getPageFeedback: function () {
      if (typeof this.selectComponent !== 'function') return null;
      return this.selectComponent('#component-page-feedback');
    },

    showPageFeedback: function (options) {
      var feedback = this.getPageFeedback();
      return feedback && typeof feedback.show === 'function' ? feedback.show(options) : '';
    },

    updatePageFeedback: function (key, patch) {
      var feedback = this.getPageFeedback();
      return Boolean(feedback && typeof feedback.update === 'function' && feedback.update(key, patch));
    },

    hidePageFeedback: function (key) {
      var feedback = this.getPageFeedback();
      return Boolean(feedback && typeof feedback.hide === 'function' && feedback.hide(key));
    }
  };

  return Object.assign(page, source.methods || {});
}

module.exports = createComponentPage;
