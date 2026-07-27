var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

var EASINGS = ['standard', 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}
function isControlled(data) { return data.visible !== null && data.visible !== undefined; }
function sourceOf(value, fallback) {
  if (typeof value === 'string' && value) return value;
  if (value && value.detail && value.detail.source) return value.detail.source;
  if (value && value.currentTarget && value.currentTarget.dataset && value.currentTarget.dataset.source) return value.currentTarget.dataset.source;
  return fallback || 'programmatic';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    content: { type: String, value: '' },
    showHeader: { type: Boolean, value: true },
    showClose: { type: Boolean, value: true },
    showHandle: { type: Boolean, value: true },
    draggable: { type: Boolean, value: true },
    dragThreshold: { type: Number, value: 120 },
    velocityThreshold: { type: Number, value: 0.6 },
    closeOnOverlayClick: { type: Boolean, value: true },
    showOverlay: { type: Boolean, value: true },
    customHeader: { type: Boolean, value: false },
    showFooter: { type: Boolean, value: false },
    customFooter: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '内容加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '内容加载失败' },
    retryText: { type: String, value: '重试' },
    empty: { type: Boolean, value: false },
    emptyText: { type: String, value: '暂无内容' },
    minHeight: { type: Number, value: 240 },
    height: { type: Number, value: 0 },
    maxHeight: { type: Number, value: 960 },
    zIndex: { type: Number, value: 1000 },
    safeArea: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '底部面板' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    innerVisible: false,
    stateType: 'content',
    popupClass: 'pui-sheet',
    popupStyle: '--pui-sheet-drag-offset:0rpx;',
    bodyStyle: 'min-height:240rpx;max-height:960rpx;',
    motionDuration: 500,
    motionEasing: 'var(--pui-ease-standard)',
    dragging: false,
    dragOffset: 0,
  },
  observers: {
    visible: function observeVisible() { this.syncVisibility(false); },
    'title,description,content,showHeader,showClose,showHandle,draggable,customHeader,showFooter,customFooter,disabled,loading,error,empty,minHeight,height,maxHeight,duration,easing,reduceMotion,colorScheme,customClass,customStyle': function observePresentation() { this.syncPresentation(); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._innerVisible = Boolean(this.data.defaultVisible);
      this.syncPresentation();
      this.syncVisibility(true);
    },
    detached: function detached() {
      this._ready = false;
      this.resetDrag(false);
      clearTimeout(this._visibilityTimer);
    },
  },
  methods: {
    motionConfig: function motionConfig() {
      var duration = this.data.reduceMotion ? 1 : Math.round(clamp(this.data.duration, 0, 1000, 500));
      var easing = EASINGS.indexOf(this.data.easing) > -1 ? this.data.easing : 'standard';
      return { duration: duration, easing: easing === 'standard' ? 'var(--pui-ease-standard)' : easing };
    },
    syncPresentation: function syncPresentation() {
      var stateType = this.data.error ? 'error' : this.data.loading ? 'loading' : this.data.empty ? 'empty' : 'content';
      var minHeight = Math.round(clamp(this.data.minHeight, 160, 1000, 240));
      var maxHeight = Math.round(clamp(this.data.maxHeight, minHeight, 1200, 960));
      var requestedHeight = Math.round(clamp(this.data.height, 0, 1200, 0));
      var height = requestedHeight ? Math.max(minHeight, Math.min(maxHeight, requestedHeight)) : 0;
      var motion = this.motionConfig();
      this.setData({
        stateType: stateType,
        popupClass: ['pui-sheet', this.data.dragging ? 'pui-sheet--dragging' : '', this.data.disabled ? 'pui-sheet--disabled' : '', this.data.reduceMotion ? 'pui-sheet--reduced' : '', this.data.customClass].filter(Boolean).join(' '),
        popupStyle: [this.data.customStyle, '--pui-sheet-drag-offset:' + Math.max(0, Math.round(Number(this.data.dragOffset) || 0)) + 'rpx;', '--pui-sheet-duration:' + motion.duration + 'ms;', '--pui-sheet-ease:' + motion.easing + ';'].filter(Boolean).join(';'),
        bodyStyle: 'min-height:' + minHeight + 'rpx;max-height:' + maxHeight + 'rpx;' + (height ? 'height:' + height + 'rpx;' : ''),
        motionDuration: motion.duration,
        motionEasing: motion.easing,
      });
    },
    syncVisibility: function syncVisibility(initial) {
      if (!this._ready) return;
      var visible = isControlled(this.data) ? Boolean(this.data.visible) : Boolean(this._innerVisible);
      if (initial || visible !== Boolean(this.data.innerVisible)) this.setData({ innerVisible: visible });
      this.scheduleVisibilityLifecycle(visible, initial ? 'initial' : 'property', Boolean(initial));
    },
    scheduleVisibilityLifecycle: function scheduleVisibilityLifecycle(visible, source, initial) {
      if (this._lastPopupVisible === visible) return;
      this._lastPopupVisible = visible;
      clearTimeout(this._visibilityTimer);
      var component = this;
      this._visibilityTimer = setTimeout(function afterPopupMotion() {
        if (!component._ready || component._lastPopupVisible !== visible) return;
        if (visible) component.triggerEvent('after-open', { visible: true, source: source || 'property' });
        else {
          component.resetDrag(true);
          component.triggerEvent('after-close', { visible: false, source: source || 'property' });
        }
      }, initial && component.data.reduceMotion ? 0 : component.motionConfig().duration);
    },
    requestVisibility: function requestVisibility(visible, source) {
      var next = Boolean(visible);
      if (next === Boolean(this.data.innerVisible)) return false;
      var controlled = isControlled(this.data);
      this._pendingMotionSource = source || 'programmatic';
      if (!controlled) {
        this._innerVisible = next;
        this.setData({ innerVisible: next });
      }
      var detail = { visible: next, source: source || 'programmatic', controlled: controlled };
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent(next ? 'open' : 'close', detail);
      this.scheduleVisibilityLifecycle(next, source || 'programmatic', false);
      return true;
    },
    open: function open(source) {
      this.resetDrag(true);
      return this.requestVisibility(true, sourceOf(source, 'programmatic'));
    },
    close: function close(source) {
      this.resetDrag(true);
      return this.requestVisibility(false, sourceOf(source, 'programmatic'));
    },
    retry: function retry(source) {
      if (!this.data.error || this.data.disabled) return false;
      this.triggerEvent('retry', { source: sourceOf(source, 'programmatic') });
      return true;
    },
    onRetry: function onRetry() { return this.retry('button'); },
    onCloseTap: function onCloseTap() {
      if (this.data.disabled) return false;
      return this.close('close');
    },
    onPopupVisibleChange: function onPopupVisibleChange(event) {
      var trigger = event && event.detail ? event.detail.trigger : 'overlay';
      if (trigger === 'overlay') {
        var canClose = Boolean(this.data.closeOnOverlayClick && !this.data.disabled);
        this.triggerEvent('overlay-click', { source: 'overlay', close: canClose });
        if (!canClose) return false;
      }
      return this.close(trigger === 'close-btn' ? 'close' : trigger);
    },
    onScroll: function onScroll(event) {
      var detail = event && event.detail ? event.detail : {};
      this.triggerEvent('scroll', { scrollTop: Number(detail.scrollTop) || 0, scrollHeight: Number(detail.scrollHeight) || 0, deltaY: Number(detail.deltaY) || 0, source: 'content' });
    },
    getRpxScale: function getRpxScale() {
      if (this._rpxScale) return this._rpxScale;
      var windowWidth = 375;
      try {
        windowWidth = Number(platformInfo.getWindowInfo().windowWidth) || windowWidth;
      } catch (error) {}
      this._rpxScale = 750 / Math.max(1, windowWidth);
      return this._rpxScale;
    },
    onDragStart: function onDragStart(event) {
      if (!this.data.draggable || this.data.disabled || !this.data.innerVisible) return false;
      var point = event.touches && event.touches[0];
      if (!point) return false;
      this._dragStartY = Number(point.clientY) || 0;
      this._dragStartTime = Date.now();
      this._dragLastOffset = 0;
      var component = this;
      this.setData({ dragging: true, dragOffset: 0 }, function syncDragStart() { component.syncPresentation(); });
      this.triggerEvent('drag-start', { offset: 0, source: 'handle' });
      return true;
    },
    onDragMove: function onDragMove(event) {
      if (!this.data.dragging || this._dragStartY === undefined) return false;
      var point = event.touches && event.touches[0];
      if (!point) return false;
      var offset = Math.max(0, (Number(point.clientY) - this._dragStartY) * this.getRpxScale());
      this._dragLastOffset = offset;
      var component = this;
      this.setData({ dragOffset: offset }, function syncDragMove() { component.syncPresentation(); });
      this.triggerEvent('dragging', { offset: offset, source: 'handle' });
      return true;
    },
    finishDrag: function finishDrag(cancelled) {
      if (this._dragStartY === undefined) return false;
      var offset = Math.max(0, Number(this._dragLastOffset) || 0);
      var elapsed = Math.max(1, Date.now() - (this._dragStartTime || Date.now()));
      var velocity = offset / elapsed;
      var threshold = clamp(this.data.dragThreshold, 40, 480, 120);
      var velocityThreshold = clamp(this.data.velocityThreshold, 0.1, 3, 0.6);
      var shouldClose = !cancelled && (offset >= threshold || velocity >= velocityThreshold);
      this._dragStartY = undefined;
      this._dragStartTime = 0;
      this._dragLastOffset = 0;
      var component = this;
      this.setData({ dragging: false, dragOffset: 0 }, function syncDragEnd() { component.syncPresentation(); });
      this.triggerEvent('drag-end', { offset: offset, velocity: velocity, close: shouldClose, cancelled: Boolean(cancelled), source: 'drag' });
      if (shouldClose) this.requestVisibility(false, 'drag');
      return shouldClose;
    },
    onDragEnd: function onDragEnd() { return this.finishDrag(false); },
    onDragCancel: function onDragCancel() { return this.finishDrag(true); },
    resetDrag: function resetDrag(update) {
      this._dragStartY = undefined;
      this._dragStartTime = 0;
      this._dragLastOffset = 0;
      if (update !== false && this._ready) {
        var component = this;
        this.setData({ dragging: false, dragOffset: 0 }, function syncDragReset() { component.syncPresentation(); });
      }
    },
    noop: function noop() {},
  },
});
