const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const preview = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const previewHtml = fs.readFileSync(path.join(root, 'preview/index.html'), 'utf8');
const previewServer = fs.readFileSync(path.join(root, 'scripts/serve-preview.js'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'common/style/theme.wxss'), 'utf8');
const utilities = fs.readFileSync(path.join(root, 'common/style/utilities.wxss'), 'utf8');
const codeFontPath = path.join(root, 'preview/assets/fonts/JetBrainsMono-Regular-v2.304.woff2');

const mirroredTokens = {
  '--pui-font-size-caption': ['24rpx', '12px'],
  '--pui-font-size-label': ['26rpx', '13px'],
  '--pui-font-size-body-small': ['26rpx', '13px'],
  '--pui-font-size-body-medium': ['28rpx', '14px'],
  '--pui-font-size-body-large': ['32rpx', '16px'],
  '--pui-font-size-title-small': ['32rpx', '16px'],
  '--pui-font-size-title-medium': ['36rpx', '18px'],
  '--pui-font-size-title-large': ['40rpx', '20px'],
  '--pui-font-size-headline': ['48rpx', '24px'],
  '--pui-font-size-display': ['64rpx', '32px'],
  '--pui-line-height-caption': ['34rpx', '17px'],
  '--pui-line-height-label': ['36rpx', '18px'],
  '--pui-line-height-body-small': ['38rpx', '19px'],
  '--pui-line-height-body-medium': ['40rpx', '20px'],
  '--pui-line-height-body-large': ['46rpx', '23px'],
  '--pui-line-height-title-small': ['46rpx', '23px'],
  '--pui-line-height-title-medium': ['50rpx', '25px'],
  '--pui-line-height-title-large': ['56rpx', '28px'],
  '--pui-line-height-headline': ['64rpx', '32px'],
  '--pui-line-height-display': ['80rpx', '40px'],
};

for (const [token, [nativeValue, h5Value]] of Object.entries(mirroredTokens)) {
  assert(theme.includes(`${token}: ${nativeValue};`), `${token} must exist in the Mini Program theme`);
  assert(preview.includes(`${token}: ${h5Value};`), `${token} must have an exact 1px≈2rpx H5 mirror`);
}

for (const [token, value] of Object.entries({
  '--pui-line-height-none': '1',
  '--pui-line-height-tight': '1.25',
  '--pui-line-height-normal': '1.5',
  '--pui-line-height-relaxed': '1.75',
})) {
  assert(theme.includes(`${token}: ${value};`), `${token} must exist in the Mini Program theme`);
  assert(preview.includes(`${token}: ${value};`), `${token} must exist in the H5 mirror`);
  assert(utilities.includes(`line-height: var(${token});`), `${token} must drive its public utility`);
}

assert(preview.includes('font-family: var(--pui-font-family-sans);'));
assert(preview.includes('font-family: var(--pui-font-family-mono)'));
const nativeMonoStack = 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
const h5MonoStack = `"PoemUI JetBrains Mono", ${nativeMonoStack}`;
assert(theme.includes(`--pui-font-family-mono: ${nativeMonoStack};`), 'Mini Program must expose the system mono fallback stack');
assert(preview.includes(`--pui-font-family-mono: ${h5MonoStack};`), 'H5 must prefer the self-hosted JetBrains Mono face');
assert(fs.existsSync(codeFontPath), 'the H5 code font asset must be self-hosted');
assert.strictEqual(fs.readFileSync(codeFontPath).subarray(0, 4).toString('ascii'), 'wOF2', 'the code font asset must be a valid WOFF2 file');
assert(preview.includes('@font-face {'));
assert(preview.includes('font-family: "PoemUI JetBrains Mono";'));
assert(preview.includes('url("./assets/fonts/JetBrainsMono-Regular-v2.304.woff2") format("woff2")'));
assert(preview.includes('font-display: swap'));
assert(previewHtml.includes('rel="preload" href="./assets/fonts/JetBrainsMono-Regular-v2.304.woff2" as="font" type="font/woff2" crossorigin'));
assert(previewServer.includes("'.woff2': 'font/woff2'"), 'the local preview server must send the font/woff2 MIME type');

for (const property of ['font-size', 'line-height', 'font-weight']) {
  const raw = [...preview.matchAll(new RegExp(`(?:^|[;{]\\s*)${property}\\s*:\\s*([0-9.]+)(px)?`, 'gm'))];
  assert.strictEqual(raw.length, 0, `preview ${property} declarations must use PUI typography tokens`);
}

const families = [...preview.matchAll(/(?:^|[;{]\s*)font-family\s*:\s*([^;}]*)/gm)].map((match) => match[1].trim());
assert(families.length > 0);
assert(families.every((value) => value === 'inherit' || value === '"PoemUI JetBrains Mono"' || value.startsWith('var(--pui-font-family-')),
  `preview font-family declarations must use PUI tokens except the single @font-face registration: ${families.filter((value) => value !== 'inherit' && value !== '"PoemUI JetBrains Mono"' && !value.startsWith('var(--pui-font-family-')).join(', ')}`);
assert.strictEqual(families.filter((value) => value === '"PoemUI JetBrains Mono"').length, 1,
  'JetBrains Mono may only be named directly in its @font-face registration');

// Retired Card Footer-closed and Swiper event diagnostics were tokenized text,
// but neither belongs in a component-only overview.
// its removal is required for H5/WXML structural parity, while every remaining
// active preview declaration still consumes a semantic font token.
assert((preview.match(/font-size:\s*var\(--pui-font-size-/g) || []).length >= 589,
  'the global typography migration must continue to cover all active preview font sizes');
assert((preview.match(/line-height:\s*var\(--pui-line-height-/g) || []).length >= 300,
  'the global typography migration must continue to cover all preview line heights');
assert((preview.match(/font-weight:\s*var\(--pui-font-weight-/g) || []).length >= 200,
  'the global typography migration must continue to cover all preview font weights');

console.log('Preview typography token contract tests passed.');
