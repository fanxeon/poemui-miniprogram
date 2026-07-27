var themeBehavior = require('../common/behaviors/theme');

function makeCells(value, length) {
  var cells = [];
  var source = String(value || '');
  var index;
  for (index = 0; index < length; index += 1) cells.push({ index: index, value: source.charAt(index) });
  return cells;
}

function normalizeLength(value) {
  return Math.max(1, Math.min(8, Math.floor(Number(value) || 6)));
}

function normalizeType(value) {
  return ['text', 'number', 'digit', 'idcard', 'safe-password'].indexOf(value) > -1 ? value : 'number';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    value: { type: String, value: '' },
    length: { type: Number, value: 6 },
    type: { type: String, value: 'number' },
    mask: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    error: { type: Boolean, value: false },
    errorMessage: { type: String, value: '' }
  },
  data: { cells: [], activeIndex: -1, rootClass: '', inputType: 'number', errorText: '' },
  observers: { 'value,length,focus,disabled,error,errorMessage,type,colorScheme': function sync() { this.syncState(); } },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var length = normalizeLength(this.data.length);
      this.setData({
        cells: makeCells(this.data.value, length),
        activeIndex: this.data.focus && !this.data.disabled ? 0 : -1,
        rootClass: ['pui-input-otp', this.getColorSchemeClass(), this.data.error ? 'pui-input-otp--error' : '', this.data.disabled ? 'pui-input-otp--disabled' : ''].filter(Boolean).join(' '),
        inputType: normalizeType(this.data.type),
        errorText: this.data.errorMessage || '请检查验证码'
      });
    },
    onInput: function onInput(event) {
      if (this.data.disabled) return;
      var index = Number(event.currentTarget.dataset.index);
      var cells = this.data.cells.map(function copy(item) { return item.value; });
      var chars = String(event.detail.value || '').replace(/\s/g, '').split('');
      var length = normalizeLength(this.data.length);
      var position;
      for (position = 0; position < chars.length && index + position < length; position += 1) cells[index + position] = chars[position];
      var value = cells.join('');
      var complete = cells.every(function hasValue(item) { return !!item; });
      var nextIndex = complete ? -1 : Math.min(length - 1, index + Math.max(1, chars.length));
      this.setData({ cells: makeCells(value, length), activeIndex: nextIndex });
      this.triggerEvent('input', { value: value, index: index, complete: complete });
      this.triggerEvent('change', { value: value, index: index, complete: complete });
      if (complete) this.triggerEvent('complete', { value: value });
    },
    onFocus: function onFocus(event) { var index = Number(event.currentTarget.dataset.index); this.setData({ activeIndex: index }); this.triggerEvent('focus', { index: index, detail: event.detail }); },
    onBlur: function onBlur(event) { this.triggerEvent('blur', { index: Number(event.currentTarget.dataset.index), detail: event.detail }); }
  }
});
