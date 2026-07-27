var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) {
  return value !== null && value !== undefined;
}

function scalar(value) {
  if (typeof value === 'string' || typeof value === 'boolean') return true;
  return typeof value === 'number' && isFinite(value);
}

function sameValue(left, right) {
  return left === right;
}

function normalizeKeys(value) {
  var keys = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    value: typeof keys.value === 'string' && keys.value ? keys.value : 'value',
    label: typeof keys.label === 'string' && keys.label ? keys.label : 'label',
    content: typeof keys.content === 'string' && keys.content ? keys.content : 'content'
  };
}

function normalizeOptions(options, keys) {
  if (!Array.isArray(options)) return [];
  var seen = {};
  return options.reduce(function reduce(list, raw, index) {
    var objectItem = raw && typeof raw === 'object' && !Array.isArray(raw);
    var item = objectItem ? raw : { value: raw, label: raw };
    var value = objectItem ? (Object.prototype.hasOwnProperty.call(item, keys.value) ? item[keys.value] : index) : raw;
    if (!scalar(value)) return list;
    var identity = typeof value + ':' + String(value);
    if (seen[identity]) return list;
    seen[identity] = true;
    var label = objectItem && Object.prototype.hasOwnProperty.call(item, keys.label) ? item[keys.label] : value;
    var content = objectItem && Object.prototype.hasOwnProperty.call(item, keys.content) ? item[keys.content] : '';
    list.push({
      key: 'radio-option-' + index,
      value: value,
      label: label === null || label === undefined ? '' : String(label),
      content: content === null || content === undefined ? '' : String(content),
      icon: Object.prototype.hasOwnProperty.call(item, 'icon') ? item.icon : null,
      allowUncheck: Boolean(item.allowUncheck),
      block: item.block !== false,
      borderless: hasValue(item.borderless) ? Boolean(item.borderless) : null,
      contentDisabled: Boolean(item.contentDisabled),
      disabled: hasValue(item.disabled) ? Boolean(item.disabled) : null,
      readonly: hasValue(item.readonly) ? Boolean(item.readonly) : null,
      placement: item.placement === 'right' ? 'right' : '',
      maxLabelRow: Number(item.maxLabelRow) > 0 ? Math.floor(Number(item.maxLabelRow)) : 3,
      maxContentRow: Number(item.maxContentRow) > 0 ? Math.floor(Number(item.maxContentRow)) : 5,
      ariaLabel: item.ariaLabel === null || item.ariaLabel === undefined ? '' : String(item.ariaLabel),
      sourceIndex: index
    });
    return list;
  }, []);
}

function findOption(options, value) {
  for (var index = 0; index < options.length; index += 1) {
    if (sameValue(options[index].value, value)) return { option: options[index], index: index };
  }
  return null;
}

function normalizeValue(value, options) {
  if (!scalar(value)) return null;
  var match = findOption(options, value);
  return match ? match.option.value : value;
}

Component({
  behaviors: [themeBehavior, 'wx://form-field'],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  relations: {
    './radio': {
      type: 'descendant',
      linked: function linked(child) { this.registerChild(child); },
      unlinked: function unlinked(child) { this.unregisterChild(child); }
    }
  },
  properties: {
    options: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    keys: { type: Object, value: {} },
    name: { type: String, value: '' },
    allowUncheck: { type: Boolean, value: false },
    icon: { type: null, value: 'circle' },
    placement: { type: String, value: 'left' },
    borderless: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalizedOptions: [],
    currentValue: null,
    controlled: false,
    rootClass: 'pui-radio-group',
    rootStyle: '--pui-radio-duration:500ms;',
    semanticLabel: '单选框组'
  },
  observers: {
    'options,value,defaultValue,keys,name,allowUncheck,icon,placement,borderless,disabled,readonly,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState(false);
    }
  },
  lifetimes: {
    attached: function attached() {
      this._radioChildren = [];
      this.syncState(true);
    },
    ready: function ready() {
      this.syncChildren();
    }
  },
  methods: {
    registerChild: function registerChild(child) {
      this._radioChildren = this._radioChildren || [];
      if (this._radioChildren.indexOf(child) === -1) this._radioChildren.push(child);
      this.syncChildren();
    },
    unregisterChild: function unregisterChild(child) {
      this._radioChildren = (this._radioChildren || []).filter(function filter(item) { return item !== child; });
      this.syncChildren();
    },
    childDidUpdate: function childDidUpdate() {
      this.syncChildren();
    },
    syncState: function syncState(initial) {
      var options = normalizeOptions(this.data.options, normalizeKeys(this.data.keys));
      var controlled = hasValue(this.data.value);
      var leavingControl = this._radioGroupInitialized && this._radioGroupControlled && !controlled;
      if (initial || !this._radioGroupInitialized) {
        this._radioGroupInitialized = true;
        this._radioGroupValue = controlled ? normalizeValue(this.data.value, options) : normalizeValue(this.data.defaultValue, options);
      } else if (controlled) {
        this._radioGroupValue = normalizeValue(this.data.value, options);
      } else if (leavingControl) {
        this._radioGroupValue = this._radioGroupRendered;
      }
      if (!controlled && !scalar(this._radioGroupValue)) this._radioGroupValue = null;
      var current = controlled ? normalizeValue(this.data.value, options) : this._radioGroupValue;
      this._radioGroupControlled = controlled;
      this._radioGroupRendered = current;
      this.setData({
        normalizedOptions: options.map(function map(option) {
          return Object.assign({}, option, { checked: scalar(current) && sameValue(current, option.value) });
        }),
        currentValue: current,
        controlled: controlled,
        semanticLabel: String(this.data.ariaLabel || this.data.name || '单选框组').trim() || '单选框组',
        rootClass: [
          'pui-radio-group',
          this.getColorSchemeClass(),
          this.data.disabled ? 'pui-radio-group--disabled' : '',
          this.data.readonly ? 'pui-radio-group--readonly' : '',
          this.data.borderless ? 'pui-radio-group--borderless' : '',
          this.data.reduceMotion ? 'pui-radio-group--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-radio-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;'
      });
      this.syncChildren();
    },
    getChildren: function getChildren() {
      var relationChildren = typeof this.getRelationNodes === 'function' ? this.getRelationNodes('./radio') : [];
      var children = relationChildren && relationChildren.length ? relationChildren : (this._radioChildren || []);
      return children.filter(Boolean);
    },
    syncChildren: function syncChildren() {
      if (this._radioSyncing) return;
      this._radioSyncing = true;
      var current = this._radioGroupValue;
      this.getChildren().forEach(function each(child) {
        if (!child || !child.setGroupState) return;
        child.setGroupState({
          checked: scalar(current) && sameValue(current, child.data.value),
          disabled: Boolean(this.data.disabled),
          readonly: Boolean(this.data.readonly),
          borderless: Boolean(this.data.borderless),
          allowUncheck: Boolean(this.data.allowUncheck),
          icon: this.data.icon,
          placement: this.data.placement === 'right' ? 'right' : 'left'
        });
      }, this);
      this._radioSyncing = false;
    },
    requestChildChange: function requestChildChange(child, childDetail) {
      if (this.data.disabled || this.data.readonly || !child || !scalar(child.data.value)) return false;
      var previous = scalar(this._radioGroupValue) ? this._radioGroupValue : null;
      var selected = sameValue(previous, child.data.value);
      var allowUncheck = Boolean(this.data.allowUncheck || child.data.allowUncheck);
      var next = selected && allowUncheck ? null : child.data.value;
      if (sameValue(previous, next)) return false;
      var match = findOption(this.data.normalizedOptions, child.data.value);
      var detail = {
        value: next,
        previousValue: previous,
        option: match ? match.option : { value: child.data.value, label: child.data.label, content: child.data.content },
        index: match ? match.index : -1,
        source: childDetail.source || 'option',
        controlled: Boolean(this.data.controlled)
      };
      if (!this.data.controlled) {
        this._radioGroupValue = next;
        this._radioGroupRendered = next;
        this.setData({
          currentValue: next,
          normalizedOptions: this.data.normalizedOptions.map(function map(option) {
            return Object.assign({}, option, { checked: scalar(next) && sameValue(next, option.value) });
          })
        });
        this.syncChildren();
      }
      this.triggerEvent('change', detail);
      return true;
    },
    onOptionChange: function onOptionChange(event) {
      var index = Number(event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.index : -1);
      var option = this.data.normalizedOptions[index];
      var detail = event && event.detail ? event.detail : {};
      if (!option) return false;
      return this.requestChildChange({ data: option }, detail);
    }
  }
});
