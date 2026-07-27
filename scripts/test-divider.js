const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('divider/divider.js');
const wxml = read('divider/divider.wxml');
const wxss = read('divider/divider.wxss');
const preview = read('preview/app.js');
const previewCss = read('preview/styles.css');
const api = read('docs/COMPONENT_API.md');
const contract = read('docs/components/DIVIDER.md');
const contractIndex = read('docs/components/README.md');
const generator = read('scripts/generate-components.js');
const example = read('_example/miniprogram/pages/components/index.wxml');
const theme = read('common/style/theme.wxss');
const metadata = require(path.join(root, 'metadata/components.js'));

assert.deepStrictEqual(metadata.apiProps.divider, [
  'layout', 'align', 'content', 'showContent', 'dashed', 'decorative', 'ariaLabel',
]);
assert.strictEqual(metadata.apiEvents.divider, undefined, 'Divider must not expose events');
assert.deepStrictEqual(metadata.apiSlots.divider, [
  { name: 'default', description: '横向分割线中的自定义短内容；content 为空时需同时设置 showContent。' },
]);

assert(!source.includes('triggerEvent('), 'Divider is a display primitive without fake events');
assert(source.includes("orientation: 'horizontal'"));
assert(source.includes('orientation: layout'));
assert(wxml.includes('role="separator"'));
assert(wxml.includes('aria-orientation="{{orientation}}"'));
assert(wxml.includes('aria-hidden="{{decorative}}"'));
assert(wxml.includes('<slot>{{content}}</slot>'));
assert(wxml.includes('wx:if="{{!isVertical}}" class="pui-divider__line pui-divider__line--before"'));
assert(wxml.includes('wx:if="{{showContentNode}}" class="pui-divider__content"'));

const rootRule = wxss.match(/\.pui-divider\s*\{([^}]*)\}/);
assert(rootRule, 'Divider root CSS must exist');
assert(!/\bgap\s*:/.test(rootRule[1]), 'Default empty Divider must not have a center gap');
assert(/\.pui-divider__content\s*\{[^}]*margin:\s*0 var\(--pui-space-normal\)/s.test(wxss), 'content owns the horizontal spacing');
assert(wxss.includes('var(--pui-divider-color)'), 'native Divider lines must use the dedicated contrast-safe divider token');
assert(theme.match(/--pui-divider-color: #a1a1aa;/g)?.length >= 2, 'native divider token must define the same readable light and dark value');
assert(!/\.pui-border--off[\s\S]*?--pui-divider-color:\s*transparent;/.test(theme), 'border-off must not erase Divider content hierarchy');
assert(/\.pui-divider--vertical\s*\{[^}]*width:\s*1rpx[^}]*height:\s*32rpx/s.test(wxss));

const showcase = preview.slice(preview.indexOf('function dividerPreviewNode'), preview.indexOf('function avatarPreviewDuration'));
for (const section of ['基础用法', '文字与对齐', '布局与线型']) assert(showcase.includes(section));
for (const forbidden of ['构建结果', 'npm 包检查已通过', '发布状态', '分割线参数']) {
  assert(!showcase.includes(forbidden), `Divider overview must not expose engineering diagnostics: ${forbidden}`);
}
assert(showcase.includes('aria-orientation="${layout}"'));
assert(showcase.includes("const hasContent = layout === 'horizontal' && (props.showContent || !!props.content);"));
assert(preview.includes("divider: { layout: 'horizontal', align: 'center', content: '', showContent: false"));
assert(preview.includes("content: { type: 'text', value: '' }, showContent: { type: 'boolean', value: false }"));
assert(preview.includes("Divider 是纯展示分割线，H5 与小程序端都没有 click/input"));
assert(preview.includes('低动效不改变 Divider 几何'));
assert(preview.includes("layout: '分割线方向：horizontal 或 vertical"));
assert(previewCss.includes('.pui-divider-demo-group'));
assert(previewCss.includes('gap: var(--pui-preview-section-gap)'));
assert(previewCss.includes('.preview-device__component-layout > .pui-divider-contract-showcase.demo-section'));
const previewRootRule = previewCss.match(/\.pui-divider-preview\s*\{([^}]*)\}/);
assert(previewRootRule && !/\bgap\s*:/.test(previewRootRule[1]), 'H5 empty Divider must be continuous');
assert(/\.pui-divider-preview__content\s*\{[^}]*margin:\s*0 var\(--pui-preview-space-normal\)/s.test(previewCss));
assert(previewCss.match(/--pui-divider-color: #a1a1aa;/g)?.length >= 2, 'H5 divider token must define the same readable light and dark value');
assert(previewCss.includes('background: var(--pui-divider-color);') && previewCss.includes('border-top: 1px dashed var(--pui-divider-color);') && previewCss.includes('border-left: 1px dashed var(--pui-divider-color);'), 'H5 Divider lines and dashes must use the shared divider token');
assert(!/\.app-shell\[data-border="off"\] \.preview-device__viewport\s*\{[\s\S]*?--pui-divider-color:\s*transparent;/.test(previewCss), 'H5 border-off must not erase Divider content hierarchy');
assert(!showcase.includes('pui-divider-preview__vertical'), 'H5 must use the same Divider root for both layouts');

const apiDivider = api.slice(api.indexOf('## Divider'), api.indexOf('## Badge'));
assert(apiDivider.includes('<pui-divider />'));
assert(apiDivider.includes('组件没有 Events 或实例方法'));
assert(apiDivider.includes('| `default` | 横向分割线中的自定义短内容'));
assert(!apiDivider.includes('bind:'));
assert(contract.includes('默认横向且无内容时，两段线条必须连续'));
assert(contract.includes('## 8. TDesign 1.15.3 对照决定'));
assert(contractIndex.includes('[Divider](./DIVIDER.md)'));
assert(generator.match(/preservedNativeComponents = new Set\(\[[\s\S]*?'divider'/), 'experimental generator must preserve maintained Divider');
assert(example.includes('<pui-divider />'));
assert(example.includes('<pui-divider content="组件状态" align="left" />'));
assert(example.includes('<pui-divider show-content dashed>'));
assert(!example.includes('Divider + Tag slot'));

let definition = null;
vm.runInNewContext(source, {
  Component(value) { definition = value; },
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    throw new Error(`Unexpected dependency: ${request}`);
  },
});
assert(definition, 'Divider runtime definition must be captured');
assert.strictEqual(definition.methods.onTap, undefined);

function makeInstance(overrides = {}) {
  const instance = {
    data: {
      layout: 'horizontal', align: 'center', content: '', showContent: false,
      dashed: false, decorative: true, ariaLabel: '分隔线', colorScheme: '',
      ...definition.data,
      ...overrides,
    },
    getColorSchemeClass() { return this.data.colorScheme ? `pui-theme--${this.data.colorScheme}` : ''; },
    setData(patch) { Object.assign(this.data, patch); },
  };
  Object.assign(instance, definition.methods);
  return instance;
}

const defaults = makeInstance();
defaults.syncState();
assert.strictEqual(defaults.data.orientation, 'horizontal');
assert.strictEqual(defaults.data.isVertical, false);
assert.strictEqual(defaults.data.showContentNode, false);
assert(defaults.data.rootClass.includes('pui-divider--horizontal'));
assert(defaults.data.rootClass.includes('pui-divider--center'));

const text = makeInstance({ content: '章节' });
text.syncState();
assert.strictEqual(text.data.showContentNode, true);

const slot = makeInstance({ showContent: true });
slot.syncState();
assert.strictEqual(slot.data.showContentNode, true);

const vertical = makeInstance({ layout: 'vertical', content: '不会显示', showContent: true, align: 'left', dashed: true });
vertical.syncState();
assert.strictEqual(vertical.data.orientation, 'vertical');
assert.strictEqual(vertical.data.isVertical, true);
assert.strictEqual(vertical.data.showContentNode, false);
assert(vertical.data.rootClass.includes('pui-divider--vertical'));
assert(vertical.data.rootClass.includes('pui-divider--dashed'));

const invalid = makeInstance({ layout: 'diagonal', align: 'end' });
invalid.syncState();
assert.strictEqual(invalid.data.orientation, 'horizontal');
assert(invalid.data.rootClass.includes('pui-divider--horizontal'));
assert(invalid.data.rootClass.includes('pui-divider--center'));
assert(!invalid.data.rootClass.includes('diagonal'));
assert(!invalid.data.rootClass.includes('end'));

process.stdout.write('Divider contract tests passed.\n');
