const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('preview/app.js');
const styles = read('preview/styles.css');
const html = read('preview/index.html');
const utilities = read('common/style/utilities.wxss');
const docs = [
  read('AGENTS.md'),
  read('CONTRIBUTING.md'),
  read('docs/UI_DESIGN_CONTRACT.md'),
  read('docs/PREVIEW_INFORMATION_HIERARCHY.md'),
  read('docs/H5_PREVIEW_COMPATIBILITY.md'),
].join('\n');

for (const contract of [
  "border: 'off'",
  "border: source.border === 'on' || source.border === 'off'",
  'border: storedPreviewPreferences.border',
  "{ key: 'border', label: '边框', ariaLabel: '边框' }",
  'shell.dataset.border = state.border',
  "border: '边框'",
  "['effectsEnabled', 'border', 'shadow', 'frost', 'radius', 'gradient', 'equalSpacing', 'theme']",
]) {
  assert(app.includes(contract), `global border preference contract missing: ${contract}`);
}

assert(html.includes('data-border="off"'), 'the shell must render the border-off default before hydration');
assert(styles.includes('.app-shell[data-border="off"] .preview-device__viewport'), 'border preference must scope its token remap to the rendered component viewport');
assert(!styles.includes('.app-shell[data-border="off"] {\n  --border: transparent;'), 'border preference must not erase site infrastructure borders at the app-shell root');

const borderStart = styles.lastIndexOf('/* Global border preference belongs to the rendered PUI component tree only.');
const borderEnd = styles.indexOf('/* End global border preference contract. */', borderStart);
assert(borderStart >= 0 && borderEnd > borderStart, 'global border preference must stay in one authoritative CSS layer');
const borderLayer = styles.slice(borderStart, borderEnd);
for (const token of ['--border: transparent', '--border-strong: transparent', '--glass-border: transparent', '--preview-border: transparent', '--pui-border-color: transparent']) {
  assert(borderLayer.includes(token), `border-off must neutralize ${token}`);
}
for (const protectedToken of ['--danger:', '--success:', '--warning:', '--info:', '--text:', '--brand:', '--pui-divider-color:']) {
  assert(!borderLayer.includes(protectedToken), `border-off must not erase semantic state token ${protectedToken}`);
}
for (const layoutMutation of ['padding:', 'margin:', 'width:', 'height:', 'border-radius:', 'display:']) {
  assert(!borderLayer.includes(layoutMutation), `border preference must be layout-neutral and cannot set ${layoutMutation}`);
}
for (const protectedInfrastructure of ['PreviewDevice', 'API', 'navigation', 'documentation']) {
  assert(borderLayer.includes(protectedInfrastructure), `border-off contract must explicitly protect ${protectedInfrastructure} infrastructure`);
}

assert(/\.pui-border-solid\s*\{[^}]*border-style:\s*solid;[^}]*\}/.test(utilities));
assert(app.includes('pui-border pui-border-solid pui-dark-border'));
assert(styles.includes('.utility-doc .pui-border-solid { border-style: solid; }'));
assert(!app.includes("state.border === 'off' ? 'transparent' : (liveTokens['--pui-border-color']"), 'Style Utilities documentation must not be mistaken for the component border preference target');

for (const phrase of ['边框总开关', '默认关闭', '焦点、错误、选中', 'pui-border-solid']) {
  assert(docs.includes(phrase), `global design governance must include ${phrase}`);
}

console.log('Global border preference and border-solid contract passed.');
