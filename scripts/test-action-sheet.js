const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'action-sheet/action-sheet.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;
let timerId = 0;
let timers = new Map();

function setTimer(callback, delay) {
  const id = ++timerId;
  timers.set(id, { id, callback, delay: Number(delay) || 0 });
  return id;
}

function clearTimer(id) { timers.delete(id); }

function runNextTimer() {
  const next = Array.from(timers.values()).sort((a, b) => a.delay - b.delay || a.id - b.id)[0];
  if (!next) return null;
  timers.delete(next.id);
  next.callback();
  return next.delay;
}

vm.runInNewContext(source, {
  clearTimeout: clearTimer,
  console,
  isFinite,
  require: () => ({}),
  setTimeout: setTimer,
  wx: { nextTick(callback) { callback(); } },
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'ActionSheet must register a component definition');

function create(overrides) {
  timers = new Map();
  timerId = 0;
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() {
      return this.data.colorScheme === 'light' || this.data.colorScheme === 'dark'
        ? `pui-theme--${this.data.colorScheme}`
        : '';
    },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const expectedProps = ['align', 'blurOverlay', 'cancelText', 'count', 'description', 'items', 'showCancel', 'showOverlay', 'theme', 'usingCustomNavbar', 'visible', 'defaultVisible', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'ActionSheet only exposes the TDesign-shaped action contract plus PoemUI accessibility/motion fields');
['open', 'close', 'toggle', 'retry'].forEach((name) => assert(!Object.prototype.hasOwnProperty.call(definition.methods, name), `ActionSheet must not restore public ${name}()`));

const defaults = create();
assert.strictEqual(defaults.instance.data.mounted, false);
assert(defaults.instance.data.rootClass.includes('pui-action-sheet--list'));
assert(!create({ colorScheme: '' }).instance.data.rootClass.includes('pui-theme--light'), 'empty colorScheme must inherit the nearest ConfigProvider');
assert(create({ colorScheme: 'dark' }).instance.data.rootClass.includes('pui-theme--dark'), 'explicit dark colorScheme remains a local override');
assert(defaults.instance.data.layerStyle.includes('500ms'));
assert.strictEqual(defaults.instance.data.maskClass, 'pui-action-sheet__mask', 'unset blurOverlay must inherit the ConfigProvider state');
assert.strictEqual(create({ blurOverlay: true }).instance.data.maskClass, 'pui-action-sheet__mask pui-action-sheet__mask--blurred');
assert.strictEqual(create({ blurOverlay: false }).instance.data.maskClass, 'pui-action-sheet__mask pui-action-sheet__mask--clear');

const selected = create({ defaultVisible: true, items: [0, false, { label: '删除', color: 'red' }, { label: '停用', disabled: true }] });
assert.strictEqual(selected.instance.data.mounted, true);
assert.strictEqual(selected.instance.data.active, true);
assert.strictEqual(selected.instance.data.normalizedItems[0].label, '0');
assert.strictEqual(selected.instance.data.normalizedItems[1].label, 'false');
assert.strictEqual(selected.instance.data.normalizedItems[2].itemStyle, 'color:red;');
selected.instance.onItemTap({ currentTarget: { dataset: { index: 0 } } });
assert.deepStrictEqual(JSON.parse(JSON.stringify(selected.events.map((event) => event.name))), ['selected', 'close', 'visible-change']);
assert.strictEqual(selected.events[0].detail.selected, 0, 'selected must preserve a numeric raw action');
assert.strictEqual(selected.events[0].detail.index, 0);
assert.strictEqual(selected.events[1].detail.trigger, 'select');
assert.strictEqual(selected.events[2].detail.visible, false);
assert.strictEqual(selected.instance.currentVisible(), false);
assert.strictEqual(selected.instance.data.mounted, true, 'leave must keep the panel mounted until the actual motion completes');
assert.strictEqual(runNextTimer(), 500);
assert.strictEqual(selected.instance.data.mounted, false);

const disabled = create({ defaultVisible: true, items: [false, { label: '不可用', disabled: true }] });
disabled.instance.onItemTap({ currentTarget: { dataset: { index: 1 } } });
assert.strictEqual(disabled.events.length, 0, 'disabled actions must not emit selected or close requests');

const cancel = create({ defaultVisible: true });
cancel.instance.onCancelTap();
assert.deepStrictEqual(JSON.parse(JSON.stringify(cancel.events.map((event) => event.name))), ['cancel', 'close', 'visible-change']);
assert.strictEqual(cancel.events[1].detail.trigger, 'cancel');
assert.strictEqual(cancel.events[2].detail.visible, false);
assert.strictEqual(cancel.instance.currentVisible(), false, 'uncontrolled cancel must request and apply the standard close flow');

const overlay = create({ defaultVisible: true });
overlay.instance.onOverlayTap();
assert.deepStrictEqual(JSON.parse(JSON.stringify(overlay.events.map((event) => event.name))), ['close', 'visible-change']);
assert.strictEqual(overlay.events[0].detail.trigger, 'overlay');
assert.strictEqual(overlay.events[1].detail.visible, false);

const controlled = create({ visible: true, items: ['复制'] });
controlled.instance.onItemTap({ currentTarget: { dataset: { index: 0 } } });
assert.strictEqual(controlled.instance.currentVisible(), true, 'controlled ActionSheet must wait for parent visible write-back');
assert.deepStrictEqual(JSON.parse(JSON.stringify(controlled.events.map((event) => event.name))), ['selected', 'close', 'visible-change']);
controlled.instance.data.visible = false;
controlled.instance.syncVisibility(false);
assert.strictEqual(controlled.instance.data.active, false);

const grid = create({ defaultVisible: true, theme: 'grid', count: 3, items: [0, false, '三', '四', '五', '六', '七'] });
assert.strictEqual(grid.instance.data.gridPages.length, 3);
assert.strictEqual(grid.instance.data.gridPages[0].items.length, 3);
grid.instance.onSwiperChange({ detail: { current: 2 } });
assert.strictEqual(grid.instance.data.gridPage, 2);

const reduced = create({ defaultVisible: true, reduceMotion: true });
assert.strictEqual(reduced.instance.motionDuration(), 1);
assert(reduced.instance.data.layerStyle.includes('1ms'));
assert.strictEqual(runNextTimer(), 1);

const wxml = fs.readFileSync(path.join(root, 'action-sheet/action-sheet.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'action-sheet/action-sheet.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'action-sheet/action-sheet.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/ACTION-SHEET.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert(wxml.includes('<slot></slot>'));
assert(wxml.includes('<swiper-item wx:for="{{gridPages}}" wx:key="key">'));
assert(wxml.includes('wx:for="{{item.items}}"'));
assert(!/pui-button|pui-loading|pui-empty|slot="(?:header|cancel)"/.test(wxml));
assert.deepStrictEqual(json.usingComponents, { 'pui-icon': '../icon/icon' });
assert(!/height\s*:\s*auto[^;]*;[^}]*transition|display\s*:\s*none/.test(wxss));
assert(wxss.includes('transition: opacity var(--pui-action-sheet-duration)'));
const actionSheetLayerRule = wxss.match(/\.pui-action-sheet-layer\s*\{([^}]*)\}/);
const actionSheetMaskRule = wxss.match(/\.pui-action-sheet__mask\s*\{([^}]*)\}/);
const actionSheetSurfaceRule = wxss.match(/\.pui-action-sheet\s*\{([^}]*)\}/);
assert(actionSheetLayerRule, 'ActionSheet must keep one full-viewport layer');
assert(!/\bopacity\s*:|\btransition\s*:/.test(actionSheetLayerRule[1]), 'ActionSheet layer must not animate opacity or delay its Mask/Surface children');
assert(actionSheetMaskRule && /opacity\s*:\s*0/.test(actionSheetMaskRule[1]) && /transition\s*:\s*opacity/.test(actionSheetMaskRule[1]), 'ActionSheet Mask must own its opacity transition');
assert(actionSheetSurfaceRule && /opacity\s*:\s*0/.test(actionSheetSurfaceRule[1]) && /transform\s*:\s*translateY/.test(actionSheetSurfaceRule[1]), 'ActionSheet Surface must own its opacity and translate transition');
assert(wxss.includes('var(--pui-frosted-filter)'));
assert(wxss.includes('.pui-frosted-glass--on .pui-action-sheet__mask'), 'global frosted glass must blur the ActionSheet mask by default');
assert(wxss.includes('.pui-action-sheet__mask--blurred') && wxss.includes('.pui-action-sheet__mask--clear'), 'ActionSheet must expose local blur override classes');
assert(/\.pui-action-sheet__cancel\s*\{[^}]*font-weight:\s*400;/.test(wxss), 'cancel must remain regular weight so it does not outrank action labels');

assert.deepStrictEqual(metadata.apiProps['action-sheet'], expectedProps);
assert.deepStrictEqual(metadata.apiEvents['action-sheet'].map((event) => event.name), ['visible-change', 'cancel', 'close', 'selected']);
assert.deepStrictEqual(metadata.apiSlots['action-sheet'].map((slot) => slot.name), ['default']);
assert.strictEqual(metadata.apiMethods['action-sheet'], undefined);

const actionSheetUsage = preview.slice(preview.indexOf("if (runtimeId === 'action-sheet')"), preview.indexOf("if (runtimeId === 'dropdown-menu')", preview.indexOf("if (runtimeId === 'action-sheet')")));
const actionSheetShowcase = preview.slice(preview.indexOf('function actionSheetShowcase('), preview.indexOf('\nfunction dropdownPreviewItemsSlim', preview.indexOf('function actionSheetShowcase(')));
const actionSheetCompatibilityMirror = preview.slice(preview.indexOf("if (compatId === 'action-sheet')"), preview.indexOf("if (compatId === 'dropdown-menu')", preview.indexOf("if (compatId === 'action-sheet')")));
assert(actionSheetUsage.includes('<pui-action-sheet ${attrs} />'));
assert(!actionSheetUsage.includes('bind:'), 'ActionSheet basic WXML must stay minimal and bind-free');
assert(actionSheetShowcase.includes('buttonSample({') && actionSheetShowcase.includes('iconButtonSample({'));
assert(preview.includes('function updateActionSheetPreviewDom(demo)'));
const actionSheetActions = preview.slice(preview.indexOf("type === 'action-sheet-open'"), preview.indexOf("type === 'action-sheet-page'"));
assert(!actionSheetActions.includes('renderStage()'), 'ActionSheet lifecycle actions retain the mounted overlay and panel');
assert(actionSheetShowcase.includes("customStyle: item.color ? `color:${item.color};` : ''"));
assert(actionSheetShowcase.includes("props.blurOverlay === true || (props.blurOverlay !== false && state.frost === 'on')"), 'H5 mirror must inherit or locally override overlay blur');
assert(!/loadingComponent|emptySample|cellSample|action-sheet-retry|action-sheet-open\(\)|action-sheet-close\(\)/.test(actionSheetShowcase));
assert(preview.includes("if (type === 'action-sheet-select')"));
assert(previewStyles.includes('ActionSheet TDesign final H5 contract'));
assert(!previewStyles.includes('.pui-action-sheet-preview__handle'), 'deleted ActionSheet handle CSS must not survive as a stale contract');
assert(!previewStyles.includes('.pui-action-sheet-preview__feedback'), 'deleted ActionSheet feedback CSS must not survive as a stale contract');
assert(!previewStyles.includes('.pui-action-sheet-preview__cancel'), 'current H5 mirror uses the shared Button inside footer, not a stale private cancel root');
assert(previewStyles.includes('.pui-action-sheet-preview__overlay:has(+ .pui-action-sheet-preview.is-active)'));
assert(/\.pui-action-sheet-preview__overlay\s*\{[^}]*opacity:\s*0;[^}]*transition:\s*opacity/s.test(previewStyles), 'H5 ActionSheet Mask must own its opacity transition');
assert(/\.pui-action-sheet-preview\s*\{[^}]*opacity:\s*0;[^}]*transform:\s*translateY/s.test(previewStyles), 'H5 ActionSheet Surface must enter independently from the Mask');
assert(actionSheetCompatibilityMirror.includes('空 items 不伪造 Empty、Loading 或失败态'));
assert(!/error > loading > content > empty|open\(\)\/close\(\)\/toggle\(\)|header\/default\/cancel slot/.test(actionSheetCompatibilityMirror));
assert(preview.includes("'action-sheet': ['从屏幕底部呈现当前情境的一组动作；选择、取消或遮罩只请求父级回写显隐。'"), 'ActionSheet catalog copy must describe the current lean contract');

const actionSheetApi = api.slice(api.indexOf('## ActionSheet'), api.indexOf('## DropdownMenu'));
assert(actionSheetApi.includes('`selected → close({ trigger: \'select\' }) → visible-change({ visible: false })`'));
assert(actionSheetApi.includes('基础用法保持最小、零 `bind:*`'));
assert(!/`loading`|`retry`|`open\(\)`|`close\(\)`|`after-open`/.test(actionSheetApi));
const actionSheetCompatibility = compatibility.slice(compatibility.indexOf('52. ActionSheet'), compatibility.indexOf('54. DropdownMenu'));
assert(actionSheetCompatibility.includes('`cancel → close({ trigger: \'cancel\' }) → visible-change(false)`'));
assert(actionSheetCompatibility.includes('网页端以 PUI IconButton 翻页'));
for (const heading of ['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环']) assert(contract.includes(heading), `ActionSheet contract must include ${heading}`);
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contract.includes('https://tdesign.tencent.com/miniprogram/components/action-sheet'));
assert(contractIndex.includes('[ActionSheet](./ACTION-SHEET.md)'));

const exampleActionSheet = exampleWxml.slice(exampleWxml.indexOf('<pui-action-sheet'), exampleWxml.indexOf('/>', exampleWxml.indexOf('<pui-action-sheet')) + 2);
['visible-change', 'close', 'selected', 'cancel'].forEach((name) => assert(exampleActionSheet.includes(`bind:${name}=`), `example must bind ActionSheet ${name}`));
assert(!/bind:(?:input|change|open|retry|after-open|after-close)|loading=|error=|title=|layout=|columns=/.test(exampleActionSheet));
assert(exampleJs.includes('onActionSheetVisibleChange') && exampleJs.includes('onActionSheetSelected'));
assert(!/onActionSheet(?:Input|Change|Open|Retry)|actionSheet(?:Loading|Error|Empty)/.test(exampleJs));
assert(!/ACTION_ITEMS[\s\S]*?description\s*:/.test(fs.readFileSync(path.join(root, 'miniprogram/pages/components/action-sheet/index.js'), 'utf8')), 'component-page default actions must stay single-line');
assert(!/label:\s*'分享组件'[^\n]*description/.test(exampleJs), 'example default actions must stay single-line');

if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const distPath = path.join(root, `miniprogram_dist/action-sheet/action-sheet.${extension}`);
    assert(fs.existsSync(distPath), `generated ActionSheet ${extension} must exist`);
    assert(fs.readFileSync(path.join(root, `action-sheet/action-sheet.${extension}`)).equals(fs.readFileSync(distPath)), `generated ActionSheet ${extension} must match source`);
  });
}

console.log('ActionSheet contract tests passed.');
