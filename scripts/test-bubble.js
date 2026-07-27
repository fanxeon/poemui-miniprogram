const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'bubble/bubble.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  setTimeout,
  clearTimeout,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'bubble/bubble.js' });

assert(definition, 'Bubble component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    _bubbleMounted: true,
    getColorSchemeClass() { return ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  instance.syncState(true);
  return { instance, events };
}

assert.strictEqual(Object.keys(definition.properties).length, 25, 'Bubble publishes 25 Props');

const empty = create();
assert.strictEqual(empty.instance.data.rendered, false, 'empty text does not create a fake bubble');
assert.strictEqual(empty.instance.data.phase, 'hidden');

const content = create({ content: '  当前内容  ', text: 'fallback' });
assert.strictEqual(content.instance.data.displayContent, '当前内容');
assert.strictEqual(content.instance.data.rendered, true);
assert.strictEqual(content.instance.data.active, true);

const fallback = create({ text: '兼容文本' });
assert.strictEqual(fallback.instance.data.displayContent, '兼容文本');

const slot = create({ customContent: true });
assert.strictEqual(slot.instance.data.rendered, true, 'custom content slot can make an empty Bubble visible');
assert.strictEqual(slot.instance.data.bubbleLabel, '自定义消息气泡');

const invalid = create({
  content: '边界',
  variant: 'invalid',
  align: 'invalid',
  groupPosition: 'invalid',
  reactionSide: 'invalid',
  reactionAlign: 'invalid',
  ariaLive: 'invalid',
  maxLines: 99,
  duration: 999,
  easing: 'invalid',
});
assert(invalid.instance.data.rootClass.includes('pui-bubble--default'));
assert(invalid.instance.data.rootClass.includes('pui-bubble--start'));
assert(invalid.instance.data.rootClass.includes('pui-bubble--group-single'));
assert(invalid.instance.data.rootClass.includes('pui-bubble--reaction-bottom'));
assert(invalid.instance.data.rootClass.includes('pui-bubble--reaction-align-end'));
assert.strictEqual(invalid.instance.data.bubbleAriaLive, 'off');
assert.strictEqual(invalid.instance.data.normalizedMaxLines, 12);
assert(invalid.instance.data.rootStyle.includes('--pui-bubble-lines:12'));
assert(invalid.instance.data.rootStyle.includes('--pui-bubble-duration:999ms'));
assert(invalid.instance.data.rootStyle.includes('cubic-bezier(0.2, 0, 0, 1)'));

const capped = create({ duration: 1600 });
assert(capped.instance.data.rootStyle.includes('--pui-bubble-duration:1000ms'));

const reactions = create({
  content: '请选择',
  reactions: [
    { value: 0, emoji: '👍', count: 2, active: true },
    { value: false, label: '保留 false' },
    { value: 'blocked', label: '禁用', disabled: true },
  ],
});
assert.strictEqual(reactions.instance.data.reactionItems.length, 3);
assert.strictEqual(reactions.instance.data.reactionItems[0].text, '👍 2');
assert.strictEqual(reactions.instance.data.reactionItems[0].value, 0);
assert.strictEqual(reactions.instance.data.reactionItems[1].value, false);
assert.strictEqual(reactions.instance.data.hasReactions, true);
reactions.instance.onReactionTap({ currentTarget: { dataset: { index: 0 } } });
assert.strictEqual(reactions.events.at(-1).name, 'reaction');
assert.strictEqual(reactions.events.at(-1).detail.value, 0);
assert.strictEqual(reactions.events.at(-1).detail.active, true);
reactions.instance.onReactionTap({ currentTarget: { dataset: { index: 2 } } });
assert.strictEqual(reactions.events.length, 1, 'disabled reaction is gated');

const clickable = create({ content: '可点击', clickable: true });
clickable.instance.onContentTap();
clickable.instance.onContentLongPress();
assert.deepStrictEqual(clickable.events.map((event) => event.name), ['click', 'longpress']);
assert.strictEqual(clickable.events[0].detail.source, 'content');

const disabled = create({ content: '禁用', clickable: true, disabled: true, reactions: ['👍'] });
disabled.instance.onContentTap();
disabled.instance.onContentLongPress();
disabled.instance.onReactionTap({ currentTarget: { dataset: { index: 0 } } });
assert.strictEqual(disabled.events.length, 0);
assert.strictEqual(disabled.instance.data.interactive, false);

const uncontrolled = create({ content: '长内容', collapsible: true, defaultExpanded: false });
uncontrolled.instance.onToggleTap();
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['input', 'change', 'expand']);
assert.strictEqual(uncontrolled.instance.data.expandedState, true);
assert.strictEqual(uncontrolled.events[0].detail.previousValue, false);
uncontrolled.instance.collapse();
assert.deepStrictEqual(uncontrolled.events.slice(-3).map((event) => event.name), ['input', 'change', 'collapse']);
assert.strictEqual(uncontrolled.events.at(-1).detail.source, 'method');

const controlled = create({ content: '受控内容', collapsible: true, expanded: false });
controlled.instance.onToggleTap();
assert.strictEqual(controlled.instance.data.expandedState, false, 'controlled expansion waits for parent writeback');
assert.strictEqual(controlled.events.at(-1).name, 'expand');
controlled.instance.data.expanded = true;
controlled.instance.syncState(true);
assert.strictEqual(controlled.instance.data.expandedState, true);

const measured = create({ content: '需要测量的长内容', collapsible: true, maxLines: 2 });
measured.instance.createSelectorQuery = function createSelectorQuery() {
  return {
    select() { return this; },
    boundingClientRect() { return this; },
    exec(callback) { callback([{ height: 120 }, { height: 40 }]); },
  };
};
measured.instance.measureContent();
assert.strictEqual(measured.instance.data.showToggle, true);
assert(measured.instance.data.measureStyle.includes('--pui-bubble-collapsed-height:40px'));
assert(measured.instance.data.measureStyle.includes('--pui-bubble-expanded-height:121px'));

const motion = create({ content: '显隐', duration: 0 });
motion.instance.data.visible = false;
motion.instance.syncState(false);
assert.deepStrictEqual(motion.events.map((event) => event.name), ['hide', 'after-hide']);
assert.strictEqual(motion.instance.data.rendered, false);
motion.instance.data.visible = true;
motion.instance.syncState(false);
assert.deepStrictEqual(motion.events.map((event) => event.name), ['hide', 'after-hide', 'show', 'after-show']);
assert.strictEqual(motion.instance.data.rendered, true);

const reduced = create({ content: '低动效', duration: 400, reduceMotion: true });
assert(reduced.instance.data.rootStyle.includes('--pui-bubble-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'bubble/bubble.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'bubble/bubble.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'bubble/bubble.json'), 'utf8'));
const previewJs = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewCss = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
assert(!/<button\b/.test(wxml), 'Bubble composes the internal Button instead of raw button markup');
assert(!/<image\b/.test(wxml), 'Bubble does not need a raw image');
assert(wxml.includes('<pui-button'), 'Bubble composes PoemUI Button for reactions and expansion');
assert(wxml.includes('<slot wx:if="{{customContent}}"></slot>'), 'Bubble publishes the content slot');
assert(wxml.includes('name="reactions"'), 'Bubble publishes the reactions slot');
assert(wxml.includes('bindtap="onContentTap"'), 'Bubble publishes a real click boundary');
assert(wxml.includes('bindlongpress="onContentLongPress"'), 'Bubble publishes a longpress boundary');
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert(!/display\s*:\s*none/.test(wxss), 'Bubble visibility and collapse do not jump through display:none');
assert(wxss.includes('transition: max-height'), 'Bubble collapse uses a max-height motion contract');
assert(wxss.includes('var(--pui-bubble-duration'), 'Bubble motion uses a shared duration token');
assert(wxss.includes('-webkit-line-clamp'), 'Bubble text collapse has a Mini Program compatible line clamp');
assert(previewJs.includes("clip.style.maxHeight = 'none'"), 'H5 measures the unclamped live content height');
assert(previewJs.includes("clip.style.webkitLineClamp = 'unset'"), 'H5 temporarily removes line clamp before measuring');
assert(previewJs.includes("clip.setAttribute('style', previousInlineStyle)"), 'H5 restores the live node style before painting');
assert(previewCss.includes('.pui-bubble-preview__surface {'), 'H5 publishes a scoped Bubble surface');
assert(previewCss.includes('color: var(--page);'), 'H5 default and dark surfaces use an inverse foreground token');
assert(previewJs.includes('duration: previewMotionDuration(props.duration, props.reduceMotion),'), 'Bubble owns its H5 duration normalization through the shared motion helper');
assert(previewJs.includes('easing: dialogMotionEasing(props),'), 'Bubble uses the independent shared easing mapping');
assert(!previewJs.includes('duration: badgePreviewDuration(props),'), 'Bubble never depends on a removed Badge-private helper');
assert(previewJs.includes('function renderOverviewComponentPreview(id, props)'), 'Bubble overview flows through the shared component-only normalizer');
assert(previewJs.includes("element.classList.contains('pui-showcase-label') || element.classList.contains('showcase-label')"), 'the shared normalizer removes both implementation-label variants before Bubble reaches the live preview DOM');
assert(previewJs.includes('pui-bubble-showcase__methods') && previewJs.includes('data-bubble-event'), 'instance methods and event diagnostics remain available to API/runtime code, not as Bubble content');

process.stdout.write('Bubble contract tests passed.\n');
