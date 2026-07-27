'use strict';

var assert = require('assert');
var path = require('path');

var storage = null;
var legacyStorage = null;
global.wx = {
  getStorageSync: function (key) {
    assert.ok(key === 'poemui-page-background-preference' || key === 'poemui-home-canvas-preference');
    return key === 'poemui-page-background-preference' ? storage : legacyStorage;
  },
  setStorageSync: function (key, value) {
    assert.strictEqual(key, 'poemui-page-background-preference');
    storage = value;
  }
};

var modulePath = path.resolve(__dirname, '../miniprogram/common/utils/page-background-preference.js');
delete require.cache[require.resolve(modulePath)];
var preference = require(modulePath);

assert.strictEqual(preference.get(), false);
var firstLaunchRestore = preference.restore({ force: true });
assert.strictEqual(firstLaunchRestore.restored, true, '首次无本地页面背景偏好时也必须完成恢复路径');
assert.strictEqual(firstLaunchRestore.value, false, '首次无本地页面背景偏好必须使用默认无渐变');
var events = [];
var unsubscribe = preference.subscribe(function (value, meta) { events.push({ value: value, meta: meta }); });
assert.strictEqual(events.length, 1);
var setResult = preference.set(true, { source: 'test' });
assert.strictEqual(setResult.persisted, true);
assert.strictEqual(setResult.error, null);
assert.deepStrictEqual(storage, { gradient: true });
assert.strictEqual(preference.get(), true);
storage = { gradient: false };
var restoreResult = preference.restore({ force: true });
assert.strictEqual(restoreResult.restored, true);
assert.strictEqual(preference.get(), false);
legacyStorage = { gradient: true };
storage = null;
var legacyRestoreResult = preference.restore({ force: true });
assert.strictEqual(legacyRestoreResult.migrated, true, '旧页面背景偏好必须迁移到新存储键');
assert.deepStrictEqual(storage, { gradient: true }, '迁移后必须持久化到新存储键');
assert.strictEqual(preference.get(), true);
legacyStorage = null;
unsubscribe();

console.log('page background preference contract passed');
