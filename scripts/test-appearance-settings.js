const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'miniprogram/components/appearance-settings/appearance-settings.js'), 'utf8');
const wxml = fs.readFileSync(path.join(root, 'miniprogram/components/appearance-settings/appearance-settings.wxml'), 'utf8');

let definition;
let visualState = {
  theme: 'light', effectsEnabled: false, shadow: true, frostedGlass: false,
  largeRadius: true, bordered: false, equalSpacing: false,
};
let gradient = false;
const visualListeners = [];
const gradientListeners = [];
const visualConfig = {
  get() { return { ...visualState }; },
  restore() { return { config: this.get(), restored: true, error: null }; },
  set(patch) {
    visualState = { ...visualState, ...patch };
    visualListeners.slice().forEach((listener) => listener(this.get()));
    return { config: this.get(), changed: true, persisted: true, error: null };
  },
  subscribe(listener) {
    visualListeners.push(listener);
    listener(this.get());
    return () => {
      const index = visualListeners.indexOf(listener);
      if (index >= 0) visualListeners.splice(index, 1);
    };
  },
};
const backgroundPreference = {
  get() { return gradient; },
  restore() { return { value: gradient, restored: true, error: null }; },
  set(value) {
    gradient = Boolean(value);
    gradientListeners.slice().forEach((listener) => listener(gradient));
    return { value: gradient, changed: true, persisted: true, error: null };
  },
  subscribe(listener) {
    gradientListeners.push(listener);
    listener(gradient);
    return () => {
      const index = gradientListeners.indexOf(listener);
      if (index >= 0) gradientListeners.splice(index, 1);
    };
  },
};

vm.runInNewContext(source, {
  Component(next) { definition = next; },
  require(request) {
    if (request === 'poemui-miniprogram/common/utils/visual-config') return visualConfig;
    if (request === '../../common/utils/page-background-preference') return backgroundPreference;
    throw new Error(`Unexpected dependency: ${request}`);
  },
});
assert(definition, 'appearance-settings must register as a component');

const instance = {
  data: { ...definition.data },
  setData(patch) { Object.assign(this.data, patch); },
};
Object.assign(instance, definition.methods);
definition.lifetimes.attached.call(instance);

assert.strictEqual(visualState.effectsEnabled, true, 'hidden effects gate must migrate an old paused preference back to enabled');
assert.strictEqual(visualState.shadow, true, 'effects gate migration must preserve the stored shadow preference');
assert.strictEqual(visualState.frostedGlass, false, 'effects gate migration must preserve the stored frost preference');
assert.strictEqual(visualState.largeRadius, true, 'effects gate migration must preserve the stored radius preference');
assert.ok(wxml.indexOf('data-setting="effectsEnabled"') === -1 && wxml.indexOf('视觉效果总开关') === -1, 'appearance settings must not expose effectsEnabled');
assert.ok(wxml.indexOf('visualConfig.effectsEnabled === false') === -1, 'visible effect switches must not be disabled by a hidden gate');
instance.onAppearanceSwitchChange({ currentTarget: { dataset: { setting: 'equalSpacing' } }, detail: { checked: true } });
assert.strictEqual(visualState.equalSpacing, true, 'equalSpacing switch must write the shared Store');
assert.strictEqual(instance.data.visualConfig.equalSpacing, true, 'equalSpacing must update immediately in component state');
instance.onFruitFlavorChange({ detail: { checked: true } });
assert.strictEqual(visualState.equalSpacing, true, 'fruit preset must not overwrite equalSpacing');
instance.onAppearanceSwitchChange({ currentTarget: { dataset: { setting: 'equalSpacing' } }, detail: { checked: false } });
assert.strictEqual(visualState.equalSpacing, false, 'equalSpacing must be independently switchable after fruit preset');
instance.onFruitFlavorChange({ detail: { checked: false } });
assert.strictEqual(visualState.equalSpacing, false, 'standard preset must not invent equalSpacing');
definition.lifetimes.detached.call(instance);
assert.strictEqual(visualListeners.length, 0, 'appearance-settings must unsubscribe from visualConfig');
assert.strictEqual(gradientListeners.length, 0, 'appearance-settings must unsubscribe from canvas preference');

console.log('Appearance settings component contract tests passed.');
