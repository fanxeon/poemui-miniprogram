const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'skeleton/skeleton.js'), 'utf8');
let definition = null;
let nextTimerId = 1;
let timers = new Map();

function setTimer(callback, delay) {
  const id = nextTimerId++;
  timers.set(id, { callback, delay: Number(delay) || 0, order: id });
  return id;
}

function clearTimer(id) {
  timers.delete(id);
}

function nextDelay() {
  const queue = Array.from(timers.values()).sort((left, right) => left.delay - right.delay || left.order - right.order);
  return queue.length ? queue[0].delay : null;
}

function runNextTimer() {
  const queue = Array.from(timers.entries()).sort((left, right) => left[1].delay - right[1].delay || left[1].order - right[1].order);
  if (!queue.length) return false;
  const [id, timer] = queue[0];
  timers.delete(id);
  timer.callback();
  return true;
}

const sandbox = {
  console,
  isFinite,
  setTimeout: setTimer,
  clearTimeout: clearTimer,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'skeleton/skeleton.js' });
assert(definition, 'Skeleton component definition must be registered');

function create(overrides) {
  timers = new Map();
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent() { throw new Error('Skeleton must not publish events'); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

assert.deepStrictEqual(Object.keys(definition.properties), ['animation', 'delay', 'loading', 'rowCol', 'theme', 'ariaLabel', 'reduceMotion'], 'Skeleton must publish exactly seven Props');

const defaults = create();
assert.strictEqual(defaults.data.mounted, true);
assert.strictEqual(defaults.data.active, false);
assert.strictEqual(defaults.data.contentActive, true, 'content remains available during the entry frame');
assert.strictEqual(nextDelay(), 16);
runNextTimer();
assert.strictEqual(defaults.data.active, true);
assert.strictEqual(defaults.data.contentActive, false);
assert.strictEqual(defaults.data.rows.length, 2, 'text theme provides a compact default structure');
assert(defaults.data.rootClass.includes('pui-skeleton--text'));
assert(defaults.data.rootClass.includes('pui-skeleton--none'));

const delayedCancellation = create({ delay: 300 });
assert.strictEqual(delayedCancellation.data.mounted, false);
assert.strictEqual(delayedCancellation.data.contentActive, true);
assert.strictEqual(nextDelay(), 300);
delayedCancellation.data.loading = false;
delayedCancellation.syncVisibility();
assert.strictEqual(timers.size, 0, 'cancelling delay must not mount a placeholder');

const delayedShow = create({ delay: 240 });
runNextTimer();
assert.strictEqual(delayedShow.data.mounted, true);
assert.strictEqual(delayedShow.data.active, false);
assert.strictEqual(nextDelay(), 16);
runNextTimer();
assert.strictEqual(delayedShow.data.active, true);

const leaving = create();
runNextTimer();
leaving.data.loading = false;
leaving.syncVisibility();
assert.strictEqual(leaving.data.mounted, true, 'placeholder remains mounted during crossfade');
assert.strictEqual(leaving.data.active, false);
assert.strictEqual(leaving.data.contentActive, true);
assert.strictEqual(nextDelay(), 500);
runNextTimer();
assert.strictEqual(leaving.data.mounted, false);

const reenter = create();
runNextTimer();
reenter.data.loading = false;
reenter.syncVisibility();
reenter.data.loading = true;
reenter.syncVisibility();
assert.strictEqual(reenter.data.mounted, true);
assert.strictEqual(nextDelay(), 16, 're-entry cancels an in-flight leave');
runNextTimer();
assert.strictEqual(reenter.data.active, true);

const reduced = create({ reduceMotion: true });
assert(reduced.data.rootClass.includes('pui-skeleton--reduced-motion'));
assert(reduced.data.rootStyle.includes('--pui-skeleton-duration:1ms'));
runNextTimer();
reduced.data.loading = false;
reduced.syncVisibility();
assert.strictEqual(nextDelay(), 1);

const boundaries = create({
  rowCol: Array.from({ length: 14 }, () => Array.from({ length: 6 }, (_, column) => ({
    width: column === 0 ? '900rpx' : '-10%',
    height: '500rpx',
    size: column === 1 ? '999rpx' : undefined,
    margin: '999rpx',
    marginLeft: '-2px',
    marginRight: '999px',
    type: column === 2 ? 'circle' : 'not-supported',
  }))),
  animation: 'gradient',
  theme: 'paragraph',
  ariaLabel: '  ',
});
assert.strictEqual(boundaries.data.rows.length, 12);
assert.strictEqual(boundaries.data.rows[0].items.length, 4);
assert(boundaries.data.rows[0].items[0].style.includes('width:750rpx'));
assert(boundaries.data.rows[0].items[0].style.includes('height:500rpx'));
assert(boundaries.data.rows[0].items[0].style.includes('margin:64rpx'));
assert(boundaries.data.rows[0].items[0].style.includes('margin-left:0;'));
assert(boundaries.data.rows[0].items[0].style.includes('margin-right:32px'));
assert(boundaries.data.rows[0].items[1].style.includes('width:320rpx'));
assert(boundaries.data.rows[0].items[2].type === 'circle');
assert(boundaries.data.rootClass.includes('pui-skeleton--gradient'));
assert(boundaries.data.rootClass.includes('pui-skeleton--paragraph'));
assert.strictEqual(boundaries.data.semanticLabel, '内容加载中');

const avatar = create({ rowCol: [], theme: 'avatar', animation: 'flashed' });
assert.strictEqual(avatar.data.rows.length, 2);
assert.strictEqual(avatar.data.rows[0].items[0].type, 'circle');
assert(avatar.data.rootClass.includes('pui-skeleton--flashed'));

const wxml = fs.readFileSync(path.join(root, 'skeleton/skeleton.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'skeleton/skeleton.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'skeleton/skeleton.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-components.js'), 'utf8');
const previewApp = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewCss = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const apiDocs = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const h5Docs = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SKELETON.md'), 'utf8');
const exampleJson = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const entry = fs.readFileSync(path.join(root, 'index.js'), 'utf8');
const skeletonApi = apiDocs.split('## Skeleton')[1].split('## Empty')[0];
const skeletonH5 = h5Docs.split('33. Skeleton')[1].split('34. Empty')[0];
const skeletonExample = exampleWxml.split('<pui-card title="Skeleton 结构占位"')[1].split('</pui-card>')[0];
const skeletonCompatibility = previewApp.split("if (compatId === 'skeleton')").at(-1).split("if (compatId === 'notice-bar')")[0];

assert(wxml.includes('wx:if="{{mounted}}"'));
assert(wxml.includes('role="status"'));
assert(wxml.includes('aria-live="polite"'));
assert(wxml.includes('<slot></slot>'));
assert(!/name="placeholder"|customPlaceholder|triggerEvent/.test(wxml + source), 'Skeleton has no placeholder Slot or event publisher');
assert(!/<button\b|<input\b|<image\b/.test(wxml), 'Skeleton contains no raw replacement controls');
assert(wxss.includes('transition:opacity var(--pui-skeleton-duration)'));
assert(wxss.includes('@keyframes pui-skeleton-gradient'));
assert(wxss.includes('@keyframes pui-skeleton-flashed'));
assert(wxss.includes('.pui-skeleton--reduced-motion'));
assert(wxss.includes('--pui-skeleton-circle-radius:50%'), 'Skeleton must define an explicit component-level circle geometry token');
assert(/\.pui-skeleton__part--circle\{[^}]*width:96rpx;[^}]*height:96rpx;[^}]*min-height:0;[^}]*flex:0 0 auto;[^}]*border-radius:var\(--pui-skeleton-circle-radius\)/.test(wxss), 'circle parts must let size override both axes and consume the intrinsic 50% geometry token');
assert(!/\.pui-skeleton__part--circle\{[^}]*min-height:96rpx/.test(wxss), 'circle parts must not stretch a smaller custom size into an oval');
assert(!/\.pui-skeleton__part--circle\{[^}]*border-radius:var\(--pui-radius-round\)/.test(wxss), 'circle geometry must not depend on the appearance-remapped global round token');
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Skeleton CSS has no fixed motion longer than 500ms');
assert.deepStrictEqual(json.usingComponents || {}, {});
assert.deepStrictEqual(metadata.apiProps.skeleton, ['animation', 'delay', 'loading', 'rowCol', 'theme', 'ariaLabel', 'reduceMotion']);
assert.strictEqual(metadata.apiEvents.skeleton, undefined);
assert.deepStrictEqual(metadata.apiSlots.skeleton.map((slot) => slot.name), ['default']);
assert(metadata.packageComponents.includes('skeleton'));
assert(shadcn.includes("['Skeleton', 'skeleton', 'adapter', 'none'"));
assert(shadcn.includes('7 个加载结构 Props'));
assert(generator.includes("  'skeleton',"), 'experimental generator protects Skeleton');
assert(entry.includes("    'skeleton',"), 'npm entry exports Skeleton');
assert(previewApp.includes('function bindSkeletonPreviewRuntime(props)'));
assert(previewApp.includes("return skeletonPreviewReduced(props) ? 1 : 500;"), 'H5 crossfade duration mirrors Skeleton source 500ms / reduced 1ms contract');
assert(previewApp.includes("if (id === 'skeleton') {\n    bindSkeletonPreviewRuntime(props);\n    return;\n  }"), 'Skeleton runtime is wired into the shared preview lifecycle dispatcher');
assert(previewApp.includes("previewIdFor(state.current) !== 'skeleton'"));
assert(previewApp.includes('data-skeleton-placeholder'));
assert(previewApp.includes('基础用法') && previewApp.includes('主题与动效') && previewApp.includes('内容回显'));
assert(!previewApp.includes('bind:show="onSkeletonShow"'));
assert(skeletonCompatibility.includes('没有 Events、Methods、empty/error/retry'));
assert(!/show 只在|placeholder slot|pulse\/wave|0–1000ms/.test(skeletonCompatibility));
assert(previewApp.includes("else if (compatId === 'skeleton') {\n    base.push(['事件', 'Skeleton 没有公开 Events 或 Methods"));
assert(previewCss.includes('.pui-skeleton-preview__part--circle'));
assert(previewCss.includes('@keyframes pui-preview-skeleton-gradient'));
assert(previewCss.includes('@media (prefers-reduced-motion: reduce)'));
assert(!/\.pui-skeleton-preview\s*\{[^}]*background:\s*var\(--surface-solid\)/.test(previewCss), 'Skeleton H5 root remains transparent');
assert(skeletonApi.includes('7 个 Props、1 个默认 Slot、0 Events、0 Methods'));
assert(!/\bshow\b|\bhide\b|placeholder Slot|custom-placeholder/.test(skeletonApi));
assert(skeletonH5.includes('没有 Events、Methods、具名 placeholder Slot'));
['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环'].forEach((heading) => assert(contract.includes(heading), `Skeleton contract must include ${heading}`));
assert(exampleJson.includes('"pui-skeleton": "poemui-miniprogram/skeleton/skeleton"'));
assert(exampleJs.includes('toggleExampleSkeleton'));
assert(!exampleJs.includes('onSkeletonShow') && !exampleJs.includes('onSkeletonHide'));
assert(skeletonExample.includes('<pui-skeleton'));
assert(!skeletonExample.includes('bind:show=') && !skeletonExample.includes('bind:hide='));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = fs.readFileSync(path.join(root, `skeleton/skeleton.${extension}`));
  const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/skeleton/skeleton.${extension}`));
  assert(sourceFile.equals(distFile), `source and miniprogram_dist Skeleton ${extension} must match`);
});

console.log('Skeleton contract tests passed.');
