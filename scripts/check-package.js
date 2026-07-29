const fs = require('fs');
const path = require('path');
const {
  createCatalogMarkdown,
  createMatrixMarkdown,
  createPreviewSource,
  createShadcnCompatibilityMarkdown,
  getEntries,
  getPublicProps,
  metadata,
  readComponentProperties,
} = require('./catalog-utils');
const { createEntrySource } = require('./generate-entry');
const { createDistEntrySource } = require('./generate-miniprogram-dist');

const root = path.resolve(__dirname, '..');
const components = metadata.packageComponents;
const requiredRootFiles = [
  'package.json',
  'index.js',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'README.md',
  'CHANGELOG.md',
  'common/style/theme.wxss',
  'common/style/utilities.wxss',
  'common/utils/visual-config.js',
  'theme/utilities.wxss',
  'docs/COMPONENT_MATRIX.md',
  'docs/COMPONENT_API.md',
  'docs/COMPONENT_STARTER_USAGE.md',
  'docs/COMPONENT_DEVELOPMENT_PROGRESS.md',
  'docs/COMPONENT_CATALOG.md',
  'docs/STYLE_UTILITIES.md',
  'docs/TYPOGRAPHY.md',
  'docs/SPACING.md',
  'docs/ICONS.md',
  'docs/H5_PREVIEW_COMPATIBILITY.md',
  'docs/SHADCN_COMPATIBILITY.md',
  'metadata/shadcn.js',
  'assets/icons-src/manifest.json',
  'icon/icon-font-map.js',
  'icon/icon-font-catalog.js',
  'icon/icon-font.wxss',
  'preview/index.html',
  'preview/icon-font.css',
  'preview/styles.css',
  'preview/app.js',
  'preview/components-data.js',
  'preview/icons-data.js',
  'metadata/components.js',
  'metadata/component-starter-usage.js',
  'scripts/catalog-utils.js',
  'scripts/generate-catalog.js',
  'scripts/generate-entry.js',
  'scripts/generate-miniprogram-dist.js',
  'scripts/prepare-example.js',
  'scripts/generate-shadcn-components.js',
  'scripts/serve-preview.js',
  '_example/project.config.json',
  '_example/package.json',
  '_example/miniprogram/app.json',
  '_example/miniprogram/pages/index/index.js',
  '_example/miniprogram/pages/index/index.json',
  '_example/miniprogram/pages/index/index.wxml',
  '_example/miniprogram/pages/index/index.wxss',
  '_example/miniprogram/pages/components/index.js',
  '_example/miniprogram/pages/components/index.json',
  '_example/miniprogram/pages/components/index.wxml',
  '_example/miniprogram/pages/components/index.wxss',
];
const missing = [];

for (const file of requiredRootFiles) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) {
    missing.push(file);
  }
}

for (const component of components) {
  for (const ext of ['json', 'wxml', 'wxss', 'js']) {
    const file = `${component}/${component}.${ext}`;
    const target = path.join(root, file);
    if (!fs.existsSync(target)) {
      missing.push(file);
    }
    const distFile = path.join(root, 'miniprogram_dist', file);
    if (!fs.existsSync(distFile)) {
      missing.push(`miniprogram_dist/${file}`);
    }
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const requiredPackageFiles = ['miniprogram_dist', 'README.md', 'CHANGELOG.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md'];

for (const file of requiredPackageFiles) {
  if (!packageJson.files || !packageJson.files.includes(file)) {
    missing.push(`package.json files[] -> ${file}`);
  }
}

if (packageJson.miniprogram !== 'miniprogram_dist') {
  missing.push('package.json miniprogram -> miniprogram_dist');
}

if (packageJson.main !== 'miniprogram_dist/index.js') {
  missing.push('package.json main -> miniprogram_dist/index.js');
}

const packageEntry = fs.readFileSync(path.join(root, 'index.js'), 'utf8');
if (packageEntry !== createEntrySource()) {
  missing.push('index.js is stale. Run npm run site:build');
}

const distEntryPath = path.join(root, 'miniprogram_dist', 'index.js');
if (!fs.existsSync(distEntryPath) || fs.readFileSync(distEntryPath, 'utf8') !== createDistEntrySource(packageEntry)) {
  missing.push('miniprogram_dist/index.js is stale. Run npm run miniprogram:build');
}

const examplePackage = JSON.parse(fs.readFileSync(path.join(root, '_example/package.json'), 'utf8'));
if (!examplePackage.dependencies || examplePackage.dependencies['poemui-miniprogram'] !== 'file:..') {
  missing.push('_example/package.json dependency poemui-miniprogram -> file:..');
}

const exampleApp = JSON.parse(fs.readFileSync(path.join(root, '_example/miniprogram/app.json'), 'utf8'));
for (const page of ['pages/index/index', 'pages/components/index']) {
  if (!Array.isArray(exampleApp.pages) || !exampleApp.pages.includes(page)) {
    missing.push(`_example/miniprogram/app.json pages[] -> ${page}`);
  }
}

if (!packageJson.publishConfig || packageJson.publishConfig.access !== 'public') {
  missing.push('package.json publishConfig.access -> public');
}

if (packageJson.files && packageJson.files.includes('docs')) {
  missing.push('package.json files[] must not include docs; docs are deployed with the site.');
}

if (missing.length) {
  console.error('PoemUI package check failed. Missing files:');
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

const entries = getEntries();
const entryIds = entries.map((entry) => entry.id);
if (new Set(entryIds).size !== entryIds.length) {
  console.error('PoemUI metadata check failed. Duplicate catalog entry id found.');
  process.exit(1);
}

if (components.length !== metadata.releaseComponentIds.size) {
  console.error(`PoemUI metadata check failed. Package component count ${components.length} does not match release set ${metadata.releaseComponentIds.size}.`);
  process.exit(1);
}

for (const component of components) {
  const declared = new Set([
    ...readComponentProperties(component),
    'customClass',
    'customStyle',
    'colorScheme',
  ]);
  for (const prop of getPublicProps(component)) {
    if (!declared.has(prop)) {
      console.error(`PoemUI metadata check failed. ${component}.${prop} is documented but is not declared in properties.`);
      process.exit(1);
    }
  }
}

const generatedArtifacts = [
  ['preview/components-data.js', createPreviewSource()],
  ['docs/COMPONENT_CATALOG.md', createCatalogMarkdown()],
  ['docs/COMPONENT_MATRIX.md', createMatrixMarkdown()],
  ['docs/SHADCN_COMPATIBILITY.md', createShadcnCompatibilityMarkdown()],
];

for (const [file, expected] of generatedArtifacts) {
  const actual = fs.readFileSync(path.join(root, file), 'utf8');
  if (actual !== expected) {
    console.error(`PoemUI metadata check failed. ${file} is stale. Run npm run site:build.`);
    process.exit(1);
  }
}

const previewFiles = ['preview/index.html', 'preview/styles.css', 'preview/app.js'];
const forbiddenPreviewPatterns = [
  { pattern: /wx:/, message: 'H5 preview must not use wx:* directives.' },
  { pattern: /bindtap/, message: 'H5 preview must not use bindtap.' },
];

for (const file of previewFiles) {
  const target = path.join(root, file);
  const content = fs.readFileSync(target, 'utf8');
  for (const rule of forbiddenPreviewPatterns) {
    if (rule.pattern.test(content)) {
      console.error(`${rule.message} Found in ${file}.`);
      process.exit(1);
    }
  }
}

const previewCss = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
if (/\brpx\b/.test(previewCss)) {
  console.error('H5 preview CSS must not use rpx. Use px as the browser mirror unit.');
  process.exit(1);
}

const iconManifestPath = path.join(root, 'assets/icons-src/manifest.json');
const iconManifest = JSON.parse(fs.readFileSync(iconManifestPath, 'utf8'));
const iconFontMap = require(path.join(root, 'icon', 'icon-font-map'));
const iconFontCatalog = require(path.join(root, 'icon', 'icon-font-catalog'));
const iconFiles = [];

function collectSvgFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSvgFiles(target);
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      iconFiles.push(path.relative(path.join(root, 'assets/icons-src'), target).replace(/\\/g, '/'));
    }
  }
}

collectSvgFiles(path.join(root, 'assets/icons-src'));

const manifestPaths = iconManifest.icons.map((icon) => icon.path).sort();
const diskPaths = iconFiles.sort();

if (iconManifest.categories.length !== 17 || iconManifest.icons.length !== 220 || diskPaths.length !== 220) {
  console.error('PoemUI icon check failed. Expected 17 categories and 220 SVG icons.');
  console.error(`- categories: ${iconManifest.categories.length}`);
  console.error(`- manifest icons: ${iconManifest.icons.length}`);
  console.error(`- svg files: ${diskPaths.length}`);
  process.exit(1);
}

const componentIconNames = [
  'button', 'divider', 'icon', 'popup', 'popover', 'sheet', 'action-sheet',
  'dropdown-menu', 'overlay', 'badge', 'cell', 'swipe-cell', 'scroll-area', 'dialog',
];
const componentCategory = iconManifest.categories.find((category) => category.key === 'components');
if (!componentCategory || componentCategory.label !== 'Components 组件' || componentCategory.count !== componentIconNames.length
  || JSON.stringify(iconManifest.icons.filter((icon) => icon.category === 'components').map((icon) => icon.name)) !== JSON.stringify(componentIconNames)) {
  console.error('PoemUI icon check failed. Components category must contain the 14 published component icons in stable order.');
  process.exit(1);
}

if (JSON.stringify(manifestPaths) !== JSON.stringify(diskPaths)) {
  console.error('PoemUI icon check failed. manifest paths do not match SVG files.');
  process.exit(1);
}

if (
  Object.keys(iconFontMap).length !== iconManifest.icons.length
  || iconManifest.icons.some((icon) => !iconFontMap[icon.name])
  || iconFontCatalog.icons.length !== iconManifest.icons.length
  || iconManifest.icons.some((icon, index) => {
    const catalogItem = iconFontCatalog.icons[index];
    return !catalogItem
      || catalogItem.name !== icon.name
      || catalogItem.category !== icon.category
      || catalogItem.source !== icon.source
      || catalogItem.codepoint !== icon.codepoint;
  })
) {
  console.error('PoemUI icon check failed. Icon Font map or catalog is stale. Run npm run icons:generate.');
  process.exit(1);
}

if (fs.readFileSync(path.join(root, 'icon', 'icon-font.wxss'), 'utf8') !== fs.readFileSync(path.join(root, 'preview', 'icon-font.css'), 'utf8')) {
  console.error('PoemUI icon check failed. H5 and Mini Program must consume the same generated Icon Font CSS.');
  process.exit(1);
}

if (
  iconManifest.style.name !== 'PoemUI Roundline'
  || iconManifest.upstream?.name !== 'Lucide'
  || iconManifest.upstream?.version !== packageJson.devDependencies?.['lucide-static']?.replace(/^[^\d]*/, '')
  || iconManifest.icons.some((icon) => !icon.source)
) {
  console.error('PoemUI icon check failed. Lucide source metadata is missing or stale.');
  process.exit(1);
}

for (const icon of iconManifest.icons) {
  const svg = fs.readFileSync(path.join(root, 'assets/icons-src', icon.path), 'utf8');
  const isCustom = iconManifest.custom?.icons?.includes(icon.name);
  const attributionValid = isCustom
    ? svg.includes('User-owned PoemCoder mark; generated by scripts/generate-icons.js.')
    : svg.includes(`Derived from Lucide ${icon.source}`);
  const stylingValid = isCustom
    ? svg.includes('fill="currentColor"') && svg.includes('stroke="none"')
    : svg.includes('stroke-width="2.15"');
  if (!attributionValid || !stylingValid) {
    console.error(`PoemUI icon check failed. ${icon.path} is missing source attribution or Roundline styling.`);
    process.exit(1);
  }
}

console.log('PoemUI package check passed.');
