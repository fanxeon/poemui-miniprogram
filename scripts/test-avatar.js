const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('avatar/avatar.js');
let definition = null;
let timerId = 0;
const timers = new Map();
vm.runInNewContext(source, {
  console,
  require: () => ({}),
  Component(value) { definition = value; },
  setTimeout(callback, delay) { timerId += 1; timers.set(timerId, { callback, delay }); return timerId; },
  clearTimeout(id) { timers.delete(id); },
}, { filename: 'avatar/avatar.js' });

assert(definition, 'Avatar component definition must be registered');
assert.deepStrictEqual(
  Object.keys(definition.properties),
  ['src', 'text', 'alt', 'icon', 'shape', 'size', 'bordered', 'hideOnLoadFailed', 'useSlot', 'ariaLabel', 'reduceMotion'],
  'Avatar publishes the focused 11-Prop display contract',
);
assert.strictEqual(definition.methods.onTap, undefined, 'Avatar owns no tap handler');
assert(!source.includes("triggerEvent('click'"), 'Avatar publishes no click event');
assert(!source.includes("triggerEvent('load'"), 'Avatar keeps load as internal rendering state');
['image', 'clickable', 'disabled', 'duration', 'easing'].forEach((legacy) => {
  assert(!new RegExp(`^\\s{4}${legacy}:`, 'm').test(source), `Avatar source removes legacy ${legacy} property`);
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

const fallback = create({ text: ' poemUI ', alt: '替代', size: 'large', shape: 'square', bordered: true });
assert.strictEqual(fallback.instance.data.fallbackText, 'P');
assert.strictEqual(fallback.instance.data.displaySrc, '');
assert.strictEqual(fallback.instance.data.iconSize, 46);
assert(fallback.instance.data.rootClass.includes('pui-avatar--large'));
assert(fallback.instance.data.rootClass.includes('pui-avatar--square'));
assert(fallback.instance.data.rootClass.includes('pui-avatar--bordered'));
assert.strictEqual(fallback.instance.data.semanticLabel, '替代');

const normalized = create({ size: 'huge', shape: 'pill', text: '', alt: '', icon: 'profile', reduceMotion: true });
assert(normalized.instance.data.rootClass.includes('pui-avatar--medium'));
assert(normalized.instance.data.rootClass.includes('pui-avatar--circle'));
assert.strictEqual(normalized.instance.data.fallbackText, '?');
assert.strictEqual(normalized.instance.data.semanticLabel, 'profile');
assert.strictEqual(normalized.instance.data.motionDuration, 1);
assert(normalized.instance.data.rootStyle.includes('--pui-avatar-duration:1ms'));

const loaded = create({ src: '/avatar.png' });
loaded.instance.onImageLoad({ detail: { width: 40 } });
assert.strictEqual(loaded.instance.data.imageLoaded, true);
assert.deepStrictEqual(loaded.events, [], 'load does not expand the public event surface');

const failed = create({ src: '/missing.png', text: 'F' });
failed.instance.onImageError({ detail: { errMsg: 'fail' } });
assert.strictEqual(failed.instance.data.imageFailed, true);
assert.strictEqual(failed.instance.data.visible, true);
assert.deepStrictEqual(failed.events.map((item) => item.name), ['error']);
assert.strictEqual(failed.events[0].detail.src, '/missing.png');

const hidden = create({ src: '/missing.png', hideOnLoadFailed: true });
hidden.instance.onImageError({ detail: {} });
assert(hidden.instance.data.rootClass.includes('pui-avatar--leaving'));
const pending = [...timers.values()].at(-1);
assert.strictEqual(pending.delay, 500);
pending.callback();
assert.strictEqual(hidden.instance.data.visible, false, 'failed avatar unmounts only after the leave duration');

const reducedHidden = create({ src: '/missing.png', hideOnLoadFailed: true, reduceMotion: true });
reducedHidden.instance.onImageError({ detail: {} });
assert.strictEqual([...timers.values()].at(-1).delay, 1);

const wxml = read('avatar/avatar.wxml');
const wxss = read('avatar/avatar.wxss');
assert(!/bindtap=/.test(wxml));
assert(wxml.includes('role="img"'));
assert(wxml.includes('bindload="onImageLoad"'));
assert(wxml.includes('binderror="onImageError"'));
assert(wxml.includes('<slot />'));
assert(!wxss.includes('pui-avatar--interactive'));
assert(!wxss.includes('pui-avatar--disabled'));
assert(wxss.includes('box-shadow: none'), 'Avatar display leaf must not create an outer visual shadow');
assert(wxss.includes('border: 2rpx solid var(--pui-border-color)'), 'Avatar bordered state follows the shared border token');

const metadata = require(path.join(root, 'metadata/components.js'));
assert.deepStrictEqual(metadata.apiProps.avatar, ['src', 'text', 'alt', 'icon', 'shape', 'size', 'bordered', 'hideOnLoadFailed', 'useSlot', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiEvents.avatar.map((item) => item.name), ['error']);
assert.deepStrictEqual(metadata.apiSlots.avatar.map((item) => item.name), ['default']);
const shadcn = require(path.join(root, 'metadata/shadcn.js'));
assert.strictEqual(shadcn.shadcnComponents.find((item) => item.poem === 'avatar').trigger, 'none');

const preview = read('preview/app.js');
['基础用法', '图片与回退', '尺寸与形状', '组合用法'].forEach((title) => assert(preview.includes(title)));
assert(preview.includes("['badge', 'avatar', 'image', 'tag', 'grid', 'count-down'].includes(runtimeId)"), 'Avatar WXML generation uses source defaults');
assert(preview.includes("demoAction: 'avatar-host-click'"), 'Avatar interaction is demonstrated through a host PUI Button');
assert(preview.includes("label.textContent = '资料已打开'"), 'host Button exposes a visible real interaction result');
assert(!preview.includes("type === 'avatar-click'"));
const avatarPreview = preview.slice(preview.indexOf('function avatarPreviewDuration'), preview.indexOf('function imageShowcase'));
assert(!/<button\b/.test(avatarPreview), 'Avatar node itself is never a button');
assert(!avatarPreview.includes('props.image'));
assert(!avatarPreview.includes('props.clickable'));
assert(!avatarPreview.includes('props.disabled'));
assert(read('preview/styles.css').includes('.pui-avatar-demo[hidden] { display: none; }'), 'H5 hides the Avatar only after the leave timer completes');
assert(read('docs/components/AVATAR.md').includes('不得给它增加外投影'), 'Avatar contract locks the display-leaf shadow boundary');

const example = read('_example/miniprogram/pages/components/index.wxml');
const exampleTags = example.match(/<pui-avatar\b[^>]*>/g) || [];
assert(exampleTags.some((tag) => tag.includes('bind:error=')), 'example keeps a real image error case');
assert(!exampleTags.some((tag) => tag.includes('bind:click=') || tag.includes('bind:load=')), 'example removes Avatar click/load teaching');

assert(read('docs/components/AVATAR.md').includes('TDesign 1.15.3 对照决定'));
assert(read('docs/components/README.md').includes('[Avatar](./AVATAR.md)'));

process.stdout.write('Avatar contract tests passed.\n');
