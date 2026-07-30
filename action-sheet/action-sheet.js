var themeBehavior = require('../common/behaviors/theme');

var THEMES = ['list', 'grid'];
var ALIGNS = ['center', 'left'];

function isControlled(data) {
  return data.visible !== null && data.visible !== undefined;
}

function allowed(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function countPerPage(value) {
  var count = Math.floor(Number(value));
  return isFinite(count) && count > 0 ? count : 8;
}

function iconName(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof value.name === 'string') return value.name;
  return '';
}

function safeColor(value) {
  var color = typeof value === 'string' ? value.trim() : '';
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  if (/^rgba?\([0-9.,\s%]+\)$/i.test(color)) return color;
  if (/^hsla?\([0-9.,\s%deg]+\)$/i.test(color)) return color;
  if (/^[a-z]+$/i.test(color)) return color;
  if (/^var\(--pui-[a-z0-9-]+\)$/i.test(color)) return color;
  return '';
}

function normalizeItem(raw, index) {
  var primitive = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean';
  var item = primitive ? { label: raw } : (raw && typeof raw === 'object' ? raw : {});
  var labelValue = Object.prototype.hasOwnProperty.call(item, 'label') ? item.label : raw;
  var label = String(labelValue === null || labelValue === undefined ? '' : labelValue);
  var description = String(item.description === null || item.description === undefined ? '' : (item.description || ''));
  var color = safeColor(item.color);
  return {
    key: 'action-' + index,
    index: index,
    label: label,
    description: description,
    color: color,
    itemStyle: color ? 'color:' + color + ';' : '',
    disabled: Boolean(item.disabled),
    icon: iconName(item.icon),
    suffixIcon: iconName(item.suffixIcon),
    ariaLabel: label || description || ('选项 ' + (index + 1)),
    raw: raw,
  };
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeItem);
}

function chunk(items, count) {
  var pages = [];
  for (var index = 0; index < items.length; index += count) {
    pages.push({ key: 'page-' + pages.length, items: items.slice(index, index + count) });
  }
  return pages;
}

function nextTick(callback) {
  if (typeof wx !== 'undefined' && wx.nextTick) wx.nextTick(callback);
  else setTimeout(callback, 0);
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    align: { type: String, value: 'center' },
    blurOverlay: { type: null, value: null },
    cancelText: { type: String, value: '' },
    count: { type: Number, value: 8 },
    description: { type: String, value: '' },
    items: { type: Array, value: [] },
    showCancel: { type: Boolean, value: true },
    showOverlay: { type: Boolean, value: true },
    theme: { type: String, value: 'list' },
    usingCustomNavbar: { type: Boolean, value: false },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '动作面板' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    mounted: false,
    active: false,
    phase: 'hidden',
    normalizedItems: [],
    gridPages: [],
    gridPage: 0,
    rootClass: 'pui-action-sheet pui-action-sheet--list pui-action-sheet--align-center',
    maskClass: 'pui-action-sheet__mask',
    layerStyle: '--pui-action-sheet-duration:500ms;',
  },
  observers: {
    visible: function observeVisible() { this.syncVisibility(false); },
    items: function observeItems() { this.syncItems(); },
    'theme,count,align,blurOverlay,usingCustomNavbar,reduceMotion,colorScheme': function observePresentation() {
      this.syncPresentation();
      this.restartMotionTimer();
    },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._innerVisible = Boolean(this.data.defaultVisible);
      this.syncItems();
      this.syncPresentation();
      this.syncVisibility(true);
    },
    detached: function detached() {
      this._ready = false;
      this.clearTimers();
    },
  },
  methods: {
    motionDuration: function motionDuration() {
      return this.data.reduceMotion ? 1 : 500;
    },
    currentVisible: function currentVisible() {
      return isControlled(this.data) ? Boolean(this.data.visible) : Boolean(this._innerVisible);
    },
    syncItems: function syncItems() {
      var items = normalizeItems(this.data.items);
      var pages = chunk(items, countPerPage(this.data.count));
      var page = Math.min(Math.max(0, this.data.gridPage || 0), Math.max(0, pages.length - 1));
      this.setData({ normalizedItems: items, gridPages: pages, gridPage: page });
    },
    syncPresentation: function syncPresentation() {
      var theme = allowed(this.data.theme, THEMES, 'list');
      var align = allowed(this.data.align, ALIGNS, 'center');
      var classes = [
        'pui-action-sheet',
        this.getColorSchemeClass(),
        'pui-action-sheet--' + theme,
        'pui-action-sheet--align-' + align,
        this.data.usingCustomNavbar ? 'pui-action-sheet--custom-navbar' : '',
        this.data.reduceMotion ? 'pui-action-sheet--reduced' : '',
      ];
      this.setData({
        rootClass: classes.filter(Boolean).join(' '),
        maskClass: ['pui-action-sheet__mask', this.data.blurOverlay === true ? 'pui-action-sheet__mask--blurred' : '', this.data.blurOverlay === false ? 'pui-action-sheet__mask--clear' : ''].filter(Boolean).join(' '),
        layerStyle: '--pui-action-sheet-duration:' + this.motionDuration() + 'ms;',
      });
      this.syncItems();
    },
    syncVisibility: function syncVisibility(initial) {
      if (!this._ready) return;
      var target = this.currentVisible();
      if (this._renderedVisible === target && !initial) return;
      this._renderedVisible = target;
      this._visibilityVersion = (this._visibilityVersion || 0) + 1;
      var version = this._visibilityVersion;
      clearTimeout(this._motionTimer);
      if (target) {
        this.setData({ mounted: true, active: false, phase: 'entering' });
        var self = this;
        nextTick(function activatePanel() {
          if (!self._ready || self._visibilityVersion !== version || !self.currentVisible()) return;
          self.setData({ active: true, phase: 'entering' });
          self.schedulePhaseComplete('entering', version);
        });
      } else if (this.data.mounted) {
        this.setData({ active: false, phase: 'leaving' });
        this.schedulePhaseComplete('leaving', version);
      } else {
        this.setData({ mounted: false, active: false, phase: 'hidden' });
      }
    },
    schedulePhaseComplete: function schedulePhaseComplete(phase, version) {
      var self = this;
      clearTimeout(this._motionTimer);
      this._motionTimer = setTimeout(function completeMotion() {
        self._motionTimer = null;
        if (!self._ready || self._visibilityVersion !== version || self.data.phase !== phase) return;
        if (phase === 'entering' && self.currentVisible()) self.setData({ active: true, phase: 'entered' });
        if (phase === 'leaving' && !self.currentVisible()) self.setData({ mounted: false, active: false, phase: 'hidden' });
      }, this.motionDuration());
    },
    restartMotionTimer: function restartMotionTimer() {
      if (!this._ready || !this.data.mounted || !['entering', 'leaving'].includes(this.data.phase)) return;
      this.schedulePhaseComplete(this.data.phase, this._visibilityVersion || 0);
    },
    requestVisible: function requestVisible(next) {
      var target = Boolean(next);
      if (this.currentVisible() === target) return false;
      if (!isControlled(this.data)) {
        this._innerVisible = target;
        this.syncVisibility(false);
      }
      this.triggerEvent('visible-change', { visible: target });
      return true;
    },
    requestClose: function requestClose(trigger) {
      this.triggerEvent('close', { trigger: trigger });
      return this.requestVisible(false);
    },
    onOverlayTap: function onOverlayTap() {
      this.requestClose('overlay');
    },
    onCancelTap: function onCancelTap() {
      this.triggerEvent('cancel');
      this.requestClose('cancel');
    },
    onItemTap: function onItemTap(event) {
      var index = Number(event.currentTarget.dataset.index);
      var item = this.data.normalizedItems[index];
      if (!item || item.disabled) return;
      this.triggerEvent('selected', { selected: item.raw, index: item.index });
      this.requestClose('select');
    },
    onSwiperChange: function onSwiperChange(event) {
      var current = event && event.detail ? Number(event.detail.current) : 0;
      this.setData({ gridPage: isFinite(current) && current >= 0 ? current : 0 });
    },
    clearTimers: function clearTimers() {
      clearTimeout(this._motionTimer);
      this._motionTimer = null;
    },
    noop: function noop() {},
  },
});
