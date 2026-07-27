const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'direction/direction.js'), 'utf8');
let definition = null;
let nextTimerId = 1;
const timers = new Map();
const wxStub = {
  getAppBaseInfo() { return { language: 'ar-SA' }; },
};
const sandbox = {
  console,
  isFinite,
  wx: wxStub,
  require(request) {
    if (request === '../common/utils/platform-info') return {
      getAppBaseInfo: () => {
        try { return wxStub.getAppBaseInfo() || {}; } catch (error) { return {}; }
      }
    };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  Component(value) { definition = value; },
  setTimeout(callback, delay) {
    const id = nextTimerId++;
    timers.set(id, { callback, delay });
    return id;
  },
  clearTimeout(id) { timers.delete(id); },
};
vm.runInNewContext(source, sandbox, { filename: 'direction/direction.js' });

assert(definition, 'Direction component definition must be registered');

function flushTimers() {
  while (timers.size) {
    const pending = Array.from(timers.entries());
    timers.clear();
    pending.forEach(([, timer]) => timer.callback());
  }
}

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

assert.strictEqual(Object.keys(definition.properties).length, 14, 'Direction publishes 14 Props');

const defaults = create();
assert.strictEqual(defaults.instance.getDirection(), 'ltr');
assert.strictEqual(defaults.instance.data.resolvedTextAlign, 'left');
assert.strictEqual(defaults.instance.data.resolvedDisplay, 'block');
assert(defaults.instance.data.rootClass.includes('pui-direction--ltr'));
assert.strictEqual(defaults.instance.data.motionDuration, 500);
assert.strictEqual(defaults.instance.data.motionPhase, 250);
assert(defaults.instance.data.rootStyle.includes('--pui-direction-duration:250ms'));
assert.deepStrictEqual(defaults.events.map((event) => event.name), ['resolve', 'ready']);
assert.strictEqual(defaults.events[1].detail.source, 'attached');

const rtl = create({ direction: 'rtl', textAlign: 'start', display: 'flex' });
assert.strictEqual(rtl.instance.getDirection(), 'rtl');
assert.strictEqual(rtl.instance.data.resolvedTextAlign, 'right');
assert.strictEqual(rtl.instance.data.resolvedDisplay, 'flex');
assert(rtl.instance.data.rootClass.includes('pui-direction--align-right'));
assert(rtl.instance.data.rootClass.includes('pui-direction--flex'));

const end = create({ direction: 'rtl', textAlign: 'end', display: 'invalid' });
assert.strictEqual(end.instance.data.resolvedTextAlign, 'left');
assert.strictEqual(end.instance.data.resolvedDisplay, 'block');

const autoProperty = create({ direction: 'auto', language: 'fa-IR' });
assert.strictEqual(autoProperty.instance.getDirection(), 'rtl');
assert.strictEqual(autoProperty.instance.data.languageSource, 'property');
assert.strictEqual(autoProperty.instance.data.resolvedLanguage, 'fa-ir');

const autoSystem = create({ direction: 'auto', language: '' });
assert.strictEqual(autoSystem.instance.getDirection(), 'rtl');
assert.strictEqual(autoSystem.instance.data.languageSource, 'system');
assert.strictEqual(autoSystem.instance.data.resolvedLanguage, 'ar-sa');

wxStub.getAppBaseInfo = () => ({});
const fallback = create({ direction: 'auto', fallbackDirection: 'rtl' });
assert.strictEqual(fallback.instance.getDirection(), 'rtl');
assert.strictEqual(fallback.instance.data.fallbackUsed, true);
assert.strictEqual(fallback.instance.data.languageSource, 'fallback');

wxStub.getAppBaseInfo = () => { throw new Error('modern api unavailable'); };
const unavailableSystem = create({ direction: 'auto', fallbackDirection: 'rtl' });
assert.strictEqual(unavailableSystem.instance.getDirection(), 'rtl');
assert.strictEqual(unavailableSystem.instance.data.resolvedLanguage, '');
assert.strictEqual(unavailableSystem.instance.data.languageSource, 'fallback');

const invalid = create({ direction: 'sideways', fallbackDirection: 'rtl' });
assert.strictEqual(invalid.instance.getDirection(), 'rtl');
assert.strictEqual(invalid.instance.data.fallbackUsed, true);

const change = create({ direction: 'ltr', duration: 1600, easing: 'linear' });
change.instance.data.direction = 'rtl';
change.instance.syncDirection('property');
assert.strictEqual(change.instance.getDirection(), 'rtl');
assert.strictEqual(change.instance.data.changing, true);
assert.strictEqual(change.instance.data.motionDuration, 1000);
assert.strictEqual(change.instance.data.motionPhase, 500);
assert(change.instance.data.rootStyle.includes('--pui-direction-duration:500ms'));
assert(change.instance.data.rootStyle.includes('--pui-direction-ease:linear'));
assert.deepStrictEqual(change.events.slice(-2).map((event) => event.name), ['resolve', 'change']);
assert.strictEqual(change.events.at(-1).detail.previousDirection, 'ltr');
flushTimers();
assert.strictEqual(change.instance.data.changing, false);
assert.strictEqual(change.events.at(-1).name, 'after-change');

const reduced = create({ direction: 'rtl', duration: 1000, reduceMotion: true });
assert.strictEqual(reduced.instance.data.motionDuration, 1);
assert(reduced.instance.data.rootStyle.includes('--pui-direction-duration:1ms'));

const methods = create({ direction: 'rtl', language: 'he' });
assert.strictEqual(methods.instance.refresh('method-refresh').direction, 'rtl');
assert.strictEqual(methods.events.at(-1).name, 'resolve');
assert.strictEqual(methods.events.at(-1).detail.source, 'method-refresh');
assert.strictEqual(methods.instance.getState().language, 'he');
assert.strictEqual(methods.instance.getState().direction, 'rtl');
definition.lifetimes.detached.call(methods.instance);

const wxml = fs.readFileSync(path.join(root, 'direction/direction.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'direction/direction.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'direction/direction.json'), 'utf8'));
assert(wxml.includes('<slot wx:if="{{useSlot}}"></slot>'));
assert(wxml.includes('user-select="{{selectable}}"'));
assert(wxml.includes('data-direction="{{resolvedDirection}}"'));
assert(wxss.includes('.pui-direction--rtl { direction: rtl; }'));
assert(wxss.includes('.pui-direction--flex { display: flex;'));
assert(wxss.includes('transition: opacity var(--pui-direction-duration'));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Direction CSS has no fixed motion longer than 500ms');
assert.strictEqual(json.component, true);
assert.strictEqual(json.styleIsolation, 'shared');

const metadata = require(path.join(root, 'metadata/components.js'));
const shadcn = require(path.join(root, 'metadata/shadcn.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const apiDocs = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibilityDocs = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const exampleJson = JSON.parse(fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8'));
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(metadata.packageComponents.includes('direction'));
assert(metadata.releaseComponentIds.has('direction'));
assert.strictEqual(metadata.apiProps.direction.length, 14);
assert.strictEqual(metadata.details.direction.path, 'poemui-miniprogram/direction/direction');
const shadcnDirection = shadcn.shadcnComponents.find((item) => item.source === 'Direction');
assert(shadcnDirection && shadcnDirection.poem === 'direction' && shadcnDirection.status === 'native' && shadcnDirection.delivery === 'done');
assert(preview.includes('function directionShowcase(props, demo)'));
assert(preview.includes('function bindDirectionPreviewRuntime(props)'));
assert(preview.includes('renderedChanging !== current.changing'));
assert(preview.includes("type === 'direction-toggle'"));
assert(preview.includes("type === 'direction-refresh'"));
assert(preview.includes("type === 'direction-get-state'"));
assert(preview.includes('bind:after-change="onDirectionAfterChange"'));
assert(preview.includes('pui-direction-preview__actions pui-preview-elevation-clearance'), 'Direction reserves visible lower elevation clearance for its composed Button row');
assert(preview.includes("buttonSample({ previewContract: true, content: current.direction"), 'Direction child buttons use the complete Button mirror contract');
assert(preview.includes("buttonSample({ previewContract: true, theme: 'primary'"), 'Direction method buttons use the complete Button mirror contract');
assert(previewStyles.includes('.pui-direction-preview'));
assert(previewStyles.includes('.pui-direction-preview__actions .pui-button'));
assert(previewStyles.includes('.pui-direction-preview__methods .pui-button'));
assert(/\.pui-direction-preview\s*\{[\s\S]*?overflow:\s*visible;[\s\S]*?padding:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?border:\s*0;[\s\S]*?box-shadow:\s*none;/.test(previewStyles), 'Direction H5 root remains a transparent, non-clipping provider');
assert(/\.pui-direction-preview__slot\s*\{[\s\S]*?overflow:\s*visible;/.test(previewStyles), 'Direction slot does not clip composed Button elevation');
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(/\.phone\s*\{[\s\S]*?box-sizing:\s*border-box;/.test(previewStyles), 'phone mirror must keep padding inside 375/393px width');
assert(apiDocs.includes('## Direction'));
assert(apiDocs.includes('`getDirection()`'));
assert(apiDocs.includes('不会自动改写已有组件中的物理 `left/right`'));
assert(/\d+\. Direction 的 H5 镜像/.test(compatibilityDocs));
assert(readme.includes(`当前 npm 包内包含 \`${metadata.packageComponents.length}\` 个`));
assert(changelog.includes('新增独立 Direction Provider'));
assert.strictEqual(exampleJson.usingComponents['pui-direction'], 'poemui-miniprogram/direction/direction');
assert(exampleJs.includes('toggleDeliveryDirection'));
assert(exampleJs.includes('onDirectionAfterChange'));
assert(exampleWxml.includes('<pui-direction'));
assert(exampleWxml.includes('bind:after-change="onDirectionAfterChange"'));

process.stdout.write('Direction contract tests passed.\n');
