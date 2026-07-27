var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) {
  return value !== null && value !== undefined;
}

function sameValue(left, right) {
  return left === right;
}

function isScalar(value) {
  return typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && isFinite(value));
}

function normalizePair(value, fallback) {
  if (!Array.isArray(value) || value.length < 2) return fallback;
  if (!isScalar(value[0]) || !isScalar(value[1]) || sameValue(value[0], value[1])) return fallback;
  return [value[0], value[1]];
}

function normalizeContentPair(value) {
  if (!Array.isArray(value)) return ['', ''];
  return [value[0] === null || value[0] === undefined ? '' : String(value[0]), value[1] === null || value[1] === undefined ? '' : String(value[1])];
}

function valueToChecked(value, pair) {
  if (sameValue(value, pair[0])) return true;
  if (sameValue(value, pair[1])) return false;
  return Boolean(value);
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    customValue: { type: Array, value: [true, false] },
    label: { type: Array, value: [] },
    icon: { type: Array, value: [] },
    size: { type: String, value: 'medium' },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerChecked: false,
    currentValue: false,
    controlled: false,
    rootClass: 'pui-switch pui-switch--medium',
    rootStyle: '--pui-switch-duration:500ms;',
    semanticLabel: '开关',
    statusText: '',
    thumbIcon: '',
    iconSize: '24rpx',
    interactive: true
  },
  observers: {
    'value,defaultValue,customValue,label,icon,size,disabled,readonly,loading,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState(false);
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState(true);
    }
  },
  methods: {
    syncState: function syncState(initial) {
      var pair = normalizePair(this.data.customValue, [true, false]);
      var controlled = hasValue(this.data.value);
      if (initial || !this._switchInitialized) {
        this._switchInitialized = true;
        this._switchChecked = controlled
          ? valueToChecked(this.data.value, pair)
          : hasValue(this.data.defaultValue) ? valueToChecked(this.data.defaultValue, pair) : false;
      } else if (controlled) {
        this._switchChecked = valueToChecked(this.data.value, pair);
      }

      var checked = Boolean(this._switchChecked);
      var size = ['small', 'medium', 'large'].indexOf(this.data.size) > -1 ? this.data.size : 'medium';
      var labels = normalizeContentPair(this.data.label);
      var icons = normalizeContentPair(this.data.icon);
      var hasLabel = Boolean(labels[0] || labels[1]);
      var locked = Boolean(this.data.disabled || this.data.loading);
      var iconSizes = { small: '20rpx', medium: '24rpx', large: '28rpx' };
      this.setData({
        innerChecked: checked,
        currentValue: checked ? pair[0] : pair[1],
        controlled: controlled,
        semanticLabel: String(this.data.ariaLabel || '开关').trim() || '开关',
        statusText: checked ? labels[0] : labels[1],
        thumbIcon: checked ? icons[0] : icons[1],
        iconSize: iconSizes[size],
        interactive: !locked && !this.data.readonly,
        rootClass: [
          'pui-switch',
          this.getColorSchemeClass(),
          'pui-switch--' + size,
          checked ? 'pui-switch--checked' : '',
          hasLabel ? 'pui-switch--label' : '',
          this.data.disabled ? 'pui-switch--disabled' : '',
          this.data.readonly ? 'pui-switch--readonly' : '',
          this.data.loading ? 'pui-switch--loading' : '',
          this.data.reduceMotion ? 'pui-switch--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-switch-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;'
      });
    },
    onTrackTap: function onTrackTap() {
      if (this.data.disabled || this.data.readonly || this.data.loading) return false;
      var previousChecked = Boolean(this.data.innerChecked);
      var nextChecked = !previousChecked;
      var pair = normalizePair(this.data.customValue, [true, false]);
      var detail = {
        value: nextChecked ? pair[0] : pair[1],
        checked: nextChecked,
        previousValue: previousChecked ? pair[0] : pair[1],
        previousChecked: previousChecked,
        source: 'track',
        controlled: Boolean(this.data.controlled)
      };
      if (!this.data.controlled) {
        this._switchChecked = nextChecked;
        this.syncState(false);
      }
      this.triggerEvent('change', detail);
      return true;
    }
  }
});
