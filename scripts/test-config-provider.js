const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const storePath = path.join(root, 'common/utils/visual-config.js');

let savedValue = null;
let storageReadError = null;
global.wx = {
  getStorageSync(key) {
    assert.strictEqual(key, 'poemui-visual-config');
    if (storageReadError) throw storageReadError;
    return savedValue;
  },
  setStorageSync(key, value) {
    assert.strictEqual(key, 'poemui-visual-config');
    savedValue = value;
  },
};

delete require.cache[require.resolve(storePath)];
const visualConfig = require(storePath);

assert.deepStrictEqual(visualConfig.get(), {
  theme: 'light',
  effectsEnabled: true,
  shadow: true,
  frostedGlass: false,
  largeRadius: true,
  bordered: false,
  equalSpacing: false,
});

const notifications = [];
const unsubscribe = visualConfig.subscribe((next, meta) => notifications.push({ next, meta }));
assert.strictEqual(notifications.length, 1);

const firstLaunchRestore = visualConfig.restore({ force: true });
assert.strictEqual(firstLaunchRestore.restored, true, '首次无本地配置时也必须完成恢复路径');
assert.deepStrictEqual(firstLaunchRestore.config, visualConfig.defaults, '首次无本地配置必须使用公开默认外观');

let result = visualConfig.set({ theme: 'dark', shadow: true, bordered: false, equalSpacing: true, unknown: true });
assert.strictEqual(result.changed, true);
assert.strictEqual(result.persisted, true);
assert.strictEqual(result.error, null);
assert.strictEqual(savedValue.version, 1);
assert.strictEqual(savedValue.config.theme, 'dark');
assert.strictEqual(savedValue.config.unknown, undefined);
assert.strictEqual(visualConfig.getEffective().shadow, true);
assert.strictEqual(visualConfig.getEffective().bordered, false);
assert.strictEqual(visualConfig.getEffective().equalSpacing, true, 'equal spacing must be independent from effects');

result = visualConfig.setEffectsEnabled(false);
assert.strictEqual(result.config.shadow, true, 'master switch must preserve the stored single-effect choice');
assert.strictEqual(visualConfig.getEffective().shadow, false, 'master switch must pause decorative effects');
assert.strictEqual(visualConfig.getEffective().theme, 'dark', 'master switch must not disable theme');
assert.strictEqual(visualConfig.getEffective().bordered, false, 'component border remains independent from decorative effects');

result = visualConfig.applyPreset('glass');
assert.deepStrictEqual(result.config, {
  theme: 'dark',
  effectsEnabled: true,
  shadow: true,
  frostedGlass: true,
  largeRadius: true,
  bordered: true,
  equalSpacing: true,
});

visualConfig.presets.standard.shadow = false;
result = visualConfig.applyPreset('standard');
assert.strictEqual(result.config.shadow, true, 'exported preset snapshots must not mutate the internal preset contract');

const invalidPreset = visualConfig.applyPreset('unknown');
assert(invalidPreset.error instanceof Error);
assert.strictEqual(invalidPreset.changed, false);

savedValue = {
  version: 1,
  config: { theme: 'neon', effectsEnabled: 'yes', shadow: 'yes', bordered: false },
};
const restored = visualConfig.restore({ force: true });
assert.strictEqual(restored.restored, true);
assert.strictEqual(restored.error, null);
assert.deepStrictEqual(restored.config, {
  theme: 'light',
  effectsEnabled: true,
  shadow: true,
  frostedGlass: false,
  largeRadius: true,
  bordered: false,
  equalSpacing: false,
});

storageReadError = new Error('storage unavailable');
const failedRestore = visualConfig.restore({ force: true });
assert.strictEqual(failedRestore.restored, false);
assert.strictEqual(failedRestore.error, storageReadError);
storageReadError = null;
savedValue = { version: 1, config: { theme: 'dark', bordered: true } };
const retriedRestore = visualConfig.restore();
assert.strictEqual(retriedRestore.restored, true, 'a failed storage read must remain retryable without force');
assert.strictEqual(retriedRestore.config.theme, 'dark');

unsubscribe();
const notificationCount = notifications.length;
visualConfig.set({ shadow: true });
assert.strictEqual(notifications.length, notificationCount);

const provider = read('config-provider/config-provider.js');
const theme = read('common/style/theme.wxss');
const metadata = read('metadata/components.js');
const preview = read('preview/app.js');
const previewCss = read('preview/styles.css');
const readme = read('README.md');
const entryGenerator = read('scripts/generate-entry.js');
const componentApi = read('docs/COMPONENT_API.md');
const componentContract = read('docs/components/CONFIG-PROVIDER.md');
const contractIndex = read('docs/components/README.md');
const metadataModule = require(path.join(root, 'metadata/components.js'));

for (const contract of [
  "var visualConfig = require('../common/utils/visual-config');",
  'bordered:',
  'useGlobalConfig:',
  "bordered ? 'pui-border--on' : 'pui-border--off'",
  'bindGlobalVisualConfig: function bindGlobalVisualConfig()',
  'visualConfig.restore();',
  'visualConfig.subscribe(',
  'this.unbindGlobalVisualConfig();',
  'effectsEnabled: visual.effectsEnabled',
  'emitThemeChange: function emitThemeChange(',
  'this._lastEmittedTheme === actualTheme',
  'equalSpacing:',
  'pui-spacing--equal',
]) {
  assert(provider.includes(contract), `ConfigProvider is missing ${contract}`);
}

assert(theme.includes('.pui-frosted-glass--on.pui-border--off'));
assert(/\.pui-frosted-glass--on\.pui-border--off\s*\{[^}]*--pui-border-color:\s*transparent;[^}]*--pui-border:\s*transparent;[^}]*--pui-glass-border:\s*transparent;[^}]*\}/s.test(theme));
assert(metadata.includes("{ key: 'bordered', label: 'bordered', type: 'boolean', value: true }"));
assert(metadata.includes("{ key: 'useGlobalConfig', label: 'use-global-config', type: 'boolean', value: false }"));
assert.deepStrictEqual(metadataModule.apiProps['config-provider'], ['theme', 'shadow', 'frostedGlass', 'largeRadius', 'bordered', 'equalSpacing', 'useGlobalConfig', 'customClass', 'customStyle']);
assert.deepStrictEqual(metadataModule.apiPropGroups['config-provider'].map((group) => group.keys), [
  ['theme', 'shadow', 'frostedGlass', 'largeRadius', 'bordered', 'equalSpacing'],
  ['useGlobalConfig', 'customClass', 'customStyle'],
]);
assert.strictEqual(metadataModule.apiEvents['config-provider'].length, 1);
assert.strictEqual(metadataModule.apiEvents['config-provider'][0].name, 'themechange');
assert.deepStrictEqual(metadataModule.apiSlots['config-provider'], [{ name: 'default', description: '需要继承当前主题与视觉 Token 的页面或组件子树。' }]);
assert(entryGenerator.includes("visualConfig: require('./common/utils/visual-config')"));

for (const contract of [
  'function configProviderShowcase(props)',
  'function configProviderEffectiveProps(props)',
  'data-config-provider-preview',
  "state.shadow === 'on'",
  "state.border !== 'off'",
  "['useGlobalConfig', 'customClass', 'customStyle'].includes(key)",
  '<pui-config-provider${providerAttrs',
  "compatId === 'config-provider'",
  'theme: state.theme,',
  "data-config-source=\"${props.useGlobalConfig ? 'global' : 'local'}\"",
]) {
  assert(preview.includes(contract), `ConfigProvider page is missing ${contract}`);
}
const documentationIdsSource = preview.match(/const documentationIds = new Set\(\[([\s\S]*?)\]\);/);
assert(documentationIdsSource, 'documentation page id set is missing');
assert(!documentationIdsSource[1].includes("'config-provider'"), 'ConfigProvider is a real component and must use the shared 概览/API/PROP page');

assert(previewCss.includes('.pui-config-provider-preview.pui-border--off'));
assert(previewCss.includes('.pui-config-provider-preview.pui-border--off.pui-frosted-glass--on'));
assert(previewCss.includes('.pui-config-provider-preview.pui-radius--large'));
for (const contract of [
  '--preview-border: var(--glass-border);',
  '--preview-shadow-card: var(--shadow-soft);',
  '--preview-blur: var(--blur);',
  '--pui-preview-radius-card: var(--pui-site-radius-surface);',
  ':not(.pui-config-provider-preview *)',
]) {
  assert(previewCss.includes(contract), `ConfigProvider H5 token scope is missing ${contract}`);
}
assert(previewCss.includes('.pui-config-provider-demo-group + .pui-config-provider-demo-group'));
assert(componentApi.includes('### ConfigProvider Props'));
assert(componentApi.includes('### ConfigProvider Events'));
assert(componentApi.includes('只切换阴影、毛玻璃、圆角、边框或等距不会重复触发'));
assert(!componentApi.match(/基础用法[\s\S]{0,300}bind:themechange/), 'ConfigProvider basic usage must not bind events');
assert(componentContract.includes('## 12. TDesign 1.15.3 对照决定'));
assert(componentContract.includes('`globalConfig/themeVars`'));
assert(contractIndex.includes('[ConfigProvider](./CONFIG-PROVIDER.md)'));
assert(readme.includes('### 安装端全局视觉配置'));
assert(readme.includes('每个页面根使用一次 `use-global-config`'));
assert(readme.includes('全局渐变开关只控制消费者页面背景'));

let providerDefinition = null;
let storeState = {
  theme: 'dark', effectsEnabled: false, shadow: true, frostedGlass: true, largeRadius: true, bordered: false, equalSpacing: true,
};
const storeListeners = [];
const visualStoreStub = {
  get() { return { ...storeState }; },
  restore() { return { config: { ...storeState }, restored: true, error: null }; },
  subscribe(listener) {
    storeListeners.push(listener);
    listener({ ...storeState }, { source: 'subscribe' });
    return () => {
      const index = storeListeners.indexOf(listener);
      if (index >= 0) storeListeners.splice(index, 1);
    };
  },
};
let systemThemeHandler = null;
const runtimeWx = {
  onThemeChange(handler) { systemThemeHandler = handler; },
  offThemeChange(handler) { if (systemThemeHandler === handler) systemThemeHandler = null; },
};
vm.runInNewContext(provider, {
  Component(definition) { providerDefinition = definition; },
  require(request) {
    if (request === '../common/utils/theme') return { resolveTheme: (themeName) => (themeName === 'auto' ? 'light' : themeName === 'dark' ? 'dark' : 'light') };
    if (request === '../common/utils/visual-config') return visualStoreStub;
    throw new Error(`Unexpected ConfigProvider dependency: ${request}`);
  },
  wx: runtimeWx,
});
assert(providerDefinition, 'ConfigProvider runtime definition must be captured');

function createProviderInstance(overrides) {
  const data = {
    theme: 'light', customClass: '', customStyle: '', frostedGlass: false, shadow: false,
    largeRadius: false, bordered: true, equalSpacing: false, useGlobalConfig: false,
    actualTheme: providerDefinition.data.actualTheme,
    globalVisualConfig: providerDefinition.data.globalVisualConfig,
    rootClass: providerDefinition.data.rootClass,
    ...overrides,
  };
  const events = [];
  const instance = {
    data,
    events,
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback.call(this); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, providerDefinition.methods);
  providerDefinition.lifetimes.attached.call(instance);
  return instance;
}

const localProvider = createProviderInstance();
assert.strictEqual(localProvider.events.length, 1, 'attached must emit the initial resolved theme once');
localProvider.data.shadow = true;
localProvider.updateTheme();
assert(localProvider.data.rootClass.includes('pui-shadow--on'));
assert.strictEqual(localProvider.events.length, 1, 'visual-only updates must not repeat themechange');
localProvider.data.theme = 'dark';
localProvider.updateTheme();
assert.strictEqual(localProvider.events.length, 2);
assert.strictEqual(localProvider.events[1].detail.theme, 'dark');

const globalProvider = createProviderInstance({ useGlobalConfig: true, theme: 'light', shadow: false, bordered: true });
assert(globalProvider.data.rootClass.includes('pui-theme--dark'));
assert(globalProvider.data.rootClass.includes('pui-shadow--off'), 'effectsEnabled=false must pause stored shadows');
assert(globalProvider.data.rootClass.includes('pui-border--off'), 'global bordered=false must override local bordered=true');
assert(globalProvider.data.rootClass.includes('pui-spacing--equal'), 'global equalSpacing=true must reach the Provider root');
const globalEventCount = globalProvider.events.length;
storeState = { ...storeState, effectsEnabled: true };
storeListeners.slice().forEach((listener) => listener({ ...storeState }, { source: 'set' }));
assert(globalProvider.data.rootClass.includes('pui-shadow--on'));
assert.strictEqual(globalProvider.events.length, globalEventCount, 'same-theme Store updates must not repeat themechange');
storeState = { ...storeState, theme: 'light' };
storeListeners.slice().forEach((listener) => listener({ ...storeState }, { source: 'set' }));
assert.strictEqual(globalProvider.events.at(-1).detail.theme, 'light');
providerDefinition.lifetimes.detached.call(globalProvider);
assert.strictEqual(systemThemeHandler, null);

delete global.wx;
console.log('ConfigProvider global visual configuration contract passed.');
