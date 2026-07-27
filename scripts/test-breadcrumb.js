const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const js = read('breadcrumb/breadcrumb.js');
const json = JSON.parse(read('breadcrumb/breadcrumb.json'));
const wxml = read('breadcrumb/breadcrumb.wxml');
const preview = read('preview/app.js');
const contract = read('docs/components/BREADCRUMB.md');
for (const prop of ['items', 'value', 'defaultValue', 'current', 'loading', 'error', 'reduceMotion']) assert(js.includes(`${prop}:`), `Breadcrumb must retain ${prop}`);
for (const event of ['click', 'input', 'change', 'retry']) assert(js.includes(`this.triggerEvent('${event}'`), `Breadcrumb must publish ${event}`);
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert(wxml.includes('scroll-x="{{!wrap}}"'), 'nowrap must retain local horizontal scrolling');
assert(preview.includes('function breadcrumbShowcase(props, demo)'), 'H5 must mirror Breadcrumb');
assert(preview.includes("demoAction: 'breadcrumb-select'"), 'H5 must retain real selection');
for (const title of ['基础路径', '图标与前后扩展', '长路径横向滚动', '换行与标签截断']) {
  assert(preview.includes(`<h3>${title}</h3>`), `H5 overview must retain ${title} example`);
}
assert(preview.includes("dataAttributes: { 'breadcrumb-sample': sampleId }"), 'each Breadcrumb example must identify its real interaction state');
assert(preview.includes("const sampleProps = breadcrumbSampleProps(sampleId, props);"), 'example clicks must resolve their own real props');
assert(preview.includes("requestBreadcrumbPreviewSelection(sampleProps, sampleDemo"), 'example clicks must use the shared selection contract');
assert(contract.includes('tdesign-miniprogram@1.15.3'), 'contract must record TDesign absence');
assert(contract.includes('component-only'), 'contract must define overview boundary');
console.log('Breadcrumb contract tests passed.');
