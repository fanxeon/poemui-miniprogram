'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  createPreviewSource,
  createStarterUsageMarkdown,
  metadata,
  readComponentProperties,
} = require('./catalog-utils');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const ids = metadata.packageComponents;
const starterIds = Object.keys(metadata.starterUsage);

assert.strictEqual(ids.length, metadata.packageComponents.length, 'Starter Usage coverage must follow every published component');
assert.deepStrictEqual(starterIds.slice().sort(), ids.slice().sort(), 'every published component must own exactly one Starter Usage');

for (const id of ids) {
  const starter = metadata.starterUsage[id];
  assert(starter && typeof starter === 'object', `${id} starter must be an object`);
  assert.strictEqual(typeof starter.wxml, 'string', `${id} starter must provide WXML`);
  assert(starter.wxml.trim(), `${id} starter WXML must not be empty`);
  assert(starter.wxml.includes(`<pui-${id}`), `${id} starter must mount the real pui-${id} component`);
  assert(!starter.wxml.includes('undefined'), `${id} starter must not expose undefined`);
  assert(!/\bbind(?::|[a-z-]+=)/.test(starter.wxml), `${id} starter must stay event-free`);
  assert(!/<button\b|<input\b|<textarea\b|<select\b/.test(starter.wxml), `${id} starter must not handwrite native controls`);
  if (starter.data) assert.doesNotThrow(() => JSON.stringify(starter.data), `${id} starter data must be serializable`);
  const registered = new Set([`pui-${id}`, ...Object.keys(starter.components || {})]);
  const mounted = Array.from(starter.wxml.matchAll(/<((?:pui-)[a-z0-9-]+)\b/g), (match) => match[1]);
  mounted.forEach((name) => assert(registered.has(name), `${id} starter must register nested ${name}`));
  const propertyNames = new Set(readComponentProperties(id).map((name) => name.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)));
  const opening = starter.wxml.match(new RegExp(`<pui-${id}\\b([\\s\\S]*?)(?:/?>)`));
  const starterAttributes = Array.from((opening?.[1] || '').matchAll(/\s([a-z][\w-]*)(?=\s|=|\/?$)/g), (match) => match[1]);
  starterAttributes
    .filter((name) => !['id', 'slot', 'class', 'style'].includes(name))
    .forEach((name) => assert(propertyNames.has(name), `${id} starter uses unknown Prop ${name}`));
  for (const expression of starter.wxml.matchAll(/\{\{([^}]+)\}\}/g)) {
    const identifier = expression[1].trim().match(/^([A-Za-z_$][\w$]*)/)?.[1];
    if (!identifier || ['true', 'false', 'null', 'undefined'].includes(identifier)) continue;
    assert(starter.data && Object.prototype.hasOwnProperty.call(starter.data, identifier), `${id} starter binding ${identifier} needs page data`);
  }
  if (starter.components) {
    for (const [name, componentPath] of Object.entries(starter.components)) {
      assert(/^pui-[a-z0-9-]+$/.test(name), `${id} extra component name must use pui-*`);
      assert(/^poemui-miniprogram\/[a-z0-9-]+\/[a-z0-9-]+$/.test(componentPath), `${id} extra component path must use the public npm entry`);
    }
  }
}

assert.strictEqual(
  metadata.starterUsage.popup.wxml,
  '<pui-popup visible="{{true}}" content="Popup 内容" />',
  'Popup starter must be visible and useful after one-line copy',
);
for (const id of ['popup', 'dialog', 'sheet', 'action-sheet', 'overlay', 'picker', 'date-time-picker', 'calendar']) {
  assert(/visible="\{\{true\}\}"/.test(metadata.starterUsage[id].wxml), `${id} overlay starter must render immediately`);
}
assert(metadata.starterUsage.toast.pageJs.includes("selectComponent('#starter-toast').show"), 'Toast starter must include the real imperative show path');
assert(metadata.starterUsage['dynamic-message'].pageJs.includes("selectComponent('#starter-message').show"), 'DynamicMessage starter must include the real imperative show path');

const preview = read('preview/app.js');
const getPropsBlock = preview.slice(preview.indexOf('function getProps('), preview.indexOf('\nfunction ', preview.indexOf('function getProps(') + 10));
assert(!getPropsBlock.includes('starterUsage'), 'Starter Usage must not alter H5 showcase initial Props');
const sectionSourceBlock = preview.slice(preview.indexOf('function previewCodeSectionSources('), preview.indexOf('\nfunction ', preview.indexOf('function previewCodeSectionSources(') + 10));
assert(sectionSourceBlock.includes('starterUsageByComponent[runtimeId]'), 'H5 usage document must read Starter Usage');
assert(sectionSourceBlock.includes('starter?.wxml'), 'H5 basic WXML must use the starter source');
assert(sectionSourceBlock.includes('页面数据'), 'H5 data-backed starters must expose their page data');
const currentCopyBlock = preview.slice(preview.indexOf('function makeCurrentPreviewCopyCode('), preview.indexOf('\nfunction ', preview.indexOf('function makeCurrentPreviewCopyCode(') + 10));
assert(currentCopyBlock.includes('makeUsageCode(detail, props)'), 'current-effect copy must keep using live preview Props');

const generatedPreview = createPreviewSource();
assert(generatedPreview.includes('"starterUsage"'), 'generated H5 catalog must include Starter Usage');
assert(generatedPreview.includes('<pui-popup visible=\\"{{true}}\\" content=\\"Popup 内容\\" />'), 'generated H5 catalog must include the visible Popup starter');
const generatedDocs = createStarterUsageMarkdown();
assert(generatedDocs.includes('# PoemUI 开箱用法'));
assert(generatedDocs.includes('Starter Usage 是复制后立即可见、可理解的最小调用'));
assert(generatedDocs.includes('<pui-popup visible="{{true}}" content="Popup 内容" />'));

const generatedPreviewFile = read('preview/components-data.js');
assert.strictEqual(generatedPreviewFile, generatedPreview, 'preview/components-data.js is stale; run npm run catalog:generate');
const generatedDocsFile = read('docs/COMPONENT_STARTER_USAGE.md');
assert.strictEqual(generatedDocsFile, generatedDocs, 'docs/COMPONENT_STARTER_USAGE.md is stale; run npm run catalog:generate');

console.log('Component Starter Usage contract passed for ' + ids.length + ' components.');
