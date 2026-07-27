const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'alert/alert.js'), 'utf8');
let definition = null;
const sandbox = {
  isFinite,
  clearTimeout() {},
  setTimeout(callback) { callback(); return 1; },
  require: () => ({}),
  Component(value) { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'alert/alert.js' });
assert(definition, 'Alert component definition must be registered');
assert.strictEqual(Object.keys(definition.properties).length, 15, 'Alert publishes 15 Props');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const uncontrolled = create({ closable: true, defaultVisible: true, duration: 0 });
assert.strictEqual(uncontrolled.instance.data.rendered, true);
assert.strictEqual(uncontrolled.instance.data.innerVisible, true);
uncontrolled.instance.onClose();
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['input', 'change', 'close']);
assert.strictEqual(uncontrolled.events.at(-1).detail.source, 'close-button');
assert.strictEqual(uncontrolled.instance.data.rendered, false, 'uncontrolled close removes after its motion completes');

const controlled = create({ visible: true, closable: true, duration: 0 });
controlled.instance.onClose();
assert.deepStrictEqual(controlled.events.map((event) => event.name), ['input', 'change', 'close']);
assert.strictEqual(controlled.instance.data.rendered, true, 'controlled close waits for parent visible writeback');
assert.strictEqual(controlled.instance.data.innerVisible, true);

const capped = create({ defaultVisible: true, duration: 1800 });
assert(capped.instance.data.motionStyle.includes('1000ms'));
const reduced = create({ defaultVisible: true, duration: 400, reduceMotion: true });
assert(reduced.instance.data.motionStyle.includes('1ms'));
const tinted = create({ theme: 'warning', variant: 'tinted', verticalAlign: 'center' });
assert(tinted.instance.data.rootClass.includes('pui-alert--tinted'), 'Alert exposes the tinted variant root class');
assert(tinted.instance.data.rootClass.includes('pui-alert--vertical-center'), 'verticalAlign=center centers the Alert row');
assert.strictEqual(tinted.instance.data.iconColor, 'var(--pui-alert-warning-tinted-fg)', 'tinted Alert passes the shared warning foreground Token to Icon Font');
const darkTinted = create({ theme: 'warning', variant: 'tinted', colorScheme: 'dark' });
assert.strictEqual(darkTinted.instance.data.iconColor, 'var(--pui-alert-warning-tinted-fg)', 'the shared Token resolves through the current theme instead of duplicating a JS color table');
const soft = create({ theme: 'warning', variant: 'soft' });
assert.strictEqual(soft.instance.data.iconColor, '', 'soft Alert preserves the Icon default color behavior');
const legacyCenter = create({ center: true, verticalAlign: 'top' });
assert(legacyCenter.instance.data.rootClass.includes('pui-alert--center'), 'center remains a supported legacy alignment API');
assert(legacyCenter.instance.data.rootClass.includes('pui-alert--vertical-center'), 'center retains vertical alignment compatibility');

const wxml = fs.readFileSync(path.join(root, 'alert/alert.wxml'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'alert/alert.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'alert/alert.wxss'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'common/style/theme.wxss'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/ALERT.md'), 'utf8');
assert(wxml.includes('<pui-button') && wxml.includes('<pui-icon'), 'Alert composes PUI Button and Icon');
assert(wxml.includes('color="{{iconColor}}"'), 'Alert passes its semantic tinted foreground Token to the Icon Font');
assert(!/<button\b/.test(wxml), 'Alert does not bypass the Button component');
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert(preview.includes('function resolveAlertPreviewVisible(props, demo)'), 'H5 has Alert-specific controlled visibility resolution');
assert(preview.includes("if (typeof props.visible === 'boolean') return props.visible;"), 'controlled visible takes precedence over demo state');
assert(preview.includes("state.props[state.current].visible = false;"), 'H5 close writes controlled visibility through the preview parent');
assert(preview.includes("state.props[state.current].visible = true;"), 'hidden controlled Alert has a real reopen writeback');
assert(preview.includes('function bindAlertPreviewRuntime(props)'), 'Alert must enter on the retained mounted node');
assert(preview.includes("panel.classList.add('is-visible');"), 'Alert enter must activate after the mount frame');
assert(preview.includes("if (!resolveAlertPreviewVisible(getProps(state.current), getDemoState('alert'))) renderStage();"), 'Alert only unmounts after the requested leave motion remains hidden');
assert(preview.includes("visible: { type: 'nullable-boolean', value: null }"), 'overview must start from native uncontrolled visible=null');
assert(preview.includes("variant: { type: 'select', value: 'soft', options: ['soft', 'tinted'] }"), 'H5 exposes the Alert tinted variant');
assert(preview.includes("verticalAlign: { type: 'select', value: 'top', options: ['top', 'center'] }"), 'H5 exposes the Alert vertical alignment control');
assert(!preview.includes('data-alert-result'), 'component-only Alert overview must not render event diagnostics');
assert(!preview.includes('Alert feedback'), 'component-only Alert overview must not render implementation labels');
assert(!preview.includes('Alert + Tag slot'), 'component-only Alert overview must not expose slot jargon');
assert(/\.pui-alert__main\s*\{[^}]*gap:\s*var\(--pui-space-normal\)/.test(wxss), 'Alert icon and body must use the normal content-composition gap');
assert(/\.pui-alert-demo__main\s*\{[^}]*gap:\s*var\(--pui-preview-space-normal\)/.test(previewStyles), 'H5 Alert icon and body must mirror the normal content-composition gap');
assert(wxss.includes('.pui-alert--tinted') && wxss.includes('--pui-alert-warning-tinted-fg'), 'native Alert tinted appearance uses semantic Tokens');
assert(previewStyles.includes('.pui-alert-demo--tinted') && previewStyles.includes('--pui-alert-warning-tinted-fg'), 'H5 Alert tinted appearance mirrors semantic Tokens');
assert(preview.includes("color: iconColor"), 'H5 Alert passes the same tinted foreground Token into the shared Icon mirror');
[
  ['light', 'default', '#3f3f46'], ['light', 'info', '#1d4ed8'], ['light', 'success', '#15803d'], ['light', 'warning', '#92400e'], ['light', 'danger', '#b91c1c'],
  ['dark', 'default', '#f4f4f5'], ['dark', 'info', '#bfdbfe'], ['dark', 'success', '#bbf7d0'], ['dark', 'warning', '#fde68a'], ['dark', 'danger', '#fecaca'],
].forEach(([scheme, name, color]) => {
  assert(theme.includes(`--pui-alert-${name}-tinted-fg: ${color};`), `Alert ${scheme}/${name} foreground must remain in the shared Token source`);
});
assert(!source.includes('tintedIconColors'), 'Alert must not duplicate theme colors after Icon Font currentColor support');
assert(contract.includes('父级回写') && contract.includes('500ms'));
console.log('Alert contract tests passed.');
