const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const previewPath = path.join(root, 'preview/app.js');
const htmlPath = path.join(root, 'preview/index.html');
const preview = fs.readFileSync(previewPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

assert(!/<(?:button|input|select|textarea)\b/.test(html), 'preview/index.html must only expose mounts; PUI helpers own platform controls');

const expected = new Map(Object.entries({
  'buttonSample:button': 1,
  'inputControlSample:input': 1,
  'selectControlSample:select': 1,
  'switchControlSample:input': 1,
  'textareaControlSample:textarea': 1,
  'checkboxSample:input': 1,
  'checkboxPreviewMarkup:input': 2,
  'collapsibleShowcase:button': 1,
  'tableShowcase:button': 1,
  'swiperShowcase:button': 1,
  'navigationMenuShowcase:button': 1,
  'calendarPreviewMarkup:button': 2,
  'inputPreviewMarkup:input': 1,
  'textareaPreviewMarkup:textarea': 1,
  'otpShowcase:input': 1,
  'switchPreviewMarkup:button': 2,
  'radioPreviewMarkup:input': 1,
  'ratePreviewMarkup:button': 2,
  'uploadPreviewMarkup:input': 1,
  'sliderSample:input': 1,
  'popupSample:button': 1,
  'sheetShowcase:button': 1,
  'popoverShowcase:button': 1,
  'actionSheetShowcase:button': 1,
  'dropdownPreviewSlim:button': 1,
  'overlayShowcase:button': 1,
  'writePreviewClipboard:create-textarea': 1,
}));

const declarations = [];
const declarationPattern = /(?:^|\n)(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(/g;
let declaration;
while ((declaration = declarationPattern.exec(preview))) {
  declarations.push({ name: declaration[1], index: declaration.index });
}

function ownerAt(index) {
  let owner = '';
  for (const candidate of declarations) {
    if (candidate.index > index) break;
    owner = candidate.name;
  }
  return owner;
}

const actual = new Map();
const nativePattern = /<(button|input|select|textarea)\b|document\.createElement\((['"])textarea\2\)/g;
let match;
while ((match = nativePattern.exec(preview))) {
  const kind = match[1] || 'create-textarea';
  const key = `${ownerAt(match.index)}:${kind}`;
  assert(expected.has(key), `raw ${kind} escaped an approved PUI/platform boundary: ${key}`);
  actual.set(key, (actual.get(key) || 0) + 1);
}

assert.deepStrictEqual(
  [...actual.entries()].sort(),
  [...expected.entries()].sort(),
  'approved native-control boundaries changed; inspect WXML parity and update the contract intentionally',
);

for (const compositeOwner of [
  'renderGroups',
  'renderPropsPanel',
  'renderComponentPageTabs',
  'renderIconLibrary',
  'ensureComponentInfrastructureControls',
  'ensurePreviewPreferenceControls',
  'formShowcase',
  'fieldShowcase',
  'searchSample',
  'stepperShowcase',
  'comboboxH5PanelMarkup',
  'selectShowcase',
]) {
  assert(![...actual.keys()].some((key) => key.startsWith(`${compositeOwner}:`)), `${compositeOwner} must compose PUI helpers instead of native controls`);
}

console.log(`Preview native-control boundary contract passed (${[...actual.values()].reduce((sum, count) => sum + count, 0)} approved roots).`);
