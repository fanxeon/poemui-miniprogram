const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'empty/empty.js');
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

assert(definition, 'Empty component definition must be registered');

function create(overrides) {
  timers = new Map();
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return `pui-theme--${this.data.colorScheme}`; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent() { throw new Error('Empty must not publish events'); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

assert.deepStrictEqual(Object.keys(definition.properties), ['description', 'icon', 'image', 'ariaLabel', 'reduceMotion'], 'Empty publishes exactly five Props');
assert.strictEqual(typeof definition.methods.onAction, 'undefined');
assert.strictEqual(typeof definition.methods.onImageLoad, 'undefined');
assert.strictEqual(typeof definition.methods.onImageError, 'undefined');

const defaults = create();
assert.strictEqual(defaults.data.semanticLabel, '空状态');
assert.strictEqual(defaults.data.resolvedIconName, '');
assert(defaults.data.rootStyle.includes('--pui-empty-duration:500ms'));
assert.strictEqual(runNextTimer(), 16, 'Empty must enter on the next frame');
assert.strictEqual(defaults.data.entered, true);
assert(source.includes("var descriptionValue = this.data.description === null || this.data.description === undefined ? '' : this.data.description;"), 'Empty source must treat an empty description as a controlled value');

const imageFirst = create({ description: '没有匹配项', image: '/cover.png', icon: 'inbox' });
assert.strictEqual(imageFirst.data.resolvedIconName, 'inbox');
assert.strictEqual(imageFirst.data.semanticLabel, '没有匹配项');

const objectIcon = create({ icon: { name: 'search', size: 999, color: '#123456' } });
assert.strictEqual(objectIcon.data.resolvedIconName, 'search');
assert.strictEqual(objectIcon.data.resolvedIconSize, 320);
assert.strictEqual(objectIcon.data.resolvedIconColor, '#123456');

const invalidIcon = create({ icon: { name: 0, size: -1, color: 1 }, ariaLabel: '  搜索为空  ', reduceMotion: true });
assert.strictEqual(invalidIcon.data.resolvedIconName, '');
assert.strictEqual(invalidIcon.data.resolvedIconSize, 24);
assert.strictEqual(invalidIcon.data.resolvedIconColor, '');
assert.strictEqual(invalidIcon.data.semanticLabel, '搜索为空');
assert(invalidIcon.data.rootStyle.includes('--pui-empty-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'empty/empty.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'empty/empty.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'empty/empty.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/EMPTY.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');

assert(wxml.includes('<pui-image'));
assert(wxml.includes('<pui-icon'));
['image', 'description', 'action'].forEach((slot) => assert(wxml.includes(`name="${slot}"`), `Empty must expose ${slot} Slot`));
assert(!/<pui-button|<button\b|<image\b/.test(wxml), 'Empty must not contain an internal Button or raw platform controls');
assert(!/name="default"|<slot>(?!<\/slot>)/.test(wxml), 'Empty has no default Slot');
assert(!/\btitle=|\btheme=|action-|bind:action|\bduration=|\beasing=/.test(wxml), 'WXML must not retain removed Empty API');
assert(wxss.includes('--pui-empty-duration'));
assert(!/background\s*:|border\s*:|box-shadow\s*:/.test(wxss), 'Empty root must remain transparent');
assert(!/display\s*:\s*none|height\s*:\s*auto/.test(wxss));
assert.strictEqual(json.usingComponents['pui-image'], '../image/image');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-button'], undefined);

assert.deepStrictEqual(metadata.apiProps.empty, ['description', 'icon', 'image', 'ariaLabel', 'reduceMotion']);
assert.strictEqual(metadata.apiEvents.empty, undefined);
assert.strictEqual(metadata.apiMethods.empty, undefined);
assert.deepStrictEqual(metadata.apiSlots.empty.map((slot) => slot.name), ['image', 'description', 'action']);
assert(metadata.componentCopy.empty[0].includes('具名 Slot'));
assert(shadcn.includes("['Empty', 'empty', 'adapter', 'none'"));
assert(preview.includes('function emptySample(props = {})'));
assert(preview.includes("const description = props.description ?? '';"), 'H5 Empty must retain a controlled empty description instead of restoring a fallback');
assert(preview.includes('function emptyShowcase(props, demo)'));
assert(preview.includes("demoAction: 'empty-slot-action'"));
assert(preview.includes('emptySample({ embedded: true'), 'Empty H5 状态示例必须复用透明的 PUI Empty 镜像，而不是依赖 Image 页面运行时');
assert(!preview.includes('empty-custom-action') && !preview.includes('data-empty-image-error'));
assert(!/\.pui-empty-preview\s*\{[^}]*background:\s*var\(--surface-solid\)/.test(previewStyles), 'H5 Empty root remains transparent');
assert(!previewStyles.includes('.preview-stage .pui-empty-preview,'), 'global preview surface rules must not wrap Empty');
assert(previewStyles.includes('.pui-empty-showcase__grid'));

const emptyApi = api.split('## Empty')[1].split('## NoticeBar')[0];
assert(emptyApi.includes('5 Props') === false || emptyApi.includes('5 个 Props'));
assert(emptyApi.includes('Empty 没有公开 Events 或实例 Methods'));
assert(emptyApi.includes('<pui-empty description="暂无内容" />'));
assert(!/actionText|customAction|bind:action|imageSize|imageMode|默认 slot/.test(emptyApi));
const emptyH5 = compatibility.split('34. Empty')[1].split('36. Result')[0];
assert(emptyH5.includes('无默认 Slot、Events、Methods'));
assert(!/imageSize 和 mode|action loading|customAction/.test(emptyH5));
['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环'].forEach((heading) => assert(contract.includes(heading), `Empty contract must include ${heading}`));
assert(exampleWxml.includes('<pui-button slot="action"'));
assert(!/bind:(action|load|error)="onEmpty/.test(exampleWxml));
assert(exampleJs.includes('onEmptyAction'));
assert(!exampleJs.includes('onEmptyImageLoad') && !exampleJs.includes('onEmptyImageError'));

const consumers = [
  'calendar/calendar.wxml', 'swiper/swiper.wxml', 'collapse/collapse.wxml', 'collapsible/collapsible.wxml', 'combobox/combobox.wxml', 'dropdown-menu/dropdown-menu.wxml', 'grid/grid.wxml', 'indexes/indexes.wxml', 'list/list.wxml', 'navigation-menu/navigation-menu.wxml', 'picker/template.wxml', 'popover/popover.wxml', 'popup/popup.wxml', 'sheet/sheet.wxml', 'sidebar/sidebar.wxml', 'table/table.wxml', 'virtual-list/virtual-list.wxml',
];
consumers.forEach((relative) => {
  const content = fs.readFileSync(path.join(root, relative), 'utf8');
  assert(!/<pui-empty[^>]*(?:\btitle=|\bsize=|\btheme=|\baction-|\bduration=|\beasing=|bind:action)/.test(content), `${relative} must not pass removed Empty Props`);
});
['swiper/swiper.wxml', 'collapse/collapse.wxml', 'collapsible/collapsible.wxml', 'combobox/combobox.wxml', 'dropdown-menu/dropdown-menu.wxml', 'grid/grid.wxml', 'indexes/indexes.wxml', 'sidebar/sidebar.wxml', 'virtual-list/virtual-list.wxml'].forEach((relative) => {
  const content = fs.readFileSync(path.join(root, relative), 'utf8');
  assert(content.includes('<pui-button'), `${relative} must keep retry as a consumer PUI Button`);
});

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const current = fs.readFileSync(path.join(root, `empty/empty.${extension}`));
  const dist = fs.readFileSync(path.join(root, `miniprogram_dist/empty/empty.${extension}`));
  assert(current.equals(dist), `generated Empty ${extension} must match source`);
});

console.log('Empty contract tests passed');
