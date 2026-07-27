const fs = require('fs');
const path = require('path');
const { loadFeedbackRecords, renderFeedbackLedger, root, validateFeedbackRecord } = require('./feedback-utils');

const records = loadFeedbackRecords();
const errors = records.flatMap(validateFeedbackRecord);
if (errors.length) {
  throw new Error(`Feedback Ledger 数据无效：\n${errors.join('\n')}`);
}

const output = path.join(root, 'docs', 'COMPONENT_FEEDBACK_LEDGER.md');
fs.writeFileSync(output, renderFeedbackLedger(records));
process.stdout.write(`Generated Component Feedback Ledger with ${records.length} records.\n`);

