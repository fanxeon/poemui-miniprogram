const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const metadata = require(path.join(root, 'metadata/components.js'));
const previewJs = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewCss = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
const designContract = fs.readFileSync(path.join(root, 'docs/UI_DESIGN_CONTRACT.md'), 'utf8');
const buttonContract = fs.readFileSync(path.join(root, 'docs/components/BUTTON.md'), 'utf8');
const directionContract = fs.readFileSync(path.join(root, 'docs/components/DIRECTION.md'), 'utf8');

assert.strictEqual(metadata.packageComponents.length, metadata.releaseComponentIds.size, 'the package catalog must retain every component in the current reviewed release set');
assert(previewJs.includes('const previewContract = props.previewContract !== false;'), 'the shared H5 Button helper mirrors Button by default');
assert(previewJs.includes("previewContract ? 'pui-button-preview' : ''"), 'the H5 Button escape hatch remains explicit and auditable');
assert(previewJs.includes('pui-direction-preview__actions pui-preview-elevation-clearance'), 'Direction action rows reserve lower Button elevation clearance');
assert(previewJs.includes('pui-direction-preview__methods pui-preview-elevation-clearance'), 'Direction method rows reserve lower Button elevation clearance');

const directionRootStart = previewCss.indexOf('.pui-direction-preview {');
const directionVariantStart = previewCss.indexOf('.pui-direction-preview--block', directionRootStart);
const directionRoot = previewCss.slice(directionRootStart, directionVariantStart);
const directionSlotStart = previewCss.indexOf('.pui-direction-preview__slot {');
const directionCopyStart = previewCss.indexOf('.pui-direction-preview__copy', directionSlotStart);
const directionSlot = previewCss.slice(directionSlotStart, directionCopyStart);
assert(directionRootStart >= 0 && directionVariantStart > directionRootStart, 'Direction root styles exist');
assert(directionRoot.includes('overflow: visible;'), 'Direction root is not a clipping surface');
assert(directionRoot.includes('padding: 0;'), 'Direction root does not invent component padding');
assert(directionRoot.includes('background: transparent;'), 'Direction root remains transparent');
assert(directionRoot.includes('border: 0;'), 'Direction root does not invent a border');
assert(directionRoot.includes('box-shadow: none;'), 'Direction root has no independent elevation');
assert(directionSlot.includes('overflow: visible;'), 'Direction slot preserves descendant elevation visibility');
assert(previewCss.includes('.pui-preview-elevation-clearance { padding-block-end: var(--pui-preview-shadow-bleed); }'), 'elevation clearance uses the shared PreviewDevice shadow-bleed token');

for (const document of [agents, designContract, buttonContract, directionContract]) {
  assert(document.includes('pui-preview-elevation-clearance'), 'global and component contracts document transparent composition elevation clearance');
}

process.stdout.write('Preview shadow boundary contract tests passed.\n');
