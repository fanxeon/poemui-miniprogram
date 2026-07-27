const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('preview/app.js');
const styles = read('preview/styles.css');
const html = read('preview/index.html');
const agents = read('AGENTS.md');
const contract = read('docs/UI_DESIGN_CONTRACT.md');

for (const sourceContract of [
  "gradient: 'off'",
  "gradientPreset: 'neutral'",
  'function normalizeGradientPreset(value)',
  "gradient: source.gradient === 'on' || source.gradient === 'off'",
  'gradientPreset: normalizeGradientPreset(source.gradientPreset)',
  'gradient: storedPreviewPreferences.gradient',
  'gradientPreset: storedPreviewPreferences.gradientPreset',
  "{ key: 'gradient', label: '渐变', ariaLabel: '渐变背景' }",
  'shell.dataset.gradient = state.gradient',
  'shell.dataset.gradientPreset = state.gradientPreset',
  "gradient: '渐变背景'",
  "['effectsEnabled', 'border', 'shadow', 'frost', 'radius', 'gradient', 'equalSpacing', 'theme']",
]) {
  assert(app.includes(sourceContract), `global gradient preference contract missing: ${sourceContract}`);
}

assert(html.includes('data-gradient="off"'), 'static shell must default the gradient preference to off before hydration');
assert(html.includes('data-gradient-preset="neutral"'), 'static shell must default to the neutral background preset before hydration');
assert(styles.includes('--pui-global-gradient-background:'), 'gradient background must be expressed as a semantic PUI token');
assert(styles.includes('.app-shell[data-gradient="on"]'), 'gradient preference must map to a global shell data attribute');
assert(styles.includes('.app-shell[data-theme="dark"]'), 'gradient token must have a dark-theme mapping');
assert(styles.includes('.app-shell[data-gradient="on"] .preview-device'), 'the component PreviewDevice must consume the global gradient background');
assert(styles.includes('.app-shell[data-gradient="on"] .preview-device__viewport'), 'the PreviewDevice viewport must become transparent so the single gradient background remains visible');
assert(styles.includes('.app-shell[data-gradient="on"] .preview-stage'), 'the preview stage must not add a solid panel over the global gradient');
for (const preset of ['neutral', 'flowing-gold-pink', 'premium-black', 'cement-white', 'black-gold', 'light-gold', 'ai-mist-blue-violet', 'cyber-pink-blue', 'aurora-violet']) {
  assert(app.includes(`value: '${preset}'`), `gradient preset must be selectable: ${preset}`);
  assert(styles.includes(`.app-shell[data-gradient-preset="${preset}"]`), `gradient preset must map to the shell: ${preset}`);
  assert(styles.includes(`--pui-bg-gradient-${preset}`), `gradient preset must have a theme token: ${preset}`);
}
assert(app.includes("id: 'gradientPreset'"), 'appearance menu must use the shared PUI Select mirror for gradient presets');
assert(app.includes("document.querySelector('#gradientPreset').addEventListener('change'"), 'preset changes must persist through the real select bridge');

const gradientStart = styles.lastIndexOf('/* Global gradient is a background preference');
const gradientEnd = styles.indexOf('/* End global gradient preference contract. */', gradientStart);
assert(gradientStart >= 0 && gradientEnd > gradientStart, 'global gradient preference must stay in one authoritative CSS layer');
const gradientLayer = styles.slice(gradientStart, gradientEnd);
assert(!/#(?:080d14|111824|151f2d|0a1019|17202e)/i.test(gradientLayer), 'global gradient must not reintroduce the retired indigo/blue-gray palette');
assert(/linear-gradient\(145deg, #fafafa 0%, #f4f4f5 52%, #fafafa 100%\)/.test(gradientLayer), 'light gradient must use the neutral light palette');
assert(/linear-gradient\(145deg, #09090b 0%, #111113 52%, #09090b 100%\)/.test(gradientLayer), 'dark gradient must preserve the standard #09090b neutral foundation');

for (const layoutMutation of ['padding:', 'margin:', 'width:', 'height:', 'border-radius:']) {
  assert(!gradientLayer.includes(layoutMutation), `gradient preference must not mutate layout through ${layoutMutation}`);
}

for (const documentation of [agents, contract]) {
  assert(documentation.includes('渐变背景'), 'global design governance must document the gradient background preference');
  assert(documentation.includes('#09090b'), 'global design governance must preserve the standard dark foundation');
  assert(documentation.includes('不得改变间距'), 'gradient preference must be documented as layout-neutral');
}

console.log('Global gradient preference contract passed.');
require('./test-global-border-preference');
