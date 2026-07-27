const themeBehavior = require('../common/behaviors/theme');

const clamp = (value, min, max, fallback) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
};

const toText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const valueKey = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  return `${typeof value}:${String(value)}`;
};

const normalizeData = (items) => {
  const source = Array.isArray(items) ? items : [];
  const groups = [];
  const flatItems = [];
  const usedValues = new Set();
  let looseGroup = null;

  const appendItem = (entry, group) => {
    const sourceItem = entry && typeof entry === 'object' ? entry : { label: entry };
    const flatIndex = flatItems.length;
    const label = toText(
      sourceItem.label !== undefined
        ? sourceItem.label
        : sourceItem.title !== undefined
          ? sourceItem.title
          : sourceItem.text,
      `导航 ${flatIndex + 1}`,
    );
    const rawValue = sourceItem.value === null || sourceItem.value === undefined
      ? String(flatIndex)
      : sourceItem.value;
    const key = valueKey(rawValue);
    if (!key || usedValues.has(key)) return;
    usedValues.add(key);
    const badgeProps = sourceItem.badgeProps && typeof sourceItem.badgeProps === 'object' ? sourceItem.badgeProps : {};
    const badge = badgeProps.count !== null && badgeProps.count !== undefined
      ? badgeProps.count
      : sourceItem.badge === null || sourceItem.badge === undefined
        ? ''
        : sourceItem.badge;
    const itemIndex = group.children.length;
    const normalized = {
      ...sourceItem,
      id: `pui-sidebar-item-${group.groupIndex}-${itemIndex}`,
      label,
      value: rawValue,
      valueKey: key,
      description: toText(sourceItem.description),
      icon: toText(sourceItem.icon),
      activeIcon: toText(sourceItem.activeIcon),
      badge,
      badgeDot: Boolean(badgeProps.dot || sourceItem.badgeDot),
      badgeVisible: Boolean(badgeProps.dot || sourceItem.badgeDot || badge !== ''),
      badgeMax: clamp(badgeProps.maxCount ?? sourceItem.badgeMax, 1, 9999, 99),
      disabled: Boolean(sourceItem.disabled),
      loading: Boolean(sourceItem.loading),
      loadingProps: {
        size: 'small',
        ariaLabel: `${label}加载中`,
      },
      groupIndex: group.groupIndex,
      itemIndex,
      flatIndex,
    };
    group.children.push(normalized);
    flatItems.push(normalized);
  };

  source.forEach((entry) => {
    const sourceGroup = entry && typeof entry === 'object' ? entry : null;
    const nested = sourceGroup && Array.isArray(sourceGroup.children)
      ? sourceGroup.children
      : sourceGroup && Array.isArray(sourceGroup.items)
        ? sourceGroup.items
        : null;

    if (nested) {
      looseGroup = null;
      const groupIndex = groups.length;
      const title = toText(
        sourceGroup.title !== undefined
          ? sourceGroup.title
          : sourceGroup.label !== undefined
            ? sourceGroup.label
            : sourceGroup.group,
        `分组 ${groupIndex + 1}`,
      );
      const group = {
        ...sourceGroup,
        id: `pui-sidebar-group-${groupIndex}`,
        title,
        disabled: Boolean(sourceGroup.disabled),
        showTitle: Boolean(title),
        groupIndex,
        children: [],
      };
      groups.push(group);
      nested.forEach((item) => appendItem(item, group));
      return;
    }

    if (!looseGroup) {
      const groupIndex = groups.length;
      looseGroup = {
        id: `pui-sidebar-group-${groupIndex}`,
        title: '',
        disabled: false,
        showTitle: false,
        groupIndex,
        children: [],
      };
      groups.push(looseGroup);
    }
    appendItem(entry, looseGroup);
  });

  return {
    groups: groups.filter((group) => group.children.length),
    flatItems,
  };
};

Component({
  behaviors: [themeBehavior],
  options: {
    multipleSlots: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },

  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    theme: { type: String, value: 'default' },
    bordered: { type: Boolean, value: true },
    width: { type: Number, value: 360 },
    height: { type: Number, value: 640 },
    showGroupTitle: { type: Boolean, value: true },
    sticky: { type: Boolean, value: true },
    stickyOffset: { type: Number, value: 0 },
    showIcon: { type: Boolean, value: true },
    showDescription: { type: Boolean, value: true },
    showBadge: { type: Boolean, value: true },
    clickable: { type: Boolean, value: true },
    readonly: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '加载失败' },
    retryText: { type: String, value: '重新加载' },
    emptyText: { type: String, value: '暂无导航项' },
    ariaLabel: { type: String, value: '侧边导航' },
    reduceMotion: { type: Boolean, value: false },
  },

  data: {
    groups: [],
    flatItems: [],
    innerValue: null,
    innerKey: '',
    activeLabel: '',
    stateType: 'empty',
    rootClass: 'pui-sidebar pui-sidebar--empty',
    rootStyle: '',
    contentClass: 'pui-sidebar__scroll pui-sidebar__scroll--inactive',
    scrollIntoView: '',
    animated: true,
    semanticLabel: '侧边导航',
    loadingProps: { size: 'small', text: '加载中' },
  },

  observers: {
    'items,value,defaultValue,theme,bordered,width,height,showGroupTitle,sticky,stickyOffset,showIcon,showDescription,showBadge,clickable,readonly,disabled,loading,loadingText,error,errorText,retryText,emptyText,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },

  lifetimes: {
    attached() {
      this._ready = true;
      this._wasControlled = this.isControlled();
      this._defaultInitialized = false;
      this.syncState();
    },
    detached() {
      if (this._anchorTimer) clearTimeout(this._anchorTimer);
    },
  },

  methods: {
    isControlled() {
      return this.properties.value !== null && this.properties.value !== undefined;
    },

    syncState() {
      if (!this._ready) return;
      const reduceMotion = Boolean(this.properties.reduceMotion);
      const duration = reduceMotion ? 1 : 500;
      const normalized = normalizeData(this.properties.items);
      const { groups, flatItems } = normalized;
      const keys = flatItems.map((item) => item.valueKey);
      const firstKey = keys[0] || '';
      const controlled = this.isControlled();
      const controlledKey = valueKey(this.properties.value);
      const previousKey = this.data.innerKey || '';
      let innerKey = previousKey;
      let shouldAnchor = false;

      if (controlled) {
        innerKey = keys.includes(controlledKey) ? controlledKey : '';
        shouldAnchor = innerKey !== previousKey;
        if (this._requestedKey === innerKey) this._requestedKey = '';
      } else if (this._wasControlled) {
        innerKey = keys.includes(previousKey) ? previousKey : firstKey;
        shouldAnchor = innerKey !== previousKey;
        this._defaultInitialized = Boolean(flatItems.length);
        this._requestedKey = '';
      } else if (!this._defaultInitialized && flatItems.length) {
        const defaultKey = valueKey(this.properties.defaultValue);
        innerKey = keys.includes(defaultKey) ? defaultKey : firstKey;
        shouldAnchor = Boolean(innerKey);
        this._defaultInitialized = true;
      } else if (!keys.includes(innerKey)) {
        innerKey = firstKey;
        shouldAnchor = innerKey !== previousKey;
      }

      if (!flatItems.length) innerKey = '';
      this._wasControlled = controlled;

      const activeItem = flatItems.find((item) => item.valueKey === innerKey);
      const stateType = this.properties.error
        ? 'error'
        : this.properties.loading
          ? 'loading'
          : flatItems.length
            ? 'content'
            : 'empty';
      const theme = this.properties.theme === 'card' ? 'card' : 'default';
      const width = clamp(this.properties.width, 160, 480, 360);
      const height = clamp(this.properties.height, 240, 1200, 640);
      const stickyOffset = clamp(this.properties.stickyOffset, 0, 240, 0);
      const rootClass = [
        'pui-sidebar',
        this.getColorSchemeClass(),
        `pui-sidebar--${stateType}`,
        `pui-sidebar--${theme}`,
        this.properties.bordered ? '' : 'pui-sidebar--borderless',
        this.properties.showGroupTitle ? '' : 'pui-sidebar--hide-title',
        this.properties.showIcon ? '' : 'pui-sidebar--hide-icon',
        this.properties.showDescription ? '' : 'pui-sidebar--hide-description',
        this.properties.showBadge ? '' : 'pui-sidebar--hide-badge',
        this.properties.readonly ? 'pui-sidebar--readonly' : '',
        this.properties.disabled ? 'pui-sidebar--disabled' : '',
        reduceMotion ? 'pui-sidebar--reduced' : '',
      ].filter(Boolean).join(' ');
      const rootStyle = [
        `--pui-sidebar-width:${width}rpx`,
        `--pui-sidebar-height:${height}rpx`,
        `--pui-sidebar-sticky-offset:${stickyOffset}rpx`,
        `--pui-sidebar-duration:${duration}ms`,
        '--pui-sidebar-easing:cubic-bezier(0.2,0,0,1)',
      ].join(';');
      const contentClass = [
        'pui-sidebar__scroll',
        stateType === 'content' ? 'pui-sidebar__scroll--active' : 'pui-sidebar__scroll--inactive',
      ].join(' ');
      let scrollIntoView = this.data.scrollIntoView;
      if (stateType !== 'content') scrollIntoView = '';
      else if (shouldAnchor && activeItem) scrollIntoView = activeItem.id;

      this.setData({
        groups,
        flatItems,
        innerValue: activeItem ? activeItem.value : null,
        innerKey,
        activeLabel: activeItem ? activeItem.label : '',
        stateType,
        rootClass,
        rootStyle,
        contentClass,
        scrollIntoView,
        animated: !reduceMotion,
        semanticLabel: toText(this.properties.ariaLabel, '侧边导航'),
        loadingProps: {
          size: 'small',
          text: toText(this.properties.loadingText, '加载中'),
        },
      });
    },

    makeDetail(item, source) {
      const group = this.data.groups[item.groupIndex];
      return {
        value: item.value,
        previousValue: this.data.innerValue,
        label: item.label,
        item,
        index: item.flatIndex,
        itemIndex: item.itemIndex,
        group,
        groupIndex: item.groupIndex,
        source,
        controlled: this.isControlled(),
      };
    },

    requestItem(flatIndex, source = 'tap', options = {}) {
      const item = this.data.flatItems[flatIndex];
      const group = item && this.data.groups[item.groupIndex];
      const blocked = !item
        || !group
        || group.disabled
        || item.disabled
        || item.loading
        || this.properties.clickable === false
        || this.properties.readonly
        || this.properties.disabled
        || this.properties.loading
        || this.properties.error;
      if (blocked) return false;

      const detail = this.makeDetail(item, source);
      if (item.valueKey === this.data.innerKey || item.valueKey === this._requestedKey) {
        if (options.scroll) this.applyAnchor(item.id);
        return true;
      }

      this._requestedKey = item.valueKey;
      this.triggerEvent('change', detail);

      if (!this.isControlled()) {
        this._requestedKey = '';
        this.setData({
          innerValue: item.value,
          innerKey: item.valueKey,
          activeLabel: item.label,
          scrollIntoView: options.scroll ? item.id : this.data.scrollIntoView,
        });
      }
      if (options.scroll && this.isControlled()) this.applyAnchor(item.id);
      return true;
    },

    applyAnchor(anchor) {
      if (!anchor) return;
      if (this.data.scrollIntoView !== anchor) {
        this.setData({ scrollIntoView: anchor });
        return;
      }
      this.setData({ scrollIntoView: '' }, () => {
        const apply = () => this.setData({ scrollIntoView: anchor });
        if (typeof wx !== 'undefined' && typeof wx.nextTick === 'function') wx.nextTick(apply);
        else {
          if (this._anchorTimer) clearTimeout(this._anchorTimer);
          this._anchorTimer = setTimeout(apply, 0);
        }
      });
    },

    onSelect(event) {
      const flatIndex = Number(event.currentTarget.dataset.flatIndex);
      this.requestItem(flatIndex, 'tap');
    },

    onRetry() {
      if (this.properties.disabled) return;
      this.triggerEvent('retry', { source: 'button' });
    },

  },
});
