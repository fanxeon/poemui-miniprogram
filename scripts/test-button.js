const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'button/button.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'button/button.js' });

assert(definition, 'Button component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail, options) { events.push({ name, detail, options }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  instance.syncState();
  return { instance, events };
}

const publicProps = [
  'theme', 'variant', 'surface', 'content', 'size', 'shape', 'block', 'icon', 'iconOnly', 'loading', 'loadingProps', 'disabled',
  'openType', 'formType', 'lang', 'sessionFrom', 'sendMessageTitle', 'sendMessagePath', 'sendMessageImg',
  'showMessageCard', 'appParameter', 'hoverClass', 'hoverStartTime', 'hoverStayTime', 'hoverStopPropagation',
  'phoneNumberNoQuotaToast', 'activityType', 'entrancePath', 'needShowEntrance', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), publicProps, 'Button publishes the reviewed 31-prop contract');

const defaults = create();
assert(defaults.instance.data.rootClass.includes('pui-button--default'));
assert(defaults.instance.data.rootClass.includes('pui-button--base'));
assert(defaults.instance.data.rootClass.includes('pui-button--surface-default'));
assert(defaults.instance.data.rootClass.includes('pui-button--medium'));
assert(defaults.instance.data.rootClass.includes('pui-button--rectangle'));
assert.strictEqual(defaults.instance.data.buttonLabel, '按钮');
assert.strictEqual(defaults.instance.data.interactive, true);
assert.strictEqual(defaults.instance.data.rootStyle, '', 'normal motion comes from shared tokens');
const block = create({ block: true });
assert(block.instance.data.rootClass.includes('pui-button--block'));
assert(block.instance.data.rootStyle.includes('width:100%;min-width:0;max-width:100%;flex:1 1 100%;align-self:stretch;'), 'block must write the full-width flex track onto Button root');

const invalid = create({
  theme: 'invalid',
  variant: 'invalid',
  size: 'invalid',
  shape: 'invalid',
  formType: 'invalid',
  lang: 'invalid',
  hoverStartTime: -20,
  hoverStayTime: 9000,
  activityType: 'invalid',
});
assert(invalid.instance.data.rootClass.includes('pui-button--default'));
assert(invalid.instance.data.rootClass.includes('pui-button--base'));
assert(invalid.instance.data.rootClass.includes('pui-button--surface-default'));
assert(invalid.instance.data.rootClass.includes('pui-button--medium'));
assert(invalid.instance.data.rootClass.includes('pui-button--rectangle'));
assert.strictEqual(invalid.instance.data.normalizedFormType, '');
assert.strictEqual(invalid.instance.data.normalizedLang, 'en');
assert.strictEqual(invalid.instance.data.normalizedHoverStartTime, 0);
assert.strictEqual(invalid.instance.data.normalizedHoverStayTime, 1000);
assert.strictEqual(invalid.instance.data.normalizedActivityType, '');

assert(create({ variant: 'ghost' }).instance.data.rootClass.includes('pui-button--ghost'));
assert(create({ variant: 'transparent' }).instance.data.rootClass.includes('pui-button--transparent'));
assert(create({ surface: 'transparent' }).instance.data.rootClass.includes('pui-button--surface-transparent'));
assert(create({ shape: 'round' }).instance.data.rootClass.includes('pui-button--round'));
assert.strictEqual(create({ size: 'extra-small' }).instance.data.iconSize, 22);
assert.strictEqual(create({ size: 'small' }).instance.data.iconSize, 26);
assert.strictEqual(create({ size: 'medium' }).instance.data.iconSize, 32);
assert.strictEqual(create({ size: 'large' }).instance.data.iconSize, 38);
const iconOnly = create({ iconOnly: true });
assert.strictEqual(iconOnly.instance.data.iconOnly, true, 'iconOnly 保留真实 Icon，移除空的内容与后缀轨道');
assert(iconOnly.instance.data.rootClass.includes('pui-button--icon-only'), 'iconOnly publishes the shared single-track centering class');
assert(iconOnly.instance.data.rootStyle.includes('width:var(--pui-button-size);min-width:var(--pui-button-size);max-width:var(--pui-button-size);'), 'iconOnly writes tokenized root width to defeat native Button minimum-width drift');
assert(iconOnly.instance.data.rootStyle.includes('height:var(--pui-button-size);min-height:var(--pui-button-size);padding:0;flex:0 0 var(--pui-button-size);'), 'iconOnly owns its native Button height, padding and flex track');
assert(create({ iconOnly: true, shape: 'circle' }).instance.data.rootStyle.includes('border-radius:var(--pui-radius-round);'), 'circle iconOnly writes the same round token to the native Button root');

const loading = create({
  content: '提交',
  loading: true,
  loadingProps: {
    size: '40rpx',
    color: '#fff',
    theme: 'dots',
    text: '保存中',
    indicator: false,
    duration: 400,
    easing: 'linear',
    ariaLabel: '正在保存',
  },
});
assert.strictEqual(loading.instance.data.interactive, false);
assert.strictEqual(loading.instance.data.loadingSize, '40rpx');
assert.strictEqual(loading.instance.data.loadingTheme, 'dots');
assert.strictEqual(loading.instance.data.loadingText, '保存中');
assert.strictEqual(loading.instance.data.loadingAriaLabel, '正在保存');
assert.strictEqual(loading.instance.data.loadingColor, undefined, 'Button does not leak the full Loading API');
assert.strictEqual(loading.instance.data.loadingDuration, undefined, 'Button motion stays at the Button boundary');
loading.instance.onTap({ detail: { x: 1 } });
assert.strictEqual(loading.events.length, 0, 'loading gates click');

const reduced = create({ reduceMotion: true });
assert.strictEqual(reduced.instance.data.rootStyle, '--pui-button-duration:1ms;--pui-button-ease:linear;');

const clickable = create({ content: '确认', theme: 'primary', variant: 'outline', openType: 'share', formType: 'submit' });
clickable.instance.onTap({ detail: { x: 12, y: 8 } });
assert.strictEqual(clickable.events[0].name, 'click');
assert.deepStrictEqual(JSON.parse(JSON.stringify(clickable.events[0].detail)), { x: 12, y: 8, source: 'button' });
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(clickable.events[0].options)),
  { bubbles: true, composed: true },
  'Button click must cross composite and Slot boundaries without requiring a page-private tap bridge',
);

const disabled = create({ disabled: true });
disabled.instance.onTap({ detail: {} });
assert.strictEqual(disabled.events.length, 0, 'disabled gates click');
assert.strictEqual(disabled.instance.data.interactive, false);

const forwarded = create();
const forwarders = [
  ['forwardGetUserInfo', 'getuserinfo'],
  ['forwardContact', 'contact'],
  ['forwardCreateLiveActivity', 'createliveactivity'],
  ['forwardGetPhoneNumber', 'getphonenumber'],
  ['forwardGetRealtimePhoneNumber', 'getrealtimephonenumber'],
  ['forwardError', 'error'],
  ['forwardOpenSetting', 'opensetting'],
  ['forwardLaunchApp', 'launchapp'],
  ['forwardChooseAvatar', 'chooseavatar'],
  ['forwardAgreePrivacyAuthorization', 'agreeprivacyauthorization'],
  ['forwardPhoneOneClickLogin', 'phoneoneclicklogin'],
];
forwarders.forEach(([method, name], index) => {
  forwarded.instance[method]({ detail: { index } });
  assert.strictEqual(forwarded.events.at(-1).name, name);
  assert.strictEqual(forwarded.events.at(-1).detail.index, index);
});

const wxml = fs.readFileSync(path.join(root, 'button/button.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'button/button.wxss'), 'utf8');
const iconWxss = fs.readFileSync(path.join(root, 'icon/icon.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'button/button.json'), 'utf8'));
const previewJs = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewCss = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const apiDoc = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/BUTTON.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');
const architecture = fs.readFileSync(path.join(root, 'docs/ARCHITECTURE.md'), 'utf8');
const shadcnMetadataSource = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const metadata = require(path.join(root, 'metadata/components'));

assert(/^<button\b/.test(wxml.trim()), 'Button must use the native Mini Program button capability');
assert(!/<image\b/.test(wxml), 'Button composes Icon instead of raw image');
assert(wxml.includes('<pui-loading'), 'Button composes PoemUI Loading');
assert(wxml.includes('<pui-icon'), 'Button composes PoemUI Icon');
assert(wxml.includes('<slot name="icon"></slot>'), 'Button publishes the icon slot');
assert(wxml.includes('<slot></slot>'), 'Button publishes the default slot');
assert(wxml.includes('<slot name="suffix"></slot>'), 'Button publishes the suffix slot');
assert(wxml.includes('wx:if="{{!iconOnly}}" class="pui-button__content"'), 'iconOnly 必须从原生 Button 树移除默认内容区');
assert(wxml.includes('wx:if="{{!iconOnly}}" class="pui-button__suffix"'), 'iconOnly 必须从原生 Button 树移除后缀区');
assert.strictEqual((wxml.match(/<pui-icon\b/g) || []).length, 1, 'Button icon is always leading; trailing content uses suffix');
assert(wxml.includes("open-type=\"{{interactive ? openType : ''}}\""), 'disabled/loading clears open-type');
assert(wxml.includes("form-type=\"{{interactive ? normalizedFormType : ''}}\""), 'disabled/loading clears form-type');
assert(wxml.includes('phone-number-no-quota-toast="{{phoneNumberNoQuotaToast}}"'));
forwarders.forEach(([, name]) => assert(wxml.includes(`bind${name}=`), `${name} is forwarded from native button`));
assert(!/(loading-color|loading-duration|loading-easing|loading-progress)/.test(wxml), 'nested Loading receives only the reviewed subset');
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert(wxss.includes('.pui-button--extra-small'));
assert(wxss.includes('.pui-button--ghost'));
assert(wxss.includes('.pui-button--transparent'));
assert(
  wxss.includes('.pui-button--default.pui-button--base') &&
    wxss.includes('background: var(--pui-button-soft);') &&
    wxss.includes('box-shadow: none;'),
  'default/base Button must use the shared muted fill without an elevation shadow',
);
assert(wxss.includes('.pui-button--icon-only'), 'iconOnly geometry is owned by Button instead of a page-private override');
assert(wxss.includes('gap: 0;'), 'iconOnly removes the ordinary content gap');
assert(wxss.includes('line-height: 0;'), 'iconOnly removes native inline baseline drift');
assert(wxss.includes('.pui-button--surface-transparent,\n.pui-button--surface-transparent.pui-button--disabled'), 'transparent surface removes Button-owned visual chrome even when disabled');
assert(wxss.includes('background-color: transparent !important;'), 'transparent surface must explicitly neutralize the native Mini Program button background-color');
assert(wxss.includes('.pui-button--surface-transparent::after { border: 0 !important; }'), 'transparent surface must remove the native Mini Program button ::after border at the component root');
assert(wxss.includes('.pui-button--text,\n.pui-button--ghost,\n.pui-button--transparent'), 'transparent variant shares the chrome-free Button visual cascade without becoming a surface boundary');
assert(wxss.includes('.pui-button--block { display: flex; width: 100%; min-width: 0; max-width: 100%; flex: 1 1 100%; align-self: stretch; }'), 'block Button 必须在窄等分容器内写入完整满宽 Flex 轨道');
assert(!wxss.includes('.pui-button--dashed'));
assert(!wxss.includes('.pui-button--success'));
assert(!wxss.includes('.pui-button--warning'));
assert(wxss.includes('var(--pui-text-inverse)'));
assert(!wxss.includes('.pui-icon__image'), 'Button must let the shared Icon Font inherit currentColor without an old image filter branch');
assert(
  /\.pui-icon\s*\{[\s\S]*?color:\s*inherit;/.test(iconWxss),
  'Button + Icon composition must preserve the solid Button inverse foreground instead of rendering black on black',
);
assert(wxss.includes('var(--pui-duration-normal)'));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Button CSS has no fixed motion longer than 500ms');

const usageBranch = previewJs.slice(previewJs.indexOf("if (runtimeId === 'button')"), previewJs.indexOf("if (runtimeId === 'cell')"));
assert(usageBranch.includes('<pui-button${buttonAttrs ? ` ${buttonAttrs}` : \'\'}>${escapeHtml(content)}</pui-button>'));
assert(!usageBranch.includes('bind:'), 'Button basic usage contains no event bindings');
assert(previewJs.includes('function buttonShowcase(props)'), 'H5 publishes a dedicated Button showcase');
assert(previewJs.includes('const previewContract = props.previewContract !== false;'), 'the shared H5 Button helper enters the complete mirror contract by default');
assert(previewJs.includes("previewContract ? 'pui-button-preview' : ''"), 'the shared H5 Button helper can only opt out through an audited explicit false');
assert(previewJs.includes('const iconOnly = !!props.iconOnly;'), 'H5 Button 镜像支持 iconOnly 布局合同');
assert(previewJs.includes("const variants = ['base', 'outline', 'text', 'ghost', 'transparent'];"), 'H5 Button mirrors the five reviewed visual variants');
assert(previewJs.includes("iconOnly ? 'pui-button--icon-only' : ''"), 'H5 Button publishes the same iconOnly centering class');
assert(previewJs.includes("const surface = ['default', 'transparent'].includes(props.surface) ? props.surface : 'default';"), 'H5 Button mirrors the reviewed surface enum');
assert(previewJs.includes('`pui-button--surface-${surface}`'), 'H5 Button exposes the same surface class as Mini Program');
assert(previewJs.includes("const renderedDefaultSlot = iconOnly ? '' : defaultSlot;"), 'H5 iconOnly 必须让默认内容为空并交由共享 :empty 规则退出布局');
['基础用法', '组件类型', '组件状态', '组件样式'].forEach((heading) => assert(previewJs.includes(heading), `${heading} section exists`));
assert(!previewJs.includes('34 Props'), 'overview does not expose engineering diagnostics');
assert(previewJs.includes('function bindButtonPreviewRuntime(props)'), 'H5 binds real submit/reset form events');
assert(previewJs.includes('event.preventDefault();'), 'H5 submit is real and cannot navigate the docs page');
assert(previewJs.includes("pui-button-preview__form ${props.block ? 'is-block' : ''}"), 'block preview gives the form a real full-width parent');
assert(previewJs.includes("defaultSlot: props.content || '按钮'"), 'default preview content remains a slot instead of changing the content prop');
assert(previewJs.includes('data-phone-number-no-quota-toast'), 'H5 exposes platform attributes without fake success');
assert(previewJs.includes('default/primary/danger 三类主题与 base/outline/text/ghost/transparent 五种变体'), 'H5 compatibility text enumerates the current Button contract');
assert(!previewJs.includes("['视觉与动效', '五类主题、base/outline/dashed/text"), 'H5 compatibility text cannot retain the retired Button contract');
assert(previewCss.includes('.pui-button-demo-group'), 'H5 has sectioned Button layout');
assert(previewCss.includes('.pui-button-demo-group + .pui-button-demo-group {\n  margin-top: var(--pui-preview-section-gap);'), 'later Button section headings receive a semantic top gap');
assert(!previewCss.includes('.pui-button-demo-group + .pui-button-demo-group {\n  margin-top: var(--pui-preview-space-sm);'), 'Button section headings cannot regress to the cramped small gap');
assert(previewCss.includes('var(--pui-duration-normal)'), 'H5 uses shared motion tokens');
assert(
  previewCss.includes('.pui-button-preview.pui-button--default.pui-button--base') &&
    previewCss.includes('--pui-button-soft: var(--surface-soft);') &&
    previewCss.includes('background: var(--pui-button-soft);'),
  'H5 default/base Button mirrors the Mini Program muted fill token',
);
assert(previewCss.includes('.pui-button--transparent { background: transparent; border-color: transparent; box-shadow: none; }'), 'H5 transparent variant has no background, border or elevation');
assert(previewCss.includes('.pui-button--surface-transparent,\n.pui-button--surface-transparent.is-disabled {\n  background: transparent;\n  background-color: transparent !important;'), 'H5 mirror keeps the transparent composition surface above later shared Button states');
assert(previewCss.includes('.pui-preview-elevation-clearance { padding-block-end: var(--pui-preview-shadow-bleed); }'), 'transparent compositions reserve the shared lower elevation clearance token');
assert(shadcnMetadataSource.includes('default/primary/danger 三类主题、base/outline/text/ghost/transparent 五种变体'), 'catalog note uses the current Button enums');
assert(!shadcnMetadataSource.includes("['Button', 'button', 'adapter', 'tap', '使用微信原生 button/open-type，提供五类语义主题"), 'catalog note cannot advertise retired Button themes');
assert(architecture.includes('Button 只接收 `base/outline/text/ghost/transparent` 五种 `variant`'), 'architecture examples use supported Button variants');
assert(!architecture.includes('Button 只接收 `base/outline/dashed/text`'), 'architecture cannot teach the retired dashed variant');

assert.deepStrictEqual(metadata.apiProps.button, publicProps, 'metadata and source expose the same Button props');
assert.strictEqual(metadata.apiPropGroups.button.length, 2, 'Button props are split into core and platform groups');
assert.strictEqual(metadata.apiEvents.button.length, 12, 'Button events live in the API contract');
assert.strictEqual(metadata.apiSlots.button.length, 3, 'Button slots live in the API contract');
assert(apiDoc.includes('## Button\n'), 'Button API documentation exists');
assert(apiDoc.includes('`base`、`outline`、`text`、`ghost`、`transparent`'), 'Button API lists all five visual variants');
assert(apiDoc.includes('不同于仅供 Tabbar 等组合容器使用'), 'Button API distinguishes transparent variant from transparent surface');
assert(apiDoc.includes('### Events'), 'Button events are documented separately');
assert(apiDoc.includes('`bubbles:true, composed:true`'), 'Button API documents composed Slot-safe click delivery');
assert(apiDoc.includes('<pui-button theme="primary">主要按钮</pui-button>'), 'Button basic example stays minimal');
assert(contract.includes('基础用法不得出现任何 `bind:*`'), 'Button semantic contract protects minimal basic usage');
assert(contract.includes('`bubbles:true, composed:true`'), 'Button contract protects composed click delivery through named Slots');
assert(contract.includes('实色主要/危险 Button 中的内置单色 Icon 必须跟随反色语义'), 'Button contract protects solid-button Icon contrast');
assert(contract.includes('TDesign 1.15.3 对照决定'), 'Button contract pins the audited TDesign baseline');
assert(contract.includes('TDesign 安装包真实声明 30 项 Button Props，PoemUI 为 31 项'), 'Button contract records the real API count difference');
assert(contract.includes('`surface=transparent`'), 'Button contract bounds transparent composition surfaces');
assert(contract.includes('`variant=transparent`'), 'Button contract distinguishes the visual transparent variant from the composition surface');
assert(previewJs.includes('<button'), 'H5 Button mirror keeps a native button event root for browser bubbling semantics');
for (const decision of ['`light` 主题', '`dashed` 变体', '`ghost` Boolean', '`tId`', '`customDataset`', '`formType`']) {
  assert(contract.includes(decision), `Button contract must preserve the TDesign decision for ${decision}`);
}
assert(alignment.includes('| 1 | Button | Button | accepted / pending-cli |'), 'alignment queue records the user-accepted Button while preserving the pending CLI gate');
assert(alignment.includes('授权只取消逐项等待，不取消顺序、battle 深度或失败阻断'), 'alignment keeps full battle gates under autonomous acceptance');
assert(alignment.includes('| `tap` + 11 个微信平台事件 | `click` + 同 11 个平台事件'), 'alignment records the event naming decision');

process.stdout.write('Button contract tests passed.\n');
