const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'preview/index.html'), 'utf8');

function functionBlock(name) {
  const start = app.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = app.indexOf('\nfunction ', start + 10);
  return app.slice(start, next >= 0 ? next : app.length);
}

assert(html.includes('id="previewPreferenceControls" class="topbar__controls" aria-label="外观设置"'));
assert(!/<(?:button|input|select|textarea)\b/.test(html), 'static shell must keep only the appearance Mount');
assert(app.includes('appearanceMenuOpen: false'), 'appearance menu must have one explicit runtime state');

const mount = functionBlock('ensurePreviewPreferenceControls');
assert(mount.includes('iconButtonSample({'), 'appearance entry must reuse the PUI IconButton mirror');
assert(mount.includes("icon: 'palette'"), 'appearance entry must use the appearance icon');
assert(mount.includes("size: 'medium'"), 'appearance icon must remain legible inside its 36px target');
assert(mount.includes('data-fruit-flavor-control'), 'the derived fruit flavor Switch must sit beside the appearance button');
assert(mount.includes("ariaHaspopup: 'dialog'"));
assert(mount.includes("ariaControls: 'appearanceMenuPanel'"));
assert(mount.includes('switchPreviewMarkup('), 'menu content must continue to reuse PUI Switch');
assert(mount.includes('block: true'), 'each appearance row must fill the shared menu width');
assert(mount.includes("id: 'appearanceResetAction'"), 'menu must expose a real primary reset IconButton');
assert(mount.includes('role="dialog"'));
assert(mount.includes('aria-modal="false"'));
assert(mount.includes('aria-hidden="true"'));
assert(mount.includes('inert'));
assert(!mount.includes('<button'), 'appearance infrastructure must not handwrite Button or Switch platform roots');

for (const preference of ['border', 'shadow', 'frost', 'radius', 'gradient', 'equalSpacing', 'theme']) {
  assert(app.includes(`key: '${preference}'`), `${preference} must remain in the shared appearance menu`);
}
const preferenceDefinitions = app.slice(app.indexOf('const previewPreferenceDefinitions = ['), app.indexOf('function previewPreferenceChecked'));
assert(!preferenceDefinitions.includes('effectsEnabled'), 'effectsEnabled must remain an internal preference and not render in the appearance menu');
const normalizePreferences = functionBlock('normalizePreviewPreferences');
assert(normalizePreferences.includes('effectsEnabled: true'), 'old H5 paused preferences must migrate to an enabled hidden gate');
assert(!normalizePreferences.includes('source.effectsEnabled'), 'the hidden H5 gate must not restore an unreachable paused state');
assert(!mount.includes("['shadow', 'frost', 'radius'].includes(item.key)"), 'visible switches must not be disabled by the hidden gate');

const sync = functionBlock('syncAppearanceMenu');
assert(sync.includes("root.classList.toggle('is-open', state.appearanceMenuOpen)"));
assert(sync.includes("trigger.setAttribute('aria-expanded'"));
assert(sync.includes("panel.setAttribute('aria-hidden'"));
assert(sync.includes('panel.inert = !state.appearanceMenuOpen'));

const setOpen = functionBlock('setAppearanceMenuOpen');
assert(setOpen.includes('#appearanceMenuPanel [role="switch"]'), 'opening must move keyboard focus into the menu');
assert(setOpen.includes("#appearanceMenuTrigger')?.focus"), 'Escape close must restore trigger focus');
assert(app.includes("event.target.closest('[data-appearance-menu-trigger]')"));
assert(app.includes("document.addEventListener('pointerdown'"), 'outside pointer interaction must dismiss the menu');
assert(app.includes("event.key !== 'Escape' || !state.appearanceMenuOpen"), 'Escape must dismiss the menu');
assert(app.includes('storePreviewPreferences(state)'), 'moving switches must preserve local persistence');
assert(app.includes("event.target.closest('[data-appearance-reset]')"), 'reset must be a real menu event');

const appearanceLayer = styles.slice(styles.lastIndexOf('/* The top bar exposes one PUI IconButton'));
for (const contract of [
  '.appearance-menu__trigger.pui-button-preview',
  'body .app-shell .pui-button-preview > .pui-button-preview__content:empty',
  '.appearance-menu__panel',
  'width: min(var(--pui-site-appearance-menu-width)',
  'right: 0;',
  'padding: var(--pui-preview-panel-padding);',
  'transition: opacity var(--pui-duration-normal)',
  '.appearance-menu.is-open .appearance-menu__panel',
  '.appearance-menu .topbar-preference',
  'justify-content: space-between;',
  '@media (max-width: 700px)',
  '.topbar {\n    position: relative;',
  '@media (prefers-reduced-motion: reduce)',
]) {
  assert(appearanceLayer.includes(contract), `appearance menu CSS contract missing: ${contract}`);
}
assert(!appearanceLayer.includes(':hover'), 'appearance menu must not depend on hover-only feedback');

console.log('Preview appearance menu contract passed.');
