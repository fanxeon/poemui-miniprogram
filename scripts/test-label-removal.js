const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const metadata = require(path.join(root, 'metadata/components'));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

assert(fs.existsSync(path.join(root, 'label/label.wxml')), 'standalone Label source directory must exist');
assert(fs.existsSync(path.join(root, 'miniprogram_dist/label/label.wxml')), 'generated mini-program output must include Label');
assert(metadata.packageComponents.includes('label'), 'Label must be exported by the npm package');
assert(metadata.releaseComponentIds.has('label'), 'Label must remain in the release set');
assert(metadata.groups.flatMap((group) => group.items).some((item) => item.packageId === 'label'), 'Label must remain a public route');

for (const [file, forbidden] of [
  ['index.js', "'label'"],
  ['metadata/components.js', "{ id: 'label', name: 'Label 标签'"],
  ['metadata/shadcn.js', "['Label', 'label'"],
  ['preview/app.js', "case 'label':"],
  ['preview/app.js', "if (id === 'label')"],
  ['preview/styles.css', '.pui-label-showcase'],
  ['preview/components-data.js', 'shadcn-label'],
  ['docs/SHADCN_COMPATIBILITY.md', '| Label | `poemui-miniprogram/label/label`'],
  ['docs/COMPONENT_MATRIX.md', '| Label | done | `poemui-miniprogram/label/label`'],
]) {
  assert(read(file).includes(forbidden), `${file} must restore the standalone Label component`);
}

console.log('Standalone Label restoration contract tests passed.');
