const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const metadata = require(path.join(root, 'metadata/components.js'));
const componentIds = metadata.packageComponents || [];

let behaviorDefinition = null;
const behaviorSource = fs.readFileSync(path.join(root, 'common/behaviors/theme.js'), 'utf8');
vm.runInNewContext(behaviorSource, {
  Behavior(value) {
    behaviorDefinition = value;
    return value;
  },
  module: { exports: {} },
}, { filename: 'common/behaviors/theme.js' });

assert(behaviorDefinition, 'Theme behavior must register');
assert.strictEqual(behaviorDefinition.properties.colorScheme.value, '', 'colorScheme defaults to inheritance');

const themeInstance = {
  data: { colorScheme: '' },
};
assert.strictEqual(behaviorDefinition.methods.getColorSchemeClass.call(themeInstance), '', 'empty colorScheme inherits the nearest Provider');
themeInstance.data.colorScheme = 'dark';
assert.strictEqual(behaviorDefinition.methods.getColorSchemeClass.call(themeInstance), 'pui-theme--dark');
themeInstance.data.colorScheme = 'light';
assert.strictEqual(behaviorDefinition.methods.getColorSchemeClass.call(themeInstance), 'pui-theme--light');
themeInstance.data.colorScheme = 'system';
assert.strictEqual(behaviorDefinition.methods.getColorSchemeClass.call(themeInstance), '', 'unsupported local schemes cannot override Provider');

for (const id of componentIds) {
  const sourcePath = path.join(root, id, `${id}.js`);
  const source = fs.readFileSync(sourcePath, 'utf8');
  assert(
    !/colorScheme\s*\|\|\s*['"]light['"]/.test(source),
    `${id} must not force light when colorScheme is empty`,
  );
  assert(
    !/colorScheme\s*\?\s*[^:\n]+\s*:\s*['"]light['"]/.test(source),
    `${id} must not translate an empty colorScheme into a local light theme`,
  );
}

for (const id of ['action-sheet', 'pull-refresh', 'dropdown-menu']) {
  const source = fs.readFileSync(path.join(root, id, `${id}.js`), 'utf8');
  assert(source.includes('this.getColorSchemeClass()'), `${id} must use the shared Theme Behavior`);
}

const rateSource = fs.readFileSync(path.join(root, 'rate/rate.js'), 'utf8');
assert(rateSource.includes("safeColor(this.data.color, 'var(--pui-color-warning)')"), 'Rate default accent must inherit the semantic warning token');
assert(!rateSource.includes("this.data.colorScheme === 'dark'"), 'Rate must not duplicate Provider theme resolution in JS');

console.log(`Component theme inheritance contract passed (${componentIds.length} public components).`);
