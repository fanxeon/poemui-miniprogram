const assert=require('assert');const fs=require('fs');const path=require('path');const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'virtual-list/virtual-list.js'),'utf8');const wxml=fs.readFileSync(path.join(root,'virtual-list/virtual-list.wxml'),'utf8');const preview=fs.readFileSync(path.join(root,'preview/app.js'),'utf8');const contract=fs.readFileSync(path.join(root,'docs/components/VIRTUAL-LIST.md'),'utf8');
assert(wxml.includes('scroll-view')&&wxml.includes('topSpacerStyle')&&wxml.includes('bottomSpacerStyle')&&wxml.includes('<pui-cell')&&wxml.includes('<pui-empty'));
assert(source.includes('function normalizeDuration')&&source.includes('function normalizedSelection'));
assert(contract.includes('paintVirtualListWindow'));
assert(preview.includes('function bindVirtualListPreviewRuntime(props)'));
assert(preview.includes("if (id === 'virtual-list') {\n    bindVirtualListPreviewRuntime(props);"));
assert(preview.includes("viewport.addEventListener('scroll'"));
console.log('VirtualList contract tests passed.');
