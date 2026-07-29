const themeBehavior = require('../common/behaviors/theme');

const INDEXES_MOTION_DURATION = 500;
const PROGRAMMATIC_SCROLL_SETTLE = 120;
const INDEX_PREVIEW_HOLD_DELAY = 120;
const INDEX_TOUCH_CLICK_SUPPRESSION = 420;
const SCROLL_ECHO_SETTLE = 300;
const INDEX_RAIL_VERTICAL_INSET = 40;
const INDEX_RAIL_ITEM_MAX_HEIGHT = 36;
const INDEX_RAIL_BUTTON_WIDTH = 42;
const INDEX_RAIL_WIDTH_GAP = 14;
const INDEX_RAIL_FULL_CHARACTER_WIDTH = 24;
const INDEX_RAIL_FULL_MAX_WIDTH = 240;
const sameValue = (left, right) => Object.is(left, right);
const isIndexValue = (value) => (
  (typeof value === 'number' && Number.isFinite(value))
  || (typeof value === 'string' && value.length > 0 && value.trim() === value)
);
const clamp = (value, min, max, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
};
const text = (value, fallback = '') => value === null || value === undefined ? fallback : String(value);

const normalizeEntry = (entry, index) => {
  const source = entry && typeof entry === 'object' ? entry : { label: entry };
  const label = text(source.label !== undefined ? source.label : source.title !== undefined ? source.title : source.text);
  const value = source.value !== undefined ? source.value : label || index;
  return {
    ...source,
    id: `entry-${index}`,
    label,
    description: text(source.description),
    note: text(source.note),
    value,
    valueText: text(source.valueText, typeof value === 'string' || typeof value === 'number' ? String(value) : label),
    icon: text(source.icon !== undefined ? source.icon : source.leftIcon),
    rightIcon: text(source.rightIcon),
    image: text(source.image),
    badge: source.badge === null || source.badge === undefined ? '' : source.badge,
    badgeDot: Boolean(source.badgeDot),
    badgeMax: clamp(source.badgeMax, 1, 9999, 99),
    arrow: Boolean(source.arrow),
    clickable: source.clickable !== false,
    disabled: Boolean(source.disabled),
  };
};

const normalizeGroups = (items) => {
  if (!Array.isArray(items)) return [];
  const indexes = [];
  return items.reduce((groups, entry, sourceIndex) => {
    const source = entry && typeof entry === 'object' ? entry : { index: entry };
    const index = source.index !== undefined ? source.index : source.letter !== undefined ? source.letter : source.title;
    if (!isIndexValue(index) || indexes.some((value) => sameValue(value, index))) return groups;
    indexes.push(index);
    const children = Array.isArray(source.children) ? source.children : Array.isArray(source.items) ? source.items : [];
    groups.push({
      ...source,
      id: `pui-indexes-group-${sourceIndex}`,
      index,
      title: text(source.title, String(index)),
      disabled: Boolean(source.disabled),
      children: children.map(normalizeEntry),
    });
    return groups;
  }, []);
};

const groupIndexOf = (groups, value) => groups.findIndex((group) => sameValue(group.index, value));
const firstAvailable = (groups) => {
  const group = groups.find((entry) => !entry.disabled);
  return group ? group.index : null;
};
const fixed = (value) => String(Math.round(value * 100) / 100);
const indexGeometry = (height, navigation, showFullIndex) => {
  const count = navigation.length;
  const availableHeight = Math.max(1, height - INDEX_RAIL_VERTICAL_INSET);
  const itemHeight = count ? Math.min(INDEX_RAIL_ITEM_MAX_HEIGHT, availableHeight / count) : INDEX_RAIL_ITEM_MAX_HEIGHT;
  const railHeight = count ? itemHeight * count : 0;
  const longest = navigation.reduce((length, item) => Math.max(length, Array.from(String(item.index)).length), 1);
  const buttonWidth = showFullIndex
    ? Math.min(INDEX_RAIL_FULL_MAX_WIDTH, INDEX_RAIL_BUTTON_WIDTH + Math.max(0, longest - 1) * INDEX_RAIL_FULL_CHARACTER_WIDTH)
    : INDEX_RAIL_BUTTON_WIDTH;
  return {
    itemHeight,
    railHeight,
    buttonWidth,
    railWidth: buttonWidth + INDEX_RAIL_WIDTH_GAP,
    fontSize: Math.min(24, Math.max(8, itemHeight - 2)),
  };
};

Component({
  behaviors: [themeBehavior],
  options: { addGlobalClass: true },

  properties: {
    items: { type: Array, value: [] },
    current: { type: null, value: null },
    defaultCurrent: { type: null, value: null },
    indexList: { type: null, value: null },
    showFullIndex: { type: Boolean, value: false },
    height: { type: Number, value: 680 },
    sticky: { type: Boolean, value: true },
    stickyOffset: { type: Number, value: 0 },
    indexPosition: { type: String, value: 'right' },
    clickable: { type: Boolean, value: true },
    readonly: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '加载失败' },
    retryText: { type: String, value: '重新加载' },
    emptyText: { type: String, value: '暂无索引数据' },
    ariaLabel: { type: String, value: '索引列表' },
    reduceMotion: { type: Boolean, value: false },
  },

  data: {
    groups: [],
    navigation: [],
    innerCurrent: null,
    activeGroupIndex: -1,
    scrollIntoView: '',
    stateType: 'empty',
    rootClass: 'pui-indexes pui-indexes--empty',
    rootStyle: '',
    semanticLabel: '索引列表',
    indexPreviewVisible: false,
    indexPreviewText: '',
    indexPreviewStyle: '',
    errorIcon: { name: 'error-circle', size: 88 },
    emptyIcon: { name: 'inbox', size: 88 },
  },

  observers: {
    'items,current,defaultCurrent,indexList,showFullIndex,height,sticky,stickyOffset,indexPosition,clickable,readonly,disabled,loading,loadingText,error,errorText,retryText,emptyText,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },

  lifetimes: {
    attached() {
      this._ready = true;
      this._wasControlled = this.isControlled();
      this._defaultInitialized = false;
      this._lastScrollTop = 0;
      this._groupOffsets = [];
      this.syncState();
    },
    detached() {
      if (this._measureTimer) clearTimeout(this._measureTimer);
      if (this._programmaticTimer) clearTimeout(this._programmaticTimer);
      if (this._scrollEchoTimer) clearTimeout(this._scrollEchoTimer);
      if (this._previewHoldTimer) clearTimeout(this._previewHoldTimer);
    },
  },

  methods: {
    isControlled() {
      return this.properties.current !== null && this.properties.current !== undefined;
    },

    syncState() {
      if (!this._ready) return;
      const groups = normalizeGroups(this.properties.items);
      const controlled = this.isControlled();
      const previous = this.data.innerCurrent;
      let current = previous;
      if (controlled) {
        const controlledIndex = groupIndexOf(groups, this.properties.current);
        current = controlledIndex >= 0 && !groups[controlledIndex].disabled ? this.properties.current : null;
        if (current !== null) this._lastControlledCurrent = current;
      } else if (this._wasControlled) {
        const lastControlledIndex = groupIndexOf(groups, this._lastControlledCurrent);
        current = lastControlledIndex >= 0 && !groups[lastControlledIndex].disabled ? this._lastControlledCurrent : firstAvailable(groups);
        this._defaultInitialized = true;
      } else if (!this._defaultInitialized) {
        current = groupIndexOf(groups, this.properties.defaultCurrent) >= 0 && !groups[groupIndexOf(groups, this.properties.defaultCurrent)].disabled
          ? this.properties.defaultCurrent
          : firstAvailable(groups);
        this._defaultInitialized = true;
      } else if (groupIndexOf(groups, current) < 0 || (groups[groupIndexOf(groups, current)] || {}).disabled) {
        current = firstAvailable(groups);
      }
      this._wasControlled = controlled;

      const requested = Array.isArray(this.properties.indexList) ? this.properties.indexList : groups.map((group) => group.index);
      const navigation = requested.reduce((result, value) => {
        const groupIndex = groupIndexOf(groups, value);
        if (groupIndex < 0 || result.some((item) => sameValue(item.index, value))) return result;
        const group = groups[groupIndex];
        result.push({
          index: group.index,
          groupIndex,
          title: group.title,
          disabled: group.disabled,
          display: this.properties.showFullIndex ? String(group.index) : Array.from(String(group.index))[0] || '',
          active: sameValue(group.index, current),
        });
        return result;
      }, []);
      const activeGroupIndex = groupIndexOf(groups, current);
      const stateType = this.properties.error ? 'error' : this.properties.loading ? 'loading' : groups.length ? 'content' : 'empty';
      const position = this.properties.indexPosition === 'left' ? 'left' : 'right';
      const requestedHeight = clamp(this.properties.height, 240, 1200, 680);
      const geometry = indexGeometry(requestedHeight, navigation, this.properties.showFullIndex);
      const rootClass = [
        'pui-indexes', this.getColorSchemeClass(), `pui-indexes--${stateType}`,
        `pui-indexes--bar-${position}`, navigation.length ? '' : 'pui-indexes--hide-index',
        this.properties.showFullIndex ? 'pui-indexes--full-index' : '',
        this.properties.sticky ? 'pui-indexes--sticky' : '', this.properties.disabled ? 'pui-indexes--disabled' : '',
        this.properties.readonly ? 'pui-indexes--readonly' : '', this.properties.reduceMotion ? 'pui-indexes--reduced' : '',
      ].filter(Boolean).join(' ');
      const rootStyle = [
        `--pui-indexes-height:${requestedHeight}rpx`,
        `--pui-indexes-sticky-offset:${clamp(this.properties.stickyOffset, 0, 240, 0)}rpx`,
        `--pui-indexes-duration:${this.properties.reduceMotion ? 1 : INDEXES_MOTION_DURATION}ms`,
        '--pui-indexes-easing:var(--pui-ease-standard)',
        `--pui-indexes-rail-item-height:${fixed(geometry.itemHeight)}rpx`,
        `--pui-indexes-rail-height:${fixed(geometry.railHeight)}rpx`,
        `--pui-indexes-rail-button-width:${fixed(geometry.buttonWidth)}rpx`,
        `--pui-indexes-rail-width:${fixed(geometry.railWidth)}rpx`,
        `--pui-indexes-rail-font-size:${fixed(geometry.fontSize)}rpx`,
      ].join(';');
      let scrollIntoView = this.data.scrollIntoView;
      if (stateType !== 'content') scrollIntoView = '';
      else if (!sameValue(previous, current) && activeGroupIndex >= 0) {
        if (sameValue(this._scrollEchoCurrent, current)) {
          this.clearScrollEcho();
        } else {
          this.markProgrammatic(current);
          scrollIntoView = groups[activeGroupIndex].id;
        }
      }
      if (stateType !== 'content') this.finishIndexTouch();
      this.setData({
        groups,
        navigation,
        innerCurrent: current,
        activeGroupIndex,
        scrollIntoView,
        stateType,
        rootClass,
        rootStyle,
        semanticLabel: text(this.properties.ariaLabel, '索引列表'),
        indexPreviewVisible: stateType === 'content' && this.data.indexPreviewVisible,
      }, () => {
        if (stateType === 'content') this.scheduleMeasure();
      });
    },

    scheduleMeasure() {
      if (this._measureTimer) clearTimeout(this._measureTimer);
      this._measureTimer = setTimeout(() => { this._measureTimer = null; this.measureGroups(); }, 0);
    },

    measureGroups() {
      if (typeof this.createSelectorQuery !== 'function' || !this.data.groups.length) return;
      const query = this.createSelectorQuery();
      query.select('.pui-indexes__scroll').boundingClientRect();
      query.selectAll('.pui-indexes__group').boundingClientRect();
      query.select('.pui-indexes__bar').boundingClientRect();
      query.select('.pui-indexes__body').boundingClientRect();
      query.exec((result) => {
        const viewport = result && result[0];
        const rects = result && result[1];
        if (viewport && Array.isArray(rects)) {
          this._viewportHeight = Math.max(0, Number(viewport.height) || 0);
          this._groupOffsets = rects.map((rect, index) => ({ index, top: Math.max(0, rect.top - viewport.top + (this._lastScrollTop || 0)) }));
        }
        this._barRect = result && result[2] || null;
        this._bodyRect = result && result[3] || null;
      });
    },

    detailFor(groupIndex, source) {
      const group = this.data.groups[groupIndex];
      return { current: group.index, previousCurrent: this.data.innerCurrent, index: group.index, group, groupIndex, source, controlled: this.isControlled() };
    },

    requestGroup(groupIndex, source = 'index', select = true) {
      const group = this.data.groups[groupIndex];
      if (!group || group.disabled || this.properties.disabled || this.properties.loading || this.properties.error) return false;
      const detail = this.detailFor(groupIndex, source);
      if (select) this.triggerEvent('select', detail);
      if (sameValue(group.index, this.data.innerCurrent)) {
        if (source !== 'scroll') this.applyAnchor(group);
        return true;
      }
      if (source === 'scroll' && this.isControlled()) this.markScrollEcho(group.index);
      this.triggerEvent('change', detail);
      if (source !== 'scroll') this.applyAnchor(group);
      if (!this.isControlled()) {
        this.setData({ innerCurrent: group.index, activeGroupIndex: groupIndex, navigation: this.data.navigation.map((item) => ({ ...item, active: sameValue(item.index, group.index) })) });
      }
      return true;
    },

    applyAnchor(group) {
      this.markProgrammatic(group.index);
      const anchor = group.id;
      if (this.data.scrollIntoView !== anchor) this.setData({ scrollIntoView: anchor });
      else this.setData({ scrollIntoView: '' }, () => setTimeout(() => this.setData({ scrollIntoView: anchor }), 0));
    },

    markProgrammatic(value) {
      if (this._programmaticTimer) clearTimeout(this._programmaticTimer);
      this._programmaticCurrent = value;
      this._programmaticTimer = setTimeout(
        () => { this._programmaticTimer = null; this._programmaticCurrent = undefined; },
        this.properties.reduceMotion ? 2 : INDEXES_MOTION_DURATION + PROGRAMMATIC_SCROLL_SETTLE,
      );
    },

    cancelProgrammatic() {
      if (this._programmaticTimer) clearTimeout(this._programmaticTimer);
      this._programmaticTimer = null;
      this._programmaticCurrent = undefined;
    },

    markScrollEcho(value) {
      if (this._scrollEchoTimer) clearTimeout(this._scrollEchoTimer);
      this._scrollEchoCurrent = value;
      this._scrollEchoTimer = setTimeout(() => this.clearScrollEcho(), SCROLL_ECHO_SETTLE);
    },

    clearScrollEcho() {
      if (this._scrollEchoTimer) clearTimeout(this._scrollEchoTimer);
      this._scrollEchoTimer = null;
      this._scrollEchoCurrent = undefined;
    },

    onIndexClick(event) {
      if (Date.now() < (this._suppressIndexClickUntil || 0)) return;
      this.requestGroup(Number(event.currentTarget.dataset.groupIndex), 'index', true);
    },

    onIndexTouchStart(event) {
      if (this.properties.disabled || this.properties.loading || this.properties.error || !this.data.navigation.length) return;
      this.cancelProgrammatic();
      this._indexTouchActive = true;
      this.handleIndexTouch(event, false);
      if (this._previewHoldTimer) clearTimeout(this._previewHoldTimer);
      this._previewHoldTimer = setTimeout(() => {
        this._previewHoldTimer = null;
        if (this._indexTouchActive && this._pendingPreviewItem) {
          this.showIndexPreview(this._pendingPreviewItem, this._pendingPreviewClientY);
        }
      }, this.properties.reduceMotion ? 1 : INDEX_PREVIEW_HOLD_DELAY);
    },

    onIndexTouchMove(event) {
      if (!this._indexTouchActive) return;
      if (this._previewHoldTimer) clearTimeout(this._previewHoldTimer);
      this._previewHoldTimer = null;
      this.handleIndexTouch(event, true);
    },

    onIndexTouchEnd(event) {
      if (this._indexTouchActive) this.handleIndexTouch(event, true);
      this.finishIndexTouch();
    },

    onIndexTouchCancel() {
      this.finishIndexTouch();
    },

    finishIndexTouch() {
      if (this._previewHoldTimer) clearTimeout(this._previewHoldTimer);
      this._previewHoldTimer = null;
      if (this._indexTouchActive) this._suppressIndexClickUntil = Date.now() + INDEX_TOUCH_CLICK_SUPPRESSION;
      this._indexTouchActive = false;
      this._lastTouchGroupIndex = undefined;
      this._pendingPreviewItem = null;
      this._pendingPreviewClientY = undefined;
      if (this.data.indexPreviewVisible) this.setData({ indexPreviewVisible: false });
    },

    showIndexPreview(item, clientY) {
      if (!item || this.properties.disabled || this.properties.loading || this.properties.error || this.data.stateType !== 'content') return;
      const body = this._bodyRect;
      let top = '50%';
      if (body && Number.isFinite(Number(clientY))) {
        const halfPreview = Math.min(44, Math.max(0, Number(body.height) / 2));
        top = `${Math.max(halfPreview, Math.min(Number(body.height) - halfPreview, Number(clientY) - Number(body.top)))}px`;
      }
      this.setData({
        indexPreviewVisible: true,
        indexPreviewText: String(item.index),
        indexPreviewStyle: `top:${top};`,
      });
    },

    handleIndexTouch(event, showPreview) {
      const point = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);
      const rect = this._barRect;
      if (!point || !rect || !this.data.navigation.length) return;
      const ratio = Math.max(0, Math.min(.999999, (point.clientY - rect.top) / Math.max(1, rect.height)));
      const item = this.data.navigation[Math.floor(ratio * this.data.navigation.length)];
      if (!item) return;
      this._pendingPreviewItem = item;
      this._pendingPreviewClientY = point.clientY;
      if (showPreview) this.showIndexPreview(item, point.clientY);
      if (item.groupIndex !== this._lastTouchGroupIndex) {
        this._lastTouchGroupIndex = item.groupIndex;
        this.requestGroup(item.groupIndex, 'touch', true);
      }
    },

    onEntryClick(event) {
      const groupIndex = Number(event.currentTarget.dataset.groupIndex);
      const itemIndex = Number(event.currentTarget.dataset.itemIndex);
      const group = this.data.groups[groupIndex];
      const item = group && group.children[itemIndex];
      if (!group || !item || group.disabled || item.disabled || item.clickable === false || !this.properties.clickable || this.properties.readonly || this.properties.disabled || this.properties.loading || this.properties.error) return;
      this.triggerEvent('item-click', { value: item.value, valueText: item.valueText, item, itemIndex, group, groupIndex, current: group.index, source: 'item' });
    },

    onScroll(event) {
      const scrollTop = Math.max(0, Number(event.detail && event.detail.scrollTop) || 0);
      this._lastScrollTop = scrollTop;
      if (this.properties.disabled || this.properties.loading || this.properties.error || !this._groupOffsets.length) return;
      let activeIndex = 0;
      this._groupOffsets.forEach((offset) => { if (offset.top <= scrollTop + 2) activeIndex = offset.index; });
      const scrollHeight = Math.max(0, Number(event.detail && event.detail.scrollHeight) || 0);
      if (scrollHeight && this._viewportHeight && scrollTop + this._viewportHeight >= scrollHeight - 2) activeIndex = this.data.groups.length - 1;
      const group = this.data.groups[activeIndex];
      if (!group || this._programmaticCurrent !== undefined) return;
      this.requestGroup(activeIndex, 'scroll', false);
    },

    onContentTouchStart() {
      this.cancelProgrammatic();
      if (this.data.scrollIntoView) this.setData({ scrollIntoView: '' });
    },

    onRetry() {
      if (!this.properties.disabled) this.triggerEvent('retry', { source: 'button' });
    },
  },
});
