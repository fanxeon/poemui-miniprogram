var themeBehavior = require('../common/behaviors/theme');

var THEMES = ['loading', 'success', 'warning', 'error'];
var DIRECTIONS = ['row', 'column'];
var PLACEMENTS = ['top', 'middle', 'bottom'];
var THEME_ICONS = { success: 'success-circle', warning: 'warning-triangle', error: 'error-circle' };
var THEME_ACCENTS = { success: '#4ade80', warning: '#fbbf24', error: '#f87171' };

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.min(max, Math.max(min, number));
}

function allowed(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function plainObject(value) {
  return value && Object.prototype.toString.call(value) === '[object Object]' ? value : {};
}

function safeColor(value, fallback) {
  var color = String(value === null || value === undefined ? '' : value).trim();
  if (!color || /[;{}<>]/.test(color)) return fallback;
  if (/^#[\da-f]{3,8}$/i.test(color)) return color;
  if (/^(?:rgb|rgba|hsl|hsla)\([\d\s.,%+\-/]+\)$/i.test(color)) return color;
  if (/^var\(--[\w-]+(?:\s*,\s*[^;{}]+)?\)$/i.test(color)) return color;
  return /^[a-z]+$/i.test(color) ? color : fallback;
}

function nextTick(callback) {
  if (typeof wx !== 'undefined' && wx.nextTick) wx.nextTick(callback);
  else setTimeout(callback, 16);
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    direction: { type: String, value: 'row' },
    duration: { type: Number, value: 2000 },
    icon: { type: String, value: '' },
    message: { type: String, value: '' },
    overlayProps: { type: Object, value: null },
    placement: { type: String, value: 'middle' },
    preventScrollThrough: { type: Boolean, value: false },
    showOverlay: { type: Boolean, value: false },
    theme: { type: String, value: '' },
    usingCustomNavbar: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rendered: false,
    innerVisible: false,
    normalizedTheme: '',
    rootClass: 'pui-toast pui-toast--middle pui-toast--row',
    layerStyle: '',
    iconName: '',
    accentColor: '#ffffff',
    semanticLabel: '提示',
    ariaLive: 'polite',
    isLoading: false,
    overlayEnabled: false,
    overlayBackground: 'transparent',
    overlayZIndex: 12000,
    overlayDuration: 500,
    overlayPreventScrollThrough: false
  },
  observers: {
    'direction,duration,icon,message,overlayProps,placement,preventScrollThrough,showOverlay,theme,usingCustomNavbar,ariaLabel,reduceMotion,colorScheme': function syncPresentation() {
      this.syncPresentation();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncPresentation();
    },
    detached: function detached() {
      this._ready = false;
      this.clearTimers();
    }
  },
  methods: {
    clearTimers: function clearTimers() {
      clearTimeout(this._showTimer);
      clearTimeout(this._hideTimer);
      clearTimeout(this._autoTimer);
      this._showTimer = null;
      this._hideTimer = null;
      this._autoTimer = null;
    },
    motionDuration: function motionDuration() {
      return this.data.reduceMotion ? 1 : 500;
    },
    syncPresentation: function syncPresentation() {
      var overlay = plainObject(this.data.overlayProps);
      var theme = allowed(this.data.theme, THEMES, '');
      var direction = allowed(this.data.direction, DIRECTIONS, 'row');
      var placement = allowed(this.data.placement, PLACEMENTS, 'middle');
      var overlayEnabled = Boolean(this.data.showOverlay || this.data.preventScrollThrough);
      var duration = this.motionDuration();
      var label = String(this.data.ariaLabel || this.data.message || (theme === 'loading' ? '加载中' : '提示')).trim() || '提示';
      this.setData({
        normalizedTheme: theme,
        rootClass: ['pui-toast', this.getColorSchemeClass(), 'pui-toast--' + placement, 'pui-toast--' + direction, theme ? 'pui-toast--' + theme : '', this.data.usingCustomNavbar ? 'pui-toast--custom-navbar' : '', this.data.reduceMotion ? 'pui-toast--reduced-motion' : ''].filter(Boolean).join(' '),
        layerStyle: '--pui-toast-duration:' + duration + 'ms;',
        iconName: this.data.icon || THEME_ICONS[theme] || '',
        accentColor: THEME_ACCENTS[theme] || '#ffffff',
        semanticLabel: label,
        ariaLive: theme === 'error' ? 'assertive' : 'polite',
        isLoading: theme === 'loading' && !this.data.icon,
        overlayEnabled: overlayEnabled,
        overlayBackground: this.data.showOverlay ? safeColor(overlay.backgroundColor, 'rgba(9, 9, 11, 0.42)') : 'transparent',
        overlayZIndex: Math.round(clamp(overlay.zIndex, 1, 12000, 12000)),
        overlayDuration: this.data.reduceMotion ? 1 : Math.round(clamp(overlay.duration, 0, 1000, 500)),
        overlayPreventScrollThrough: Boolean(this.data.preventScrollThrough || overlay.preventScrollThrough)
      });
    },
    show: function show(options) {
      var self = this;
      var input = plainObject(options);
      var patch = {};
      ['direction', 'duration', 'icon', 'message', 'overlayProps', 'placement', 'preventScrollThrough', 'showOverlay', 'theme', 'usingCustomNavbar', 'ariaLabel', 'reduceMotion'].forEach(function copyToastOption(key) {
        if (Object.prototype.hasOwnProperty.call(input, key)) patch[key] = input[key];
      });
      this.clearTimers();
      this.setData(patch, function afterOptions() {
        self.syncPresentation();
        self.setData({ rendered: true, innerVisible: false }, function afterMount() {
          self._showTimer = setTimeout(function activateToast() {
            self._showTimer = null;
            if (!self._ready || !self.data.rendered) return;
            self.setData({ innerVisible: true });
            self.scheduleAutoHide();
          }, 16);
        });
      });
    },
    hide: function hide() {
      var self = this;
      if (!this.data.rendered) return;
      this.clearTimers();
      this.setData({ innerVisible: false });
      this._hideTimer = setTimeout(function finishHide() {
        self._hideTimer = null;
        if (!self._ready || self.data.innerVisible) return;
        self.setData({ rendered: false, innerVisible: false });
        self.triggerEvent('close');
      }, this.motionDuration());
    },
    scheduleAutoHide: function scheduleAutoHide() {
      var self = this;
      clearTimeout(this._autoTimer);
      this._autoTimer = null;
      var duration = Math.round(clamp(this.data.duration, 0, 60000, 2000));
      if (!duration || !this.data.innerVisible) return;
      this._autoTimer = setTimeout(function autoHide() {
        self._autoTimer = null;
        self.hide();
      }, duration);
    }
  }
});
