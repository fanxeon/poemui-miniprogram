const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const store = read('common/utils/visual-config.js');
const provider = read('config-provider/config-provider.js');
const theme = read('common/style/theme.wxss');
const appearance = read('miniprogram/components/appearance-settings/appearance-settings.wxml');
const appearanceJs = read('miniprogram/components/appearance-settings/appearance-settings.js');
const popup = read('popup/popup.wxss');
const card = read('card/card.wxss');
const dialog = read('dialog/dialog.wxss');
const sheet = read('sheet/sheet.wxss');
const actionSheet = read('action-sheet/action-sheet.wxss');
const dropdownMenu = read('dropdown-menu/dropdown-menu.wxss');
const navigationMenu = read('navigation-menu/navigation-menu.wxss');
const collapse = read('collapse/collapse.wxss');
const combobox = read('combobox/combobox.wxss');
const picker = read('picker/picker.wxss');
const calendar = read('calendar/calendar.wxss');
const upload = read('upload/upload.wxss');
const uploadDist = read('miniprogram_dist/upload/upload.wxss');
const swiper = read('swiper/swiper.wxss');
const appearanceWxss = read('miniprogram/components/appearance-settings/appearance-settings.wxss');
const preview = read('preview/app.js');
const previewCss = read('preview/styles.css');

assert(store.includes('equalSpacing: false'), 'visualConfig must expose a false default');
assert(store.includes("'equalSpacing'"), 'visualConfig must normalize equalSpacing as a boolean');
assert(store.includes('equalSpacing: current.equalSpacing'), 'effective config must retain equalSpacing when effects are disabled');
assert(provider.includes('equalSpacing:'), 'ConfigProvider must expose the equalSpacing Prop and state');
assert(provider.includes('pui-spacing--equal'), 'ConfigProvider must emit the equal spacing class');
assert(provider.includes('pui-spacing--normal'), 'ConfigProvider must emit the normal spacing class');
for (const token of ['--pui-surface-inset', '--pui-surface-stack-gap', '--pui-surface-section-gap']) {
  assert(theme.includes(token), `WXSS theme is missing ${token}`);
}
assert(appearance.includes('title="间距相等"'), 'shared appearance settings must render equalSpacing');
assert(appearanceJs.includes("setting === 'equalSpacing'"), 'shared appearance settings must write equalSpacing through visualConfig');
assert(appearanceJs.includes('visualConfig.subscribe'), 'shared appearance settings must subscribe to the shared Store');
assert(popup.includes('--pui-popup-panel-padding: var(--pui-surface-inset)'), 'Popup must consume Surface inset alias');
assert(popup.includes('--pui-popup-section-gap: var(--pui-popup-panel-padding)'), 'Popup equal spacing must remap its section gap to its own inset');
assert(card.includes('--pui-card-inset: var(--pui-surface-inset)'), 'Card must consume Surface inset alias');
assert(card.includes('--pui-card-section-gap: var(--pui-card-inset)'), 'Card equal spacing must remap its section gap to its own inset');
assert(dialog.includes('--pui-dialog-section-spacing: var(--pui-surface-inset)'), 'Dialog equal spacing must remap its section spacing to its own inset');
assert(sheet.includes('.pui-spacing--equal .pui-sheet__footer { padding: 0 var(--pui-surface-inset) var(--pui-surface-inset); }'), 'Sheet equal spacing must keep the Footer full-width action track on its own Surface inset');
assert(actionSheet.includes('--pui-action-sheet-section-gap: var(--pui-action-sheet-inset)'), 'ActionSheet equal spacing must remap section gap to its own inset');
assert(dropdownMenu.includes('--pui-dropdown-section-gap: var(--pui-dropdown-inset)'), 'DropdownMenu equal spacing must remap section gap to its own inset');
assert(navigationMenu.includes('--pui-navigation-menu-inset: var(--pui-surface-inset)'), 'NavigationMenu equal spacing must expose its own inset alias');
assert(collapse.includes('--pui-collapse-inset: var(--pui-surface-inset)'), 'Collapse equal spacing must expose its own inset alias');
assert(combobox.includes('--pui-combobox-panel-gap: var(--pui-surface-inset)'), 'Combobox equal spacing must remap panel gap to its own inset');
assert(picker.includes('--pui-picker-section-gap: var(--pui-surface-inset)'), 'Picker equal spacing must remap section gap to its own inset');
assert(calendar.includes('--pui-calendar-section-gap: var(--pui-surface-inset)'), 'Calendar equal spacing must remap section gap to its own inset');
assert(upload.includes('--pui-upload-stack-gap: var(--pui-surface-inset)'), 'Upload equal spacing must remap file-stack gap to the Surface inset');
assert(uploadDist.includes('--pui-upload-stack-gap: var(--pui-surface-inset)'), 'published Upload WXSS must preserve the equal Surface alias');
assert(appearanceWxss.includes('gap: var(--pui-surface-inset)'), 'shared appearance settings must consume the host Surface inset in equal mode');
assert(!swiper.includes('.pui-spacing--equal'), 'Swiper single Viewport Surface must not invent an outer equal-spacing gap');
const componentEqualContracts = {
  'sheet/sheet.wxss': 'pui-sheet__header-row',
  'action-sheet/action-sheet.wxss': 'pui-action-sheet__items--list',
  'popover/popover.wxss': '--pui-popover-inset: var(--pui-surface-inset)',
  'dropdown-menu/dropdown-menu.wxss': 'pui-dropdown-menu__panel',
  'navigation-menu/navigation-menu.wxss': 'pui-navigation-menu__panel',
  'collapse/collapse.wxss': 'pui-collapse--card',
  'collapsible/collapsible.wxss': 'pui-collapsible__content-inner',
  'combobox/combobox.wxss': 'pui-combobox__panel-inner',
  'picker/picker.wxss': 'pui-picker__surface',
  'calendar/calendar.wxss': 'pui-calendar__body',
};
for (const [file, marker] of Object.entries(componentEqualContracts)) {
  const source = read(file);
  assert(source.includes('.pui-spacing--equal'), `${file} must scope equal spacing to its own Surface`);
  assert(source.includes(marker), `${file} must retain its real Surface structure marker`);
}
assert(!read('cell/cell-group.wxss').includes('.pui-spacing--equal'), 'CellGroup default stack must not be globally equalized');
assert(!read('input/input.wxss').includes('.pui-spacing--equal'), 'Input internals must not consume equal spacing');
for (const file of ['list/list.wxss', 'indexes/indexes.wxss', 'table/table.wxss', 'virtual-list/virtual-list.wxss']) {
  assert(!read(file).includes('.pui-spacing--equal'), `${file} continuous collection rows must not be globally equalized`);
}
assert(preview.includes('data-spacing'), 'H5 shell must expose data-spacing');
assert(preview.includes("key: 'equalSpacing'"), 'H5 menu must expose equalSpacing');
assert(preview.includes('state.equalSpacing = !state.equalSpacing'), 'H5 equalSpacing switch must update runtime state');
assert(previewCss.includes('.app-shell[data-spacing="equal"]'), 'H5 equal spacing must be shell-scoped');
assert(previewCss.includes('pui-popup-preview'), 'H5 Popup mirror must be covered by equal spacing rules');
for (const marker of ['pui-card-showcase', 'pui-sheet-preview', 'pui-action-sheet-preview', 'pui-navigation-menu-preview', 'pui-calendar-preview', 'pui-combobox-preview', 'pui-collapsible-preview', 'pui-upload-preview', 'pui-swiper-preview']) {
  assert(previewCss.includes(marker), `H5 equal spacing coverage missing ${marker}`);
}
assert(previewCss.includes('.pui-card-showcase__content {\n  padding: 0 var(--pui-surface-inset);'), 'H5 Card equal spacing must use the actual content root');
const finalEqualCascade = previewCss.slice(previewCss.lastIndexOf('/* Equal-spacing final cascade for independent Surface mirrors. */'));
assert(finalEqualCascade.includes('.pui-dialog--preview { gap: var(--pui-surface-section-gap); }'), 'H5 final cascade must preserve Dialog section gap');
assert(finalEqualCascade.includes('.pui-sheet-preview { gap: var(--pui-surface-section-gap); }'), 'H5 final cascade must preserve Sheet section gap');
assert(finalEqualCascade.includes('.pui-combobox-preview__panel-inner { gap: var(--pui-surface-stack-gap);'), 'H5 final cascade must preserve Combobox panel gap');
assert(finalEqualCascade.includes('.pui-picker-h5__layer > .pui-picker-h5__panel'), 'H5 final cascade must preserve Picker Surface inset and section gap');
assert(finalEqualCascade.includes('.pui-select-menu'), 'H5 final cascade must preserve Select menu Surface inset and stack gap');
console.log('Equal spacing visual configuration contract passed.');
