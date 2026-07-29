const fs = require('fs');
const path = require('path');
const {
  createCatalogMarkdown,
  createMatrixMarkdown,
  createPreviewSource,
  createShadcnCompatibilityMarkdown,
  createStarterUsageMarkdown,
  root,
} = require('./catalog-utils');
const { createEntrySource } = require('./generate-entry');
const { groups, packageComponents } = require('../metadata/components');
const packageJson = require('../package.json');
const componentReleaseDeltas = require('../metadata/component-release-deltas');

function createMiniprogramComponentStatusSource() {
  const packageIds = new Set(packageComponents);
  const releaseDelta = componentReleaseDeltas[packageJson.version];
  if (!releaseDelta) {
    throw new Error(`Missing component release delta for ${packageJson.version}`);
  }
  const addedIds = new Set(releaseDelta.addedComponents);
  for (const id of addedIds) {
    if (!packageIds.has(id)) {
      throw new Error(`Release delta ${packageJson.version} references unpublished component ${id}`);
    }
  }
  const shortLabels = {
    'getting-started': '规范',
    foundation: '基础',
    layout: '布局',
    navigation: '导航',
    form: '表单',
    data: '数据展示',
    feedback: '反馈',
    overlay: '浮层',
    advanced: '高级',
  };
  const items = groups.map((group) => {
    const ids = group.items
      .map((item) => item.packageId || item.id)
      .filter((id) => packageIds.has(id));
    const uniqueIds = Array.from(new Set(ids));
    const previousValue = uniqueIds.filter((id) => !addedIds.has(id)).length;
    const increment = uniqueIds.filter((id) => addedIds.has(id)).length;
    const segments = [
      {
        key: 'previous',
        label: `v${releaseDelta.previousVersion} 已有`,
        value: previousValue,
        theme: 'blue',
      },
    ];
    if (increment > 0) {
      segments.push({
        key: 'increment',
        label: `v${packageJson.version} 新增`,
        value: increment,
        theme: 'teal',
      });
    }
    return {
      key: group.key,
      label: shortLabels[group.key] || group.title,
      value: uniqueIds.length,
      previousValue,
      increment,
      segments,
    };
  }).filter((item) => item.value > 0);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const previousTotal = items.reduce((sum, item) => sum + item.previousValue, 0);
  const incrementTotal = items.reduce((sum, item) => sum + item.increment, 0);
  const maximum = items.reduce((max, item) => Math.max(max, item.value), 0);
  const versions = Array.isArray(releaseDelta.versions)
    ? releaseDelta.versions.map((entry) => ({
      version: String(entry.version || ''),
      total: Number(entry.total),
    }))
    : [];
  if (
    versions.length < 2
    || versions[0].version !== releaseDelta.previousVersion
    || versions[0].total !== previousTotal
    || versions[versions.length - 1].version !== packageJson.version
    || versions[versions.length - 1].total !== total
    || versions.some((entry) => !entry.version || !Number.isFinite(entry.total) || entry.total < 0)
  ) {
    throw new Error(`Invalid version milestone series for ${packageJson.version}`);
  }
  const status = {
    baseline: 0,
    currentVersion: packageJson.version,
    previousVersion: releaseDelta.previousVersion,
    total,
    previousTotal,
    incrementTotal,
    maximum,
    versions,
    items,
  };
  return `'use strict';\n\nvar STATUS = ${JSON.stringify(status, null, 2)};\n\nfunction cloneSegment(segment) {\n  return {\n    key: segment.key,\n    label: segment.label,\n    value: segment.value,\n    theme: segment.theme\n  };\n}\n\nfunction items() {\n  return STATUS.items.map(function clone(item) {\n    return {\n      key: item.key,\n      label: item.label,\n      value: item.value,\n      previousValue: item.previousValue,\n      increment: item.increment,\n      segments: item.segments.map(cloneSegment)\n    };\n  });\n}\n\nfunction versions() {\n  return STATUS.versions.map(function clone(version) {\n    return {\n      version: version.version,\n      total: version.total\n    };\n  });\n}\n\nmodule.exports = {\n  baseline: STATUS.baseline,\n  currentVersion: STATUS.currentVersion,\n  previousVersion: STATUS.previousVersion,\n  total: STATUS.total,\n  previousTotal: STATUS.previousTotal,\n  incrementTotal: STATUS.incrementTotal,\n  maximum: STATUS.maximum,\n  versions: versions,\n  items: items\n};\n`;
}

const outputs = [
  ['preview/components-data.js', createPreviewSource()],
  ['docs/COMPONENT_CATALOG.md', createCatalogMarkdown()],
  ['docs/COMPONENT_MATRIX.md', createMatrixMarkdown()],
  ['docs/SHADCN_COMPATIBILITY.md', createShadcnCompatibilityMarkdown()],
  ['docs/COMPONENT_STARTER_USAGE.md', createStarterUsageMarkdown()],
  ['index.js', createEntrySource()],
  ['miniprogram/common/data/component-status.js', createMiniprogramComponentStatusSource()],
];

for (const [relativePath, content] of outputs) {
  fs.writeFileSync(path.join(root, relativePath), content);
}

console.log(`Generated ${outputs.length} catalog artifacts.`);
