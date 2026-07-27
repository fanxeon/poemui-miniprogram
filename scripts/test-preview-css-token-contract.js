const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'preview/index.html'), 'utf8');
const sources = `${css.replace(/\/\*[\s\S]*?\*\//g, '')}\n${app}\n${html}`;

const definitions = new Set(
  [...sources.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]),
);
for (const match of sources.matchAll(/setProperty\(\s*['"](--[a-z0-9-]+)['"]/gi)) {
  definitions.add(match[1]);
}

function hasTopLevelFallback(source, start) {
  let depth = 1;
  for (let index = start; index < source.length && depth > 0; index += 1) {
    const character = source[index];
    if (character === '(') depth += 1;
    else if (character === ')') depth -= 1;
    else if (character === ',' && depth === 1) return true;
  }
  return false;
}

const unresolved = [];
for (const match of css.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
  const token = match[1];
  const fallbackStart = match.index + match[0].length;
  if (!definitions.has(token) && !hasTopLevelFallback(css, fallbackStart)) {
    unresolved.push({ token, index: match.index });
  }
}

assert.deepStrictEqual(
  [...new Set(unresolved.map((entry) => entry.token))],
  [],
  `preview CSS contains undefined custom properties without fallbacks: ${unresolved.map((entry) => entry.token).join(', ')}`,
);

for (const retiredToken of [
  '--shadow-popup',
  '--frost-filter',
  '--text-muted',
  '--surface-muted',
  '--surface-hover',
  '--accent',
  '--pui-preview-doc-body-line',
]) {
  assert(!css.includes(`var(${retiredToken})`), `${retiredToken} must not return as an undefined H5 alias`);
}

assert(css.includes('.pui-upload-preview__progress > span { position: absolute; left: 0; height: 4px; background: var(--brand);'));
assert(css.includes('.pui-table-preview__row.is-clickable:not(.is-disabled):active { background: var(--brand-soft); }'));
assert(css.includes('line-height: var(--pui-preview-doc-body-line-height);'));
assert((css.match(/box-shadow:\s*var\(--shadow\);/g) || []).length >= 3,
  'floating H5 surfaces must use the defined popup-level shadow token');
assert((css.match(/backdrop-filter:\s*var\(--blur\);/g) || []).length >= 35,
  'frosted H5 surfaces must use the defined global blur token');

console.log('Preview CSS custom-property contract tests passed.');
