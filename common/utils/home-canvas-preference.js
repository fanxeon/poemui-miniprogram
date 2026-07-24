var STORAGE_KEY = 'poemui-home-canvas-preference';
var listeners = [];
var value = false;
var restored = false;

function getStorage() {
  if (typeof wx === 'undefined') return null;
  if (typeof wx.getStorageSync !== 'function' || typeof wx.setStorageSync !== 'function') return null;
  return wx;
}

function notify(source) {
  listeners.slice().forEach(function notifyListener(listener) {
    listener(value, { source: source || 'set' });
  });
}

function get() {
  return value;
}

function set(nextValue, options) {
  var next = Boolean(nextValue);
  var changed = next !== value;
  value = next;
  var storage = getStorage();
  var error = null;
  var persisted = false;
  if (storage && (!options || options.persist !== false)) {
    try {
      storage.setStorageSync(STORAGE_KEY, { gradient: value });
      persisted = true;
    } catch (writeError) {
      error = writeError;
    }
  }
  if (changed) notify(options && options.source);
  return { value: value, changed: changed, persisted: persisted, error: error };
}

function restore(options) {
  if (restored && !(options && options.force)) return { value: value, restored: false, error: null };
  var storage = getStorage();
  if (!storage) return { value: value, restored: false, error: null };
  try {
    var saved = storage.getStorageSync(STORAGE_KEY);
    var next = Boolean(saved && saved.gradient);
    var changed = next !== value;
    value = next;
    restored = true;
    if (changed) notify(options && options.source ? options.source : 'restore');
    return { value: value, restored: true, error: null };
  } catch (readError) {
    restored = false;
    return { value: value, restored: false, error: readError };
  }
}

function subscribe(listener, options) {
  if (typeof listener !== 'function') return function noop() {};
  listeners.push(listener);
  if (!options || options.immediate !== false) listener(value, { source: 'subscribe' });
  var active = true;
  return function unsubscribe() {
    if (!active) return;
    active = false;
    listeners = listeners.filter(function keep(item) { return item !== listener; });
  };
}

module.exports = {
  get: get,
  set: set,
  restore: restore,
  subscribe: subscribe
};
