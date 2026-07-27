var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) {
  return value !== null && value !== undefined;
}

function scalar(value) {
  if (typeof value === 'string' || typeof value === 'boolean') return true;
  return typeof value === 'number' && isFinite(value);
}

function oneOf(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function positiveInteger(value, fallback) {
  var number = Math.floor(Number(value));
  return isFinite(number) && number > 0 ? number : fallback;
}

function normalizeIcon(value) {
  if (Array.isArray(value)) {
    return {
      type: 'custom',
      checked: value[0] === null || value[0] === undefined ? '' : String(value[0]),
      unchecked: value[1] === null || value[1] === undefined ? '' : String(value[1])
    };
  }
  return { type: oneOf(value, ['circle', 'line', 'dot', 'slot', 'none'], 'circle'), checked: '', unchecked: '' };
}

Component({
  behaviors: [themeBehavior, 'wx://form-field'],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  relations: {
    './radio-group': {
      type: 'ancestor',
      linked: function linked(group) {
        this._radioGroup = group;
        if (group && group.registerChild) group.registerChild(this);
      },
      unlinked: function unlinked(group) {
        if (group && group.unregisterChild) group.unregisterChild(this);
        this._radioGroup = null;
        this._radioGroupState = null;
        this.syncState(false);
      }
    }
  },
  properties: {
    checked: { type: null, value: null },
    defaultChecked: { type: Boolean, value: false },
    value: { type: null, value: false },
    label: { type: String, value: '' },
    content: { type: String, value: '' },
    icon: { type: null, value: null },
    allowUncheck: { type: Boolean, value: false },
    block: { type: Boolean, value: true },
    borderless: { type: null, value: null },
    contentDisabled: { type: Boolean, value: false },
    disabled: { type: null, value: null },
    readonly: { type: null, value: null },
    name: { type: String, value: '' },
    placement: { type: String, value: '' },
    maxLabelRow: { type: Number, value: 3 },
    maxContentRow: { type: Number, value: 5 },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerChecked: false,
    controlled: false,
    effectiveDisabled: false,
    effectiveReadonly: false,
    effectiveBorderless: false,
    effectiveAllowUncheck: false,
    rootClass: 'pui-radio pui-radio--left pui-radio--block pui-radio--icon-circle',
    rootStyle: '--pui-radio-duration:500ms;',
    semanticLabel: '单选框',
    iconType: 'circle',
    checkedIcon: '',
    uncheckedIcon: '',
    labelStyle: '-webkit-line-clamp:3;',
    contentStyle: '-webkit-line-clamp:5;'
  },
  observers: {
    'checked,defaultChecked,value,label,content,icon,allowUncheck,block,borderless,contentDisabled,disabled,readonly,name,placement,maxLabelRow,maxContentRow,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState(false);
      if (this._radioGroup && this._radioGroup.childDidUpdate) this._radioGroup.childDidUpdate(this);
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState(true);
    }
  },
  methods: {
    setGroupState: function setGroupState(state) {
      this._radioGroupState = state || null;
      this.syncState(false);
    },
    syncState: function syncState(initial) {
      var group = this._radioGroupState;
      var controlled = hasValue(this.data.checked);
      var leavingControl = this._radioInitialized && this._radioControlled && !controlled;
      if (initial || !this._radioInitialized) {
        this._radioInitialized = true;
        this._radioChecked = controlled ? Boolean(this.data.checked) : Boolean(this.data.defaultChecked);
      } else if (controlled) {
        this._radioChecked = Boolean(this.data.checked);
      } else if (leavingControl) {
        this._radioChecked = Boolean(this._radioRendered);
      }
      var checked = group ? Boolean(group.checked) : Boolean(this._radioChecked);
      var disabled = hasValue(this.data.disabled) ? Boolean(this.data.disabled) : Boolean(group && group.disabled);
      var readonly = hasValue(this.data.readonly) ? Boolean(this.data.readonly) : Boolean(group && group.readonly);
      var borderless = hasValue(this.data.borderless) ? Boolean(this.data.borderless) : Boolean(group && group.borderless);
      var allowUncheck = Boolean(this.data.allowUncheck || (group && group.allowUncheck));
      var placement = oneOf(this.data.placement, ['left', 'right'], group && group.placement === 'right' ? 'right' : 'left');
      var icons = normalizeIcon(hasValue(this.data.icon) ? this.data.icon : (group && hasValue(group.icon) ? group.icon : 'circle'));
      var label = String(this.data.ariaLabel || this.data.label || this.data.content || this.data.name || '单选框').trim() || '单选框';
      this._radioControlled = controlled;
      this._radioRendered = checked;
      this.setData({
        innerChecked: checked,
        controlled: controlled || Boolean(group),
        effectiveDisabled: disabled,
        effectiveReadonly: readonly,
        effectiveBorderless: borderless,
        effectiveAllowUncheck: allowUncheck,
        semanticLabel: label,
        iconType: icons.type,
        checkedIcon: icons.checked,
        uncheckedIcon: icons.unchecked,
        labelStyle: '-webkit-line-clamp:' + positiveInteger(this.data.maxLabelRow, 3) + ';',
        contentStyle: '-webkit-line-clamp:' + positiveInteger(this.data.maxContentRow, 5) + ';',
        rootClass: [
          'pui-radio',
          this.getColorSchemeClass(),
          'pui-radio--' + placement,
          'pui-radio--icon-' + icons.type,
          checked ? 'pui-radio--checked' : '',
          this.data.block ? 'pui-radio--block' : '',
          borderless ? 'pui-radio--borderless' : '',
          this.data.contentDisabled ? 'pui-radio--content-disabled' : '',
          disabled ? 'pui-radio--disabled' : '',
          readonly ? 'pui-radio--readonly' : '',
          this.data.reduceMotion ? 'pui-radio--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-radio-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;'
      });
    },
    buildDetail: function buildDetail(source, next) {
      return {
        checked: Boolean(next),
        previousChecked: Boolean(this.data.innerChecked),
        value: scalar(this.data.value) ? this.data.value : false,
        label: this.data.label,
        source: source,
        controlled: Boolean(this.data.controlled)
      };
    },
    requestChange: function requestChange(source) {
      if (this.data.effectiveDisabled || this.data.effectiveReadonly) return false;
      if (source === 'content' && this.data.contentDisabled) return false;
      var next = this.data.innerChecked && this.data.effectiveAllowUncheck ? false : true;
      if (next === this.data.innerChecked) return false;
      var detail = this.buildDetail(source, next);
      if (this._radioGroup && this._radioGroup.requestChildChange) return this._radioGroup.requestChildChange(this, detail);
      if (!this.data.controlled) {
        this._radioChecked = next;
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
