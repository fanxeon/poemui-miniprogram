'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

var packageJson = JSON.parse(read('package.json'));
var announcements = require(path.join(ROOT, 'miniprogram/common/services/update-announcements')).list();
var generatedContext = { window: {} };
vm.runInNewContext(read('preview/release-notes-data.js'), generatedContext, {
  filename: 'preview/release-notes-data.js'
});
var generated = JSON.parse(JSON.stringify(generatedContext.window.POEMUI_RELEASE_NOTES));
var previewIndex = read('preview/index.html');
var previewApp = read('preview/app.js');
var previewCss = read('preview/styles.css');
var cloudReadback = JSON.parse(read('docs/evidence/cloud/pui-updatelog-v0.1.4-readback.json'));

assert.strictEqual(generated.version, packageJson.version, 'H5 公告数据版本必须跟随 package.json');
assert.deepStrictEqual(generated.announcements, announcements, 'H5 公告必须由小程序公告真相源生成，禁止复制第二份文案');
assert.strictEqual(generated.announcements[0].version, 'v0.1.4', 'H5 公告首条必须是 0.1.4');
assert.strictEqual(generated.announcements[0].status, 'published', '云端可见的 0.1.4 公告必须保持 published 查询语义');
assert.ok(previewIndex.includes('id="releaseNotesTriggerMount"'), 'H5 顶栏必须保留更新公告入口 Mount');
assert.ok(previewIndex.includes('release-notes-data.js?v=0.1.4-20260730-002'), 'H5 必须在 app.js 前加载生成型公告数据');
assert.ok(previewApp.includes("demoAction: 'release-notes-open'"), '版本入口必须由共享 PUI Button helper 渲染');
assert.ok(previewApp.includes("if (id === 'release-notes') return '#/updates';"), '更新公告必须拥有稳定 H5 路由');
assert.ok(previewApp.includes("case 'release-notes':") && previewApp.includes('return releaseNotesPage();'), 'H5 路由必须渲染真实更新公告页面');
assert.ok(previewApp.includes("'release-notes': legacyDefaultDetails['release-notes']"), '更新公告必须进入当前详情真相源，不能回退通用组件摘要');
assert.ok(!previewIndex.includes('releaseNotesMount'), 'H5 更新公告是独立页面，不得退回 Popup Mount');
assert.ok(previewCss.includes('.release-notes-list') && previewCss.includes('.release-note__highlight'), 'H5 公告页必须具有版本与组件级改动排版');
assert.ok(previewCss.includes('.app-shell[data-frost="on"] .release-notes-list'), '公告 Surface 必须跟随全局毛玻璃外观');
assert.ok(previewCss.includes('.app-shell[data-spacing="equal"] .release-note'), '公告 Surface 必须跟随等距外观');

assert.strictEqual(cloudReadback.preflightVersionCount, 0, '0.1.4 云公告写入前必须完成版本查重');
assert.strictEqual(cloudReadback.queryCount, 1, '0.1.4 云公告写后必须唯一命中');
assert.strictEqual(cloudReadback.document._id, 'pui-v0-1-4-20260730', '云公告必须使用稳定 ID');
assert.strictEqual(cloudReadback.document.version, generated.announcements[0].version, '云公告版本必须与双端页面一致');
assert.strictEqual(cloudReadback.document.title, generated.announcements[0].title, '云公告标题必须与双端页面一致');
assert.deepStrictEqual(cloudReadback.document.highlights, generated.announcements[0].highlights, '云公告组件级改动必须与双端页面一致');
assert.strictEqual(cloudReadback.categoryTotal, cloudReadback.document.componentCount, '云公告九类合计必须等于组件总数');
assert.ok(packageJson.scripts['site:build'].endsWith('npm run release-notes:generate'), '站点构建必须在目录生成后刷新公告数据');

console.log('release notes page and cloud contract tests passed');
