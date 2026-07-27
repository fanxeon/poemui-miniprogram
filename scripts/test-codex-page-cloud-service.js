var assert = require('assert');
var path = require('path');

var SERVICE_PATH = path.join(__dirname, '../miniprogram/common/services/codex-page.js');

function loadServiceWithCloud(cloud) {
  delete require.cache[require.resolve(SERVICE_PATH)];
  global.wx = { cloud: { Cloud: cloud } };
  return require(SERVICE_PATH);
}

function publishedPageDocument() {
  return {
    _id: 'pui-codepage-codex-v1',
    product: 'poemui',
    pageKey: 'codex',
    kind: 'page',
    status: 'published',
    schemaVersion: 1,
    content: {
      quickStart: {
        title: '快速开始',
        subtitle: '安装与引用',
        description: '从云端读取真实接入示例。',
        snippets: [
          { id: 'install', title: '安装依赖', code: 'npm i poemui-miniprogram -S --production' },
          { id: 'usage', title: '页面引用', code: '<pui-button>开始</pui-button>' }
        ]
      },
      skillSection: {
        title: '让你的 AI 懂得用它',
        subtitle: 'SKILL',
        description: '已发布 Skill 由云端目录提供。',
        emptyDescription: '暂无已发布的 Skill。'
      }
    }
  };
}

function publishedSkillDocument() {
  return {
    _id: 'pui-skill-example',
    product: 'poemui',
    pageKey: 'codex',
    kind: 'skill',
    status: 'published',
    skillId: 'poemui-ui',
    name: 'PoemUI 组件开发',
    version: 'v1.0.0',
    summary: '用于未来发布的真实 Skill。',
    icon: 'codex',
    capabilities: ['组件组合', 'Token 约束'],
    installation: { title: '安装 Skill', code: 'npx skills add poemui' },
    sortOrder: 10
  };
}

var normalized = loadServiceWithCloud(function Cloud() {}).normalizeDocuments([
  publishedSkillDocument(),
  publishedPageDocument(),
  { kind: 'skill', status: 'published', name: '', summary: '缺少名称的草稿不能进入页面' },
  { kind: 'skill', status: 'draft', skillId: 'draft-skill', name: '草稿 Skill', summary: '草稿不得进入页面' },
  { kind: 'page', content: { quickStart: { title: '缺少 snippets' }, skillSection: { title: '不完整页面' } } }
]);
assert.strictEqual(normalized.page.id, 'pui-codepage-codex-v1', '必须识别已发布 page 文档');
assert.strictEqual(normalized.page.quickStart.snippets.length, 2, '快速开始代码必须由 page 文档提供');
assert.strictEqual(normalized.skills.length, 1, '不完整或非 published Skill 不能进入页面');
assert.deepStrictEqual(normalized.skills[0].capabilities, ['组件组合', 'Token 约束'], 'Skill 能力字段必须保留');
assert.strictEqual(normalized.skills[0].installCode, 'npx skills add poemui', 'Skill 安装代码必须由云端字段提供');

async function run() {
  var cloudOptions;
  var query;
  function Cloud(options) {
    cloudOptions = options;
    this.init = function init() { return Promise.resolve(); };
    this.database = function database() {
      return {
        collection: function collection(name) {
          assert.strictEqual(name, 'pui-codepage', '必须只读取 pui-codepage 集合');
          return {
            where: function where(condition) {
              query = condition;
              return this;
            },
            limit: function limit(value) {
              assert.strictEqual(value, 100, 'Code 页读取必须有明确上限');
              return this;
            },
            get: function get() {
              return Promise.resolve({ data: [publishedPageDocument(), publishedSkillDocument()] });
            }
          };
        }
      };
    };
  }
  var service = loadServiceWithCloud(Cloud);
  var result = await service.load();
  assert.deepStrictEqual(cloudOptions, {
    resourceAppid: 'wxa1b9a4d6549c6cd1',
    resourceEnv: 'poemcoder-1gkbkid139b08f45'
  }, 'Code 页必须连接已授权共享云环境');
  assert.deepStrictEqual(query, {
    product: 'poemui',
    pageKey: 'codex',
    status: 'published'
  }, '客户端只能读取本页已发布数据');
  assert.strictEqual(result.source, 'cloud', '云端结果必须明确标记 source=cloud');
  assert.strictEqual(result.page.quickStart.snippets[0].code, 'npm i poemui-miniprogram -S --production', '页面代码必须来自云端文档');
  assert.strictEqual(result.skills[0].id, 'poemui-ui', 'Skill 必须使用稳定 skillId');

  function FailedCloud() {
    this.init = function init() { return Promise.reject(new Error('shared-cloud-unavailable')); };
  }
  var failedService = loadServiceWithCloud(FailedCloud);
  await assert.rejects(function () { return failedService.load(); }, /shared-cloud-unavailable/, '云端不可用必须向页面暴露失败，而非回退包内内容');
}

run().then(function complete() {
  delete global.wx;
  console.log('codex page cloud service contract tests passed');
}).catch(function fail(error) {
  delete global.wx;
  console.error(error);
  process.exitCode = 1;
});
