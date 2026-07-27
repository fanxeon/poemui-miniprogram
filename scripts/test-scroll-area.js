const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'scroll-area/scroll-area.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;

vm.runInNewContext(source, {
  Array,
  Boolean,
  Math,
  Number,
  String,
  isFinite,
  require() { return {}; },
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'ScrollArea component definition must be registered');

const PUBLIC_PROPS = ['height', 'scrollTop', 'scrollIntoView', 'gradientOverlay', 'gradientOverlayColor', 'gradientOverlaySize', 'contentPaddingBottom', 'ariaLabel'];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'ScrollArea only exposes its reviewed ScrollView-shaped props, fixed overlay extension, and semantic label');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'dark' }, overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : ''; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback.call(this); },
    triggerEvent() {},
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

const defaults = create();
assert.strictEqual(defaults.data.rootStyle, 'height:320rpx;');
assert.strictEqual(defaults.data.viewportStyle, 'height:100%;');
assert.strictEqual(defaults.data.contentStyle, 'padding-bottom:10vh;');
assert.strictEqual(defaults.data.targetScrollTop, 0);
assert.strictEqual(defaults.data.targetId, '');
assert.strictEqual(defaults.data.semanticLabel, '滚动内容');
assert.strictEqual(defaults.data.rootClass, 'pui-scroll-area pui-theme--dark');
assert.strictEqual(defaults.data.showGradientOverlay, true);
assert.strictEqual(defaults.data.showTopGradient, false, 'top gradient must stay hidden at the initial scroll edge');
assert.strictEqual(defaults.data.showBottomGradient, false, 'before native edge measurement, no static gradient may create a false divider');
assert.strictEqual(defaults.data.gradientOverlayStyle, '--pui-scroll-area-gradient-overlay-color:var(--pui-scroll-area-gradient-overlay-color-context);--pui-scroll-area-gradient-overlay-size:var(--pui-scroll-area-gradient-overlay-size-md);');
defaults._viewportHeight = 100;
defaults.onViewportScroll({ detail: { scrollTop: 0, scrollHeight: 300 } });
assert.strictEqual(defaults.data.showTopGradient, false, 'at top only the lower reading edge may appear');
assert.strictEqual(defaults.data.showBottomGradient, true);
defaults.onViewportScroll({ detail: { scrollTop: 80, scrollHeight: 300 } });
assert.strictEqual(defaults.data.showTopGradient, true, 'middle position must reveal the upper edge');
assert.strictEqual(defaults.data.showBottomGradient, true, 'middle position must retain the lower edge');
defaults.onViewportScroll({ detail: { scrollTop: 200, scrollHeight: 300 } });
assert.strictEqual(defaults.data.showTopGradient, true, 'at bottom only the upper reading edge may appear');
assert.strictEqual(defaults.data.showBottomGradient, false);

const controlled = create({ height: '160px', scrollTop: 240, scrollIntoView: '  build-log  ', gradientOverlay: false, gradientOverlayColor: '#fef3c7', gradientOverlaySize: 'lg', contentPaddingBottom: '160rpx', ariaLabel: '  构建日志  ' });
assert.strictEqual(controlled.data.rootStyle, 'height:160px;');
assert.strictEqual(controlled.data.viewportStyle, 'height:100%;');
assert.strictEqual(controlled.data.contentStyle, 'padding-bottom:160rpx;');
assert.strictEqual(controlled.data.targetScrollTop, 240);
assert.strictEqual(controlled.data.targetId, 'build-log');
assert.strictEqual(controlled.data.semanticLabel, '构建日志');
assert.strictEqual(controlled.data.showGradientOverlay, false);
assert.strictEqual(controlled.data.gradientOverlayStyle, '--pui-scroll-area-gradient-overlay-color:#fef3c7;--pui-scroll-area-gradient-overlay-size:var(--pui-scroll-area-gradient-overlay-size-lg);');

const boundaries = create({ height: 'invalid', scrollIntoView: 0, ariaLabel: '' });
assert.strictEqual(boundaries.data.rootStyle, 'height:320rpx;', 'invalid height must use the documented fallback');
assert.strictEqual(boundaries.data.targetId, '0', '0 must remain a valid target id instead of being discarded');
assert.strictEqual(boundaries.data.semanticLabel, '滚动内容');
assert.strictEqual(create({ scrollTop: -20 }).data.targetScrollTop, 0, 'negative controlled scrollTop must clamp to the top');
assert.strictEqual(create({ gradientOverlayColor: 'rgba(255, 255, 255, .88)', gradientOverlaySize: 'sm' }).data.gradientOverlayStyle, '--pui-scroll-area-gradient-overlay-color:rgba(255, 255, 255, .88);--pui-scroll-area-gradient-overlay-size:var(--pui-scroll-area-gradient-overlay-size-sm);');
assert.strictEqual(create({ gradientOverlayColor: 'white; color:red', gradientOverlaySize: 'invalid' }).data.gradientOverlayStyle, '--pui-scroll-area-gradient-overlay-color:var(--pui-scroll-area-gradient-overlay-color-context);--pui-scroll-area-gradient-overlay-size:var(--pui-scroll-area-gradient-overlay-size-md);', 'invalid overlay color or size must not inject style declarations or alter the documented default');
assert.strictEqual(create({ contentPaddingBottom: '24' }).data.contentStyle, 'padding-bottom:24rpx;');
assert.strictEqual(create({ contentPaddingBottom: '8vh' }).data.contentStyle, 'padding-bottom:8vh;');
assert.strictEqual(create({ contentPaddingBottom: '0' }).data.contentStyle, 'padding-bottom:0;');
assert.strictEqual(create({ contentPaddingBottom: 'calc(10vh + 1px)' }).data.contentStyle, 'padding-bottom:10vh;', 'invalid bottom padding must not inject style declarations');

['0', '0rpx', '0px', '-8px'].forEach((height) => {
  assert.strictEqual(create({ height }).data.rootStyle, 'height:320rpx;', `${height} must not collapse ScrollArea; it must use the documented fallback`);
});

assert(source.includes('triggerEvent(\'scroll\''), 'ScrollArea must emit scroll events for back-top and similar consumers');
['scrollTo', 'scrollToTop', 'onScroll', 'onScrollToUpper', 'onScrollToLower', 'onBlock'].forEach((name) => {
  assert(!Object.prototype.hasOwnProperty.call(definition.methods, name), `${name} must not remain a public ScrollArea method`);
});
assert.strictEqual(typeof definition.methods.onViewportScroll, 'function', 'internal native scroll listener must only synchronize visual edges');
assert.strictEqual(typeof definition.methods.onViewportScrollToLower, 'function');
assert.strictEqual(typeof definition.methods.syncControlledScrollTop, 'function', '受控位置必须有独立同步路径，不能重建完整 ScrollArea 状态');
assert(!source.includes("'height,scrollTop,scrollIntoView,gradientOverlay"), 'scrollTop 不能与完整配置共用 observer，否则用户滚动回写会反复重建根状态');
const observerInstance = create({ scrollTop: 0 });
let fullSyncCalls = 0;
observerInstance.syncState = function syncStateSpy() { fullSyncCalls += 1; };
observerInstance.data.scrollTop = 180;
definition.observers.scrollTop.call(observerInstance);
assert.strictEqual(observerInstance.data.targetScrollTop, 180, 'scrollTop 回写必须只更新原生定位值');
assert.strictEqual(fullSyncCalls, 0, 'scrollTop 回写不得重新测量、重建渐变观察器或刷新根样式');
observerInstance.onViewportScroll({ detail: { scrollTop: 180, scrollHeight: 600 } });
observerInstance.data.scrollTop = 180;
definition.observers.scrollTop.call(observerInstance);
assert.strictEqual(observerInstance.data.targetScrollTop, 180, '父级回写当前用户手势位置时不得重新下发 scroll-top 抢占惯性');
observerInstance.data.scrollTop = 0;
definition.observers.scrollTop.call(observerInstance);
assert.strictEqual(observerInstance.data.targetScrollTop, 0, 'BackTop 写回 0 必须在用户滚动后仍能重新下发真实回顶定位');
assert(source.includes('targetScrollTop === this._lastEmittedScrollTop'), 'ScrollArea must explicitly ignore echoed user scroll positions before touching the native target');

const wxml = fs.readFileSync(path.join(root, 'scroll-area/scroll-area.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'scroll-area/scroll-area.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'scroll-area/scroll-area.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewCatalog = fs.readFileSync(path.join(root, 'preview/components-data.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SCROLL-AREA.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');

assert.deepStrictEqual(json.usingComponents, {});
assert(wxml.startsWith('<view'));
for (const required of ['class="pui-scroll-area__viewport"', 'type="list"', 'scroll-y', 'enhanced', 'show-scrollbar="{{false}}"', 'scroll-with-animation="{{true}}"', 'scroll-top="{{targetScrollTop}}"', 'scroll-into-view="{{targetId}}"', 'bindscroll="onViewportScroll"', 'bindscrolltolower="onViewportScrollToLower"', 'class="pui-scroll-area__content"', 'style="{{contentStyle}}"', '<slot></slot>', 'pui-scroll-area__edge-sentinel', 'wx:if="{{showTopGradient}}"', 'wx:if="{{showBottomGradient}}"', 'aria-hidden="true"']) {
  assert(wxml.includes(required), `ScrollArea WXML must include ${required}`);
}
assert(!/scroll-x|scroll-left|scroll-with-animation="\{\{(?!true\}\})|threshold|disabled|blocker/.test(wxml), 'ScrollArea must not regain unrelated configurable platform wrapper APIs');
assert(!/\.pui-scroll-area\s*\{[^}]*\b(?:background|border(?:-radius)?|padding|transition|overflow)\s*:/.test(wxss), 'ScrollArea root must stay transparent without a private Surface, animation, or clipping');
assert(wxss.includes('.pui-scroll-area__gradient'));
assert(wxss.includes('pointer-events: none;'));
assert(wxss.includes('linear-gradient(to bottom, var(--pui-scroll-area-gradient-overlay-color), transparent)'));
assert(wxss.includes('linear-gradient(to top, var(--pui-scroll-area-gradient-overlay-color), transparent)'));
assert(wxss.includes('.pui-scroll-area__edge-sentinel'));
assert(wxss.includes('.pui-scroll-area__content'));
assert(wxss.includes('min-height: 100%;'));
const themeWxss = fs.readFileSync(path.join(root, 'common/style/theme.wxss'), 'utf8');
assert(themeWxss.includes('--pui-scroll-area-gradient-overlay-size-sm: var(--pui-space-step-20);'));
assert(themeWxss.includes('--pui-scroll-area-gradient-overlay-size-md: var(--pui-space-step-32);'));
assert(themeWxss.includes('--pui-scroll-area-gradient-overlay-size-lg: var(--pui-space-step-44);'));
assert(themeWxss.includes('--pui-scroll-area-gradient-overlay-size: var(--pui-scroll-area-gradient-overlay-size-md);'));
assert(themeWxss.includes('--pui-scroll-area-gradient-overlay-color-context: var(--pui-bg-container);'));

assert.deepStrictEqual(metadata.apiProps['scroll-area'], PUBLIC_PROPS);
assert(previewCatalog.includes('"gradientOverlay"') && previewCatalog.includes('"gradientOverlayColor"') && previewCatalog.includes('"gradientOverlaySize"') && previewCatalog.includes('"contentPaddingBottom"'), 'generated H5 catalog must expose every ScrollArea visual Prop to the real Properties panel');
assert.deepStrictEqual(metadata.apiEvents['scroll-area'].map((event) => event.name), ['scroll']);
assert.deepStrictEqual(metadata.apiSlots['scroll-area'].map((slot) => slot.name), ['default']);
assert.strictEqual(metadata.apiMethods['scroll-area'], undefined);

const usage = preview.slice(preview.indexOf("if (runtimeId === 'scroll-area')"), preview.indexOf("if (runtimeId === 'popup')", preview.indexOf("if (runtimeId === 'scroll-area')")));
const showcase = preview.slice(preview.indexOf('function scrollAreaPreviewHeight'), preview.indexOf('function shadcnNativePreview'));
assert(usage.includes('<pui-scroll-area${attrs ? ` ${attrs}` : \'\'}>'));
assert(!usage.includes('bind:'), 'ScrollArea basic WXML must stay bind-free');
assert(showcase.includes('function bindScrollAreaPreviewRuntime(props)'));
assert(showcase.includes('function scrollAreaPreviewOverlayColor(value)'));
assert(showcase.includes('function scrollAreaPreviewOverlaySize(value)'));
assert(showcase.includes('function scrollAreaPreviewContentPaddingBottom(value)'));
assert(showcase.includes('pui-scroll-area-preview__content'));
assert(showcase.includes('padding-bottom:${escapeHtml(scrollAreaPreviewContentPaddingBottom(props.contentPaddingBottom))}'));
assert(showcase.includes("props.gradientOverlay !== false"));
assert(showcase.includes('data-scroll-area-gradient-overlay="top"'));
assert(showcase.includes('has-scroll-area-overflow') && showcase.includes('is-scroll-area-at-top') && showcase.includes('is-scroll-area-at-bottom'));
assert(showcase.includes('data-scroll-area-root'));
assert(showcase.includes('pui-scroll-area-preview__viewport'));
assert(showcase.includes('unitless && Number(unitless[1]) > 0'), 'H5 must reject zero bare heights before converting rpx to px');
assert(showcase.includes('rpx && Number(rpx[1]) > 0'), 'H5 must reject zero rpx heights before converting to px');
assert(showcase.includes('px && Number(px[1]) > 0'), 'H5 must reject zero px heights before rendering');
assert(showcase.includes('data-scroll-area-anchor'));
assert(showcase.includes("{ sm: '20px', md: '32px', lg: '44px' }[size] || '32px'"));
assert(showcase.includes('function scrollAreaPreviewScroll(area, top)'));
assert(showcase.includes('Math.abs(Number(area.scrollTop) - nextTop) <= 1'), 'H5 must ignore a controlled value that only echoes the current native user position');
assert(showcase.includes("area.scrollTo({ top: nextTop, behavior: reduced ? 'auto' : 'smooth' });"), 'H5 controlled positioning must use a real smooth scroll and respect reduced motion');
assert(showcase.includes('scrollAreaPreviewScroll(area, target.offsetTop - area.offsetTop);'));
assert(showcase.includes('scrollAreaPreviewScroll(area, Number.isFinite(requestedScrollTop) ? requestedScrollTop : 0);'), 'H5 must mirror controlled scrollTop when scrollIntoView is empty');
assert(preview.includes("'scroll-area': { height: '1128rpx'"), 'ScrollArea overview must use a deliberate full-content-height demo instead of leaving PreviewDevice blank');
assert(preview.includes('...(previewDemoInitialProps[previewIdFor(id)] || {}),'), 'ScrollArea tall demo height must be initialized as a preview-only override rather than replacing the public default');
assert(preview.includes("gradientOverlaySize: { type: 'select', value: 'md', options: ['sm', 'md', 'lg'] }"), 'the Properties panel must expose the constrained overlay size enum and its documented default');
assert(preview.includes("contentPaddingBottom: { type: 'text', value: '10vh' }"), 'the Properties panel must expose the default 10vh content bottom safety inset');
const scrollAreaPreviewEntryCount = (showcase.match(/\{ id: 'scroll-area-/g) || []).length;
assert.strictEqual(scrollAreaPreviewEntryCount, 18, 'ScrollArea overview must provide eighteen real PUI Cell slot entries for a meaningful scroll range');
assert(showcase.includes("title: '组件源码'") && showcase.includes("title: '交付复核'"), 'ScrollArea overview must use real component guidance content instead of fake release statuses');
assert(usage.includes('${scrollAreaPreviewUsageWxml()}'), 'ScrollArea generated WXML must reuse the same content list as the H5 preview');
assert(!/scroll-area-top|scroll-area-bottom|applyScrollAreaPreviewPosition|scrollAreaEvent|scrollWithAnimation/.test(showcase));
assert(preview.includes("if (id === 'scroll-area') {\n    bindScrollAreaPreviewRuntime(props);"));
assert(preview.includes("if (previewIdFor(id) === 'scroll-area')"), 'alias routes must receive the same ScrollArea API descriptions');
assert(styles.includes('.pui-scroll-area-preview__entry'));
assert(styles.includes('--pui-scroll-area-gradient-overlay-size-sm: var(--pui-preview-space-step-20);'));
assert(styles.includes('--pui-scroll-area-gradient-overlay-size-md: var(--pui-preview-space-step-32);'));
assert(styles.includes('--pui-scroll-area-gradient-overlay-size-lg: var(--pui-preview-space-step-44);'));
assert(styles.includes('.pui-scroll-area-preview__viewport'));
assert(styles.includes('.pui-scroll-area-preview__content'));
assert(styles.includes('.pui-scroll-area-preview__gradient'));
assert(styles.includes('pointer-events: none;'));
assert(styles.includes('.pui-scroll-area-preview.has-scroll-area-overflow:not(.is-scroll-area-at-top)'));
assert(!styles.includes('.scroll-area-demo'), 'legacy ScrollArea Surface styles must not remain and accidentally override the transparent root contract');
assert(!styles.includes('.pui-scroll-area-showcase__toolbar'));
assert(!styles.includes('.pui-scroll-area-preview__row'));

const apiSection = api.slice(api.indexOf('## ScrollArea'), api.indexOf('## Select'));
assert(apiSection.includes('`scrollIntoView`'));
assert(apiSection.includes('`scrollTop`'));
assert(apiSection.includes('`gradientOverlay`'));
assert(apiSection.includes('`gradientOverlayColor`'));
assert(apiSection.includes('`gradientOverlaySize`'));
assert(apiSection.includes('`contentPaddingBottom`'));
assert(apiSection.includes('ScrollArea 没有公开 Methods'));
assert(apiSection.includes('`scroll`'));
assert(!/`scrollLeft`|`scrollWithAnimation`|`upperThreshold`|`scrolltolower`|`scrollTo\(/.test(apiSection));
assert(compatibility.includes('ScrollArea 对齐 TDesign ScrollView'));
assert(compatibility.includes('gradientOverlayColor'));
assert(compatibility.includes('gradientOverlaySize'));
assert(compatibility.includes('顶部只显示底层、底部只显示顶层、中段显示两层、无溢出不显示'));
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contract.includes('pointer-events:none'));
assert(contract.includes('--pui-scroll-area-gradient-overlay-size'));
assert(contract.includes('顶部只显示底部、底部只显示顶部、中段同时显示、无溢出时均不显示'));
assert(contract.includes('`sm`、`md`、`lg`'));
assert(contractIndex.includes('[ScrollArea](./SCROLL-AREA.md)'));
const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="ScrollArea'), exampleWxml.indexOf('<pui-card title="Card'));
assert(exampleSection.includes('scroll-into-view="{{scrollAreaTarget}}"'));
assert(exampleSection.includes('gradient-overlay-color="#ffffff"'));
assert(exampleSection.includes('gradient-overlay-size="lg"'));
assert(!/\sgradient-overlay(?:\s|=)/.test(exampleSection), 'example must omit gradient-overlay because true is the public default');
assert(!/bind:scroll|bindscrolltoupper|bindscrolltolower/.test(exampleSection));
assert(exampleJs.includes('setScrollAreaTarget: function setScrollAreaTarget'));
['onScrollAreaScroll', 'onScrollAreaUpper', 'onScrollAreaLower'].forEach((name) => assert(!exampleJs.includes(name), `${name} must not remain in the example`));

if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    assert.strictEqual(
      fs.readFileSync(path.join(root, 'miniprogram_dist/scroll-area', `scroll-area.${extension}`), 'utf8'),
      fs.readFileSync(path.join(root, 'scroll-area', `scroll-area.${extension}`), 'utf8'),
      `dist ScrollArea ${extension} must match source`,
    );
  });
}

console.log('ScrollArea contract tests passed.');
