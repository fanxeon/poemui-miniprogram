var themeBehavior = require('../common/behaviors/theme');

function isControlled(data) {
  return data.value !== null && data.value !== undefined;
}

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function unit(value, fallback) {
  if (typeof value === 'string') {
    var parsed = parseFloat(value);
    return isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }
  return clamp(value, 0, 10000, fallback);
}

function statusTexts(value) {
  var fallback = ['下拉刷新', '松手刷新', '正在刷新', '刷新完成'];
  if (!Array.isArray(value)) return fallback;
  return fallback.map(function (item, index) {
    return typeof value[index] === 'string' && value[index] ? value[index] : item;
  });
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    disabled: { type: Boolean, value: false },
    enableBackToTop: { type: Boolean, value: true },
    enablePassive: { type: Boolean, value: false },
    loadingBarHeight: { type: null, value: 50 },
    loadingProps: { type: Object, value: {} },
    loadingTexts: { type: Array, value: [] },
    lowerThreshold: { type: null, value: 50 },
    maxBarHeight: { type: null, value: 80 },
    refreshTimeout: { type: Number, value: 3000 },
    scrollIntoView: { type: String, value: '' },
    showScrollbar: { type: Boolean, value: true },
    successDuration: { type: null, value: 500 },
    upperThreshold: { type: null, value: 50 },
    usingCustomNavbar: { type: Boolean, value: false },
    value: { type: null, value: null },
    defaultValue: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '下拉刷新区域' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    activeValue: false,
    refreshStatus: -1,
    barHeight: 0,
    tipsHeight: 0,
    loosing: false,
    enableToRefresh: true,
    scrollTop: 0,
    rootClass: 'pui-pull-refresh pui-pull-refresh--idle',
    rootStyle: '--pui-pull-refresh-duration:500ms;--pui-pull-refresh-ease:var(--pui-ease-standard);',
    loadingTextList: ['下拉刷新', '松手刷新', '正在刷新', '刷新完成'],
  },
  observers: {
    'value,defaultValue,loadingBarHeight,maxBarHeight,loadingTexts,successDuration,reduceMotion,colorScheme': function () {
      this.syncPresentation();
      this.syncValue(false);
    },
  },
  lifetimes: {
    attached: function () {
      this._ready = true;
      this._innerValue = Boolean(this.data.defaultValue);
      this._gesture = null;
      this._refreshTimer = null;
      this._resultTimer = null;
      this.syncPresentation();
      this.syncValue(true);
    },
    detached: function () {
      this._ready = false;
      this.clearTimers();
      this._gesture = null;
    },
  },
  methods: {
    motionDuration: function () {
      return this.data.reduceMotion ? 1 : 500;
    },
    loadingHeight: function () {
      return unit(this.data.loadingBarHeight, 50);
    },
    maxHeight: function () {
      return Math.max(this.loadingHeight(), unit(this.data.maxBarHeight, 80));
    },
    currentValue: function () {
      return isControlled(this.data) ? Boolean(this.data.value) : Boolean(this._innerValue);
    },
    syncPresentation: function () {
      var status = this.data.refreshStatus;
      this.setData({
        loadingTextList: statusTexts(this.data.loadingTexts),
        rootClass: [
          'pui-pull-refresh',
          'pui-theme--' + (this.data.colorScheme || 'light'),
          'pui-pull-refresh--' + ({ '-1': 'idle', 0: 'pulling', 1: 'ready', 2: 'loading', 3: 'complete' }[status] || 'idle'),
          this.data.loosing ? 'pui-pull-refresh--loosing' : '',
          this.data.disabled ? 'pui-pull-refresh--disabled' : '',
          this.data.reduceMotion ? 'pui-pull-refresh--reduced' : '',
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-pull-refresh-duration:' + this.motionDuration() + 'ms;--pui-pull-refresh-ease:var(--pui-ease-standard);',
      });
    },
    setBar: function (height, status, loosing) {
      var next = Math.max(0, Number(height) || 0);
      this.setData({
        barHeight: next,
        tipsHeight: Math.min(next, this.loadingHeight()),
        refreshStatus: status,
        loosing: Boolean(loosing),
      }, this.syncPresentation.bind(this));
    },
    clearTimers: function () {
      clearTimeout(this._refreshTimer);
      clearTimeout(this._resultTimer);
      this._refreshTimer = null;
      this._resultTimer = null;
    },
    resetVisual: function () {
      this.setBar(0, -1, false);
    },
    settleComplete: function () {
      var self = this;
      this.clearTimers();
      this.setBar(this.loadingHeight(), 3, true);
      this._resultTimer = setTimeout(function () {
        self._resultTimer = null;
        if (!self.currentValue()) self.resetVisual();
      }, unit(this.data.successDuration, 500));
    },
    emitChange: function (value, source) {
      this.triggerEvent('change', { value: Boolean(value), source: source || 'touch', controlled: isControlled(this.data) });
    },
    syncValue: function (initial) {
      if (!this._ready && !initial) return;
      var active = this.currentValue();
      var previous = this.data.activeValue;
      if (active) {
        this.clearTimers();
        this.setBar(this.loadingHeight(), 2, true);
      } else if (previous && !initial) {
        this.settleComplete();
      } else if (!this._resultTimer) {
        this.resetVisual();
      }
      if (this.data.activeValue !== active) this.setData({ activeValue: active });
    },
    startRefresh: function () {
      if (this.data.disabled || this.currentValue()) return false;
      this.clearTimers();
      if (!isControlled(this.data)) this._innerValue = true;
      this.setData({ activeValue: true });
      this.setBar(this.loadingHeight(), 2, true);
      this.emitChange(true, 'touch');
      this.triggerEvent('refresh', { value: true, source: 'touch', controlled: isControlled(this.data) });
      var self = this;
      var timeout = Math.round(clamp(this.data.refreshTimeout, 0, 60000, 3000));
      if (timeout > 0) {
        this._refreshTimer = setTimeout(function () {
          self._refreshTimer = null;
          if (!self.currentValue()) return;
          self.triggerEvent('timeout', { timeout: timeout, source: 'timeout', controlled: isControlled(self.data) });
          if (!isControlled(self.data)) {
            self._innerValue = false;
            self.setData({ activeValue: false });
            self.resetVisual();
          }
          self.emitChange(false, 'timeout');
        }, timeout);
      }
      return true;
    },
    onScroll: function (event) {
      var top = Math.max(0, Number(event.detail && event.detail.scrollTop) || 0);
      this.setData({ scrollTop: top, enableToRefresh: top === 0 });
    },
    onScrollToTop: function () {
      this.setData({ scrollTop: 0, enableToRefresh: true });
    },
    onScrollToBottom: function (event) {
      this.triggerEvent('scrolltolower', event.detail || {});
    },
    onTouchStart: function (event) {
      if (this.data.disabled || this.currentValue() || !this.data.enableToRefresh) return;
      var touch = event.touches && event.touches[0];
      if (!touch || (event.touches && event.touches.length !== 1)) return;
      this._gesture = { x: Number(touch.pageX) || 0, y: Number(touch.pageY) || 0, active: false, cancelled: false };
    },
    onTouchMove: function (event) {
      var gesture = this._gesture;
      if (!gesture || this.data.disabled || this.currentValue()) return;
      var touch = event.touches && event.touches[0];
      if (!touch || (event.touches && event.touches.length !== 1)) return;
      var deltaX = (Number(touch.pageX) || 0) - gesture.x;
      var deltaY = (Number(touch.pageY) || 0) - gesture.y;
      if (!gesture.active && Math.abs(deltaX) > Math.abs(deltaY) + 6) {
        gesture.cancelled = true;
        return;
      }
      if (deltaY <= 0 || gesture.cancelled) return;
      if (!gesture.active) this.triggerEvent('dragstart', { source: 'touch', scrollTop: this.data.scrollTop });
      gesture.active = true;
      var height = Math.min(deltaY, this.maxHeight());
      var ready = height >= this.loadingHeight();
      this.setBar(height, ready ? 1 : 0, false);
      this.triggerEvent('dragging', { distance: height, percent: Math.min(1, height / this.loadingHeight()), status: ready ? 'ready' : 'pulling', source: 'touch' });
    },
    onTouchEnd: function () {
      var gesture = this._gesture;
      this._gesture = null;
      if (!gesture || gesture.cancelled || !gesture.active) return;
      var refresh = this.data.barHeight >= this.loadingHeight();
      this.triggerEvent('dragend', { distance: this.data.barHeight, refresh: refresh, source: 'touch' });
      if (refresh) this.startRefresh();
      else this.resetVisual();
    },
    onTouchCancel: function () {
      this._gesture = null;
      this.resetVisual();
    },
  },
});
