var canvasPreference = require('../common/utils/home-canvas-preference');

function getWindowHeight() {
  return wx.getWindowInfo ? wx.getWindowInfo().windowHeight : 0;
}

function createComponentPage(config) {
  var source = config || {};
  var page = {
    data: Object.assign({
      pageTitle: source.title || '',
      scrollAreaHeight: '1px',
      layoutReady: false,
      canvasGradientEnabled: canvasPreference.get()
    }, source.data || {}),

    onLoad: function () {
      var self = this;
      canvasPreference.restore();
      this._unsubscribeCanvasPreference = canvasPreference.subscribe(function onCanvasPreferenceChange(gradientEnabled) {
        self.setData({ canvasGradientEnabled: Boolean(gradientEnabled) });
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
      if (this._unsubscribeCanvasPreference) this._unsubscribeCanvasPreference();
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
          this.setData({
            scrollAreaHeight: Math.max(1, Math.floor(windowHeight - navbarHeight)) + 'px',
            layoutReady: true
          });
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
    }
  };

  return Object.assign(page, source.methods || {});
}

module.exports = createComponentPage;
