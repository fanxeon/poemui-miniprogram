const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'indexes/indexes.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  require: () => ({}),
  Component: (value) => { definition = value; },
  setTimeout,
  clearTimeout,
}, { filename: 'indexes/indexes.js' });
assert(definition, 'Indexes component definition must be registered');

const PUBLIC_PROPS = [
  'items', 'current', 'defaultCurrent', 'indexList', 'showFullIndex', 'height', 'sticky',
  'stickyOffset', 'indexPosition', 'clickable', 'readonly', 'disabled', 'loading',
  'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Indexes publishes only the 20 reviewed Props');
['value', 'defaultValue', 'showIndex', 'showGroupTitle', 'customHeader', 'customFooter', 'duration', 'easing']
  .forEach((key) => assert(!definition.properties[key], `${key} must not return to the public Indexes API`));

const GROUPS = [
  { index: 0, title: '数字零', items: [{ label: 'Number', value: 0, badge: 0 }] },
  { index: '0', title: '字符串零', children: [{ label: 'String', value: '0' }] },
  { index: 'AA', title: '完整索引', items: [{ label: 'Alpha', value: false }] },
  { index: 1, title: '禁用组', disabled: true, items: [{ label: 'Disabled' }] },
  { index: false, items: [{ label: '无效布尔' }] },
  { index: '', items: [{ label: '无效空字符串' }] },
  { index: ' A ', items: [{ label: '无效空白' }] },
  { index: 0, items: [{ label: '重复零' }] },
];
const ALPHABET_GROUPS = Array.from({ length: 26 }, (_, index) => {
  const letter = String.fromCharCode(65 + index);
  return { index: letter, title: letter, items: [{ label: `Item ${letter}`, value: letter }] };
});

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

const uncontrolled = create({ items: GROUPS, defaultCurrent: 0, indexList: ['AA', 0, '0', false, 1], showFullIndex: true });
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.groups, (group) => group.index), [0, '0', 'AA', 1], 'invalid and duplicate group indexes are removed');
assert.strictEqual(uncontrolled.instance.data.innerCurrent, 0);
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.navigation, (item) => item.index), ['AA', 0, '0', 1]);
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.navigation, (item) => item.display), ['AA', '0', '0', '1']);
uncontrolled.instance.requestGroup(1, 'index', true);
assert.strictEqual(uncontrolled.instance.data.innerCurrent, '0', 'number 0 and string 0 remain distinct');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['select', 'change']);
assert.strictEqual(uncontrolled.events[0].detail.previousCurrent, 0);
assert.strictEqual(uncontrolled.events[1].detail.current, '0');
uncontrolled.events.length = 0;
uncontrolled.instance.requestGroup(1, 'index', true);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['select'], 'reselect emits select but not change');

const controlled = create({ items: GROUPS, current: 0 });
controlled.instance.requestGroup(2, 'index', true);
assert.strictEqual(controlled.instance.data.innerCurrent, 0, 'controlled Indexes waits for parent write-back');
assert.deepStrictEqual(controlled.events.map((event) => event.name), ['select', 'change']);
assert.strictEqual(controlled.events[1].detail.controlled, true);
controlled.instance.properties.current = 'AA';
controlled.instance.syncState();
controlled.instance.properties.current = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerCurrent, 'AA', 'controlled to uncontrolled keeps the last valid controlled value');

const unmatched = create({ items: GROUPS, current: 'missing' });
assert.strictEqual(unmatched.instance.data.innerCurrent, null, 'unmatched controlled current does not fake the first group');
assert.strictEqual(unmatched.instance.data.activeGroupIndex, -1);
const disabledCurrent = create({ items: GROUPS, current: 1 });
assert.strictEqual(disabledCurrent.instance.data.innerCurrent, null, 'controlled current must not activate a disabled group');

const hiddenNavigation = create({ items: GROUPS, current: null, indexList: [] });
assert.deepStrictEqual(Array.from(hiddenNavigation.instance.data.navigation), [], 'indexList=[] explicitly hides navigation');

const locked = create({ items: GROUPS, defaultCurrent: 0, readonly: true });
locked.instance.onEntryClick({ currentTarget: { dataset: { groupIndex: 0, itemIndex: 0 } } });
assert.deepStrictEqual(locked.events, [], 'readonly blocks item-click');
locked.instance.properties.readonly = false;
locked.instance.onEntryClick({ currentTarget: { dataset: { groupIndex: 0, itemIndex: 0 } } });
assert.deepStrictEqual(locked.events.map((event) => event.name), ['item-click']);
locked.events.length = 0;
locked.instance.properties.disabled = true;
assert.strictEqual(locked.instance.requestGroup(1, 'index', true), false);
locked.instance.onRetry();
assert.deepStrictEqual(locked.events, [], 'disabled blocks navigation and retry');

const touch = create({ items: GROUPS, defaultCurrent: 0 });
touch.instance._barRect = { top: 0, height: 80 };
touch.instance.handleIndexTouch({ touches: [{ clientY: 45 }] }, false);
assert.deepStrictEqual(touch.events.map((event) => event.name), ['select', 'change'], 'touch selection follows select then change');
assert.strictEqual(touch.events[1].detail.source, 'touch');

const alphabet = create({ items: ALPHABET_GROUPS, defaultCurrent: 'A' });
const styleNumber = (name) => {
  const match = alphabet.instance.data.rootStyle.match(new RegExp(`${name}:([\\d.]+)rpx`));
  return match ? Number(match[1]) : NaN;
};
assert.strictEqual(alphabet.instance.data.navigation.length, 26, 'default 680rpx track keeps the complete A-Z index');
assert.strictEqual(styleNumber('--pui-indexes-height'), 680);
assert(styleNumber('--pui-indexes-rail-height') <= 640.01, 'A-Z track stays inside the 20rpx top and bottom insets');
assert(styleNumber('--pui-indexes-rail-item-height') >= 24, 'default A-Z track retains a readable item budget');
alphabet.instance._barRect = { top: 10, height: styleNumber('--pui-indexes-rail-height') };
alphabet.instance._bodyRect = { top: 0, height: 340 };
alphabet.instance.onIndexTouchStart({ touches: [{ clientY: 10 }] });
assert.strictEqual(alphabet.events[0].detail.current, 'A', 'track top resolves to A');
alphabet.instance.onIndexTouchMove({ touches: [{ clientY: 330 }] });
assert.strictEqual(alphabet.instance.data.indexPreviewVisible, true, 'dragging immediately opens the enlarged current-index preview');
assert.strictEqual(alphabet.instance.data.indexPreviewText, 'N', 'drag preview follows the actual midpoint index');
alphabet.instance.onIndexTouchMove({ touches: [{ clientY: 649.9 }] });
assert.strictEqual(alphabet.instance.data.indexPreviewText, 'Z', 'track bottom resolves to Z without a nested scrollbar offset');
const touchEventCount = alphabet.events.length;
alphabet.instance.onIndexTouchMove({ touches: [{ clientY: 649.9 }] });
assert.strictEqual(alphabet.events.length, touchEventCount, 'moving inside the same index does not duplicate select/change');
alphabet.instance.onIndexTouchEnd({ changedTouches: [{ clientY: 649.9 }] });
assert.strictEqual(alphabet.instance.data.indexPreviewVisible, false, 'touchend closes the enlarged preview');
alphabet.instance.onIndexClick({ currentTarget: { dataset: { groupIndex: 25 } } });
assert.strictEqual(alphabet.events.length, touchEventCount, 'the synthetic click after touch is suppressed');
alphabet.instance.onIndexTouchStart({ touches: [{ clientY: 330 }] });
alphabet.instance.onIndexTouchMove({ touches: [{ clientY: 330 }] });
alphabet.instance.onIndexTouchCancel();
assert.strictEqual(alphabet.instance.data.indexPreviewVisible, false, 'touchcancel closes the enlarged preview');

const fullIndex = create({
  items: [
    { index: '华北', children: [{ label: '北京' }] },
    { index: '华东地区', children: [{ label: '上海' }] },
  ],
  showFullIndex: true,
  indexPosition: 'left',
});
assert.deepStrictEqual(Array.from(fullIndex.instance.data.navigation, (item) => item.display), ['华北', '华东地区']);
assert(fullIndex.instance.data.rootClass.includes('pui-indexes--full-index'));
assert(fullIndex.instance.data.rootClass.includes('pui-indexes--bar-left'));
const invalidHeight = create({ items: ALPHABET_GROUPS, height: Number.NaN });
assert(invalidHeight.instance.data.rootStyle.includes('--pui-indexes-height:680rpx'), 'invalid height falls back to the public 680rpx default');

const scroll = create({ items: GROUPS, defaultCurrent: 0 });
scroll.instance._groupOffsets = [{ index: 0, top: 0 }, { index: 1, top: 100 }, { index: 2, top: 200 }, { index: 3, top: 300 }];
scroll.instance._viewportHeight = 100;
scroll.instance._programmaticCurrent = undefined;
scroll.instance.onScroll({ detail: { scrollTop: 120, scrollHeight: 500 } });
assert.deepStrictEqual(scroll.events.map((event) => event.name), ['change'], 'manual scroll emits change only');
assert.strictEqual(scroll.events[0].detail.source, 'scroll');
scroll.events.length = 0;
scroll.instance._programmaticCurrent = 'AA';
scroll.instance.onScroll({ detail: { scrollTop: 400, scrollHeight: 500 } });
assert.deepStrictEqual(scroll.events, [], 'programmatic short-tail scrolling must not replace the requested active letter with the final group');
assert.strictEqual(scroll.instance._programmaticCurrent, 'AA', 'reaching the requested group must not end the full 620ms suppression window early');

const controlledScroll = create({ items: GROUPS, current: 0 });
controlledScroll.instance.cancelProgrammatic();
controlledScroll.instance._groupOffsets = [{ index: 0, top: 0 }, { index: 1, top: 100 }, { index: 2, top: 200 }, { index: 3, top: 300 }];
controlledScroll.instance._viewportHeight = 100;
controlledScroll.instance.onScroll({ detail: { scrollTop: 120, scrollHeight: 500 } });
assert.strictEqual(controlledScroll.events[0].detail.source, 'scroll');
const previousAnchor = controlledScroll.instance.data.scrollIntoView;
controlledScroll.instance.properties.current = '0';
controlledScroll.instance.syncState();
assert.strictEqual(controlledScroll.instance._programmaticCurrent, undefined, 'scroll-originated controlled write-back does not restart anchor motion');
assert.strictEqual(controlledScroll.instance.data.scrollIntoView, previousAnchor, 'scroll-originated controlled write-back keeps the current physical scroll position');
controlledScroll.instance.properties.current = 'AA';
controlledScroll.instance.syncState();
assert.strictEqual(controlledScroll.instance.data.scrollIntoView, 'pui-indexes-group-2', 'an external controlled change still performs real anchor positioning');

locked.instance.onScroll({ detail: { scrollTop: 160, scrollHeight: 500 } });
assert.strictEqual(locked.instance._lastScrollTop, 160, 'disabled Indexes still records physical scroll for read-only browsing');

const states = create({ items: GROUPS, loading: true, error: true, reduceMotion: false });
assert.strictEqual(states.instance.data.stateType, 'error');
assert(states.instance.data.rootStyle.includes('500ms'));
states.instance.properties.reduceMotion = true;
states.instance.syncState();
assert(states.instance.data.rootStyle.includes('1ms'));
const retry = create({ items: GROUPS, error: true });
retry.instance.onRetry();
assert.deepStrictEqual(retry.events.map((event) => event.name), ['retry']);
assert.strictEqual(retry.instance.data.stateType, 'error', 'component retry only requests recovery and never fabricates success');

const wxml = fs.readFileSync(path.join(root, 'indexes/indexes.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'indexes/indexes.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'indexes/indexes.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');

['pui-cell', 'pui-badge', 'pui-button', 'pui-loading', 'pui-empty'].forEach((name) => assert(json.usingComponents[name], `${name} composition must be declared`));
assert(wxml.includes('catchtouchmove="onIndexTouchMove"'));
assert(wxml.includes('catchtouchcancel="onIndexTouchCancel"'));
assert(wxml.includes('bindscroll="onScroll"'));
assert(wxml.includes('class="pui-indexes__bar-item" role="button"'), 'Indexes letters are the component-own semantic interaction roots');
assert(wxml.includes('aria-disabled="{{disabled || loading || error || item.disabled}}"'), 'Indexes component-own index roots expose their disabled state');
assert(wxml.includes('<text class="pui-indexes__bar-label">{{item.display}}</text>'), 'Indexes labels use a dedicated centerable text node');
assert(!wxml.includes('<pui-button custom-class="pui-indexes__bar-item"'), 'Indexes must not wrap its compact gesture targets in a general PUI Button');
assert(wxml.includes('enhanced show-scrollbar="{{false}}"'), 'Indexes must hide the redundant native scrollbar when the letter bar already communicates position');
assert(wxml.includes('aria-hidden="{{stateType !== \'content\'}}"'), 'inactive native content leaves the accessibility tree');
assert(wxml.includes('aria-hidden="{{stateType !== \'content\' || !navigation.length}}"'), 'inactive native navigation leaves the accessibility tree');
assert(wxml.includes('pui-indexes__index-preview') && wxml.includes('aria-hidden="true"'), 'drag preview is non-interactive visual feedback');
assert(source.includes('INDEXES_MOTION_DURATION + PROGRAMMATIC_SCROLL_SETTLE'), 'programmatic scroll suppression must cover the full 500ms anchor animation plus the settling window');
assert(wxss.includes('.pui-indexes__bar-item {') && wxss.includes('align-items: center;') && wxss.includes('justify-content: center;'), 'Indexes compact interaction root must geometrically center within the dynamic track');
assert(
  wxss.includes('.pui-indexes__bar-item-wrap::before')
    && wxss.includes('width: var(--pui-indexes-rail-item-height);')
    && wxss.includes('height: var(--pui-indexes-rail-item-height);')
    && wxss.includes('transform: translate(-50%, -50%) scale(1);'),
  'Indexes active marker must be a square circle sharing the exact wrapper center instead of stretching across the wider hit target',
);
assert(
  wxss.includes('--pui-indexes-label-optical-x: .5px;')
    && wxss.includes('--pui-indexes-label-optical-y: .25px;')
    && wxss.includes('.pui-indexes__bar-label {')
    && wxss.includes('line-height: 1;')
    && wxss.includes('text-align: center;')
    && wxss.includes('transform: translate(var(--pui-indexes-label-optical-x), var(--pui-indexes-label-optical-y));'),
  'Indexes labels must use a centered unit line box plus the single measured system-font optical correction',
);
assert(!wxss.includes('translateY(calc(0rpx - var(--pui-space-sm)))'), 'Indexes selected copy must not be shifted into a clipped position');
assert(wxss.includes('.pui-indexes__state--error {\n  padding-bottom: calc(var(--pui-space-xl) + var(--pui-space-normal));'), 'native Indexes error state reserves bottom action clearance');
assert(wxss.includes('padding-right: calc(var(--pui-indexes-rail-width) + var(--pui-space-normal));'), 'Indexes entry rows reserve the dynamic right track so badges and actions never collide with it');
assert(wxss.includes('.pui-indexes--bar-left .pui-indexes__heading { padding-left: calc(var(--pui-indexes-rail-width) + var(--pui-space-normal));'), 'left track reserves the heading as well as entry rows');
assert(wxss.includes('position: absolute;') && wxss.includes('max-height: calc(100% - var(--pui-space-normal) - var(--pui-space-normal));'), 'Indexes bar must stay inside its own component body instead of attaching to the screen');
assert(!wxss.includes('overflow-y: auto'), 'bounded letter track must not create a second grey scrollbar');
assert(wxss.includes('.pui-indexes__index-preview') && wxss.includes('pointer-events: none;'), 'enlarged drag preview cannot intercept the gesture');
assert(wxss.includes('.pui-indexes__body') && wxss.includes('background: transparent;'), 'Indexes root remains the only collection Surface in frosted mode');
assert(!wxss.includes('.pui-indexes--disabled .pui-indexes__body { pointer-events: none; }'), 'disabled does not remove read-only physical scrolling');
assert(wxml.includes('bind:click="onEntryClick"'));
assert(!wxml.includes('bind:action="onRetry"'), 'Empty no longer publishes an action event');
assert(
  /<pui-button[^>]*id="pui-indexes-retry"[^>]*wx:if="\{\{retryText\}\}"[^>]*bind:click="onRetry"/.test(wxml),
  'Indexes retry stays a conditional PUI Button with a stable acceptance hook and real event binding',
);
assert(wxml.includes('bind:click="onRetry"'));
assert(!wxml.includes('<slot'));
assert(!wxml.includes('pui-indexes__header'));
assert(!wxml.includes('pui-indexes__footer'));
assert(!/transition\s*:[^;]*\bheight\s*:\s*auto/.test(wxss));
assert(!wxss.includes('text-overflow: ellipsis'));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));
assert(wxss.includes('.pui-indexes__bar {\n  position: absolute;'), 'native Indexes sidebar must stay bounded by the component body');
assert(wxss.includes('top: 50%;\n  bottom: auto;'), 'native bounded Indexes sidebar must be vertically centered');
assert(
  wxss.includes('.pui-indexes--bar-right .pui-indexes__entries,')
    && wxss.includes('padding-right: calc(var(--pui-indexes-rail-width) + var(--pui-space-normal));'),
  'native Indexes entry rows and heading must reserve the bounded dynamic sidebar track',
);
assert(previewStyles.includes('.pui-indexes-preview.is-bar-right .pui-indexes-preview__group > div,')
  && previewStyles.includes('padding-right: calc(var(--pui-indexes-preview-rail-width) + var(--pui-preview-space-normal));'), 'H5 Indexes entry rows and heading must reserve the same dynamic bounded sidebar track');
assert(previewStyles.includes('.pui-indexes-preview__scroll::-webkit-scrollbar { width: 0; height: 0; }'), 'H5 Indexes must not reserve a browser scrollbar gutter that narrows direct Cell rows');

assert.deepStrictEqual(metadata.apiProps.indexes, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups.indexes.flatMap((group) => group.keys), PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents.indexes.map((event) => event.name), ['select', 'change', 'item-click', 'retry']);
assert.strictEqual(metadata.apiSlots.indexes, undefined);
assert.strictEqual(metadata.apiMethods.indexes, undefined);

const previewSource = preview.slice(preview.indexOf('function indexesSame'), preview.indexOf('function sidebarValueKey'));
['<h3>基础用法</h3>', '<h3>索引显示</h3>', '<h3>条目与状态</h3>', '<h3>受控与边界</h3>']
  .forEach((heading) => assert(previewSource.includes(heading)));
assert(previewSource.includes('cellSample({'));
assert(previewSource.includes('badgeSample({'));
assert(previewSource.includes('loadingComponent({'));
assert(previewSource.includes('emptySample({'));
assert(preview.includes("updateCurrentProp('current', group.index)"), 'H5 controlled sample performs real parent Prop write-back');
assert(preview.includes("if (id === 'indexes') {\n    bindIndexesPreviewRuntime(props);"), 'Indexes route must bind its H5 scroll and drag runtime after every preview render');
assert(preview.includes("querySelectorAll('[data-indexes-group-index]')"), 'H5 runtime measures the real group marker used by markup');
assert(preview.includes("bar.addEventListener('pointermove'"), 'H5 mirrors touch drag with Pointer Events');
assert(preview.includes("bar.addEventListener('mousemove'"), 'H5 keeps a mouse drag fallback for desktop battle and accessibility hardware');
assert(previewSource.includes('data-indexes-magnifier'), 'H5 includes the enlarged current-index preview');
assert(preview.includes('indexesPreviewHoldTimer'), 'H5 long press reveals the enlarged index after the shared hold delay');
assert(preview.includes('state.previewIndexesAbort = new AbortController()'), 'Indexes runtime owns an abortable listener lifecycle');
assert(preview.includes('const signal = state.previewIndexesAbort.signal'), 'Indexes drag and scroll listeners use a defined signal');
assert(preview.includes('area.isConnected'), 'Indexes animation must stop only after its real scroll area has unmounted');
assert(preview.includes('area.scrollTop + area.clientHeight >= area.scrollHeight - 2'), 'H5 manual scrolling uses the native short-tail boundary to activate the final group');
assert(preview.includes(`tabindex="\${contentInactive ? '-1' : '0'}"`), 'inactive Indexes content must leave the keyboard tab order');
assert(preview.includes(`\${contentInactive ? ' inert' : ''}`), 'inactive Indexes layers must be inert instead of retaining hidden controls');
assert(previewStyles.includes('.pui-indexes-showcase > .pui-showcase-section + .pui-showcase-section'));
assert(previewStyles.includes('touch-action: none'));
assert(previewStyles.includes('.pui-indexes-preview__bar {\n  position: absolute;\n  z-index: 3;\n  top: 50%;\n  bottom: auto;'), 'H5 PreviewDevice must bound the fixed sidebar simulation to the component viewport');
assert(previewStyles.includes('translate(0, -50%) scale(1)'), 'Indexes H5 fixed sidebar simulation must preserve vertical centering when active');
assert(!previewStyles.includes('.pui-indexes-preview__entry .pui-cell__main strong'));
const indexesEntrySurface = 'body .app-shell[data-page-mode] .preview-stage .pui-indexes-preview .pui-indexes-preview__entry.pui-cell';
assert(previewStyles.includes(`${indexesEntrySurface} {\n  background: transparent;\n  border-color: transparent;\n  border-radius: 0;\n  box-shadow: none;`), 'Indexes direct Cell entries must remain transparent and shadowless inside their collection Surface');
assert(previewStyles.includes(`${indexesEntrySurface} + .pui-indexes-preview__entry.pui-cell {\n  margin-top: 0;`), 'Indexes direct Cell entries must remain a continuous list instead of becoming spaced cards');
assert(previewSource.includes('class="pui-indexes-preview__bar-item') && previewSource.includes('role="button"'), 'Indexes H5 letters use component-owned semantic roots');
assert(!previewSource.includes('buttonSample({ content: item.display'), 'Indexes H5 compact rail does not force the general Button geometry');
assert(previewStyles.includes('.pui-indexes-preview__bar-item {\n  position: relative;\n  box-sizing: border-box;\n  display: flex;'), 'Indexes H5 interaction root centers its label without inline baseline overhang');
assert(previewStyles.includes('--pui-indexes-preview-active-radius: 50%;') && previewStyles.includes('.pui-indexes-preview__bar-item::before') && previewStyles.includes('border-radius: var(--pui-indexes-preview-active-radius);'), 'Indexes H5 active marker remains a centered circle through its component geometry token');
assert(previewStyles.includes('.pui-indexes-preview__magnifier.is-active'), 'Indexes H5 enlarged preview has a real active state');
assert(previewStyles.includes('.pui-indexes-preview__state.is-error {\n  padding-bottom: calc(var(--pui-preview-space-xl) + var(--pui-preview-space-normal));'), 'H5 Indexes error state mirrors bottom action clearance');
assert(wxml.includes("disabled=\"{{disabled || stateType !== 'error'}}\""), 'inactive native retry Button must not remain actionable behind another state');
assert.strictEqual(definition.properties.height.value, 680, 'Indexes supplies the taller default scroll budget');

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'indexes')"), preview.indexOf("if (runtimeId === 'sidebar')"));
assert(!usageSource.includes('bind:'), 'Indexes basic WXML contains no event bindings');
assert(!usageSource.includes('pui-icon'));
assert(usageSource.includes('items="{{groups}}"'));
assert(usageSource.includes('current="{{activeIndex}}"'));
assert(usageSource.includes('aria-label="${escapeHtml(props.ariaLabel'));
const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Indexes 基础用法"'), exampleWxml.indexOf('<pui-card title="Sidebar'));
assert(exampleSection.includes('<pui-indexes'));
assert(!exampleSection.includes('bind:'), 'example basic Indexes contains no binds');
['onIndexesIndexClick', 'onIndexesScrollIndex', 'onIndexesInput', 'scrollIndexesToC'].forEach((name) => assert(!exampleJs.includes(name)));

assert(api.includes('## Indexes'));
assert(api.includes('Indexes 不公开 Slot 和实例方法'));
assert(/\d+\. Indexes/.test(compatibility));
assert(compatibility.includes('集合根是唯一承接阴影、毛玻璃和语义圆角的 Surface'));
assert(alignment.includes('| 34 | Indexes | Indexes / IndexesAnchor |'));
assert(fs.existsSync(path.join(root, 'docs/components/INDEXES.md')));

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const sourceFile = path.join(root, `indexes/indexes.${extension}`);
    const distFile = path.join(root, `miniprogram_dist/indexes/indexes.${extension}`);
    assert.strictEqual(sha(sourceFile), sha(distFile), `indexes source/dist ${extension} must stay identical`);
    const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/indexes/indexes.${extension}`);
    assert(fs.existsSync(installedFile), `indexes example install ${extension} must exist`);
    assert.strictEqual(sha(sourceFile), sha(installedFile), `indexes source/example install ${extension} must stay identical`);
    const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/indexes/indexes.${extension}`);
    if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `indexes source/WeChat npm ${extension} must stay identical`);
  });
}

definition.lifetimes.detached.call(uncontrolled.instance);
definition.lifetimes.detached.call(controlled.instance);
definition.lifetimes.detached.call(unmatched.instance);
definition.lifetimes.detached.call(disabledCurrent.instance);
definition.lifetimes.detached.call(hiddenNavigation.instance);
definition.lifetimes.detached.call(locked.instance);
definition.lifetimes.detached.call(touch.instance);
definition.lifetimes.detached.call(alphabet.instance);
definition.lifetimes.detached.call(fullIndex.instance);
definition.lifetimes.detached.call(invalidHeight.instance);
definition.lifetimes.detached.call(scroll.instance);
definition.lifetimes.detached.call(controlledScroll.instance);
definition.lifetimes.detached.call(states.instance);
definition.lifetimes.detached.call(retry.instance);

console.log('Indexes contract tests passed.');
require('./test-sidebar');
require('./test-back-top');
require('./test-sticky');
require('./test-loading');
