var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

var VARIANTS = ['line', 'tag'];
var EVENLY_MAX_ITEM_COUNT = 4;

function normalizeVariant(value) {
  // `pills` 曾是官网预览期的名称；安装端继续映射到 tag，公开合同只使用 TDesign 对齐的 tag。
  if (value === 'pills') return 'tag';
  return VARIANTS.indexOf(value) > -1 ? value : 'line';
}

function sameValue(left, right) {
  return left === right;
}

function clamp(value, min, max, fallback) {
  var number = Math.round(Number(value));
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function normalizeItems(items, uid) {
  if (!Array.isArray(items)) return [];
  return items.map(function mapItem(item, index) {
    var source = item && typeof item === 'object' ? item : { label: item };
    var label = source.label;
    if (label === undefined || label === null || label === '') label = source.title;
    if (label === undefined || label === null || label === '') label = String(index + 1);
    return {
      id: uid + '-' + index,
      label: String(label),
      value: source.value === undefined ? index : source.value,
      icon: String(source.icon || ''),
      badge: source.badge === undefined || source.badge === null ? '' : source.badge,
      description: String(source.description || ''),
      ariaLabel: String(source.ariaLabel || label),
      disabled: !!source.disabled,
      active: false,
    };
  });
}

function firstAvailable(items) {
  for (var index = 0; index < items.length; index += 1) {
    if (!items[index].disabled) return items[index].value;
  }
  return null;
}

function rpxToPx(value) {
  var width = Number(platformInfo.getWindowInfo().windowWidth) || 375;
  return Number(value || 0) * width / 750;
}

function shouldSpaceEvenly(items, spaceEvenly) {
  return items.length <= EVENLY_MAX_ITEM_COUNT && spaceEvenly !== false;
}

function publicItem(item) {
  if (!item) return null;
  return {
    label: item.label,
    value: item.value,
    icon: item.icon,
    badge: item.badge,
    description: item.description,
    ariaLabel: item.ariaLabel,
    disabled: item.disabled,
  };
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    variant: { type: String, value: 'line' },
    showBottomLine: { type: Boolean, value: true },
    spaceEvenly: { type: Boolean, value: true },
    split: { type: Boolean, value: true },
    sticky: { type: Boolean, value: false },
    stickyOffset: { type: Number, value: 0 },
    swipeable: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    normalizedItems: [],
    innerValue: null,
    activeIndex: -1,
    activeLabel: '',
    rootClass: 'pui-tabs pui-tabs--line',
    rootStyle: '--pui-tabs-duration:500ms;',
    stickyStyle: 'top:0rpx;',
    scrollIntoView: '',
    uid: '',
    semanticLabel: '选项卡',
  },
  observers: {
    'items,value,defaultValue,variant,showBottomLine,spaceEvenly,split,sticky,stickyOffset,swipeable,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() {
      this._uid = 'pui-tab-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
      this.syncState();
    },
    detached: function detached() {
      this._touchStart = null;
    },
  },
  methods: {
    syncState: function syncState() {
      var uid = this._uid || this.data.uid || 'pui-tab';
      var items = normalizeItems(this.data.items, uid);
      var controlled = this.data.value !== null && this.data.value !== undefined;
      if (controlled) {
        this._lastControlledValue = this.data.value;
      } else if (this._wasControlled) {
        this._uncontrolledValue = this._lastControlledValue;
        this._uncontrolledInitialized = true;
      }
      if (!controlled && !this._uncontrolledInitialized) {
        this._uncontrolledValue = this.data.defaultValue !== null && this.data.defaultValue !== undefined
          ? this.data.defaultValue
          : firstAvailable(items);
        this._uncontrolledInitialized = true;
      }
      var current = controlled ? this.data.value : this._uncontrolledValue;
      var activeIndex = items.findIndex(function find(item) { return sameValue(item.value, current); });
      if (!controlled && activeIndex < 0 && items.length) {
        current = firstAvailable(items);
        this._uncontrolledValue = current;
        activeIndex = items.findIndex(function find(item) { return sameValue(item.value, current); });
      }
      items = items.map(function mark(item, index) {
        item.active = index === activeIndex;
        return item;
      });
      var variant = normalizeVariant(this.data.variant);
      var evenly = shouldSpaceEvenly(items, this.data.spaceEvenly);
      var overflowPeek = items.length > EVENLY_MAX_ITEM_COUNT;
      this._wasControlled = controlled;
      this.setData({
        normalizedItems: items,
        innerValue: current,
        activeIndex: activeIndex,
        activeLabel: activeIndex > -1 ? items[activeIndex].label : '',
        rootClass: [
          'pui-tabs',
          this.getColorSchemeClass(),
          'pui-tabs--' + variant,
          this.data.showBottomLine ? '' : 'pui-tabs--without-indicator',
          evenly ? 'pui-tabs--evenly' : '',
          overflowPeek ? 'pui-tabs--overflow-peek' : '',
          this.data.split ? 'pui-tabs--split' : '',
          this.data.sticky ? 'pui-tabs--sticky' : '',
          this.data.reduceMotion ? 'pui-tabs--reduced-motion' : '',
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-tabs-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;',
        stickyStyle: 'top:' + clamp(this.data.stickyOffset, 0, 400, 0) + 'rpx;',
        scrollIntoView: activeIndex > -1 ? items[activeIndex].id : '',
        uid: uid,
        semanticLabel: String(this.data.ariaLabel || '').trim() || '选项卡',
      });
    },
    requestSelection: function requestSelection(index, source, emitClick) {
      var item = this.data.normalizedItems[index];
      if (!item || item.disabled) return false;
      var previousValue = this.data.innerValue;
      var detail = {
        value: item.value,
        previousValue: previousValue,
        index: index,
        item: publicItem(item),
        source: source || 'tap',
        controlled: this.data.value !== null && this.data.value !== undefined,
      };
      if (emitClick) this.triggerEvent('click', detail);
      if (sameValue(item.value, previousValue)) return false;
      if (!detail.controlled) {
        this._uncontrolledValue = item.value;
        this.syncState();
      }
      this.triggerEvent('change', detail);
      return true;
    },
    onSelect: function onSelect(event) {
      this.requestSelection(Number(event.currentTarget.dataset.index), 'tap', true);
    },
    move: function move(direction, source) {
      var items = this.data.normalizedItems;
      if (!items.length) return false;
      var start = this.data.activeIndex;
      if (start < 0) start = direction > 0 ? -1 : items.length;
      for (var next = start + direction; next >= 0 && next < items.length; next += direction) {
        if (!items[next].disabled) return this.requestSelection(next, source || 'swipe', false);
      }
      return false;
    },
    onTouchStart: function onTouchStart(event) {
      if (!this.data.swipeable) return;
      var touch = event.touches && event.touches[0];
      if (!touch) return;
      this._touchStart = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd: function onTouchEnd(event) {
      if (!this._touchStart || !this.data.swipeable) {
        this._touchStart = null;
        return;
      }
      var touch = event.changedTouches && event.changedTouches[0];
      if (!touch) {
        this._touchStart = null;
        return;
      }
      var deltaX = touch.clientX - this._touchStart.x;
      var deltaY = touch.clientY - this._touchStart.y;
      this._touchStart = null;
      if (Math.abs(deltaX) < rpxToPx(72) || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      this.move(deltaX < 0 ? 1 : -1, 'swipe');
    },
    onTouchCancel: function onTouchCancel() {
      this._touchStart = null;
    },
  },
});
