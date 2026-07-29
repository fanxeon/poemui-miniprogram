const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const utilities = read('common/style/utilities.wxss');
const theme = read('common/style/theme.wxss');
const publicEntry = read('theme/utilities.wxss');
const preview = read('preview/app.js');
const previewStyles = read('preview/styles.css');
const previewHtml = read('preview/index.html');
const packageVersion = JSON.parse(read('package.json')).version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const generatedPreviewData = read('preview/style-utilities-data.js');
const generatedPreviewCss = read('preview/style-utilities.css');
const guide = read('docs/STYLE_UTILITIES.md');
const colorGuide = read('docs/COLOR.md');
const spacing = read('docs/SPACING.md');
const api = read('docs/COMPONENT_API.md');
const compatibility = read('docs/H5_PREVIEW_COMPATIBILITY.md');
const matrix = read('docs/COMPONENT_MATRIX.md');
const progress = read('docs/COMPONENT_DEVELOPMENT_PROGRESS.md');
const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const example = read('_example/miniprogram/pages/components/index.wxml');
const metadata = require(path.join(root, 'metadata/components.js'));
const utilityPreviewStyles = previewStyles.slice(previewStyles.indexOf('.utility-doc {'), previewStyles.indexOf('.spec-sheet {'));
const generatedWindow = {};
vm.runInNewContext(generatedPreviewData, { window: generatedWindow }, { filename: 'preview/style-utilities-data.js' });
assert.strictEqual(generatedWindow.POEMUI_STYLE_UTILITIES.items.length, 562, 'H5 generated preview schema covers every published utility');
assert(generatedWindow.POEMUI_STYLE_UTILITIES.items.every((item) => item.previewKind && item.previewTarget && item.previewSafety && item.previewTheme && item.previewScaffoldTarget), 'every H5 utility entry carries complete semantic preview routing');
assert(!generatedPreviewCss.includes('rpx'), 'generated H5 utility mirror converts every rpx value to px');
assert(!generatedPreviewCss.includes('@import'), 'generated H5 utility mirror does not import the WXSS theme entry');

const selectors = new Set(utilities.match(/\.pui-[a-z0-9_-]+/g) || []);
const darkVariants = new Set(utilities.match(/\.pui-dark-[a-z0-9_-]+/g) || []);
assert.strictEqual(selectors.size, 562, 'Style Utilities publishes the documented 562 selectors');
selectors.forEach((selector) => assert(generatedPreviewCss.includes(selector), `H5 generated utility mirror must contain ${selector}`));
assert.strictEqual(darkVariants.size, 32, 'Style Utilities publishes 32 explicit dark variants');

const requiredGroups = {
  layout: ['pui-flex', 'pui-flex-col-reverse', 'pui-flex-none', 'pui-items-baseline', 'pui-justify-evenly', 'pui-order-6'],
  grid: ['pui-grid-cols-1', 'pui-grid-cols-6', 'pui-grid-rows-6', 'pui-col-span-full', 'pui-row-span-full', 'pui-grid-flow-col-dense', 'pui-auto-rows-fr'],
  spacing: ['pui-p-0', 'pui-px-lg', 'pui-mx-auto', 'pui-my-auto', 'pui-gap-x-3xl', 'pui-gap-y-0'],
  sizing: ['pui-w-half', 'pui-w-two-thirds', 'pui-h-screen', 'pui-min-w-0', 'pui-max-h-screen', 'pui-aspect-video'],
  position: ['pui-relative', 'pui-absolute', 'pui-sticky', 'pui-inset-0', 'pui-right-auto', 'pui-z-50'],
  visual: ['pui-bg-brand', 'pui-bg-success-light', 'pui-bg-red', 'pui-bg-red-soft', 'pui-bg-blue', 'pui-border', 'pui-border-solid', 'pui-border-dashed', 'pui-border-violet', 'pui-radius-full', 'pui-shadow-card', 'pui-opacity-75'],
  background: ['pui-bg-gradient-neutral', 'pui-bg-gradient-flowing-gold-pink', 'pui-bg-gradient-premium-black', 'pui-bg-gradient-cement-white', 'pui-bg-gradient-black-gold', 'pui-bg-gradient-light-gold', 'pui-bg-gradient-ai-mist-blue-violet', 'pui-bg-gradient-cyber-pink-blue', 'pui-bg-gradient-aurora-violet'],
  typography: ['pui-text-headline', 'pui-text-info', 'pui-text-blue', 'pui-text-emerald', 'pui-text-violet', 'pui-text-pink', 'pui-leading-relaxed', 'pui-tracking-wide', 'pui-whitespace-pre-wrap', 'pui-text-cut', 'pui-text-truncate', 'pui-text-clamp-2'],
  behavior: ['pui-overflow-x-auto', 'pui-overflow-y-scroll', 'pui-object-cover', 'pui-transition-colors', 'pui-duration-fast'],
  accessibility: ['pui-pt-safe', 'pui-pb-safe', 'pui-sr-only', 'pui-pointer-events-none', 'pui-select-text'],
  dark: ['pui-dark-text-primary', 'pui-dark-text-success', 'pui-dark-bg-container', 'pui-dark-bg-muted', 'pui-dark-bg-danger-light', 'pui-dark-border-brand', 'pui-dark-shadow-card'],
};

Object.entries(requiredGroups).forEach(([group, names]) => {
  names.forEach((name) => assert(selectors.has(`.${name}`), `${group} must publish ${name}`));
});

const curatedHues = ['red', 'orange', 'amber', 'emerald', 'teal', 'blue', 'violet', 'pink'];
curatedHues.forEach((hue) => {
  [`pui-text-${hue}`, `pui-bg-${hue}`, `pui-bg-${hue}-soft`, `pui-border-${hue}`].forEach((name) => {
    assert(selectors.has(`.${name}`), `curated palette must publish ${name}`);
  });
  [`--pui-color-${hue}`, `--pui-color-${hue}-solid`, `--pui-color-${hue}-soft`].forEach((token) => {
    assert.strictEqual((theme.match(new RegExp(`${token}:`, 'g')) || []).length, 2, `${token} must have light and dark values`);
  });
  assert(new RegExp(`\\.pui-border-${hue}\\s*\\{\\s*border-color:\\s*var\\(--pui-color-${hue}\\);\\s*\\}`).test(utilities), `${hue} border must consume the shared foreground token`);
  assert(new RegExp(`\\.pui-bg-${hue}\\s*\\{\\s*background-color:\\s*var\\(--pui-color-${hue}-solid\\);\\s*\\}`).test(utilities), `${hue} solid background must consume the shared solid token`);
  assert(new RegExp(`\\.pui-bg-${hue}-soft\\s*\\{\\s*background-color:\\s*var\\(--pui-color-${hue}-soft\\);\\s*\\}`).test(utilities), `${hue} soft background must consume the shared soft token`);
});

assert(utilities.startsWith('@import "./theme.wxss";'), 'utilities imports the shared theme token source');
assert.strictEqual(publicEntry.trim(), '@import "../common/style/utilities.wxss";', 'public entry only forwards to the audited utility source');
assert(!/\.pui-(?:-m|-p|negative)/.test(utilities), 'negative spacing utilities stay outside the contract');
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(utilities), 'utility motion has no fixed duration longer than 500ms');
assert(utilities.includes('@media (prefers-reduced-motion: reduce)'));
assert(utilities.includes('transition-duration: 1ms'));
assert(utilities.includes('grid-template-columns: repeat(6, minmax(0, 1fr))'));
assert(utilities.includes('padding-bottom: env(safe-area-inset-bottom)'));
assert(utilities.includes('.pui-theme--dark.pui-dark-bg-muted'));
assert(utilities.includes('.pui-theme--dark .pui-dark-bg-muted'));
assert(utilities.includes('background-image: var(--pui-bg-gradient-black-gold)'));
assert(/\.pui-text-cut,\s*\.pui-text-truncate\s*\{[^}]*overflow:\s*hidden;[^}]*text-overflow:\s*ellipsis;[^}]*white-space:\s*nowrap;[^}]*\}/.test(utilities), 'text-cut is the public single-line truncation utility and truncate remains an alias');
assert(/\.pui-border-solid\s*\{[^}]*border-style:\s*solid;[^}]*\}/.test(utilities), 'border-solid is the public quick solid-border utility');

const styleDetail = metadata.details['style-utilities'];
assert(styleDetail, 'Style Utilities metadata is published');
assert.strictEqual(styleDetail.props.length, 9, 'Style Utilities exposes 9 documentation filters');
assert(styleDetail.states.includes('562 selectors'));
assert(styleDetail.states.includes('32 个精选色彩 utility'));
assert(styleDetail.states.includes('9 个背景渐变预设'));
assert(styleDetail.states.includes('32 个 dark variants'));
assert.deepStrictEqual(styleDetail.props.find((item) => item.key === 'category').options, ['all', 'layout', 'size', 'spacing', 'typography', 'background']);
assert.deepStrictEqual(styleDetail.props.find((item) => item.key === 'themeView').options, ['compare', 'current', 'light', 'dark']);

assert(preview.includes('function utilitiesPreview(props)'));
assert(preview.includes('const styleUtilitiesData = window.POEMUI_STYLE_UTILITIES;'));
assert(preview.includes('const styleUtilityPreviewByName = new Map'));
assert(preview.includes('`${styleUtilitiesData.items.length} 个选择器覆盖'));
assert(!preview.includes('STYLE_UTILITY_ITEMS'), 'H5 兼容说明不得引用已删除的旧全局目录常量');
assert(preview.includes('data-utility-preview-kind='));
assert(preview.includes('data-utility-preview-target='));
assert(preview.includes('data-utility-preview-safety='));
assert(preview.includes('utility-doc__semantic-current'));
assert(!preview.includes('utility-doc__semantic-side is-baseline'));
assert(!preview.includes('utility-doc__semantic-side is-result'));
assert(preview.includes("demoAction: 'utility-example'"));
assert(preview.includes("demoAction: 'utility-example-reset'"));
assert(preview.includes("customClass: 'utility-doc__semantic-reset',\n        icon: 'refresh',\n        theme: 'default',\n        variant: 'text',\n        size: 'small',\n        shape: 'circle'"));
assert(preview.includes('demo.styleUtilitySelections'));
assert(preview.includes("semanticClass(meta, 'layout', applyUtility)"));
assert(preview.includes("semanticClass(meta, 'measure', applyUtility)"));
assert(preview.includes("semanticClass(meta, 'outer', applyUtility)"));
assert(preview.includes("semanticClass(meta, 'surface', applyUtility)"));
assert(preview.includes("semanticClass(meta, 'items', applyUtility)"));
assert(preview.includes("semanticClass(meta, 'text', applyUtility)"));
assert(preview.includes("key: 'size', title: '尺寸'"));
assert(preview.includes('data-utility-category='));
assert(preview.includes('562<span>selectors</span>'));
assert(preview.includes('32<span>curated colors</span>'));
assert(preview.includes("key: 'background', title: '背景'"));
assert(preview.includes('pui-bg-gradient-ai-mist-blue-violet'));
assert(preview.includes('单行裁切 · .pui-text-cut'));
assert(preview.includes('typography-doc__truncate pui-text-cut'));
assert(preview.includes('utility-doc__semantic-text ${semanticClass'), 'Style Utilities typography sample must apply the generated utility only to the semantic text target');
assert(!preview.includes('utility-doc__mini is-typography ${escapeHtml(appliedClass)}'), 'Style Utilities must not apply typography utilities to the preview infrastructure root');
assert(preview.includes('32<span>dark variants</span>'));
assert(preview.includes('pui-grid-layout pui-grid-cols-${columns}'));
assert(preview.includes("demoAction: 'utility-category'"));
assert(preview.includes("demoAction: 'utility-theme-view'"));
assert(preview.includes('pui-bg-page pui-dark-bg-muted'));
assert(preview.includes("'pui-border-solid'"), 'the visual browser must expose the solid-border utility');
assert(preview.includes('const CURATED_UTILITY_TEXT_CLASSES = CURATED_UTILITY_HUES.map'), 'H5 builds every curated text utility from the shared hue list');
assert(preview.includes('const CURATED_UTILITY_SURFACE_CLASSES = CURATED_UTILITY_HUES.flatMap'), 'H5 builds every curated surface utility from the shared hue list');
assert(preview.includes('...CURATED_UTILITY_TEXT_CLASSES'), 'the typography browser exposes all eight curated text utilities');
assert(preview.includes('...CURATED_UTILITY_SURFACE_CLASSES'), 'the background browser exposes all 24 curated surface utilities');
assert(preview.includes('CURATED_UTILITY_COLOR_TOKENS.forEach((name) =>'), 'H5 shell applies generated curated theme tokens');
assert(preview.includes("options: ['brand', 'semantic', 'accent', 'neutral']"), 'H5 Color page exposes the curated accent palette');
assert(preview.includes('pui-border pui-border-solid pui-dark-border'), 'the live composition and WXML must mount border-solid for real');
assert(preview.includes("${props.fullWidth ? 'is-full' : 'is-fit'} ${liveClass}"));
assert(preview.includes('"pui-config-provider": "poemui-miniprogram/config-provider/config-provider"'));
assert(preview.includes("if (compatId === 'style-utilities')"));
assert(previewStyles.includes('.utility-doc__catalog'));
assert(previewStyles.includes('.utility-doc__background--grid'));
assert(previewStyles.includes('.utility-doc__filter-button'));
assert(previewStyles.includes('.utility-doc__theme-panel'));
assert(previewStyles.includes('.utility-doc__mini.is-dark'));
assert(previewStyles.includes('.utility-doc__semantic-preview'));
assert(previewStyles.includes('grid-template-columns: minmax(0, 1fr) auto'));
assert(!previewStyles.includes('.utility-doc__semantic-side.is-baseline'));
assert(previewStyles.includes('.utility-doc__semantic-reset'));
assert(previewStyles.includes('justify-self: end;'));
assert(previewStyles.includes('.utility-doc__semantic-measure'));
assert(previewStyles.includes('.utility-doc__semantic-surface'));
assert(previewStyles.includes('.utility-doc__semantic-items'));
assert(previewStyles.includes('.utility-doc__semantic-text'));
assert(previewStyles.includes('[data-utility-preview-safety="viewport-clipped"]'));
assert(previewStyles.includes('.utility-doc .pui-theme--dark .pui-dark-bg-muted'));
assert(previewStyles.includes('.utility-doc .pui-border-solid { border-style: solid; }'));
assert(previewStyles.includes('.utility-doc .pui-bg-gradient-aurora-violet'));
assert(!/font-size:\s*(?:[0-9]|1[01])px/.test(utilityPreviewStyles), 'Style Utilities documentation keeps fixed text at 12px or above');
assert(previewStyles.includes('--pui-site-topbar-height: 57px'));
assert(previewStyles.includes('height: calc(100dvh - var(--pui-site-topbar-height))'));
assert(previewStyles.includes('overflow-x: clip'), 'the app shell must not become the sticky rails scroll container');
assert(previewStyles.includes('overflow-y: visible'), 'the app shell keeps page scrolling on the viewport');
assert(previewStyles.includes('@media (min-width: 1181px)'));
assert(previewStyles.includes('@media (max-width: 760px)'));
assert(previewStyles.includes('.pui-text-cut,'));
assert(new RegExp(`styles\\.css\\?v=${packageVersion}-\\d{8}-\\d+`).test(previewHtml));
assert(new RegExp(`app\\.js\\?v=${packageVersion}-\\d{8}-\\d+`).test(previewHtml));
assert(new RegExp(`style-utilities-data\\.js\\?v=${packageVersion}-\\d{8}-\\d+`).test(previewHtml), 'H5 must load the generated utility preview semantics before app.js');
assert(new RegExp(`style-utilities\\.css\\?v=${packageVersion}-\\d{8}-\\d+`).test(previewHtml), 'H5 must load the scoped CSS generated from the published utility source');

assert(guide.includes('当前共 562 个选择器'));
assert(guide.includes('## 精选强调色'));
assert(guide.includes('`pui-bg-blue-soft`'));
assert(guide.includes('## 背景渐变'));
assert(guide.includes('pui-bg-gradient-flowing-gold-pink'));
assert(guide.includes('pui-bg-gradient-ai-mist-blue-violet'));
assert(guide.includes('`pui-text-cut`（单行裁切并显示省略号）'));
assert(guide.includes('`pui-border-solid` 只设置 `border-style: solid`'));
assert(guide.includes('## Grid'));
assert(guide.includes('## 深色模式与 `pui-dark-*`'));
assert(guide.includes('## 安全区、辅助和轻量动效'));
assert(spacing.includes('pui-gap-x-0'));
assert(api.includes('当前包含 562 个选择器'));
assert(/\d+\. Style Utilities/.test(compatibility));
assert(compatibility.includes('32 个 `pui-dark-*` 条件变体'));
assert(compatibility.includes('左右栏以同一 57px 顶栏 Token'));
assert(matrix.includes('| Style Utilities | done | `poemui-miniprogram/theme/utilities.wxss` | 562 selectors'));
assert(progress.includes('| 99 | Style Utilities / 官网双侧栏 | done |'));
assert(progress.includes('页面滚到 1484px 时左右栏仍为 `top=57/bottom=720/height=663`'));
assert(progress.includes('| 100 | Style Utilities 深色模式 / 组件化分类浏览器 | done |'));
assert(progress.includes('实时组合浅色 background/item 为 `rgb(255,255,255)`'));
assert(readme.includes('当前包含 562 个选择器'));
assert(readme.includes('32 个精选色彩 utility'));
assert(readme.includes('32 个 `pui-dark-*` 条件变体'));
assert(changelog.includes('从 193 扩展到 487 个选择器'));
assert(changelog.includes('Style Utilities 补齐显式深色模式与组件化分类浏览器'));
assert(example.includes('title="Style Utilities utility-first 布局"'));
assert(example.includes('pui-grid-cols-3'));
assert(example.includes('pui-col-span-full'));
assert(example.includes('pui-border pui-border-solid'));
assert(example.includes('pui-dark-bg-muted'));
assert(example.includes('562 selectors · 32 curated colors · 32 dark variants'));
assert(example.includes('pui-bg-blue-soft'));
assert(example.includes('pui-border-blue'));
assert(colorGuide.includes('## 精选强调色'));
assert(colorGuide.includes('`--pui-color-violet-solid`'));
assert(example.includes('page pui-bg-gradient-flowing-gold-pink'));

assert.strictEqual(utilities, read('miniprogram_dist/common/style/utilities.wxss'), 'common utility source and dist must match');
assert.strictEqual(publicEntry, read('miniprogram_dist/theme/utilities.wxss'), 'public utility entry and dist must match');

process.stdout.write('Style Utilities contract tests passed.\n');
