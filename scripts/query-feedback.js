const { allowed, loadFeedbackRecords } = require('./feedback-utils');

const args = process.argv.slice(2);
const filters = {};
let json = false;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--json') {
    json = true;
    continue;
  }
  if (!['--id', '--component', '--scope', '--status', '--type', '--tag'].includes(arg)) {
    throw new Error(`未知参数：${arg}`);
  }
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${arg} 缺少值`);
  filters[arg.slice(2)] = value;
  index += 1;
}

if (filters.scope && !allowed.scope.has(filters.scope)) throw new Error(`无效 scope：${filters.scope}`);
if (filters.status && !allowed.status.has(filters.status)) throw new Error(`无效 status：${filters.status}`);
if (filters.type && !allowed.type.has(filters.type)) throw new Error(`无效 type：${filters.type}`);

const records = loadFeedbackRecords().filter((record) => {
  if (filters.id && record.id !== filters.id) return false;
  if (filters.component && !record.components.includes(filters.component)) return false;
  if (filters.scope && record.scope !== filters.scope) return false;
  if (filters.status && record.status !== filters.status) return false;
  if (filters.type && record.type !== filters.type) return false;
  if (filters.tag && !record.ai.tags.includes(filters.tag)) return false;
  return true;
});

if (json) {
  process.stdout.write(`${JSON.stringify(records, null, 2)}\n`);
} else if (records.length === 0) {
  process.stdout.write('没有匹配的 Feedback Ledger 记录。\n');
} else {
  records.forEach((record) => {
    process.stdout.write(`${record.id} · ${record.title}\n`);
    process.stdout.write(`  文件: ${record._file}\n`);
    process.stdout.write(`  范围: ${record.components.join(', ')} | ${record.type} | ${record.severity} | ${record.status} | ${record.acceptance}\n`);
    process.stdout.write(`  用户目标: ${record.userGoal}\n`);
    process.stdout.write(`  决策: ${record.decision.outcome}\n`);
    record.ai.rules.forEach((rule) => process.stdout.write(`  AI规则: ${rule}\n`));
    process.stdout.write('\n');
  });
}

