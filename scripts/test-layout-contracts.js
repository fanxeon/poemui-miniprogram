const fs = require('fs');
const path = require('path');
const { packageComponents } = require('../metadata/components');

const root = path.resolve(__dirname, '..');
const propertyPattern = /(^|[;{])\s*(padding(?:-(?:top|right|bottom|left))?|gap|row-gap|column-gap|margin(?:-(?:top|right|bottom|left))?|top|right|bottom|left|inset(?:-(?:block|inline)(?:-(?:start|end))?)?|border(?:-(?:top|bottom)-(?:left|right))?-radius)\s*:\s*([^;}]+)/gm;
const rawMetricPattern = /(?<![-\w])-?(?:[1-9]\d*(?:\.\d+)?|0?\.\d+)(?:rpx|px)/;
const radiusPercentPattern = /50%/;
const negativeMetricPattern = /(?<![-\w])-\d+(?:\.\d+)?(?:rpx|px)/;

function fail(message) {
  console.error(`PoemUI layout contract failed: ${message}`);
  process.exit(1);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assertLayoutDeclarations(relativePath, source, tokenPrefix) {
  for (const match of source.matchAll(propertyPattern)) {
    const property = match[2];
    const value = match[3].trim();
    if (relativePath.startsWith('scripts/generate-') && value.startsWith('{')) continue;
    if (negativeMetricPattern.test(value)) {
      fail(`${relativePath} uses negative layout value in ${property}: ${value}`);
    }
    if (rawMetricPattern.test(value) || (property.includes('radius') && radiusPercentPattern.test(value))) {
      fail(`${relativePath} bypasses PUI tokens in ${property}: ${value}`);
    }
    const normalized = value.replace(/\s*!important\s*$/, '').trim();
    const zeroOrKeyword = normalized.split(/\s+/).every((part) => ['0', 'auto', 'inherit'].includes(part));
    const positionProperty = /^(?:top|right|bottom|left|inset)/.test(property);
    const intrinsicPercentage = positionProperty && normalized
      .split(/\s+/)
      .every((part) => /^(?:-?\d+(?:\.\d+)?%|0|auto|inherit)$/.test(part));
    if (!zeroOrKeyword && !intrinsicPercentage && !value.includes(`var(${tokenPrefix}`) && !value.includes('env(')) {
      fail(`${relativePath} must consume ${tokenPrefix} in ${property}: ${value}`);
    }
  }
}

const runtimeFiles = packageComponents.map((component) => `${component}/${component}.wxss`);
for (const relativePath of runtimeFiles) {
  assertLayoutDeclarations(relativePath, read(relativePath), '--pui-');
}

for (const relativePath of ['scripts/generate-shadcn-components.js', 'scripts/generate-components.js']) {
  assertLayoutDeclarations(relativePath, read(relativePath), '--pui-');
}

const previewPath = 'preview/styles.css';
const previewCss = read(previewPath);
assertLayoutDeclarations(previewPath, previewCss, '--pui-');

for (const match of previewCss.matchAll(/(--pui-[a-z0-9-]*(?:gap|padding|margin|radius)[a-z0-9-]*)\s*:\s*([^;}]+)/gi)) {
  const name = match[1];
  const value = match[2].trim();
  const primitive = /^--pui-preview-(?:space|radius)-step-\d+$/.test(name) || name === '--pui-preview-radius-round';
  if (!primitive && rawMetricPattern.test(value)) {
    fail(`${previewPath} custom layout property ${name} must alias a PUI primitive: ${value}`);
  }
}

if (/--pui-spacing-/.test(runtimeFiles.map(read).join('\n'))) {
  fail('runtime components still reference the removed --pui-spacing-* aliases');
}

function assertStepReferences(relativePath, source, definitionSource, pattern) {
  const definitions = new Set(Array.from(definitionSource.matchAll(pattern), (match) => match[1]));
  const references = new Set(Array.from(source.matchAll(/var\((--pui-(?:preview-)?(?:space|radius)-step-\d+)/g), (match) => match[1]));
  const missing = Array.from(references).filter((reference) => !definitions.has(reference));
  if (missing.length) fail(`${relativePath} references undefined layout steps: ${missing.join(', ')}`);
}

const theme = read('common/style/theme.wxss');
const runtimeSource = runtimeFiles.map(read).join('\n')
  + read('scripts/generate-shadcn-components.js')
  + read('scripts/generate-components.js');
assertStepReferences(
  'runtime components',
  runtimeSource,
  theme,
  /(--pui-(?:space|radius)-step-\d+)\s*:/g,
);
assertStepReferences(
  previewPath,
  previewCss,
  previewCss,
  /(--pui-preview-(?:space|radius)-step-\d+)\s*:/g,
);

console.log(`PoemUI layout contracts passed for ${runtimeFiles.length} components and the preview.`);
