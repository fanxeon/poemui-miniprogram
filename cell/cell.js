var themeBehavior = require('../common/behaviors/theme');

var EASINGS = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};
var JUMP_TYPES = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];

function hasControl(value) {
  return value !== null && value !== undefined;
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  return typeof value !== 'string' || value.trim() !== '';
}

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeDuration(value, reduceMotion) {
  if (reduceMotion) return 1;
  var duration = Math.round(Number(value));
  if (!isFinite(duration)) duration = 500;
  return Math.max(0, Math.min(1000, duration));
}

function textValue(value) {
  return hasValue(value) ? String(value) : '';
}

Component({
  behaviors: [themeBehavior],
  options: {
    multipleSlots: true,
    styleIsolation: 'shared'
  },
  properties: {
    title: { type: null, value: '' },
    description: { type: null, value: '' },
    value: { type: null, value: '' },
    note: { type: null, value: '' },
    image: { type: String, value: '' },
    leftIcon: { type: null, value: null },
    rightIcon: { type: null, value: null },
    size: { type: String, value: 'medium' },
    align: { type: String, value: 'middle' },
    variant: { type: String, value: 'default' },
    bordered: { type: Boolean, value: true },
    hover: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    arrow: { type: Boolean, value: false },
    clickable: { type: Boolean, value: false },
    selected: { type: null, value: null },
    defaultSelected: { type: Boolean, value: false },
    selectable: { type: Boolean, value: false },
    allowUnselect: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    url: { type: String, value: '' },
    jumpType: { type: String, value: 'navigateTo' },
    ariaLabel: { type: String, value: '' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: 'pui-cell',
    rootStyle: '',
    normalizedSize: 'medium',
    normalizedAlign: 'middle',
    normalizedVariant: 'default',
    normalizedJumpType: 'navigateTo',
    innerSelected: false,
    controlled: false,
    interactive: false,
    hasMedia: false,
    displayTitle: '',
    displayDescription: '',
    displayValue: '',
    displayNote: '',
    semanticLabel: '单元格'
  },
  observers: {
    'title,description,value,note,image,leftIcon,rightIcon,size,align,variant,bordered,hover,required,arrow,clickable,selected,defaultSelected,selectable,allowUnselect,disabled,readonly,loading,url,jumpType,ariaLabel,duration,easing,reduceMotion,colorScheme': function sync() {
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
      var controlled = hasControl(this.data.selected);
      var defaultSelected = Boolean(this.data.defaultSelected);
      if (initial || !this._cellInitialized) {
        this._cellInitialized = true;
        this._cellDefaultSelected = defaultSelected;
        this._cellSelected = controlled ? Boolean(this.data.selected) : defaultSelected;
      } else {
        this._cellDefaultSelected = defaultSelected;
        if (controlled) this._cellSelected = Boolean(this.data.selected);
        else if (this._cellWasControlled) this._cellSelected = this._cellDefaultSelected;
      }
      this._cellWasControlled = controlled;

      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var align = normalizeEnum(this.data.align, ['top', 'middle', 'bottom'], 'middle');
      var variant = normalizeEnum(this.data.variant, ['default', 'outline', 'soft'], 'default');
      var jumpType = normalizeEnum(this.data.jumpType, JUMP_TYPES, 'navigateTo');
      var duration = normalizeDuration(this.data.duration, this.data.reduceMotion);
      var selected = Boolean(this._cellSelected);
      var locked = Boolean(this.data.disabled || this.data.loading);
      var interactive = Boolean((this.data.clickable || this.data.selectable) && !locked);
      var title = textValue(this.data.title);
      var description = textValue(this.data.description);
      var value = textValue(this.data.value);
      var note = textValue(this.data.note);
      var label = String(this.data.ariaLabel || title || description || '单元格').trim() || '单元格';
      var hasMedia = Boolean(this.data.image || hasValue(this.data.leftIcon));
      var easing = EASINGS[this.data.easing] || EASINGS.standard;
      var style = '--pui-cell-duration:' + duration + 'ms;--pui-cell-ease:' + easing + ';--pui-field-row-duration:' + duration + 'ms;--pui-field-row-ease:' + easing + ';';

      this.setData({
        normalizedSize: size,
        normalizedAlign: align,
        normalizedVariant: variant,
        normalizedJumpType: jumpType,
        innerSelected: selected,
        controlled: controlled,
        interactive: interactive,
        hasMedia: hasMedia,
        displayTitle: title,
        displayDescription: description,
        displayValue: value,
        displayNote: note,
        semanticLabel: label,
        rootStyle: style,
        rootClass: [
          'pui-cell',
          'pui-field-row',
          'pui-field-row--readonly',
          this.getColorSchemeClass(),
          'pui-cell--' + size,
          'pui-cell--align-' + align,
          'pui-cell--variant-' + variant,
          hasMedia ? 'pui-cell--has-media' : '',
          this.data.bordered ? 'pui-cell--bordered' : '',
          this.data.clickable ? 'pui-cell--clickable' : '',
          this.data.selectable ? 'pui-cell--selectable' : '',
          selected ? 'pui-cell--selected' : '',
          interactive && this.data.hover && !this.data.readonly ? 'pui-cell--hoverable' : '',
          this.data.required ? 'pui-cell--required' : '',
          this.data.disabled ? 'pui-cell--disabled' : '',
          this.data.readonly ? 'pui-cell--readonly' : '',
          this.data.loading ? 'pui-cell--loading' : '',
          this.data.reduceMotion || duration === 0 ? 'pui-cell--reduced-motion' : ''
        ].filter(Boolean).join(' ')
      });
    },
    buildDetail: function buildDetail(source, nextSelected, blocked, reason) {
      return {
        value: this.data.value,
        selected: Boolean(nextSelected),
        previousSelected: Boolean(this.data.innerSelected),
        source: source || 'method',
        controlled: Boolean(this.data.controlled),
        selectable: Boolean(this.data.selectable),
        blocked: Boolean(blocked),
        reason: reason || '',
        url: this.data.url,
        jumpType: this.data.normalizedJumpType
      };
    },
    commitSelection: function commitSelection(nextSelected, source) {
      var previous = Boolean(this.data.innerSelected);
      var next = Boolean(nextSelected);
      if (previous === next) return false;
      var detail = this.buildDetail(source, next, false, '');
      if (!this.data.controlled) this._cellSelected = next;
      this.syncState(false);
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      return true;
    },
    onTap: function onTap() {
      if (this.data.disabled || this.data.loading || (!this.data.clickable && !this.data.selectable)) return false;
      var previous = Boolean(this.data.innerSelected);
      var next = previous;
      var reason = '';
      if (this.data.selectable) {
        if (previous && !this.data.allowUnselect) reason = 'allow-unselect';
        else next = !previous;
      }
      var blocked = Boolean(this.data.readonly);
      var detail = this.buildDetail('tap', blocked ? previous : next, blocked, blocked ? 'readonly' : reason);
      this.triggerEvent('click', detail);
      if (blocked) return false;
      if (this.data.selectable && !reason) this.commitSelection(next, 'tap');
      if (this.data.url) this.navigateByUrl('tap');
      return true;
    },
    stopPropagation: function stopPropagation() {},
    onImageLoad: function onImageLoad(event) {
      this.triggerEvent('load', Object.assign({}, event.detail || {}, { source: 'image', src: this.data.image }));
    },
    onImageError: function onImageError(event) {
      this.triggerEvent('error', Object.assign({}, event.detail || {}, { source: 'image', src: this.data.image }));
    },
    navigateByUrl: function navigateByUrl(source) {
      if (this.data.disabled || this.data.loading || this.data.readonly) return false;
      var jumpType = this.data.normalizedJumpType;
      var url = String(this.data.url || '').trim();
      if (!url) return false;
      if (typeof wx === 'undefined' || typeof wx[jumpType] !== 'function') return false;
      var self = this;
      var base = this.buildDetail(source || 'method-navigate', this.data.innerSelected, false, '');
      var options = { url: url };
      options.success = function success(result) {
        self.triggerEvent('navigate-success', Object.assign({}, base, { status: 'success', result: result || {} }));
      };
      options.fail = function fail(result) {
        self.triggerEvent('navigate-fail', Object.assign({}, base, { status: 'fail', result: result || {} }));
      };
      wx[jumpType](options);
      return true;
    }
  }
});
