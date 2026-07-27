const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'cell/cell.js'), 'utf8');
let definition = null;
const wx = {};
const sandbox = {
  console,
  isFinite,
  wx,
  require: () => ({}),
  Component(value) { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'cell/cell.js' });
assert(definition, 'Cell component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--' + this.data.colorScheme; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const publicProps = ['title', 'description', 'value', 'note', 'image', 'leftIcon', 'rightIcon', 'size', 'align', 'variant', 'bordered', 'hover', 'required', 'arrow', 'clickable', 'selected', 'defaultSelected', 'selectable', 'allowUnselect', 'disabled', 'readonly', 'loading', 'url', 'jumpType', 'ariaLabel', 'duration', 'easing', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), publicProps, 'Cell publishes the intentionally reduced 28 Props');

const defaults = create();
assert(defaults.instance.data.rootClass.includes('pui-cell--medium'));
assert(defaults.instance.data.rootClass.includes('pui-field-row--readonly'));
assert(defaults.instance.data.rootClass.includes('pui-cell--align-middle'));
assert(!defaults.instance.data.rootClass.includes('layout-'));
assert.strictEqual(defaults.instance.data.interactive, false);
assert(defaults.instance.data.rootStyle.includes('--pui-cell-duration:500ms'));
assert(defaults.instance.data.rootStyle.includes('--pui-field-row-duration:500ms'));

const raw = create({ title: 0, description: false, value: 0, note: false, leftIcon: 'component' });
assert.strictEqual(raw.instance.data.displayTitle, '0');
assert.strictEqual(raw.instance.data.displayDescription, 'false');
assert.strictEqual(raw.instance.data.displayValue, '0');
assert.strictEqual(raw.instance.data.displayNote, 'false');
assert.strictEqual(raw.instance.data.hasMedia, true);

const uncontrolled = create({ value: false, selectable: true, clickable: true, defaultSelected: false });
assert.strictEqual(uncontrolled.instance.onTap(), true);
assert.strictEqual(uncontrolled.instance.data.innerSelected, true);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['click', 'input', 'change']);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.events[1].detail)), {
  value: false,
  selected: true,
  previousSelected: false,
  source: 'tap',
  controlled: false,
  selectable: true,
  blocked: false,
  reason: '',
  url: '',
  jumpType: 'navigateTo',
});

const controlled = create({ selected: false, defaultSelected: true, selectable: true, clickable: true });
controlled.instance.onTap();
assert.strictEqual(controlled.instance.data.innerSelected, false, 'controlled Cell waits for parent write-back');
assert.strictEqual(controlled.events[1].detail.selected, true);
controlled.instance.data.selected = true;
controlled.instance.syncState(false);
assert.strictEqual(controlled.instance.data.innerSelected, true);
controlled.instance.data.defaultSelected = false;
controlled.instance.data.selected = null;
controlled.instance.syncState(false);
assert.strictEqual(controlled.instance.data.innerSelected, false, 'controlled to uncontrolled reads latest defaultSelected');

const lockedSelected = create({ defaultSelected: true, selectable: true, clickable: true, allowUnselect: false });
lockedSelected.instance.onTap();
assert.strictEqual(lockedSelected.instance.data.innerSelected, true);
assert.deepStrictEqual(lockedSelected.events.map((event) => event.name), ['click']);
assert.strictEqual(lockedSelected.events[0].detail.reason, 'allow-unselect');

const readonly = create({ selected: false, selectable: true, clickable: true, readonly: true, url: '/pages/demo/index' });
readonly.instance.onTap();
assert.deepStrictEqual(readonly.events.map((event) => event.name), ['click']);
assert.strictEqual(readonly.events[0].detail.blocked, true);
assert.strictEqual(readonly.events[0].detail.reason, 'readonly');

['disabled', 'loading'].forEach((state) => {
  const locked = create({ [state]: true, selectable: true, clickable: true, url: '/pages/demo/index' });
  assert.strictEqual(locked.instance.onTap(), false);
  assert.strictEqual(locked.events.length, 0, `${state} blocks all user and write events`);
});

['select', 'unselect', 'toggle', 'reset', 'navigate', 'getState', 'onRightTap'].forEach((name) => {
  assert.strictEqual(definition.methods[name], undefined, `${name} is not a public Cell method`);
});

const navigationCalls = [];
wx.navigateTo = (options) => {
  navigationCalls.push({ type: 'navigateTo', url: options.url });
  options.success({ errMsg: 'navigateTo:ok' });
};
const navigation = create({ clickable: true, url: '/pages/demo/index', jumpType: 'navigateTo' });
navigation.instance.onTap();
assert.deepStrictEqual(navigationCalls, [{ type: 'navigateTo', url: '/pages/demo/index' }]);
assert.deepStrictEqual(navigation.events.map((event) => event.name), ['click', 'navigate-success']);
assert.strictEqual(navigation.events[1].detail.result.errMsg, 'navigateTo:ok');

wx.redirectTo = (options) => options.fail({ errMsg: 'redirectTo:fail route not found' });
const failure = create({ clickable: true, url: '/pages/missing/index', jumpType: 'redirectTo' });
failure.instance.onTap();
assert.deepStrictEqual(failure.events.map((event) => event.name), ['click', 'navigate-fail']);

const image = create({ image: 'https://example.com/image.png' });
image.instance.onImageLoad({ detail: { width: 40, height: 30 } });
image.instance.onImageError({ detail: { errMsg: 'image:error' } });
assert.deepStrictEqual(image.events.map((event) => event.name), ['load', 'error']);
assert.strictEqual(image.events[0].detail.src, 'https://example.com/image.png');
assert.strictEqual(Object.prototype.hasOwnProperty.call(image.events[0].detail, 'name'), false);

const boundaries = create({ size: 'huge', align: 'center', variant: 'glass', jumpType: 'navigateBack', duration: 999, easing: 'spring' });
assert.strictEqual(boundaries.instance.data.normalizedSize, 'medium');
assert.strictEqual(boundaries.instance.data.normalizedAlign, 'middle');
assert.strictEqual(boundaries.instance.data.normalizedVariant, 'default');
assert.strictEqual(boundaries.instance.data.normalizedJumpType, 'navigateTo');
assert(boundaries.instance.data.rootStyle.includes('--pui-cell-duration:999ms'));
boundaries.instance.data.reduceMotion = true;
boundaries.instance.syncState(false);
assert(boundaries.instance.data.rootStyle.includes('--pui-cell-duration:1ms'));

const capped = create({ duration: 1600 });
assert(capped.instance.data.rootStyle.includes('--pui-cell-duration:1000ms'));

const wxml = fs.readFileSync(path.join(root, 'cell/cell.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'cell/cell.wxss'), 'utf8');
const fieldRowStyles = fs.readFileSync(path.join(root, 'common/style/field-row.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'cell/cell.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/CELL.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const navigationWxml = fs.readFileSync(path.join(root, 'navigation-menu/navigation-menu.wxml'), 'utf8');

assert(!/<button\b/.test(wxml), 'Cell composes PoemUI components instead of raw buttons');
assert(!json.usingComponents['pui-badge'], 'Badge is composed through Cell Slots instead of prop passthrough');
['pui-icon', 'pui-image', 'pui-loading'].forEach((name) => assert(json.usingComponents[name], `${name} is declared`));
['name="media"', 'name="title"', 'name="description"', 'name="value"', 'name="note"', 'name="right"', '<slot></slot>'].forEach((slot) => assert(wxml.includes(slot), `Cell exposes ${slot}`));
assert(wxml.includes('class="pui-cell__right-slot" catchtap="stopPropagation"'));
assert(!wxml.includes('customMedia'));
assert(!wxml.includes('badgeTheme'));
assert(wxml.includes('mode="aspectFill"') && wxml.includes('width="72rpx"') && wxml.includes('shape="round"'));
assert(wxml.includes('name="chevron-right"'));
assert(wxss.includes('.pui-cell__media-slot:empty'));
assert(wxss.includes('@import "../common/style/field-row.wxss";'), 'Cell imports the shared field-row primitive');
assert(fieldRowStyles.includes('.pui-field-row--readonly'), 'Cell uses the read-only variant of the shared field-row primitive');
assert(!wxss.includes('.pui-cell--layout-vertical'));
assert.strictEqual(metadata.apiProps.cell.length, 28);
assert.strictEqual(metadata.apiEvents.cell.length, 7);
assert.strictEqual(metadata.apiSlots.cell.length, 7);
assert.deepStrictEqual(metadata.apiPropGroups.cell.map((group) => group.keys.length), [14, 14]);
['基础用法', '多行与内容', '状态与选择', '组合内容'].forEach((title) => assert(preview.includes(title)));
assert(preview.includes('function cellPreviewNode(props, options = {})'));
assert(preview.includes('pui-field-row-preview--readonly'));
assert(preview.includes("badgeSample({ count: checked ? '已检查' : 2"));
assert(preview.includes("loadingComponent({ size: '28rpx'"));
assert(!preview.includes("type.indexOf('cell-method-')"));
assert(preview.includes("? '<pui-cell title=\"单行标题\" />'"));
assert(preview.includes('<pui-cell title="${escapeHtml(cellTitle)}"${cellAttrs ? ` ${cellAttrs}` : \'\'} />'));
assert(preview.includes("const cellTitle = props.title === null || props.title === undefined ? '' : String(props.title);"), '当前 WXML 必须保留空字符串 title，不能回退成演示文案');
assert(preview.includes("const media = image.closest('.pui-cell-preview__media');"), 'H5 图片失败必须移除破图媒体外壳');
assert(previewStyles.includes('.pui-cell-preview__media[hidden]'), 'Cell 媒体 hidden 必须压过图片 display:block');
assert(!preview.includes('bind:right-click="onCellRightClick"'));
assert(!previewStyles.includes('.pui-cell-preview__methods'));
assert(previewStyles.includes('.pui-cell-demo-group > header'));
assert(api.includes('<pui-cell title="单行标题" />'));
assert(api.includes('Cell 不公开业务实例方法'));
assert(/Cell .*H5 镜像必须.*共享 28 Props/.test(compatibility));
assert(contract.includes('TDesign 1.15.3 对照决定'));
assert(exampleWxml.includes('<pui-cell title="单行标题" />'));
assert(exampleWxml.includes('bind:input="onDeliveryCellInput"'));
assert(!exampleWxml.includes('bind:right-click="onDeliveryCellRightClick"'));
assert(!exampleJs.includes("selectComponent('#deliveryCell')"));
assert(navigationWxml.includes('slot="value" count="{{entry.badge}}"'));

console.log('Cell contract tests passed.');
