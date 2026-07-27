var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.min(max, Math.max(min, number));
}

function safeColor(value) {
  var color = String(value === null || value === undefined ? '' : value).trim();
  if (!color || /[;{}<>]/.test(color)) return '';
  if (/^#[\da-f]{3,8}$/i.test(color)) return color;
  if (/^(?:rgb|rgba|hsl|hsla)\([\d\s.,%+\-/]+\)$/i.test(color)) return color;
  if (/^var\(--[\w-]+(?:\s*,\s*[^;{}]+)?\)$/i.test(color)) return color;
  if (/^[a-z]+$/i.test(color)) return color;
  return '';
}

function customNavbarDistance(enabled) {
  if (!enabled || typeof wx === 'undefined' || !wx.getMenuButtonBoundingClientRect) return 0;
  try {
    var info = platformInfo.getWindowInfo();
    var capsule = wx.getMenuButtonBoundingClientRect() || {};
    var statusBarHeight = Math.max(0, Number(info.statusBarHeight) || 0);
    return Math.max(0, Math.round((Number(capsule.top) || 0) + (Number(capsule.bottom) || 0) - statusBarHeight));
  } catch (error) {
    return 0;
  }
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    visible: { type: Boolean, value: false },
    backgroundColor: { type: String, value: '' },
    blur: { type: Boolean, value: false },
    duration: { type: Number, value: 500 },
    preventScrollThrough: { type: Boolean, value: true },
    usingCustomNavbar: { type: Boolean, value: false },
    zIndex: { type: Number, value: 11000 },
    ariaLabel: { type: String, value: '关闭遮罩' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rendered: false,
    entered: false,
    rootClass: 'pui-overlay-layer',
    layerStyle: 'z-index:11000;top:0px;--pui-overlay-duration:500ms;',
    semanticLabel: '关闭遮罩',
  },
  observers: {
    visible: function observeVisible() { this.syncVisibility(false); },
    'backgroundColor,blur,duration,usingCustomNavbar,zIndex,ariaLabel,reduceMotion,colorScheme': function observePresentation() { this.syncPresentation(); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncPresentation();
      this.syncVisibility(true);
    },
    detached: function detached() {
      this._ready = false;
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
    },
  },
  methods: {
    motionDuration: function motionDuration() {
      return this.data.reduceMotion ? 1 : Math.round(clamp(this.data.duration, 0, 1000, 500));
    },
    syncPresentation: function syncPresentation() {
      var color = safeColor(this.data.backgroundColor);
      var duration = this.motionDuration();
      var top = customNavbarDistance(this.data.usingCustomNavbar);
      this.setData({
        rootClass: [
          'pui-overlay-layer',
          this.getColorSchemeClass(),
          this.data.blur ? 'pui-overlay-layer--blurred' : '',
          this.data.reduceMotion ? 'pui-overlay-layer--reduced' : '',
        ].filter(Boolean).join(' '),
        layerStyle: [
          'z-index:' + Math.round(clamp(this.data.zIndex, 1, 12000, 11000)),
          'top:' + top + 'px',
          '--pui-overlay-duration:' + duration + 'ms',
          color ? '--pui-overlay-background:' + color : '',
        ].filter(Boolean).join(';') + ';',
        semanticLabel: String(this.data.ariaLabel || '关闭遮罩').trim() || '关闭遮罩',
      });
    },
    syncVisibility: function syncVisibility(initial) {
      var self = this;
      if (!this._ready) return;
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      if (this.data.visible) {
        if (this.data.rendered && this.data.entered) return;
        this.setData({ rendered: true, entered: false }, function mount() {
          self._enterTimer = setTimeout(function enter() {
            if (!self._ready || !self.data.visible) return;
            self.setData({ entered: true });
          }, initial && self.data.reduceMotion ? 0 : 16);
        });
        return;
      }
      if (!this.data.rendered) return;
      this.setData({ entered: false });
      this._leaveTimer = setTimeout(function unmount() {
        if (!self._ready || self.data.visible) return;
        self.setData({ rendered: false });
      }, this.motionDuration());
    },
    onTap: function onTap() {
      if (!this.data.visible || !this.data.entered) return false;
      this.triggerEvent('click', { visible: false });
      return true;
    },
    noop: function noop() {},
  },
});
