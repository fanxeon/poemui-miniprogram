const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'popover/popover.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;
let timers = new Map();
let timerId = 0;

function setTimer(callback, delay) {
  const id = ++timerId;
  timers.set(id, { callback, delay: Number(delay) || 0, id });
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
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }) };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  setTimeout: setTimer,
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'Popover must register a component definition');

function create(overrides, rectangles) {
  timers = new Map();
  timerId = 0;
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const result = rectangles || [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
    createSelectorQuery() {
      return {
        select() { return this; },
        boundingClientRect() { return this; },
        exec(callback) { callback(result); },
      };
    },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const expectedProps = ['visible', 'defaultVisible', 'content', 'placement', 'showArrow', 'theme', 'closeOnClickOutside', 'fixed', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'Popover only exposes the lean TDesign-shaped contract plus PoemUI accessibility/motion fields');
assert.deepStrictEqual(Object.keys(definition.methods).sort(), ['fixedCoordinates', 'fitsPlacement', 'measurePosition', 'motionDuration', 'noop', 'onOutsideTap', 'requestVisibility', 'scheduleMeasure', 'syncPresentation', 'syncVisibility', 'themeOf', 'transitionTo'].sort());

const defaults = create();
assert.strictEqual(defaults.instance.data.rendered, false);
assert(defaults.instance.data.panelClass.includes('pui-popover__panel--top'));
assert(defaults.instance.data.panelStyle.includes('500ms'));

const uncontrolled = create({ defaultVisible: true });
assert.strictEqual(uncontrolled.instance.data.rendered, true);
assert.strictEqual(runNextTimer(), 0);
assert.strictEqual(uncontrolled.instance.data.active, true);
assert.strictEqual(uncontrolled.instance.onOutsideTap(), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.events)), [{ name: 'visible-change', detail: { visible: false } }]);
assert.strictEqual(uncontrolled.instance.data.active, false);
assert.strictEqual(runNextTimer(), 16);
assert.strictEqual(runNextTimer(), 500);
assert.strictEqual(uncontrolled.instance.data.rendered, false, 'leave keeps the Popover node through the actual motion duration');

const controlled = create({ visible: true });
runNextTimer();
assert.strictEqual(controlled.instance.onOutsideTap(), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(controlled.events)), [{ name: 'visible-change', detail: { visible: false } }]);
assert.strictEqual(controlled.instance.data.rendered, true, 'controlled Popover waits for the parent visible write-back');

const outsideLocked = create({ defaultVisible: true, closeOnClickOutside: false });
runNextTimer();
assert.strictEqual(outsideLocked.instance.onOutsideTap(), false);
assert.strictEqual(outsideLocked.events.length, 0, 'closeOnClickOutside=false must not invent a close request');

const measured = create({ defaultVisible: true, placement: 'top', fixed: true, reduceMotion: true }, [
  { top: 4, bottom: 36, left: 100, right: 180, width: 80, height: 32 },
  { top: 0, bottom: 80, left: 0, right: 160, width: 160, height: 80 },
]);
assert.strictEqual(runNextTimer(), 0);
assert.strictEqual(runNextTimer(), 16);
assert.strictEqual(measured.instance.data.placementClass, 'bottom', 'no space above flips top to bottom on the same axis');
assert(measured.instance.data.fixedStyle.includes('top:44px') && measured.instance.data.fixedStyle.includes('left:60px'), 'fixed mode uses measured viewport coordinates');
assert.strictEqual(measured.instance.motionDuration(), 1);

const horizontalPreferred = create({ defaultVisible: true, placement: 'left', reduceMotion: true }, [
  { top: 240, bottom: 272, left: 145, right: 225, width: 80, height: 32 },
  { top: 0, bottom: 80, left: 0, right: 180, width: 180, height: 80 },
]);
assert.strictEqual(runNextTimer(), 0);
assert.strictEqual(runNextTimer(), 16);
assert.strictEqual(horizontalPreferred.instance.data.placementClass, 'left', 'a requested horizontal placement must stay on that side when the measured space is readable');
assert.strictEqual(horizontalPreferred.instance.data.sideWidth, 137, 'left placement must publish the available side width instead of keeping a screen-overflowing fixed width');

const horizontalFlip = create({ defaultVisible: true, placement: 'left', reduceMotion: true }, [
  { top: 240, bottom: 272, left: 0, right: 80, width: 80, height: 32 },
  { top: 0, bottom: 80, left: 0, right: 180, width: 180, height: 80 },
]);
assert.strictEqual(runNextTimer(), 0);
assert.strictEqual(runNextTimer(), 16);
assert.strictEqual(horizontalFlip.instance.data.placementClass, 'right', 'Popover may flip only when the requested side has no physical space and the opposite side is usable');
assert.strictEqual(horizontalFlip.instance.data.sideWidth, 180);

const horizontalVerticalFallback = create({ defaultVisible: true, placement: 'left', reduceMotion: true }, [
  { top: 240, bottom: 272, left: 0, right: 375, width: 375, height: 32 },
  { top: 0, bottom: 80, left: 0, right: 180, width: 180, height: 80 },
]);
assert.strictEqual(runNextTimer(), 0);
assert.strictEqual(runNextTimer(), 16);
assert(['top', 'bottom'].includes(horizontalVerticalFallback.instance.data.placementClass), 'Popover falls back vertically only after both horizontal sides have no physical width');

const directionalCoordinates = create().instance;
const directionalReference = { top: 240, bottom: 272, left: 145, right: 225, width: 80, height: 32 };
const directionalPanel = { width: 120, height: 80 };
assert.deepStrictEqual(JSON.parse(JSON.stringify(directionalCoordinates.fixedCoordinates('left', directionalReference, directionalPanel))), { top: 216, left: 17 }, 'left placement must subtract panel width from the anchor left edge');
assert.deepStrictEqual(JSON.parse(JSON.stringify(directionalCoordinates.fixedCoordinates('right', directionalReference, directionalPanel))), { top: 216, left: 233 }, 'right placement must begin after the anchor right edge');

const wxml = fs.readFileSync(path.join(root, 'popover/popover.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'popover/popover.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'popover/popover.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/POPOVER.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert(wxml.includes('<slot></slot>'));
assert(wxml.includes('<slot name="content"></slot>'));
assert(wxml.includes('catchtap="onOutsideTap"'));
assert(wxml.includes('catchtouchmove="noop"'));
assert(!/pui-button|pui-loading|pui-empty|slot="reference"|slot="footer"/.test(wxml));
assert.deepStrictEqual(json.usingComponents || {}, {});
assert(!/height\s*:\s*auto[^;]*;[^}]*transition|display\s*:\s*none/.test(wxss));
assert(wxss.includes('transition: opacity var(--pui-popover-duration)'));
assert(wxss.includes('.pui-popover__panel--fixed'));
assert(wxss.includes('var(--pui-frosted-filter)'));
assert(wxss.includes('--pui-popover-anchor-gap: var(--pui-content-gap)'));
assert(!/calc\(100% \+ 16rpx\)/.test(wxss), 'Popover anchor gap must use a semantic PUI token');
assert(/\.pui-popover__panel--left[^}]*right:\s*calc\(100% \+ var\(--pui-popover-anchor-gap\)\)/.test(wxss), 'left placement must sit on the physical left side of its default Slot anchor');
assert(/\.pui-popover__panel--right[^}]*left:\s*calc\(100% \+ var\(--pui-popover-anchor-gap\)\)/.test(wxss), 'right placement must sit on the physical right side of its default Slot anchor');
assert(/\.pui-popover__panel--left[\s\S]*?\.pui-popover__panel--right-end\s*\{\s*width:\s*var\(--pui-popover-side-width, 360rpx\);\s*min-width:\s*0;\s*\}/.test(wxss), 'left/right Popover surfaces must consume the measured side-width token rather than becoming a text column or overflowing the viewport');
assert(source.includes('if (requestedWidth > 0)'));
assert(source.includes('if (oppositeWidth > 0)'));
assert(source.includes('--pui-popover-side-width:'));

const miniprogramPopoverWxml = fs.readFileSync(path.join(root, 'miniprogram/pages/components/popover/index.wxml'), 'utf8');
const miniprogramPopoverWxss = fs.readFileSync(path.join(root, 'miniprogram/pages/components/popover/index.wxss'), 'utf8');
assert(miniprogramPopoverWxml.includes('<view class="popover-page__reference">'), 'Popover component page must own its trigger alignment without changing Popover Slot semantics');
assert(miniprogramPopoverWxml.includes('visible="{{popoverVisible}}" placement="{{popoverPlacement}}"'), 'Popover component page must retain one visible instance so every direction is measured from the same user-facing trigger');
assert((miniprogramPopoverWxml.match(/<pui-popover /g) || []).length === 1, 'direction controls must not replace the component default Slot anchor with a second Popover instance');
assert(miniprogramPopoverWxml.includes('content="点击显示气泡" theme="primary" bind:click="onOpenPopover"'), 'Popover component page trigger must actually write controlled visible state');
assert(/\.popover-page__reference\s*\{[\s\S]*?width:\s*100%;[\s\S]*?justify-content:\s*center;[\s\S]*?\}/.test(miniprogramPopoverWxss), 'Popover component page trigger must be centered in its Section');
const miniprogramPopoverJs = fs.readFileSync(path.join(root, 'miniprogram/pages/components/popover/index.js'), 'utf8');
assert(miniprogramPopoverJs.includes("placement = placement || this.data.popoverPlacement || 'top';"), 'clicking the visible trigger must retain the currently selected placement');

assert.deepStrictEqual(metadata.apiProps.popover, expectedProps);
assert.deepStrictEqual(metadata.apiEvents.popover.map((event) => event.name), ['visible-change']);
assert.deepStrictEqual(metadata.apiSlots.popover.map((slot) => slot.name), ['default', 'content']);
assert.strictEqual(metadata.apiMethods.popover, undefined);

const popoverUsage = preview.slice(preview.indexOf("if (runtimeId === 'popover')"), preview.indexOf("if (runtimeId === 'back-top')"));
const popoverShowcase = preview.slice(preview.indexOf('function popoverShowcase('), preview.indexOf('\nfunction skeletonPreviewReduced', preview.indexOf('function popoverShowcase(')));
assert(popoverUsage.includes('<pui-popover ${attrs}>'));
assert(!popoverUsage.includes('bind:'), 'Popover basic WXML must stay minimal and bind-free');
assert(popoverShowcase.includes("buttonSample({ variant: 'outline'"));
assert(popoverShowcase.includes('popover-trigger') && popoverShowcase.includes('popover-outside'));
assert(!/loadingComponent|emptySample|cellSample|popover-retry|popover-footer|popover-reference-longpress|popover-open|popover-close/.test(popoverShowcase));
assert(preview.includes('function updatePopoverPreviewDom(demo)'));
assert(preview.includes("schedulePopoverPreviewPhase(demo, 16, 'entering')"));
assert(preview.includes("schedulePopoverPreviewPhase(demo, duration, 'leaving')"));
assert(preview.includes('if (canvas && demo.popoverMounted)'));
const popoverActions = preview.slice(preview.indexOf("} else if (type === 'popover-trigger')"), preview.indexOf("} else if (type === 'action-sheet-open')"));
assert(!popoverActions.includes('renderStage()'), 'Popover visibility actions must not replace the Stage during motion');
assert(preview.includes("if (type === 'popover-trigger')"));
assert(!/popover-reference-longpress|popover-overlay|popover-retry|popover-footer/.test(preview));
assert(previewStyles.includes('Popover final H5 contract'));
assert(previewStyles.includes('.pui-popover-showcase__canvas.is-fixed .pui-popover-preview'));
assert(previewStyles.includes('.pui-popover-showcase__reference {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);'), 'Popover trigger must stay geometrically centered for every placement');
assert(previewStyles.includes('width: min(180px, calc(50% - (var(--pui-preview-panel-padding) * 2)));'), 'left/right Popover previews must receive a readable constrained width');
assert(previewStyles.includes('min-width: 144px;'), 'left/right Popover previews must not collapse to the generic 90px column');
assert(previewStyles.includes('--pui-popover-preview--light') || previewStyles.includes('.pui-popover-preview--light'));
assert(/\.pui-popover-preview__content\s*\{[^}]*opacity:\s*1;[^}]*pointer-events:\s*auto;[^}]*transform:\s*none;/s.test(previewStyles), 'Popover content must override obsolete state-layer opacity and remain visible');
const popoverCompatibilityMirror = preview.slice(preview.indexOf("if (compatId === 'popover')"), preview.indexOf("if (compatId === 'sheet')", preview.indexOf("if (compatId === 'popover')")));
assert(popoverCompatibilityMirror.includes('唯一 visible-change({ visible })'));
assert(!/tap\/longpress\/manual|reference\/title\/default\/footer|error > loading > content > empty|open\(\)\/close\(\)\/toggle\(\)/.test(popoverCompatibilityMirror));

const popoverApi = api.slice(api.indexOf('## Popover'), api.indexOf('## ActionSheet'));
assert(popoverApi.includes('`visible-change`'));
assert(popoverApi.includes('没有实例方法'));
assert(popoverApi.includes('<pui-popover content="更多操作">'));
assert(!/`trigger`|`loading`|`retry`|`open\(\)`|`close\(\)`|`after-open`/.test(popoverApi));
const popoverCompatibility = compatibility.slice(compatibility.indexOf('50. Popover'), compatibility.indexOf('51. Tooltip'));
assert(popoverCompatibility.includes('唯一 `visible-change({ visible })`'));
for (const heading of ['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环']) assert(contract.includes(heading), `Popover contract must include ${heading}`);
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contract.includes('https://tdesign.tencent.com/miniprogram/components/popover'));
assert(contractIndex.includes('[Popover](./POPOVER.md)'));

const examplePopover = exampleWxml.slice(exampleWxml.indexOf('<pui-popover'), exampleWxml.indexOf('</pui-popover>') + '</pui-popover>'.length);
assert(examplePopover.includes('bind:visible-change="onPopoverVisibleChange"'));
assert(!/bind:(input|change|open|close|retry|after-open|after-close)|loading=|error=|trigger=/.test(examplePopover));
assert(exampleJs.includes('onPopoverVisibleChange'));
assert(!/onPopover(?:Input|Change|Open|Close|Retry)|popoverLoading|popoverError/.test(exampleJs));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const distPath = path.join(root, `miniprogram_dist/popover/popover.${extension}`);
  if (!fs.existsSync(distPath)) return;
  assert(fs.readFileSync(path.join(root, `popover/popover.${extension}`)).equals(fs.readFileSync(distPath)), `generated Popover ${extension} must match source`);
});

console.log('Popover contract tests passed.');
