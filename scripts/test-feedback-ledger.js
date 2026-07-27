const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { loadFeedbackRecords, renderFeedbackLedger, root, validateFeedbackRecord } = require('./feedback-utils');

const schema = JSON.parse(fs.readFileSync(path.join(root, 'feedback', 'schema.json'), 'utf8'));
const records = loadFeedbackRecords();
const errors = records.flatMap(validateFeedbackRecord);
const ids = records.map((record) => record.id);
const ledger = fs.readFileSync(path.join(root, 'docs', 'COMPONENT_FEEDBACK_LEDGER.md'), 'utf8');
const guide = fs.readFileSync(path.join(root, 'docs', 'COMPONENT_FEEDBACK.md'), 'utf8');
const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
const contributing = fs.readFileSync(path.join(root, 'CONTRIBUTING.md'), 'utf8');
const issueTemplate = fs.readFileSync(path.join(root, '.github', 'ISSUE_TEMPLATE', 'component-feedback.yml'), 'utf8');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

assert.strictEqual(schema.additionalProperties, false, 'Feedback schema rejects undeclared fields');
assert(schema.required.includes('acceptance'));
assert(schema.properties.status.enum.includes('needs-device'));
assert(records.length >= 3, 'Feedback Ledger starts with real audited records');
assert.deepStrictEqual(errors, [], errors.join('\n'));
assert.strictEqual(new Set(ids).size, ids.length, 'Feedback IDs must be unique');
assert.strictEqual(ledger, renderFeedbackLedger(records), 'generated Feedback Ledger must be current');

['PUI-FB-0001', 'PUI-FB-0002', 'PUI-FB-0003'].forEach((id) => assert(ids.includes(id), `${id} must remain recorded`));
assert(records.every((record) => record.evidence.length > 0));
assert(records.filter((record) => record.status === 'resolved').every((record) => record.verification.tests.length || record.verification.commands.length));
assert(records.filter((record) => record.acceptance === 'accepted').every((record) => record.evidence.some((item) => item.kind === 'user-report' && /用户.*(?:确认|验收|授权)/.test(item.note))), 'accepted battle records require explicit user confirmation or scoped autonomous acceptance authority');

assert(guide.includes('一条文件对应一个问题'));
assert(guide.includes('resolved` 只代表已有修复和验证'));
assert(agents.includes('Component Feedback Ledger（强制）'));
assert(agents.includes('npm run feedback:list -- --component <component-id>'));
assert(agents.includes('不得因 metadata done 或局部测试自行通过'));
assert(agents.includes('自主连续验收'));
assert(contributing.includes('npm run feedback:list -- --component <component-id>'));
assert(contributing.includes('acceptance: pending-user'));
assert(issueTemplate.includes('id: user_goal'));
assert(issueTemplate.includes('id: reproduction'));
assert(issueTemplate.includes('id: environment'));
assert(issueTemplate.includes('id: evidence'));
assert(changelog.includes('建立 Component Feedback Ledger'));
assert.strictEqual(packageJson.scripts['feedback:generate'], 'node scripts/generate-feedback-ledger.js');
assert.strictEqual(packageJson.scripts['feedback:list'], 'node scripts/query-feedback.js');
assert.strictEqual(packageJson.scripts['feedback:check'], 'node scripts/test-feedback-ledger.js');
assert(packageJson.scripts['site:build'].startsWith('npm run feedback:generate'));
assert(packageJson.scripts['site:build'].indexOf('npm run miniprogram:build') < packageJson.scripts['site:build'].indexOf('npm run catalog:generate'), 'site:build must refresh miniprogram_dist before catalog generation');
assert(packageJson.scripts.check.startsWith('node scripts/test-feedback-ledger.js'));

process.stdout.write(`Component Feedback Ledger contract passed for ${records.length} records.\n`);
