var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

var EASINGS = {
  standard: 'var(--pui-ease-standard)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
};
var ALIGNS = ['auto', 'start', 'center', 'end'];

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback === undefined ? min : fallback;
  return Math.max(min, Math.min(max, number));
}

function hasOwn(object, key) {
  return Boolean(object) && Object.prototype.hasOwnProperty.call(object, key);
}

function firstValue(object, keys, fallback) {
  for (var index = 0; index < keys.length; index += 1) {
    if (hasOwn(object, keys[index]) && object[keys[index]] !== null && object[keys[index]] !== undefined) return object[keys[index]];
  }
  return fallback;
}

function display(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback || '';
  return String(value);
}

function getByPath(object, path) {
  if (!object || typeof object !== 'object') return undefined;
  var normalized = String(path || '').trim();
  if (!normalized) return undefined;
  var segments = normalized.split('.');
  var current = object;
  for (var index = 0; index < segments.length; index += 1) {
    if (current === null || current === undefined || !hasOwn(Object(current), segments[index])) return undefined;
    current = current[segments[index]];
  }
  return current;
}

function valueToken(value) {
  if (value === null) return 'null:';
  if (value === undefined) return 'undefined:';
  if (typeof value === 'object') {
    try { return 'object:' + JSON.stringify(value); } catch (error) { return 'object:' + String(value); }
  }
  return typeof value + ':' + String(value);
}

function selectionEqual(left, right, multiple) {
  if (multiple) {
    var leftList = Array.isArray(left) ? left : [];
    var rightList = Array.isArray(right) ? right : [];
    if (leftList.length !== rightList.length) return false;
    for (var index = 0; index < leftList.length; index += 1) {
      if (valueToken(leftList[index]) !== valueToken(rightList[index])) return false;
    }
    return true;
  }
  return valueToken(left) === valueToken(right);
}

function cloneSelection(value, multiple) {
  if (multiple) return Array.isArray(value) ? value.slice() : [];
  return value === undefined ? null : value;
}

function isControlled(data) {
  return data.value !== null && data.value !== undefined;
}

function normalizeDuration(value, reduceMotion) {
  if (reduceMotion) return 1;
  return Math.round(clamp(value, 0, 1000, 500));
}

function sourceOf(source, fallback) {
  if (typeof source === 'string' && source) return source;
  if (source && source.detail && source.detail.source) return source.detail.source;
  return fallback || 'programmatic';
}

function getRpxRatio() {
  var width = Number(platformInfo.getWindowInfo().windowWidth);
  return width > 0 ? width / 750 : 0.5;
}

function normalizeItems(items, itemKey) {
  return (Array.isArray(items) ? items : []).map(function normalize(item, index) {
    var object = item && typeof item === 'object' ? item : null;
    var key = object ? getByPath(object, itemKey) : item;
    if (key === null || key === undefined || key === '') key = index;
    var label = object ? firstValue(object, ['label', 'title', 'text'], firstValue(object, ['value'], index + 1)) : item;
    var description = object ? firstValue(object, ['description', 'subtitle'], '') : '';
    var valueText = object ? firstValue(object, ['valueText', 'trailing', 'note'], '') : '';
    var badge = object ? firstValue(object, ['badge', 'badgeCount'], '') : '';
    var badgeDot = Boolean(object && (object.badgeDot || object.dot));
    return {
      index: index,
      key: key,
      keyToken: valueToken(key),
      label: display(label, String(index + 1)),
      description: display(description, ''),
      valueText: display(valueText, ''),
      icon: display(object && object.icon, ''),
      badge: badge,
      badgeDot: badgeDot,
      hasBadge: badgeDot || (badge !== '' && badge !== null && badge !== undefined),
      disabled: Boolean(object && object.disabled),
      loading: Boolean(object && object.loading),
      raw: item,
    };
  });
}

function normalizedSelection(value, multiple, items, prune) {
  var available = {};
  items.forEach(function collect(item) { available[item.keyToken] = true; });
  if (multiple) {
    var source = Array.isArray(value) ? value : (value === null || value === undefined ? [] : [value]);
    var seen = {};
    return source.filter(function unique(entry) {
      var token = valueToken(entry);
      if (seen[token] || (prune && !available[token])) return false;
      seen[token] = true;
      return true;
    });
  }
  var next = Array.isArray(value) ? value[0] : value;
  if (next === undefined || next === null) return null;
  if (prune && !available[valueToken(next)]) return null;
  return next;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    multiple: { type: Boolean, value: false },
    selectable: { type: Boolean, value: true },
    allowUnselect: { type: Boolean, value: false },
    itemKey: { type: String, value: 'value' },
    height: { type: Number, value: 480 },
    itemHeight: { type: Number, value: 88 },
    overscan: { type: Number, value: 3 },
    scrollTop: { type: Number, value: 0 },
    scrollWithAnimation: { type: Boolean, value: true },
    upperThreshold: { type: Number, value: 50 },
    lowerThreshold: { type: Number, value: 50 },
    showScrollbar: { type: Boolean, value: true },
    bordered: { type: Boolean, value: true },
    showIndex: { type: Boolean, value: true },
    showDescription: { type: Boolean, value: true },
    showValue: { type: Boolean, value: false },
    showItemIcon: { type: Boolean, value: true },
    showItemBadge: { type: Boolean, value: true },
    activeIcon: { type: String, value: 'check' },
    customHeader: { type: Boolean, value: false },
    customFooter: { type: Boolean, value: false },
    customEmpty: { type: Boolean, value: false },
    customItem: { type: Boolean, value: false },
    clickable: { type: Boolean, value: true },
    readonly: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '列表加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '列表加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无数据' },
    ariaLabel: { type: String, value: '虚拟列表' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: 'pui-virtual-list',
    rootStyle: '--pui-virtual-list-duration:500ms;--pui-virtual-list-ease:var(--pui-ease-standard);',
    listStyle: 'height:480rpx;',
    appliedScrollTop: 0,
    currentScrollTop: 0,
    scrollAnimation: true,
    renderedItems: [],
    topSpacerStyle: 'height:0rpx;',
    bottomSpacerStyle: 'height:0rpx;',
    hasContent: false,
    isLoading: false,
    isError: false,
    isEmpty: true,
    displayLoadingText: '列表加载中',
    displayErrorText: '列表加载失败',
    displayRetryText: '重试',
    displayEmptyText: '暂无数据',
    semanticLabel: '虚拟列表',
    activeIndex: -1,
    selectedCount: 0,
    visibleStart: 0,
    visibleEnd: 0,
    renderStart: 0,
    renderEnd: 0,
    total: 0,
  },
  observers: {
    'items,value,multiple,selectable,allowUnselect,itemKey,height,itemHeight,overscan,scrollWithAnimation,upperThreshold,lowerThreshold,showScrollbar,bordered,showIndex,showDescription,showValue,showItemIcon,showItemBadge,activeIcon,customHeader,customFooter,customEmpty,customItem,clickable,readonly,disabled,loading,loadingText,error,errorText,retryText,emptyText,ariaLabel,duration,easing,reduceMotion,colorScheme': function observeState() {
      this.syncState(false);
    },
    scrollTop: function observeScrollTop(value) {
      if (!this._ready) return;
      this.setScrollOffset(value, false, 'property');
    },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._rpxRatio = getRpxRatio();
      this._innerValue = cloneSelection(this.data.defaultValue, this.data.multiple);
      this._wasControlled = isControlled(this.data);
      if (this._wasControlled) this._lastControlledValue = cloneSelection(this.data.value, this.data.multiple);
      this.syncState(true);
      this.setScrollOffset(this.data.scrollTop, false, 'initial');
    },
    detached: function detached() {
      this._ready = false;
      this._normalizedItems = [];
    },
  },
  methods: {
    getItemHeight: function getItemHeight() {
      return Math.round(clamp(this.data.itemHeight, 48, 240, 88));
    },
    getHeight: function getHeight() {
      return Math.round(clamp(this.data.height, 160, 1200, 480));
    },
    getOverscan: function getOverscan() {
      return Math.round(clamp(this.data.overscan, 0, 20, 3));
    },
    currentSelection: function currentSelection(items) {
      var controlled = isControlled(this.data);
      var raw = controlled ? this.data.value : this._innerValue;
      var normalized = normalizedSelection(raw, this.data.multiple, items, !controlled);
      if (!controlled) this._innerValue = cloneSelection(normalized, this.data.multiple);
      return normalized;
    },
    syncState: function syncState(initial) {
      if (!this._ready && !initial) return;
      var controlled = isControlled(this.data);
      if (controlled) {
        this._lastControlledValue = cloneSelection(this.data.value, this.data.multiple);
      } else if (this._wasControlled) {
        this._innerValue = cloneSelection(this._lastControlledValue, this.data.multiple);
      }
      this._wasControlled = controlled;
      var items = normalizeItems(this.data.items, this.data.itemKey || 'value');
      var selection = this.currentSelection(items);
      var selectedTokens = {};
      (this.data.multiple ? selection : [selection]).forEach(function collect(value) {
        if (value !== null && value !== undefined) selectedTokens[valueToken(value)] = true;
      });
      items.forEach(function mark(item) { item.selected = Boolean(selectedTokens[item.keyToken]); });
      this._normalizedItems = items;
      var duration = normalizeDuration(this.data.duration, this.data.reduceMotion);
      var easing = EASINGS[this.data.easing] || EASINGS.standard;
      var isError = Boolean(this.data.error);
      var isLoading = !isError && Boolean(this.data.loading);
      var hasContent = !isError && !isLoading && items.length > 0;
      var isEmpty = !isError && !isLoading && !items.length;
      var classes = [
        'pui-virtual-list',
        this.getColorSchemeClass(),
        this.data.bordered ? 'pui-virtual-list--bordered' : '',
        this.data.disabled ? 'pui-virtual-list--disabled' : '',
        this.data.readonly ? 'pui-virtual-list--readonly' : '',
        this.data.clickable ? 'pui-virtual-list--clickable' : '',
        this.data.reduceMotion ? 'pui-virtual-list--reduced' : '',
      ];
      this.setData({
        rootClass: classes.filter(Boolean).join(' '),
        rootStyle: '--pui-virtual-list-duration:' + duration + 'ms;--pui-virtual-list-ease:' + easing + ';',
        listStyle: 'height:' + this.getHeight() + 'rpx;',
        scrollAnimation: Boolean(this.data.scrollWithAnimation && !this.data.reduceMotion),
        hasContent: hasContent,
        isLoading: isLoading,
        isError: isError,
        isEmpty: isEmpty,
        displayLoadingText: this.data.loadingText || '列表加载中',
        displayErrorText: this.data.errorText || '列表加载失败',
        displayRetryText: this.data.retryText || '重试',
        displayEmptyText: this.data.emptyText || '暂无数据',
        semanticLabel: String(this.data.ariaLabel || '').trim() || '虚拟列表',
        selectedCount: Object.keys(selectedTokens).length,
        total: items.length,
      });
      this.updateWindow(initial ? Math.max(0, Number(this.data.scrollTop) || 0) : this.data.currentScrollTop, false);
    },
    windowMetrics: function windowMetrics(scrollTop) {
      var itemHeightRpx = this.getItemHeight();
      var ratio = this._rpxRatio || 0.5;
      var itemHeightPx = itemHeightRpx * ratio;
      var viewportPx = this.getHeight() * ratio;
      var total = this._normalizedItems ? this._normalizedItems.length : 0;
      var maxScrollTop = Math.max(0, total * itemHeightPx - viewportPx);
      var top = clamp(scrollTop, 0, maxScrollTop, 0);
      var visibleStart = total ? Math.max(0, Math.floor(top / itemHeightPx)) : 0;
      var visibleEnd = total ? Math.min(total, Math.max(visibleStart + 1, Math.ceil((top + viewportPx) / itemHeightPx))) : 0;
      var overscan = this.getOverscan();
      var renderStart = Math.max(0, visibleStart - overscan);
      var renderEnd = Math.min(total, visibleEnd + overscan);
      return {
        itemHeightRpx: itemHeightRpx,
        itemHeightPx: itemHeightPx,
        viewportPx: viewportPx,
        maxScrollTop: maxScrollTop,
        scrollTop: top,
        visibleStart: visibleStart,
        visibleEnd: visibleEnd,
        renderStart: renderStart,
        renderEnd: renderEnd,
        total: total,
      };
    },
    updateWindow: function updateWindow(scrollTop, emit, nativeDetail) {
      var metrics = this.windowMetrics(scrollTop);
      var itemHeight = metrics.itemHeightRpx;
      var rendered = this.data.hasContent ? this._normalizedItems.slice(metrics.renderStart, metrics.renderEnd).map(function mapItem(item) {
        return {
          index: item.index,
          key: item.key,
          label: item.label,
          description: item.description,
          valueText: item.valueText,
          icon: item.icon,
          badge: item.badge,
          badgeDot: item.badgeDot,
          hasBadge: item.hasBadge,
          disabled: item.disabled,
          loading: item.loading,
          selected: item.selected,
          raw: item.raw,
          itemStyle: 'height:' + itemHeight + 'rpx;',
        };
      }) : [];
      this.setData({
        currentScrollTop: metrics.scrollTop,
        renderedItems: rendered,
        topSpacerStyle: 'height:' + metrics.renderStart * itemHeight + 'rpx;',
        bottomSpacerStyle: 'height:' + Math.max(0, metrics.total - metrics.renderEnd) * itemHeight + 'rpx;',
        visibleStart: metrics.visibleStart,
        visibleEnd: metrics.visibleEnd,
        renderStart: metrics.renderStart,
        renderEnd: metrics.renderEnd,
      });
      if (emit) {
        this.triggerEvent('scroll', {
          scrollTop: metrics.scrollTop,
          scrollLeft: Math.max(0, Number(nativeDetail && nativeDetail.scrollLeft) || 0),
          scrollHeight: Math.max(0, Number(nativeDetail && nativeDetail.scrollHeight) || metrics.total * metrics.itemHeightPx),
          deltaX: Number(nativeDetail && nativeDetail.deltaX) || 0,
          deltaY: Number(nativeDetail && nativeDetail.deltaY) || 0,
          visibleStart: metrics.visibleStart,
          visibleEnd: metrics.visibleEnd,
          renderStart: metrics.renderStart,
          renderEnd: metrics.renderEnd,
          total: metrics.total,
          source: 'scroll',
        });
      }
      return metrics;
    },
    setScrollOffset: function setScrollOffset(offset, animate, source, extraDetail) {
      var metrics = this.updateWindow(offset, false);
      var nextAnimate = animate === undefined ? Boolean(this.data.scrollWithAnimation && !this.data.reduceMotion) : Boolean(animate && !this.data.reduceMotion);
      var target = metrics.scrollTop;
      var detail = Object.assign({
        scrollTop: target,
        visibleStart: metrics.visibleStart,
        visibleEnd: metrics.visibleEnd,
        renderStart: metrics.renderStart,
        renderEnd: metrics.renderEnd,
        total: metrics.total,
        animated: nextAnimate,
        source: source || 'programmatic',
      }, extraDetail || {});
      var self = this;
      if (Math.abs(Number(this.data.appliedScrollTop) - target) < 0.01) {
        var nudge = target === 0 ? 0.5 : Math.max(0, target - 0.5);
        this.setData({ appliedScrollTop: nudge, scrollAnimation: false }, function applyRepeatedTarget() {
          self.setData({ appliedScrollTop: target, scrollAnimation: nextAnimate });
        });
      } else {
        this.setData({ appliedScrollTop: target, scrollAnimation: nextAnimate });
      }
      if (source !== 'initial' && source !== 'property') this.triggerEvent('scroll-to', detail);
      return detail;
    },
    onScroll: function onScroll(event) {
      var detail = event.detail || {};
      this.updateWindow(detail.scrollTop, true, detail);
    },
    onScrollToUpper: function onScrollToUpper(event) {
      var detail = { scrollTop: this.data.currentScrollTop, total: this.data.total, source: (event.detail && event.detail.direction) || 'top' };
      this.triggerEvent('scrolltoupper', detail);
      this.triggerEvent('reach-start', detail);
    },
    onScrollToLower: function onScrollToLower(event) {
      var detail = { scrollTop: this.data.currentScrollTop, total: this.data.total, source: (event.detail && event.detail.direction) || 'bottom' };
      this.triggerEvent('scrolltolower', detail);
      this.triggerEvent('reach-end', detail);
    },
    onItemTap: function onItemTap(event) {
      if (this.data.disabled || this.data.loading || this.data.error || !this.data.clickable) return;
      var index = Number(event.currentTarget.dataset.index);
      var item = this._normalizedItems[index];
      if (!item || item.disabled || item.loading) return;
      this.setData({ activeIndex: index });
      this.triggerEvent('item-click', { item: item.raw, index: index, key: item.key, value: item.key, selected: item.selected, source: 'tap' });
      if (!this.data.selectable || this.data.readonly) return;
      this.requestSelection(item, 'tap', true);
    },
    requestSelection: function requestSelection(item, source, userTriggered) {
      if (!item || item.disabled || item.loading || (userTriggered && (this.data.disabled || this.data.readonly || !this.data.selectable))) return false;
      var controlled = isControlled(this.data);
      var previous = this.currentSelection(this._normalizedItems);
      var next;
      var selected;
      if (this.data.multiple) {
        next = Array.isArray(previous) ? previous.slice() : [];
        var token = item.keyToken;
        var matchedIndex = -1;
        for (var index = 0; index < next.length; index += 1) {
          if (valueToken(next[index]) === token) { matchedIndex = index; break; }
        }
        if (matchedIndex > -1) {
          next.splice(matchedIndex, 1);
          selected = false;
        } else {
          next.push(item.key);
          selected = true;
        }
      } else if (valueToken(previous) === item.keyToken) {
        if (!this.data.allowUnselect) return false;
        next = null;
        selected = false;
      } else {
        next = item.key;
        selected = true;
      }
      if (selectionEqual(previous, next, this.data.multiple)) return false;
      if (!controlled) this._innerValue = cloneSelection(next, this.data.multiple);
      var detail = {
        value: cloneSelection(next, this.data.multiple),
        previousValue: cloneSelection(previous, this.data.multiple),
        item: item.raw,
        index: item.index,
        key: item.key,
        selected: selected,
        multiple: Boolean(this.data.multiple),
        controlled: controlled,
        source: source || 'programmatic',
      };
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent('selection-change', detail);
      if (!controlled) this.syncState(false);
      return true;
    },
    onRetry: function onRetry() {
      if (!this.data.error || this.data.disabled || this.data.loading) return;
      this.triggerEvent('retry', { error: true, source: 'action' });
    },
    select: function select(key, source) {
      var token = valueToken(key);
      var item = (this._normalizedItems || []).filter(function find(entry) { return entry.keyToken === token; })[0];
      return this.requestSelection(item, sourceOf(source, 'programmatic'), false);
    },
    clearSelection: function clearSelection(source) {
      var previous = this.currentSelection(this._normalizedItems || []);
      var next = this.data.multiple ? [] : null;
      if (selectionEqual(previous, next, this.data.multiple)) return false;
      var controlled = isControlled(this.data);
      if (!controlled) this._innerValue = cloneSelection(next, this.data.multiple);
      var detail = { value: cloneSelection(next, this.data.multiple), previousValue: cloneSelection(previous, this.data.multiple), item: null, index: -1, key: null, selected: false, multiple: Boolean(this.data.multiple), controlled: controlled, source: sourceOf(source, 'clear') };
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent('selection-change', detail);
      if (!controlled) this.syncState(false);
      return true;
    },
    reset: function reset(source) {
      var previous = this.currentSelection(this._normalizedItems || []);
      var next = normalizedSelection(this.data.defaultValue, this.data.multiple, this._normalizedItems || [], true);
      if (selectionEqual(previous, next, this.data.multiple)) return false;
      var controlled = isControlled(this.data);
      if (!controlled) this._innerValue = cloneSelection(next, this.data.multiple);
      var detail = { value: cloneSelection(next, this.data.multiple), previousValue: cloneSelection(previous, this.data.multiple), multiple: Boolean(this.data.multiple), controlled: controlled, source: sourceOf(source, 'reset') };
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent('selection-change', detail);
      this.triggerEvent('reset', detail);
      if (!controlled) this.syncState(false);
      return true;
    },
    scrollToIndex: function scrollToIndex(index, align, animate) {
      if (!this._normalizedItems || !this._normalizedItems.length) return false;
      var options = align && typeof align === 'object' ? align : {};
      var resolvedAlign = typeof align === 'string' ? align : options.align;
      if (ALIGNS.indexOf(resolvedAlign) === -1) resolvedAlign = 'auto';
      var resolvedAnimate = options.animate !== undefined ? options.animate : animate;
      var resolvedSource = options.source || 'scrollToIndex';
      var nextIndex = Math.round(clamp(index, 0, this._normalizedItems.length - 1, 0));
      var itemHeightPx = this.getItemHeight() * (this._rpxRatio || 0.5);
      var viewportPx = this.getHeight() * (this._rpxRatio || 0.5);
      var start = nextIndex * itemHeightPx;
      var target = start;
      if (resolvedAlign === 'center') target = start - (viewportPx - itemHeightPx) / 2;
      else if (resolvedAlign === 'end') target = start - viewportPx + itemHeightPx;
      else if (resolvedAlign === 'auto') {
        var current = this.data.currentScrollTop;
        if (start < current) target = start;
        else if (start + itemHeightPx > current + viewportPx) target = start - viewportPx + itemHeightPx;
        else target = current;
      }
      return this.setScrollOffset(target, resolvedAnimate, resolvedSource, {
        index: nextIndex,
        key: this._normalizedItems[nextIndex].key,
        align: resolvedAlign,
      });
    },
    scrollToKey: function scrollToKey(key, align, animate) {
      var token = valueToken(key);
      var index = -1;
      for (var position = 0; position < (this._normalizedItems || []).length; position += 1) {
        if (this._normalizedItems[position].keyToken === token) { index = position; break; }
      }
      if (index < 0) return false;
      return this.scrollToIndex(index, align, animate);
    },
    scrollToOffset: function scrollToOffset(offset, animate) {
      return this.setScrollOffset(offset, animate, 'scrollToOffset');
    },
    scrollToTop: function scrollToTop(animate) {
      return this.setScrollOffset(0, animate, 'scrollToTop');
    },
    getVisibleRange: function getVisibleRange() {
      return {
        visibleStart: this.data.visibleStart,
        visibleEnd: this.data.visibleEnd,
        renderStart: this.data.renderStart,
        renderEnd: this.data.renderEnd,
        scrollTop: this.data.currentScrollTop,
        total: this.data.total,
      };
    },
  },
});
