const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'common/utils/platform-info.js'), 'utf8');
let platformInfo = null;
const wx = {
  getWindowInfo() { return { windowWidth: 390, windowHeight: 844, statusBarHeight: 47 }; },
  getDeviceInfo() { return { platform: 'ios' }; },
  getAppBaseInfo() { return { language: 'zh_CN', theme: 'dark' }; },
};

const moduleState = { exports: {} };
vm.runInNewContext(source, {
  wx,
  module: moduleState,
  exports: moduleState.exports,
}, { filename: 'common/utils/platform-info.js' });
platformInfo = moduleState.exports;

assert.deepStrictEqual(JSON.parse(JSON.stringify(platformInfo.getWindowInfo())), { windowWidth: 390, windowHeight: 844, statusBarHeight: 47 });
assert.deepStrictEqual(JSON.parse(JSON.stringify(platformInfo.getDeviceInfo())), { platform: 'ios' });
assert.deepStrictEqual(JSON.parse(JSON.stringify(platformInfo.getAppBaseInfo())), { language: 'zh_CN', theme: 'dark' });
assert(!source.includes('getSystemInfoSync'), 'shared platform reader must not restore the deprecated aggregate API');

const sourceFiles = [
  'common/utils/theme.js', 'icon/icon.js', 'navbar/navbar.js', 'sheet/sheet.js', 'swipe-cell/swipe-cell.js',
  'rate/rate.js', 'watermark/watermark.js', 'tabs/tabs.js', 'popover/popover.js', 'direction/direction.js',
  'virtual-list/virtual-list.js', 'overlay/overlay.js', 'miniprogram/pages/index/index.js',
  'miniprogram/utils/component-page.js', 'miniprogram/components/navigation-bar/navigation-bar.js'
];
sourceFiles.forEach((relative) => {
  const text = fs.readFileSync(path.join(root, relative), 'utf8');
  assert(!text.includes('getSystemInfoSync'), `${relative} must not call the deprecated aggregate API`);
});

console.log('Platform information compatibility contract passed.');
