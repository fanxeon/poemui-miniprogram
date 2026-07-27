var themeBehavior = require('../common/behaviors/theme');

var RULE_KEYS = ['required', 'whitespace', 'min', 'max', 'len', 'pattern', 'enum', 'number', 'boolean', 'email', 'url', 'telnumber', 'idcard', 'validator'];

function isRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function cloneData(value) {
  var source = isRecord(value) ? value : {};
  return Object.keys(source).reduce(function copyData(result, key) {
    var item = source[key];
    if (Array.isArray(item)) result[key] = item.slice();
    else if (isRecord(item)) result[key] = Object.assign({}, item);
    else result[key] = item;
    return result;
  }, {});
}

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeFieldList(fields) {
  if (!Array.isArray(fields)) return [];
  return fields.reduce(function uniqueFields(result, item) {
    var name = String(item === null || item === undefined ? '' : item).trim();
    if (name && result.indexOf(name) === -1) result.push(name);
    return result;
  }, []);
}

function normalizeRules(rules) {
  if (!isRecord(rules)) return {};
  return Object.keys(rules).reduce(function copyRules(result, name) {
    var list = Array.isArray(rules[name]) ? rules[name] : [];
    result[name] = list.filter(function validRule(rule) { return isRecord(rule); });
    return result;
  }, {});
}

function isEmpty(value) {
  if (value === null || value === undefined || value === '') return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function valueLength(value) {
  if (Array.isArray(value)) return value.length;
  if (value === null || value === undefined) return 0;
  return Array.from(String(value)).length;
}

function matchesPattern(value, pattern) {
  try {
    var matcher = pattern instanceof RegExp ? pattern : new RegExp(String(pattern));
    return matcher.test(String(value));
  } catch (error) {
    return false;
  }
}

function fallbackMessage(name, key, expected) {
  var label = name || '字段';
  var messages = {
    required: label + '不能为空',
    whitespace: label + '不能只包含空白字符',
    min: label + '不能小于 ' + expected,
    max: label + '不能大于 ' + expected,
    len: label + '长度必须为 ' + expected,
    pattern: label + '格式不正确',
    enum: label + '不在允许范围内',
    number: label + '必须是数字',
    boolean: label + '必须是布尔值',
    email: label + '不是有效邮箱',
    url: label + '不是有效网址',
    telnumber: label + '不是有效手机号',
    idcard: label + '不是有效身份证号',
    validator: label + '校验未通过'
  };
  return messages[key] || label + '校验未通过';
}

function normalizeValidatorResult(result, rule, name) {
  if (result === true || result === undefined || result === null) return null;
  if (typeof result === 'string') return { type: rule.type === 'warning' ? 'warning' : 'error', message: result };
  if (result === false) return { type: rule.type === 'warning' ? 'warning' : 'error', message: rule.message || fallbackMessage(name, 'validator') };
  if (isRecord(result)) {
    var passed = Object.prototype.hasOwnProperty.call(result, 'valid') ? result.valid : result.result;
    if (passed !== false) return null;
    return {
      type: result.type === 'warning' || rule.type === 'warning' ? 'warning' : 'error',
      message: result.message || rule.message || fallbackMessage(name, 'validator')
    };
  }
  return null;
}

function validateConstraint(value, key, expected, data, name, rule) {
  if (key === 'required') return !expected || !isEmpty(value);
  if (key === 'whitespace') return !expected || !(typeof value === 'string' && value.trim() === '');
  if (key === 'min') return typeof value === 'number' ? value >= Number(expected) : valueLength(value) >= Number(expected);
  if (key === 'max') return typeof value === 'number' ? value <= Number(expected) : valueLength(value) <= Number(expected);
  if (key === 'len') return valueLength(value) === Number(expected);
  if (key === 'pattern') return matchesPattern(value, expected);
  if (key === 'enum') return Array.isArray(expected) && expected.some(function sameEnum(item) { return item === value; });
  if (key === 'number') return !expected || (typeof value === 'number' && isFinite(value));
  if (key === 'boolean') return !expected || typeof value === 'boolean';
  if (key === 'email') return !expected || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
  if (key === 'url') return !expected || /^(https?):\/\/[^\s]+$/i.test(String(value));
  if (key === 'telnumber') return !expected || /^1[3-9]\d{9}$/.test(String(value));
  if (key === 'idcard') return !expected || /^(?:\d{15}|\d{17}[\dXx])$/.test(String(value));
  if (key === 'validator') {
    if (typeof expected !== 'function') return true;
    return expected(value, { data: cloneData(data), name: name, rule: rule });
  }
  return true;
}

function ruleApplies(rule, trigger) {
  var expectedTrigger = rule.trigger || 'all';
  return trigger === 'all' || expectedTrigger === 'all' || expectedTrigger === trigger;
}

function validateOneRule(value, rule, data, name, trigger) {
  if (!ruleApplies(rule, trigger)) return Promise.resolve(null);
  var key = RULE_KEYS.find(function findKey(item) { return Object.prototype.hasOwnProperty.call(rule, item); });
  if (!key) return Promise.resolve(null);
  if (key !== 'required' && key !== 'validator' && isEmpty(value)) return Promise.resolve(null);
  var expected = rule[key];
  try {
    return Promise.resolve(validateConstraint(value, key, expected, data, name, rule)).then(function finishRule(result) {
      if (key === 'validator') return normalizeValidatorResult(result, rule, name);
      if (result) return null;
      return {
        type: rule.type === 'warning' ? 'warning' : 'error',
        message: rule.message || fallbackMessage(name, key, expected)
      };
    }, function validatorRejected(error) {
      return {
        type: rule.type === 'warning' ? 'warning' : 'error',
        message: rule.message || (error && error.message) || fallbackMessage(name, key, expected)
      };
    });
  } catch (error) {
    return Promise.resolve({
      type: rule.type === 'warning' ? 'warning' : 'error',
      message: rule.message || (error && error.message) || fallbackMessage(name, key, expected)
    });
  }
}

function validateField(name, value, rules, data, trigger) {
  return (rules || []).reduce(function sequence(promise, rule) {
    return promise.then(function validateNext(messages) {
      return validateOneRule(value, rule, data, name, trigger).then(function appendMessage(message) {
        if (message) messages.push(message);
        return messages;
      });
    });
  }, Promise.resolve([]));
}

function normalizeExternalMessages(messages) {
  if (!isRecord(messages)) return {};
  return Object.keys(messages).reduce(function normalizeField(result, name) {
    var source = Array.isArray(messages[name]) ? messages[name] : [messages[name]];
    result[name] = source.reduce(function normalizeItems(list, item) {
      if (typeof item === 'string' && item) list.push({ type: 'error', message: item });
      else if (isRecord(item) && item.message) list.push({ type: item.type === 'warning' ? 'warning' : 'error', message: String(item.message) });
      return list;
    }, []);
    return result;
  }, {});
}

function emptyValue(value) {
  if (Array.isArray(value)) return [];
  if (isRecord(value)) return {};
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return '';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  relations: {
    '../field/field': {
      type: 'child',
      linked: function linked(field) { this.registerField(field); },
      unlinked: function unlinked(field) { this.unregisterField(field); }
    }
  },
  properties: {
    data: { type: Object, value: {} },
    rules: { type: Object, value: {} },
    showErrorMessage: { type: Boolean, value: true },
    scrollToFirstError: { type: String, value: '' },
    resetType: { type: String, value: 'initial' },
    ariaLabel: { type: String, value: '表单' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: '',
    rootStyle: '',
    registeredFields: 0,
    lastValid: true
  },
  observers: {
    'rules,showErrorMessage,scrollToFirstError,resetType,ariaLabel,reduceMotion,colorScheme': function syncStateObserver() {
      this.syncState();
      this.syncFieldContexts();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._fields = [];
      this._initialData = cloneData(this.data.data);
      this._hasInitialData = true;
      this.syncState();
    },
    ready: function ready() {
      if (!this._hasInitialData) this._initialData = cloneData(this.data.data);
      this.syncFieldContexts();
    }
  },
  methods: {
    syncState: function syncState() {
      var scroll = normalizeEnum(this.data.scrollToFirstError, ['', 'auto', 'smooth'], '');
      var resetType = normalizeEnum(this.data.resetType, ['initial', 'empty'], 'initial');
      this.setData({
        rootClass: [
          'pui-form',
          this.getColorSchemeClass(),
          this.data.reduceMotion ? 'pui-form--reduced' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-form-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;',
        normalizedScrollToFirstError: scroll,
        normalizedResetType: resetType
      });
    },
    registerField: function registerField(field) {
      this._fields = this._fields || [];
      if (this._fields.indexOf(field) === -1) this._fields.push(field);
      this.setData({ registeredFields: this._fields.length });
      this.syncFieldContext(field);
    },
    unregisterField: function unregisterField(field) {
      this._fields = (this._fields || []).filter(function keep(item) { return item !== field; });
      this.setData({ registeredFields: this._fields.length });
    },
    fieldName: function fieldName(field) {
      if (!field) return '';
      if (typeof field.getFieldName === 'function') return field.getFieldName();
      return String((field.data && field.data.name) || '').trim();
    },
    getFieldRules: function getFieldRules(name) {
      var rules = normalizeRules(this.data.rules);
      return rules[name] || [];
    },
    syncFieldContext: function syncFieldContext(field) {
      var name = this.fieldName(field);
      if (!name || !field || typeof field.syncFormContext !== 'function') return;
      field.syncFormContext({
        required: this.getFieldRules(name).some(function requiredRule(rule) { return rule.required === true; }),
        showErrorMessage: this.data.showErrorMessage,
        reduceMotion: this.data.reduceMotion
      });
    },
    syncFieldContexts: function syncFieldContexts() {
      var self = this;
      (this._fields || []).forEach(function syncField(field) { self.syncFieldContext(field); });
    },
    fieldNames: function fieldNames(requested) {
      var explicit = normalizeFieldList(requested);
      if (explicit.length) return explicit;
      var names = [];
      (this._fields || []).forEach(function collect(field) {
        var name = this.fieldName(field);
        if (name && names.indexOf(name) === -1) names.push(name);
      }, this);
      Object.keys(normalizeRules(this.data.rules)).forEach(function collectRule(name) {
        if (names.indexOf(name) === -1) names.push(name);
      });
      return names;
    },
    applyFieldMessages: function applyFieldMessages(messageMap) {
      var show = this.data.showErrorMessage;
      (this._fields || []).forEach(function apply(field) {
        var name = this.fieldName(field);
        if (!name || !field || typeof field.applyFormValidation !== 'function') return;
        field.applyFormValidation(messageMap[name] || [], show);
      }, this);
    },
    scrollToError: function scrollToError(firstField) {
      var behavior = normalizeEnum(this.data.scrollToFirstError, ['', 'auto', 'smooth'], '');
      if (!behavior || !firstField) return;
      var target = (this._fields || []).find(function findField(field) { return this.fieldName(field) === firstField; }, this);
      if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView(behavior, this.data.reduceMotion);
    },
    validate: function validate(options) {
      var params = Array.isArray(options) ? { fields: options } : isRecord(options) ? options : {};
      var names = this.fieldNames(params.fields);
      var trigger = normalizeEnum(params.trigger, ['all', 'change', 'blur', 'submit'], 'all');
      var data = cloneData(this.data.data);
      var rules = normalizeRules(this.data.rules);
      var self = this;
      return Promise.all(names.map(function validateNamedField(name) {
        return validateField(name, data[name], rules[name] || [], data, trigger).then(function fieldResult(messages) {
          return { name: name, messages: messages };
        });
      })).then(function finishValidation(results) {
        var messageMap = {};
        var errors = {};
        var warnings = {};
        results.forEach(function collect(result) {
          messageMap[result.name] = result.messages;
          var fieldErrors = result.messages.filter(function isError(message) { return message.type !== 'warning'; });
          var fieldWarnings = result.messages.filter(function isWarning(message) { return message.type === 'warning'; });
          if (fieldErrors.length) errors[result.name] = fieldErrors;
          if (fieldWarnings.length) warnings[result.name] = fieldWarnings;
        });
        var errorNames = Object.keys(errors);
        var detail = {
          valid: errorNames.length === 0,
          errors: errors,
          warnings: warnings,
          data: data,
          fields: names,
          firstError: errorNames.length ? errors[errorNames[0]][0].message : '',
          trigger: trigger
        };
        self.applyFieldMessages(messageMap);
        self.setData({ lastValid: detail.valid });
        self.triggerEvent('validate', detail);
        if (!detail.valid) self.scrollToError(errorNames[0]);
        return detail;
      });
    },
    submit: function submit(options) {
      var self = this;
      var params = isRecord(options) ? Object.assign({}, options, { trigger: 'submit' }) : { trigger: 'submit' };
      return this.validate(params).then(function emitSubmit(detail) {
        self.triggerEvent('submit', detail);
        return detail;
      });
    },
    reset: function reset(options) {
      var params = Array.isArray(options) ? { fields: options } : isRecord(options) ? options : {};
      var fields = this.fieldNames(params.fields);
      var type = normalizeEnum(params.type, ['initial', 'empty'], this.data.normalizedResetType || 'initial');
      var current = cloneData(this.data.data);
      var initial = cloneData(this._initialData || {});
      fields.forEach(function resetField(name) {
        if (type === 'initial') {
          if (Object.prototype.hasOwnProperty.call(initial, name)) current[name] = initial[name];
          else delete current[name];
        } else {
          current[name] = emptyValue(current[name]);
        }
      });
      this.clearValidate(fields);
      var detail = { data: current, fields: fields, type: type, controlled: true };
      this.triggerEvent('reset', detail);
      return detail;
    },
    clearValidate: function clearValidate(fields) {
      var names = normalizeFieldList(fields);
      (this._fields || []).forEach(function clear(field) {
        var name = this.fieldName(field);
        if (names.length && names.indexOf(name) === -1) return;
        if (field && typeof field.clearFormValidation === 'function') field.clearFormValidation();
      }, this);
      this.setData({ lastValid: true });
    },
    setValidateMessage: function setValidateMessage(messages) {
      var normalized = normalizeExternalMessages(messages);
      this.applyFieldMessages(normalized);
      var hasErrors = Object.keys(normalized).some(function hasFieldError(name) {
        return normalized[name].some(function isError(message) { return message.type !== 'warning'; });
      });
      this.setData({ lastValid: !hasErrors });
      return normalized;
    },
    onNativeSubmit: function onNativeSubmit() {
      this.submit({ source: 'native-submit' });
    },
    onNativeReset: function onNativeReset() {
      this.reset({ type: this.data.normalizedResetType, source: 'native-reset' });
    }
  }
});
