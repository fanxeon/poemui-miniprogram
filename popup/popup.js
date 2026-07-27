var themeBehavior = require('../common/behaviors/theme');

var PLACEMENTS = ['top', 'bottom', 'left', 'right', 'center'];

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function isControlled(data) {
  return data.visible !== null && data.visible !== undefined;
}

function safeOverlayColor(value) {
  var color = String(value || '').trim();
  if (!color || /[;{}<>]/.test(color)) return '';
  if (/^(?:transparent|currentColor|#[0-9a-fA-F]{3,8}|rgba?\([^)]{1,80}\)|hsla?\([^)]{1,80}\)|var\(--[a-zA-Z0-9_-]+\))$/.test(color)) return color;
  return '';
}

function normalizePlacement(value) {
  return PLACEMENTS.indexOf(value) > -1 ? value : 'bottom';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    closeBtn: { type: Boolean, value: true },
    showHeader: { type: Boolean, value: false },
    title: { type: String, value: '' },
    subtitle: { type: String, value: '' },
    showFooter: { type: Boolean, value: false },
    closeOnOverlayClick: { type: Boolean, value: true },
    content: { type: String, value: '' },
    card: { type: Boolean, value: true },
    duration: { type: Number, value: 500 },
    overlayProps: { type: Object, value: {} },
    placement: { type: String, value: 'bottom' },
    preventScrollThrough: { type: Boolean, value: true },
    showOverlay: { type: Boolean, value: true },
    blurOverlay: { type: Boolean, value: false },
    usingCustomNavbar: { type: Boolean, value: false },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    zIndex: { type: Number, value: 11500 },
    ariaLabel: { type: String, value: '弹出层' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rendered: false,
    entered: false,
    rootClass: 'pui-popup pui-popup--top',
    layerStyle: 'z-index:11500;',
    motionStyle: '--pui-popup-duration:500ms;',
    overlayStyle: '',
    semanticLabel: '弹出层',
  },
  observers: {
    visible: function observeVisible() { this.syncVisibility(false); },
    'closeBtn,showHeader,title,subtitle,showFooter,card,placement,showOverlay,usingCustomNavbar,ariaLabel,reduceMotion,colorScheme': function observeLayout() { this.syncLayout(); },
    'duration,reduceMotion': function observeMotion() { this.syncMotion(); },
    overlayProps: function observeOverlay() { this.syncOverlay(); },
    zIndex: function observeZIndex() { this.syncLayer(); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._innerVisible = Boolean(this.data.defaultVisible);
      this.syncLayout();
      this.syncMotion();
      this.syncOverlay();
      this.syncLayer();
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
    syncLayout: function syncLayout() {
      var placement = normalizePlacement(this.data.placement);
      this.setData({
        rootClass: [
          'pui-popup',
          this.getColorSchemeClass(),
          'pui-popup--' + placement,
          this.data.card === false ? 'pui-popup--edge' : 'pui-popup--card',
          this.data.usingCustomNavbar ? 'pui-popup--custom-navbar' : '',
          this.data.reduceMotion ? 'pui-popup--reduced' : '',
        ].filter(Boolean).join(' '),
        semanticLabel: String(this.data.ariaLabel || '弹出层').trim() || '弹出层',
      });
    },
    syncMotion: function syncMotion() {
      this.setData({ motionStyle: '--pui-popup-duration:' + this.motionDuration() + 'ms;' });
    },
    syncOverlay: function syncOverlay() {
      var source = this.data.overlayProps && typeof this.data.overlayProps === 'object' && !Array.isArray(this.data.overlayProps) ? this.data.overlayProps : {};
      var color = safeOverlayColor(source.backgroundColor);
      this.setData({ overlayStyle: color ? 'background-color:' + color + ';' : '' });
    },
    syncLayer: function syncLayer() {
      this.setData({ layerStyle: 'z-index:' + Math.round(clamp(this.data.zIndex, 1, 12000, 11500)) + ';' });
    },
    currentVisible: function currentVisible() {
      return isControlled(this.data) ? Boolean(this.data.visible) : Boolean(this._innerVisible);
    },
    syncVisibility: function syncVisibility(initial) {
      if (!this._ready) return;
      this.applyVisibility(this.currentVisible(), Boolean(initial));
    },
    applyVisibility: function applyVisibility(visible, initial) {
      var self = this;
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      if (visible) {
        if (this.data.rendered && this.data.entered) return;
        this.setData({ rendered: true, entered: false }, function mount() {
          self._enterTimer = setTimeout(function enter() {
            if (!self._ready || !self.currentVisible()) return;
            self.setData({ entered: true });
          }, initial && self.data.reduceMotion ? 0 : 16);
        });
        return;
      }
      if (!this.data.rendered) return;
      this.setData({ entered: false });
      this._leaveTimer = setTimeout(function unmount() {
        if (!self._ready || self.currentVisible()) return;
        self.setData({ rendered: false });
      }, this.motionDuration());
    },
    requestClose: function requestClose(trigger) {
      if (!this.currentVisible()) return false;
      if (!isControlled(this.data)) {
        this._innerVisible = false;
        this.applyVisibility(false, false);
      }
      this.triggerEvent('visible-change', { visible: false, trigger: trigger });
      return true;
    },
    onCloseTap: function onCloseTap() {
      return this.requestClose('close-btn');
    },
    onOverlayTap: function onOverlayTap() {
      if (!this.data.closeOnOverlayClick) return false;
      return this.requestClose('overlay');
    },
    noop: function noop() {},
  },
});
