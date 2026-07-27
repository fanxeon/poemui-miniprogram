const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'sidebar/sidebar.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  require: () => ({}),
  Component: (value) => { definition = value; },
  setTimeout,
  clearTimeout,
}, { filename: 'sidebar/sidebar.js' });
assert(definition, 'Sidebar component definition must be registered');

const PUBLIC_PROPS = [
  'items', 'value', 'defaultValue', 'theme', 'bordered', 'width', 'height',
  'showGroupTitle', 'sticky', 'stickyOffset', 'showIcon', 'showDescription',
  'showBadge', 'clickable', 'readonly', 'disabled', 'loading', 'loadingText',
  'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Sidebar publishes only the 24 reviewed Props');
['customHeader', 'customFooter', 'duration', 'easing'].forEach((key) => assert(!definition.properties[key], `${key} must not return to Sidebar`));
assert.strictEqual(definition.properties.width.value, 360, 'default Sidebar width keeps its default icon, description, and Badge combination readable');

const ITEMS = [
  { title: '基础', items: [
    { label: '数字零', value: 0, badgeProps: { count: 0 } },
    { label: '字符串零', value: '0', badgeProps: { dot: true } },
    { label: '空字符串', value: '' },
    { label: '非法布尔', value: false },
    { label: '非法对象', value: { id: 1 } },
    { label: '重复数字', value: 0 },
  ] },
  { title: '状态', items: [
    { label: '禁用项', value: 'disabled', disabled: true },
    { label: '加载项', value: 'loading', loading: true },
    { label: '可用项', value: 'ready', badge: 3 },
  ] },
];

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data),
    properties: Object.assign(defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const uncontrolled = create({ items: ITEMS, defaultValue: 0 });
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.flatItems, (item) => item.value), [0, '0', '', 'disabled', 'loading', 'ready']);
assert.strictEqual(uncontrolled.instance.data.innerValue, 0);
assert.strictEqual(uncontrolled.instance.data.flatItems[0].badgeVisible, true, 'badgeProps count=0 remains visible');
uncontrolled.instance.requestItem(1, 'tap');
assert.strictEqual(uncontrolled.instance.data.innerValue, '0', 'number 0 and string 0 remain distinct');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.strictEqual(uncontrolled.events[0].detail.previousValue, 0);
assert.strictEqual(uncontrolled.events[0].detail.label, '字符串零');
uncontrolled.events.length = 0;
uncontrolled.instance.requestItem(1, 'tap');
assert.deepStrictEqual(uncontrolled.events, [], 'reselect is silent');
uncontrolled.instance.requestItem(2, 'tap');
assert.strictEqual(uncontrolled.instance.data.innerValue, '', 'empty string is a valid String value');

const controlled = create({ items: ITEMS, value: 0 });
controlled.instance.requestItem(1, 'tap');
assert.strictEqual(controlled.instance.data.innerValue, 0, 'controlled Sidebar waits for parent write-back');
assert.deepStrictEqual(controlled.events.map((event) => event.name), ['change']);
assert.strictEqual(controlled.events[0].detail.controlled, true);
controlled.instance.properties.value = '0';
controlled.instance.syncState();
controlled.instance.properties.value = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, '0', 'controlled to uncontrolled retains the last valid value');

const invalidControlled = create({ items: ITEMS, value: false });
assert.strictEqual(invalidControlled.instance.data.innerKey, '');
assert.strictEqual(invalidControlled.instance.data.innerValue, null, 'Boolean controlled value remains unmatched');

const blocked = create({ items: ITEMS, defaultValue: 0, readonly: true });
assert.strictEqual(blocked.instance.requestItem(1, 'tap'), false);
blocked.instance.properties.readonly = false;
blocked.instance.properties.clickable = false;
assert.strictEqual(blocked.instance.requestItem(1, 'tap'), false);
blocked.instance.properties.clickable = true;
assert.strictEqual(blocked.instance.requestItem(3, 'tap'), false, 'disabled item is blocked');
assert.strictEqual(blocked.instance.requestItem(4, 'tap'), false, 'loading item is blocked');
blocked.instance.properties.disabled = true;
blocked.instance.onRetry();
assert.deepStrictEqual(blocked.events, [], 'disabled blocks retry');
blocked.instance.properties.disabled = false;
blocked.instance.onRetry();
assert.deepStrictEqual(blocked.events.map((event) => event.name), ['retry']);

const states = create({ items: ITEMS, loading: true, error: true, reduceMotion: false });
assert.strictEqual(states.instance.data.stateType, 'error');
assert(states.instance.data.rootStyle.includes('500ms'));
assert(states.instance.data.rootStyle.includes('cubic-bezier(0.2,0,0,1)'));
states.instance.properties.reduceMotion = true;
states.instance.syncState();
assert(states.instance.data.rootStyle.includes('1ms'));

const wxml = fs.readFileSync(path.join(root, 'sidebar/sidebar.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'sidebar/sidebar.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'sidebar/sidebar.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');

['pui-button', 'pui-badge', 'pui-icon', 'pui-loading', 'pui-empty'].forEach((name) => assert(json.usingComponents[name], `${name} composition must be declared`));
assert(wxml.includes('bind:click="onSelect"'));
assert(!wxml.includes('bind:action="onRetry"'), 'Empty no longer publishes an action event');
assert(wxml.includes('<pui-button wx:if="{{retryText}}"'));
assert(wxml.includes('bind:click="onRetry"'));
assert(!wxml.includes('bindscroll='));
assert(!wxml.includes('<slot'));
assert(!wxml.includes('pui-sidebar__header'));
assert(!wxml.includes('pui-sidebar__footer'));
assert(!wxml.includes('<pui-icon name="error-circle"'));
assert(!/transition\s*:[^;]*\bheight\s*:\s*auto/.test(wxss));
assert(!/\b(?:[4-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));

assert.deepStrictEqual(metadata.apiProps.sidebar, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups.sidebar.flatMap((group) => group.keys), PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents.sidebar.map((event) => event.name), ['change', 'retry']);
assert.strictEqual(metadata.apiSlots.sidebar, undefined);
assert.strictEqual(metadata.apiMethods.sidebar, undefined);

const previewSource = preview.slice(preview.indexOf('function sidebarValueKey'), preview.indexOf('function collapsiblePreviewOpen'));
assert(previewSource.includes('sidebarPreviewContextMarkup'), 'Sidebar overview must provide a consumer content area for the real selected value');
assert(previewSource.includes('data-sidebar-content'), 'Sidebar consumer content must expose the current selected value');
assert(!previewSource.includes('sidebarSampleProps'), 'Sidebar overview must not stack narrow, repeated scenario instances');
assert(previewSource.includes('buttonSample({'));
assert(previewSource.includes('badgeSample({'));
assert(previewSource.includes('standalone: true'), 'Sidebar trailing Badge has no default Slot host and must remain in normal flow');
assert(previewSource.includes('loadingComponent({'));
assert(previewSource.includes('emptySample({'));
assert(previewSource.includes("updateCurrentProp('value', item.value)"), 'controlled H5 performs real parent write-back');
assert(!previewSource.includes('customHeader'));
assert(!previewSource.includes('customFooter'));
assert(!previewSource.includes('data-sidebar-event role="status"'));
assert(previewStyles.includes('.pui-sidebar-workspace'));
assert(wxml.includes("name=\"{{innerKey === item.valueKey ? 'check' : item.icon}}\""), 'Selected Sidebar item replaces its leading icon with the PUI check icon');
assert(!wxml.includes('pui-sidebar__item-check'), 'Sidebar must not append a second trailing selected icon');
assert(previewStyles.includes('grid-template-columns: minmax(0, var(--pui-sidebar-preview-width)) minmax(0, 1fr);'));
assert(previewStyles.includes('justify-content: flex-start;'));
assert(previewStyles.includes('min-height: 52px;'));
assert(previewStyles.includes('font-size: var(--pui-font-size-body-medium);'));
assert(!previewStyles.includes('.pui-sidebar-preview__content'));

assert(preview.includes("width: { type: 'range', value: 360, min: 160, max: 480, step: 8 }") && preview.includes("height: { type: 'range', value: 1200, min: 240, max: 1200, step: 20 }"), 'Sidebar H5 base sample uses a readable full-height demonstration size');

const sidebarApiStart = preview.lastIndexOf("if (id === 'sidebar')");
const previewApiSource = preview.slice(sidebarApiStart, preview.indexOf("if (id === 'list')", sidebarApiStart));
['select/input', 'click/select', 'header/footer', '实例方法', 'customHeader', 'customFooter', "duration:", "easing:"].forEach((legacy) => {
  assert(!previewApiSource.includes(legacy), `Sidebar API copy must not retain legacy wording: ${legacy}`);
});
assert(preview.includes("apiType: 'SidebarGroup[] | SidebarItem[]'"));
assert(preview.includes("apiType: 'string | number | null'"));
assert(previewApiSource.includes('数字0、字符串0与空字符串严格区分'));
assert(previewApiSource.includes('Boolean/Object 无效'));

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'sidebar')"), preview.indexOf("if (runtimeId === 'list')"));
assert(!usageSource.includes('bind:'), 'Sidebar basic WXML contains no event bindings');
assert(!usageSource.includes('pui-button'));
assert(!usageSource.includes('pui-icon'));
assert(usageSource.includes('items="{{sidebarItems}}"'));
assert(usageSource.includes('value="{{activeSidebar}}"'));
assert(usageSource.includes('aria-label="${escapeHtml(props.ariaLabel'));
const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Sidebar 基础用法"'), exampleWxml.indexOf('<pui-card title="List'));
assert(exampleSection.includes('<pui-sidebar'));
assert(!exampleSection.includes('bind:'), 'example basic Sidebar contains no binds');
['onSidebarClick', 'onSidebarSelect', 'onSidebarInput', 'onSidebarChange', 'onSidebarScroll', 'onSidebarRetry', 'selectSidebarData'].forEach((name) => assert(!exampleJs.includes(name)));

assert(api.includes('## Sidebar'));
assert(api.includes('Sidebar 不公开 Slot 和实例方法'));
assert(/\d+\. Sidebar/.test(compatibility));
assert(alignment.includes('| 35 | Sidebar | SideBar / SideBarItem |'));
assert(fs.existsSync(path.join(root, 'docs/components/SIDEBAR.md')));

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `sidebar/sidebar.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/sidebar/sidebar.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `sidebar source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/sidebar/sidebar.${extension}`);
  assert(fs.existsSync(installedFile), `sidebar example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `sidebar source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/sidebar/sidebar.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `sidebar source/WeChat npm ${extension} must stay identical`);
});

definition.lifetimes.detached.call(uncontrolled.instance);
definition.lifetimes.detached.call(controlled.instance);
definition.lifetimes.detached.call(invalidControlled.instance);
definition.lifetimes.detached.call(blocked.instance);
definition.lifetimes.detached.call(states.instance);

console.log('Sidebar contract tests passed.');
