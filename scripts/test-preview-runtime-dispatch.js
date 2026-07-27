const assert = require('assert');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.resolve(__dirname, '../preview/app.js'), 'utf8');
const mappings = {
  grid: 'bindGridPreviewRuntime()',
  alert: 'bindAlertPreviewRuntime(props)',
  collapsible: 'bindCollapsiblePreviewRuntime(props)',
  combobox: 'bindComboboxPreviewRuntime(props)',
  table: 'bindTablePreviewRuntime(props)',
  swiper: 'bindSwiperPreviewRuntime(props)',
  'navigation-menu': 'bindNavigationMenuPreviewRuntime(props)',
  direction: 'bindDirectionPreviewRuntime(props)',
  overlay: 'bindOverlayPreviewRuntime(props)',
  'pull-refresh': 'bindPullRefreshPreviewRuntime(props)',
  'virtual-list': 'bindVirtualListPreviewRuntime(props)',
};

Object.entries(mappings).forEach(([id, call]) => {
  assert(source.includes(`if (id === '${id}') {\n    ${call};\n    return;\n  }`), `${id} retained runtime must be dispatched by bindPreviewRuntime`);
});

console.log('Preview retained-runtime dispatch contract passed.');
