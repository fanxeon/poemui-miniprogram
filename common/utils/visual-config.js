var STORAGE_KEY = 'poemui-visual-config';
var STORAGE_VERSION = 1;

var DEFAULT_CONFIG = {
  theme: 'light',
  effectsEnabled: true,
  shadow: true,
  frostedGlass: false,
  largeRadius: true,
  bordered: false,
  equalSpacing: false,
};

var PRESETS = {
  standard: {
    effectsEnabled: true,
    shadow: true,
    frostedGlass: false,
    largeRadius: true,
    bordered: false,
  },
  soft: {
    effectsEnabled: true,
    shadow: true,
    frostedGlass: false,
    largeRadius: true,
    bordered: true,
  },
  glass: {
    effectsEnabled: true,
    shadow: true,
    frostedGlass: true,
    largeRadius: true,
    bordered: true,
  },
};

var config = clone(DEFAULT_CONFIG);
var listeners = [];
var restored = false;

function clone(value) {
  var next = {};
  Object.keys(value || {}).forEach(function copyKey(key) {
    next[key] = value[key];
  });
  return next;
}

function clonePresets() {
  var next = {};
  Object.keys(PRESETS).forEach(function clonePreset(name) {
    next[name] = clone(PRESETS[name]);
  });
  return next;
}

function hasOwn(target, key) {
  return Object.prototype.hasOwnProperty.call(target || {}, key);
}

function normalize(input, fallback) {
  var source = input && typeof input === 'object' ? input : {};
  var base = fallback && typeof fallback === 'object' ? fallback : DEFAULT_CONFIG;
  var theme = hasOwn(source, 'theme') && ['light', 'dark', 'auto'].indexOf(source.theme) >= 0
    ? source.theme
    : base.theme;
  var next = { theme: theme };
  ['effectsEnabled', 'shadow', 'frostedGlass', 'largeRadius', 'bordered', 'equalSpacing'].forEach(function normalizeBoolean(key) {
    next[key] = hasOwn(source, key) && typeof source[key] === 'boolean' ? source[key] : base[key];
  });
  return next;
}

function same(left, right) {
  return Object.keys(DEFAULT_CONFIG).every(function compareKey(key) {
    return left[key] === right[key];
  });
}

function getStorage() {
  if (typeof wx === 'undefined') return null;
  if (!wx || typeof wx.getStorageSync !== 'function' || typeof wx.setStorageSync !== 'function') return null;
  return wx;
}

function notify(source) {
  var snapshot = get();
  listeners.slice().forEach(function notifyListener(listener) {
    listener(snapshot, { source: source || 'set' });
  });
}

function persist() {
  var storage = getStorage();
  if (!storage) return { persisted: false, error: null };
  try {
    storage.setStorageSync(STORAGE_KEY, {
      version: STORAGE_VERSION,
      config: get(),
    });
    return { persisted: true, error: null };
  } catch (error) {
    return { persisted: false, error: error };
  }
}

function commit(next, options) {
  var settings = options || {};
  var normalized = normalize(next, config);
  var changed = !same(config, normalized);
  config = normalized;
  var persistence = settings.persist === false ? { persisted: false, error: null } : persist();
  if (changed) notify(settings.source || 'set');
  return {
    config: get(),
    changed: changed,
    persisted: persistence.persisted,
    error: persistence.error,
  };
}

function get() {
  return clone(config);
}

function getEffective() {
  var current = get();
  return {
    theme: current.theme,
    effectsEnabled: current.effectsEnabled,
    shadow: current.effectsEnabled && current.shadow,
    frostedGlass: current.effectsEnabled && current.frostedGlass,
    largeRadius: current.effectsEnabled && current.largeRadius,
    bordered: current.bordered,
    equalSpacing: current.equalSpacing,
  };
}

function set(patch, options) {
  var source = patch && typeof patch === 'object' ? patch : {};
  var next = clone(config);
  Object.keys(DEFAULT_CONFIG).forEach(function assignKnownKey(key) {
    if (hasOwn(source, key)) next[key] = source[key];
  });
  return commit(next, options);
}

function setEffectsEnabled(enabled, options) {
  return set({ effectsEnabled: Boolean(enabled) }, options);
}

function applyPreset(name, options) {
  if (!hasOwn(PRESETS, name)) {
    return {
      config: get(),
      changed: false,
      persisted: false,
      error: new Error('Unknown PoemUI visual preset: ' + name),
    };
  }
  var settings = options || {};
  return set(PRESETS[name], {
    persist: settings.persist,
    source: settings.source || 'preset:' + name,
  });
}

function restore(options) {
  var settings = options || {};
  if (restored && !settings.force) {
    return { config: get(), restored: false, error: null };
  }
  var storage = getStorage();
  if (!storage) return { config: get(), restored: false, error: null };
  try {
    var saved = storage.getStorageSync(STORAGE_KEY);
    restored = true;
    var payload = saved && saved.version === STORAGE_VERSION ? saved.config : saved;
    var next = normalize(payload, DEFAULT_CONFIG);
    var changed = !same(config, next);
    config = next;
    if (changed) notify(settings.source || 'restore');
    return { config: get(), restored: true, error: null };
  } catch (error) {
    restored = false;
    return { config: get(), restored: false, error: error };
  }
}

function reset(options) {
  return commit(DEFAULT_CONFIG, {
    persist: !options || options.persist !== false,
    source: options && options.source ? options.source : 'reset',
  });
}

function subscribe(listener, options) {
  if (typeof listener !== 'function') return function noop() {};
  listeners.push(listener);
  if (!options || options.immediate !== false) listener(get(), { source: 'subscribe' });
  var active = true;
  return function unsubscribe() {
    if (!active) return;
    active = false;
    listeners = listeners.filter(function keep(item) { return item !== listener; });
  };
}

module.exports = {
  storageKey: STORAGE_KEY,
  storageVersion: STORAGE_VERSION,
  defaults: clone(DEFAULT_CONFIG),
  presets: clonePresets(),
  get: get,
  getEffective: getEffective,
  set: set,
  setEffectsEnabled: setEffectsEnabled,
  applyPreset: applyPreset,
  restore: restore,
  reset: reset,
  subscribe: subscribe,
};
