const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'pull-refresh/pull-refresh.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;
let nextTimerId = 1;
let timers = new Map();

function setTimer(callback, delay) {
  const id = nextTimerId++;
  timers.set(id, { callback, delay: Number(delay) || 0, order: id });
  return id;
}

function clearTimer(id) { timers.delete(id); }

function runNextTimer() {
  const next = Array.from(timers.entries()).sort((left, right) => left[1].delay - right[1].delay || left[1].order - right[1].order)[0];
  if (!next) return null;
  timers.delete(next[0]);
  next[1].callback();
  return next[1].delay;
}

vm.runInNewContext(source, {
  console,
  isFinite,
  setTimeout: setTimer,
  clearTimeout: clearTimer,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'PullRefresh component definition must be registered');

function create(overrides) {
  timers = new Map();
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return `pui-theme--${this.data.colorScheme}`; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const expectedProps = ['disabled', 'enableBackToTop', 'enablePassive', 'loadingBarHeight', 'loadingProps', 'loadingTexts', 'lowerThreshold', 'maxBarHeight', 'refreshTimeout', 'scrollIntoView', 'showScrollbar', 'successDuration', 'upperThreshold', 'usingCustomNavbar', 'value', 'defaultValue', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'PullRefresh only exposes the TDesign-shaped Props plus PoemUI accessibility/motion fields');
assert.strictEqual(definition.methods.finish, undefined);
assert.strictEqual(definition.methods.reset, undefined);
assert.strictEqual(definition.methods.refresh, undefined);

const base = create({ loadingBarHeight: 50, maxBarHeight: 80, refreshTimeout: 3000 });
assert(base.instance.data.rootClass.includes('pui-pull-refresh--idle'));
assert(base.instance.data.rootStyle.includes('--pui-pull-refresh-duration:500ms'));
base.instance.onTouchStart({ touches: [{ pageX: 10, pageY: 10 }] });
base.instance.onTouchMove({ touches: [{ pageX: 12, pageY: 110 }] });
assert.strictEqual(base.instance.data.refreshStatus, 1, 'A downward top-edge gesture reaches ready state');
assert.strictEqual(base.instance.data.barHeight, 80, 'maxBarHeight caps the visible pull distance');
base.instance.onTouchEnd();
assert.deepStrictEqual(base.events.map((event) => event.name), ['dragstart', 'dragging', 'dragend', 'change', 'refresh']);
assert.strictEqual(base.events[3].detail.value, true);
assert.strictEqual(base.events[4].detail.controlled, false);
assert.strictEqual(base.instance.data.activeValue, true);
assert.strictEqual(runNextTimer(), 3000, 'refreshTimeout must be a real pending timeout');
assert.deepStrictEqual(base.events.slice(-2).map((event) => event.name), ['timeout', 'change']);
assert.strictEqual(base.events.at(-1).detail.value, false);
assert.strictEqual(base.instance.data.activeValue, false);
assert.strictEqual(base.instance.data.refreshStatus, -1, 'Timeout closes the uncontrolled track without faking success');

const controlled = create({ value: false, reduceMotion: true, loadingBarHeight: 50, maxBarHeight: 80 });
controlled.instance.onTouchStart({ touches: [{ pageX: 0, pageY: 0 }] });
controlled.instance.onTouchMove({ touches: [{ pageX: 0, pageY: 90 }] });
controlled.instance.onTouchEnd();
assert.strictEqual(controlled.events.at(-1).name, 'refresh');
assert.strictEqual(controlled.events.at(-1).detail.controlled, true);
assert(controlled.instance.data.rootStyle.includes('--pui-pull-refresh-duration:1ms'));

const complete = create({ defaultValue: true, successDuration: 200 });
assert.strictEqual(complete.instance.data.refreshStatus, 2);
complete.instance._innerValue = false;
complete.instance.syncValue(false);
assert.strictEqual(complete.instance.data.refreshStatus, 3, 'Parent/state write-back shows only the refresh-track completion state');
assert(complete.instance.data.rootClass.includes('pui-pull-refresh--complete'));
assert.strictEqual(runNextTimer(), 200);
assert.strictEqual(complete.instance.data.refreshStatus, -1);

const disabled = create({ disabled: true });
disabled.instance.onTouchStart({ touches: [{ pageX: 0, pageY: 0 }] });
disabled.instance.onTouchMove({ touches: [{ pageX: 0, pageY: 100 }] });
disabled.instance.onTouchEnd();
assert.strictEqual(disabled.events.length, 0, 'disabled blocks user pull events while retaining internal scroll capability');

const wxml = fs.readFileSync(path.join(root, 'pull-refresh/pull-refresh.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'pull-refresh/pull-refresh.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'pull-refresh/pull-refresh.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/PULLREFRESH.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert(wxml.startsWith('<scroll-view'));
assert(wxml.includes('<slot name="header"></slot>'));
assert(wxml.includes('<slot></slot>'));
assert(wxml.includes('bindscrolltolower="onScrollToBottom"'));
assert(!/slot="indicator"|finish\(|reset\(|refresh\(/.test(wxml));
assert(wxss.includes('pui-pull-refresh--complete'));
assert(!/display\s*:\s*none|height\s*:\s*auto/.test(wxss));
assert.deepStrictEqual(Object.keys(json.usingComponents), ['pui-loading']);

assert.deepStrictEqual(metadata.apiProps['pull-refresh'], expectedProps);
assert.deepStrictEqual(metadata.apiEvents['pull-refresh'].map((event) => event.name), ['change', 'dragstart', 'dragging', 'dragend', 'refresh', 'scrolltolower', 'timeout']);
assert.deepStrictEqual(metadata.apiSlots['pull-refresh'].map((slot) => slot.name), ['header', 'default']);
assert.strictEqual(metadata.apiMethods['pull-refresh'], undefined);
assert(metadata.componentCopy['pull-refresh'][0].includes('内部滚动区'));

const pullPreview = preview.slice(preview.indexOf("if (runtimeId === 'pull-refresh')"), preview.indexOf("if (runtimeId === 'virtual-list')"));
assert(pullPreview.includes('<pui-pull-refresh ${attrs}>'));
assert(!/bind:|finish\(|reset\(|refresh\(|indicator/.test(pullPreview), 'Basic WXML must stay minimal and bind-free');
assert(preview.includes('function bindPullRefreshPreviewRuntime(props)'));
assert(preview.includes('root.scrollTop > 0'));
assert(preview.includes("root.addEventListener('touchmove'"));
assert(preview.includes('只有从顶部开始且向下的手势才由刷新轨道接管'));
assert(preview.includes('data-pull-refresh-scroll-id'));
assert(preview.includes("root.scrollTo({ top, behavior: props.reduceMotion ? 'auto' : 'smooth' })"));
assert(preview.includes("loadingTexts: { type: 'json', apiType: 'string[]'"));
assert(previewStyles.includes('.pull-refresh-preview.is-scrollbar-hidden'));
const pullRefreshRootCss = previewStyles.match(/\.pull-refresh-preview \{[^}]+\}/)[0];
assert(pullRefreshRootCss.includes('overscroll-behavior-y: contain'));
assert(pullRefreshRootCss.includes('touch-action: pan-y'));
assert(!pullRefreshRootCss.includes('touch-action: pan-x'));
assert(!preview.includes('pull-refresh-method'));
assert(!preview.includes('defaultLoading'));
assert(!preview.includes('maxPullDistance'));

const pullApi = api.split(/^## PullRefresh$/m)[1].split(/^## VirtualList$/m)[0];
assert(pullApi.includes('18 Props'));
assert(pullApi.includes('`header` Slot'));
assert(pullApi.includes('change(true) → refresh'));
assert(pullApi.includes('pull-refresh-record-01'));
assert(!/`defaultLoading`|`threshold`|`maxPullDistance`/.test(pullApi));
assert(pullApi.includes('不提供 `indicator` Slot、`finish/reset/refresh` 实例方法'));
assert(compatibility.includes('value/defaultValue'));
assert(!compatibility.split('56. PullRefresh')[1].split('57. VirtualList')[0].includes('finish(true/false)'));
['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环'].forEach((heading) => assert(contract.includes(heading), `PullRefresh contract must include ${heading}`));
assert(contractIndex.includes('(./PULLREFRESH.md)'));
assert(contract.includes('pull-refresh-record-01'));
assert(exampleWxml.includes('value="{{pullRefreshValue}}"'));
assert(exampleWxml.includes('bind:refresh="onPullRefreshRequest"'));
assert(exampleJs.includes('completePullRefresh'));
assert(!/finishPullRefresh|resetPullRefresh|refreshPullRefresh|pullRefreshLoading|pullRefreshScrollTop/.test(exampleJs));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const current = fs.readFileSync(path.join(root, `pull-refresh/pull-refresh.${extension}`));
  const dist = fs.readFileSync(path.join(root, `miniprogram_dist/pull-refresh/pull-refresh.${extension}`));
  assert(current.equals(dist), `generated PullRefresh ${extension} must match source`);
});

console.log('PullRefresh contract tests passed');
