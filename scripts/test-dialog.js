const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dialog/dialog.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'dialog/dialog.js' });
assert(definition, 'Dialog component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const expectedProps = [
  'visible', 'actions', 'buttonLayout', 'cancelBtn', 'closeBtn', 'closeOnOverlayClick', 'confirmBtn', 'content',
  'overlayProps', 'preventScrollThrough', 'showOverlay', 'showFooter', 'title', 'usingCustomNavbar', 'zIndex', 'ariaLabel', 'reduceMotion',
].sort();
assert.deepStrictEqual(Object.keys(definition.properties).sort(), expectedProps, 'Dialog publishes exactly the aligned 17 Props');
assert.deepStrictEqual(Object.keys(definition.methods).sort(), ['close', 'onAction', 'onCancel', 'onCloseTap', 'onConfirm', 'onPopupVisibleChange', 'requestClose', 'syncState'].sort());

const defaults = create();
assert.strictEqual(defaults.instance.data.visible, false);
assert.strictEqual(defaults.instance.data.normalizedButtonLayout, 'horizontal');
assert.strictEqual(defaults.instance.data.normalizedCancelBtn, null);
assert.strictEqual(defaults.instance.data.normalizedConfirmBtn, null);
assert.strictEqual(defaults.instance.data.semanticLabel, '对话框');
assert.strictEqual(defaults.instance.close(), false, 'close() cannot fabricate a close event for visible=false');

const boundaries = create({
  visible: true,
  title: '',
  content: '',
  actions: [{ content: 0 }, { content: '', disabled: true }],
  cancelBtn: 0,
  confirmBtn: { content: '', loading: false, theme: 'danger' },
  closeBtn: { icon: 'close', disabled: false },
  zIndex: 20000,
});
assert.strictEqual(boundaries.instance.data.normalizedActions[0].content, '0', 'numeric 0 action content must be retained');
assert.strictEqual(boundaries.instance.data.normalizedCancelBtn.content, '0', 'numeric 0 cancel content must be retained');
assert.strictEqual(boundaries.instance.data.normalizedConfirmBtn.content, '', 'empty string Button content must remain observable');
assert.strictEqual(boundaries.instance.data.normalizedConfirmBtn.theme, 'danger');
assert.strictEqual(boundaries.instance.data.resolvedZIndex, 12000);
assert.strictEqual(boundaries.instance.data.hasHeader, true);

const cancel = create({ visible: true, cancelBtn: '取消' });
assert.strictEqual(cancel.instance.onCancel(), true);
assert.deepStrictEqual(cancel.events.map((event) => event.name), ['cancel', 'close']);
assert.strictEqual(cancel.events[1].detail.trigger, 'cancel');

const confirm = create({ visible: true, confirmBtn: '确认发布' });
assert.strictEqual(confirm.instance.onConfirm(), true);
assert.deepStrictEqual(confirm.events.map((event) => event.name), ['confirm']);
assert.strictEqual(confirm.instance.data.visible, true, 'confirm must not silently close a controlled Dialog');

const actions = create({ visible: true, actions: [{ content: '保存草稿' }, { content: '不可用', disabled: true }] });
assert.strictEqual(actions.instance.onAction({ currentTarget: { dataset: { index: 0 } } }), true);
assert.deepStrictEqual(plain(actions.events), [{ name: 'action', detail: { index: 0 } }]);
assert.strictEqual(actions.instance.onAction({ currentTarget: { dataset: { index: 1 } } }), false);
assert.strictEqual(actions.instance.data.visible, true, 'action must not silently close a controlled Dialog');

const close = create({ visible: true, closeBtn: true });
assert.strictEqual(close.instance.onCloseTap(), true);
assert.deepStrictEqual(plain(close.events), [{ name: 'close', detail: { trigger: 'close-btn' } }]);
assert.strictEqual(close.instance.close(), true);
assert.deepStrictEqual(plain(close.events[1]), { name: 'close', detail: { trigger: 'programmatic' } });

const disabledClose = create({ visible: true, closeBtn: { disabled: true } });
assert.strictEqual(disabledClose.instance.onCloseTap(), false);
assert.strictEqual(disabledClose.events.length, 0);

const overlay = create({ visible: true, closeOnOverlayClick: true });
assert.strictEqual(overlay.instance.onPopupVisibleChange({ detail: { visible: false, trigger: 'overlay' } }), true);
assert.deepStrictEqual(plain(overlay.events), [
  { name: 'overlay-click' },
  { name: 'close', detail: { trigger: 'overlay' } },
]);

const popupCloseButton = create({ visible: true });
popupCloseButton.instance.onPopupVisibleChange({ detail: { visible: false, trigger: 'close-btn' } });
assert.deepStrictEqual(plain(popupCloseButton.events), [{ name: 'close', detail: { trigger: 'close-btn' } }]);

const wxml = fs.readFileSync(path.join(root, 'dialog/dialog.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'dialog/dialog.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'dialog/dialog.json'), 'utf8'));
const popupSource = fs.readFileSync(path.join(root, 'popup/popup.js'), 'utf8');
const popupWxml = fs.readFileSync(path.join(root, 'popup/popup.wxml'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
assert(preview.includes('function updateDialogPreviewDom(demo)'));
const dialogRequest = preview.slice(preview.indexOf('function requestDialogPreviewVisibility('), preview.indexOf('function dialogShowcase('));
assert(dialogRequest.includes('if (layer && demo.dialogRendered)'));
assert(!dialogRequest.includes('renderStage();\n    return;'), 'mounted Dialog must update its existing layer before a fallback Stage render');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const dialogApi = api.slice(api.indexOf('## Dialog'), api.indexOf('## Direction'));
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const dialogContract = fs.readFileSync(path.join(root, 'docs/components/DIALOG.md'), 'utf8');
const componentContractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const example = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));

assert(wxml.includes('<pui-popup'));
for (const attr of ['overlay-props="{{overlayProps}}"', 'prevent-scroll-through="{{preventScrollThrough}}"', 'using-custom-navbar="{{usingCustomNavbar}}"', 'bind:visible-change="onPopupVisibleChange"']) assert(wxml.includes(attr), `Dialog must forward ${attr}`);
assert(wxml.includes('close-btn="{{false}}"'));
assert(wxml.includes('close-on-overlay-click="{{showOverlay}}"'));
assert(!wxml.includes('bind:close="onPopupClose"'));
assert(!wxml.includes('bind:overlay-click="onOverlayClick"'));
assert(wxml.includes('<pui-button'));
assert(!/<button\b|<input\b|<image\b/.test(wxml), 'native Dialog must compose PoemUI controls');
assert(!wxml.includes('<pui-loading'));
assert(!wxml.includes('<pui-empty'));
assert(!/<slot(?:\s*\/|\s*><\/slot>)/.test(wxml), 'Dialog must not claim a default Slot');
for (const slot of ['top', 'header-left', 'title', 'content', 'middle', 'actions', 'cancel-btn', 'confirm-btn']) assert(wxml.includes(`name="${slot}"`), `Dialog must expose ${slot} Slot`);
assert(wxml.includes('custom-class="pui-dialog__close"'));
assert(wxml.includes('shape="circle"'));
assert(wxml.includes('size="small"'));
assert(wxml.includes('icon-only'), 'Dialog Close must opt into fixed icon-button geometry in WeChat');
assert(wxml.includes('theme="default"') && wxml.includes('variant="base"'), 'Dialog close is a default circular icon button');
assert(!wxml.includes('bind:after-open'));
assert(!wxml.includes('bind:after-close'));
assert(!wxml.includes('bind:retry'));
assert(wxml.includes('wx:if="{{hasFooter}}" class="pui-dialog__footer pui-dialog__actions'), 'Footer mounts only when built-in or slotted actions are requested');
assert(wxml.includes('wx:if="{{!normalizedActions.length && normalizedCancelBtn}}"'), 'actions must replace the built-in Cancel button');
assert(wxml.includes('wx:if="{{!normalizedActions.length && normalizedConfirmBtn}}"'), 'actions must replace the built-in Confirm button');
assert.strictEqual(json.usingComponents['pui-popup'], '../popup/popup');
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(Object.keys(json.usingComponents).length, 2, 'Dialog must not import state components it no longer owns');

for (const token of ['--pui-dialog-action-spacing', '--pui-dialog-section-spacing', '--pui-dialog-content-gap', '--pui-dialog-close-size']) assert(wxss.includes(token));
assert(/\.pui-dialog\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;[\s\S]*?max-height:\s*var\(--pui-dialog-max-height\);[\s\S]*?overflow:\s*hidden;[\s\S]*?\}/.test(wxss));
assert(/\.pui-dialog__body\s*\{[^}]*flex:\s*0 1 auto;[^}]*min-height:\s*0;[^}]*overflow-y:\s*auto;[^}]*\}/.test(wxss));
assert(/\.pui-dialog__header\s*\{[^}]*grid-template-columns:\s*var\(--pui-dialog-close-size\) minmax\(0, 1fr\) var\(--pui-dialog-close-size\);[^}]*\}/.test(wxss));
assert(/\.pui-dialog__footer:empty\s*\{\s*display:\s*none;\s*\}/.test(wxss), 'empty Footer cannot create a phantom gap');
assert(!/height:\s*auto[^;]*;[^}]*transition/.test(wxss));
assert(!/position:\s*absolute/.test(wxss.match(/\.pui-dialog__close\s*\{[^}]*\}/)?.[0] || ''));

for (const prop of ['overlayProps', 'preventScrollThrough', 'usingCustomNavbar']) assert(popupSource.includes(`${prop}: {`), `Popup must implement Dialog dependency ${prop}`);
assert(popupSource.includes('safeOverlayColor'));
assert(popupWxml.includes('wx:if="{{showOverlay && preventScrollThrough}}"'));
assert(popupWxml.includes('catchtouchmove="noop"'));
assert(popupWxml.includes('wx:elif="{{showOverlay}}"'));
for (const prop of ['overlayProps', 'preventScrollThrough', 'usingCustomNavbar']) assert(metadata.apiProps.popup.includes(prop), `Popup metadata must expose Dialog dependency ${prop}`);
assert(preview.includes('function bindPopupPreviewRuntime'));

const dialogPreviewBlock = preview.slice(preview.indexOf('function dialogMotionDuration'), preview.indexOf('const directionPreviewRtlLanguages'));
const dialogUsageBlock = preview.slice(preview.indexOf("if (runtimeId === 'dialog')"), preview.indexOf("if (runtimeId === 'direction')"));
const dialogStageHandlerBlock = preview.slice(preview.indexOf("type === 'dialog-open'"), preview.indexOf("type === 'empty-action'"));
const previewRuntimeBlock = preview.slice(preview.indexOf('function bindPreviewRuntime'), preview.indexOf('function apiPropDescription'));
assert(dialogPreviewBlock.includes('function dialogPreviewScenarioProps'));
assert(dialogPreviewBlock.includes('基础用法'));
assert(dialogPreviewBlock.includes('按钮与布局'));
assert(dialogPreviewBlock.includes('具名插槽'));
assert(dialogPreviewBlock.includes('遮罩与关闭'));
assert(dialogPreviewBlock.includes("demoAction: 'dialog-open'"));
assert(dialogStageHandlerBlock.includes("type === 'dialog-confirm'"));
assert(dialogStageHandlerBlock.includes('TDesign 的直接组件只抛出 confirm'));
assert(previewRuntimeBlock.includes("if (id === 'dialog') {\n    bindDialogPreviewRuntime(props);\n    return;\n  }"), 'Dialog must register its H5 runtime so the enter timer, focus, keyboard close and pointer handlers run');
assert(!dialogPreviewBlock.includes('dialog-retry'));
assert(!dialogPreviewBlock.includes('defaultVisible'));
assert(!dialogPreviewBlock.includes('confirmLoading'));
assert(!dialogPreviewBlock.includes('pui-dialog-preview__state'));
assert(wxml.includes('grid-template-columns:repeat(') && wxml.includes('block') && wxss.includes('.pui-dialog__actions { display: grid;'), 'Dialog footer is a full-width one/two column PUI Button grid');
assert(!dialogUsageBlock.includes('bind:'));
assert(dialogUsageBlock.includes('<pui-dialog id="delivery-dialog"'));
assert(dialogPreviewBlock.includes('pui-dialog-showcase__content'), 'Dialog flow content must be separated from the edge-to-edge overlay stage');
assert(previewStyles.includes('.dialog-demo-section'));
assert(/\.pui-dialog-showcase__content\s*\{[^}]*gap:\s*var\(--pui-section-gap\);[^}]*padding:\s*var\(--pui-preview-panel-padding\);[^}]*\}/.test(previewStyles), 'Dialog flow content must retain the shared panel inset and section gap');
assert(/\.pui-dialog-showcase__stage\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*pointer-events:\s*none;[^}]*\}/.test(previewStyles));
assert(/\.pui-dialog-layer\s*\{[^}]*padding:\s*var\(--pui-preview-panel-padding\);[^}]*\}/.test(previewStyles), 'Dialog overlay panel must reserve the shared preview safety inset');
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(!previewStyles.includes('.pui-dialog-preview__state'));
assert(!previewStyles.includes('.preview-canvas--dialog'));
assert(/\.pui-dialog--preview\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*max-height:\s*100%;[^}]*overflow:\s*hidden;[^}]*\}/.test(previewStyles));

assert.deepStrictEqual(metadata.apiProps.dialog.slice().sort(), expectedProps);
assert.strictEqual(metadata.apiEvents.dialog.length, 5);
assert.strictEqual(metadata.apiSlots.dialog.length, 8);
assert.deepStrictEqual(metadata.apiMethods.dialog.map((item) => item.name), ['close()']);
assert.strictEqual(metadata.apiPropGroups.dialog.length, 3);
assert(dialogApi.includes('17 个 Props'));
assert(dialogApi.includes('`close()`'));
assert(dialogApi.includes('八个具名 Slot'));
assert(!dialogApi.includes('`defaultVisible` | `Boolean` / `false`'));
assert(dialogApi.includes('`header-left`'));
assert(!api.includes('| `Dialog` | `visible`、`defaultVisible`'));
assert(compatibility.includes('17 个 Props'));
assert(compatibility.includes('Dialog 不再内建 error/empty/loading/retry'));
for (const heading of ['## 1. 组件定位与公开边界', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环']) assert(dialogContract.includes(heading));
assert(dialogContract.includes('17 个 Props、5 个 Events、8 个具名 Slots'));
assert(dialogContract.includes('Cancel 固定按 `cancel → close({ trigger: \'cancel\' })`'));
assert(componentContractIndex.includes('[Dialog](./DIALOG.md)'));
assert(shadcn.includes('原生 Dialog 提供 17 Props'));

const exampleDialogStart = example.indexOf('<pui-dialog\n    id="deliveryDialog"');
const exampleDialogEnd = example.indexOf('/>', exampleDialogStart) + 2;
const exampleDialog = example.slice(exampleDialogStart, exampleDialogEnd);
assert(exampleDialog.includes('bind:confirm="onDialogConfirm"'));
assert(exampleDialog.includes('bind:close="onDialogClose"'));
assert(exampleDialog.includes('bind:overlay-click="onDialogOverlayClick"'));
for (const forbidden of ['bind:input', 'bind:change', 'bind:after-open', 'bind:after-close', 'description=', 'show-close']) assert(!exampleDialog.includes(forbidden), `example Dialog cannot retain ${forbidden}`);
assert(exampleJs.includes("dialogConfirmBtn: { content: '确认发布', theme: 'primary' }"));
assert(exampleJs.includes("dialogVisible: false, dialogStatus: 'close：'"));

const generatedPaths = [path.join(root, 'miniprogram_dist/dialog/dialog.js')];
if (generatedPaths.every(fs.existsSync)) {
  const sourceDialog = fs.readFileSync(path.join(root, 'dialog/dialog.js'), 'utf8');
  generatedPaths.forEach((file) => assert.strictEqual(fs.readFileSync(file, 'utf8'), sourceDialog, `${file} must be regenerated from Dialog source`));
}

console.log('Dialog contract tests passed.');
