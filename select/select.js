var themeBehavior = require('../common/behaviors/theme');

var EASINGS = { standard: 'var(--pui-ease-standard)', ease: 'ease', linear: 'linear', 'ease-in': 'ease-in', 'ease-out': 'ease-out', 'ease-in-out': 'ease-in-out' };

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function normalize(options) {
  return (Array.isArray(options) ? options : []).map(function item(option, index) {
    if (!option || typeof option !== 'object') {
      return { id: 'pui-select-option-' + index, label: String(option), value: String(option), disabled: false, raw: option, selected: false };
    }
    var label = hasValue(option.label) ? String(option.label) : (hasValue(option.text) ? String(option.text) : String(index + 1));
    return {
      id: 'pui-select-option-' + index,
      label: label,
      value: option.value === undefined || option.value === null ? String(index) : option.value,
      disabled: Boolean(option.disabled),
      raw: option,
      selected: false
    };
  });
}

function findIndex(items, value) {
  for (var index = 0; index < items.length; index += 1) {
    if (items[index].value === value) return index;
  }
  return -1;
}

function duration(value, reduceMotion) {
  if (reduceMotion) return 1;
  var next = Math.round(Number(value));
  if (!isFinite(next)) next = 500;
  return Math.max(0, Math.min(1000, next));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    options: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: '' },
    placeholder: { type: String, value: '请选择' },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    emptyText: { type: String, value: '暂无可选项' },
    ariaLabel: { type: String, value: '选择器' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalized: [],
    selectedIndex: -1,
    selectedLabel: '',
    displayLabel: '请选择',
    innerValue: '',
    menuVisible: false,
    menuDisabled: false,
    rootClass: '',
    rootStyle: '',
    semanticLabel: '选择器'
  },
  observers: {
    'options,value,defaultValue,placeholder,disabled,readonly,emptyText,ariaLabel,duration,easing,reduceMotion,colorScheme': function sync() {
      this.syncOptions();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncOptions();
    }
  },
  methods: {
    isControlled: function isControlled() {
      return this.data.value !== null && this.data.value !== undefined;
    },
    syncOptions: function syncOptions() {
      var items = normalize(this.data.options);
      var value;
      if (this.isControlled()) value = this.data.value;
      else if (!this._initialized) {
        value = this.data.defaultValue;
        this._initialized = true;
      } else value = this.data.innerValue;
      var index = findIndex(items, value);
      items = items.map(function markSelected(item, itemIndex) {
        item.selected = itemIndex === index;
        return item;
      });
      var disabled = this.data.disabled || this.data.readonly || !items.length;
      this.setData({
        normalized: items,
        selectedIndex: index,
        selectedLabel: index > -1 ? items[index].label : '',
        displayLabel: index > -1 ? items[index].label : (items.length ? this.data.placeholder : this.data.emptyText),
        innerValue: index > -1 ? items[index].value : value,
        menuVisible: disabled ? false : this.data.menuVisible,
        menuDisabled: disabled,
        rootClass: [
          'pui-select',
          this.getColorSchemeClass(),
          this.data.disabled ? 'pui-select--disabled' : '',
          this.data.readonly ? 'pui-select--readonly' : '',
          !items.length ? 'pui-select--empty' : '',
          index < 0 ? 'pui-select--placeholder' : '',
          this.data.menuVisible && !disabled ? 'pui-select--open' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-select-duration:' + duration(this.data.duration, this.data.reduceMotion) + 'ms;--pui-select-ease:' + (EASINGS[this.data.easing] || EASINGS.standard) + ';',
        semanticLabel: (this.data.ariaLabel || '选择器').trim() || '选择器'
      });
    },
    onTriggerClick: function onTriggerClick() {
      if (this.data.menuDisabled) return false;
      this.setData({ menuVisible: true });
      this.syncOptions();
      return true;
    },
    onOptionClick: function onOptionClick(event) {
      if (this.data.menuDisabled) return false;
      var index = Number(event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.index : -1);
      var item = this.data.normalized[index];
      if (!item || item.disabled) return false;
      var detail = { value: item.value, index: index, option: item.raw, source: 'option' };
      if (!this.isControlled()) this.data.innerValue = item.value;
      this.setData({ menuVisible: false });
      this.syncOptions();
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      return true;
    },
    onPopupVisibleChange: function onPopupVisibleChange(event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      if (visible || !this.data.menuVisible) return;
      this.setData({ menuVisible: false });
      this.syncOptions();
      this.triggerEvent('cancel', {
        value: this.data.innerValue,
        index: this.data.selectedIndex,
        source: event && event.detail && event.detail.trigger ? event.detail.trigger : 'popup'
      });
    }
  }
});
