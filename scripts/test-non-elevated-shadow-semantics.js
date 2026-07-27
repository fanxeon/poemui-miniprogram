const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const previewStyles = read('preview/styles.css');
const avatarWxss = read('avatar/avatar.wxss');
const cellWxss = read('cell/cell.wxss');
const gridWxss = read('grid/grid.wxss');
const popupWxss = read('popup/popup.wxss');
const cardWxss = read('card/card.wxss');
const uploadWxss = read('upload/upload.wxss');
const swiperWxss = read('swiper/swiper.wxss');

const contractStart = previewStyles.indexOf('/* Non-elevated primitives never receive an outer drop shadow');
assert(contractStart >= 0, 'H5 needs an explicit non-elevated shadow contract layer');
const contractEnd = previewStyles.indexOf('@media (max-width: 900px)', contractStart);
const contractLayer = previewStyles.slice(contractStart, contractEnd);

[
  '.pui-cell',
  '.pui-cell-preview',
  '.pui-field',
  '.pui-field-preview',
  '.pui-empty',
  '.pui-result',
  '.pui-grid',
  '.pui-grid-preview',
  '.pui-steps',
  '.pui-steps-preview',
  '.pui-avatar',
  '.pui-avatar-demo',
  '.pui-progress',
  '.pui-progress-ring',
  '.pui-progress-demo',
  '.pui-badge',
  '.pui-icon',
  '.pui-divider',
  '.pui-skeleton',
].forEach((selector) => assert(contractLayer.includes(selector), `${selector} is covered by the non-elevated H5 layer`));
assert(/\{\s*box-shadow:\s*none;\s*\}/.test(contractLayer), 'non-elevated H5 layer removes outer shadows');

assert(!previewStyles.includes('[data-shadow="on"][data-page-mode] .preview-stage .pui-tag'), 'Tag cannot regain a global outer shadow');
assert(popupWxss.includes('box-shadow: var(--pui-glass-shadow)'), 'Popup Surface must consume the shared elevated shadow token');
assert(cardWxss.includes('.pui-card--shadow { box-shadow: var(--pui-shadow-card); }'), 'Card shadow prop must consume the shared elevated shadow token');
assert(uploadWxss.includes('box-shadow: var(--pui-shadow-card)'), 'Upload file Surface must consume the shared card shadow token');
assert(swiperWxss.includes('box-shadow: var(--pui-shadow-card)'), 'Swiper viewport must consume the shared card shadow token');
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-card-showcase.has-shadow {\n  box-shadow: var(--preview-shadow-card);'), 'H5 Card positive shadow path must remain explicit');
assert(previewStyles.includes('.preview-stage .pui-upload-preview__file'), 'H5 Upload file Surface must remain in the shared Surface shadow path');
assert(/\.pui-tag--outline\s*\{[^}]*box-shadow:\s*inset/.test(previewStyles), 'Tag outline keeps its inset boundary');
assert(/\.pui-cell-preview\.is-selected\s*\{[^}]*box-shadow:\s*inset 0 0 0 1px var\(--brand\);/.test(previewStyles), 'Cell selected keeps an inset state outline only');
assert(/\.pui-grid-preview\.is-bordered \.pui-grid-preview__item\s*\{[^}]*box-shadow:\s*inset -1px -1px 0 var\(--border\);/.test(previewStyles), 'Grid border keeps its inset divider');
assert(!/\.pui-avatar-demo\s*\{[^}]*box-shadow:\s*var\(--shadow-soft\)/.test(previewStyles), 'H5 Avatar demo has no outer shadow');
assert(!/\.pui-progress-ring\s*\{[^}]*box-shadow:\s*var\(--shadow-soft\)/.test(previewStyles), 'H5 Progress ring has no outer shadow');
assert(!/\.pui-progress-demo\s*\{[^}]*box-shadow:\s*var\(--shadow-soft\)/.test(previewStyles), 'H5 Progress showcase has no outer shadow');

assert(avatarWxss.includes('box-shadow: none'), 'native Avatar has no outer shadow');
assert(!avatarWxss.includes('var(--pui-glass-shadow-soft)'), 'native Avatar cannot consume the former outer shadow token');
assert(cellWxss.includes('box-shadow: inset 0 0 0 1rpx var(--pui-color-brand)'), 'native Cell selected keeps an inset state outline');
assert(gridWxss.includes('box-shadow: inset -1rpx -1rpx 0 var(--pui-border-color)'), 'native Grid bordered keeps an inset divider');

[
  'AGENTS.md',
  'docs/UI_DESIGN_CONTRACT.md',
  'docs/H5_PREVIEW_COMPATIBILITY.md',
  'docs/components/CELL.md',
  'docs/components/AVATAR.md',
  'docs/components/TAG.md',
  'docs/components/PROGRESS.md',
  'docs/components/FIELD.md',
  'docs/components/EMPTY.md',
  'docs/components/RESULT.md',
  'docs/components/GRID.md',
  'docs/components/STEPS.md',
].forEach((file) => assert(read(file).includes('外投影'), `${file} documents the outer-shadow boundary`));

console.log('Non-elevated shadow semantics tests passed.');
