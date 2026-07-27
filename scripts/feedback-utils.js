const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const recordsDir = path.join(root, 'feedback', 'records');

const allowed = {
  scope: new Set(['component', 'global']),
  type: new Set(['bug', 'capability-gap', 'api-contract', 'preview-parity', 'visual-layout', 'accessibility', 'compatibility', 'ai-usability', 'design-decision']),
  severity: new Set(['critical', 'high', 'medium', 'low']),
  status: new Set(['open', 'investigating', 'planned', 'resolved', 'wont-fix', 'needs-device']),
  acceptance: new Set(['pending-user', 'accepted', 'not-required']),
  source: new Set(['battle', 'user-report', 'agent-audit', 'real-device', 'regression', 'design-review']),
  evidenceKind: new Set(['file', 'browser', 'test', 'build', 'user-report', 'real-device']),
};

const requiredTopLevel = [
  '$schema',
  'id',
  'title',
  'scope',
  'components',
  'type',
  'severity',
  'status',
  'acceptance',
  'source',
  'reportedAt',
  'updatedAt',
  'userGoal',
  'environment',
  'reproduction',
  'expected',
  'actual',
  'evidence',
  'rootCause',
  'decision',
  'impact',
  'verification',
  'ai',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadFeedbackRecords() {
  if (!fs.existsSync(recordsDir)) return [];
  return fs.readdirSync(recordsDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => ({ ...readJson(path.join(recordsDir, name)), _file: `feedback/records/${name}` }));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function validateStringArray(value, field, errors, { allowEmpty = false, unique = true } = {}) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    errors.push(`${field} 必须是${allowEmpty ? '' : '非空'}数组`);
    return;
  }
  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) errors.push(`${field}[${index}] 必须是非空字符串`);
  });
  if (unique && new Set(value).size !== value.length) errors.push(`${field} 不能包含重复值`);
}

function validateExactKeys(value, field, keys, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${field} 必须是对象`);
    return false;
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  const missing = expected.filter((key) => !actual.includes(key));
  const extra = actual.filter((key) => !expected.includes(key));
  if (missing.length) errors.push(`${field} 缺少字段：${missing.join(', ')}`);
  if (extra.length) errors.push(`${field} 包含未声明字段：${extra.join(', ')}`);
  return missing.length === 0;
}

function localRefExists(ref) {
  const relative = ref.split('#')[0];
  if (!relative || /^https?:\/\//.test(relative)) return true;
  return fs.existsSync(path.join(root, relative));
}

function validateFeedbackRecord(record) {
  const errors = [];
  const file = record._file || '(unknown record)';
  const cleanKeys = Object.keys(record).filter((key) => key !== '_file');
  const missing = requiredTopLevel.filter((key) => !cleanKeys.includes(key));
  const extra = cleanKeys.filter((key) => !requiredTopLevel.includes(key));
  if (missing.length) errors.push(`缺少字段：${missing.join(', ')}`);
  if (extra.length) errors.push(`包含未声明字段：${extra.join(', ')}`);

  if (record.$schema !== '../schema.json') errors.push('$schema 必须是 ../schema.json');
  if (!/^PUI-FB-\d{4}$/.test(record.id || '')) errors.push('id 必须符合 PUI-FB-0001');
  if (record.id) {
    const number = record.id.slice(-4).toLowerCase();
    if (!path.basename(file).startsWith(`pui-fb-${number}-`)) errors.push('文件名必须以小写 Ledger ID 开头');
  }
  ['title', 'userGoal', 'expected', 'actual', 'rootCause'].forEach((field) => {
    if (!isNonEmptyString(record[field])) errors.push(`${field} 必须是非空字符串`);
  });
  Object.entries({ scope: record.scope, type: record.type, severity: record.severity, status: record.status, acceptance: record.acceptance, source: record.source }).forEach(([field, value]) => {
    if (!allowed[field].has(value)) errors.push(`${field} 值无效：${value}`);
  });
  if (!isDate(record.reportedAt)) errors.push('reportedAt 必须是 YYYY-MM-DD');
  if (!isDate(record.updatedAt)) errors.push('updatedAt 必须是 YYYY-MM-DD');
  if (isDate(record.reportedAt) && isDate(record.updatedAt) && record.updatedAt < record.reportedAt) errors.push('updatedAt 不能早于 reportedAt');
  validateStringArray(record.components, 'components', errors);
  validateStringArray(record.reproduction, 'reproduction', errors, { unique: false });

  if (validateExactKeys(record.environment, 'environment', ['surfaces', 'platforms', 'viewports', 'themes'], errors)) {
    ['surfaces', 'platforms', 'viewports', 'themes'].forEach((field) => validateStringArray(record.environment[field], `environment.${field}`, errors));
  }

  if (!Array.isArray(record.evidence) || record.evidence.length === 0) {
    errors.push('evidence 必须是非空数组');
  } else {
    record.evidence.forEach((item, index) => {
      if (!validateExactKeys(item, `evidence[${index}]`, ['kind', 'ref', 'note'], errors)) return;
      if (!allowed.evidenceKind.has(item.kind)) errors.push(`evidence[${index}].kind 值无效：${item.kind}`);
      if (!isNonEmptyString(item.ref)) errors.push(`evidence[${index}].ref 必须是非空字符串`);
      if (!isNonEmptyString(item.note)) errors.push(`evidence[${index}].note 必须是非空字符串`);
      if (['file', 'test'].includes(item.kind) && isNonEmptyString(item.ref) && !localRefExists(item.ref)) errors.push(`evidence[${index}].ref 不存在：${item.ref}`);
    });
  }

  if (validateExactKeys(record.decision, 'decision', ['outcome', 'rationale', 'alternativesRejected'], errors)) {
    ['outcome', 'rationale'].forEach((field) => {
      if (!isNonEmptyString(record.decision[field])) errors.push(`decision.${field} 必须是非空字符串`);
    });
    validateStringArray(record.decision.alternativesRejected, 'decision.alternativesRejected', errors, { allowEmpty: true, unique: false });
  }

  if (validateExactKeys(record.impact, 'impact', ['files', 'dependencies'], errors)) {
    validateStringArray(record.impact.files, 'impact.files', errors);
    validateStringArray(record.impact.dependencies, 'impact.dependencies', errors, { allowEmpty: true });
    if (Array.isArray(record.impact.files)) record.impact.files.forEach((ref) => {
      if (isNonEmptyString(ref) && !localRefExists(ref)) errors.push(`impact.files 不存在：${ref}`);
    });
  }

  if (validateExactKeys(record.verification, 'verification', ['tests', 'commands', 'browser', 'deviceRisks'], errors)) {
    validateStringArray(record.verification.tests, 'verification.tests', errors, { allowEmpty: true });
    validateStringArray(record.verification.commands, 'verification.commands', errors, { allowEmpty: true });
    validateStringArray(record.verification.browser, 'verification.browser', errors, { allowEmpty: true, unique: false });
    validateStringArray(record.verification.deviceRisks, 'verification.deviceRisks', errors, { allowEmpty: true, unique: false });
    if (Array.isArray(record.verification.tests)) record.verification.tests.forEach((ref) => {
      if (isNonEmptyString(ref) && !localRefExists(ref)) errors.push(`verification.tests 不存在：${ref}`);
    });
    if (record.status === 'resolved' && record.verification.tests.length === 0 && record.verification.commands.length === 0) {
      errors.push('resolved 记录必须至少关联一项测试或验证命令');
    }
  }

  if (validateExactKeys(record.ai, 'ai', ['summary', 'rules', 'tags'], errors)) {
    if (!isNonEmptyString(record.ai.summary)) errors.push('ai.summary 必须是非空字符串');
    validateStringArray(record.ai.rules, 'ai.rules', errors, { unique: false });
    validateStringArray(record.ai.tags, 'ai.tags', errors);
    if (Array.isArray(record.ai.rules)) record.ai.rules.forEach((rule, index) => {
      if (typeof rule === 'string' && rule.length > 180) errors.push(`ai.rules[${index}] 应保持在 180 字以内`);
    });
  }

  return errors.map((message) => `${file}: ${message}`);
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function renderFeedbackLedger(records) {
  const ordered = [...records].sort((a, b) => a.id.localeCompare(b.id));
  const latest = ordered.reduce((value, record) => (record.updatedAt > value ? record.updatedAt : value), '');
  const count = (field, value) => ordered.filter((record) => record[field] === value).length;
  const lines = [
    '# PoemUI Component Feedback Ledger',
    '',
    '> 本文件由 `feedback/records/*.json` 自动生成，请勿手工编辑。工作流见 `docs/COMPONENT_FEEDBACK.md`。',
    '',
    `当前 ${ordered.length} 条记录，数据更新至 ${latest || '-'}：open ${count('status', 'open')}、investigating ${count('status', 'investigating')}、planned ${count('status', 'planned')}、needs-device ${count('status', 'needs-device')}、resolved ${count('status', 'resolved')}；pending-user ${count('acceptance', 'pending-user')}、accepted ${count('acceptance', 'accepted')}。`,
    '',
    '| ID | 范围 | 类型 | 严重度 | 状态 | 验收 | 问题 |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...ordered.map((record) => `| ${record.id} | ${escapeCell(record.components.join(', '))} | ${record.type} | ${record.severity} | ${record.status} | ${record.acceptance} | ${escapeCell(record.title)} |`),
    '',
  ];

  ordered.forEach((record) => {
    lines.push(
      `## ${record.id} · ${record.title}`,
      '',
      `- 原始记录：\`${record._file}\``,
      `- 范围：\`${record.scope}\` / ${record.components.map((item) => `\`${item}\``).join('、')}`,
      `- 状态：\`${record.status}\`，用户验收：\`${record.acceptance}\`，更新：${record.updatedAt}`,
      `- 用户目标：${record.userGoal}`,
      `- 实际问题：${record.actual}`,
      `- 决策：${record.decision.outcome}`,
      `- 理由：${record.decision.rationale}`,
      '',
      'AI 必须遵守：',
      '',
      ...record.ai.rules.map((rule) => `- ${rule}`),
      '',
      '验证与遗留风险：',
      '',
      ...record.verification.commands.map((command) => `- 验证：\`${command}\``),
      ...(record.verification.deviceRisks.length ? record.verification.deviceRisks.map((risk) => `- 真机/兼容风险：${risk}`) : ['- 真机/兼容风险：无已知遗留项。']),
      '',
    );
  });

  return `${lines.join('\n')}\n`;
}

module.exports = {
  allowed,
  loadFeedbackRecords,
  renderFeedbackLedger,
  root,
  validateFeedbackRecord,
};

