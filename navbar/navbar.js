var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

var NAVBAR_DURATION = 500;

function clamp(value, min, max, fallback) {
  var number = Math.round(Number(value));
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function truncate(value, length) {
  var text = value === null || value === undefined ? '' : String(value);
  var maxLength = Math.max(0, Math.round(Number(length) || 0));
  return maxLength && text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function px(value) {
  return (Math.round(value * 2) / 2) + 'px';
}

function resolveNavbarGeometry(capsule, safeAreaInsetTop) {
  try {
    if (typeof wx === 'undefined') return '';
    var windowInfo = platformInfo.getWindowInfo();
    var statusBarHeight = Number(windowInfo && windowInfo.statusBarHeight);
    var styles = [];

    if (safeAreaInsetTop && isFinite(statusBarHeight) && statusBarHeight >= 0) {
      styles.push('--pui-navbar-safe-height:' + px(statusBarHeight));
    }
    if (!capsule || typeof wx.getMenuButtonBoundingClientRect !== 'function') return styles.join(';');

    var rect = wx.getMenuButtonBoundingClientRect() || {};
    var windowWidth = Number(windowInfo && windowInfo.windowWidth);
    var left = Number(rect.left);
    var right = Number(rect.right);
    var top = Number(rect.top);
    var bottom = Number(rect.bottom);
    var width = Number(rect.width);
    var height = Number(rect.height);

    if ((!isFinite(width) || width <= 0) && isFinite(left) && isFinite(right)) width = right - left;
    if ((!isFinite(height) || height <= 0) && isFinite(top) && isFinite(bottom)) height = bottom - top;
    if (!isFinite(right) && isFinite(left) && isFinite(width)) right = left + width;
    if (!isFinite(bottom) && isFinite(top) && isFinite(height)) bottom = top + height;

    if (
      !isFinite(windowWidth) || !isFinite(left) || !isFinite(right) ||
      !isFinite(top) || !isFinite(bottom) || !isFinite(width) || !isFinite(height) ||
      windowWidth <= 0 || left < 0 || right <= left || right > windowWidth ||
      top < 0 || bottom <= top || width <= 0 || height <= 0
    ) {
      return styles.join(';');
    }

    var safeTop = safeAreaInsetTop && isFinite(statusBarHeight) && statusBarHeight >= 0
      ? statusBarHeight
      : 0;
    var capsuleTopGap = Math.max(0, top - safeTop);
    var capsuleInsetRight = Math.max(0, windowWidth - right);
    var capsuleReserve = windowWidth - left;
    var contentHeight = capsuleTopGap * 2 + height;

    styles.push('--pui-navbar-content-height:' + px(contentHeight));
    styles.push('--pui-navbar-capsule-width:' + px(width));
    styles.push('--pui-navbar-capsule-height:' + px(height));
    styles.push('--pui-navbar-capsule-inset-right:' + px(capsuleInsetRight));
    styles.push('--pui-navbar-capsule-mirror-left:' + px(capsuleInsetRight));
    styles.push('--pui-navbar-capsule-reserve:' + px(capsuleReserve));
    return styles.join(';');
  } catch (error) {
    return '';
  }
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    title: { type: String, value: '' },
    titleMaxLength: { type: Number, value: 0 },
    leftArrow: { type: Boolean, value: false },
    leftBtn: { type: Object, value: null },
    rightBtn: { type: Object, value: null },
    fixed: { type: Boolean, value: true },
    placeholder: { type: Boolean, value: false },
    safeAreaInsetTop: { type: Boolean, value: true },
    capsule: { type: Boolean, value: true },
    visible: { type: Boolean, value: true },
    zIndex: { type: Number, value: 1000 },
    loading: { type: Boolean, value: false },
    transparent: { type: Boolean, value: false },
    bordered: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: 'pui-navbar',
    rootStyle: '',
    titleText: '',
    semanticLabel: '导航栏',
    resolvedDuration: NAVBAR_DURATION,
    showNode: true,
    motionPhase: 'entering',
  },
  observers: {
    'title,titleMaxLength,leftArrow,fixed,placeholder,safeAreaInsetTop,capsule,visible,zIndex,loading,transparent,bordered,disabled,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
    },
    detached: function detached() {
      clearTimeout(this.motionTimer);
      this.motionTimer = null;
      if (typeof wx !== 'undefined' && typeof wx.offWindowResize === 'function' && this._windowResizeHandler) {
        wx.offWindowResize(this._windowResizeHandler);
      }
      this._windowResizeHandler = null;
    },
  },
  methods: {
    syncState: function syncState() {
      var duration = this.data.reduceMotion ? 1 : NAVBAR_DURATION;
      var title = truncate(this.data.title, this.data.titleMaxLength);
      var zIndex = clamp(this.data.zIndex, 1, 12000, 1000);
      var navbarGeometry = resolveNavbarGeometry(this.data.capsule, this.data.safeAreaInsetTop);
      if (!this._windowResizeHandler && typeof wx !== 'undefined' && typeof wx.onWindowResize === 'function') {
        this._windowResizeHandler = this.syncState.bind(this);
        wx.onWindowResize(this._windowResizeHandler);
      }
      this.setData({
        titleText: title,
        resolvedDuration: duration,
        semanticLabel: String(this.data.ariaLabel || '').trim() || title || '导航栏',
        rootStyle: '--pui-navbar-duration:' + duration + 'ms;z-index:' + zIndex + ';' + (navbarGeometry ? navbarGeometry + ';' : ''),
      }, this.syncVisibility.bind(this));
    },
    syncVisibility: function syncVisibility() {
      var nextVisible = !!this.data.visible;
      var previousVisible = this._lastVisible;
      this._lastVisible = nextVisible;
      if (previousVisible === undefined) {
        if (!nextVisible) {
          this.setData({ showNode: false, motionPhase: 'hidden' }, this.updatePresentation.bind(this));
          return;
        }
        this.setData({ showNode: true, motionPhase: 'entering' }, this.updatePresentation.bind(this));
        this.scheduleVisible();
        return;
      }
      if (previousVisible === nextVisible) {
        if (!nextVisible && this.data.motionPhase === 'leaving') this.scheduleHidden();
        this.updatePresentation();
        return;
      }
      clearTimeout(this.motionTimer);
      this.motionTimer = null;
      if (nextVisible) {
        this.setData({ showNode: true, motionPhase: 'entering' }, this.updatePresentation.bind(this));
        this.scheduleVisible();
        return;
      }
      this.setData({ motionPhase: 'leaving' }, this.updatePresentation.bind(this));
      this.scheduleHidden();
    },
    scheduleVisible: function scheduleVisible() {
      var self = this;
      clearTimeout(this.motionTimer);
      this.motionTimer = setTimeout(function enterNavbar() {
        self.motionTimer = null;
        self.setData({ motionPhase: 'visible' }, self.updatePresentation.bind(self));
      }, 16);
    },
    scheduleHidden: function scheduleHidden() {
      var self = this;
      clearTimeout(this.motionTimer);
      this.motionTimer = setTimeout(function hideNavbar() {
        self.motionTimer = null;
        self.setData({ showNode: false, motionPhase: 'hidden' }, self.updatePresentation.bind(self));
      }, this.data.resolvedDuration);
    },
    updatePresentation: function updatePresentation() {
      this.setData({
        rootClass: [
          'pui-navbar',
          this.getColorSchemeClass(),
          this.data.fixed ? 'pui-navbar--fixed' : '',
          this.data.safeAreaInsetTop ? 'pui-navbar--safe-top' : '',
          this.data.capsule ? 'pui-navbar--with-capsule' : '',
          this.data.transparent ? 'pui-navbar--transparent' : '',
          this.data.bordered ? 'pui-navbar--bordered' : 'pui-navbar--borderless',
          this.data.disabled ? 'pui-navbar--disabled' : '',
          'pui-navbar--' + this.data.motionPhase,
        ].filter(Boolean).join(' '),
      });
    },
    onLeftClick: function onLeftClick() {
      if (this.data.disabled || !this.data.leftArrow) return;
      this.triggerEvent('left-click', { source: 'left' });
    },
    onLeftBtnClick: function onLeftBtnClick() {
      if (this.data.disabled || !this.data.leftBtn) return;
      this.triggerEvent('leftBtn', { source: 'leftBtn' });
    },
    onRightBtnClick: function onRightBtnClick() {
      if (this.data.disabled || !this.data.rightBtn) return;
      this.triggerEvent('rightBtn', { source: 'rightBtn' });
    },
  },
});
