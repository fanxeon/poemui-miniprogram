const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('image/image.js');
let definition = null;
vm.runInNewContext(source, {
  console,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'image/image.js' });

assert(definition, 'Image component definition must be registered');
assert.deepStrictEqual(
  Object.keys(definition.properties),
  ['src', 'mode', 'width', 'height', 'shape', 'lazy', 'webp', 'loading', 'error', 'text', 'showMenuByLongpress', 'showSlot', 'ariaLabel', 'reduceMotion'],
  'Image publishes the focused 14-Prop resource contract',
);
assert.strictEqual(definition.methods.onTap, undefined, 'Image owns no tap handler');
assert(!source.includes("triggerEvent('click'"), 'Image publishes no click event');
['clickable', 'disabled', 'duration', 'easing'].forEach((legacy) => {
  assert(!new RegExp(`^\\s{4}${legacy}:`, 'm').test(source), `Image source removes legacy ${legacy} property`);
});

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  instance.syncState();
  return { instance, events };
}

const empty = create({ src: '', width: '0px', height: '0%', text: '', ariaLabel: '' });
assert.strictEqual(empty.instance.data.status, 'empty');
assert.strictEqual(empty.instance.data.shouldRenderImage, false);
assert(empty.instance.data.rootStyle.includes('width:0px;'));
assert(empty.instance.data.rootStyle.includes('height:0%;'));
assert.strictEqual(empty.instance.data.semanticLabel, '图片');

const normalized = create({ src: '/cover.png', mode: 'invalid', shape: 'pill', width: 'calc(100%)', height: '-1px', reduceMotion: true });
assert.strictEqual(normalized.instance.data.status, 'loading');
assert.strictEqual(normalized.instance.data.resolvedMode, 'aspectFill');
assert(normalized.instance.data.rootClass.includes('pui-image--rectangle'));
assert(!normalized.instance.data.rootStyle.includes('calc('));
assert(!normalized.instance.data.rootStyle.includes('-1px'));
assert(normalized.instance.data.rootStyle.includes('--pui-image-duration:1ms'));

const directional = create({ src: '/cover.png', mode: 'top right', shape: 'circle', width: '12.5rpx', height: '100%' });
assert.strictEqual(directional.instance.data.resolvedMode, 'top right');
assert(directional.instance.data.rootClass.includes('pui-image--circle'));
assert(directional.instance.data.rootStyle.includes('width:12.5rpx;'));

const loaded = create({ src: '/cover.png' });
loaded.instance.onLoad({ detail: { width: 320, height: 180 } });
assert.strictEqual(loaded.instance.data.status, 'loaded');
assert.strictEqual(loaded.instance.data.imageLoaded, true);
assert.deepStrictEqual(loaded.events.map((item) => item.name), ['load']);
assert.strictEqual(loaded.events[0].detail.src, '/cover.png');

const externallyLoading = create({ src: '/cover.png', loading: true });
externallyLoading.instance.onLoad({ detail: {} });
assert.strictEqual(externallyLoading.instance.data.status, 'loading', 'external loading wins over a completed resource');
externallyLoading.instance.data.loading = false;
externallyLoading.instance.syncState();
assert.strictEqual(externallyLoading.instance.data.status, 'loaded', 'releasing external loading reveals the completed resource');

const externallyErrored = create({ src: '/cover.png', error: true });
assert.strictEqual(externallyErrored.instance.data.status, 'error');
assert.strictEqual(externallyErrored.instance.data.shouldRenderImage, false);
externallyErrored.instance.data.error = false;
externallyErrored.instance.syncState();
assert.strictEqual(externallyErrored.instance.data.status, 'loading', 'releasing external error retries the current source');
assert.strictEqual(externallyErrored.instance.data.shouldRenderImage, true);

const failed = create({ src: '/missing.png', text: '失败' });
failed.instance.onError({ detail: { errMsg: 'fail' } });
assert.strictEqual(failed.instance.data.status, 'error');
assert.strictEqual(failed.instance.data.shouldRenderImage, false);
assert.deepStrictEqual(failed.events.map((item) => item.name), ['error']);
assert.strictEqual(failed.events[0].detail.src, '/missing.png');
failed.instance.data.src = '/next.png';
failed.instance.syncState();
assert.strictEqual(failed.instance.data.status, 'loading');
assert.strictEqual(failed.instance.data.displaySrc, '/next.png');

const wxml = read('image/image.wxml');
const wxss = read('image/image.wxss');
const json = JSON.parse(read('image/image.json'));
assert(!/bindtap=|catchtap=/.test(wxml), 'Image and its overlay do not synthesize click behavior');
assert(wxml.includes('role="img"'));
assert(wxml.includes('webp="{{webp}}"'));
assert(wxml.includes('lazy-load="{{lazy}}"'));
assert(wxml.includes('show-menu-by-longpress="{{showMenuByLongpress}}"'));
assert(wxml.includes('<pui-loading'));
assert(wxml.includes('<slot />'));
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert(!wxss.includes('pui-image--interactive'));
assert(!wxss.includes('pui-image--disabled'));
assert(!wxss.includes('box-shadow:'), 'Image is a media leaf and must not receive an outer shadow from the global appearance switch');
assert(wxss.includes('border: 2rpx solid var(--pui-border-color)'));
assert(wxss.includes('var(--pui-ease-standard)'));

const metadata = require(path.join(root, 'metadata/components.js'));
assert.deepStrictEqual(metadata.apiProps.image, ['src', 'mode', 'width', 'height', 'shape', 'lazy', 'webp', 'loading', 'error', 'text', 'showMenuByLongpress', 'showSlot', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiEvents.image.map((item) => item.name), ['load', 'error']);
assert.deepStrictEqual(metadata.apiSlots.image.map((item) => item.name), ['default']);

const preview = read('preview/app.js');
['基础用法', '加载与失败', '裁切模式', '形状与覆盖内容'].forEach((title) => assert(preview.includes(title)));
const imageCodeExamples = preview.slice(preview.indexOf('function imagePreviewCodeExamples'), preview.indexOf('function previewCodeSectionSources'));
assert(imageCodeExamples.includes('makeUsageCode(detail,'), 'Image examples must reuse the canonical WXML generator');
assert(imageCodeExamples.includes("value: 'image-states'"), 'Image code document includes the real state showcase example');
assert(imageCodeExamples.includes("value: 'image-crop'"), 'Image code document includes the real crop showcase example');
assert(imageCodeExamples.includes("value: 'image-overlay'"), 'Image code document includes the real overlay showcase example');
assert(imageCodeExamples.includes("src: '{{brokenCoverUrl}}'"), 'Image failure example keeps a parent-supplied real failing resource instead of a fake event');
assert(!imageCodeExamples.includes('bind:error'), 'Image basic and showcase code examples keep events in API rather than binding them mechanically');
assert(preview.includes("(sources.examples || []).map((section) => previewCodeBlockSample(section, detail, sources[section.value])).join('')"), 'Image showcase code sections render through the shared copyable code block helper');
assert(preview.includes("['badge', 'avatar', 'image', 'tag', 'grid', 'count-down'].includes(runtimeId)"), 'Image WXML generation uses source defaults');
assert(preview.includes("demoAction: 'image-host-click'"), 'Image interaction is demonstrated through a host PUI Button');
assert(preview.includes("label.textContent = '原图已打开'"), 'host Button exposes a visible real interaction result');
assert(preview.includes("['avatar', 'image', 'tag', 'grid'].includes(previewId)"), 'reset restores the true Image source defaults');
const emptyWxml = read('empty/empty.wxml');
['clickable=', 'duration=', 'easing='].forEach((legacy) => assert(!emptyWxml.includes(legacy), `Empty no longer passes removed Image ${legacy}`));
assert(!preview.includes("type === 'image-click'"));
const imageHelpers = preview.slice(preview.indexOf('function imagePreviewSource'), preview.indexOf('function alertMotionDuration'));
const imagePreview = preview.slice(preview.indexOf('function imageNode'), preview.indexOf('function previewGridItems'));
assert(!/<button\b/.test(imagePreview), 'Image node itself is never a button');
assert(!imagePreview.includes('props.clickable'));
assert(!imagePreview.includes('props.disabled'));
assert(imagePreview.includes("loading=\"${props.lazy ? 'lazy' : 'eager'}\""), 'H5 maps lazy to the native img loading attribute');
assert(imagePreview.includes('function bindImagePreviewRuntime'), 'H5 Image registers a real resource lifecycle runtime');
assert(imagePreview.includes("image.addEventListener('load'"), 'H5 Image listens for native img load');
assert(imagePreview.includes("image.addEventListener('error'"), 'H5 Image listens for native img error');
assert(imagePreview.includes('setImagePreviewResourceState(host, visibleState)'), 'external loading/error only override the real resource result');
assert(imagePreview.includes("node.hidden = state === 'loaded'"), 'loaded Image hides the state layer instead of leaving a fake loading label');
assert(preview.includes("if (id === 'image') {\n    bindImagePreviewRuntime(props);"), 'Image runtime is wired into the preview lifecycle');
assert(!imageHelpers.includes('props.duration'));
assert(!imageHelpers.includes('props.easing'));
assert(imageHelpers.includes('props.reduceMotion ? 1 : 500'));
const previewCss = read('preview/styles.css');
assert(previewCss.includes('.pui-image-demo__state[hidden] { display: none; }'));
assert(previewCss.includes('.pui-image-demo__state [data-image-state-error] { color: var(--danger); }'));
assert(previewCss.includes('box-shadow: var(--shadow-soft)'));

const example = read('_example/miniprogram/pages/components/index.wxml');
const exampleTags = example.match(/<pui-image\b[^>]*>/g) || [];
assert(exampleTags.some((tag) => tag.includes('bind:error=')), 'example keeps a real image error case');
assert(!exampleTags.some((tag) => tag.includes('bind:click=')), 'example removes Image click teaching');

assert(read('docs/components/IMAGE.md').includes('TDesign 1.15.3 对照决定'));
assert(read('docs/components/README.md').includes('[Image](./IMAGE.md)'));

process.stdout.write('Image contract tests passed.\n');
