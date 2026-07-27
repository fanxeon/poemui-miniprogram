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

function typedKey(value) {
  return typeof value + ':' + String(value);
}

function uniqueScalars(value) {
  if (!Array.isArray(value)) return [];
  var seen = {};
  return value.reduce(function reduce(list, item) {
    if (!scalar(item)) return list;
    var key = typedKey(item);
    if (seen[key]) return list;
    seen[key] = true;
    list.push(item);
    return list;
  }, []);
}

function includes(list, value) {
  return list.some(function some(item) { return sameValue(item, value); });
}

function without(list, values) {
  return list.filter(function filter(item) { return !values.some(function some(value) { return sameValue(item, value); }); });
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
    var identity = typedKey(value);
    if (seen[identity]) return list;
    seen[identity] = true;
    var labelValue = objectItem && Object.prototype.hasOwnProperty.call(item, keys.label) ? item[keys.label] : value;
    var contentValue = objectItem && Object.prototype.hasOwnProperty.call(item, keys.content) ? item[keys.content] : '';
    list.push({
      key: 'checkbox-option-' + index,
      value: value,
      label: labelValue === null || labelValue === undefined ? '' : String(labelValue),
      content: contentValue === null || contentValue === undefined ? '' : String(contentValue),
      icon: Object.prototype.hasOwnProperty.call(item, 'icon') ? item.icon : 'circle',
      checkAll: Boolean(item.checkAll),
      block: item.block !== false,
      borderless: hasValue(item.borderless) ? Boolean(item.borderless) : null,
      contentDisabled: Boolean(item.contentDisabled),
      disabled: hasValue(item.disabled) ? Boolean(item.disabled) : null,
      readonly: hasValue(item.readonly) ? Boolean(item.readonly) : null,
      placement: item.placement === 'right' ? 'right' : 'left',
      maxLabelRow: Number(item.maxLabelRow) > 0 ? Math.floor(Number(item.maxLabelRow)) : 3,
      maxContentRow: Number(item.maxContentRow) > 0 ? Math.floor(Number(item.maxContentRow)) : 5,
      ariaLabel: item.ariaLabel === null || item.ariaLabel === undefined ? '' : String(item.ariaLabel)
    });
    return list;
  }, []);
}

function decorateOptions(options, values, groupDisabled, groupReadonly) {
  var available = options.filter(function filter(item) {
    return !item.checkAll &&
      !(hasValue(item.disabled) ? item.disabled : groupDisabled) &&
      !(hasValue(item.readonly) ? item.readonly : groupReadonly);
  });
  var selectedCount = available.filter(function filter(item) {
    return includes(values, item.value);
  }).length;
  return options.map(function map(item) {
    var next = Object.assign({}, item);
    if (item.checkAll) {
      next.checked = available.length > 0 && selectedCount === available.length;
      next.indeterminate = selectedCount > 0 && selectedCount < available.length;
    } else {
      next.checked = includes(values, item.value);
      next.indeterminate = false;
    }
    return next;
  });
}

Component({
  behaviors: [themeBehavior, 'wx://form-field'],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  relations: {
    './checkbox': {
      type: 'descendant',
      linked: function linked(child) { this.registerChild(child); },
      unlinked: function unlinked(child) { this.unregisterChild(child); }
    }
  },
  properties: {
    options: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: Array, value: [] },
    keys: { type: Object, value: {} },
    max: { type: Number, value: 0 },
    name: { type: String, value: '' },
    borderless: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalizedOptions: [],
    currentValue: [],
    controlled: false,
    rootClass: 'pui-checkbox-group',
    rootStyle: '--pui-checkbox-duration:500ms;',
    semanticLabel: '复选框组'
  },
  observers: {
    'options,value,defaultValue,keys,max,name,borderless,disabled,readonly,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState(false);
    }
  },
  lifetimes: {
    attached: function attached() {
      this._checkboxChildren = [];
      this.syncState(true);
    },
    ready: function ready() {
      this.syncChildren();
    }
  },
  methods: {
    registerChild: function registerChild(child) {
      this._checkboxChildren = this._checkboxChildren || [];
      if (this._checkboxChildren.indexOf(child) === -1) this._checkboxChildren.push(child);
      this.syncChildren();
    },
    unregisterChild: function unregisterChild(child) {
      this._checkboxChildren = (this._checkboxChildren || []).filter(function filter(item) { return item !== child; });
      this.syncChildren();
    },
    childDidUpdate: function childDidUpdate() {
      this.syncChildren();
    },
    syncState: function syncState(initial) {
      var controlled = hasValue(this.data.value);
      var incoming = controlled ? uniqueScalars(this.data.value) : null;
      if (initial || !this._checkboxGroupInitialized) {
        this._checkboxGroupInitialized = true;
        this._checkboxGroupValue = controlled ? incoming : uniqueScalars(this.data.defaultValue);
      } else if (controlled) {
        this._checkboxGroupValue = incoming;
      }
      var current = uniqueScalars(this._checkboxGroupValue);
      var options = decorateOptions(
        normalizeOptions(this.data.options, normalizeKeys(this.data.keys)),
        current,
        Boolean(this.data.disabled),
        Boolean(this.data.readonly)
      );
      this._checkboxGroupControlled = controlled;
      this.setData({
        normalizedOptions: options,
        currentValue: current,
        controlled: controlled,
        semanticLabel: String(this.data.ariaLabel || this.data.name || '复选框组').trim() || '复选框组',
        rootClass: [
          'pui-checkbox-group',
          this.getColorSchemeClass(),
          this.data.disabled ? 'pui-checkbox-group--disabled' : '',
          this.data.readonly ? 'pui-checkbox-group--readonly' : '',
          this.data.borderless ? 'pui-checkbox-group--borderless' : '',
          this.data.reduceMotion ? 'pui-checkbox-group--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-checkbox-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;'
      });
      this.syncChildren();
    },
    getChildren: function getChildren() {
      var relationChildren = typeof this.getRelationNodes === 'function' ? this.getRelationNodes('./checkbox') : [];
      var children = relationChildren && relationChildren.length ? relationChildren : (this._checkboxChildren || []);
      return children.filter(Boolean);
    },
    childState: function childState(child, values) {
      var children = this.getChildren();
      var regular = children.filter(function filter(item) { return item && !item.data.checkAll; });
      var available = regular.filter(function filter(item) {
        var disabled = hasValue(item.data.disabled) ? Boolean(item.data.disabled) : Boolean(this.data.disabled);
        var readonly = hasValue(item.data.readonly) ? Boolean(item.data.readonly) : Boolean(this.data.readonly);
        return !disabled && !readonly;
      }, this);
      if (child.data.checkAll) {
        var selected = available.filter(function filter(item) { return includes(values, item.data.value); }).length;
        return {
          checked: available.length > 0 && selected === available.length,
          indeterminate: selected > 0 && selected < available.length
        };
      }
      return { checked: includes(values, child.data.value), indeterminate: Boolean(child.data.indeterminate) };
    },
    syncChildren: function syncChildren() {
      if (this._checkboxSyncing) return;
      this._checkboxSyncing = true;
      var values = uniqueScalars(this._checkboxGroupValue || []);
      this.getChildren().forEach(function each(child) {
        if (!child || !child.setGroupState) return;
        var state = this.childState(child, values);
        child.setGroupState({
          checked: state.checked,
          indeterminate: state.indeterminate,
          disabled: Boolean(this.data.disabled),
          readonly: Boolean(this.data.readonly),
          borderless: Boolean(this.data.borderless)
        });
      }, this);
      this._checkboxSyncing = false;
    },
    requestChildChange: function requestChildChange(child, childDetail) {
      if (this.data.disabled || this.data.readonly || !child) return false;
      var previous = uniqueScalars(this._checkboxGroupValue || []);
      var next = previous.slice();
      var changedValue = child.data.value;
      var nextChecked = Boolean(childDetail.checked);
      var isCheckAll = Boolean(child.data.checkAll);
      if (isCheckAll) {
        var candidates = this.getChildren();
        if (!candidates.length) {
          candidates = this.data.normalizedOptions.map(function map(item) {
            return { data: item };
          });
        }
        var available = candidates.filter(function filter(item) {
          if (!item || item.data.checkAll) return false;
          var disabled = hasValue(item.data.disabled) ? Boolean(item.data.disabled) : Boolean(this.data.disabled);
          var readonly = hasValue(item.data.readonly) ? Boolean(item.data.readonly) : Boolean(this.data.readonly);
          return !disabled && !readonly && scalar(item.data.value);
        }, this);
        var values = available.map(function map(item) { return item.data.value; });
        var allSelected = values.length > 0 && values.every(function every(value) { return includes(previous, value); });
        nextChecked = !allSelected;
        next = nextChecked ? previous.slice() : without(previous, values);
        if (nextChecked) values.forEach(function each(value) { if (!includes(next, value)) next.push(value); });
        changedValue = null;
      } else if (nextChecked) {
        if (!scalar(changedValue) || includes(next, changedValue)) return false;
        next.push(changedValue);
      } else {
        next = without(next, [changedValue]);
      }
      var max = Math.floor(Number(this.data.max));
      if (isFinite(max) && max > 0 && next.length > max) return false;
      if (next.length === previous.length && next.every(function every(value, index) { return sameValue(value, previous[index]); })) return false;
      var detail = {
        value: next.slice(),
        previousValue: previous.slice(),
        changedValue: changedValue,
        checked: nextChecked,
        source: childDetail.source || 'option',
        controlled: Boolean(this.data.controlled),
        checkAll: isCheckAll
      };
      if (!this.data.controlled) {
        this._checkboxGroupValue = next.slice();
        this.setData({
          currentValue: next.slice(),
          normalizedOptions: decorateOptions(
            this.data.normalizedOptions,
            next,
            Boolean(this.data.disabled),
            Boolean(this.data.readonly)
          )
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
