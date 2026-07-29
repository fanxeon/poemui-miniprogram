var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

var ACTION_WIDTH = 136;
var MOTION_DURATION = 500;
var OPEN_THRESHOLD = 0.3;
var instances = [];

function actionWidthFromStyle(style, rpxScale) {
  var matched = String(style || '').match(/(?:^|;)\s*width\s*:\s*(\d+(?:\.\d+)?)\s*(rpx|px)\b/i);
  if (!matched) return ACTION_WIDTH;
  var value = Number(matched[1]);
  if (!Number.isFinite(value) || value <= 0) return ACTION_WIDTH;
  return matched[2].toLowerCase() === 'px' ? value * rpxScale : value;
}

function normalizeActions(actions, position, rpxScale) {
  var source = Array.isArray(actions) ? actions : [];
  return source.map(function mapAction(action, index) {
    var item = action && typeof action === 'object' ? action : { text: action };
    var style = item.style || '';
    var theme = ['default', 'primary', 'success', 'warning', 'danger'].indexOf(item.theme) > -1 ? item.theme : 'primary';
    return {
      _key: position + '-' + index,
      text: item.text === undefined || item.text === null ? '' : String(item.text),
      icon: item.icon || '',
      theme: theme,
      themeClass: 'pui-swipe-cell__action-wrap--' + theme,
      className: item.className || '',
      style: style,
      width: actionWidthFromStyle(style, rpxScale),
    };
  });
}

function positionFromOpened(opened, leftItems, rightItems) {
  if (Array.isArray(opened)) {
    if (opened[1] && rightItems.length) return 'right';
    if (opened[0] && leftItems.length) return 'left';
    return '';
  }
  if (opened === true) return rightItems.length ? 'right' : (leftItems.length ? 'left' : '');
  return '';
}

function openedForPosition(position) {
  if (position === 'left') return [true, false];
  if (position === 'right') return [false, true];
  return false;
}

function offsetForPosition(position, leftWidth, rightWidth) {
  if (position === 'left') return leftWidth;
  if (position === 'right') return -rightWidth;
  return 0;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    disabled: { type: Boolean, value: false },
    left: { type: Array, value: [] },
    opened: { type: null, value: false },
    right: { type: Array, value: [] },
    ariaLabel: { type: String, value: '滑动操作' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    leftItems: [],
    rightItems: [],
    leftWidth: 0,
    rightWidth: 0,
    currentPosition: '',
    actionPosition: '',
    offset: 0,
    dragging: false,
    rootClass: 'pui-swipe-cell',
    contentStyle: 'transform:translate3d(0, 0, 0);transition-duration:500ms;',
  },
  observers: {
    'left,right,opened,disabled,reduceMotion,colorScheme': function sync() { this.syncState(); },
  },
  lifetimes: {
    attached: function attached() {
      instances.push(this);
      this.syncState();
    },
    detached: function detached() {
      instances = instances.filter(function keep(instance) { return instance !== this; }, this);
      clearTimeout(this._tapGuardTimer);
    },
  },
  methods: {
    syncState: function syncState() {
      var rpxScale = this.getRpxScale();
      var leftItems = normalizeActions(this.data.left, 'left', rpxScale);
      var rightItems = normalizeActions(this.data.right, 'right', rpxScale);
      var leftWidth = leftItems.reduce(function sum(total, item) { return total + item.width; }, 0);
      var rightWidth = rightItems.reduce(function sum(total, item) { return total + item.width; }, 0);
      var position = positionFromOpened(this.data.opened, leftItems, rightItems);
      var duration = this.data.reduceMotion ? 1 : MOTION_DURATION;
      var offset = offsetForPosition(position, leftWidth, rightWidth);
      this.setData({
        leftItems: leftItems,
        rightItems: rightItems,
        leftWidth: leftWidth,
        rightWidth: rightWidth,
        currentPosition: position,
        actionPosition: position,
        offset: offset,
        dragging: false,
        contentStyle: this.buildContentStyle(offset, false, duration),
        rootClass: [
          'pui-swipe-cell',
          this.getColorSchemeClass(),
          position ? 'pui-swipe-cell--opened pui-swipe-cell--opened-' + position : '',
          this.data.left && this.data.left.length ? 'pui-swipe-cell--has-left-actions' : '',
          this.data.right && this.data.right.length ? 'pui-swipe-cell--has-right-actions' : '',
          this.data.disabled ? 'pui-swipe-cell--disabled' : '',
        ].filter(Boolean).join(' '),
      });
    },
    buildContentStyle: function buildContentStyle(offset, dragging, duration) {
      return 'transform:translate3d(' + offset + 'rpx, 0, 0);transition-duration:' + (dragging ? 0 : duration) + 'ms;';
    },
    setPresentation: function setPresentation(offset, dragging) {
      var actionPosition = offset > 0 ? 'left' : (offset < 0 ? 'right' : '');
      this.setData({
        actionPosition: actionPosition,
        offset: offset,
        dragging: dragging,
        contentStyle: this.buildContentStyle(offset, dragging, this.data.reduceMotion ? 1 : MOTION_DURATION),
      });
    },
    setOpenedPosition: function setOpenedPosition(position) {
      var component = this;
      this.setData({ opened: openedForPosition(position) }, function afterOpenedChange() { component.syncState(); });
    },
    close: function close() {
      if (!this.data.currentPosition) return;
      this.setOpenedPosition('');
    },
    closeOther: function closeOther() {
      instances.forEach(function closeInstance(instance) {
        if (instance !== this) instance.close();
      }, this);
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
    onTouchStart: function onTouchStart(event) {
      if (this.data.disabled) return;
      var point = event.touches && event.touches[0];
      if (!point) return;
      this.closeOther();
      this._startX = Number(point.clientX) || 0;
      this._startY = Number(point.clientY) || 0;
      this._startOffset = offsetForPosition(this.data.currentPosition, this.data.leftWidth, this.data.rightWidth);
      this._gestureDirection = '';
    },
    onTouchMove: function onTouchMove(event) {
      if (this.data.disabled || this._startX === undefined) return;
      var point = event.touches && event.touches[0];
      if (!point) return;
      var deltaX = (Number(point.clientX) - this._startX) * this.getRpxScale();
      var deltaY = (Number(point.clientY) - this._startY) * this.getRpxScale();
      if (!this._gestureDirection) {
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 20) return;
        this._gestureDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
      if (this._gestureDirection !== 'horizontal') return;
      if (!this.data.dragging) this.triggerEvent('dragstart');
      var offset = Math.max(-this.data.rightWidth, Math.min(this.data.leftWidth, this._startOffset + deltaX));
      this.setPresentation(offset, true);
    },
    finishTouch: function finishTouch(cancelled) {
      if (this._startX === undefined) return;
      var horizontal = this._gestureDirection === 'horizontal';
      if (horizontal) {
        var offset = Number(this.data.offset) || 0;
        var next = '';
        if (!cancelled) {
          if (offset > this.data.leftWidth * OPEN_THRESHOLD && this.data.leftWidth) next = 'left';
          if (offset < -this.data.rightWidth * OPEN_THRESHOLD && this.data.rightWidth) next = 'right';
        }
        this.setOpenedPosition(next);
        this.triggerEvent('dragend');
        var component = this;
        this._suppressTap = true;
        clearTimeout(this._tapGuardTimer);
        this._tapGuardTimer = setTimeout(function clearTapGuard() { component._suppressTap = false; }, 80);
      }
      this._startX = undefined;
      this._startY = undefined;
      this._gestureDirection = '';
    },
    onTouchEnd: function onTouchEnd() { this.finishTouch(false); },
    onTouchCancel: function onTouchCancel() { this.finishTouch(true); },
    onContentTap: function onContentTap() {
      if (this.data.disabled || this._suppressTap) return;
      this.close();
    },
    onActionTap: function onActionTap(event) {
      if (this.data.disabled) return;
      var source = event.currentTarget.dataset.position;
      var index = Number(event.currentTarget.dataset.index);
      var actions = source === 'left' ? this.data.left : this.data.right;
      var action = Array.isArray(actions) ? actions[index] : null;
      this.triggerEvent('click', { action: action || {}, source: source });
      this.close();
    },
  },
});
