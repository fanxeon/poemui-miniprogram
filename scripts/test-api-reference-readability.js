const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('preview/app.js');
const styles = read('preview/styles.css');
const docs = [read('AGENTS.md'), read('docs/UI_DESIGN_CONTRACT.md'), read('docs/H5_PREVIEW_COMPATIBILITY.md')].join('\n');

assert(app.includes('function formatApiOptions(prop)'), 'API must derive selectable values from the existing Prop definition');
assert(app.includes('<span role="columnheader">演示初值</span><span role="columnheader">可选值</span>'), 'selectable values must sit immediately after demo defaults');
assert(app.includes('return prop.options.map((option) =>'), 'enum options must come from prop.options');
assert(app.includes("return 'true, false';"), 'boolean options must be explicit and comma-separated');
assert(app.includes("return 'true, false, null';"), 'nullable boolean options must include null');
assert(app.includes("return `${prop.min}–${prop.max}${Number.isFinite(prop.step) ? `, 步长 ${prop.step}` : ''}`;"), 'range constraints must expose bounds and step');
assert(app.includes("return '—';"), 'unconstrained props must show a deliberate empty value');
assert(!app.includes("`enum ${prop.options.join(' | ')}`"), 'type column must not duplicate enum values');

assert(/\.api-table__row > span\s*\{[^}]*font-size:\s*var\(--pui-font-size-body-medium\);[^}]*line-height:\s*var\(--pui-line-height-body-medium\);/s.test(styles), 'API body text must use the 14px PUI body-medium contract');
assert(/\.api-table__row code\s*\{[^}]*font-size:\s*var\(--pui-font-size-body-medium\);[^}]*line-height:\s*var\(--pui-line-height-body-medium\);/s.test(styles), 'API code cells must remain equally readable');
assert(styles.includes('grid-template-columns: 112px 104px 108px minmax(180px, 0.8fr) minmax(240px, 1.4fr);'), 'desktop API table must keep five stable columns');
assert(styles.includes('[role="cell"]::before'), 'narrow API rows must restore field labels when the desktop header exits');
assert(styles.includes('content: attr(data-label);'), 'responsive API labels must come from the same cell markup');
assert(/@media \(max-width: 900px\)[\s\S]*?\.api-table__row--head\s*\{\s*display:\s*none;/s.test(styles), 'narrow API tables must stack labeled fields instead of forcing a wide row');
assert(app.includes('role="cell" data-label="参数"'), 'Prop cells must expose responsive field labels');
assert(app.includes('role="cell" data-label="事件"'), 'Event cells must expose responsive field labels');
assert(app.includes('role="cell" data-label="名称"'), 'Slot cells must expose responsive field labels');

const apiCodeRule = styles.match(/\.api-table__row code\s*\{([^}]*)\}/s)?.[1] || '';
const apiTypeRule = styles.match(/\.api-table__row \.api-type\s*\{([^}]*)\}/s)?.[1] || '';
for (const [name, rule] of [['code', apiCodeRule], ['type', apiTypeRule]]) {
  assert(!/text-overflow:\s*ellipsis/.test(rule), `API ${name} cells must never use ellipsis`);
  assert(!/white-space:\s*nowrap/.test(rule), `API ${name} cells must wrap instead of truncating`);
  assert(!/overflow:\s*hidden/.test(rule), `API ${name} cells must not hide text`);
}
assert(/\.api-table__row code\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*white-space:\s*normal;/s.test(styles), 'API code cells must fully wrap long values');
assert(/\.api-table__row > span\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*white-space:\s*normal;/s.test(styles), 'API text cells must fully wrap long descriptions');

for (const phrase of ['参数、类型、演示初值、可选值、说明', '用逗号分隔', '--pui-font-size-body-medium', '完整展示', '禁止省略号']) {
  assert(docs.includes(phrase), `API governance must include ${phrase}`);
}

console.log('API reference readability and selectable-values contract passed.');
