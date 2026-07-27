const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('aspect-ratio/aspect-ratio.js');
const wxml = read('aspect-ratio/aspect-ratio.wxml');
const wxss = read('aspect-ratio/aspect-ratio.wxss');
const preview = read('preview/app.js');
const previewCss = read('preview/styles.css');
const api = read('docs/COMPONENT_API.md');
const contract = read('docs/components/ASPECT-RATIO.md');
const compatibility = read('docs/H5_PREVIEW_COMPATIBILITY.md');
const example = read('_example/miniprogram/pages/components/index.wxml');
const metadata = require(path.join(root, 'metadata/components.js'));

let definition = null;
vm.runInNewContext(source, {
  isFinite,
  Component(value) { definition = value; },
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    throw new Error(`Unexpected dependency: ${request}`);
  },
}, { filename: 'aspect-ratio/aspect-ratio.js' });

assert(definition, 'AspectRatio component definition must be registered');
assert(!source.includes('triggerEvent('), 'AspectRatio is a layout primitive without fake events');
assert.strictEqual(definition.methods.onTap, undefined);

function create(overrides) {
  const defaults = Object.fromEntries(Object.entries(definition.properties).map(([key, prop]) => [key, prop.value]));
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: '' }, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch) { Object.assign(this.data, patch); },
  };
  Object.assign(instance, definition.methods);
  instance.syncState();
  return instance;
}

const defaults = create();
assert.strictEqual(defaults.data.paddingTop, 56.25);
assert(defaults.data.rootClass.includes('pui-aspect-ratio--radius-medium'));
assert(defaults.data.rootStyle.includes('transition-duration:500ms'));

const portrait = create({ ratio: '4:3', bordered: true, radius: 'large', background: '#123456', overflow: false, duration: 600, easing: 'linear' });
assert.strictEqual(portrait.data.paddingTop, 75);
assert(portrait.data.rootClass.includes('pui-aspect-ratio--bordered'));
assert(portrait.data.rootClass.includes('pui-aspect-ratio--radius-large'));
assert(portrait.data.rootClass.includes('pui-aspect-ratio--overflow-visible'));
assert(portrait.data.rootStyle.includes('background:#123456'));
assert(portrait.data.rootStyle.includes('transition-duration:600ms'));

const capped = create({ duration: 1600 });
assert(capped.data.rootStyle.includes('transition-duration:1000ms'));

const invalid = create({ ratio: 'nope', radius: 'pill', background: 'url(javascript:bad)', reduceMotion: true });
assert.strictEqual(invalid.data.paddingTop, 56.25);
assert(invalid.data.rootClass.includes('pui-aspect-ratio--radius-medium'));
assert(!invalid.data.rootStyle.includes('background:'));
assert(invalid.data.rootStyle.includes('transition-duration:1ms'));

assert(wxml.includes('padding-top:{{paddingTop}}%'));
assert(wxml.includes('<slot></slot>'));
assert(wxss.includes('overflow: hidden;'));
assert(wxss.includes('.pui-aspect-ratio--overflow-visible { overflow: visible; }'));
assert(wxss.includes('transition-property: padding-top;'));
assert(!wxss.includes('box-shadow:'), 'AspectRatio must remain a non-elevated layout root');

assert.deepStrictEqual(metadata.apiProps['aspect-ratio'], ['ratio', 'bordered', 'radius', 'background', 'overflow', 'duration', 'easing', 'reduceMotion']);
assert.strictEqual(metadata.apiEvents['aspect-ratio'], undefined);
assert(preview.includes('function aspectRatioShowcase(props)'));
const showcase = preview.slice(preview.indexOf('function aspectRatioShowcase'), preview.indexOf('function buttonGroupShowcase'));
assert(showcase.includes('项目封面'));
assert(showcase.includes('媒体内容'));
assert(!showcase.includes('Default slot'));
assert(!showcase.includes('clipped content'));
assert(!preview.includes('clipped content'), 'no overview may leak the clipped-content diagnostic');
for (const className of ['radius-none', 'radius-small', 'radius-medium', 'radius-large']) {
  assert(previewCss.includes(`.pui-aspect-preview--${className}`), `H5 must map ${className}`);
}
assert(!previewCss.includes('pui-aspect-preview--pui-site-radius-control-none'));
assert(!previewCss.includes('pui-aspect-preview--pui-preview-radius-small'));
assert(!previewCss.includes('.pui-aspect-preview {\n  box-shadow:'), 'H5 aspect root must remain non-elevated');
assert(contract.includes('百分比占位'));
assert(contract.includes('`overflow=true` 的裁切是布局策略'));
assert(compatibility.includes('不得泄漏 `Default slot`、`clipped content`'));
assert(example.includes('<pui-aspect-ratio bordered>'));
assert(!example.includes('<pui-aspect-ratio ratio="16 / 9"'));
assert(api.includes('## Aspect Ratio'));

process.stdout.write('AspectRatio contract tests passed.\n');
