const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const metadata = require(path.join(root, 'metadata/components'));

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const allNavigationItems = metadata.groups.flatMap((group) => group.items);
const packageComponentIds = [...metadata.packageComponents].sort();
const retiredComponentId = ['d', 'rawer'].join('');
const retiredComponentName = ['D', 'rawer'].join('');

function componentDirectories(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((entry) => {
      // 个人知识库等隐藏工作目录不属于可发布组件树；失效软链接也不能阻断发布目录审计。
      if (entry.startsWith('.')) return false;
      const location = path.join(directory, entry);
      return fs.statSync(location).isDirectory()
        && ['js', 'json', 'wxml', 'wxss'].every((extension) => fs.existsSync(path.join(location, `${entry}.${extension}`)));
    })
    .sort();
}

function assertComponentTree(directory, label) {
  assert.deepStrictEqual(componentDirectories(directory), packageComponentIds, `${label} must contain exactly the current published component set`);
}

assert.strictEqual(metadata.packageComponents.length, 78, 'the 0.1.4 package worktree must expose exactly 78 components');
assert.strictEqual(metadata.releaseComponentIds.size, 78, 'the release set must match the 78 installable components');
assert(!metadata.packageComponents.includes('separator'), 'the removed Separator component must not remain installable');
assert(!metadata.packageComponents.includes('pagination'), 'the removed Pagination component must not remain installable');
assert(!metadata.packageComponents.includes('tooltip'), 'the removed Tooltip component must not remain installable');
assertComponentTree(root, 'source root');

assert.strictEqual(allNavigationItems.length, 84, 'catalog pruning must leave 84 canonical public routes');
assert.strictEqual(new Set(allNavigationItems.map((item) => item.id)).size, allNavigationItems.length, 'public route ids must stay unique');

const expectedPublicEntries = new Map([
  ['cell', 'Cell 单元格'],
  ['shadcn-badge', 'Badge'],
  ['shadcn-dialog', 'Dialog'],
  ['dynamic-message', 'DynamicMessage 灵动通知'],
  ['area-chart', 'AreaChart 面积图'],
  ['bar-chart', 'BarChart 条形图'],
  ['donut-chart', 'DonutChart 圆环图'],
  ['radar-chart', 'RadarChart 雷达图'],
  ['sortable-list', 'SortableList 排序列表'],
  ['tour', 'Tour 功能引导'],
  ['waffle', 'Waffle 组件点阵图'],
  ['top-loading', 'TopLoading 顶部加载'],
]);
for (const [id, name] of expectedPublicEntries) {
  const matches = allNavigationItems.filter((item) => item.id === id);
  assert.strictEqual(matches.length, 1, `${id} must have exactly one public catalog entry`);
  assert.strictEqual(matches[0].name, name, `${id} must use its canonical public name`);
}

const preview = read('preview/app.js');
const previewStyles = read('preview/styles.css');
const metadataSource = read('metadata/components.js');
const exampleJson = read('_example/miniprogram/pages/components/index.json');
const exampleJs = read('_example/miniprogram/pages/components/index.js');
const exampleWxml = read('_example/miniprogram/pages/components/index.wxml');
const exampleWxss = read('_example/miniprogram/pages/components/index.wxss');
const api = read('docs/COMPONENT_API.md');
const compatibility = read('docs/H5_PREVIEW_COMPATIBILITY.md');
const dialogContract = read('docs/components/DIALOG.md');
const readme = read('README.md');
const prepareExample = read('scripts/prepare-example.js');

for (const [relativePath, forbiddenText] of [
  ['metadata/components.js', "id: 'separator'"],
  ['index.js', "'separator'"],
  ['preview/app.js', "case 'separator'"],
  ['README.md', '`pui-separator`'],
  ['docs/COMPONENT_API.md', '## Separator'],
  ['docs/H5_PREVIEW_COMPATIBILITY.md', 'Separator 的 H5 镜像'],
  ['metadata/components.js', "id: 'pagination'"],
  ['index.js', "'pagination'"],
  ['preview/app.js', "case 'pagination'"],
  ['docs/COMPONENT_API.md', '## Pagination'],
  ['docs/H5_PREVIEW_COMPATIBILITY.md', 'Pagination 的 H5 镜像'],
  ['metadata/components.js', "id: 'tooltip'"],
  ['index.js', "'tooltip'"],
  ['preview/app.js', "case 'tooltip'"],
  ['docs/COMPONENT_API.md', '## Tooltip'],
  ['docs/H5_PREVIEW_COMPATIBILITY.md', 'Tooltip 的 H5 镜像'],
  ['metadata/components.js', `id: '${retiredComponentId}'`],
  ['index.js', `'${retiredComponentId}'`],
  ['preview/app.js', `case '${retiredComponentId}'`],
  ['docs/COMPONENT_API.md', `## ${retiredComponentName}`],
  ['docs/H5_PREVIEW_COMPATIBILITY.md', `${retiredComponentName} 的 H5 镜像`],
]) {
  assert(!read(relativePath).includes(forbiddenText), `${relativePath} must not retain the removed Separator component contract`);
}
assert(!fs.existsSync(path.join(root, 'separator')), 'the removed Separator source directory must not remain');
assert(!fs.existsSync(path.join(root, 'scripts/test-separator.js')), 'the removed Separator contract test must not remain');
assert(!fs.existsSync(path.join(root, 'pagination')), 'the removed Pagination source directory must not remain');
assert(!fs.existsSync(path.join(root, 'scripts/test-pagination.js')), 'the removed Pagination contract test must not remain');
assert(!fs.existsSync(path.join(root, 'tooltip')), 'the removed Tooltip source directory must not remain');
assert(!fs.existsSync(path.join(root, 'scripts/test-tooltip.js')), 'the removed Tooltip contract test must not remain');
assert(!fs.existsSync(path.join(root, retiredComponentId)), 'the retired source directory must not remain');
assert(!fs.existsSync(path.join(root, 'scripts', `test-${retiredComponentId}.js`)), 'the retired contract test must not remain');

assert(preview.includes('const groups = componentData.groups;'), 'H5 navigation must consume the generated catalog instead of a second component list');
assert(!preview.includes('const legacyGroups = ['), 'H5 navigation must not retain a dead catalog snapshot');
assert(!metadataSource.includes('legacyGroups'), 'metadata must not name the current catalog source as a legacy directory');
assert(!metadataSource.includes('legacyCatalogItem'), 'metadata must not retain a legacy catalog mapping');
assert(previewStyles.includes('.component-group__section-title'), 'sidebar section heading styles must stay tokenized');
assert(exampleJson.includes('poemui-miniprogram'), 'the real mini-program example must resolve its components through the npm package');
assert(exampleJs.includes('表单组件'), 'the real mini-program example must use the current form terminology');
assert(exampleWxml.includes('pui-form'), 'the real mini-program example must retain the real form composition');
for (const [label, source] of [
  ['JSON', exampleJson],
  ['JavaScript', exampleJs],
  ['WXML', exampleWxml],
  ['WXSS', exampleWxss],
]) {
  assert(!source.includes('pui-tooltip'), `the real mini-program example ${label} must not retain the retired Tooltip component`);
  assert(!source.includes('poemui-miniprogram/tooltip'), `the real mini-program example ${label} must not resolve the retired Tooltip package path`);
  assert(!source.includes('pui-button-group'), `the real mini-program example ${label} must not retain the retired ButtonGroup component`);
  assert(!source.includes('poemui-miniprogram/button-group'), `the real mini-program example ${label} must not resolve the retired ButtonGroup package path`);
}
assert(exampleWxml.includes('class="example-action-group'), 'the real mini-program example must compose action rows from real PUI Buttons');
assert(exampleWxss.includes('.example-action-group'), 'the real mini-program example action row must retain a tokenized wrapping layout');

assert(api.includes('## Cell\n'), 'API must expose Cell as the canonical heading');
assert(api.includes('## Dialog\n'), 'API must expose Dialog as the canonical heading');
assert(!api.includes('## Tooltip\n'), 'API must not retain the retired Tooltip heading');
assert(dialogContract.includes('## 1. 组件定位与公开边界'), 'Dialog contract must retain its current public boundary section');

const compatibilityRules = [...compatibility.split('## 最终预览站能力')[0].matchAll(/^(\d+)\./gm)].map((match) => Number(match[1]));
assert(!compatibility.includes('旧队列入口'), 'H5 compatibility must not retain the removed feedback queue contract');
assert.deepStrictEqual(compatibilityRules, [...new Set(compatibilityRules)].sort((left, right) => left - right), 'H5 compatibility rule numbers must stay unique and ordered after retired components are removed');
assert(readme.includes('公开 Registry `poemui-miniprogram@0.1.4`') && readme.includes('`78` 个'), 'README package count must match the 78-component 0.1.4 release');
assert(prepareExample.includes("'miniprogram', 'miniprogram_npm', packageJson.name"), 'example install must resolve the exact generated WeChat package root');
assert(prepareExample.includes('fs.rmSync(wechatInstalledPackage, { recursive: true, force: true });'), 'example install must prune stale WeChat package directories before build-npm');

if (fs.existsSync(path.join(root, 'miniprogram_dist'))) assertComponentTree(path.join(root, 'miniprogram_dist'), 'miniprogram_dist');
assert(!fs.existsSync(path.join(root, 'miniprogram_dist/separator')), 'miniprogram_dist must not retain the removed Separator directory');
assert(!fs.existsSync(path.join(root, 'miniprogram_dist/tooltip')), 'miniprogram_dist must not retain the removed Tooltip directory');
assert(!fs.existsSync(path.join(root, 'miniprogram_dist', retiredComponentId)), 'miniprogram_dist must not retain the retired directory');

const wechatPackageRoot = path.join(root, '_example/miniprogram/miniprogram_npm/poemui-miniprogram');
if (fs.existsSync(wechatPackageRoot)) assertComponentTree(wechatPackageRoot, 'WeChat miniprogram_npm');

console.log('Component catalog pruning contract tests passed for 78 components and 84 canonical public routes.');
