var themeBehavior = require('../common/behaviors/theme');

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function sameValue(left, right) {
  return left === right || (left !== left && right !== right);
}

function isControlled(data) {
  return data.value !== null && data.value !== undefined;
}

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function nextTick(callback) {
  if (typeof wx !== 'undefined' && wx.nextTick) wx.nextTick(callback);
  else setTimeout(callback, 0);
}

function normalizeOption(raw, index) {
  var primitive = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean';
  var option = primitive ? { label: raw, value: raw } : (raw && typeof raw === 'object' ? raw : {});
  var labelValue = hasOwn(option, 'label') ? option.label : (hasOwn(option, 'text') ? option.text : ('选项 ' + (index + 1)));
  return {
    key: 'dropdown-option-' + index,
    label: String(labelValue === null || labelValue === undefined ? '' : labelValue),
    value: hasOwn(option, 'value') ? option.value : index,
    disabled: Boolean(option.disabled),
    raw: raw,
    index: index,
  };
}

function normalizeItem(raw, index) {
  var item = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  var keyValue = hasOwn(item, 'key') ? item.key : (hasOwn(item, 'value') ? item.value : index);
  var labelValue = hasOwn(item, 'label') ? item.label : (hasOwn(item, 'title') ? item.title : ('筛选 ' + (index + 1)));
  var options = Array.isArray(item.options) ? item.options : [];
  return {
    key: String(keyValue === null || keyValue === undefined ? index : keyValue),
    label: String(labelValue === null || labelValue === undefined ? '' : labelValue),
    disabled: Boolean(item.disabled),
    multiple: Boolean(item.multiple),
    options: options.map(normalizeOption),
    raw: raw,
    index: index,
  };
}

function normalizeItems(items) {
  return Array.isArray(items) ? items.map(normalizeItem) : [];
}

function normalizeValue(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function valueForItem(values, item) {
  var value = normalizeValue(values)[item.key];
  return item.multiple ? (Array.isArray(value) ? value : []) : value;
}

function optionChecked(item, option, value) {
  if (item.multiple) return value.some(function contains(candidate) { return sameValue(candidate, option.value); });
  return sameValue(value, option.value);
}

function selectionLabel(item, value) {
  if (item.multiple) {
    var labels = item.options.filter(function selected(option) { return optionChecked(item, option, value); }).map(function map(option) { return option.label; });
    return labels.length ? labels.join('、') : item.label + '：未选择';
  }
  for (var index = 0; index < item.options.length; index += 1) {
    if (sameValue(item.options[index].value, value)) return item.options[index].label;
  }
  return item.label + '：未选择';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: {} },
    closeOnClickOverlay: { type: Boolean, value: true },
    showOverlay: { type: Boolean, value: true },
    zIndex: { type: Number, value: 11600 },
    ariaLabel: { type: String, value: '下拉菜单' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    mounted: false,
    active: false,
    phase: 'hidden',
    activeIndex: -1,
    itemViews: [],
    activeItem: null,
    activeOptions: [],
    activeValue: {},
    rootClass: 'pui-dropdown-menu',
    layerStyle: 'z-index:11600;--pui-dropdown-duration:500ms;',
  },
  observers: {
    'items,value,colorScheme': function observeData() { this.syncDataView(); },
    'zIndex,reduceMotion,colorScheme': function observePresentation() { this.syncPresentation(); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._innerValue = normalizeValue(this.data.defaultValue);
      this.syncPresentation();
      this.syncDataView();
    },
    detached: function detached() {
      this._ready = false;
      clearTimeout(this._motionTimer);
    },
  },
  methods: {
    motionDuration: function motionDuration() {
      return this.data.reduceMotion ? 1 : 500;
    },
    currentValue: function currentValue() {
      return normalizeValue(isControlled(this.data) ? this.data.value : this._innerValue);
    },
    syncPresentation: function syncPresentation() {
      var zIndex = Math.round(clamp(this.data.zIndex, 1, 12000, 11600));
      this.setData({
        rootClass: ['pui-dropdown-menu', this.getColorSchemeClass(), this.data.reduceMotion ? 'pui-dropdown-menu--reduced' : ''].filter(Boolean).join(' '),
        layerStyle: 'z-index:' + zIndex + ';--pui-dropdown-duration:' + this.motionDuration() + 'ms;',
      });
    },
    syncDataView: function syncDataView() {
      if (!this._ready) return;
      var items = normalizeItems(this.data.items);
      var activeIndex = Number(this.data.activeIndex);
      if (activeIndex < 0 || activeIndex >= items.length) activeIndex = -1;
      var value = this.currentValue();
      var itemViews = items.map(function mapItem(item, index) {
        var selected = valueForItem(value, item);
        return Object.assign({}, item, {
          active: index === activeIndex && this.data.active,
          summary: selectionLabel(item, selected),
        });
      }, this);
      var activeItem = itemViews[activeIndex] || null;
      var selectedValue = activeItem ? valueForItem(value, activeItem) : undefined;
      var activeOptions = activeItem ? activeItem.options.map(function mapOption(option) {
        return Object.assign({}, option, { checked: optionChecked(activeItem, option, selectedValue) });
      }) : [];
      this.setData({
        activeIndex: activeIndex,
        itemViews: itemViews,
        activeItem: activeItem,
        activeOptions: activeOptions,
        activeValue: value,
      });
    },
    publishOpen: function publishOpen(index, source) {
      var item = normalizeItems(this.data.items)[index];
      if (!item || item.disabled) return false;
      if (this.data.active && this.data.activeIndex === index) return this.publishClose(source || 'trigger');
      if (this.data.active && this.data.activeIndex >= 0) this.publishClose('switch');
      clearTimeout(this._motionTimer);
      this.setData({ mounted: true, active: false, phase: 'entering', activeIndex: index });
      this.syncDataView();
      this.triggerEvent('open', { index: index, item: item.raw, source: source || 'trigger' });
      var self = this;
      nextTick(function activateDropdown() {
        if (!self._ready || self.data.activeIndex !== index) return;
        self.setData({ active: true, phase: 'entered' });
        self.syncDataView();
      });
      return true;
    },
    publishClose: function publishClose(source) {
      var index = this.data.activeIndex;
      var item = normalizeItems(this.data.items)[index];
      if (!item || !this.data.mounted) return false;
      clearTimeout(this._motionTimer);
      this.triggerEvent('close', { index: index, item: item.raw, source: source || 'trigger' });
      this.setData({ active: false, phase: 'leaving' });
      this.syncDataView();
      var self = this;
      this._motionTimer = setTimeout(function finishClose() {
        if (!self._ready || self.data.phase !== 'leaving') return;
        self.setData({ mounted: false, phase: 'hidden', activeIndex: -1, activeItem: null, activeOptions: [] });
        self.syncDataView();
      }, this.motionDuration());
      return true;
    },
    writeValue: function writeValue(value) {
      if (!isControlled(this.data)) this._innerValue = value;
      this.syncDataView();
    },
    onTriggerTap: function onTriggerTap(event) {
      var index = Number(event.currentTarget.dataset.index);
      return this.publishOpen(index, (event.detail && event.detail.source) || 'trigger');
    },
    onOverlayTap: function onOverlayTap() {
      if (!this.data.closeOnClickOverlay) return false;
      return this.publishClose('overlay');
    },
    onOptionTap: function onOptionTap(event) {
      var item = this.data.activeItem;
      var index = Number(event.currentTarget.dataset.index);
      var option = item && this.data.activeOptions[index];
      if (!item || item.disabled || !option || option.disabled || !this.data.active) return false;
      var previous = this.currentValue();
      var next = Object.assign({}, previous);
      if (item.multiple) {
        var selected = valueForItem(previous, item).slice();
        var existing = selected.findIndex(function find(value) { return sameValue(value, option.value); });
        if (existing >= 0) selected.splice(existing, 1);
        else selected.push(option.value);
        next[item.key] = selected;
      } else {
        if (sameValue(valueForItem(previous, item), option.value)) return false;
        next[item.key] = option.value;
      }
      this.writeValue(next);
      this.triggerEvent('change', { value: next, index: item.index, item: item.raw, option: option.raw, source: (event.detail && event.detail.source) || 'option' });
      if (!item.multiple) this.publishClose('select');
      return true;
    },
    onResetTap: function onResetTap() {
      var item = this.data.activeItem;
      if (!item || !item.multiple || item.disabled || !this.data.active) return false;
      var next = Object.assign({}, this.currentValue());
      next[item.key] = [];
      this.writeValue(next);
      this.triggerEvent('change', { value: next, index: item.index, item: item.raw, source: 'reset' });
      this.triggerEvent('reset', { value: next, index: item.index, item: item.raw });
      return true;
    },
    onConfirmTap: function onConfirmTap() {
      var item = this.data.activeItem;
      if (!item || !item.multiple || item.disabled || !this.data.active) return false;
      this.triggerEvent('confirm', { value: this.currentValue(), index: item.index, item: item.raw });
      return this.publishClose('confirm');
    },
    noop: function noop() {},
  },
});
