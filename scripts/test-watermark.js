const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'watermark/watermark.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;

vm.runInNewContext(source, {
  Array,
  Boolean,
  Math,
  Number,
  String,
  clearTimeout() {},
  setTimeout() { return 1; },
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }) };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  wx: { getWindowInfo() { return { windowWidth: 375, windowHeight: 667 }; } },
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'Watermark component definition must be registered');

const PUBLIC_PROPS = ['alpha', 'content', 'height', 'isRepeat', 'layout', 'lineSpace', 'movable', 'moveInterval', 'offset', 'rotate', 'watermarkContent', 'width', 'x', 'y', 'zIndex', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Watermark only exposes the reviewed TDesign-shaped props plus PoemUI accessibility/motion fields');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => {
    const value = definition.properties[key].value;
    defaults[key] = typeof value === 'function' ? value() : value;
  });
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return `pui-theme--${this.data.colorScheme}`; },
    createSelectorQuery() {
      const query = {
        select() { return query; },
        boundingClientRect() { return query; },
        exec(callback) { callback([{ width: 300, height: 200 }]); },
      };
      return query;
    },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent() { throw new Error('Watermark must not expose component events'); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

const empty = create();
assert.deepStrictEqual(JSON.parse(JSON.stringify(empty.data.marks)), [], 'missing watermarkContent must keep only protected content, not fabricate an empty state');
assert(empty.data.rootStyle.includes('--pui-watermark-duration:500ms'));

const repeated = create({
  watermarkContent: [{ text: '内部资料', fontColor: '#71717a', fontSize: 24, fontWeight: 'bold' }],
  width: 240,
  height: 160,
  x: 24,
  y: 24,
  offset: [0, 0],
});
assert(repeated.data.marks.length > 1, 'repeated content must use measured root dimensions instead of a fixed grid');
assert(repeated.data.marks.every((mark) => mark.items.length === 1 && mark.items[0].kind === 'text'));
assert(repeated.data.marks[0].items[0].style.includes('font-weight:bold'));
assert(!repeated.data.marks[0].items[0].style.includes('undefined'));

const single = create({ watermarkContent: { text: '单枚' }, isRepeat: false, offset: [0, 0] });
assert.strictEqual(single.data.marks.length, 1, 'isRepeat=false must render one real mark');
assert(single.data.marks[0].style.includes('left:300rpx;top:200rpx;'), '0 offsets must remain valid and center the single mark');

const hexagonal = create({ watermarkContent: { text: '六边形' }, layout: 'hexagonal', offset: [0, 0] });
assert(hexagonal.data.marks.length > 2);
assert.notStrictEqual(hexagonal.data.marks[0].style, hexagonal.data.marks[1].style, 'hexagonal layout must generate independent positions');

const image = create({ watermarkContent: [{ url: '/assets/brand.png', isGrayscale: true }] });
assert.strictEqual(image.data.marks[0].items[0].kind, 'image');
assert.strictEqual(image.data.marks[0].items[0].grayscale, true);

const moving = create({ watermarkContent: { text: '移动' }, movable: true, moveInterval: 400 });
assert.strictEqual(moving.watermarkConfig().movable, true);
assert.strictEqual(moving.watermarkConfig().moveInterval, 400);
assert.strictEqual(moving._moveTimer, 1, 'movable mode must schedule a real next position update');

const reduced = create({ watermarkContent: { text: '低动效' }, movable: true, reduceMotion: true });
assert.strictEqual(reduced.watermarkConfig().movable, false, 'reduceMotion must stop movable updates');
assert(reduced.data.rootStyle.includes('--pui-watermark-duration:1ms'));
assert(reduced.data.rootClass.includes('pui-watermark--reduced-motion'));

assert(!source.includes('triggerEvent('), 'Watermark must not fabricate events');
['text', 'image', 'repeat', 'disabled', 'fullscreen', 'maxMarks', 'duration', 'easing', 'removable'].forEach((legacy) => assert(!definition.properties[legacy], `${legacy} must not return as a public Watermark prop`));
assert(!Object.prototype.hasOwnProperty.call(definition.methods, 'refresh'));
assert(!Object.prototype.hasOwnProperty.call(definition.methods, 'getState'));

const wxml = fs.readFileSync(path.join(root, 'watermark/watermark.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'watermark/watermark.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'watermark/watermark.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/WATERMARK.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');

assert.deepStrictEqual(Object.keys(json.usingComponents), []);
assert(wxml.includes('<slot name="content"></slot>') && wxml.includes('<slot></slot>'));
assert(wxml.includes('aria-hidden="true"'));
assert(!/bindload|binderror|bind:|data-state/.test(wxml));
assert(!/text-overflow|ellipsis|white-space:\s*nowrap|display\s*:\s*none|height\s*:\s*auto[^;]*transition/.test(wxss));
assert(wxss.includes('pointer-events: none'));
assert(wxss.includes('--pui-watermark-line-space: var(--pui-space-step-8);'));
assert(wxss.includes('gap: var(--pui-watermark-line-space);'));
assert(wxss.includes('transition: left var(--pui-watermark-duration, 500ms)'));

assert.deepStrictEqual(metadata.apiProps.watermark, PUBLIC_PROPS);
assert.strictEqual(metadata.apiEvents.watermark, undefined);
assert.deepStrictEqual(metadata.apiSlots.watermark.map((slot) => slot.name), ['content', 'default']);
assert.strictEqual(metadata.apiMethods.watermark, undefined);

const usage = preview.slice(preview.indexOf("if (runtimeId === 'watermark')"), preview.indexOf("if (runtimeId === 'popup')", preview.indexOf("if (runtimeId === 'watermark')")));
const showcase = preview.slice(preview.indexOf('function watermarkPreviewSegments'), preview.indexOf('function tokenPreview'));
assert(usage.includes('<pui-watermark${attrs ? ` ${attrs}` : \'\'}>'));
assert(!usage.includes('bind:'), 'Watermark basic WXML must stay bind-free');
assert(showcase.includes('function bindWatermarkPreviewRuntime(props)'));
assert(showcase.includes('ResizeObserver'));
assert(showcase.includes('function appendWatermarkPreviewMark'));
assert(showcase.includes('const halfValue = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) / 2 : fallback;'), 'H5 preview must preserve zero offsets instead of falling back');
assert(showcase.includes("['rectangular', 'hexagonal']"));
assert(showcase.includes('movable: !!props.movable && !reduceMotion'));
assert(showcase.includes("demoAction: 'watermark-toggle-repeat'"), 'current Watermark preview must retain a real Slot action that rewrites the parent prop');
assert(preview.includes("type === 'watermark-toggle-repeat'"));
assert(preview.includes("Watermark 没有公开 Events 或 Methods。水印层固定不接管指针"), 'H5 compatibility notes must not imply Watermark has generic component events');
assert(!/watermark-refresh|watermark-get-state|watermark-content-action|watermarkEvent|watermarkSnapshot/.test(showcase));
assert(styles.includes('.watermark-preview__layer {') && styles.includes('pointer-events: none'));
assert(styles.includes('line-height: var(--pui-line-height-body-small);'));
assert(!styles.includes('.watermark-showcase__methods'));

const apiSection = api.slice(api.indexOf('## Watermark 水印'), api.indexOf('## Swiper 轮播图'));
assert(apiSection.includes('Watermark 没有 Events 或公开 Methods。'));
assert(apiSection.includes('`watermarkContent`'));
assert(!/`text` \||`image` \||`disabled` \||`fullscreen` \||`maxMarks` \||`refresh\(/.test(apiSection));
assert(/\d+\. Watermark 的 H5 镜像必须与原生共享 `alpha\/content\/height\/isRepeat\/layout\/lineSpace\/movable\/moveInterval\/offset\/rotate\/watermarkContent\/width\/x\/y\/zIndex\/ariaLabel\/reduceMotion`/.test(compatibility));
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contractIndex.includes('[Watermark](./WATERMARK.md)'));
const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Watermark'), exampleWxml.indexOf('<pui-card title="Sheet'));
assert(exampleSection.includes('<pui-watermark') && !exampleSection.includes('bind:'));
['refreshWatermark', 'readWatermarkState', 'toggleWatermarkDisabled', 'onWatermarkReady', 'onWatermarkImageError'].forEach((name) => assert(!exampleJs.includes(name), `${name} must not remain in the Watermark example`));

if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    assert.strictEqual(
      fs.readFileSync(path.join(root, 'miniprogram_dist/watermark', `watermark.${extension}`), 'utf8'),
      fs.readFileSync(path.join(root, 'watermark', `watermark.${extension}`), 'utf8'),
      `dist Watermark ${extension} must match source`,
    );
  });
}

console.log('Watermark contract tests passed.');
