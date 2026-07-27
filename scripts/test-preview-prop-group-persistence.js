const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const renderSource = preview.slice(
  preview.indexOf('function renderPropsPanel(detail, props)'),
  preview.indexOf('const previewElementRoleDefinitions'),
);

assert(renderSource.includes('panel.dataset.propOwner === owner'), 'Props panel scopes expanded groups to the current component');
assert(preview.includes('propGroupOpen: {}'), 'expanded groups have a stable state store outside the replaceable workspace DOM');
assert(renderSource.includes('state.propGroupOpen[owner] instanceof Set'), 'Props panel restores expanded groups from shared state');
assert(renderSource.includes('mountedGroups.filter((group) => group.open)'), 'Props panel captures mounted groups before rerender');
assert(renderSource.includes('data-prop-group="${escapeHtml(group.id)}"'), 'collapsible groups expose stable semantic ids');
assert(renderSource.includes("openGroups.has(group.id) ? ' open' : ''"), 'rerendered groups restore expanded state');
assert(preview.includes("addEventListener('toggle', (event) =>"), 'details toggle events persist explicit open and close actions');
assert(preview.includes('openGroups.add(group.dataset.propGroup)'), 'opening a group is stored');
assert(preview.includes('openGroups.delete(group.dataset.propGroup)'), 'closing a group is stored');

console.log('Preview Props group persistence contract passed.');
