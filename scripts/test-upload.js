const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'upload/upload.js'), 'utf8');
const wxml = fs.readFileSync(path.join(root, 'upload/upload.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'upload/upload.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'upload/upload.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const metadata = fs.readFileSync(path.join(root, 'metadata/components.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/UPLOAD.md'), 'utf8');

let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
  wx: {},
};
vm.runInNewContext(source, sandbox, { filename: 'upload/upload.js' });
assert(definition, 'Upload component definition must register');

function create(overrides, wxMock) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    _attached: true,
    getColorSchemeClass() { return ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  sandbox.wx = wxMock || {};
  instance.syncState();
  return { instance, events };
}

function names(context) {
  return context.events.map((event) => event.name);
}

function target(index) {
  return { currentTarget: { dataset: { index } } };
}

const expectedProps = [
  'files', 'defaultFiles', 'max', 'picker', 'mediaType', 'messageType', 'source', 'extensions', 'maxSize', 'addContent',
  'addBtn', 'theme', 'columns', 'allowDuplicate', 'preview', 'removeBtn', 'customAdd', 'disabled', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'Upload publishes exactly the 20 accepted Props');

const defaults = create();
assert.strictEqual(defaults.instance.data.normalizedMax, 9);
assert.strictEqual(defaults.instance.data.normalizedColumns, 3);
assert.strictEqual(defaults.instance.data.displayTheme, 'list');
assert.strictEqual(defaults.instance.data.canAdd, true);
assert.strictEqual(defaults.instance.data.innerFiles.length, 0);
assert(defaults.instance.data.rootStyle.includes('500ms'));

const normalized = create({
  defaultFiles: [
    '/tmp/cover.png',
    { path: '/tmp/spec.pdf', size: 2048, status: 'success' },
    { path: '/tmp/archive.zip', status: 'error', progress: 37, message: '网络中断' },
    { path: '/tmp/video.mp4', type: 'video', status: 'invalid' },
    { name: 'missing-path.txt' },
  ],
});
assert.strictEqual(normalized.instance.data.innerFiles.length, 4);
assert.strictEqual(normalized.instance.data.innerFiles[0].type, 'image');
assert.strictEqual(normalized.instance.data.innerFiles[1].canPreview, true);
assert.strictEqual(normalized.instance.data.innerFiles[1].progress, 100);
assert.strictEqual(normalized.instance.data.innerFiles[2].status, 'error');
assert.strictEqual(normalized.instance.data.innerFiles[2].message, '网络中断');
assert.strictEqual(normalized.instance.data.innerFiles[3].status, 'ready');

const controlled = create({ files: [{ path: '/tmp/controlled.pdf', status: 'error', progress: 61 }] });
assert.strictEqual(controlled.instance.removeFile(target(0)), true);
assert.strictEqual(controlled.instance.data.innerFiles.length, 1, 'controlled remove waits for parent files write-back');
assert.deepStrictEqual(names(controlled), ['change', 'remove']);
assert.strictEqual(controlled.events[0].detail.files.length, 0);
assert.strictEqual(controlled.instance.retryFile(target(0)), true);
assert.strictEqual(controlled.events.at(-1).name, 'retry');

const uncontrolled = create({ defaultFiles: [{ path: '/tmp/uncontrolled.png' }] });
assert.strictEqual(uncontrolled.instance.removeFile(target(0)), true);
assert.strictEqual(uncontrolled.instance.data.innerFiles.length, 0);
uncontrolled.instance.data.defaultFiles = [{ path: '/tmp/late.png' }];
uncontrolled.instance.syncState();
assert.strictEqual(uncontrolled.instance.data.innerFiles.length, 0, 'defaultFiles initializes only once');

for (const sentinel of [false, 0, '', null]) {
  const loose = create({ files: sentinel, defaultFiles: [{ path: '/tmp/default.pdf' }] });
  assert.strictEqual(loose.instance.isControlled(), false);
  assert.strictEqual(loose.instance.data.innerFiles.length, 1);
}
const transition = create({ files: [{ path: '/tmp/last-controlled.pdf' }] });
transition.instance.data.files = false;
transition.instance.syncState();
assert.strictEqual(transition.instance.data.innerFiles[0].path, '/tmp/last-controlled.pdf', 'controlled to uncontrolled preserves the last rendered list');

let mediaOptions = null;
const media = create({ max: 3, mediaType: ['image', 'video'], source: 'camera' }, {
  chooseMedia(options) {
    mediaOptions = options;
    options.success({ tempFiles: [{ tempFilePath: '/tmp/photo.jpg', fileType: 'image', size: 1024 }] });
  },
});
assert.strictEqual(media.instance.chooseFile(), true);
assert.strictEqual(mediaOptions.count, 3);
assert.deepStrictEqual(Array.from(mediaOptions.mediaType), ['image', 'video']);
assert.deepStrictEqual(Array.from(mediaOptions.sourceType), ['camera']);
assert.deepStrictEqual(names(media), ['change', 'add']);
assert.strictEqual(media.instance.data.innerFiles[0].status, 'ready', 'selection does not fake remote upload success');

let messageOptions = null;
const message = create({ picker: 'message', messageType: 'file', extensions: ['.pdf'], maxSize: 1000, max: 4 }, {
  chooseMessageFile(options) {
    messageOptions = options;
    options.success({ tempFiles: [
      { path: '/tmp/valid.pdf', name: 'valid.pdf', size: 900, type: 'file' },
      { path: '/tmp/wrong.txt', name: 'wrong.txt', size: 20, type: 'file' },
      { path: '/tmp/large.pdf', name: 'large.pdf', size: 1001, type: 'file' },
    ] });
  },
});
assert.strictEqual(message.instance.chooseFile(), true);
assert.strictEqual(messageOptions.type, 'file');
assert.deepStrictEqual(Array.from(messageOptions.extension), ['pdf']);
assert.deepStrictEqual(names(message), ['reject', 'change', 'add']);
assert.deepStrictEqual(Array.from(message.events[0].detail.rejectedFiles, (item) => item.reason), ['extension', 'size']);
assert.strictEqual(message.events[2].detail.addedFiles.length, 1);

const rejectedOnly = create({ picker: 'message', extensions: ['pdf'] }, {
  chooseMessageFile(options) { options.success({ tempFiles: [{ path: '/tmp/a.txt', size: 10 }] }); },
});
rejectedOnly.instance.chooseFile();
assert.deepStrictEqual(names(rejectedOnly), ['reject']);

const duplicate = create({ defaultFiles: [{ path: '/tmp/same.png' }] });
duplicate.instance.beginChoose();
assert.strictEqual(duplicate.instance.acceptSelectedFiles([{ path: '/tmp/same.png' }], 'choose-media'), false);
assert.deepStrictEqual(names(duplicate), ['reject']);
assert.strictEqual(duplicate.events[0].detail.rejectedFiles[0].reason, 'duplicate');
const duplicateAllowed = create({ defaultFiles: [{ path: '/tmp/same.png' }], allowDuplicate: true });
duplicateAllowed.instance.beginChoose();
assert.strictEqual(duplicateAllowed.instance.acceptSelectedFiles([{ path: '/tmp/same.png' }], 'choose-media'), true);
assert.deepStrictEqual(names(duplicateAllowed), ['change', 'add']);

const canceled = create({}, { chooseMedia(options) { options.fail({ errMsg: 'chooseMedia:fail cancel' }); } });
canceled.instance.chooseFile();
assert.deepStrictEqual(names(canceled), ['cancel']);
assert.strictEqual(canceled.instance.data.choosing, false);
const failed = create({}, { chooseMedia(options) { options.fail({ errMsg: 'chooseMedia:fail permission denied' }); } });
failed.instance.chooseFile();
assert.deepStrictEqual(names(failed), ['error']);
const unsupported = create({ picker: 'message' }, {});
assert.strictEqual(unsupported.instance.chooseFile(), false);
assert.deepStrictEqual(names(unsupported), ['error']);
const disabled = create({ disabled: true }, { chooseMedia() { throw new Error('must not open'); } });
assert.strictEqual(disabled.instance.chooseFile(), false);
assert.strictEqual(disabled.events.length, 0);
const full = create({ defaultFiles: [{ path: '/tmp/a.png' }], max: 1 }, { chooseMedia() { throw new Error('must not open'); } });
assert.strictEqual(full.instance.chooseFile(), false);
assert.deepStrictEqual(names(full), ['reject']);
assert.strictEqual(full.events[0].detail.rejectedFiles[0].reason, 'max');

let previewCall = '';
const platformPreview = create({ defaultFiles: [
  { path: '/tmp/a.png' }, { path: '/tmp/a.mp4' }, { path: '/tmp/a.pdf' }, { path: 'https://example.com/a.pdf' },
] }, {
  previewImage() { previewCall = 'image'; },
  previewMedia() { previewCall = 'video'; },
  openDocument() { previewCall = 'document'; },
});
assert.strictEqual(platformPreview.instance.previewFile(target(0)), true);
assert.strictEqual(previewCall, 'image');
assert.strictEqual(platformPreview.instance.previewFile(target(1)), true);
assert.strictEqual(previewCall, 'video');
assert.strictEqual(platformPreview.instance.previewFile(target(2)), true);
assert.strictEqual(previewCall, 'document');
assert.strictEqual(platformPreview.instance.previewFile(target(3)), true);
assert.deepStrictEqual(names(platformPreview).slice(-2), ['preview', 'error'], 'unsupported remote document never fakes preview success');

const reduced = create({ reduceMotion: true, max: false, columns: false, theme: 'invalid' });
assert.strictEqual(reduced.instance.data.normalizedMax, 9);
assert.strictEqual(reduced.instance.data.normalizedColumns, 3);
assert.strictEqual(reduced.instance.data.displayTheme, 'list');
assert(reduced.instance.data.rootStyle.includes('1ms'));

assert(!/<button\b|<image\b/.test(wxml), 'Upload WXML composes PUI controls and image');
assert(!wxml.includes('<pui-empty') && !wxml.includes('<pui-loading'), 'Upload owns no consumer-level state surface');
assert(wxml.includes('<slot name="add"') && wxml.includes('<pui-progress') && wxml.includes('<pui-tag'));
assert(wxml.includes("wx:if=\"{{item.status !== 'error'}}\""), 'error state must replace the duplicate status Tag with one inline failure region');
assert(wxml.includes("wx:if=\"{{item.status === 'uploading' || item.status === 'paused'}}\""), 'error state must not render a meaningless progress bar');
assert(wxml.includes('content="重试"') && wxml.includes('theme="default"') && wxml.includes('variant="base"'), 'retry must be a visible neutral recovery action');
assert(wxml.includes('custom-style="width:120rpx;min-width:120rpx;max-width:120rpx;padding:0;"'), 'retry Button root must remain inside its compact component-host track');
assert.deepStrictEqual(Object.keys(json.usingComponents).sort(), ['pui-button', 'pui-icon', 'pui-image', 'pui-progress', 'pui-tag']);
assert(wxss.includes('var(--pui-upload-duration)') && wxss.includes('--pui-upload-columns'));
assert(wxss.includes('.pui-upload__file-error') && wxss.includes('var(--pui-color-danger-light)'));
assert(wxss.includes('.pui-upload__retry-action') && wxss.includes('width: 120rpx'), 'list retry must occupy one compact right-side track');
assert(!wxss.includes('.pui-upload__file--error') && !wxss.includes('.pui-upload__file--success'), 'status must not recolor the whole file Surface boundary');

for (const removed of ['choose-start', 'choose-end', "triggerEvent('input'", "triggerEvent('clear'", "triggerEvent('exceed'", 'retryState', 'getFiles: function', 'clear: function']) {
  assert(!source.includes(removed), `legacy Upload surface must stay removed: ${removed}`);
}
for (const title of ['基础用法', '网格与媒体', '文件状态', '限制与禁用']) assert(preview.includes(`<h3>${title}</h3>`));
const uploadUsageStart = preview.indexOf("if (runtimeId === 'upload')");
const uploadUsageEnd = preview.indexOf("if (runtimeId === 'badge')", uploadUsageStart);
const uploadUsage = preview.slice(uploadUsageStart, uploadUsageEnd);
assert(uploadUsage.includes('<pui-upload${attrs ? ` ${attrs}` : \'\'}>') && !uploadUsage.includes('bind:'), 'basic WXML stays minimal and has no bind:*');
assert(preview.includes('function uploadPreviewMarkup') && preview.includes('data-demo-action="upload-input"'));
assert(preview.includes("customClass: 'pui-upload-preview__add-button'") && preview.includes("icon: props.customAdd ? 'add-circle' : 'attachment'"), 'H5 add trigger must compose the shared PUI Button mirror');
assert(preview.includes("customClass: 'pui-upload-preview__retry'") && preview.includes("content: '重试'"), 'H5 retry must mirror the visible PUI Button action');
assert(preview.includes("['uploading', 'paused'].includes(file.status)") && preview.includes('pui-upload-preview__error'), 'H5 error state must use one failure region without progress');
assert(preview.includes('aria-label="${escapeHtml(props.addContent || \'添加附件\')}"') && preview.includes('ariaHidden: true') && preview.includes('tabIndex: -1'), 'file input must own the single accessible action while the PUI Button remains the visual mirror');
assert(preview.includes("addBtn: false, ariaLabel: '受限文件选择'"), 'static comparison samples must not retain fake file inputs');
assert(preview.includes("if (key === 'defaultFiles' && !Array.isArray(getProps(state.current).files))"), 'non-controlled files sentinels must preserve the current H5 list');
for (const apiType of ["apiType: 'Array | null'", "apiType: 'Array'", "apiType: 'number'"]) assert(preview.includes(apiType), `Upload API must expose ${apiType}`);
assert(metadata.includes("upload: ['files', 'defaultFiles', 'max', 'picker', 'mediaType', 'messageType', 'source', 'extensions', 'maxSize', 'addContent', 'addBtn', 'theme', 'columns', 'allowDuplicate', 'preview', 'removeBtn', 'customAdd', 'disabled', 'ariaLabel', 'reduceMotion']"));
assert(metadata.includes("{ name: 'retry', detail: '{ file, index, files, source: \"file\" }'"));
assert(metadata.includes("{ name: 'add', description: 'customAdd=true"));
assert(api.includes('### Upload：TDesign 对照后的 20 Props') && api.includes('Upload 不公开实例方法'));
assert(contract.includes('Events 固定为 `change/add/remove/preview/retry/cancel/reject/error`'));

process.stdout.write('Upload contract tests passed.\n');
