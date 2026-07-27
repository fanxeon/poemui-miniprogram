const fs = require('fs');
const path = require('path');
const { packageComponents } = require('../metadata/components');

const root = path.resolve(__dirname, '..');
const layoutProperties = /(^|[;{])(\s*)(padding(?:-(?:top|right|bottom|left))?|gap|row-gap|column-gap|margin(?:-(?:top|right|bottom|left))?|top|right|bottom|left|inset(?:-(?:block|inline)(?:-(?:start|end))?)?|border(?:-(?:top|bottom)-(?:left|right))?-radius)(\s*:\s*)([^;}]+)/gm;

const runtimeSemanticSpace = new Map([
  [4, '--pui-space-xxs'],
  [8, '--pui-space-xs'],
  [12, '--pui-space-sm'],
  [16, '--pui-content-gap'],
  [20, '--pui-space-normal'],
  [28, '--pui-space-lg'],
  [36, '--pui-panel-padding-spacious'],
  [40, '--pui-space-xl'],
  [56, '--pui-space-xxl'],
  [72, '--pui-space-3xl'],
]);

const previewSemanticSpace = new Map([
  [2, '--pui-preview-space-xxs'],
  [4, '--pui-preview-space-xs'],
  [6, '--pui-preview-space-sm'],
  [8, '--pui-preview-content-gap'],
  [10, '--pui-preview-space-normal'],
  [14, '--pui-preview-space-lg'],
  [18, '--pui-preview-panel-padding-spacious'],
  [20, '--pui-preview-space-xl'],
  [28, '--pui-preview-space-xxl'],
  [36, '--pui-preview-space-3xl'],
]);

const runtimeRadius = new Map([
  [12, '--pui-radius-small'],
  [16, '--pui-radius-medium'],
  [24, '--pui-radius-large'],
  [32, '--pui-radius-xlarge'],
  [40, '--pui-radius-xxlarge'],
]);

const previewRadius = new Map([
  [6, '--pui-preview-radius-small'],
  [8, '--pui-preview-radius-medium'],
  [12, '--pui-preview-radius-large'],
  [16, '--pui-preview-radius-xlarge'],
  [20, '--pui-preview-radius-xxlarge'],
]);

function runtimeSpaceToken(raw) {
  let value = Number(raw);
  if (value === 7) value = 8;
  if (value === 9) value = 10;
  if (value > 0 && value % 2 !== 0) value += 1;
  if (value <= 0 || value % 2 !== 0 || value > 72) return null;
  return runtimeSemanticSpace.get(value) || `--pui-space-step-${value / 2}`;
}

function previewSpaceToken(raw) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) return null;
  return previewSemanticSpace.get(value) || `--pui-preview-space-step-${value}`;
}

function migrateLayoutDeclarations(css, mode) {
  return css.replace(layoutProperties, (full, lead, indent, property, colon, rawValue) => {
    let value = rawValue;
    if (property.includes('radius')) {
      if (mode === 'runtime') {
        value = value.replace(/999rpx/g, 'var(--pui-radius-round)').replace(/50%/g, 'var(--pui-radius-round)');
        value = value.replace(/(?<![-\w])(\d+)rpx/g, (match, raw) => {
          const token = runtimeRadius.get(Number(raw));
          return token ? `var(${token})` : match;
        });
      } else {
        value = value.replace(/999px/g, 'var(--pui-preview-radius-round)').replace(/50%/g, 'var(--pui-preview-radius-round)');
        value = value.replace(/(?<![-\w])(\d+(?:\.\d+)?)px/g, (match, raw) => {
          const number = Number(raw);
          if (!Number.isInteger(number) || number <= 0) return match;
          const token = previewRadius.get(number) || `--pui-preview-radius-step-${number}`;
          return `var(${token})`;
        });
      }
    } else if (mode === 'runtime') {
      value = value.replace(/(?<![-\w])-(\d+)rpx/g, (match, raw) => {
        const token = runtimeSpaceToken(raw);
        return token ? `calc(0rpx - var(${token}))` : match;
      });
      value = value.replace(/(?<![-\w])(\d+)rpx/g, (match, raw) => {
        const token = runtimeSpaceToken(raw);
        return token ? `var(${token})` : match;
      });
    } else {
      value = value.replace(/(?<![-\w])-(\d+(?:\.\d+)?)px/g, (match, raw) => {
        const token = previewSpaceToken(raw);
        return token ? `calc(0px - var(${token}))` : match;
      });
      value = value.replace(/(?<![-\w])(\d+(?:\.\d+)?)px/g, (match, raw) => {
        const token = previewSpaceToken(raw);
        return token ? `var(${token})` : match;
      });
    }
    return `${lead}${indent}${property}${colon}${value}`;
  });
}

function writeIfChanged(file, next) {
  const current = fs.readFileSync(file, 'utf8');
  if (current === next) return false;
  fs.writeFileSync(file, next);
  return true;
}

let runtimeChanged = 0;
for (const component of packageComponents) {
  const file = path.join(root, component, `${component}.wxss`);
  const source = fs.readFileSync(file, 'utf8');
  let next = source
    .replace(/--pui-spacing-xxs/g, '--pui-space-xxs')
    .replace(/--pui-spacing-xs/g, '--pui-space-xs')
    .replace(/--pui-spacing-sm/g, '--pui-space-sm');
  next = migrateLayoutDeclarations(next, 'runtime');
  next = next.replace(/(--pui-[a-z0-9-]*(?:gap|padding|margin)[a-z0-9-]*\s*:\s*)(\d+)rpx/gi, (match, prefix, raw) => {
    if (Number(raw) === 0) return `${prefix}0`;
    const token = runtimeSpaceToken(raw);
    return token ? `${prefix}var(${token})` : match;
  });
  if (writeIfChanged(file, next)) runtimeChanged += 1;
}

let generatorChanged = 0;
for (const relativeFile of ['scripts/generate-shadcn-components.js', 'scripts/generate-components.js']) {
  const file = path.join(root, relativeFile);
  const source = fs.readFileSync(file, 'utf8');
  let next = source
    .replace(/--pui-spacing-xxs/g, '--pui-space-xxs')
    .replace(/--pui-spacing-xs/g, '--pui-space-xs')
    .replace(/--pui-spacing-sm/g, '--pui-space-sm');
  next = migrateLayoutDeclarations(next, 'runtime');
  next = next.replace(/(--pui-[a-z0-9-]*(?:gap|padding|margin)[a-z0-9-]*\s*:\s*)(\d+)rpx/gi, (match, prefix, raw) => {
    if (Number(raw) === 0) return `${prefix}0`;
    const token = runtimeSpaceToken(raw);
    return token ? `${prefix}var(${token})` : match;
  });
  if (writeIfChanged(file, next)) generatorChanged += 1;
}

const previewFile = path.join(root, 'preview/styles.css');
let previewCss = fs.readFileSync(previewFile, 'utf8');
previewCss = previewCss.replace(
  /\/\* Layout rhythm contract:[\s\S]*?\*\/\s*:root\s*\{(?:\s*--pui-space-[1-7]:\s*[^;]+;){7}\s*\}/,
  '/* Layout rhythm is inherited from the shared PUI preview tokens. */',
);
previewCss = previewCss
  .replace(/--preview-radius-/g, '--pui-preview-radius-')
  .replace(/--radius-panel\b/g, '--pui-preview-radius-card')
  .replace(/--radius-medium\b/g, '--pui-preview-radius-medium')
  .replace(/--radius-small\b/g, '--pui-preview-radius-small')
  .replace(/--radius-control\b/g, '--pui-preview-radius-control')
  .replace(/--radius-sm\b/g, '--pui-preview-radius-small')
  .replace(/--radius-md\b/g, '--pui-preview-radius-medium')
  .replace(/--radius-xl\b/g, '--pui-site-radius-popup')
  .replace(/--radius-large\b/g, '--pui-site-radius-surface')
  .replace(/--radius\b/g, '--pui-site-radius-control')
  .replace(/--preview-gap\b/g, '--pui-preview-shell-gap');

const legacyPreviewSpace = new Map([
  [1, '--pui-preview-space-xs'],
  [2, '--pui-preview-content-gap'],
  [3, '--pui-preview-space-step-12'],
  [4, '--pui-preview-space-step-16'],
  [5, '--pui-preview-space-xl'],
  [6, '--pui-preview-space-step-24'],
  [7, '--pui-preview-space-step-32'],
]);
previewCss = previewCss.replace(/--pui-space-([1-7])\b/g, (match, raw) => legacyPreviewSpace.get(Number(raw)));
previewCss = migrateLayoutDeclarations(previewCss, 'preview');
previewCss = previewCss.replace(/(--pui-(?:site|preview)-[a-z0-9-]*radius[a-z0-9-]*\s*:\s*)(\d+)px/gi, (match, prefix, raw) => {
  if (/radius-(?:step-\d+|round)\s*:\s*$/i.test(prefix)) return match;
  const number = Number(raw);
  const token = previewRadius.get(number) || `--pui-preview-radius-step-${number}`;
  return `${prefix}var(${token})`;
});
previewCss = previewCss.replace(/(--pui-[a-z0-9-]*(?:gap|padding|margin)[a-z0-9-]*\s*:\s*)(\d+)px/gi, (match, prefix, raw) => {
  const token = previewSpaceToken(raw);
  return token ? `${prefix}var(${token})` : match;
});
const previewChanged = writeIfChanged(previewFile, previewCss);

console.log(`Migrated layout tokens in ${runtimeChanged} runtime components, ${generatorChanged} generators${previewChanged ? ' and preview/styles.css' : ''}.`);
