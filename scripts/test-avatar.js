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
  ['src', 'text', 'alt', 'icon', 'shape', 'size', 'bordered', 'hideOnLoadFailed', 'lazy', 'loading', 'useSlot', 'ariaLabel', 'reduceMotion'],
  'Avatar publishes the focused 13-Prop display contract',
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
assert.strictEqual(loaded.instance.data.showLoading, true);
loaded.instance.onImageLoad({ currentTarget: { dataset: { src: '/avatar.png' } }, detail: { width: 40 } });
assert.strictEqual(loaded.instance.data.imageLoaded, true);
assert.strictEqual(loaded.instance.data.showLoading, false);
assert.deepStrictEqual(loaded.events, [], 'load does not expand the public event surface');
loaded.instance.data.shape = 'round';
loaded.instance.syncState();
assert.strictEqual(loaded.instance.data.imageLoaded, true, 'appearance changes preserve the loaded resource');
assert.strictEqual(loaded.instance.data.showLoading, false, 'appearance changes do not restart internal loading');

const forcedLoading = create({ loading: true, text: 'L' });
assert.strictEqual(forcedLoading.instance.data.showLoading, true, 'loading=true keeps the internal PUI Loading without an external Spinner');
assert.strictEqual(forcedLoading.instance.data.visible, true);
forcedLoading.instance.data.loading = false;
forcedLoading.instance.syncState();
assert.strictEqual(forcedLoading.instance.data.showLoading, false, 'releasing forced loading returns to the real resource state');

const loadedWhileForced = create({ src: '/avatar.png', loading: true });
loadedWhileForced.instance.onImageLoad({ currentTarget: { dataset: { src: '/avatar.png' } }, detail: {} });
assert.strictEqual(loadedWhileForced.instance.data.imageLoaded, true);
assert.strictEqual(loadedWhileForced.instance.data.showLoading, true, 'a completed resource stays covered while loading is forced');
loadedWhileForced.instance.data.loading = false;
loadedWhileForced.instance.syncState();
assert.strictEqual(loadedWhileForced.instance.data.showLoading, false);

const stale = create({ src: '/current.png' });
stale.instance.onImageLoad({ currentTarget: { dataset: { src: '/old.png' } }, detail: {} });
assert.strictEqual(stale.instance.data.imageLoaded, false, 'stale image load events do not commit a replaced source');
assert.strictEqual(stale.instance.data.showLoading, true);

const failed = create({ src: '/missing.png', text: 'F' });
failed.instance.onImageError({ currentTarget: { dataset: { src: '/missing.png' } }, detail: { errMsg: 'fail' } });
assert.strictEqual(failed.instance.data.imageFailed, true);
assert.strictEqual(failed.instance.data.showLoading, false);
assert.strictEqual(failed.instance.data.visible, true);
assert.deepStrictEqual(failed.events.map((item) => item.name), ['error']);
assert.strictEqual(failed.events[0].detail.src, '/missing.png');

const hidden = create({ src: '/missing.png', hideOnLoadFailed: true });
hidden.instance.onImageError({ currentTarget: { dataset: { src: '/missing.png' } }, detail: {} });
assert(hidden.instance.data.rootClass.includes('pui-avatar--leaving'));
assert.strictEqual(hidden.instance.data.showLoading, false);
const pending = [...timers.values()].at(-1);
assert.strictEqual(pending.delay, 500);
pending.callback();
assert.strictEqual(hidden.instance.data.visible, false, 'failed avatar unmounts only after the leave duration');

const reducedHidden = create({ src: '/missing.png', hideOnLoadFailed: true, reduceMotion: true });
reducedHidden.instance.onImageError({ currentTarget: { dataset: { src: '/missing.png' } }, detail: {} });
assert.strictEqual([...timers.values()].at(-1).delay, 1);

hidden.instance.data.src = '/replacement.png';
hidden.instance.syncState();
assert.strictEqual(hidden.instance.data.visible, true, 'changing src remounts a previously hidden Avatar');
assert.strictEqual(hidden.instance.data.imageFailed, false);
assert.strictEqual(hidden.instance.data.showLoading, true);

const wxml = read('avatar/avatar.wxml');
const wxss = read('avatar/avatar.wxss');
assert(!/bindtap=/.test(wxml));
assert(wxml.includes('role="img"'));
assert(wxml.includes('bindload="onImageLoad"'));
assert(wxml.includes('binderror="onImageError"'));
assert(wxml.includes('lazy-load="{{lazy}}"'));
assert(wxml.includes('data-src="{{displaySrc}}"'));
assert(wxml.includes('aria-busy="{{showLoading}}"'));
assert(wxml.includes('<pui-loading'));
assert(wxml.includes('<slot />'));
assert(!wxss.includes('pui-avatar--interactive'));
assert(!wxss.includes('pui-avatar--disabled'));
assert(wxss.includes('box-shadow: none'), 'Avatar display leaf must not create an outer visual shadow');
assert(wxss.includes('border: 2rpx solid var(--pui-border-color)'), 'Avatar bordered state follows the shared border token');

const metadata = require(path.join(root, 'metadata/components.js'));
assert.deepStrictEqual(metadata.apiProps.avatar, ['src', 'text', 'alt', 'icon', 'shape', 'size', 'bordered', 'hideOnLoadFailed', 'lazy', 'loading', 'useSlot', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiEvents.avatar.map((item) => item.name), ['error']);
assert.deepStrictEqual(metadata.apiSlots.avatar.map((item) => item.name), ['default']);
const shadcn = require(path.join(root, 'metadata/shadcn.js'));
assert.strictEqual(shadcn.shadcnComponents.find((item) => item.poem === 'avatar').trigger, 'none');

const preview = read('preview/app.js');
['基础用法', '懒加载、图片与回退', '尺寸与形状', '组合用法'].forEach((title) => assert(preview.includes(title)));
assert(preview.includes("['badge', 'avatar', 'image', 'tag', 'grid', 'count-down'].includes(runtimeId)"), 'Avatar WXML generation uses source defaults');
assert(preview.includes("demoAction: 'avatar-host-click'"), 'Avatar interaction is demonstrated through a host PUI Button');
assert(preview.includes("label.textContent = '资料已打开'"), 'host Button exposes a visible real interaction result');
assert(!preview.includes("type === 'avatar-click'"));
const avatarPreview = preview.slice(preview.indexOf('function avatarPreviewDuration'), preview.indexOf('function imageNode'));
assert(!/<button\b/.test(avatarPreview), 'Avatar node itself is never a button');
assert(!avatarPreview.includes('props.image'));
assert(!avatarPreview.includes('props.clickable'));
assert(!avatarPreview.includes('props.disabled'));
assert(avatarPreview.includes('const forcedLoading = !!props.loading'), 'H5 supports a persistent internal Avatar loading state');
assert(avatarPreview.includes('data-avatar-forced-loading'), 'H5 keeps forced loading inside the Avatar host');
assert(avatarPreview.includes('loading="${lazy ? \'lazy\' : \'eager\'}"'), 'H5 mirrors native lazy-load through the img loading attribute');
assert(avatarPreview.includes('function bindAvatarPreviewRuntime'), 'H5 binds real img load/error runtime');
assert(avatarPreview.includes("setAvatarPreviewResourceState(host, 'loading')"), 'H5 starts the internal loading state for a real src');
assert(avatarPreview.includes("setAvatarPreviewResourceState(host, 'loaded')"), 'H5 commits a real loaded state');
assert(avatarPreview.includes("setAvatarPreviewResourceState(host, 'error')"), 'H5 commits a real error fallback');
assert(preview.includes("if (previewIdFor(id) === 'avatar')"), 'Avatar alias routes share the same complete API descriptions');
assert(read('preview/styles.css').includes('.pui-avatar-demo[hidden] { display: none; }'), 'H5 hides the Avatar only after the leave timer completes');
assert(read('preview/styles.css').includes('.pui-avatar-demo__loading[hidden] { display: none; }'), 'H5 removes the internal loading overlay after resource settlement');
assert(read('docs/components/AVATAR.md').includes('不得给它增加外投影'), 'Avatar contract locks the display-leaf shadow boundary');

const example = read('_example/miniprogram/pages/components/index.wxml');
const exampleTags = example.match(/<pui-avatar\b[^>]*>/g) || [];
assert(exampleTags.some((tag) => tag.includes('bind:error=')), 'example keeps a real image error case');
assert(!exampleTags.some((tag) => tag.includes('bind:click=') || tag.includes('bind:load=')), 'example removes Avatar click/load teaching');

const componentPage = read('miniprogram/pages/components/avatar/index.wxml');
assert(componentPage.includes('lazy'), 'independent page demonstrates native lazy loading');
assert(componentPage.includes('id="avatar-primary"'), 'independent page exposes a stable primary Avatar test anchor');
assert(componentPage.includes('id="avatar-loading"'), 'independent page exposes a stable persistent-loading Avatar test anchor');
assert(componentPage.includes('id="avatar-fallback"'), 'independent page exposes a stable fallback Avatar test anchor');
assert(componentPage.includes('loading text="L"'), 'independent page demonstrates internal persistent loading');
assert(componentPage.includes('https://lg-1sobdtqg-1254094290.cos.ap-shanghai.myqcloud.com/user_img/QX_girl.png') === false, 'remote source is owned by page data instead of duplicated in WXML');
assert(read('miniprogram/pages/components/avatar/index.js').includes('https://lg-1sobdtqg-1254094290.cos.ap-shanghai.myqcloud.com/user_img/QX_girl.png'), 'independent page uses the requested real avatar');
assert(!componentPage.includes('<pui-loading'), 'independent page does not compose an external Spinner');
assert(componentPage.includes('bind:click="onChangeAvatarSource"'), 'independent page restarts the real resource lifecycle by changing src');
assert(!componentPage.includes('loading="{{avatarLoading}}"'), 'independent page does not externally fake Avatar resource loading');
assert(!read('miniprogram/pages/components/avatar/index.js').includes('avatarLoading'), 'independent page owns no duplicate loading flag');

assert(read('docs/components/AVATAR.md').includes('TDesign 1.15.3 对照决定'));
assert(read('docs/components/README.md').includes('[Avatar](./AVATAR.md)'));

process.stdout.write('Avatar contract tests passed.\n');
