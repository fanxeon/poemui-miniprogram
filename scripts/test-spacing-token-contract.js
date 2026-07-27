const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const previewPath = path.join(root, 'preview/styles.css');
const preview = fs.readFileSync(previewPath, 'utf8');
const spacingDeclarationPattern = /(^|[;{])\s*(padding(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?|margin(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?|gap|row-gap|column-gap)\s*:\s*([^;}]+)/gm;
const nonZeroPxPattern = /(?<![-\w])-?(?:[1-9]\d*(?:\.\d+)?|0?\.\d+)px\b/;
const nonZeroRpxPattern = /(?<![-\w])-?(?:[1-9]\d*(?:\.\d+)?|0?\.\d+)rpx\b/;

function collectFiles(directory, extension, ignored = new Set()) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(absolutePath, extension, ignored));
    else if (entry.isFile() && entry.name.endsWith(extension)) files.push(absolutePath);
  }
  return files;
}

function matchingSpacingDeclarations(source) {
  return [...source.matchAll(spacingDeclarationPattern)].map((match) => ({
    property: match[2],
    value: match[3].trim(),
    index: match.index,
  }));
}

for (const declaration of matchingSpacingDeclarations(preview)) {
  assert(
    !nonZeroPxPattern.test(declaration.value),
    `preview/styles.css must consume PUI spacing tokens in ${declaration.property}: ${declaration.value}`,
  );
}

const ignoredDirectories = new Set([
  '.git',
  '_example',
  'miniprogram_dist',
  'miniprogram_npm',
  'node_modules',
]);
const wxssFiles = collectFiles(root, '.wxss', ignoredDirectories);
for (const absolutePath of wxssFiles) {
  const relativePath = path.relative(root, absolutePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  for (const declaration of matchingSpacingDeclarations(source)) {
    if (!nonZeroRpxPattern.test(declaration.value)) continue;
    const accessibilityClip = relativePath === 'common/style/utilities.wxss'
      && declaration.property === 'margin'
      && declaration.value === '-1rpx'
      && source.slice(0, declaration.index).lastIndexOf('.pui-sr-only')
        > source.slice(0, declaration.index).lastIndexOf('}');
    assert(
      accessibilityClip,
      `${relativePath} must consume PUI spacing tokens in ${declaration.property}: ${declaration.value}`,
    );
  }
}

for (const definition of [
  '--pui-preview-device-padding: var(--pui-preview-panel-padding);',
  '--pui-preview-shadow-bleed: var(--pui-preview-panel-padding);',
  '--pui-preview-component-layout-padding: calc(var(--pui-preview-device-padding) + var(--pui-preview-shadow-bleed));',
  '--pui-site-page-gutter: var(--pui-preview-space-step-32);',
  '--pui-site-page-gutter-mobile: var(--pui-preview-space-step-12);',
  '--pui-site-toolbar-padding-block-start: var(--pui-preview-space-step-12);',
  '--pui-site-toolbar-padding-block-end: var(--pui-preview-space-step-12);',
  '--pui-site-stage-padding-block-start: var(--pui-preview-space-xxl);',
  '--pui-site-stage-padding-block-end: var(--pui-preview-space-step-64);',
  '--pui-preview-shell-gap: var(--pui-preview-content-gap);',
  '--pui-surface-inset: var(--pui-preview-panel-padding);',
  '--pui-surface-stack-gap: var(--pui-preview-content-gap);',
  '--pui-surface-section-gap: var(--pui-preview-section-gap);',
]) {
  assert(preview.includes(definition), `preview spacing contract is missing ${definition}`);
}

assert(
  /\.preview-device\s*\{[\s\S]*?padding:\s*0;[\s\S]*?overflow:\s*hidden;[\s\S]*?\}/.test(preview),
  'PreviewDevice frame must clip the screen while delegating component padding to the inner parent layout.',
);
assert(
  /\.preview-device__component-layout--shadow-safe\s*\{[\s\S]*?padding:\s*var\(--pui-preview-component-layout-padding\);[\s\S]*?\}/.test(preview),
  'normal component previews must reserve the shared base inset plus shadow bleed inside the scrolling parent.',
);
assert(
  /\.preview-device__component-layout--edge-to-edge\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0, 1fr\);[\s\S]*?height:\s*100%;[\s\S]*?padding:\s*0;[\s\S]*?\}/.test(preview),
  'screen-attached components must use the explicit edge-to-edge parent layout.',
);
assert(
  /\.preview-device__viewport\s*\{[\s\S]*?scrollbar-gutter:\s*stable both-edges;[\s\S]*?\}/.test(preview),
  'PreviewDevice cannot reserve a permanent scrollbar gutter that shortens edge-to-edge component layouts.',
);
assert(
  /body \.app-shell\[data-page-mode\] \.preview-stage \.preview-device__component-layout\s*>\s*\.demo-section\s*\{[\s\S]*?gap:\s*var\(--pui-preview-content-gap\);[\s\S]*?margin:\s*0;[\s\S]*?\}/.test(preview),
  'PreviewDevice direct showcase roots must use an authoritative content gap and no private outer margin.',
);
assert(
  /\/\* Authoritative site layout spacing\.[\s\S]*?\.preview-toolbar\s*\{\s*padding:\s*var\(--pui-site-toolbar-padding-block-start\) var\(--pui-site-page-gutter\) var\(--pui-site-toolbar-padding-block-end\);\s*\}[\s\S]*?\.preview-stage\s*\{\s*padding:\s*var\(--pui-site-stage-padding-block-start\) var\(--pui-site-page-gutter\) var\(--pui-site-stage-padding-block-end\);\s*\}/.test(preview),
  'site toolbar and stage gutters must use dedicated site semantic tokens.',
);
assert(
  /\.app-shell \.panel\s*\{[\s\S]*?padding:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?border:\s*0;[\s\S]*?\}/.test(preview),
  'the generic panel root must remain a transparent grouping container instead of a duplicate Surface.',
);
assert(preview.includes('.app-shell[data-spacing="equal"]'), 'H5 equal spacing must be scoped to the app shell state');
assert(
  /\.component-prop-workspace \.component-prop-workspace__meta\s*>\s*div,[\s\S]*?\.component-prop-workspace \.props-panel \.prop-control,[\s\S]*?\.component-prop-workspace \.compat-item\s*\{[\s\S]*?padding:\s*var\(--pui-preview-panel-padding\);[\s\S]*?background:\s*var\(--surface-soft\);[\s\S]*?\}/.test(preview),
  'visible PROP metadata, controls and compatibility surfaces must retain shared panel padding.',
);
assert(
  /\.component-prop-workspace \.code\s*\{[\s\S]*?padding:\s*var\(--pui-preview-panel-padding-spacious\);[\s\S]*?\}/.test(preview),
  'visible PROP code surfaces must retain spacious shared panel padding.',
);

console.log(`PoemUI spacing token contract passed for preview CSS and ${wxssFiles.length} source WXSS files.`);
