const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');

function functionBlock(name) {
  const start = preview.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = preview.indexOf('\nfunction ', start + 10);
  return preview.slice(start, next >= 0 ? next : preview.length);
}

const cases = [
  { id: 'sheet', fn: 'sheetShowcase', prefix: 'pui-sheet-preview', error: '内容加载失败', empty: '暂无内容' },
];

cases.forEach((entry) => {
  const wxml = fs.readFileSync(path.join(root, entry.id, `${entry.id}.wxml`), 'utf8');
  const block = functionBlock(entry.fn);
  const errorLine = block.split('\n').find((line) => line.includes('const error =')) || '';
  const emptyLine = block.split('\n').find((line) => line.includes('const empty =')) || '';
  assert(wxml.includes('<pui-empty'), `${entry.id} native state must compose PUI Empty`);
  assert(wxml.includes('<pui-loading'), `${entry.id} native state must compose PUI Loading`);
  assert(errorLine.includes('emptySample({ embedded: true'), `${entry.id} H5 error must call shared embedded Empty`);
  assert(emptyLine.includes('emptySample({ embedded: true'), `${entry.id} H5 empty must call shared embedded Empty`);
  assert(errorLine.includes(entry.error), `${entry.id} H5 error fallback must match native copy`);
  assert(emptyLine.includes(entry.empty), `${entry.id} H5 empty fallback must match native copy`);
  assert(!errorLine.includes('iconComponent('), `${entry.id} H5 error must not redraw a private Icon`);
  assert(!emptyLine.includes('iconComponent('), `${entry.id} H5 empty must not redraw a private Icon`);
  assert(errorLine.includes('buttonSample({'), `${entry.id} sibling retry Button must match native WXML structure`);
  assert(!errorLine.includes('showAction:') && !errorLine.includes('actionMarkup:'), `${entry.id} must not put retry back into Empty`);
  if (entry.loading) assert(block.includes(`text: props.loadingText || '${entry.loading}'`), `${entry.id} Loading copy must match native WXML`);
  assert(styles.includes(`.${entry.prefix}__state > .pui-empty-sample`), `${entry.id} embedded Empty must fill its owning state region`);
});

assert(styles.includes('.pui-empty-sample.is-embedded'));
assert(/\.pui-empty-sample\.is-embedded\s*\{[^}]*background:\s*transparent;[^}]*border:\s*0;[^}]*border-radius:\s*0;[^}]*box-shadow:\s*none;[^}]*backdrop-filter:\s*none;/s.test(styles), 'embedded Empty must never create a second Surface');

console.log('Overlay state composition contract tests passed.');
