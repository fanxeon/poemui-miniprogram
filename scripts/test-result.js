const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'result/result.js');
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
  const queue = Array.from(timers.entries()).sort((left, right) => left[1].delay - right[1].delay || left[1].order - right[1].order);
  if (!queue.length) return null;
  const [id, timer] = queue[0];
  timers.delete(id);
  timer.callback();
  return timer.delay;
}

vm.runInNewContext(source, {
  console,
  isFinite,
  setTimeout: setTimer,
  clearTimeout: clearTimer,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'Result component definition must be registered');

function create(overrides) {
  timers = new Map();
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return `pui-theme--${this.data.colorScheme}`; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent() { throw new Error('Result must not publish events'); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

assert.deepStrictEqual(Object.keys(definition.properties), ['description', 'icon', 'image', 'theme', 'title', 'ariaLabel', 'reduceMotion'], 'Result publishes exactly seven Props');
assert(!source.includes('triggerEvent('), 'Result must not publish events');
assert(!/primaryText|secondaryText|showActions|customActions|actionsDisabled|actionLayout|showVisual|imageMode|imageSize/.test(source), 'Result source must not retain the removed action state machine');

const defaults = create();
assert.strictEqual(defaults.data.resolvedIconName, 'info-circle');
assert.strictEqual(defaults.data.rootRole, 'status');
assert.strictEqual(defaults.data.ariaLive, 'polite');
assert.strictEqual(defaults.data.semanticLabel, '结果');
assert(defaults.data.rootStyle.includes('--pui-result-duration:500ms'));
assert.strictEqual(runNextTimer(), 16, 'Result must enter on the next frame');
assert.strictEqual(defaults.data.entered, true);

const errorResult = create({ theme: 'error', title: '提交失败', description: '', icon: false, reduceMotion: true });
assert.strictEqual(errorResult.data.resolvedIconName, '');
assert.strictEqual(errorResult.data.rootRole, 'alert');
assert.strictEqual(errorResult.data.ariaLive, 'assertive');
assert.strictEqual(errorResult.data.semanticLabel, '提交失败');
assert(errorResult.data.rootStyle.includes('--pui-result-duration:1ms'));

const objectIcon = create({ icon: { name: 'component', size: 999, color: '#123456' } });
assert.strictEqual(objectIcon.data.resolvedIconName, 'component');
assert.strictEqual(objectIcon.data.resolvedIconSize, 320);
assert.strictEqual(objectIcon.data.resolvedIconColor, '#123456');

const invalidResult = create({ theme: 'loading', icon: { name: '', size: -2, color: 1 }, ariaLabel: '  自定义结果  ' });
assert(invalidResult.data.rootClass.includes('pui-result--default'));
assert.strictEqual(invalidResult.data.resolvedIconName, 'info-circle');
assert.strictEqual(invalidResult.data.resolvedIconSize, 24);
assert.strictEqual(invalidResult.data.resolvedIconColor, '');
assert.strictEqual(invalidResult.data.semanticLabel, '自定义结果');

const wxml = fs.readFileSync(path.join(root, 'result/result.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'result/result.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'result/result.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/RESULT.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert(wxml.includes('<pui-image'));
assert(wxml.includes('<pui-icon'));
['image', 'title', 'description'].forEach((slot) => assert(wxml.includes(`name="${slot}"`), `Result must expose ${slot} Slot`));
assert(!/<pui-button|<pui-loading|<button\b|<image\b/.test(wxml), 'Result must not contain actions, Loading, or raw platform controls');
assert(!/<slot>(?!<\/slot>)/.test(wxml), 'Result has no default Slot');
assert(!/bind:|primary|secondary|action/.test(wxml), 'WXML must not retain removed Result events or actions');
assert(wxss.includes('--pui-result-duration'));
assert(!/background\s*:|border\s*:|box-shadow\s*:/.test(wxss), 'Result root must remain transparent');
assert(!/display\s*:\s*none|height\s*:\s*auto/.test(wxss));
assert.deepStrictEqual(Object.keys(json.usingComponents).sort(), ['pui-icon', 'pui-image']);

assert.deepStrictEqual(metadata.apiProps.result, ['description', 'icon', 'image', 'theme', 'title', 'ariaLabel', 'reduceMotion']);
assert.strictEqual(metadata.apiEvents.result, undefined);
assert.strictEqual(metadata.apiMethods.result, undefined);
assert.deepStrictEqual(metadata.apiSlots.result.map((slot) => slot.name), ['image', 'title', 'description']);
assert(metadata.componentCopy.result[0].includes('结果状态'));
assert(preview.includes('function resultIconConfig(value, theme)'));
assert(preview.includes('function resultPreview(props, options = {})'));
assert(preview.includes('function resultShowcase(props)'));
assert(preview.includes('组件类型'));
assert(!/result-primary|result-secondary|data-result-event|primaryText: .结果页|secondaryText: .结果页|showActions: .是否渲染结果页/.test(preview));
assert(/\.pui-result-preview\s*\{[^}]*background:\s*transparent;[^}]*border:\s*0;[^}]*box-shadow:\s*none;/.test(previewStyles), 'H5 Result root must remain transparent');
assert(previewStyles.includes('.pui-result-showcase__grid'));
assert(!previewStyles.includes('.preview-stage .pui-result-preview'), 'global preview Surface selectors must not turn Result into a card or override its 500ms lifecycle');
assert(!previewStyles.includes('preview-stage .pui-result-preview,'), 'Result must not inherit global preview-card radius, shadow, blur, or 500ms transitions');

const resultApi = api.split(/^## Result$/m)[1].split(/^## Navbar$/m)[0];
assert(resultApi.includes('7 Props'));
assert(resultApi.includes('Result 没有 Events 或 Methods'));
assert(resultApi.includes('<pui-result'));
assert(!/primaryText|secondaryText|showActions|customActions|bind:primary|bind:secondary|bind:load|bind:error/.test(resultApi));
const resultH5 = compatibility.split('36. Result')[1].split('37. Navbar')[0];
assert(resultH5.includes('没有 Events、Methods、默认 Slot'));
assert(!/双操作|customActions|primary\/secondary|info\/loading/.test(resultH5));
['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环'].forEach((heading) => assert(contract.includes(heading), `Result contract must include ${heading}`));
assert(contractIndex.includes('(./RESULT.md)'));
assert(exampleWxml.includes('<pui-result\n        theme="success"'));
assert(exampleWxml.includes('slot="image"'));
assert(!/bind:(primary|secondary|load|error)="onResult/.test(exampleWxml));
assert(!exampleJs.includes('onResultPrimary') && !exampleJs.includes('resultStatus'));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const current = fs.readFileSync(path.join(root, `result/result.${extension}`));
  const dist = fs.readFileSync(path.join(root, `miniprogram_dist/result/result.${extension}`));
  assert(current.equals(dist), `generated Result ${extension} must match source`);
});

console.log('Result contract tests passed');
