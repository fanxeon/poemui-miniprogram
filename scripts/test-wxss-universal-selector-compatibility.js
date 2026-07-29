const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { packageComponents } = require('../metadata/components');

require('./test-wxml-conditional-loop-compatibility');

const root = path.resolve(__dirname, '..');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'miniprogram_dist', 'miniprogram_npm'].includes(entry.name)) return [];
      return walk(target);
    }
    return entry.name.endsWith('.wxss') ? [target] : [];
  });
}

function selectors(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutComments.split('{').map((part) => part.slice(part.lastIndexOf('}') + 1));
}

const offenders = walk(root).flatMap((file) => selectors(fs.readFileSync(file, 'utf8'))
  .filter((selector) => selector.includes('*'))
  .map((selector) => `${path.relative(root, file)}: ${selector.trim().replace(/\s+/g, ' ')}`));

assert.deepStrictEqual(
  offenders,
  [],
  `微信 WXSS 编译器不支持通配选择器，发布源码不得包含 * 选择器：\n${offenders.join('\n')}`,
);

const componentRoots = new Set(packageComponents);
const componentStyles = walk(root).filter((file) => componentRoots.has(path.relative(root, file).split(path.sep)[0]));
const globalThemeImports = componentStyles
  .filter((file) => /@import\s+["'][^"']*common\/style\/theme\.wxss["']\s*;/.test(fs.readFileSync(file, 'utf8')))
  .map((file) => path.relative(root, file));

assert.deepStrictEqual(
  globalThemeImports,
  [],
  `组件 WXSS 不得导入包含 page 等全局选择器的 common/style/theme.wxss；主题入口只能由 app.wxss 导入：\n${globalThemeImports.join('\n')}`,
);

const activePageCompatibilityStyles = new Set([
  'combobox/combobox.wxss',
  'cell/cell.wxss',
  'cell/cell-group.wxss',
  'collapsible/collapsible.wxss',
]);
const componentSelectorOffenders = componentStyles
  .filter((file) => activePageCompatibilityStyles.has(path.relative(root, file)))
  .flatMap((file) => selectors(fs.readFileSync(file, 'utf8'))
  .flatMap((selector) => selector.split(','))
  .map((selector) => selector.trim())
  .filter((selector) => selector && !selector.startsWith('@'))
  .filter((selector) => /\[|#[a-zA-Z_-]|(^|[\s>+~])(?:[a-zA-Z][\w-]*)\b/.test(selector))
  .map((selector) => `${path.relative(root, file)}: ${selector.replace(/\s+/g, ' ')}`));

assert.deepStrictEqual(
  componentSelectorOffenders,
  [],
  `微信组件 WXSS 禁止标签、ID 和属性选择器，发布组件只能使用明确 class 规则：\n${componentSelectorOffenders.join('\n')}`,
);

const appWxss = fs.readFileSync(path.join(root, 'miniprogram/app.wxss'), 'utf8');
const exampleAppWxss = fs.readFileSync(path.join(root, '_example/miniprogram/app.wxss'), 'utf8');
const themeSource = fs.readFileSync(path.join(root, 'common/style/theme.wxss'), 'utf8');
assert(/^\s*page\s*,/m.test(themeSource), '全局主题源必须明确保留 page 默认 Token 选择器');
assert(appWxss.includes('@import "miniprogram_npm/poemui-miniprogram/theme/utilities.wxss";'), '实际小程序 app.wxss 必须从 npm 主题入口导入全局 Token');
assert(exampleAppWxss.includes('@import "miniprogram_npm/poemui-miniprogram/theme/utilities.wxss";'), '示例 app.wxss 必须从 npm 主题入口导入全局 Token');

console.log(`WXSS component-scope compatibility passed (${walk(root).length} source files, ${componentStyles.length} component styles)`);
