const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'search/search.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  isFinite,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'search/search.js' });
assert(definition, 'Search component definition must be registered');

const PROPS = [
  'value', 'defaultValue', 'placeholder', 'clearable', 'clearTrigger', 'showCancel', 'cancelText',
  'shape', 'center', 'maxlength', 'maxcharacter', 'disabled', 'readonly', 'focus', 'confirmType',
  'ariaLabel', 'reduceMotion',
];

function create(overrides) {
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

assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Search publishes the exact 17-Prop contract');
assert(!source.includes('duration: {'));
assert(!source.includes('easing: {'));
assert(!source.includes("triggerEvent('input'"), 'Search does not duplicate change as input');

const defaults = create();
assert.strictEqual(defaults.instance.data.innerValue, '');
assert.strictEqual(defaults.instance.data.normalizedShape, 'square');
assert.strictEqual(defaults.instance.data.confirmTypeValue, 'search');
assert.strictEqual(defaults.instance.data.cancelHostClass, 'pui-search__cancel-host pui-search__cancel-host--compact');
assert(defaults.instance.data.rootStyle.includes('--pui-search-duration:500ms'));
assert(defaults.instance.data.rootStyle.includes('--pui-search-ease:var(--pui-ease-standard)'));
assert(defaults.instance.data.inputStyle.includes('--pui-input-field-radius:var(--pui-radius-medium)'));
const round = create({ shape: 'round', center: true });
assert.strictEqual(round.instance.data.normalizedShape, 'round');
assert(round.instance.data.inputStyle.includes('--pui-input-field-radius:var(--pui-radius-round)'), 'Search round must pass the defined round token into its PUI Input root');
assert.strictEqual(create({ cancelText: 'Cancel' }).instance.data.cancelHostClass, 'pui-search__cancel-host pui-search__cancel-host--regular');
assert.strictEqual(create({ cancelText: '关闭搜索' }).instance.data.cancelHostClass, 'pui-search__cancel-host pui-search__cancel-host--wide');
assert.strictEqual(create({ cancelText: '停止当前搜索任务' }).instance.data.cancelHostClass, 'pui-search__cancel-host pui-search__cancel-host--xwide');

const uncontrolled = create({ value: null, defaultValue: 'PoemUI' });
uncontrolled.instance.onInputChange({ detail: { value: 'PoemUI Next', source: 'input', cursor: 11 } });
assert.strictEqual(uncontrolled.instance.data.innerValue, 'PoemUI Next');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.events[0].detail)), {
  value: 'PoemUI Next', previousValue: 'PoemUI', source: 'input', controlled: false,
  detail: { value: 'PoemUI Next', source: 'input', cursor: 11 },
});
uncontrolled.instance.data.defaultValue = 'ignored';
uncontrolled.instance.syncState();
assert.strictEqual(uncontrolled.instance.data.innerValue, 'PoemUI Next');

const controlled = create({ value: 0, defaultValue: 'fallback' });
assert.strictEqual(controlled.instance.data.innerValue, '0', 'zero is a legal controlled value');
controlled.instance.onInputChange({ detail: { value: '12', source: 'input' } });
assert.strictEqual(controlled.instance.data.innerValue, '0', 'controlled Search waits for parent write-back');
controlled.instance.data.value = false;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 'false');
controlled.instance.data.value = '';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, '');
controlled.instance.data.value = 'parent latest';
controlled.instance.syncState();
controlled.instance.data.value = null;
controlled.instance.data.defaultValue = 'new fallback';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 'parent latest', 'controlled-to-uncontrolled keeps the rendered value');

const clear = create({ value: null, defaultValue: 'clear me', clearable: true });
clear.instance.onInputClear({ detail: { value: '', previousValue: 'clear me', source: 'clear' } });
clear.instance.onInputChange({ detail: { value: '', previousValue: 'clear me', source: 'clear' } });
assert.strictEqual(clear.instance.data.innerValue, '');
assert.deepStrictEqual(clear.events.map((event) => event.name), ['clear', 'change']);
assert.strictEqual(clear.events[0].detail.previousValue, 'clear me');
assert.strictEqual(clear.events[1].detail.source, 'clear');

const emptyClear = create({ value: null, defaultValue: '' });
emptyClear.instance.onInputClear({ detail: { value: '', source: 'clear' } });
assert.strictEqual(emptyClear.events.length, 0, 'empty Search does not fake clear');

const limited = create({ value: null, maxlength: 3 });
limited.instance.onInputChange({ detail: { value: 'A😀BC', source: 'input' } });
assert.strictEqual(limited.instance.data.innerValue, 'A😀B');
const weighted = create({ value: null, maxlength: 1, maxcharacter: 5 });
weighted.instance.onInputChange({ detail: { value: 'AB中😀C', source: 'input' } });
assert.strictEqual(weighted.instance.data.innerValue, 'AB中');
assert.strictEqual(weighted.instance.data.nativeMaxlength, -1);

const focusClear = create({ defaultValue: 'focus clear', clearTrigger: 'focus' });
assert.strictEqual(focusClear.instance.data.showClear, false);
focusClear.instance.onFocus({ detail: { value: 'focus clear' } });
assert.strictEqual(focusClear.instance.data.showClear, true);
focusClear.instance.onBlur({ detail: { value: 'focus clear' } });
assert.strictEqual(focusClear.instance.data.showClear, false);
assert.deepStrictEqual(focusClear.events.map((event) => event.name), ['focus', 'blur']);

const actions = create({ defaultValue: 'query', showCancel: true });
actions.instance.onSearch({ detail: { value: 'query', source: 'enter' } });
actions.instance.onCancel();
assert.deepStrictEqual(actions.events.map((event) => event.name), ['search', 'cancel']);
assert.strictEqual(actions.events[0].detail.source, 'confirm');
assert.strictEqual(actions.events[1].detail.value, 'query');
assert.strictEqual(actions.instance.data.innerValue, 'query', 'cancel does not clear the query');

['disabled', 'readonly'].forEach((state) => {
  const locked = create({ [state]: true, defaultValue: 'locked', showCancel: true });
  locked.instance.onInputChange({ detail: { value: 'blocked', source: 'input' } });
  locked.instance.onInputClear({ detail: { value: '', source: 'clear' } });
  locked.instance.onFocus({ detail: {} });
  locked.instance.onSearch({ detail: { value: 'blocked' } });
  locked.instance.onCancel();
  assert.strictEqual(locked.instance.data.innerValue, 'locked');
  assert.strictEqual(locked.events.length, 0, `${state} blocks Search events`);
});

const boundaries = create({ shape: 'pill', clearTrigger: 'hover', confirmType: 'return', maxlength: -2, maxcharacter: -9, reduceMotion: true });
assert.strictEqual(boundaries.instance.data.normalizedShape, 'square');
assert.strictEqual(boundaries.instance.data.confirmTypeValue, 'search');
assert.strictEqual(boundaries.instance.data.nativeMaxlength, -1);
assert(boundaries.instance.data.rootStyle.includes('--pui-search-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'search/search.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'search/search.wxss'), 'utf8');
const buttonWxss = fs.readFileSync(path.join(root, 'button/button.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'search/search.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SEARCH.md'), 'utf8');
const battleChangelog = fs.readFileSync(path.join(root, 'docs/RELEASE_0.1.2_BATTLE_CHANGELOG.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert.strictEqual(json.usingComponents['pui-input'], '../input/input');
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert(wxml.includes('bind:change="onInputChange"'));
assert(wxml.includes('bind:enter="onSearch"'));
assert(wxml.includes('style="display:flex;flex:1;min-width:0;width:100%;"'), 'Search 内部 PUI Input 宿主必须占用剩余宽度');
assert(wxml.includes('custom-style="{{inputStyle}}"'), 'Search 内部 Input 根必须通过语义样式变量传递圆角，同时占满剩余宽度');
assert(wxml.includes('bordered="{{true}}"'), 'Search 必须让 PUI Input 消费 ConfigProvider 的边框 Token');
assert(!wxml.includes('bind:input='));
assert(!wxml.includes('bind:confirm='));
assert(wxml.includes('clearable="{{clearable}}"'));
assert(wxml.includes('clear-trigger="{{normalizedClearTrigger}}"'), 'Search explicitly preserves its own normalized always/focus strategy when composing the focus-first Input');
assert(wxml.includes('maxcharacter="{{normalizedMaxcharacter}}"'));
assert(/wx:if="\{\{showCancel\}\}"[\s\S]*id="search-cancel-action"[\s\S]*class="\{\{cancelHostClass\}\}"[\s\S]*custom-class="pui-search__cancel"[\s\S]*custom-style="--pui-button-tone:var\(--pui-text-secondary\);font-weight:var\(--pui-font-weight-medium\);"[\s\S]*variant="text"[\s\S]*surface="transparent"[\s\S]*size="extra-small"[\s\S]*content="\{\{cancelText\}\}"[\s\S]*aria-label="\{\{cancelText\}\}"/.test(wxml), 'Search cancel must style the custom-component host separately from its internal root, expose the real cancel label, and use the compact low-emphasis PUI text Button contract');
assert(/\.pui-button--text\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?padding-right:\s*var\(--pui-space-xs\);[\s\S]*?padding-left:\s*var\(--pui-space-xs\);/.test(buttonWxss), 'PUI text Button must remove the ordinary Button min-width and keep only compact token padding');
assert(!/\.pui-search__cancel\{/.test(wxss), 'Search parent stylesheet must not patch Button geometry');
assert(wxss.includes('--pui-search-cancel-width-compact:68rpx'));
assert(wxss.includes('--pui-search-cancel-width-regular:104rpx'));
assert(wxss.includes('--pui-search-cancel-width-wide:144rpx'));
assert(wxss.includes('--pui-search-cancel-width-xwide:176rpx'));
assert(wxss.includes('.pui-search__cancel-host{display:flex;min-width:0;width:var(--pui-search-cancel-width);max-width:var(--pui-search-cancel-width);flex:0 0 var(--pui-search-cancel-width)}'), 'Search cancel custom-component host must consume its semantic content-width tier');
assert(wxss.includes(':host{display:block;width:100%;max-width:100%;min-width:0}'), 'Search 小程序宿主必须占满调用者可用宽度');
assert(!wxss.includes('.pui-search--round'), 'Search 不得跨组件选择器覆盖 Input 圆角，必须经 Input 语义变量传递');
assert.strictEqual(metadata.apiProps.search.length, 17);
assert.strictEqual(metadata.apiEvents.search.length, 6);
assert.strictEqual(metadata.apiSlots.search.length, 1);
assert.strictEqual(metadata.apiMethods.search, undefined);
assert.deepStrictEqual(metadata.apiEvents.search.map((event) => event.name), ['change', 'clear', 'search', 'cancel', 'focus', 'blur']);

['基础用法', '搜索框形状', '操作与长度', '状态与受控'].forEach((title) => assert(preview.includes(`<h3>${title}</h3>`), `Search overview includes ${title}`));
assert(preview.includes('function searchPreviewSnapshot('));
assert(preview.includes('function searchPreviewMarkup('));
assert(preview.includes("demo.searchEventOrder = ['clear', 'change']"));
assert(preview.includes("action === 'search-input' && previewIdFor(state.current) === 'search'"));
assert(preview.includes("apiOptions: '-1–10000, 步长 1'"));
assert(preview.includes("apiOptions: '-1–20000, 步长 1'"));
assert(preview.includes("const clearTrigger = ['always', 'focus'].includes(props.clearTrigger) ? props.clearTrigger : 'always';"), 'H5 clearTrigger 必须与真实组件同样归一化');
assert(styles.includes('.pui-input-preview--clear-focus:not(:focus-within) .pui-input-preview__clear-host'), 'H5 clearTrigger=focus 由共享 Input 在真实聚焦边界控制');
assert(styles.includes('.pui-search-showcase > .pui-showcase-section + .pui-showcase-section'));
assert(styles.includes('.pui-search {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  min-width: 0;'), 'H5 Search 镜像必须保持全宽可收缩根');
assert(styles.includes('.pui-search--round .pui-search__field'));
assert(preview.includes("clearable: !!props.clearable, clearTrigger: snapshot.clearTrigger"), 'H5 Search 必须把自身 clearTrigger 策略显式传给共享 Input 镜像');
assert(preview.includes("align: props.center ? 'center' : 'left', bordered: true"), 'H5 Search 镜像必须让 Input 消费全局边框外观');
assert(battleChangelog.includes('`preview/app.js` 的 Search 已复用 `buttonSample`'), 'Search Battle must record the completed H5 Button mirror sync');
assert(battleChangelog.includes('`preview/styles.css` 删除取消操作的最小宽度与左右 padding'), 'Search Battle must record the completed H5 compact geometry sync');
assert(!styles.includes('.pui-search-results'));

assert(api.includes('Search：TDesign 对照后的 17 Props'));
assert(api.includes('`clear → change`'));
assert(compatibility.includes('Search 的 H5 镜像'));
assert(compatibility.includes('固定 500ms/1ms'));
assert(contract.includes('17 Props / 6 Events / 1 Slot / 0 Methods'));
assert(contract.includes('TDesign Mini Program 1.15.3'));
assert(exampleWxml.includes('<pui-search'));
assert(exampleWxml.includes('bind:change="onComponentSearchChange"'));
assert(exampleWxml.includes('bind:search="onComponentSearch"'));
assert(!exampleWxml.includes('bind:input="onComponentSearch'));
assert(exampleJs.includes('onComponentSearchChange: function onComponentSearchChange(event)'));
assert(exampleJs.includes('onComponentSearch: function onComponentSearch(event)'));

for (const layer of ['search', 'miniprogram_dist/search', '_example/node_modules/poemui-miniprogram/miniprogram_dist/search']) {
  if (!fs.existsSync(path.join(root, layer))) continue;
  for (const extension of ['js', 'json', 'wxml', 'wxss']) {
    assert.strictEqual(
      fs.readFileSync(path.join(root, layer, `search.${extension}`), 'utf8'),
      fs.readFileSync(path.join(root, 'search', `search.${extension}`), 'utf8'),
      `${layer} search.${extension} matches source`,
    );
  }
}

console.log('Search contract tests passed.');
