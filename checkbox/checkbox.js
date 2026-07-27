var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) {
  return value !== null && value !== undefined;
}

function oneOf(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function positiveInteger(value, fallback) {
  var number = Math.floor(Number(value));
  return isFinite(number) && number > 0 ? number : fallback;
}

function scalar(value) {
  if (typeof value === 'string' || typeof value === 'boolean') return true;
  return typeof value === 'number' && isFinite(value);
}

function normalizeIcon(value) {
  var defaults = ['check', '', 'minus'];
  if (Array.isArray(value)) {
    return [0, 1, 2].map(function mapIcon(index) {
      var icon = value[index];
      return icon === null || icon === undefined ? defaults[index] : String(icon);
    });
  }
  var type = oneOf(value, ['circle', 'line', 'rectangle', 'none'], 'circle');
  if (type === 'none') return ['', '', ''];
  return defaults;
}

Component({
  behaviors: [themeBehavior, 'wx://form-field'],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  relations: {
    './checkbox-group': {
      type: 'ancestor',
      linked: function linked(group) {
        this._checkboxGroup = group;
        if (group && group.registerChild) group.registerChild(this);
      },
      unlinked: function unlinked(group) {
        if (group && group.unregisterChild) group.unregisterChild(this);
        this._checkboxGroup = null;
        this._checkboxGroupState = null;
        this.syncState(false);
      }
    }
  },
  properties: {
    checked: { type: null, value: null },
    defaultChecked: { type: Boolean, value: false },
    value: { type: null, value: '' },
    label: { type: String, value: '' },
    content: { type: String, value: '' },
    icon: { type: null, value: 'circle' },
    indeterminate: { type: Boolean, value: false },
    checkAll: { type: Boolean, value: false },
    block: { type: Boolean, value: true },
    borderless: { type: null, value: null },
    contentDisabled: { type: Boolean, value: false },
    disabled: { type: null, value: null },
    readonly: { type: null, value: null },
    name: { type: String, value: '' },
    placement: { type: String, value: 'left' },
    maxLabelRow: { type: Number, value: 3 },
    maxContentRow: { type: Number, value: 5 },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerChecked: false,
    innerIndeterminate: false,
    controlled: false,
    effectiveDisabled: false,
    effectiveReadonly: false,
    effectiveBorderless: false,
    rootClass: 'pui-checkbox pui-checkbox--left pui-checkbox--block',
    rootStyle: '--pui-checkbox-duration:500ms;',
    semanticLabel: '复选框',
    checkedIcon: 'check',
    uncheckedIcon: '',
    indeterminateIcon: 'minus',
    markVisible: true,
    labelStyle: '-webkit-line-clamp:3;',
    contentStyle: '-webkit-line-clamp:5;'
  },
  observers: {
    'checked,defaultChecked,value,label,content,icon,indeterminate,checkAll,block,borderless,contentDisabled,disabled,readonly,name,placement,maxLabelRow,maxContentRow,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState(false);
      if (this._checkboxGroup && this._checkboxGroup.childDidUpdate) this._checkboxGroup.childDidUpdate(this);
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState(true);
    }
  },
  methods: {
    setGroupState: function setGroupState(state) {
      this._checkboxGroupState = state || null;
      this.syncState(false);
    },
    syncState: function syncState(initial) {
      var group = this._checkboxGroupState;
      var controlled = hasValue(this.data.checked);
      if (initial || !this._checkboxInitialized) {
        this._checkboxInitialized = true;
        this._checkboxChecked = controlled ? Boolean(this.data.checked) : Boolean(this.data.defaultChecked);
      } else if (controlled) {
        this._checkboxChecked = Boolean(this.data.checked);
      }
      var checked = group ? Boolean(group.checked) : Boolean(this._checkboxChecked);
      var mixed = group ? Boolean(group.indeterminate) : Boolean(this.data.indeterminate);
      var disabled = hasValue(this.data.disabled) ? Boolean(this.data.disabled) : Boolean(group && group.disabled);
      var readonly = hasValue(this.data.readonly) ? Boolean(this.data.readonly) : Boolean(group && group.readonly);
      var borderless = hasValue(this.data.borderless) ? Boolean(this.data.borderless) : Boolean(group && group.borderless);
      var placement = oneOf(this.data.placement, ['left', 'right'], 'left');
      var icons = normalizeIcon(this.data.icon);
      var label = String(this.data.ariaLabel || this.data.label || this.data.content || this.data.name || (this.data.checkAll ? '全选' : '复选框')).trim() || '复选框';
      this._checkboxRendered = checked;
      this.setData({
        innerChecked: checked,
        innerIndeterminate: mixed,
        controlled: controlled || Boolean(group),
        effectiveDisabled: disabled,
        effectiveReadonly: readonly,
        effectiveBorderless: borderless,
        semanticLabel: label,
        checkedIcon: icons[0],
        uncheckedIcon: icons[1],
        indeterminateIcon: icons[2],
        markVisible: Boolean(icons[0] || icons[1] || icons[2]),
        labelStyle: '-webkit-line-clamp:' + positiveInteger(this.data.maxLabelRow, 3) + ';',
        contentStyle: '-webkit-line-clamp:' + positiveInteger(this.data.maxContentRow, 5) + ';',
        rootClass: [
          'pui-checkbox',
          this.getColorSchemeClass(),
          'pui-checkbox--' + placement,
          checked ? 'pui-checkbox--checked' : '',
          mixed ? 'pui-checkbox--indeterminate' : '',
          this.data.block ? 'pui-checkbox--block' : '',
          borderless ? 'pui-checkbox--borderless' : '',
          this.data.checkAll ? 'pui-checkbox--check-all' : '',
          this.data.contentDisabled ? 'pui-checkbox--content-disabled' : '',
          disabled ? 'pui-checkbox--disabled' : '',
          readonly ? 'pui-checkbox--readonly' : '',
          this.data.reduceMotion ? 'pui-checkbox--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-checkbox-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;'
      });
    },
    buildDetail: function buildDetail(source, next) {
      return {
        checked: Boolean(next),
        previousChecked: Boolean(this.data.innerChecked),
        value: scalar(this.data.value) ? this.data.value : '',
        label: this.data.label,
        indeterminate: false,
        checkAll: Boolean(this.data.checkAll),
        source: source,
        controlled: Boolean(this.data.controlled)
      };
    },
    requestChange: function requestChange(source) {
      if (this.data.effectiveDisabled || this.data.effectiveReadonly) return false;
      if (source === 'content' && this.data.contentDisabled) return false;
      var next = this.data.innerIndeterminate ? true : !this.data.innerChecked;
      var detail = this.buildDetail(source, next);
      if (this._checkboxGroup && this._checkboxGroup.requestChildChange) {
        return this._checkboxGroup.requestChildChange(this, detail);
      }
      if (!this.data.controlled) {
        this._checkboxChecked = next;
        this.syncState(false);
      }
      this.triggerEvent('change', detail);
      return true;
    },
    onMarkTap: function onMarkTap() {
      return this.requestChange('mark');
    },
    onContentTap: function onContentTap() {
      return this.requestChange('content');
    }
  }
});
