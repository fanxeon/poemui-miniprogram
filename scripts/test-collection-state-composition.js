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
  { id: 'combobox', fn: 'comboboxH5PanelMarkup', prefix: 'pui-combobox-preview', error: '选项加载失败', empty: '暂无匹配选项', action: 'sibling', custom: 'is-custom-empty' },
  { id: 'list', fn: 'listShowcase', prefix: 'pui-list-preview', error: '加载失败，点击重试', empty: '暂无列表数据', action: 'footer', custom: 'pui-list-preview__empty-slot' },
  { id: 'navigation-menu', fn: 'navigationMenuShowcase', prefix: 'pui-navigation-menu-preview', error: '导航加载失败', empty: '暂无导航内容', action: 'sibling', custom: 'empty slot · 消费者组合' },
  { id: 'virtual-list', fn: 'virtualListContentMarkup', prefix: 'virtual-list-preview', error: '列表加载失败', empty: '暂无数据', action: 'sibling', custom: 'is-custom-empty' },
];

cases.forEach((entry) => {
  const wxml = fs.readFileSync(path.join(root, entry.id, `${entry.id}.wxml`), 'utf8');
  const block = functionBlock(entry.fn);
  const lines = block.split('\n');
  const errorLine = lines.find((line) => line.includes('emptySample({ embedded: true') && line.includes(entry.error)) || '';
  const emptyLine = lines.find((line) => line.includes('emptySample({ embedded: true') && line.includes(entry.empty)) || '';
  assert(wxml.includes('<pui-empty') || (entry.delegate && wxml.includes(entry.delegate)), `${entry.id} native state must compose or delegate PUI Empty`);
  assert(wxml.includes('<pui-loading') || (entry.delegate && wxml.includes(entry.delegate)), `${entry.id} native state must compose or delegate PUI Loading`);
  assert(errorLine, `${entry.id} H5 error must call shared embedded Empty and preserve native copy`);
  assert(emptyLine, `${entry.id} H5 empty must call shared embedded Empty and preserve native copy`);
  assert(block.includes(entry.custom), `${entry.id} consumer custom empty composition must remain available`);
  assert(!errorLine.includes("iconComponent('error-circle'"), `${entry.id} H5 error must not redraw a private Icon`);
  assert(!emptyLine.includes("iconComponent('inbox'") && !emptyLine.includes("iconComponent('search'"), `${entry.id} H5 default empty must not redraw a private Icon`);
  if (entry.action === 'sibling') {
    assert(errorLine.includes('buttonSample({'), `${entry.id} retry must remain a sibling PUI Button`);
    assert(!errorLine.includes('showAction:') && !errorLine.includes('actionMarkup:'), `${entry.id} must not move sibling retry into Empty`);
  } else {
    assert(!errorLine.includes('showAction:') && !errorLine.includes('buttonSample({'), `${entry.id} body error must stay action-free because retry belongs to Footer`);
  }
  assert(styles.includes(`.${entry.prefix}__state > .pui-empty-sample`), `${entry.id} embedded Empty must fill its owning state region`);
});

const listBlock = functionBlock('listShowcase');
assert(listBlock.includes("demoAction: footerState === 'error' ? 'list-retry' : 'list-load'"), 'List retry must remain in the Footer Button');
const virtualBlock = functionBlock('virtualListContentMarkup');
assert(virtualBlock.includes('is-custom-empty') && virtualBlock.includes("tagSample({ theme: 'primary'"), 'VirtualList consumer custom empty slot mirror must remain distinct from default Empty');
assert(/\.pui-empty-sample\.is-embedded\s*\{[^}]*background:\s*transparent;[^}]*border:\s*0;[^}]*border-radius:\s*0;[^}]*box-shadow:\s*none;[^}]*backdrop-filter:\s*none;/s.test(styles), 'embedded Empty must never create a second Surface');

console.log('Collection state composition contract tests passed.');
