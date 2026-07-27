const fs = require('fs');
const path = require('path');
const {
  createCatalogMarkdown,
  createMatrixMarkdown,
  createPreviewSource,
  createShadcnCompatibilityMarkdown,
  root,
} = require('./catalog-utils');
const { createEntrySource } = require('./generate-entry');

const outputs = [
  ['preview/components-data.js', createPreviewSource()],
  ['docs/COMPONENT_CATALOG.md', createCatalogMarkdown()],
  ['docs/COMPONENT_MATRIX.md', createMatrixMarkdown()],
  ['docs/SHADCN_COMPATIBILITY.md', createShadcnCompatibilityMarkdown()],
  ['index.js', createEntrySource()],
];

for (const [relativePath, content] of outputs) {
  fs.writeFileSync(path.join(root, relativePath), content);
}

console.log(`Generated ${outputs.length} catalog artifacts.`);
