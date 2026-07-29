const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'steps/steps.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  require: () => ({}),
  Component: (value) => { definition = value; },
}, { filename: 'steps/steps.js' });
assert(definition, 'Steps component definition must be registered');

const PUBLIC_PROPS = [
  'items', 'current', 'defaultCurrent', 'currentStatus', 'layout', 'sequence', 'theme',
  'scrollable', 'readonly', 'disabled', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Steps publishes only the 12 reviewed Props');
['maxTitleLength', 'showDescription', 'customFooter', 'loading', 'loadingText', 'error',
  'errorText', 'retryText', 'emptyText', 'duration', 'easing']
  .forEach((key) => assert(!definition.properties[key], `${key} must not return to the public Steps API`));

const ITEMS = [
  { title: '数字零', content: 'number', value: 0, icon: 'number' },
  { title: '字符串零', description: 'string', value: '0' },
  { title: '布尔值', extra: 'boolean', value: false },
  { title: '空字符串', value: '' },
  { title: '禁用', value: 'disabled', disabled: true },
];

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const uncontrolled = create({ items: ITEMS, defaultCurrent: 0 });
assert.strictEqual(uncontrolled.instance.data.innerCurrent, 0);
assert.strictEqual(uncontrolled.instance.data.currentIndex, 0);
assert.strictEqual(uncontrolled.instance.data.normalizedItems[0].content, 'number');
uncontrolled.instance.requestSelect(1, 'item');
assert.strictEqual(uncontrolled.instance.data.innerCurrent, '0', 'number 0 and string 0 remain distinct');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.strictEqual(uncontrolled.events[0].detail.previousValue, 0);
assert.strictEqual(uncontrolled.events[0].detail.value, '0');
uncontrolled.events.length = 0;
uncontrolled.instance.requestSelect(1, 'item');
assert.deepStrictEqual(uncontrolled.events, [], 'same current step stays silent');
uncontrolled.instance.requestSelect(2, 'item');
uncontrolled.instance.requestSelect(3, 'item');
assert.strictEqual(uncontrolled.instance.data.innerCurrent, '', 'false and empty string remain distinct legal values');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change', 'change']);

const controlled = create({ items: ITEMS, current: false, defaultCurrent: 0 });
controlled.instance.requestSelect(3, 'item');
assert.strictEqual(controlled.instance.data.innerCurrent, false, 'controlled Steps waits for parent write-back');
assert.strictEqual(controlled.events[0].name, 'change');
assert.strictEqual(controlled.events[0].detail.controlled, true);
assert.strictEqual(controlled.events[0].detail.previousIndex, 2);
controlled.instance.data.current = 0;
controlled.instance.syncState();
controlled.instance.data.current = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerCurrent, 0, 'controlled to uncontrolled keeps the last controlled value');

const unmatchedControlled = create({ items: ITEMS, current: 'missing' });
assert.strictEqual(unmatchedControlled.instance.data.currentIndex, -1, 'unmatched controlled value does not fake index zero');
assert(!unmatchedControlled.instance.data.normalizedItems.some((item) => item.active));

const disabledOnly = create({ items: [{ title: '不可用', value: 0, disabled: true }], defaultCurrent: 0 });
assert.strictEqual(disabledOnly.instance.data.innerCurrent, null);
assert.strictEqual(disabledOnly.instance.data.currentIndex, -1, 'all-disabled items do not create a fake current step');
assert.strictEqual(disabledOnly.instance.requestSelect(0, 'item'), false);
assert.deepStrictEqual(disabledOnly.events, []);

const locked = create({ items: ITEMS, defaultCurrent: 0, readonly: true });
assert.strictEqual(locked.instance.requestSelect(1, 'item'), false);
locked.instance.data.readonly = false;
locked.instance.data.disabled = true;
locked.instance.syncState();
assert.strictEqual(locked.instance.requestSelect(1, 'item'), false);
assert.deepStrictEqual(locked.events, []);

const reverse = create({ items: ITEMS, defaultCurrent: false, sequence: 'reverse' });
assert.deepStrictEqual(Array.from(reverse.instance.data.normalizedItems, (item) => item.index), [4, 3, 2, 1, 0]);
assert.strictEqual(reverse.instance.data.normalizedItems.find((item) => item.active).value, false);
assert.strictEqual(reverse.instance.data.normalizedItems.find((item) => item.index === 2).status, 'process');

const explicit = create({ items: [{ title: '错误', value: 'error', status: 'error' }], current: 'error', currentStatus: 'finish' });
assert.strictEqual(explicit.instance.data.normalizedItems[0].status, 'error', 'explicit item status overrides currentStatus');

const motion = create({ items: ITEMS, defaultCurrent: 0, reduceMotion: false });
assert(motion.instance.data.rootStyle.includes('500ms'), 'Steps motion is fixed at 500ms');
motion.instance.data.reduceMotion = true;
motion.instance.syncState();
assert(motion.instance.data.rootStyle.includes('1ms'), 'reduceMotion compresses motion to 1ms');

const wxml = fs.readFileSync(path.join(root, 'steps/steps.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'steps/steps.wxss'), 'utf8');
const themeWxss = fs.readFileSync(path.join(root, 'common/style/theme.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'steps/steps.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');
const compactWxss = wxss.replace(/\s+/g, ' ');
const compactPreviewStyles = previewStyles.replace(/\s+/g, ' ');

function readUnitToken(sourceText, tokenName, unit) {
  const match = sourceText.match(new RegExp(`--${tokenName}:\\s*(-?\\d+(?:\\.\\d+)?)${unit};`));
  assert(match, `${tokenName} must be declared in ${unit}`);
  return Number(match[1]);
}

const nativeGeometry = {
  indicatorSize: readUnitToken(themeWxss, 'pui-space-step-22', 'rpx'),
  indicatorCenter: readUnitToken(themeWxss, 'pui-space-step-11', 'rpx'),
  connectorGap: readUnitToken(themeWxss, 'pui-space-step-8', 'rpx'),
  itemGap: readUnitToken(themeWxss, 'pui-space-step-6', 'rpx'),
  dotSize: readUnitToken(themeWxss, 'pui-space-step-10', 'rpx'),
  dotCenter: readUnitToken(themeWxss, 'pui-space-step-5', 'rpx'),
  dotOffset: readUnitToken(themeWxss, 'pui-space-step-6', 'rpx'),
  itemMinHeight: 88,
};
const h5Geometry = {
  indicatorSize: readUnitToken(previewStyles, 'pui-preview-space-step-22', 'px'),
  indicatorCenter: readUnitToken(previewStyles, 'pui-preview-space-step-11', 'px'),
  connectorGap: readUnitToken(previewStyles, 'pui-preview-space-step-8', 'px'),
  itemGap: readUnitToken(previewStyles, 'pui-preview-space-step-6', 'px'),
  dotSize: readUnitToken(previewStyles, 'pui-preview-space-step-10', 'px'),
  dotCenter: readUnitToken(previewStyles, 'pui-preview-space-step-5', 'px'),
  dotOffset: readUnitToken(previewStyles, 'pui-preview-space-step-6', 'px'),
  itemMinHeight: 48,
};

function assertConnectorGeometry(geometry, scaleName) {
  assert.strictEqual(geometry.indicatorCenter * 2, geometry.indicatorSize, `${scaleName} default connector x anchor must be the indicator center`);
  assert.strictEqual(geometry.dotCenter * 2, geometry.dotSize, `${scaleName} dot connector radius must match the dot`);
  const itemStart = geometry.itemMinHeight + geometry.itemGap;
  const defaultLineStart = geometry.indicatorSize + geometry.connectorGap;
  const defaultLineEnd = geometry.itemMinHeight - (geometry.connectorGap - geometry.itemGap);
  assert.strictEqual(defaultLineStart - geometry.indicatorSize, geometry.connectorGap, `${scaleName} default connector must leave a gap after the current indicator`);
  assert.strictEqual(itemStart - defaultLineEnd, geometry.connectorGap, `${scaleName} default connector must leave a gap before the next indicator`);
  const dotLineStart = geometry.dotOffset + geometry.dotSize + geometry.connectorGap;
  const dotLineEnd = geometry.itemMinHeight
    - (geometry.connectorGap - geometry.itemGap - geometry.dotOffset);
  const nextDotStart = itemStart + geometry.dotOffset;
  assert.strictEqual(dotLineStart - geometry.dotOffset - geometry.dotSize, geometry.connectorGap, `${scaleName} dot connector must leave a gap after the current dot`);
  assert.strictEqual(nextDotStart - dotLineEnd, geometry.connectorGap, `${scaleName} dot connector must leave a gap before the next dot`);
}

assertConnectorGeometry(nativeGeometry, 'native');
assertConnectorGeometry(h5Geometry, 'H5');
['indicatorSize', 'indicatorCenter', 'connectorGap', 'itemGap', 'dotSize', 'dotCenter', 'dotOffset']
  .forEach((key) => assert.strictEqual(nativeGeometry[key], h5Geometry[key] * 2, `${key} must keep the 1px≈2rpx mirror`));

assert(wxml.includes('wx:if="{{normalizedItems.length}}"'), 'empty items do not render a fake shell');
assert(wxml.includes('<pui-button'));
assert(wxml.includes('custom-style="position:absolute;inset:0;width:100%;height:100%;min-height:100%;padding:0;"'), 'Steps must use a full-item PUI Button interaction layer without changing the visual geometry');
assert(wxml.includes('<view class="pui-steps__body" aria-hidden="true">'), 'Steps visual body must share one component-owned coordinate system');
assert(wxml.includes('<pui-icon'));
assert(wxml.includes("item.status === 'finish'}}\" name=\"check\""), 'Steps finish indicator must use the semantic PUI check Icon');
assert(wxml.includes("item.status === 'error'}}\" name=\"error-circle\""), 'Steps error indicator must use the semantic PUI error-circle Icon');
assert(!wxml.includes('pui-loading'));
assert(!wxml.includes('stateType'));
assert(!wxml.includes('<slot'));
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert(!json.usingComponents['pui-loading']);
assert(!/transition\s*:[^;]*\bheight\b/.test(wxss), 'Steps does not transition height:auto');
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Steps CSS has no motion longer than 500ms');
assert(!wxss.includes('text-overflow: ellipsis'));
assert(wxss.includes('.pui-steps__body') && wxss.includes('width: 100%;'), 'Steps visual body must fill the measured item track so indicators and connector lines share one geometry');
assert(compactWxss.includes('--pui-steps-indicator-size: var(--pui-space-step-22);'));
assert(compactWxss.includes('--pui-steps-indicator-center: var(--pui-space-step-11);'));
assert(compactWxss.includes('--pui-steps-connector-gap: var(--pui-space-step-8);'));
assert(compactWxss.includes('right: calc(-50% + var(--pui-steps-indicator-center) + var(--pui-steps-connector-gap)); left: calc(50% + var(--pui-steps-indicator-center) + var(--pui-steps-connector-gap));'), 'Steps horizontal connector must start one radius plus the shared gap from each indicator center');
assert(compactWxss.includes('top: calc(var(--pui-steps-indicator-size) + var(--pui-steps-connector-gap)); right: auto; bottom: calc(var(--pui-steps-connector-gap) - var(--pui-steps-vertical-item-gap)); left: var(--pui-steps-indicator-center);'), 'Steps vertical connector must use the indicator center and symmetric endpoint gaps');
assert(compactWxss.includes('transform: translateX(-50%);'), 'Steps vertical connector line width must be centered on the anchor');
assert(compactWxss.includes('top: calc(var(--pui-steps-dot-offset) + var(--pui-steps-dot-size) + var(--pui-steps-connector-gap)); bottom: calc(var(--pui-steps-connector-gap) - var(--pui-steps-vertical-item-gap) - var(--pui-steps-dot-offset));'), 'Steps dot connector must use the dot box instead of the default indicator edge');
assert(!compactWxss.includes('left: var(--pui-space-step-22);'), 'Steps must not anchor the vertical connector at the 44rpx indicator edge');
assert(wxss.includes('.pui-steps--vertical .pui-steps__body') && wxss.includes('flex-direction: row;'), 'Steps vertical layout must compose indicator and copy in one aligned row');

assert.deepStrictEqual(metadata.apiProps.steps, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups.steps.flatMap((group) => group.keys), PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents.steps.map((event) => event.name), ['change']);
assert.strictEqual(metadata.apiSlots.steps, undefined);
assert.strictEqual(metadata.apiMethods.steps, undefined);
assert(metadata.packageComponents.includes('steps'));

const stepsPreviewSource = preview.slice(preview.indexOf('function stepsStatus'), preview.indexOf('function clampBackTopPreview'));
assert(stepsPreviewSource.includes("demo.stepsScenario"));
assert(stepsPreviewSource.includes("demoAction: 'steps-scenario'"));
assert(stepsPreviewSource.includes('data-steps-scenario-view'));
assert(stepsPreviewSource.includes("role: 'tab'"), 'Steps scenario navigation must expose real tab semantics');
assert(stepsPreviewSource.includes("ariaSelected: scenario.id === selected.id"), 'Steps scenario navigation must expose its active state');
assert(stepsPreviewSource.includes("ariaControls: 'pui-steps-scenario-view'"), 'Steps scenario tabs must control the single active view');
assert(stepsPreviewSource.includes("? iconComponent('check'"), 'H5 Steps finish status must use the shared PUI check Icon');
assert(stepsPreviewSource.includes("? iconComponent('error-circle'"), 'H5 Steps error status must use the shared PUI error-circle Icon');
assert(stepsPreviewSource.includes("defaultSlot: `${iconComponent(scenario.icon, { size: 'small' })}"), 'Steps scenario navigation must render its icons through the shared PUI Icon helper');
assert(!/[>](?:✓|✔|✕|✖|✗|×)[<]/.test(stepsPreviewSource), 'Steps H5 must not replace semantic PUI Icons with text glyphs');
assert(stepsPreviewSource.includes("theme: 'default',\n    scrollable: false,"), 'Status scenario must show PUI status Icons instead of hiding them in dot mode');
assert(!stepsPreviewSource.includes('<article class="pui-showcase-section"><h3>基础用法</h3>'));
assert(stepsPreviewSource.includes("dataAttributes: { 'steps-sample': sampleId }"));
assert(stepsPreviewSource.includes("updateCurrentProp('current', item.value)"), 'H5 controlled sample performs a real parent Prop write-back');
assert(!stepsPreviewSource.includes('loadingComponent'));
assert(!stepsPreviewSource.includes('steps-retry'));
assert(!stepsPreviewSource.includes('steps-footer'));
assert(!stepsPreviewSource.includes('pui-showcase-label'));
assert(previewStyles.includes('.pui-steps-scenario__nav'));
assert(previewStyles.includes('.pui-steps-scenario__view'));
assert(previewStyles.includes('@media (max-width: 420px)'));
assert(!previewStyles.includes('.pui-steps-scenario__tab > .pui-button-preview__content > .pui-icon { display: none; }'), 'Narrow Steps scenario navigation must retain its PUI Icons');
assert(previewStyles.includes('.pui-steps-scenario__tab.is-active {\n  color: var(--surface-solid);\n  background: var(--text);'), 'Steps scenario selection must remain visually unmistakable');
assert(previewStyles.includes('.pui-steps-scenario__tab.pui-button-preview.is-active.pui-button--text {\n  color: var(--surface-solid);\n  background: var(--text);'), 'Steps active scenario must override the shared text Button transparent background');
assert(previewStyles.includes('.pui-steps-preview .pui-steps-preview__button.pui-button-preview'));
assert(compactPreviewStyles.includes('--pui-steps-indicator-center: var(--pui-preview-space-step-11);'));
assert(compactPreviewStyles.includes('top: calc(var(--pui-steps-indicator-size) + var(--pui-steps-connector-gap)); right: auto; bottom: calc(var(--pui-steps-connector-gap) - var(--pui-steps-vertical-item-gap)); left: var(--pui-steps-indicator-center);'), 'H5 vertical connector must mirror the native anchor and endpoint gaps');
assert(compactPreviewStyles.includes('top: calc(var(--pui-steps-dot-offset) + var(--pui-steps-dot-size) + var(--pui-steps-connector-gap)); bottom: calc(var(--pui-steps-connector-gap) - var(--pui-steps-vertical-item-gap) - var(--pui-steps-dot-offset));'), 'H5 dot connector must mirror the native dot geometry');
assert(previewStyles.includes('.pui-steps-preview.is-reduced-motion'));
assert(!previewStyles.includes('.pui-steps-preview__state'));
assert(!previewStyles.includes('.pui-steps-preview__footer'));

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'steps')"), preview.indexOf("if (runtimeId === 'table')"));
assert(!usageSource.includes('bind:'), 'Steps basic WXML contains no event bindings');
assert(usageSource.includes('const stepsSourceDefaults = componentPropDefaults.steps'));
assert(usageSource.includes("items: 'stepItems'"));
assert(usageSource.includes("current: 'stepCurrent'"));
const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Steps 基础用法"'), exampleWxml.indexOf('<pui-card title="BackTop'));
assert(exampleSection.includes('<pui-steps'));
assert(!exampleSection.includes('bind:'), 'example basic Steps contains no binds');
assert(!exampleJs.includes('onStepsInput'));
assert(!exampleJs.includes('onStepsRetry'));
assert(!exampleJs.includes('previousStep'));

assert(api.includes('## Steps'));
assert(/\d+\. Steps/.test(compatibility));
assert(alignment.includes('| 33 | Steps | Steps / StepItem |'));
assert(fs.existsSync(path.join(root, 'docs/components/STEPS.md')), 'Steps semantic contract must exist');

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `steps/steps.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/steps/steps.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `steps source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/steps/steps.${extension}`);
  assert(fs.existsSync(installedFile), `steps example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `steps source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/steps/steps.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `steps source/WeChat npm ${extension} must stay identical`);
});

console.log('Steps contract tests passed.');
