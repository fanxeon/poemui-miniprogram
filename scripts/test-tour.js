'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const tourData = require(path.join(root, 'common/utils/tour-data'));
let definition;
vm.runInNewContext(fs.readFileSync(path.join(root, 'tour/tour.js'), 'utf8'), {
  Component(value) { definition = value; },
  require(request) {
    if (request.includes('tour-data')) return tourData;
    if (request.includes('platform-info')) return { getWindowInfo() { return { windowWidth: 390, windowHeight: 844 }; } };
    return {};
  },
  isFinite, setTimeout, clearTimeout, console,
}, { filename: 'tour/tour.js' });
assert(definition);
function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  definition.lifetimes.attached.call(instance);
  instance.events = events;
  return instance;
}
const steps = tourData.normalizeSteps([
  { key: 'a', selector: '#target', title: 'A', placement: 'right', padding: 10 },
  { key: 'a', selector: 'view > #bad', title: 'B' },
]);
assert.strictEqual(steps[0].selector, '#target');
assert.strictEqual(steps[1].selector, '');
assert.deepStrictEqual(steps.map((item) => item.key), ['a', 'a-2']);
const target = tourData.clampTarget({ left: 5, top: 10, right: 80, bottom: 60 }, { width: 390, height: 844 }, 12);
assert.deepStrictEqual(target, { left: 0, top: 0, right: 92, bottom: 72, width: 92, height: 72 });
assert.strictEqual(tourData.resolvePlacement('right', target, { width: 390, height: 844 }, 180), 'right');
const empty = create({ defaultVisible: true, steps: [] });
assert(empty.events.some((event) => event.name === 'error' && event.detail.code === 'empty-steps'));
assert(empty.events.some((event) => event.name === 'visible-change' && event.detail.visible === false));
const component = create({ steps: [{ selector: '#a', title: 'A' }, { selector: '#b', title: 'B' }] });
component._visible = true;
component._measureActiveStep = function () {};
assert.strictEqual(component.next(), true);
assert(component.events.some((event) => event.name === 'current-change' && event.detail.current === 1));
assert.strictEqual(component.next(), true);
assert(component.events.some((event) => event.name === 'finish'));
const wxml = fs.readFileSync(path.join(root, 'tour/tour.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'tour/tour.wxss'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components'));
assert.strictEqual((wxml.match(/pui-tour__mask/g) || []).length, 4);
assert(wxml.includes('<pui-button') && !wxml.includes('<button'));
assert(wxss.includes('.pui-frosted-glass--on .pui-tour__mask'));
assert(wxss.includes('.pui-spacing--equal .pui-tour__panel'));
assert.deepStrictEqual(metadata.apiProps.tour, ['steps', 'visible', 'defaultVisible', 'current', 'defaultCurrent', 'closeOnOverlay', 'overlayBlur', 'showSkip', 'showIndicators', 'zIndex', 'duration', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiEvents.tour.map((item) => item.name), ['visible-change', 'current-change', 'change', 'skip', 'finish', 'close', 'error']);
assert.deepStrictEqual(metadata.apiMethods.tour.map((item) => item.name), ['open(index?)', 'close(reason?)', 'next()', 'prev()']);
assert(preview.includes("const edgeToEdgePreviewIds = new Set([") && preview.includes("'tour',"));
assert(preview.includes('function applyTourPreviewGeometry(root, target, step)'));
assert(preview.includes("event.key === 'Escape'") && preview.includes("event.key !== 'Tab'"));
assert(preview.includes('demo.tourError = `未找到引导目标 ${selector}`'));
assert(previewStyles.includes('.pui-tour-preview__mask') && previewStyles.includes('.pui-tour-preview__panel'));
assert(previewStyles.includes('.app-shell[data-shadow="off"] .pui-tour-preview__panel'));
assert(previewStyles.includes('.app-shell[data-spacing="equal"] .pui-tour-preview__panel'));
assert(fs.readFileSync(path.join(root, 'docs/components/TOUR.md'), 'utf8').includes('fail-closed'));
assert(fs.readFileSync(path.join(root, 'miniprogram/pages/components/tour/index.wxml'), 'utf8').includes('bind:error="onTourError"'));
console.log('Tour contract tests passed.');
