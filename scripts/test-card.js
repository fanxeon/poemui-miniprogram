const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('card/card.js');
const wxml = read('card/card.wxml');
const wxss = read('card/card.wxss');
const preview = read('preview/app.js');
const previewCss = read('preview/styles.css');
const api = read('docs/COMPONENT_API.md');
const contract = read('docs/components/CARD.md');
const contractIndex = read('docs/components/README.md');
const example = read('_example/miniprogram/pages/components/index.wxml');
const metadata = require(path.join(root, 'metadata/components.js'));

assert.deepStrictEqual(metadata.apiProps.card, ['title', 'description', 'showHeader', 'bordered', 'padding', 'showFooter', 'headerBordered', 'footerBordered', 'shadow', 'clickable', 'disabled', 'ariaLabel', 'duration', 'easing', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiEvents.card.map((event) => event.name), ['click']);
assert.deepStrictEqual(metadata.apiSlots.card.map((slot) => slot.name), ['default', 'header', 'footer']);
assert(wxml.includes('role="{{clickable ? \'button\' : \'region\'}}"'));
assert(wxml.includes('catchtap="onFooterTap"'), 'Footer must stop Card tap bubbling for slotted actions');
assert(wxss.includes('.pui-card__header,\n.pui-card__content,\n.pui-card__footer { padding: var(--pui-card-inset); }'));
assert(wxss.includes('.pui-card--compact .pui-card__header,\n.pui-card--compact .pui-card__content,\n.pui-card--compact .pui-card__footer { padding: var(--pui-panel-padding-compact); }'));
assert(preview.includes('function cardShowcase(props, demo)'));
assert(preview.includes("const footer = props.showFooter\n    ?"));
assert(!preview.includes('pui-card-showcase__slot-note'), 'H5 must not invent a footer-closed placeholder absent from WXML');
assert(preview.includes('pui-card-showcase__details') && preview.includes('组件状态与恢复路径已列入检查'), 'Card click must reveal a real parent-controlled inspection result rather than a diagnostic event label');
assert(preview.includes('待用户确认'), 'Card 演示必须呈现真实的发布前状态，而不是 slot 工程术语');
assert(preview.includes('上一个发布批次'), 'Card 演示必须同时给出不可操作但可阅读的归档记录');
assert(preview.includes('demo.cardSaved = !demo.cardSaved;'), 'Footer Button must write a reversible parent state without claiming persistence');
assert(preview.includes("action === 'card-tap' && previewIdFor(state.current) === 'card' && (event.key === 'Enter' || event.key === ' ')"), 'H5 role=button Card must retain Enter/Space activation');
assert(previewCss.includes('.pui-card-showcase--compact footer { padding: var(--pui-preview-panel-padding-compact); }'));
assert(previewCss.includes('.pui-card-showcase footer { padding: var(--pui-preview-panel-padding); }'));
assert(previewCss.includes('body .app-shell[data-page-mode] .preview-stage .pui-card-showcase.has-shadow {\n  box-shadow: var(--preview-shadow-card);\n}'));
assert(previewCss.includes('body .app-shell[data-page-mode] .preview-stage .pui-card-showcase {\n  background-color: var(--preview-surface);\n  border-color: var(--preview-border);\n  box-shadow: none;'));
assert(previewCss.includes('transition-duration: var(--pui-card-duration, 500ms);'), 'Card preview must retain the published duration/reduceMotion contract after global appearance rules');
assert(api.includes('## Card'));
assert(contract.includes('Card 的 `shadow` Prop 才决定是否消费卡片阴影'));
assert(contractIndex.includes('[Card](./CARD.md)'));
assert(example.includes('<pui-card title="Card 具名 slot 与点击边界"'));

let definition;
vm.runInNewContext(source, { Component(value) { definition = value; }, require() { return {}; } });
assert(definition && Object.keys(definition.properties).length === 15);
function create(overrides = {}) {
  const defaults = Object.fromEntries(Object.entries(definition.properties).map(([key, value]) => [key, value.value]));
  const events = [];
  const instance = {
    data: { ...definition.data, ...defaults, ...overrides },
    getColorSchemeClass() { return 'pui-theme-light'; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  instance.syncState();
  return { instance, events };
}

const defaults = create();
assert(defaults.instance.data.rootClass.includes('pui-card--normal'));
assert(!defaults.instance.data.rootClass.includes('pui-card--shadow'));
assert(defaults.instance.data.rootStyle.includes('transition-duration:500ms'));
const card = create({ padding: 'compact', shadow: true, clickable: true, duration: 2000 });
assert(card.instance.data.rootClass.includes('pui-card--compact'));
assert(card.instance.data.rootClass.includes('pui-card--shadow'));
assert(card.instance.data.rootClass.includes('pui-card--clickable'));
assert(card.instance.data.rootStyle.includes('transition-duration:1000ms'));
card.instance.onTap();
assert.strictEqual(JSON.stringify(card.events), JSON.stringify([{ name: 'click', detail: { source: 'card' } }]));
const disabled = create({ clickable: true, disabled: true, reduceMotion: true, duration: -1 });
assert(disabled.instance.data.rootClass.includes('pui-card--disabled'));
assert(disabled.instance.data.rootStyle.includes('transition-duration:1ms'));
disabled.instance.onTap();
assert.deepStrictEqual(disabled.events, []);
if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => assert.strictEqual(read(`miniprogram_dist/card/card.${extension}`), read(`card/card.${extension}`)));
}
console.log('Card contract tests passed.');
