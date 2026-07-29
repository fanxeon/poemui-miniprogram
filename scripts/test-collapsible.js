const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'collapsible/collapsible.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'collapsible/collapsible.js' });

assert(definition, 'Collapsible component definition must be registered');

function create(overrides, measuredHeight) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme-light'; },
    setData(patch, callback) {
      Object.assign(this.data, patch);
      if (callback) callback();
    },
    triggerEvent(name, detail) { events.push({ name, detail }); },
    createSelectorQuery() {
      return {
        in() { return this; },
        select(selector) {
          assert.strictEqual(selector, '.pui-collapsible__content-inner');
          return this;
        },
        boundingClientRect() { return this; },
        exec(callback) { callback([{ height: measuredHeight === undefined ? 72.4 : measuredHeight }]); },
      };
    },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  instance.syncState(true);
  return { instance, events };
}

assert.strictEqual(Object.keys(definition.properties).length, 25, 'Collapsible publishes 25 Props');

const defaults = create();
assert.strictEqual(defaults.instance.data.innerOpen, false);
assert.strictEqual(defaults.instance.data.controlled, false);
assert.strictEqual(defaults.instance.data.contentState, 'empty');
assert.strictEqual(defaults.instance.data.contentHeight, 73, 'selector query height is rounded up');
assert(defaults.instance.data.rootClass.includes('pui-collapsible--default'));
assert(defaults.instance.data.rootClass.includes('pui-collapsible--icon-right'));
assert(defaults.instance.data.rootClass.includes('pui-collapsible--block'));
assert(defaults.instance.data.rootClass.includes('pui-collapsible--bordered'));
assert(!defaults.instance.data.rootClass.includes('pui-collapsible--shadow'), 'Collapsible remains flat unless shadow is explicitly enabled');
assert(defaults.instance.data.rootStyle.includes('--pui-collapsible-duration: 500ms'));
assert.strictEqual(defaults.instance.data.semanticLabel, '展开详情');

const fallback = create({ theme: 'unknown', iconPosition: 'middle', duration: 999, easing: 'spring' });
assert(fallback.instance.data.rootClass.includes('pui-collapsible--default'));
assert(fallback.instance.data.rootClass.includes('pui-collapsible--icon-right'));
assert(fallback.instance.data.rootStyle.includes('--pui-collapsible-duration: 999ms'));
assert(fallback.instance.data.rootStyle.includes('cubic-bezier(0.2, 0, 0, 1)'));

const elevated = create({ defaultOpen: true, shadow: true, content: '展开 Surface' });
assert(elevated.instance.data.rootClass.includes('pui-collapsible--shadow'));
assert(elevated.instance.data.rootClass.includes('pui-collapsible--open'));

const capped = create({ duration: 1600 });
assert(capped.instance.data.rootStyle.includes('--pui-collapsible-duration: 1000ms'));

const reduced = create({ duration: 400, reduceMotion: true });
assert.strictEqual(reduced.instance.data.motionDuration, 1);
assert(reduced.instance.data.rootStyle.includes('--pui-collapsible-duration: 1ms'));

const uncontrolled = create({ defaultOpen: true, content: '可折叠正文' });
assert.strictEqual(uncontrolled.instance.data.innerOpen, true);
assert.strictEqual(uncontrolled.instance.data.contentState, 'content');
assert.strictEqual(uncontrolled.instance.close(), true);
assert.strictEqual(uncontrolled.instance.data.innerOpen, false);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['input', 'change', 'close']);
assert.strictEqual(uncontrolled.events[0].detail.previousOpen, true);
assert.strictEqual(uncontrolled.events[0].detail.open, false);
assert.strictEqual(uncontrolled.events[0].detail.source, 'method-close');
assert.strictEqual(uncontrolled.instance.open(), true);
assert.strictEqual(uncontrolled.instance.data.innerOpen, true);
assert.strictEqual(uncontrolled.instance.toggle(), true);
assert.strictEqual(uncontrolled.instance.data.innerOpen, false);
assert.strictEqual(uncontrolled.instance.close(), false, 'same-state method emits no event');

const clicked = create({ content: '正文' });
clicked.instance.onTriggerTap();
assert.deepStrictEqual(clicked.events.map((event) => event.name), ['click', 'input', 'change', 'open']);
assert.strictEqual(clicked.events[0].detail.source, 'trigger');
assert.strictEqual(clicked.events[0].detail.controlled, false);

const controlled = create({ open: false, defaultOpen: true, content: '受控正文' });
assert.strictEqual(controlled.instance.data.controlled, true);
controlled.instance.onTriggerTap();
assert.strictEqual(controlled.instance.data.innerOpen, false, 'controlled trigger waits for parent write-back');
assert.strictEqual(controlled.events[1].detail.open, true);
assert.strictEqual(controlled.events[1].detail.controlled, true);
controlled.instance.data.open = true;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerOpen, true, 'parent write-back updates controlled view');
controlled.instance.data.open = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.controlled, false);
assert.strictEqual(controlled.instance.data.innerOpen, true, 'controlled to uncontrolled resets to defaultOpen');

const readonly = create({ readonly: true, content: '只读正文' });
readonly.instance.onTriggerTap();
assert.deepStrictEqual(readonly.events.map((event) => event.name), ['click']);
assert.strictEqual(readonly.events[0].detail.blocked, true);
assert.strictEqual(readonly.instance.data.innerOpen, false);
assert.strictEqual(readonly.instance.open(), false);

const disabled = create({ disabled: true, error: true });
disabled.instance.onTriggerTap();
disabled.instance.retry();
disabled.instance.open();
assert.strictEqual(disabled.events.length, 0);

const loading = create({ loading: true });
assert.strictEqual(loading.instance.data.contentState, 'loading');
loading.instance.open();
assert.strictEqual(loading.instance.data.innerOpen, true, 'loading content does not lock the trigger');
assert.deepStrictEqual(loading.events.map((event) => event.name), ['input', 'change', 'open']);

const statePriority = create({ error: true, loading: true, content: '正文', customContent: true });
assert.strictEqual(statePriority.instance.data.contentState, 'error', 'error wins over loading and content');
statePriority.instance.retry();
assert.strictEqual(statePriority.events.at(-1).name, 'retry');
assert.strictEqual(statePriority.events.at(-1).detail.source, 'retry');
statePriority.instance.data.error = false;
statePriority.instance.syncState();
assert.strictEqual(statePriority.instance.data.contentState, 'loading');
statePriority.instance.data.loading = false;
statePriority.instance.syncState();
assert.strictEqual(statePriority.instance.data.contentState, 'content');
statePriority.instance.data.customContent = false;
statePriority.instance.data.content = '';
statePriority.instance.syncState();
assert.strictEqual(statePriority.instance.data.contentState, 'empty');

const after = create({ content: '正文' });
after.instance.open();
after.instance.onTransitionEnd({ detail: { propertyName: 'opacity' } });
assert(!after.events.some((event) => event.name === 'after-open'), 'non-height transitions do not complete the contract');
after.instance.onTransitionEnd({ detail: { propertyName: 'max-height' } });
assert.strictEqual(after.events.at(-1).name, 'after-open');
assert.strictEqual(after.events.at(-1).detail.source, 'transitionend');
after.instance.onTransitionEnd({ detail: { propertyName: 'max-height' } });
assert.strictEqual(after.events.filter((event) => event.name === 'after-open').length, 1, 'completion event is deduplicated');
after.instance.close();
after.instance.onTransitionEnd({ detail: {} });
assert.strictEqual(after.events.at(-1).name, 'after-close');

const noRetry = create({ error: true, retryText: '' });
noRetry.instance.retry();
assert.strictEqual(noRetry.events.length, 0);

const wxml = fs.readFileSync(path.join(root, 'collapsible/collapsible.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'collapsible/collapsible.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'collapsible/collapsible.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const componentApi = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const semanticContract = fs.readFileSync(path.join(root, 'docs/components/COLLAPSIBLE.md'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));

assert(wxml.includes('role="button"'));
assert(wxml.includes('role="region"'));
assert(wxml.includes('aria-expanded="{{innerOpen}}"'));
assert(wxml.includes('bindtransitionend="onTransitionEnd"'));
assert(wxml.includes('max-height: {{innerOpen ? contentHeight : 0}}px'));
assert(wxml.includes('<slot wx:if="{{customTrigger}}" name="trigger"></slot>'));
assert(wxml.includes('<slot wx:if="{{customContent}}"></slot>'));
assert(wxml.includes('<pui-icon'));
assert(wxml.includes('<pui-loading'));
assert(wxml.includes('<pui-empty'));
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert.strictEqual(json.usingComponents['pui-empty'], '../empty/empty');
assert(!/display\s*:\s*none/.test(wxss), 'Collapsible must keep the content node during motion');
assert(!/height\s*:\s*auto/.test(wxss), 'Collapsible must not transition height:auto');
assert(wxss.includes('transition-property: max-height, opacity, transform'));
assert(wxss.includes('var(--pui-collapsible-duration)'));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Collapsible CSS has no fixed motion longer than 500ms');
assert.strictEqual(metadata.apiProps.collapsible.length, 25, 'generated inspector must expose all 25 Collapsible Props');
assert.strictEqual(metadata.details.collapsible.path, 'poemui-miniprogram/collapsible/collapsible');
assert(preview.includes('function collapsibleShowcase(props, demo)'));
assert(preview.includes("${props.shadow ? 'has-shadow' : ''}"), 'H5 mirror must expose the same explicit shadow gate');
assert(preview.includes('function bindCollapsiblePreviewRuntime(props)'));
assert(preview.includes("emptySample({ embedded: true, role: 'alert', description: props.errorText || '内容加载失败'"));
assert(preview.includes("emptySample({ embedded: true, description: props.emptyText || '暂无详情'"));
assert(preview.includes("inner.scrollHeight"), 'H5 mirror measures real content height');
assert(preview.includes('data-demo-action="collapsible-toggle"'), 'H5 mirror uses a real trigger button');
assert(preview.includes('retry：source=retry；等待消费者重新请求，不伪造成功'));
assert(previewStyles.includes('.pui-collapsible-showcase'));
assert(previewStyles.includes('.pui-collapsible-preview.has-shadow.is-open { box-shadow: var(--preview-shadow-card); }'), 'H5 shadow must be limited to enabled open state');
assert(wxss.includes('.pui-collapsible--shadow.pui-collapsible--open { box-shadow: var(--pui-shadow-card); }'), 'native shadow must be limited to enabled open state');
assert(previewStyles.includes('.pui-empty-sample.is-embedded'));
assert(previewStyles.includes('transition-property: max-height, opacity, transform'));
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(componentApi.includes('## Collapsible'));
assert(componentApi.includes('bind:after-open="onCollapsibleAfterOpen"'));
assert(compatibility.includes('Collapsible'));
assert(semanticContract.includes('error > loading > content > empty'));
assert(semanticContract.includes('max-height、opacity、translateY'));

process.stdout.write('Collapsible contract tests passed.\n');
