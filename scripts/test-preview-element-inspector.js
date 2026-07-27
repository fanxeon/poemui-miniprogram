const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('preview/app.js');
const html = read('preview/index.html');
const styles = read('preview/styles.css');
const docs = [
  read('AGENTS.md'),
  read('docs/UI_DESIGN_CONTRACT.md'),
  read('docs/PREVIEW_INFORMATION_HIERARCHY.md'),
  read('docs/H5_PREVIEW_COMPATIBILITY.md'),
].join('\n');

const functionBlock = (name) => {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} must exist`);
  const next = app.indexOf('\nfunction ', start + 1);
  return app.slice(start, next < 0 ? app.length : next);
};

assert(html.includes('id="previewExperience"'));
assert(html.includes('id="previewUtilityToolbar"'));
assert(html.includes('id="previewModeMount"'));
assert(html.includes('id="elementInspectorMount"'));
assert(html.includes('id="previewStage"'));
assert(html.indexOf('id="previewStage"') < html.indexOf('id="elementInspectorMount"'), 'Inspector must be adjacent to the preview, not nested inside the device runtime');

assert(app.includes("previewMode: 'normal'"));
assert(app.includes('previewElementSelection: null'));
assert(app.includes("dataAttributes: { 'preview-mode': 'normal' }"));
assert(app.includes("dataAttributes: { 'preview-mode': 'select' }"));

const modeControls = functionBlock('ensurePreviewModeControls');
assert(modeControls.includes('buttonSample({'));
assert(modeControls.includes("icon: 'eye'"));
assert(modeControls.includes("icon: 'focus'"));
assert(modeControls.includes('ariaPressed:'));
assert(!modeControls.includes('<button'), 'preview modes must use the shared PUI Button helper');

const inspector = functionBlock('renderElementInspector');
assert(inspector.includes('iconButtonSample({'));
assert(inspector.includes('tagSample({'));
assert(inspector.includes('badgeSample({'));
assert(inspector.includes("'element-inspector-open-prop'"));
assert(inspector.includes('element-inspector--left'));
assert(inspector.includes('element-inspector--right'));
assert(inspector.includes('elementInspectorContentPanel'));
assert(inspector.includes('elementInspectorSettingsPanel'));
assert(inspector.includes('definitionGroups.content'));
assert(inspector.includes('definitionGroups.settings'));
assert(inspector.includes("mount.classList.remove('is-entering', 'is-switching')"));
assert(!inspector.includes('<input'));
assert(!inspector.includes('<select'));
assert(!inspector.includes('<textarea'));

const splitDefinitions = functionBlock('splitPreviewElementPropDefinitions');
assert(app.includes("const previewElementContentPropTypes = new Set(['text', 'json', 'nullable-number'])"));
assert(splitDefinitions.includes("? 'content' : 'settings'"), 'free-entry content fields and remaining settings must be split deterministically');

const panelBody = functionBlock('elementInspectorPanelBody');
assert(panelBody.includes('propControlsMarkup(definitions, props)'));
assert(panelBody.includes('emptySample({'));

const hideInspector = functionBlock('hideElementInspector');
assert(hideInspector.includes("mount.classList.add('is-leaving')"));
assert(hideInspector.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
assert(hideInspector.includes('elementInspectorMotionMilliseconds(mount)'));
assert(functionBlock('elementInspectorMotionMilliseconds').includes("getPropertyValue('--pui-site-element-inspector-duration')"));

const annotate = functionBlock('annotatePreviewSelectableElements');
assert(annotate.includes('data.previewSelectable') || annotate.includes('dataset.previewSelectable'));
assert(annotate.includes('is-preview-element-selected'));
assert(annotate.includes('selection.present = selectedPresent'));

const setMode = functionBlock('setPreviewMode');
assert(setMode.includes('syncPreviewModeControls()'));
assert(setMode.includes('annotatePreviewSelectableElements(detail)'));
assert(setMode.includes('renderElementInspector(detail)'));
assert(!setMode.includes('renderStage()'), 'mode switching must preserve the current PreviewDevice DOM and runtime state');

const classifier = functionBlock('classifyPreviewElement');
for (const role of ['overlay', 'close', 'primaryAction', 'secondaryAction', 'input', 'header', 'footer', 'title', 'content', 'item', 'action', 'icon', 'slotChild']) {
  assert(classifier.includes(`'${role}'`), `element classifier must support ${role}`);
}
assert(classifier.indexOf("previewId === 'button'") < classifier.indexOf("return 'primaryAction'"), 'the current Button component must win over action-copy heuristics');

assert(app.includes("addEventListener('pointerdown', handlePreviewElementSelection, true)"));
assert(app.includes("addEventListener('click', handlePreviewElementSelection, true)"));
assert(app.includes('event.stopImmediatePropagation()'), 'selection mode must block component business actions');
assert(app.includes("state.view = 'prop'"), 'context Inspector must link to the complete 属性 view');
assert(app.includes("control.closest('#propsPanel, #elementInspectorContentPanel, #elementInspectorSettingsPanel')"), 'full 属性 view and both contextual Inspector panels must share one write-back path');

assert(styles.includes('--pui-site-element-inspector-width'));
assert(styles.includes('.preview-experience[data-preview-mode="select"] [data-preview-selectable="true"].is-preview-element-selected'));
assert(styles.includes('.preview-experience[data-preview-mode="select"] .preview-device__viewport {\n  cursor: default;'));
assert(styles.includes('.preview-experience[data-preview-mode="select"] [data-preview-selectable="true"] {\n  cursor: pointer;'));
assert(!styles.includes('cursor: crosshair'), 'semantic element selection must not use a pixel-picking crosshair cursor');
assert(styles.includes('.element-inspector-mount {'));
assert(styles.includes('position: absolute'));
assert(styles.includes('--pui-site-element-inspector-width: 286px'));
assert(styles.includes('--pui-site-element-inspector-height: 560px'));
assert(styles.includes('.element-inspector--left {'));
assert(styles.includes('.element-inspector--right {'));
assert(styles.includes('--pui-preview-device-width-default: 393px'));
assert(styles.includes('right: calc(50% + (var(--device-width, var(--pui-preview-device-width-default)) / 2) + var(--pui-site-element-inspector-offset))'));
assert(styles.includes('left: calc(50% + (var(--device-width, var(--pui-preview-device-width-default)) / 2) + var(--pui-site-element-inspector-offset))'));
assert(styles.includes('height: min(100%, var(--pui-site-element-inspector-height))'));
assert(styles.includes('.element-inspector-mount.is-entering .element-inspector--left'));
assert(styles.includes('.element-inspector-mount.is-entering .element-inspector--right'));
assert(styles.includes('.element-inspector-mount.is-leaving .element-inspector--left'));
assert(styles.includes('transition: opacity var(--pui-site-element-inspector-duration)'));
assert(styles.includes('@media (max-width: 1180px)'));
assert(styles.includes('bottom: var(--pui-preview-panel-padding)'));
assert(styles.includes('grid-template-columns: repeat(2, minmax(0, var(--pui-site-element-inspector-width)))'));
assert(styles.includes('@media (max-width: 700px)'));
assert(styles.includes('left: var(--pui-site-page-gutter-mobile)'));
assert(styles.includes('@media (prefers-reduced-motion: reduce)'));
assert(styles.includes('.preview-device {'), 'element Inspector must keep the existing fixed PreviewDevice contract');
assert(styles.includes('height: var(--pui-preview-device-height)'));
assert(styles.includes('container-type: inline-size'));
assert(styles.includes('transition: transform var(--pui-site-element-inspector-duration) var(--pui-site-element-inspector-ease)'));
assert(styles.includes('50cqw - (var(--device-width, var(--pui-preview-device-width-default)) / 2)'));

for (const phrase of ['常规模式', '元素选择模式', '父组件公开 Props', '不触发组件业务操作', '完整属性']) {
  assert(docs.includes(phrase), `governance docs must include ${phrase}`);
}

console.log('Preview element-selection Inspector contract passed.');
require('./test-preview-utility-toolbar');
require('./test-preview-component-reset');
