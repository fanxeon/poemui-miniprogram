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

const loadingCoverage = {
  avatar: ['avatarNode'], breadcrumb: ['breadcrumbPreviewMarkup'], button: ['buttonSample'], calendar: ['calendarPreviewMarkup'], swiper: ['swiperShowcase'], cell: ['cellPreviewNode'], collapse: ['collapseShowcase'], collapsible: ['collapsibleContentMarkup'], combobox: ['comboboxH5PanelMarkup'], 'dynamic-message': ['dynamicMessageShowcase'], grid: ['gridPreview'], image: ['imageNode'], indexes: ['indexesPreviewMarkup'], input: ['inputPreviewMarkup'], list: ['listShowcase'], navbar: ['navbarPreviewMarkup'], 'navigation-menu': ['navigationMenuH5GroupsMarkup', 'navigationMenuShowcase'], 'pull-refresh': ['pullRefreshShowcase'], sheet: ['sheetShowcase'], sidebar: ['sidebarPreviewMarkup'], switch: ['switchPreviewMarkup'], table: ['tableShowcase'], textarea: ['textareaPreviewMarkup'], toast: ['toastPreviewMarkup'], 'virtual-list': ['virtualListItemMarkup', 'virtualListContentMarkup'],
};

const nativeLoadingComponents = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((id) => {
    const wxmlPath = path.join(root, id, `${id}.wxml`);
    return fs.existsSync(wxmlPath) && fs.readFileSync(wxmlPath, 'utf8').includes('<pui-loading');
  })
  .sort();

assert.deepStrictEqual(nativeLoadingComponents, Object.keys(loadingCoverage).sort(), 'every native PUI Loading composition must have an H5 contract');
Object.entries(loadingCoverage).forEach(([id, functions]) => functions.forEach((name) => {
  assert(functionBlock(name).includes('loadingComponent('), `${id}/${name} must call the shared PUI Loading mirror`);
}));

const button = functionBlock('buttonSample');
assert(button.includes("const componentIconSize = ({ 'extra-small': 22, small: 26, medium: 32, large: 38 })[size]"));
assert(button.includes('pxSize: componentIconSize / 2'));
assert(button.includes('size: rawLoadingProps.size || `${componentIconSize}rpx`'));
assert(button.includes('loadingComponent({ ...loadingProps, reduceMotion: !!props.reduceMotion })'));

const checkbox = functionBlock('checkboxPreviewMarkup');
assert(functionBlock('checkboxPreviewMarkSize').includes('return 14'));
assert(checkbox.includes('iconComponent(icons[0]') && checkbox.includes('pxSize: markSize'));

const tabbar = functionBlock('tabbarPreviewMarkup');
assert(tabbar.includes("size: '36rpx'") && tabbar.includes('pxSize: 18'));
const steps = functionBlock('stepsPreviewMarkup');
assert(steps.includes("size: '24rpx'") && steps.includes('pxSize: 12'));
const switchMarkup = functionBlock('switchPreviewMarkup');
assert(switchMarkup.includes('({ small: 10, medium: 12, large: 14 })[snapshot.size]'));
assert(switchMarkup.includes('size: `${thumbIconSize * 2}rpx`') && switchMarkup.includes('pxSize: thumbIconSize'));
const rateMarkup = functionBlock('ratePreviewMarkup');
assert(rateMarkup.includes("iconComponent('star', { size: 'large', pxSize: snapshot.size") && rateMarkup.includes("className: 'pui-rate-preview__base-icon'"));
assert(functionBlock('uploadPreviewMarkup').includes("demoAction: 'upload-preview'"));
assert(functionBlock('uploadPreviewMarkup').includes("icon: 'eye'"));
assert(functionBlock('uploadPreviewMarkup').includes("customClass: 'pui-upload-preview__add-button'"));

[
  /pui-checkbox-preview__indicator[^{}]*\.pui-icon\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-tabbar-preview[^{}]*\.pui-icon\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-steps-preview__indicator[^{}]*\.(?:pui-icon|pui-spinner)\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-back-top-preview[^{}]*\.pui-icon\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-calendar-preview__header[^{}]*\.pui-icon\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-switch-preview__thumb[^{}]*\.(?:pui-icon|pui-spinner|pui-loading)\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-radio-preview__mark[^{}]*\.pui-icon\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-rate-preview__star[^{}]*\.pui-icon\s*\{[^}]*\b(?:width|height)\s*:/s,
  /pui-upload-preview__actions\s*>\s*(?:a|button)[^{]*\{[^}]*\b(?:width|height|padding|border-radius)\s*:/s,
].forEach((pattern) => assert(!pattern.test(styles), `parent CSS must not override shared subcomponent geometry: ${pattern}`));

assert(!preview.includes('choiceSample(') && !preview.includes('choice-select') && !styles.includes('.pui-choice'), 'unreachable private Choice mirror must stay deleted');

console.log('Shared subcomponent geometry and Loading coverage contract tests passed.');
