const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const DEFAULT_DURATION = 500;
const MAX_DURATION = 1000;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function walk(relativePath, extensions, files = []) {
  const absolutePath = path.join(root, relativePath);
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    if (entry.name === 'miniprogram_dist' || entry.name === '_example' || entry.name === 'node_modules' || entry.name === '.git') continue;
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory()) walk(child, extensions, files);
    else if (extensions.includes(path.extname(entry.name))) files.push(child);
  }
  return files;
}

const theme = read('common/style/theme.wxss');
const previewStyles = read('preview/styles.css');
const preview = read('preview/app.js');
const contract = read('docs/UI_DESIGN_CONTRACT.md');

assert(theme.includes(`--pui-duration-fast: ${DEFAULT_DURATION}ms;`));
assert(theme.includes(`--pui-duration-normal: ${DEFAULT_DURATION}ms;`));
assert(previewStyles.includes(`--pui-duration-fast: ${DEFAULT_DURATION}ms;`));
assert(previewStyles.includes(`--pui-duration-normal: ${DEFAULT_DURATION}ms;`));
assert(contract.includes(`默认 \`${DEFAULT_DURATION}ms\``));
assert(contract.includes(`上限 \`${MAX_DURATION}ms\``));
assert(contract.includes('低动效统一压缩为 `1ms`'));

const componentDurationDefaults = {
  'alert/alert.js': 'duration',
  'aspect-ratio/aspect-ratio.js': 'duration',
  'breadcrumb/breadcrumb.js': 'duration',
  'bubble/bubble.js': 'duration',
  'card/card.js': 'duration',
  'swiper/swiper.js': 'duration',
  'cell/cell.js': 'duration',
  'collapsible/collapsible.js': 'duration',
  'combobox/combobox.js': 'duration',
  'direction/direction.js': 'duration',
  'list/list.js': 'duration',
  'loading/loading.js': 'duration',
  'navigation-menu/navigation-menu.js': 'duration',
  'overlay/overlay.js': 'duration',
  'popup/popup.js': 'duration',
  'select/select.js': 'duration',
  'sheet/sheet.js': 'duration',
  'virtual-list/virtual-list.js': 'duration',
};

for (const [file, property] of Object.entries(componentDurationDefaults)) {
  const source = read(file);
  assert(
    new RegExp(`${property}: \\{ type: Number, value: ${DEFAULT_DURATION} \\}`).test(source),
    `${file} must default ${property} to ${DEFAULT_DURATION}ms`,
  );
}

assert(read('toast/toast.js').includes('duration: { type: Number, value: 2000 }'), 'Toast duration remains an auto-hide timer');

const implementationFiles = walk('.', ['.js', '.wxss', '.css']);
const invalidCssDurations = [];
const staleCaps = [];
for (const file of implementationFiles) {
  if (file.endsWith('scripts/test-global-motion-contract.js')) continue;
  const source = read(file);
  source.split(/\r?\n/).forEach((line, index) => {
    if (/(?:transition|animation)[^;]*(?:70|90|120|160|180|200|220|240|300|360|400|800)ms/.test(line)) {
      invalidCssDurations.push(`${file}:${index + 1}`);
    }
    if (/(?:duration|motion)[^\n]*(?:Math\.min\(400|,\s*0,\s*400|max:\s*400)/i.test(line)) {
      staleCaps.push(`${file}:${index + 1}`);
    }
  });
}
assert.deepStrictEqual(invalidCssDurations, [], `stale animation durations: ${invalidCssDurations.join(', ')}`);
assert.deepStrictEqual(staleCaps, [], `stale 400ms caps: ${staleCaps.join(', ')}`);

assert(!/0[–-]400ms/.test(preview));
assert(preview.includes('function previewMotionDuration(value, reduceMotion)'));
assert(preview.includes('Math.min(1000'));
assert(preview.includes(': 500'));
assert(preview.includes('max: 1000'));

console.log('Global motion contract passed: default 500ms, max 1000ms, reduced 1ms.');
