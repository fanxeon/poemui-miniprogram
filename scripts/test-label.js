const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const js = read('label/label.js');
const json = JSON.parse(read('label/label.json'));
const wxml = read('label/label.wxml');
const wxss = read('label/label.wxss');
const metadata = read('metadata/shadcn.js');
const preview = read('preview/app.js');
const compatibility = read('docs/H5_PREVIEW_COMPATIBILITY.md');
const contract = read('docs/components/LABEL.md');

for (const prop of ['content', 'required', 'disabled', 'colon']) {
  assert(js.includes(`${prop}:`), `Label must retain ${prop}`);
}
assert(!js.includes('triggerEvent('), 'Label must not publish component events');
assert.deepStrictEqual(json.usingComponents, {}, 'Label must not invent internal PUI dependencies');
assert(wxml.includes('wx:if="{{colon && content}}"'), 'colon must depend on non-empty content');
assert(wxml.includes('wx:if="{{required}}"'), 'required mark must remain conditional');
assert(wxml.includes('<slot></slot>'), 'Label must retain only the default slot');
assert(wxss.includes('var(--pui-text-disabled)'), 'disabled must use the shared text token');
assert(wxss.includes('var(--pui-color-danger)'), 'required mark must use the shared danger token');
assert(metadata.includes("['Label', 'label', 'native', 'none'"), 'Label metadata must not claim tap');
assert(preview.includes("compatId === 'label'"), 'H5 compatibility must define Label explicitly');
assert(preview.includes('inputControlSample({ customClass: \'pui-label-showcase__input\''), 'H5 must reuse the shared PUI Input helper');
assert(compatibility.includes('Label 的 H5 镜像'), 'H5 compatibility document must cover Label');
assert(contract.includes('tdesign-miniprogram@1.15.3'), 'contract must record TDesign absence');
assert(contract.includes('没有公开 Events 或 Methods'), 'contract must lock zero-event boundary');
assert(contract.includes('component-only'), 'contract must lock overview boundary');

console.log('Label contract tests passed.');
