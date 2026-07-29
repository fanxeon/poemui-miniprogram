var themeBehavior = require('../common/behaviors/theme');

function sameValue(left, right) {
  return left === right;
}

function isSelectionValue(value) {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function clamp(value, min, max, fallback) {
  var number = Math.round(Number(value));
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function safeColor(value) {
  var color = String(value || '').trim();
  if (!color) return '';
  if (/^#[0-9a-f]{3,8}$/i.test(color) || /^rgba?\([\d\s.,%]+\)$/i.test(color) || /^(transparent|currentColor)$/i.test(color) || /^var\(--[a-z0-9-]+\)$/i.test(color)) return color;
  return '';
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map(function mapItem(item, index) {
    var source = item && typeof item === 'object' ? item : { label: item };
    var hasExplicitLabel = Object.prototype.hasOwnProperty.call(source, 'label') && source.label !== undefined && source.label !== null;
    var rawLabel = hasExplicitLabel ? source.label : source.text;
    if ((rawLabel === undefined || rawLabel === null || rawLabel === '') && !hasExplicitLabel) rawLabel = source.title;
    if ((rawLabel === undefined || rawLabel === null || rawLabel === '') && !hasExplicitLabel) rawLabel = String(index + 1);
    var label = rawLabel === undefined || rawLabel === null ? '' : String(rawLabel);
    var badge = source.badge;
    var badgeDot = !!source.badgeDot;
    return {
      id: 'pui-tabbar-item-' + index,
      label: label,
      value: isSelectionValue(source.value) ? source.value : index,
      icon: String(source.icon || ''),
      activeIcon: String(source.activeIcon || ''),
      badge: badge === undefined || badge === null ? '' : badge,
      badgeDot: badgeDot,
      hasBadge: badgeDot || !(badge === undefined || badge === null || badge === ''),
      badgeMaxCount: clamp(source.badgeMaxCount, 1, 9999, 99),
      badgeColor: safeColor(source.badgeColor),
      disabled: !!source.disabled,
      ariaLabel: String(source.ariaLabel || label || ('目的地 ' + String(index + 1))),
      active: false,
      resolvedIcon: ''
    };
  });
}

function firstAvailable(items) {
  for (var index = 0; index < items.length; index += 1) {
    if (!items[index].disabled) return items[index].value;
  }
  return null;
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    theme: { type: String, value: 'normal' },
    shape: { type: String, value: 'normal' },
    bordered: { type: Boolean, value: false },
    split: { type: Boolean, value: true },
    fixed: { type: Boolean, value: true },
    placeholder: { type: Boolean, value: false },
    safeAreaInsetBottom: { type: Boolean, value: true },
    zIndex: { type: Number, value: 1000 },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '底部标签栏' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalizedItems: [],
    innerValue: null,
    activeIndex: -1,
    rootClass: 'pui-tabbar',
    rootStyle: '',
    placeholderClass: 'pui-tabbar__placeholder',
    semanticLabel: '底部标签栏'
  },
  observers: {
    'items,value,defaultValue,theme,shape,bordered,split,fixed,placeholder,safeAreaInsetBottom,zIndex,disabled,ariaLabel,reduceMotion,colorScheme': function syncObserver() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncState();
    }
  },
  methods: {
    isControlled: function isControlled() {
      return this.data.value !== null && this.data.value !== undefined;
    },
    syncState: function syncState() {
      if (!this._ready) return;
      var items = normalizeItems(this.data.items);
      var controlled = this.isControlled();
      if (controlled) {
        this._lastControlledValue = isSelectionValue(this.data.value) ? this.data.value : null;
      } else if (this._wasControlled) {
        this._innerValue = this._lastControlledValue;
        this._initialized = true;
      }
      if (!controlled && !this._initialized) {
        this._innerValue = isSelectionValue(this.data.defaultValue)
          ? this.data.defaultValue
          : firstAvailable(items);
        this._initialized = true;
      }
      var current = controlled
        ? (isSelectionValue(this.data.value) ? this.data.value : null)
        : this._innerValue;
      var activeIndex = items.findIndex(function find(item) { return sameValue(item.value, current); });
      if (!controlled && (!isSelectionValue(current) || activeIndex < 0)) {
        current = firstAvailable(items);
        this._innerValue = current;
        activeIndex = items.findIndex(function find(item) { return sameValue(item.value, current); });
      }
      items = items.map(function mark(item, index) {
        item.active = index === activeIndex;
        item.resolvedIcon = item.active && item.activeIcon ? item.activeIcon : item.icon;
        item.semanticLabel = item.ariaLabel
          + (item.active ? '，已选中' : '')
          + (item.disabled ? '，不可用' : '')
          + (item.badgeDot ? '，有新通知' : item.hasBadge ? '，徽标 ' + String(item.badge) : '');
        return item;
      });
      var theme = this.data.theme === 'tag' ? 'tag' : 'normal';
      var shape = this.data.shape === 'round' ? 'round' : 'normal';
      var fixed = !!this.data.fixed;
      var allIconOnly = items.length > 0 && items.every(function everyItem(item) { return !item.label; });
      this._wasControlled = controlled;
      this.setData({
        normalizedItems: items,
        innerValue: current,
        activeIndex: activeIndex,
        rootClass: [
          'pui-tabbar',
          this.getColorSchemeClass(),
          'pui-tabbar--theme-' + theme,
          'pui-tabbar--shape-' + shape,
          this.data.bordered ? '' : 'pui-tabbar--borderless',
          this.data.split ? 'pui-tabbar--split' : '',
          allIconOnly ? 'pui-tabbar--all-icon-only' : '',
          fixed ? 'pui-tabbar--fixed' : '',
          this.data.safeAreaInsetBottom ? 'pui-tabbar--safe-bottom' : '',
          this.data.disabled ? 'pui-tabbar--disabled' : '',
          this.data.reduceMotion ? 'pui-tabbar--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-tabbar-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;z-index:' + clamp(this.data.zIndex, 1, 12000, 1000) + ';',
        placeholderClass: [
          'pui-tabbar__placeholder',
          shape === 'round' ? 'pui-tabbar__placeholder--round' : '',
          this.data.safeAreaInsetBottom ? 'pui-tabbar__placeholder--safe' : ''
        ].filter(Boolean).join(' '),
        semanticLabel: String(this.data.ariaLabel || '底部标签栏').trim() || '底部标签栏'
      });
    },
    requestSelect: function requestSelect(index, source) {
      var item = this.data.normalizedItems[index];
      var rawItem = Array.isArray(this.data.items) ? this.data.items[index] : null;
      if (!item || this.data.disabled || item.disabled) return false;
      var previousValue = this.data.innerValue;
      var controlled = this.isControlled();
      var detail = {
        value: item.value,
        index: index,
        item: rawItem === undefined ? null : rawItem,
        previousValue: previousValue,
        previousIndex: this.data.activeIndex,
        source: source || 'item',
        controlled: controlled
      };
      this.triggerEvent('click', detail);
      if (sameValue(item.value, previousValue) && index === this.data.activeIndex) return true;
      if (!controlled) {
        this._innerValue = item.value;
        this.syncState();
      }
      this.triggerEvent('change', detail);
      return true;
    },
    onSelect: function onSelect(event) {
      this.requestSelect(Number(event.currentTarget.dataset.index), 'item');
    }
  }
});
