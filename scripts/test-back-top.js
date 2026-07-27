const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'back-top/back-top.js'), 'utf8');
let definition = null;
const pageScrollCalls = [];
vm.runInNewContext(source, {
  require: () => ({}),
  Component: (value) => { definition = value; },
  wx: { pageScrollTo: (options) => pageScrollCalls.push(options) },
}, { filename: 'back-top/back-top.js' });
assert(definition, 'BackTop component definition must be registered');

const PUBLIC_PROPS = ['fixed', 'icon', 'scrollTop', 'text', 'theme', 'visibilityHeight', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'BackTop publishes only the reviewed Props');
assert.strictEqual(definition.properties.icon.value, 'arrow-up', 'BackTop defaults to the upward-arrow icon');
['target', 'targetTop', 'scrollDuration', 'right', 'bottom', 'size', 'safeAreaInsetBottom', 'zIndex', 'loading', 'disabled', 'duration', 'easing', 'customContent']
  .forEach((key) => assert(!definition.properties[key], `${key} must not return to BackTop`));

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const hidden = create({ scrollTop: 199, visibilityHeight: 200 });
assert.strictEqual(hidden.instance.data.visible, false);
assert.strictEqual(hidden.instance.data.buttonTheme, 'primary', 'default BackTop uses the primary FAB surface');
assert.strictEqual(hidden.instance.data.buttonIcon, 'arrow-up', 'default BackTop remains a visible icon button without consumer props');
assert.strictEqual(hidden.instance.onTap(), false, 'hidden BackTop must not publish a false action');
assert.deepStrictEqual(hidden.events, []);

const visible = create({ scrollTop: 200, visibilityHeight: 200, text: '返回顶部', theme: 'half-round' });
assert.strictEqual(visible.instance.data.visible, true);
assert(visible.instance.data.rootClass.includes('pui-back-top--half-round'));
assert.strictEqual(visible.instance.data.buttonShape, 'round');
assert(visible.instance.data.rootStyle.includes('500ms'));
assert.strictEqual(visible.instance.onTap(), true);
assert.strictEqual(JSON.stringify(visible.events), JSON.stringify([{ name: 'to-top', detail: { scrollTop: 200, source: 'tap' } }]));
assert.strictEqual(JSON.stringify(pageScrollCalls.pop()), JSON.stringify({ scrollTop: 0, duration: 500 }), 'to-top precedes actual page scroll request');

visible.instance.data.reduceMotion = true;
visible.instance.syncState();
assert(visible.instance.data.rootStyle.includes('1ms'));
visible.events.length = 0;
visible.instance.onTap();
assert.strictEqual(JSON.stringify(visible.events), JSON.stringify([{ name: 'to-top', detail: { scrollTop: 200, source: 'tap' } }]));
assert.strictEqual(JSON.stringify(pageScrollCalls.pop()), JSON.stringify({ scrollTop: 0, duration: 0 }), 'reduceMotion makes only the platform scroll immediate');

visible.instance.data.scrollTop = -1;
visible.instance.data.visibilityHeight = -1;
visible.instance.syncState();
assert.strictEqual(visible.instance.data.visible, true, 'negative scrollTop and threshold normalize to zero');
assert(!visible.instance.data.rootClass.includes('undefined'));

const wxml = fs.readFileSync(path.join(root, 'back-top/back-top.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'back-top/back-top.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'back-top/back-top.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');
const edgeSetStart = preview.indexOf('const edgeToEdgePreviewIds = new Set([');
const edgeSetEnd = preview.indexOf(']);', edgeSetStart);
assert(edgeSetStart >= 0 && edgeSetEnd > edgeSetStart);
assert(!preview.slice(edgeSetStart, edgeSetEnd).includes("'back-top'"), 'BackTop must use the shared shadow-safe PreviewDevice layout');

assert.deepStrictEqual(Object.keys(json.usingComponents), ['pui-fab']);
assert(wxml.includes('<pui-fab'));
assert(wxml.includes('bind:click="onTap"'));
assert(wxml.includes('<slot name="icon"></slot>'));
assert(wxml.includes('<slot></slot>'));
assert(!wxml.includes('pui-loading'));
assert(!/transition\s*:[^;]*\bheight\s*:\s*auto/.test(wxss));
assert(!wxss.includes('display: none'));
assert(!/\b(?:[4-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));
assert(!wxss.includes('text-overflow: ellipsis'));
assert(!wxss.includes('--pui-color-primary'), 'BackTop must not consume an undefined primary token');
assert(wxss.includes('pui-back-top__fab'));
assert(wxss.includes('z-index: var(--pui-z-index-fixed, 1000);'), 'BackTop fixed layer must retain a safe z-index when consumers do not define the optional token');
assert(wxss.includes('bottom: var(--pui-back-top-bottom-offset,'), 'BackTop must expose a semantic CSS offset so app shells can clear a bottom Tabbar without adding a public positioning Prop');

assert.deepStrictEqual(metadata.apiProps['back-top'], PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups['back-top'].flatMap((group) => group.keys), PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents['back-top'].map((event) => event.name), ['to-top']);
assert.deepStrictEqual(metadata.apiSlots['back-top'].map((slot) => slot.name), ['icon', 'default']);
assert.strictEqual(metadata.apiMethods['back-top'], undefined);

const previewSource = preview.slice(preview.indexOf('function clampBackTopPreview'), preview.indexOf('function indexesSame'));
['<h3>基础用法</h3>', '<h3>显示阈值</h3>']
  .forEach((heading) => assert(previewSource.includes(heading)));
assert(!previewSource.includes('<h3>形状与文案</h3>'));
assert(!previewSource.includes('<h3>主题与定位</h3>'));
assert(previewSource.includes('fabSample({'));
assert(previewSource.includes("theme: current.theme.includes('dark') ? 'inverse' : 'primary'"), 'H5 mirrors the primary default BackTop surface');
assert(preview.includes('iconOnly: !content'), 'H5 FAB without text uses the true icon-only Button geometry');
assert(previewSource.includes('cellSample({'));
assert(previewSource.includes('data-back-top-scroll="current"'));
assert(previewSource.includes('const itemCount = compact ? 12 : 18;'), 'both BackTop lists must provide a meaningful scroll distance');
assert(previewSource.includes('Array.from({ length: itemCount }'));
assert(previewSource.includes('index === itemCount - 1'));
assert(previewSource.includes("sampleId: 'threshold', compact: true"));
assert(!previewSource.includes('centered: true'), 'FAB keeps BackTop bottom-right semantics instead of being centered');
assert(!previewSource.includes('is-centered'));
assert(!previewSource.includes('data-back-top-event'));
assert(!previewSource.includes('customContent'));
assert(!previewSource.includes('targetTop'));
assert(previewStyles.includes('.pui-back-top-showcase > .pui-showcase-section + .pui-showcase-section'));
assert(previewStyles.includes('.pui-back-top-showcase > .pui-showcase-section > h3'));
assert(previewStyles.includes('padding-inline: var(--pui-preview-device-padding);'), 'BackTop headings must align with the frame content inset');
assert(previewStyles.includes('padding: var(--pui-preview-device-padding);'), 'BackTop preview frame must consume the shared preview padding token');
assert(previewStyles.includes('right: calc(var(--pui-preview-device-padding) + var(--pui-preview-content-gap));'));
assert(previewStyles.includes('bottom: calc(var(--pui-preview-device-padding) + var(--pui-preview-content-gap));'));
assert(!previewStyles.includes('.pui-back-top-preview.is-centered'));
assert(previewStyles.includes('scrollbar-width: none;'), 'BackTop list scrollbar must not offset the visual Cell center');
assert(previewStyles.includes('.pui-back-top-scroll::-webkit-scrollbar { width: 0; height: 0; }'));
assert(previewStyles.includes('height: 260px;'), 'the two list samples should reserve a larger readable content area');
assert(!previewStyles.includes('.pui-back-top-preview.is-inverse'));
assert(previewStyles.includes('pui-back-top-preview.is-half-round-dark .pui-fab-preview__button'));
assert(previewStyles.includes('background: var(--pui-bg-inverse);'));
assert(previewStyles.includes('background: var(--brand);'), 'H5 default BackTop keeps the primary brand surface after shared Button rules');

const previewApiStart = preview.lastIndexOf("if (id === 'back-top')");
const previewApiSource = preview.slice(previewApiStart, preview.indexOf("if (id === 'indexes')", previewApiStart));
['page/container', 'targetTop', 'loading', 'success/error/complete', '实例方法'].forEach((legacy) => {
  assert(!previewApiSource.includes(legacy), `BackTop API copy must not retain legacy wording: ${legacy}`);
});
assert(previewApiSource.includes('外部页面当前纵向滚动位置'));

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'back-top')"), preview.indexOf("if (runtimeId === 'indexes')"));
assert(!usageSource.includes('bind:'), 'BackTop basic WXML contains no event bindings');
assert(!usageSource.includes('pui-icon'));
assert(usageSource.includes('scroll-top="{{pageScrollTop}}"'));
const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="BackTop 基础用法"'), exampleWxml.indexOf('<pui-card title="Indexes'));
assert(exampleSection.includes('<pui-back-top scroll-top="{{backTopScroll}}"'));
assert(!exampleSection.includes('bind:'), 'example basic BackTop contains no binds');
['requestBackTopByMethod', 'toggleBackTopLoading', 'toggleBackTopDisabled', 'onBackTopInput', 'onBackTopChange', 'onBackTopReach'].forEach((name) => assert(!exampleJs.includes(name)));
assert(exampleJs.includes('onPageScroll: function onPageScroll'));

assert(api.includes('## BackTop'));
assert(api.includes('BackTop 不公开实例方法'));
assert(/\d+\. BackTop/.test(compatibility));
assert(alignment.includes('| 36 | BackTop | BackTop |'));
assert(fs.existsSync(path.join(root, 'docs/components/BACKTOP.md')));

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `back-top/back-top.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/back-top/back-top.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `BackTop source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/back-top/back-top.${extension}`);
  assert(fs.existsSync(installedFile), `BackTop example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `BackTop source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/back-top/back-top.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `BackTop source/WeChat npm ${extension} must stay identical`);
});

console.log('BackTop contract tests passed.');
