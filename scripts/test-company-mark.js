const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'assets', 'company-mark');
const distRoot = path.join(root, 'miniprogram_dist', 'assets', 'company-mark');
const read = (name, encoding = 'utf8') => fs.readFileSync(path.join(assetRoot, name), encoding);
const generatedFiles = [
  'company-mark.svg',
  'company-mark.woff2',
  'company-mark.css',
  'company-mark.wxss',
  'company-mark.js',
  'company-mark.json',
  'company-mark-preview.svg'
];

const svg = read('company-mark.svg');
const preview = read('company-mark-preview.svg');
const css = read('company-mark.css');
const wxss = read('company-mark.wxss');
const glyph = read('company-mark.js');
const metadata = JSON.parse(read('company-mark.json'));
const woff2 = read('company-mark.woff2', null);
const iconManifest = JSON.parse(read('../icons-src/manifest.json'));

assert(svg.includes('viewBox="0 0 24 24"'));
assert(svg.includes('fill="currentColor"'));
assert(svg.includes('fill-rule="nonzero"'));
assert(!svg.includes('<image'));
assert(!svg.includes('data:image'));
assert(!svg.includes('stroke='));
assert.strictEqual((svg.match(/\bM/g) || []).length, 5, 'company mark must keep five closed silhouettes including its counter');
assert.strictEqual((svg.match(/Z/g) || []).length, 5, 'every company mark silhouette must be closed');

assert.strictEqual(metadata.name, 'company-mark');
assert.strictEqual(metadata.codepoint, 'E001');
assert.strictEqual(metadata.viewBox, '0 0 24 24');
assert.strictEqual(metadata.color, 'currentColor');
assert.strictEqual(metadata.silhouetteCount, 5);
assert.strictEqual(metadata.publicPuiIcon, false, 'company mark must remain outside the public pui-icon catalog');
assert.strictEqual(metadata.integrity.woff2Bytes, woff2.length);
assert(woff2.length > 500);
assert.strictEqual(woff2.subarray(0, 4).toString('ascii'), 'wOF2');

assert(css.includes('font-family: "PoemUI Company Mark"'));
assert(css.includes('url("./company-mark.woff2")'));
assert(css.includes('content: "\\E001"'));
assert(wxss.includes('data:font/woff2;base64,'));
assert(glyph.includes('module.exports = "\\uE001"'));
assert(preview.includes('96px'));
assert(preview.includes('56px'));
assert(preview.includes('32px'));
assert(preview.includes('20px'));
assert(preview.includes('#fafafa'));
assert(preview.includes('#09090b'));

assert(!iconManifest.icons.some((icon) => icon.name === 'company-mark'), 'company mark must not silently become a public pui-icon name');

if (fs.existsSync(distRoot)) {
  generatedFiles.forEach((name) => {
    const source = fs.readFileSync(path.join(assetRoot, name));
    const published = fs.readFileSync(path.join(distRoot, name));
    assert(source.equals(published), `miniprogram_dist company mark mirror is stale: ${name}`);
  });
}

console.log(`Standalone company mark contract passed: ${woff2.length} byte WOFF2.`);
