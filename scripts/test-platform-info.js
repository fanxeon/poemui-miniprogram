const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const metadata = require('../metadata/components');

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

function javascriptFiles(relativeRoot) {
  const absoluteRoot = path.join(root, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) return [];
  return fs.readdirSync(absoluteRoot, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(relativeRoot, entry.name);
    if (entry.isDirectory()) return javascriptFiles(relative);
    return entry.isFile() && entry.name.endsWith('.js') ? [relative] : [];
  });
}

const runtimeRoots = [
  'common',
  'miniprogram/common',
  'miniprogram/components',
  'miniprogram/pages',
  'miniprogram/utils',
].concat(metadata.packageComponents);
const sourceFiles = Array.from(new Set(runtimeRoots.flatMap(javascriptFiles)));
assert(sourceFiles.length > metadata.packageComponents.length, 'platform scan must cover package components and miniprogram runtime sources');
sourceFiles.forEach((relative) => {
  const text = fs.readFileSync(path.join(root, relative), 'utf8');
  assert(!text.includes('getSystemInfoSync'), `${relative} must not call the deprecated aggregate API`);
});

console.log('Platform information compatibility contract passed.');
