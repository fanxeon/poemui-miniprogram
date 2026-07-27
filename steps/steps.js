var themeBehavior = require('../common/behaviors/theme');

var STATUSES = ['default', 'process', 'finish', 'error'];

function isMissing(value) {
  return value === null || value === undefined;
}

function toText(value) {
  return isMissing(value) ? '' : String(value);
}

function itemValue(item, index) {
  return item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, 'value') ? item.value : index;
}

function normalizeStatus(value, fallback) {
  return STATUSES.indexOf(value) > -1 ? value : fallback;
}

function findValueIndex(items, value) {
  if (isMissing(value)) return -1;
  for (var index = 0; index < items.length; index += 1) {
    if (itemValue(items[index], index) === value) return index;
  }
  return -1;
}

function firstAvailableValue(items) {
  for (var index = 0; index < items.length; index += 1) {
    var item = items[index];
    if (!(item && typeof item === 'object' && item.disabled)) return itemValue(item, index);
  }
  return null;
}

function normalizeItems(items, currentValue, currentStatus, sequence) {
  if (!Array.isArray(items)) return [];
  var currentIndex = findValueIndex(items, currentValue);
  var normalized = items.map(function mapItem(entry, index) {
    var source = entry && typeof entry === 'object' ? entry : { title: entry };
    var rawTitle = source.title;
    if (isMissing(rawTitle) || rawTitle === '') rawTitle = source.label;
    if (isMissing(rawTitle) || rawTitle === '') rawTitle = String(index + 1);
    var derivedStatus = index < currentIndex ? 'finish' : index === currentIndex ? currentStatus : 'default';
    var status = source.status ? normalizeStatus(source.status, 'default') : derivedStatus;
    var statusText = status === 'finish' ? '已完成' : status === 'process' ? '进行中' : status === 'error' ? '错误' : '未开始';
    return {
      id: 'pui-step-' + index,
      index: index,
      displayIndex: index + 1,
      value: itemValue(source, index),
      title: toText(rawTitle),
      content: toText(isMissing(source.content) ? source.description : source.content),
      extra: toText(source.extra),
      icon: toText(source.icon),
      status: status,
      disabled: !!source.disabled,
      active: index === currentIndex,
      lineActive: sequence === 'reverse' ? status === 'process' || status === 'finish' : status === 'finish',
      ariaLabel: toText(source.ariaLabel || rawTitle) + '，' + statusText
    };
  });
  return sequence === 'reverse' ? normalized.reverse() : normalized;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    current: { type: null, value: null },
    defaultCurrent: { type: null, value: 0 },
    currentStatus: { type: String, value: 'process' },
    layout: { type: String, value: 'horizontal' },
    sequence: { type: String, value: 'positive' },
    theme: { type: String, value: 'default' },
    scrollable: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '步骤进度' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalizedItems: [],
    innerCurrent: null,
    currentIndex: -1,
    rootClass: 'pui-steps',
    rootStyle: '--pui-steps-duration:500ms;',
    semanticLabel: '步骤进度',
    normalizedLayout: 'horizontal'
  },
  observers: {
    'items,current,defaultCurrent,currentStatus,layout,sequence,theme,scrollable,readonly,disabled,ariaLabel,reduceMotion,colorScheme': function syncObserver() {
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
      return !isMissing(this.data.current);
    },
    syncState: function syncState() {
      if (!this._ready) return;
      var sourceItems = Array.isArray(this.data.items) ? this.data.items : [];
      var controlled = this.isControlled();
      if (controlled) {
        this._lastControlledCurrent = this.data.current;
      } else if (this._wasControlled) {
        this._innerCurrent = this._lastControlledCurrent;
        this._initialized = true;
      }
      if (!controlled && !this._initialized) {
        var defaultIndex = findValueIndex(sourceItems, this.data.defaultCurrent);
        var defaultItem = defaultIndex > -1 ? sourceItems[defaultIndex] : null;
        this._innerCurrent = defaultIndex > -1 && !(defaultItem && typeof defaultItem === 'object' && defaultItem.disabled) ? this.data.defaultCurrent : firstAvailableValue(sourceItems);
        this._initialized = !!sourceItems.length;
      }
      var resolvedCurrent = controlled ? this.data.current : this._innerCurrent;
      var currentIndex = findValueIndex(sourceItems, resolvedCurrent);
      if (!controlled && currentIndex < 0 && sourceItems.length) {
        resolvedCurrent = firstAvailableValue(sourceItems);
        currentIndex = findValueIndex(sourceItems, resolvedCurrent);
        this._innerCurrent = resolvedCurrent;
      }
      var currentStatus = normalizeStatus(this.data.currentStatus, 'process');
      var sequence = this.data.sequence === 'reverse' ? 'reverse' : 'positive';
      var layout = this.data.layout === 'vertical' ? 'vertical' : 'horizontal';
      var theme = this.data.theme === 'dot' ? 'dot' : 'default';
      var duration = this.data.reduceMotion ? 1 : 500;
      this._wasControlled = controlled;
      this.setData({
        normalizedItems: normalizeItems(sourceItems, resolvedCurrent, currentStatus, sequence),
        innerCurrent: resolvedCurrent,
        currentIndex: currentIndex,
        rootClass: [
          'pui-steps',
          this.getColorSchemeClass(),
          'pui-steps--' + layout,
          'pui-steps--' + theme,
          'pui-steps--' + sequence,
          this.data.scrollable && layout === 'horizontal' ? 'pui-steps--scrollable' : '',
          this.data.readonly ? 'pui-steps--readonly' : '',
          this.data.disabled ? 'pui-steps--disabled' : '',
          this.data.reduceMotion ? 'pui-steps--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-steps-duration:' + duration + 'ms;',
        semanticLabel: toText(this.data.ariaLabel || '步骤进度').trim() || '步骤进度',
        normalizedLayout: layout
      });
    },
    requestSelect: function requestSelect(index, source) {
      var sourceItems = Array.isArray(this.data.items) ? this.data.items : [];
      var rawItem = sourceItems[index];
      var item = this.data.normalizedItems.find(function find(entry) { return entry.index === index; });
      if (!item || this.data.readonly || this.data.disabled || item.disabled) return false;
      var nextValue = item.value;
      var previousValue = this.data.innerCurrent;
      var previousIndex = findValueIndex(sourceItems, previousValue);
      if (nextValue === previousValue) return true;
      var controlled = this.isControlled();
      if (!controlled) {
        this._innerCurrent = nextValue;
        this.syncState();
      }
      this.triggerEvent('change', {
        value: nextValue,
        index: index,
        item: rawItem === undefined ? null : rawItem,
        previousValue: previousValue,
        previousIndex: previousIndex,
        source: source || 'item',
        controlled: controlled
      });
      return true;
    },
    onSelect: function onSelect(event) {
      this.requestSelect(Number(event.currentTarget.dataset.index), 'item');
    }
  }
});
