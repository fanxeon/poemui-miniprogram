const assert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const notice = read('docs/PUBLIC_BETA_NOTICE.md');
const readme = read('README.md');
const previewHtml = read('preview/index.html');
const previewApp = read('preview/app.js');
const previewCss = read('preview/styles.css');
const skill = read('skills/poemui-miniprogram/SKILL.md');
const packageJson = JSON.parse(read('package.json'));

assert(previewHtml.includes('href="#/guide">快速开始</a>'), '官网一级入口必须显示快速开始');
assert(previewApp.includes('公共 npm 与 GitHub 已发布'), '快速开始必须展示真实公共发布状态');
assert(previewApp.includes(`npm i poemui-miniprogram@${packageJson.version} -S --production`), '快速开始必须提供当前固定版本 npm 安装');
assert(previewApp.includes('https://www.npmjs.com/package/poemui-miniprogram'), '快速开始必须完整展示公共 npm 地址');
assert(previewApp.includes('github.com/fanxeon/poemui-miniprogram'), '快速开始必须指向公开 GitHub 真相源');
assert(previewApp.includes("demoAction: 'copy-guide-code'") && previewApp.includes('[data-demo-action="copy-guide-code"]'), '可用页面代码必须使用共享 PUI 复制入口和真实剪贴板结果');
assert(previewApp.includes("if (type === 'copy-guide-code') return;"), '快速开始复制按钮不得被通用预览分发重绘掉反馈状态');
assert(previewApp.includes("detail.id === 'getting-started' ? '' : propWorkspaceMarkup(detail)"), '快速开始不得暴露 done、内部路径或文档调试面板');
assert(!previewApp.includes('<div class="pui-guide__step"><span>1</span><div><strong>安装</strong>'), '旧安装三步壳必须删除');
assert(previewCss.includes('.pui-guide__status-grid') && previewCss.includes('@media (max-width: 700px)'), '快速开始必须有桌面和窄屏布局合同');
assert(notice.includes('当前随 `poemui-miniprogram` 根包或公开仓库以 MIT 许可证交付的代码仍遵循 MIT'), 'Beta 公告必须锁定 MIT Core 边界');
assert(notice.includes('当前没有已发布的 Pro 代码、支付入口或商业授权合同'), '不得伪造 Pro 发布或购买能力');
assert(readme.includes(`当前公开版本为 \`poemui-miniprogram@${packageJson.version}\``), 'README 必须显式声明公共发布版本');
assert(skill.includes('name: poemui-miniprogram') && skill.includes('未验证'), 'Skill 必须包含触发元数据和真机未验证边界');
assert(packageJson.files.includes('skills/poemui-miniprogram'), 'npm 包必须随组件版本交付完整 PoemUI Skill');
for (const file of ['inspect-project.mjs', 'verify-install.mjs']) {
  assert(fs.existsSync(path.join(root, 'skills/poemui-miniprogram/scripts', file)), `Skill 缺少 ${file}`);
}
for (const file of ['installation.md', 'component-selection.md', 'composition-rules.md', 'styling-and-theme.md', 'platform-boundaries.md', 'examples.md', 'library-workflow.md', 'ui-governance.md', 'quality-gates.md', 'validation-matrix.md']) {
  assert(fs.existsSync(path.join(root, 'skills/poemui-miniprogram/references', file)), `Skill 缺少 ${file}`);
}
childProcess.execFileSync(process.execPath, [
  path.join(root, 'skills/poemui-miniprogram/scripts/check-skill.mjs')
], { stdio: 'pipe' });
assert.strictEqual(packageJson.homepage, 'https://poemcoder.com/poem-ui', 'npm homepage 必须指向正式产品落地页');
assert.strictEqual(packageJson.repository?.url, 'git+https://github.com/fanxeon/poemui-miniprogram.git', 'npm repository 必须指向公开 GitHub');
assert.strictEqual(packageJson.bugs?.url, 'https://github.com/fanxeon/poemui-miniprogram/issues', 'npm bugs 必须指向公开 Issue');
assert.strictEqual(packageJson.publishConfig?.access, 'public', 'npm 发布必须保持 public');

console.log('PoemUI restricted Beta, quick start, and AI Skill contract passed.');
