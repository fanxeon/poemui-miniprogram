'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  appearanceContracts,
  composedAppearanceContracts,
  directionalShadowTokens,
} = require('./appearance-contract-matrix');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ['node_modules', 'miniprogram_npm', '.git'].includes(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}
const wxml = walk(path.join(root, 'miniprogram'))
  .filter((file) => file.endsWith('.wxml'))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n');
const renderedRoots = [...wxml.matchAll(/<pui-([a-z0-9-]+)/g)]
  .map((match) => match[1])
  .filter((name, index, names) => names.indexOf(name) === index)
  .sort();
const matrixRoots = Object.keys(appearanceContracts).sort();

assert.deepStrictEqual(renderedRoots, matrixRoots, 'appearance matrix must match all direct PUI roots rendered by the real miniprogram');
assert.strictEqual(matrixRoots.length, 74, 'the current miniprogram appearance matrix must contain 74 direct PUI roots');
assert(!matrixRoots.includes('drawer'), 'deleted Drawer must not return to the appearance contract');
assert.deepStrictEqual(directionalShadowTokens.slice(0, 1), ['none']);

for (const [name, contract] of Object.entries(appearanceContracts)) {
  assert(contract.surface, `${name} must declare a surface role`);
  assert(directionalShadowTokens.includes(contract.shadow), `${name} must use a known shadow eligibility`);
  for (const key of ['frostedGlass', 'largeRadius', 'bordered', 'equalSpacing', 'gradient']) {
    assert.strictEqual(typeof contract[key], 'boolean', `${name}.${key} must be boolean`);
  }
  assert.strictEqual(contract.gradient, false, `${name} cannot receive the page gradient`);
}

const inputContract = composedAppearanceContracts.input;
assert.deepStrictEqual(inputContract.consumedBy, ['search', 'combobox']);
assert.strictEqual(inputContract.shadow, 'card');
assert.strictEqual(inputContract.gradient, false);

const tabbarContract = appearanceContracts.tabbar;
assert.deepStrictEqual(tabbarContract, {
  surface: 'screen-attached-layout', shadow: 'none', frostedGlass: false, largeRadius: false,
  bordered: true, equalSpacing: false, gradient: false,
}, 'appearance matrix must describe normal Tabbar as a transparent screen-attached layout; round is governed by the dedicated variant contract');

const theme = read('common/style/theme.wxss');
const miniInput = read('input/input.wxss');
const miniImage = read('image/image.wxss');
const miniCollapsible = read('collapsible/collapsible.wxss');
const h5 = read('preview/styles.css');
for (const token of ['--pui-shadow-floating', '--pui-shadow-edge-top', '--pui-shadow-edge-bottom', '--pui-shadow-edge-left', '--pui-shadow-edge-right']) {
  assert(theme.includes(token), `native theme must expose ${token}`);
}
assert(miniInput.includes('box-shadow: var(--pui-shadow-card)'), 'native Input must own the field Surface shadow');
assert(!miniImage.includes('var(--pui-glass-shadow-soft)'), 'native Image must not receive a global outer shadow');
assert(!miniCollapsible.includes('var(--pui-shadow-card)'), 'native Collapsible must not receive a global outer shadow');
assert(h5.includes('.app-shell[data-effects="off"] .preview-device__viewport'), 'H5 must expose an effective effects-off tree boundary');
assert(h5.includes('box-shadow: var(--shadow-edge-top)'), 'H5 must expose top-attached shadow direction');
assert(h5.includes('box-shadow: var(--shadow-edge-bottom)'), 'H5 must expose bottom-attached shadow direction');
assert(h5.includes('box-shadow: none;'), 'H5 must explicitly remove non-elevated root shadows');

console.log(`Appearance contract matrix passed (${matrixRoots.length} roots + ${Object.keys(composedAppearanceContracts).length} composed field rule).`);
