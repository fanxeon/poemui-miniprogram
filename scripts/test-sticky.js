const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'sticky/sticky.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  require: (request) => {
    if (request === '../common/behaviors/page-scroll') return () => ({});
    throw new Error(`Unexpected Sticky dependency: ${request}`);
  },
  Component: (value) => { definition = value; },
}, { filename: 'sticky/sticky.js' });
assert(definition, 'Sticky component definition must be registered');

const PUBLIC_PROPS = ['container', 'disabled', 'offsetTop', 'zIndex'];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Sticky publishes only the reviewed Props');
['scrollTarget', 'scrollTop', 'background', 'title', 'description', 'customContent', 'placeholder', 'fullWidth', 'safeAreaInsetTop', 'bordered', 'shadow', 'ariaLabel', 'throttle', 'duration', 'easing', 'reduceMotion']
  .forEach((key) => assert(!definition.properties[key], `${key} must not return to Sticky`));

function create(options) {
  const settings = options || {};
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const sequence = [];
  const rootRect = settings.rootRect || { top: 24, height: 48 };
  const instance = {
    data: Object.assign({}, definition.data, defaults, settings.props || {}),
    createSelectorQuery() {
      const query = {
        select() {
          return {
            boundingClientRect() { return query; },
          };
        },
        exec(callback) { callback([rootRect]); },
      };
      return query;
    },
    setData(patch, callback) {
      sequence.push('setData');
      Object.assign(this.data, patch);
      if (typeof callback === 'function') callback();
    },
    triggerEvent(name, detail) {
      sequence.push(`trigger:${name}`);
      events.push({ name, detail });
    },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events, sequence };
}

const fixed = create({ props: { offsetTop: 24, zIndex: 0 }, rootRect: { top: 24, height: 48 } });
assert.strictEqual(fixed.instance.data.isFixed, true, 'offsetTop equal to root top must enter fixed state');
assert(fixed.instance.data.containerStyle.includes('height:48px;'), 'fixed state must retain a same-height placeholder');
assert(fixed.instance.data.contentStyle.includes('position:fixed;top:24px;left:0;right:0;'));
assert.strictEqual(fixed.instance.data.zIndex, 0, 'zIndex=0 must remain a valid public value');
assert.deepStrictEqual(fixed.sequence, ['setData', 'trigger:scroll'], 'fixed state must commit layout before it emits scroll');
fixed.events.length = 0;
fixed.instance.onPageScroll({ scrollTop: 180 });
assert.strictEqual(JSON.stringify(fixed.events), JSON.stringify([{ name: 'scroll', detail: { scrollTop: 180, isFixed: true } }]));

const ordinary = create({ props: { offsetTop: 23 }, rootRect: { top: 24, height: 48 } });
assert.strictEqual(ordinary.instance.data.isFixed, false, 'root below offset must remain in document flow');
assert.strictEqual(ordinary.instance.data.containerStyle, '');
assert.strictEqual(ordinary.instance.data.contentStyle, '');

const boundary = {
  boundingClientRect(callback) {
    callback({ top: 0, height: 36 });
    return { exec() {} };
  },
};
const bounded = create({
  props: { offsetTop: 0, container: () => boundary },
  rootRect: { top: 0, height: 48 },
});
assert.strictEqual(bounded.instance.data.isFixed, false, 'container bottom takes precedence over fixed positioning');
assert(bounded.instance.data.contentStyle.includes('transform:translate3d(0,-12px,0);'), 'bounded content must move by the measured remainder');

const disabled = create({ props: { disabled: true, offsetTop: 0 }, rootRect: { top: 0, height: 48 } });
assert.strictEqual(disabled.instance.data.isFixed, false, 'disabled only cancels sticky positioning');
assert.strictEqual(JSON.stringify(disabled.events), JSON.stringify([{ name: 'scroll', detail: { scrollTop: 0, isFixed: false } }]));

const wxml = fs.readFileSync(path.join(root, 'sticky/sticky.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'sticky/sticky.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'sticky/sticky.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');

assert.deepStrictEqual(Object.keys(json.usingComponents), []);
assert(wxml.includes('<slot></slot>'));
assert(!wxml.includes('slot="'));
assert(!wxml.includes('customClass'));
assert(!wxml.includes('customStyle'));
assert(!/transition\s*:[^;]*\bheight\s*:\s*auto/.test(wxss));
assert(!wxss.includes('display: none'));
assert(!/\b(?:[4-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));

assert.deepStrictEqual(metadata.apiProps.sticky, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents.sticky.map((event) => event.name), ['scroll']);
assert.deepStrictEqual(metadata.apiSlots.sticky.map((slot) => slot.name), ['default']);
assert.strictEqual(metadata.apiMethods.sticky, undefined);

const previewShowcase = preview.slice(preview.indexOf('function stickyPreviewConfig'), preview.indexOf('function watermarkPreviewConfig'));
['cellSample({', 'data-sticky-preview', 'sticky-preview__content', "rows('页面内容', 50)", "padStart(2, '0')"]
  .forEach((token) => assert(previewShowcase.includes(token), `Sticky preview must contain ${token}`));
['<h3>', 'pui-showcase-section', "makePreview('offset'", "makePreview('bounded'", "makePreview('disabled'"]
  .forEach((token) => assert(!previewShowcase.includes(token), `Sticky preview must not duplicate ${token}`));
assert(!previewShowcase.includes('buttonSample({'), 'Sticky showcase must not invent control buttons');
assert(!previewShowcase.includes('advanced-event'));
assert(previewShowcase.includes('Math.max(0, Math.min(12000, Math.round(rawZIndex)))'), 'H5 must preserve the public zIndex=0 boundary');
assert(preview.includes("zIndex: { type: 'range', value: 99, min: 0, max: 12000, step: 1 }"), 'Props panel must allow zIndex=0');
assert(previewStyles.includes('.sticky-preview__header {\n  position: sticky;'));
assert(previewStyles.includes('.sticky-preview.is-disabled .sticky-preview__header'));
assert(/\.sticky-preview \{[\s\S]*width: 100%;[\s\S]*height: 100%;[\s\S]*min-height: 0;/.test(previewStyles), 'Sticky basic preview must fill the available PreviewDevice area');
assert(/\.sticky-preview \{[\s\S]*border: 0;[\s\S]*box-shadow: none;/.test(previewStyles), 'Edge-to-edge Sticky preview must not add a nested card surface');
assert(/\.sticky-preview \{[\s\S]*scrollbar-width: none;/.test(previewStyles) && /\.sticky-preview::\-webkit-scrollbar \{[\s\S]*width: 0;[\s\S]*height: 0;/.test(previewStyles), 'Sticky local scrollbar must not reserve an asymmetric right gutter');
assert(/\.sticky-preview__content \{[\s\S]*padding-block: var\(--pui-preview-device-padding\);/.test(previewStyles), 'Sticky scroll content must retain shared top and bottom breathing room');
assert(/\.sticky-preview__header \{[\s\S]*box-shadow: var\(--shadow-soft\);/.test(previewStyles), 'Sticky header must express its elevated layer with the shared shadow token');
assert(/\.sticky-preview__content > \.pui-cell,[\s\S]*\.sticky-preview__boundary > \.pui-cell \{[\s\S]*margin: 0;[\s\S]*border-radius: 0;/.test(previewStyles), 'Sticky body Cells must form one continuous list without gaps');

const resetBranch = preview.slice(preview.indexOf("if (id === 'sticky' &&"), preview.indexOf("if (id === 'watermark'", preview.indexOf("if (id === 'sticky' &&")));
['container', 'disabled', 'offsetTop', 'zIndex'].forEach((key) => assert(resetBranch.includes(`'${key}'`)));
['scrollTarget', 'customContent', 'stickyAnimationFrame'].forEach((legacy) => assert(!resetBranch.includes(legacy)));

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'sticky')"), preview.indexOf("if (runtimeId === 'watermark')"));
assert(!usageSource.includes('bind:'), 'Sticky basic WXML must contain no event bindings');
assert(usageSource.includes('container="{{stickyContainer}}"'), 'container code must express a page.js function binding');
assert(usageSource.includes('Math.max(0, Math.min(12000, Math.round(Number(props.zIndex))))'), 'Generated WXML must preserve zIndex=0');
assert(!usageSource.includes('customContent'));

const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Sticky 页面吸顶"'), exampleWxml.indexOf('<pui-card title="Watermark'));
assert(exampleSection.includes('<pui-sticky'));
assert(!exampleSection.includes('bind:'), 'Sticky example basic usage must contain no Sticky event bindings');
['refreshSticky', 'readStickyState', 'toggleStickyBoundary', 'toggleStickyContent', 'toggleStickyFullWidth', 'toggleStickySafeArea', 'onStickyReady', 'onStickyError']
  .forEach((name) => assert(!exampleJs.includes(name), `${name} must not remain in the example`));

const apiSection = api.slice(api.indexOf('## Sticky 粘性布局'), api.indexOf('## Watermark 水印'));
assert(apiSection.includes('`container` | `() => NodesRef \\| null`'));
assert(apiSection.includes('Sticky 不公开实例方法'));
['customContent', 'content` 命名 slot', 'ready/scroll/change'].forEach((legacy) => assert(!apiSection.includes(legacy)));
assert(/\d+\. Sticky 的 H5 镜像必须与原生共享 `container\/disabled\/offsetTop\/zIndex`/.test(compatibility));
assert(alignment.includes('## 43. Sticky 对照摘要'));
assert(fs.existsSync(path.join(root, 'docs/components/STICKY.md')));

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `sticky/sticky.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/sticky/sticky.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `Sticky source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/sticky/sticky.${extension}`);
  assert(fs.existsSync(installedFile), `Sticky example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `Sticky source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/sticky/sticky.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `Sticky source/WeChat npm ${extension} must stay identical`);
});

console.log('Sticky contract tests passed.');
