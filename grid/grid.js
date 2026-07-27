var themeBehavior = require('../common/behaviors/theme');

var ITEM_THEMES = ['default', 'primary', 'success', 'warning', 'danger'];

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function firstOwn(object, keys, fallback) {
  for (var index = 0; index < keys.length; index += 1) {
    if (hasOwn(object, keys[index])) return object[keys[index]];
  }
  return fallback;
}

function hasContent(value) {
  return value !== undefined && value !== null && value !== '';
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map(function mapItem(source, index) {
    var primitive = typeof source === 'string' || typeof source === 'number' || typeof source === 'boolean';
    var item = primitive ? { label: source, value: source } : (source || {});
    var rawLabel = firstOwn(item, ['label', 'text', 'title'], '项目 ' + (index + 1));
    var label = rawLabel === undefined || rawLabel === null ? '' : String(rawLabel);
    var descriptionValue = firstOwn(item, ['description'], '');
    var description = descriptionValue === undefined || descriptionValue === null ? '' : String(descriptionValue);
    var iconValue = firstOwn(item, ['icon'], 'component');
    var icon = iconValue === undefined || iconValue === null ? '' : String(iconValue);
    var badge = hasOwn(item, 'badge') ? item.badge : '';
    var theme = ITEM_THEMES.indexOf(item.theme) > -1 ? item.theme : 'default';
    var ariaLabel = hasOwn(item, 'ariaLabel') ? String(item.ariaLabel || '') : [label, description].filter(Boolean).join('，');
    return {
      label: label,
      description: description,
      value: hasOwn(item, 'value') ? item.value : (primitive ? source : index),
      icon: icon,
      badge: badge,
      showBadge: hasContent(badge),
      theme: theme,
      disabled: !!item.disabled,
      ariaLabel: ariaLabel || ('宫格项目 ' + (index + 1)),
    };
  });
}

function publicItem(item) {
  return {
    label: item.label,
    description: item.description,
    value: item.value,
    icon: item.icon,
    badge: item.badge,
    theme: item.theme,
    disabled: item.disabled,
    ariaLabel: item.ariaLabel,
  };
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    column: { type: Number, value: 4 },
    gutter: { type: Number, value: 0 },
    border: { type: Boolean, value: true },
    align: { type: String, value: 'center' },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    error: { type: Boolean, value: false },
    loadingText: { type: String, value: '加载中' },
    errorText: { type: String, value: '加载失败' },
    emptyText: { type: String, value: '暂无入口' },
    retryText: { type: String, value: '重试' },
    ariaLabel: { type: String, value: '宫格导航' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: '',
    rootStyle: '',
    gridStyle: '',
    normalizedItems: [],
    status: 'empty',
    semanticLabel: '宫格导航',
    resolvedColumn: 4,
    horizontal: false,
  },
  observers: {
    'items,column,gutter,border,align,disabled,loading,error,loadingText,errorText,emptyText,retryText,ariaLabel,reduceMotion,colorScheme': function sync() { this.syncState(); },
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var items = normalizeItems(this.data.items);
      var rawColumn = Math.floor(Number(this.data.column));
      var column = isFinite(rawColumn) ? Math.max(0, Math.min(6, rawColumn)) : 4;
      var rawGutter = Number(this.data.gutter);
      var gutter = isFinite(rawGutter) ? Math.max(0, Math.min(64, rawGutter)) : 0;
      var align = ['left', 'center'].indexOf(this.data.align) > -1 ? this.data.align : 'center';
      var status = this.data.error ? 'error' : (this.data.loading ? 'loading' : (items.length ? 'content' : 'empty'));
      var duration = this.data.reduceMotion ? 1 : 500;
      var horizontal = column === 0;
      this.setData({
        rootClass: [
          'pui-grid',
          this.getColorSchemeClass(),
          'pui-grid--' + align,
          'pui-grid--' + status,
          this.data.border ? 'pui-grid--bordered' : '',
          this.data.disabled ? 'pui-grid--disabled' : '',
          horizontal ? 'pui-grid--horizontal' : '',
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-grid-duration:' + duration + 'ms;',
        gridStyle: horizontal
          ? 'grid-auto-flow:column;grid-auto-columns:160rpx;gap:' + gutter + 'rpx;'
          : 'grid-template-columns:repeat(' + Math.max(1, column) + ',minmax(0,1fr));gap:' + gutter + 'rpx;',
        normalizedItems: items,
        status: status,
        semanticLabel: String(this.data.ariaLabel || '').trim() || '宫格导航',
        resolvedColumn: column,
        horizontal: horizontal,
      });
    },
    onItemTap: function onItemTap(event) {
      if (this.data.disabled || this.data.status !== 'content') return;
      var index = Number(event.currentTarget.dataset.index);
      var item = this.data.normalizedItems[index];
      if (!item || item.disabled) return;
      this.triggerEvent('click', {
        index: index,
        item: publicItem(item),
        value: item.value,
        source: event.detail && event.detail.source ? event.detail.source : 'button',
      });
    },
    onRetry: function onRetry(event) {
      if (this.data.disabled || this.data.status !== 'error' || !this.data.retryText) return;
      this.triggerEvent('retry', {
        source: event.detail && event.detail.source ? event.detail.source : 'action',
      });
    },
  },
});
