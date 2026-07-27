const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');

function functionBlock(name) {
  const start = app.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = app.indexOf('\nfunction ', start + 10);
  return app.slice(start, next >= 0 ? next : app.length);
}

for (const contract of [
  "standard: Object.freeze({ effectsEnabled: true, shadow: 'on', frost: 'off', radius: 'large', border: 'off', gradient: 'off', gradientPreset: 'neutral' })",
  "fruit: Object.freeze({ effectsEnabled: true, shadow: 'on', frost: 'on', radius: 'large', border: 'off', gradient: 'off', gradientPreset: 'neutral' })",
]) {
  assert(app.includes(contract), `fruit flavor preset contract missing: ${contract}`);
}
assert(styles.includes('.topbar {\n    position: relative;\n    z-index: 30;'), 'mobile frosted mode must keep the appearance menu above page content');
assert(!app.includes("fruit: Object.freeze({ theme:"), 'fruit flavor must preserve the current theme');

const matches = functionBlock('previewAppearanceMatches');
assert(matches.includes('Object.entries(preset).every'));
assert(matches.includes('state[key] === value'), 'fruit switch must derive from every preset field');

const apply = functionBlock('applyPreviewAppearancePreset');
assert(apply.includes('Object.assign(state, preset)'));
assert(apply.includes('storePreviewPreferences(state)'), 'fruit flavor must persist through the existing preference truth source');
assert(apply.includes('renderAll()'));

const mount = functionBlock('ensurePreviewPreferenceControls');
assert(mount.includes("value: previewAppearanceMatches('fruit')"));
assert(mount.includes("label: '果味'"));
assert(mount.includes("ariaLabel: '一键果味'"));
assert(mount.includes("customClass: 'appearance-flavor-switch'"));
assert(mount.includes("action: 'fruit-flavor-toggle'"));
assert(mount.includes("labelAction: 'fruit-flavor-toggle'"));
assert(mount.indexOf('data-fruit-flavor-control') < mount.indexOf("id: 'appearanceMenuTrigger'"), 'fruit flavor Switch must sit left of the appearance IconButton');
assert(mount.includes('switchPreviewMarkup(fruitFlavorProps'), 'fruit flavor must reuse the shared PUI Switch mirror');

const sync = functionBlock('syncFruitFlavorControl');
assert(sync.includes("previewAppearanceMatches('fruit')"));
assert(sync.includes("root.classList.toggle('is-checked', checked)"));
assert(sync.includes("control.setAttribute('aria-checked', String(checked))"));

assert(app.includes("applyPreviewAppearancePreset(previewAppearanceMatches('fruit') ? 'standard' : 'fruit')"), 'manual off must restore the standard appearance preset');
assert(!app.includes('fruitFlavorStorageKey'), 'derived fruit state must not create a second persistence key');

for (const contract of [
  '.appearance-flavor',
  '.appearance-flavor-switch',
  '.appearance-flavor-switch.is-checked',
  'gap: var(--pui-preview-content-gap);',
]) {
  assert(styles.includes(contract), `fruit flavor layout contract missing: ${contract}`);
}

console.log('Preview fruit flavor preset contract passed.');
