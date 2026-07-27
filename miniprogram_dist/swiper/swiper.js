var themeBehavior = require('../common/behaviors/theme');

var EASINGS = {
  default: 'cubic-bezier(0.2, 0, 0, 1)',
  linear: 'linear',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
};
var IMAGE_MODES = ['scaleToFill', 'aspectFit', 'aspectFill', 'widthFix', 'heightFix', 'top', 'bottom', 'center', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];
var THEMES = ['default', 'primary', 'success', 'warning', 'danger'];
var NAVIGATION_TYPES = ['dots', 'dots-bar', 'fraction'];

function clamp(value, min, max, fallback) {
  var number = Math.round(Number(value));
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function hasValue(value) {
  return value !== null && value !== undefined;
}

function sameValue(left, right) {
  return left === right;
}

function normalizeItems(items, uid) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 100).map(function normalize(item, index) {
    var isObject = item && typeof item === 'object' && !Array.isArray(item);
    var source = isObject ? item : { value: item, title: item };
    var value = Object.prototype.hasOwnProperty.call(source, 'value') ? source.value : index;
    var title = source.title;
    if (title === undefined || title === null || title === '') title = String(index + 1);
    var description = source.description;
    var image = source.image;
    var theme = THEMES.indexOf(source.theme) > -1 ? source.theme : 'default';
    return {
      id: uid + '-' + index,
      raw: item,
      value: value,
      title: String(title),
      description: description === undefined || description === null ? '' : String(description),
      image: image === undefined || image === null ? '' : String(image),
      icon: String(source.icon || 'image'),
      tag: source.tag === undefined || source.tag === null ? '' : String(source.tag),
      tagTheme: THEMES.indexOf(source.tagTheme) > -1 ? source.tagTheme : theme,
      theme: theme,
      disabled: !!source.disabled,
      ariaLabel: String(source.ariaLabel || title),
      active: false,
      index: index,
    };
  });
}

function normalizeNavigation(value, count) {
  var enabled = value !== false && value !== null;
  var source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  var type = NAVIGATION_TYPES.indexOf(source.type) > -1 ? source.type : 'dots';
  var position = source.position === 'outside' ? 'outside' : 'inside';
  var minShowNum = clamp(source.minShowNum, 1, 100, 2);
  return {
    enabled: enabled,
    visible: enabled && count >= minShowNum,
    type: type,
    position: position,
    showControls: !!source.showControls,
    minShowNum: minShowNum,
  };
}

function findValueIndex(items, value) {
  for (var index = 0; index < items.length; index += 1) {
    if (sameValue(items[index].value, value)) return index;
  }
  return -1;
}

function normalizeIndex(index, count, circular) {
  if (!count) return -1;
  var number = Math.round(Number(index));
  if (!isFinite(number)) number = 0;
  if (circular && count > 1) return ((number % count) + count) % count;
  return Math.max(0, Math.min(count - 1, number));
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    height: { type: Number, value: 360 },
    circular: { type: Boolean, value: true },
    autoplay: { type: Boolean, value: false },
    interval: { type: Number, value: 5000 },
    duration: { type: Number, value: 500 },
    easingFunction: { type: String, value: 'default' },
    direction: { type: String, value: 'horizontal' },
    previousMargin: { type: Number, value: 0 },
    nextMargin: { type: Number, value: 0 },
    displayMultipleItems: { type: Number, value: 1 },
    disableTouch: { type: Boolean, value: false },
    navigation: { type: null, value: true },
    imageMode: { type: String, value: 'aspectFill' },
    customItem: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '轮播加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '轮播加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无轮播内容' },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    normalizedItems: [],
    currentIndex: -1,
    currentValue: null,
    stateType: 'empty',
    rootClass: 'pui-swiper',
    rootStyle: '',
    viewportStyle: '',
    resolvedHeight: 360,
    resolvedInterval: 5000,
    resolvedDuration: 500,
    resolvedEasingFunction: 'default',
    resolvedImageMode: 'aspectFill',
    resolvedPreviousMargin: '0rpx',
    resolvedNextMargin: '0rpx',
    resolvedDisplayMultipleItems: 1,
    resolvedAutoplay: false,
    resolvedDisableTouch: false,
    resolvedVertical: false,
    navigationVisible: false,
    navigationType: 'dots',
    navigationPosition: 'inside',
    navigationShowControls: false,
    semanticLabel: '轮播图',
    touchPaused: false,
  },
  observers: {
    'items,value,defaultValue,height,circular,autoplay,interval,duration,easingFunction,direction,previousMargin,nextMargin,displayMultipleItems,disableTouch,navigation,imageMode,customItem,disabled,loading,loadingText,error,errorText,retryText,emptyText,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() {
      this._uid = 'pui-swiper-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
      this.syncState();
    },
    detached: function detached() {
      clearTimeout(this.rollbackTimer);
      this.rollbackTimer = null;
    },
  },
  methods: {
    syncState: function syncState() {
      var uid = this._uid || 'pui-swiper';
      var items = normalizeItems(this.data.items, uid);
      var controlled = hasValue(this.data.value);
      if (controlled) {
        this._lastControlledValue = this.data.value;
      } else if (this._wasControlled) {
        this._uncontrolledValue = this._lastControlledValue;
        this._uncontrolledInitialized = true;
      }
      if (!controlled && !this._uncontrolledInitialized) {
        var defaultIndex = findValueIndex(items, this.data.defaultValue);
        this._uncontrolledValue = defaultIndex > -1 ? items[defaultIndex].value : (items.length ? items[0].value : null);
        this._uncontrolledInitialized = true;
      }
      var current = controlled ? this.data.value : this._uncontrolledValue;
      var currentIndex = findValueIndex(items, current);
      if (currentIndex < 0 && items.length) {
        currentIndex = 0;
        current = items[0].value;
        if (!controlled) this._uncontrolledValue = current;
      }
      items = items.map(function mark(item, index) {
        item.active = index === currentIndex;
        return item;
      });
      var stateType = this.data.error ? 'error' : this.data.loading ? 'loading' : items.length ? 'content' : 'empty';
      var height = clamp(this.data.height, 160, 1200, 360);
      var duration = this.data.reduceMotion ? 1 : clamp(this.data.duration, 0, 1000, 500);
      var motionDuration = this.data.reduceMotion ? 1 : 500;
      var interval = clamp(this.data.interval, 1000, 60000, 5000);
      var easing = Object.prototype.hasOwnProperty.call(EASINGS, this.data.easingFunction) ? this.data.easingFunction : 'default';
      var previousMargin = clamp(this.data.previousMargin, 0, 240, 0);
      var nextMargin = clamp(this.data.nextMargin, 0, 240, 0);
      var multiple = clamp(this.data.displayMultipleItems, 1, 5, 1);
      multiple = Math.min(Math.max(1, items.length || 1), multiple);
      var navigation = normalizeNavigation(this.data.navigation, items.length);
      var vertical = this.data.direction === 'vertical';
      var interactive = stateType === 'content' && !this.data.disabled;
      this._wasControlled = controlled;
      this._controlled = controlled;
      this.setData({
        normalizedItems: items,
        currentIndex: currentIndex,
        currentValue: current,
        stateType: stateType,
        rootClass: [
          'pui-swiper',
          this.getColorSchemeClass(),
          vertical ? 'pui-swiper--vertical' : 'pui-swiper--horizontal',
          'pui-swiper--navigation-' + navigation.position,
          this.data.disabled ? 'pui-swiper--disabled' : '',
          this.data.reduceMotion ? 'pui-swiper--reduced-motion' : '',
          'pui-swiper--state-' + stateType,
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-swiper-duration:' + duration + 'ms;--pui-swiper-motion-duration:' + motionDuration + 'ms;--pui-swiper-ease:' + EASINGS[easing] + ';',
        viewportStyle: 'height:' + height + 'rpx;',
        resolvedHeight: height,
        resolvedInterval: interval,
        resolvedDuration: duration,
        resolvedEasingFunction: easing,
        resolvedImageMode: IMAGE_MODES.indexOf(this.data.imageMode) > -1 ? this.data.imageMode : 'aspectFill',
        resolvedPreviousMargin: previousMargin + 'rpx',
        resolvedNextMargin: nextMargin + 'rpx',
        resolvedDisplayMultipleItems: multiple,
        resolvedAutoplay: interactive && this.data.autoplay && !this.data.reduceMotion && !this.data.touchPaused,
        resolvedDisableTouch: !interactive || this.data.disableTouch,
        resolvedVertical: vertical,
        navigationVisible: stateType === 'content' && navigation.visible,
        navigationType: navigation.type,
        navigationPosition: navigation.position,
        navigationShowControls: navigation.showControls,
        semanticLabel: String(this.data.ariaLabel || '').trim() || '轮播图',
      });
    },
    activeDetail: function activeDetail(index, source, previousIndex) {
      var items = this.data.normalizedItems;
      var item = items[index] || null;
      var previousItem = items[previousIndex] || null;
      return {
        value: item ? item.value : null,
        previousValue: previousItem ? previousItem.value : null,
        index: index,
        previousIndex: previousIndex,
        item: item ? item.raw : null,
        source: source,
        controlled: !!this._controlled,
      };
    },
    applyIndex: function applyIndex(index) {
      var items = this.data.normalizedItems.map(function mark(item, itemIndex) {
        item.active = itemIndex === index;
        return item;
      });
      var item = items[index];
      this.setData({ normalizedItems: items, currentIndex: index, currentValue: item ? item.value : null });
    },
    requestIndex: function requestIndex(index, source) {
      var items = this.data.normalizedItems;
      if (!items.length || this.data.stateType !== 'content' || this.data.disabled) return false;
      var nextIndex = normalizeIndex(index, items.length, this.data.circular);
      var previousIndex = this.data.currentIndex;
      if (nextIndex < 0 || nextIndex === previousIndex) return false;
      var detail = this.activeDetail(nextIndex, source || 'method', previousIndex);
      if (!this._controlled) {
        this._uncontrolledValue = items[nextIndex].value;
        this._ignoreNextIndex = nextIndex;
        this.applyIndex(nextIndex);
      }
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      return true;
    },
    rollbackToControlled: function rollbackToControlled(reportedIndex) {
      var self = this;
      var controlledIndex = findValueIndex(this.data.normalizedItems, this.data.value);
      if (controlledIndex < 0) controlledIndex = this.data.normalizedItems.length ? 0 : -1;
      if (controlledIndex < 0 || controlledIndex === reportedIndex) return;
      clearTimeout(this.rollbackTimer);
      this._ignoreNextIndex = controlledIndex;
      this.setData({ currentIndex: reportedIndex }, function scheduleRollback() {
        self.rollbackTimer = setTimeout(function rollback() {
          self.rollbackTimer = null;
          if (!self._controlled) return;
          self.applyIndex(controlledIndex);
        }, 0);
      });
    },
    onSwiperChange: function onSwiperChange(event) {
      var index = normalizeIndex(event && event.detail ? event.detail.current : 0, this.data.normalizedItems.length, false);
      if (index < 0) return;
      if (this._ignoreNextIndex === index) {
        this._ignoreNextIndex = null;
        return;
      }
      if (this.data.disabled) {
        if (this._controlled) this.rollbackToControlled(index);
        else this.applyIndex(this.data.currentIndex);
        return;
      }
      var source = event && event.detail && event.detail.source === 'autoplay' ? 'autoplay' : 'swipe';
      var previousIndex = this.data.currentIndex;
      if (index === previousIndex) return;
      var detail = this.activeDetail(index, source, previousIndex);
      if (this._controlled) {
        this.triggerEvent('input', detail);
        this.triggerEvent('change', detail);
        this.rollbackToControlled(index);
      } else {
        this._uncontrolledValue = this.data.normalizedItems[index].value;
        this.applyIndex(index);
        this.triggerEvent('input', detail);
        this.triggerEvent('change', detail);
      }
    },
    onAnimationFinish: function onAnimationFinish(event) {
      this.triggerEvent('animationfinish', {
        index: this.data.currentIndex,
        value: this.data.currentValue,
        item: this.data.normalizedItems[this.data.currentIndex] ? this.data.normalizedItems[this.data.currentIndex].raw : null,
        source: event && event.detail && event.detail.source ? event.detail.source : 'animation',
      });
    },
    onPrevious: function onPrevious() {
      return this.requestIndex(this.data.currentIndex - 1, 'control-prev');
    },
    onNext: function onNext() {
      return this.requestIndex(this.data.currentIndex + 1, 'control-next');
    },
    onIndicator: function onIndicator(event) {
      return this.requestIndex(event.currentTarget.dataset.index, 'navigation');
    },
    onItemTap: function onItemTap(event) {
      var index = normalizeIndex(event.currentTarget.dataset.index, this.data.normalizedItems.length, false);
      var item = this.data.normalizedItems[index];
      if (!item || this.data.disabled || item.disabled) return;
      this.triggerEvent('click', {
        value: item.value,
        index: index,
        item: item.raw,
        active: index === this.data.currentIndex,
        source: 'item',
      });
    },
    onRetry: function onRetry() {
      if (this.data.disabled || this.data.loading || !this.data.error) return false;
      this.triggerEvent('retry', { source: 'retry', errorText: this.data.errorText });
      return true;
    },
    onImageLoad: function onImageLoad(event) {
      var index = normalizeIndex(event.currentTarget.dataset.index, this.data.normalizedItems.length, false);
      var item = this.data.normalizedItems[index];
      this.triggerEvent('image-load', Object.assign({}, event.detail || {}, { index: index, value: item ? item.value : null, item: item ? item.raw : null }));
    },
    onImageError: function onImageError(event) {
      var index = normalizeIndex(event.currentTarget.dataset.index, this.data.normalizedItems.length, false);
      var item = this.data.normalizedItems[index];
      this.triggerEvent('image-error', Object.assign({}, event.detail || {}, { index: index, value: item ? item.value : null, item: item ? item.raw : null }));
    },
    onTouchStart: function onTouchStart() {
      if (!this.data.resolvedAutoplay) return;
      this.setData({ touchPaused: true, resolvedAutoplay: false });
    },
    onTouchEnd: function onTouchEnd() {
      if (!this.data.touchPaused) return;
      this.setData({ touchPaused: false }, this.syncState.bind(this));
    },
    select: function select(value) {
      var index = findValueIndex(this.data.normalizedItems, value);
      return index > -1 ? this.requestIndex(index, 'method-select') : false;
    },
    next: function next() {
      return this.requestIndex(this.data.currentIndex + 1, 'method-next');
    },
    prev: function prev() {
      return this.requestIndex(this.data.currentIndex - 1, 'method-prev');
    },
    reset: function reset() {
      var index = findValueIndex(this.data.normalizedItems, this.data.defaultValue);
      if (index < 0 && this.data.normalizedItems.length) index = 0;
      return this.requestIndex(index, 'method-reset');
    },
    retry: function retry() {
      return this.onRetry();
    },
    getValue: function getValue() {
      return this.data.currentValue;
    },
    getState: function getState() {
      return {
        value: this.data.currentValue,
        index: this.data.currentIndex,
        controlled: !!this._controlled,
        count: this.data.normalizedItems.length,
        state: this.data.stateType,
        autoplay: this.data.resolvedAutoplay,
        disabled: !!this.data.disabled,
        direction: this.data.resolvedVertical ? 'vertical' : 'horizontal',
        reduceMotion: !!this.data.reduceMotion,
      };
    },
  },
});
