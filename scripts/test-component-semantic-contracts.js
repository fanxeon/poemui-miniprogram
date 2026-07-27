const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contractsDir = path.join(root, 'docs/components');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const index = read('docs/components/README.md');
const template = read('docs/components/CONTRACT_TEMPLATE.md');
const prompt = read('docs/NEW_SESSION_PROMPT.md');
const agentRules = read('AGENTS.md');
const contributing = read('CONTRIBUTING.md');
const alignment = read('docs/TDESIGN_COMPONENT_ALIGNMENT.md');

require(path.join(root, 'scripts', 'test-breadcrumb.js'));
require(path.join(root, 'scripts', 'test-label.js'));

for (const required of [
  '每个 PoemUI 组件',
  '下一次发生实质修改前',
  '禁止批量生成未经审计的空壳文档',
  '[合同模板](./CONTRACT_TEMPLATE.md)',
  '[PoemUI 新会话启动提示词](../NEW_SESSION_PROMPT.md)',
]) {
  assert(index.includes(required), `component contract index must include: ${required}`);
}

for (const heading of [
  '## 1. 组件定位',
  '## 2. 固定结构与区域',
  '## 3. PUI 组合与依赖',
  '## 4. Token、间距与排版',
  '## 5. 内容、Slot 与组合边界',
  '## 6. 状态与优先级',
  '## 7. 交互、受控边界与事件',
  '## 8. 可访问性',
  '## 9. H5 预览与跨端一致性',
  '## 10. 响应式、主题与视觉配置',
  '## 11. 明确禁止',
  '## 12. 修改闭环',
]) {
  assert(template.includes(heading), `component contract template must include: ${heading}`);
}

for (const required of ['`shadow-safe`', '`edge-to-edge`', '禁止通过页面私有 margin 修复阴影裁切']) {
  assert(template.includes(required), `component contract template must define preview parent layout: ${required}`);
}

for (const required of [
  '完整阅读仓库根目录 AGENTS.md',
  '完整阅读 docs/COMPONENT_FEEDBACK.md',
  '阅读 docs/UI_DESIGN_CONTRACT.md',
  '阅读 docs/components/README.md',
  'docs/components/<COMPONENT-ID-UPPER>.md',
  'npm run feedback:list -- --component <component-id>',
  'docs/components/CONTRACT_TEMPLATE.md',
  '禁止批量创建未经审计的空壳合同',
  '每份组件合同必须明确 PreviewDevice 使用 `shadow-safe` 还是 `edge-to-edge` 父布局',
  '默认 Cancel 是普通中性 PUI Button，不使用 outline',
]) {
  assert(prompt.includes(required), `new-session prompt must include: ${required}`);
}

assert(agentRules.includes('保存每个组件的专属语义合同，每个组件最终都必须有一份'), 'AGENTS must require one semantic contract per component');
assert(agentRules.includes('docs/NEW_SESSION_PROMPT.md'), 'AGENTS must link the new-session prompt');
assert(agentRules.includes('docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'AGENTS must link the TDesign shared-component alignment goal');
assert(prompt.includes('docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'new-session prompt must route shared components through the TDesign alignment goal');
for (const required of ['本轮固定 npm 参考版本：`tdesign-miniprogram@1.15.3`', '一次只允许一个 `in-progress`', '基础用法', '零 `bind:*`', 'API 表格内所有文字必须完整展示']) {
  assert(alignment.includes(required), `TDesign alignment contract must include: ${required}`);
}
const alignmentRows = [...alignment.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm)]
  .filter((match) => Number(match[1]) > 0);
assert.strictEqual(alignmentRows.length, 54, 'TDesign alignment must keep the reviewed 54-component queue after retired component cleanup');
assert.strictEqual(new Set(alignmentRows.map((match) => match[2])).size, 54, 'each PoemUI component must appear once in the TDesign alignment queue');
const alignmentStatuses = alignmentRows.map((match) => match[4].trim());
assert(alignmentStatuses.every((status) => /^(?:pending|in-progress|accepted(?:\s*\/\s*pending-cli)?|blocked)$/.test(status)), 'alignment rows must use a governed delivery status');
assert(alignmentStatuses.filter((status) => status === 'in-progress').length <= 1, 'only one shared component may be in progress');
let reachedOpenQueue = false;
for (const status of alignmentStatuses) {
  if (status.startsWith('accepted')) {
    assert(!reachedOpenQueue, 'accepted components must form a completed prefix of the queue');
  } else {
    reachedOpenQueue = true;
  }
}
assert(alignment.includes('范围化自主验收授权'), 'alignment must preserve the user-authorized autonomous acceptance boundary');
assert(alignment.includes('| 28 | Upload | Attachments / Upload |'), 'Upload must compare both TDesign attachment surfaces');
assert(contributing.includes('任何组件修改前'), 'CONTRIBUTING must apply semantic contracts to every component');

const contractFiles = fs.readdirSync(contractsDir)
  .filter((name) => name.endsWith('.md') && !['README.md', 'CONTRACT_TEMPLATE.md'].includes(name))
  .sort();

assert(contractFiles.includes('DIALOG.md'), 'Dialog semantic contract must exist');

for (const file of contractFiles) {
  assert(/^[A-Z0-9-]+\.md$/.test(file), `component contract filename must be uppercase: ${file}`);
  const source = fs.readFileSync(path.join(contractsDir, file), 'utf8');
  assert(source.startsWith('# '), `${file} must start with an H1 title`);
  assert(source.includes('## 1. 组件定位'), `${file} must define component positioning`);
  assert(source.includes('明确禁止'), `${file} must define explicit prohibitions`);
  assert(source.includes('修改闭环'), `${file} must define its modification close-loop`);
  assert(source.includes('npm run feedback:list -- --component'), `${file} must link its component Ledger query`);
  assert(index.includes(`(./${file})`), `${file} must be listed in docs/components/README.md`);
}

console.log(`Component semantic contracts passed (${contractFiles.length} established, migration-on-touch enforced).`);
