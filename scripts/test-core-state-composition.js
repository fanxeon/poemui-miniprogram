const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');

function functionBlock(name) {
  const start = preview.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = preview.indexOf('\nfunction ', start + 10);
  return preview.slice(start, next >= 0 ? next : preview.length);
}

const calendar = functionBlock('calendarPreviewMarkup');
const collapse = functionBlock('collapseShowcase');
const dialogShowcase = functionBlock('dialogShowcase');
const grid = functionBlock('gridPreview');
const indexes = functionBlock('indexesPreviewMarkup');
const sidebar = functionBlock('sidebarPreviewMarkup');
const upload = functionBlock('uploadShowcase');
const uploadMarkup = functionBlock('uploadPreviewMarkup');
const dropdown = functionBlock('dropdownPreviewSlim');

const native = Object.fromEntries(['calendar', 'collapse', 'indexes', 'sidebar'].map((id) => [id, fs.readFileSync(path.join(root, id, `${id}.wxml`), 'utf8')]));
Object.entries(native).forEach(([id, wxml]) => {
  assert(wxml.includes('<pui-empty'), `${id} native states must compose PUI Empty`);
  assert(wxml.includes('<pui-loading'), `${id} native loading must compose PUI Loading`);
});

const emptyCompositionContracts = new Set([
  'calendar', 'swiper', 'collapse', 'collapsible',
  'combobox',
  'dropdown-menu', 'grid', 'indexes', 'list', 'navigation-menu',
  'sheet', 'sidebar', 'table', 'virtual-list'
]);
const nativeEmptyComponents = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((id) => {
    const wxmlPath = path.join(root, id, `${id}.wxml`);
    return fs.existsSync(wxmlPath) && fs.readFileSync(wxmlPath, 'utf8').includes('<pui-empty');
  })
  .sort();
assert.deepStrictEqual(
  nativeEmptyComponents,
  Array.from(emptyCompositionContracts).sort(),
  'every native component that composes PUI Empty must be covered by an H5 state-composition contract'
);

assert(calendar.includes("emptySample({ embedded: true, description: snapshot.locale.error"));
assert(calendar.includes("emptySample({ embedded: true, description: snapshot.locale.empty"));
assert(calendar.includes('${retryButton}</div>'), 'Calendar Retry must remain a sibling PUI Button');
assert(!calendar.split('\n').find((line) => line.includes('const states =')).includes('iconComponent('), 'Calendar state layers must not redraw private Icons');
assert(calendar.includes("loadingComponent({ size: 'small', text: snapshot.locale.loading, reduceMotion: !!props.reduceMotion"));

assert(collapse.includes('emptySample({ embedded: true'));
assert(collapse.includes("buttonSample({ theme: 'danger', variant: 'outline'"), 'Collapse retry must remain a sibling PUI Button');
assert(!collapse.includes('showAction:'), 'Collapse must not put retry back into Empty');
assert(collapse.includes("description: props.emptyText || '暂无可展开内容', icon: 'inbox'"));
assert(!collapse.split('\n').find((line) => line.includes('const stateContent =')).includes('iconComponent('), 'Collapse default states must not redraw private Icons');

const dialogNative = fs.readFileSync(path.join(root, 'dialog/dialog.wxml'), 'utf8');
const dialogSource = fs.readFileSync(path.join(root, 'dialog/dialog.js'), 'utf8');
assert(!preview.includes('dialogPreviewStateBody'), 'Dialog must not retain the removed root request-state preview helper');
assert(!dialogShowcase.includes('emptySample(') && !dialogShowcase.includes('loadingComponent('), 'Dialog H5 must not invent root Loading or Empty states');
assert(dialogShowcase.includes('dialogPreviewScenarioProps') && dialogShowcase.includes('dialogPreviewActions'), 'Dialog H5 must render real scenario props and actions');
assert(dialogShowcase.includes("cellSample({ title: '产物校验'"), 'Dialog content Slot demo must compose existing PUI components');
assert(!dialogNative.includes('<pui-empty') && !dialogNative.includes('<pui-loading'), 'Dialog native root must not own consumer-level Empty or Loading states');
['error', 'retryText', 'emptyText', 'headerLeft'].forEach((legacyKey) => {
  assert(!new RegExp(`^\\s*${legacyKey}:`, 'm').test(dialogSource), `Dialog source must not restore legacy root ${legacyKey}`);
});

assert(grid.includes("loadingComponent({ size: 'small', text: props.loadingText || '加载中'"));
assert(grid.includes("emptySample({ embedded: true, icon: 'error-circle', description: props.errorText || '加载失败'"));
assert(grid.includes("emptySample({ embedded: true, icon: 'grid', description: props.emptyText || '暂无入口'"));
assert(grid.includes("demoAction: options.current ? 'grid-retry' : ''"), 'Grid retry must remain a sibling PUI Button');
assert(!grid.includes("iconComponent('error-circle'"), 'Grid error and empty states must not redraw private Icons');

assert(indexes.includes("loadingComponent({ size: '36rpx', text: props.loadingText || '加载中'"));
assert(indexes.includes("emptySample({ embedded: true, role: 'alert', description: props.errorText || '加载失败'"));
assert(indexes.includes("emptySample({ embedded: true, description: props.emptyText || '暂无索引数据'"));
assert(indexes.includes("buttonSample({ theme: 'danger', variant: 'outline'"), 'Indexes retry must remain a sibling PUI Button');
assert(!indexes.includes("iconComponent('error-circle'") && !indexes.includes("iconComponent('inbox'"), 'Indexes states must not redraw private Icons');

assert(sidebar.includes("loadingComponent({ size: '36rpx', text: props.loadingText || '加载中'"));
assert(sidebar.includes("emptySample({ embedded: true, role: 'alert', description: props.errorText || '加载失败'"));
assert(sidebar.includes("emptySample({ embedded: true, description: props.emptyText || '暂无导航项'"));
assert(sidebar.includes("buttonSample({ theme: 'danger', variant: 'outline'"), 'Sidebar retry must remain a sibling PUI Button');
assert(!sidebar.includes("iconComponent('error-circle'") && !sidebar.includes("iconComponent('inbox'"), 'Sidebar states must not redraw private Icons');

const uploadNative = fs.readFileSync(path.join(root, 'upload/upload.wxml'), 'utf8');
assert(!uploadNative.includes('<pui-empty') && !uploadNative.includes('<pui-loading'), 'Upload native root must not own consumer-level Empty or Loading states');
assert(!upload.includes('emptySample(') && !upload.includes('loadingComponent('), 'Upload H5 showcase must not invent consumer-level Empty or Loading states');
assert(dropdown.includes("emptySample({ embedded: true, description: '暂无可选项'"), 'DropdownMenu 的空选项必须复用嵌入式 PUI Empty');
assert(uploadMarkup.includes("file.status === 'error' ? buttonSample") && uploadMarkup.includes("content: '重试'"), 'Upload must expose a visible per-file Retry action');
assert(uploadMarkup.includes('role="progressbar"'), 'Upload must expose per-file progress semantics');
assert(upload.includes('选择只加入 ready 文件，不代表上传成功'), 'Upload feedback must not fake remote upload success');

['pui-calendar-preview', 'pui-collapse-preview', 'pui-sidebar-preview'].forEach((prefix) => {
  assert(styles.includes(`.${prefix}__state > .pui-empty-sample`), `${prefix} embedded Empty must fill its owning state region`);
});
assert(styles.includes('.pui-grid-preview__state .pui-empty-preview.is-embedded'), 'Grid embedded Empty must remain transparent inside the Grid state Surface');
assert(styles.includes('.pui-indexes-preview__state > .pui-empty-sample'), 'Indexes embedded Empty must fill its owning state region');
assert(!styles.includes('.pui-calendar-preview__state > button {'), 'Calendar parent must not override PUI Retry Button geometry');
assert(!styles.includes('.pui-calendar-preview__footer button {'), 'Calendar Footer must not override PUI Button geometry');
assert(!styles.includes('.pui-upload-preview__state'), 'Upload must not retain a private global state layer');
assert(!styles.includes('.pui-upload-preview__methods'), 'Upload must not retain a method-debug panel');
assert(/\.pui-empty-sample\.is-embedded\s*\{[^}]*background:\s*transparent;[^}]*border:\s*0;[^}]*border-radius:\s*0;[^}]*box-shadow:\s*none;[^}]*backdrop-filter:\s*none;/s.test(styles), 'embedded Empty must never create a second Surface');

console.log('Core state composition contract tests passed.');
