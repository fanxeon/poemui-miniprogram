const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const metadata = require(path.join(root, 'metadata', 'components'));
const { shadcnComponents } = require(path.join(root, 'metadata', 'shadcn'));
const packageJson = require(path.join(root, 'package.json'));

function readThemeColorTokens() {
  const source = fs.readFileSync(path.join(root, 'common', 'style', 'theme.wxss'), 'utf8');
  const readBlock = (pattern) => {
    const match = source.match(pattern);
    if (!match) throw new Error('Unable to read theme color token block.');
    return Object.fromEntries(Array.from(match[1].matchAll(/\s*(--pui-(?:color|text|bg|border)[\w-]*):\s*([^;]+);/g), (entry) => [entry[1], entry[2].trim()]));
  };
  return {
    light: readBlock(/page,\s*\.pui-theme--light\s*\{([\s\S]*?)\n\}/),
    dark: readBlock(/\.pui-theme--dark\s*\{([\s\S]*?)\n\}/),
  };
}

function readThemeTypographyTokens() {
  const source = fs.readFileSync(path.join(root, 'common', 'style', 'theme.wxss'), 'utf8');
  const block = source.match(/page,\s*\.pui-theme--light\s*\{([\s\S]*?)\n\}/);
  if (!block) throw new Error('Unable to read theme typography token block.');
  return Object.fromEntries(Array.from(block[1].matchAll(/\s*(--pui-(?:font|line-height|letter-spacing)[\w-]*):\s*([^;]+);/g), (entry) => [entry[1], entry[2].trim()]));
}

function readThemeSpacingTokens() {
  const source = fs.readFileSync(path.join(root, 'common', 'style', 'theme.wxss'), 'utf8');
  const block = source.match(/page,\s*\.pui-theme--light\s*\{([\s\S]*?)\n\}/);
  if (!block) throw new Error('Unable to read theme spacing token block.');
  return Object.fromEntries(Array.from(block[1].matchAll(/\s*(--pui-space-[\w-]+):\s*([^;]+);/g), (entry) => [entry[1], entry[2].trim()]));
}

function getEntries() {
  return metadata.groups.flatMap((group) => group.items.map((item) => ({ ...item, group })));
}

function isPackageLike(item) {
  return item.kind === 'component' || (item.kind === 'catalog' && Boolean(item.packageId));
}

function componentPath(id) {
  const entry = getEntries().find((item) => item.id === id);
  const packageId = entry && entry.packageId ? entry.packageId : id;
  return `poemui-miniprogram/${packageId}/${packageId}`;
}

function getPublicProps(id) {
  const entry = getEntries().find((item) => item.id === id);
  const packageId = entry && entry.packageId ? entry.packageId : id;
  const detailProps = metadata.details[packageId] && metadata.details[packageId].props;
  if (detailProps) return detailProps.map((prop) => prop.key);
  return metadata.apiProps[packageId] || [];
}

function readComponentProperties(id) {
  const source = fs.readFileSync(path.join(root, id, `${id}.js`), 'utf8');
  const marker = source.indexOf('properties:');
  if (marker === -1) return [];
  const start = source.indexOf('{', marker);
  if (start === -1) return [];
  let depth = 0;
  let end = -1;
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) {
      end = index;
      break;
    }
  }
  if (end === -1) return [];
  const block = source.slice(start + 1, end);
  return Array.from(block.matchAll(/^    ([A-Za-z_$][\w$]*):\s*\{/gm), (match) => match[1]);
}

function createPreviewData() {
  return {
    version: packageJson.version,
    groups: metadata.groups,
    details: metadata.details,
    componentSummaries: metadata.componentSummaries,
    componentCopy: metadata.componentCopy,
    apiProps: metadata.apiProps,
    apiPropGroups: metadata.apiPropGroups,
    apiEvents: metadata.apiEvents,
    apiSlots: metadata.apiSlots,
    apiMethods: metadata.apiMethods,
    starterUsage: createStarterUsageData(),
    packageComponents: metadata.packageComponents,
    shadcnComponents: shadcnComponents,
    colorTokens: readThemeColorTokens(),
    typographyTokens: readThemeTypographyTokens(),
    spacingTokens: readThemeSpacingTokens(),
  };
}

function starterComponentPath(id) {
  return `poemui-miniprogram/${id}/${id}`;
}

function createStarterUsingComponents(id, entry) {
  return {
    [`pui-${id}`]: starterComponentPath(id),
    ...(entry.components || {}),
  };
}

function createStarterUsageSource(id, entry) {
  const usingComponents = createStarterUsingComponents(id, entry);
  const sections = [
    JSON.stringify({ usingComponents }, null, 2),
    entry.wxml,
  ];
  if (entry.data) {
    sections.push(`// page.js\nPage({\n  data: ${JSON.stringify(entry.data, null, 2)}\n})`);
  }
  if (entry.pageJs) sections.push(`// page.js\n${entry.pageJs}`);
  return sections.filter(Boolean).join('\n\n');
}

function createStarterUsageData() {
  return Object.fromEntries(metadata.packageComponents.map((id) => {
    const entry = metadata.starterUsage[id];
    if (!entry) return [id, null];
    return [id, {
      ...entry,
      source: createStarterUsageSource(id, entry),
    }];
  }));
}

function createStarterUsageMarkdown() {
  const sections = metadata.groups.map((group) => {
    const componentIds = Array.from(new Set(group.items
      .map((item) => item.packageId || item.id)
      .filter((id) => metadata.packageComponents.includes(id))));
    if (!componentIds.length) return '';
    return [
      `## ${group.title}`,
      '',
      ...componentIds.flatMap((id) => {
        const item = group.items.find((entry) => (entry.packageId || entry.id) === id);
        const entry = metadata.starterUsage[id];
        return [
          `### ${item?.nameZh || item?.name || id} \`${id}\``,
          '',
          '#### page.json',
          '',
          '```json',
          JSON.stringify({ usingComponents: createStarterUsingComponents(id, entry) }, null, 2),
          '```',
          '',
          '#### page.wxml',
          '',
          '```xml',
          entry.wxml,
          '```',
          '',
          ...(entry.data ? [
            '#### page.js',
            '',
            '```js',
            `Page({\n  data: ${JSON.stringify(entry.data, null, 2)}\n})`,
            '```',
            '',
          ] : []),
          ...(entry.pageJs ? ['#### page.js', '', '```js', entry.pageJs, '```', ''] : []),
        ];
      }),
    ].join('\n');
  }).filter(Boolean);
  return [
    '# PoemUI 开箱用法',
    '',
    '> 本文件由 `metadata/component-starter-usage.js` 自动生成。Starter Usage 是复制后立即可见、可理解的最小调用，不等于组件运行时默认值，也不改变小程序独立组件页的展示状态。',
    '',
    ...sections,
    '',
  ].join('\n');
}

function createPreviewSource() {
  return `/* This file is generated by scripts/generate-catalog.js. Do not edit manually. */\nwindow.POEMUI_COMPONENT_DATA = ${JSON.stringify(createPreviewData(), null, 2)};\n`;
}

function createCatalogMarkdown() {
  const entries = getEntries().filter(isPackageLike);
  const rows = entries.map((item) => {
    const props = getPublicProps(item.id);
    return `| ${item.name} | ${item.status} | \`${componentPath(item.id)}\` | ${props.map((prop) => `\`${prop}\``).join('、') || '-'} |`;
  });
  return [
    '# PoemUI 组件目录',
    '',
    '> 本文件由 `metadata/components.js` 自动生成。修改组件状态、公开 Props 或官网目录时，请运行 `npm run site:build`。',
    '',
    `当前 npm 包包含 ${entries.length} 个可按需引入的微信原生组件目录，其中 ${entries.filter((item) => item.status === 'done').length} 个为 \`done\`，${entries.filter((item) => item.status === 'beta').length} 个为 \`beta\`，${entries.filter((item) => item.status === 'experimental').length} 个为 \`experimental\`。`,
    '',
    '| 组件 | 状态 | npm 引入路径 | 当前公开 Props |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
    '说明：`done` 表示主要交互和视觉实现已稳定；`beta` 是具有独立原生实现、可传参和可在官网预览的受控发布组件；`experimental` 仅保留 npm 目录和历史兼容壳，不构成稳定 API 或发布承诺。表中只列出当前对外维护的 Props，组件共有的 `customClass`、`customStyle`、`colorScheme` 由主题行为提供。',
    '',
  ].join('\n');
}

function createMatrixMarkdown() {
  const componentEntries = getEntries().filter(isPackageLike);
  const counts = ['done', 'beta', 'experimental'].map((status) => [status, componentEntries.filter((item) => item.status === status).length]);
  const sections = metadata.groups.map((group) => {
    const rows = group.items.map((item) => {
      const detail = metadata.details[item.previewId || item.id] || {};
      const props = getPublicProps(item.id);
      const path = isPackageLike(item) ? `\`${componentPath(item.id)}\`` : `\`${detail.path || '文档能力'}\``;
      const boundary = isPackageLike(item)
        ? props.map((prop) => `\`${prop}\``).join('、') || 'slot 组合'
        : detail.states || '文档能力';
      return `| ${item.name} | ${item.status} | ${path} | ${boundary} |`;
    });
    return [
      `## ${group.title}`,
      '',
      '| 组件/能力 | 状态 | 路径 | 当前交付边界 |',
      '| --- | --- | --- | --- |',
      ...rows,
      '',
    ].join('\n');
  });
  return [
    '# PoemUI 组件清单',
    '',
    '> 本文件由 `metadata/components.js` 自动生成。修改组件状态、公开 Props 或官网目录时，请运行 `npm run site:build`。',
    '',
    `当前 npm 包包含 ${componentEntries.length} 个组件目录：${counts.map(([status, count]) => `\`${status}\` ${count} 个`).join('，')}。`,
    '',
    '- `done`：稳定发布组件，核心 API 与主交互已完成验证。',
    '- `beta`：具有独立 WXML、WXSS、JS 实现的受控发布组件，主路径可用，复杂 API 按版本继续扩展。',
    '- `experimental`：历史目录和兼容壳，允许安装以便迁移或试用，但不能视为稳定 API、真机验收或正式版本承诺。',
    '- `planned` / `research`：设计规范或平台研究项，不是可安装组件。',
    '',
    ...sections,
    '## 发布边界',
    '',
    '正式发布只承诺 `done` 与 `beta` 组件。官网中的 `experimental` 页面用于追踪迁移进度；它们不应被用于生产业务。',
    '',
    '## H5 预览边界',
    '',
    'H5 站点用于 API 调参与视觉评审。`done` 与 `beta` 页面应映射到对应的小程序组件属性和事件；`experimental` 页面只用于目录与迁移说明，不能替代微信开发者工具真机验收。',
    '',
  ].join('\n');
}

function createShadcnCompatibilityMarkdown() {
  const rows = shadcnComponents.map((item) => {
    const target = item.status === 'document' && item.poem === 'typography'
      ? '`docs/TYPOGRAPHY.md`'
      : item.poem ? `\`${componentPath(item.poem)}\`` : '-';
    return `| ${item.source} | ${target} | \`${item.status}\` | \`${item.trigger}\` | ${item.note} |`;
  });
  return [
    '# Shadcn UI 组件分类与微信原生兼容矩阵',
    '',
    '> 本文件由 `metadata/shadcn.js` 自动生成。PoemUI 复刻 shadcn/ui 的组件清单与黑白视觉基线，再将每项落到微信小程序可用的 WXML、WXSS 和触摸交互。',
    '',
    '状态：`native` 为 PoemUI 原生组件路径；`adapter` 为语义等价适配；`touch-adapter` 将 hover/right-click 改为 tap/longpress；`planned` 和 `research` 不应被宣传为完成。',
    '',
    '| shadcn/ui 组件 | PoemUI 对应 | 对标状态 | 原生触发 | 微信端说明 |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

module.exports = {
  createCatalogMarkdown,
  createStarterUsageMarkdown,
  createMatrixMarkdown,
  createShadcnCompatibilityMarkdown,
  createPreviewData,
  createPreviewSource,
  getEntries,
  getPublicProps,
  metadata,
  readComponentProperties,
  root,
};
