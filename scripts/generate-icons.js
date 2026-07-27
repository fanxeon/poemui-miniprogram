const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const makerjs = require('makerjs');
const svg2ttf = require('svg2ttf');
const wawoff2 = require('wawoff2');
const lucideNodes = require('lucide-static/icon-nodes.json');
const lucidePackage = require('lucide-static/package.json');

const root = path.resolve(__dirname, '..');
const iconRoot = path.join(root, 'assets', 'icons-src');
const codepointPath = path.join(root, 'assets', 'icon-codepoints.json');
const fontFamily = 'PoemUI Roundline';
const fontUnits = 1024;
const sourceUnits = 24;
const firstCodepoint = 0xe001;

// User-owned PoemCoder calligraphic mark, optically simplified from the supplied
// raster into five closed silhouettes. The final subpath runs in the opposite
// direction so the central counter remains open at 20rpx.
const poemcoderMarkPath = [
  'M12.36 2.54 L13.25 3.25 L13.07 4.5 L14.68 4.86 L14.5 5.75 L12.71 7.18 L12.54 9.86 L15.04 10.39 L15.75 11.11 L15.93 12.71 L15.39 14.14 L13.79 15.57 L12.89 18.43 L11.29 20.75 L10.57 21.11 L12.36 16.64 L10.57 16.64 L9.68 15.93 L9.14 14.86 L10.93 13.96 L12 13.96 L13.43 14.68 L14.86 12.54 L14.68 11.29 L13.96 11.11 L12.36 11.64 L11.64 10.93 L11.64 7.54 L8.96 8.96 L6.82 11.46 L5.75 13.61 L5.57 16.29 L5.21 16.82 L4.5 16.64 L3.96 15.39 L4.5 11.29 L3.43 11.46 L2.89 12 L2.18 12 L2 11.64 L3.25 10.57 L4.32 10.21 L5.39 10.75 L5.75 12.36 L7.54 9.68 L12 5.57 L12 3.07Z',
  'M16.82 13.25 L17.71 15.93 L17.71 18.25 L19.86 18.25 L20.57 17.89 L22 18.96 L21.82 19.68 L19.14 21.46 L18.61 21.46 L18.61 20.39 L19.14 19.5 L17.36 20.21 L16.82 20.21 L16.46 19.5 L16.29 18.07Z',
  'M4.68 3.25 L7 3.96 L7.71 4.86 L7.89 6.11 L6.11 7.54 L5.57 7.18 L6.29 6.11 L4.32 3.79Z',
  'M18.07 11.82 L20.04 12.54 L20.75 13.25 L21.11 15.04 L19.86 15.04 L19.14 14.5 L18.61 13.43 L18.79 12.89 L18.25 12.54Z',
  'M11.55 14.55 L9.85 14.98 L9.55 15.42 L11.95 15.7 L12.55 15.02Z',
].join(' ');

const customIcons = {
  'poemcoder-mark': {
    source: 'user-owned:poemcoder-mark',
    body: `<g fill="currentColor" fill-rule="nonzero" stroke="none"><path d="${poemcoderMarkPath}"/></g>`,
  },
};

const categories = [
  {
    key: 'navigation',
    label: 'Navigation 导航',
    desc: '方向、返回、菜单、页面切换',
    icons: ['arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down', 'caret-left', 'caret-right', 'menu', 'more-horizontal', 'more-vertical', 'home', 'arrow-left-right'],
  },
  {
    key: 'action',
    label: 'Action 操作',
    desc: '新增、删除、复制、刷新、分享等高频命令',
    icons: ['add', 'add-circle', 'minus', 'minus-circle', 'close', 'close-circle', 'check', 'check-circle', 'edit', 'delete', 'copy', 'download', 'upload', 'refresh', 'share', 'external-link'],
  },
  {
    key: 'editing',
    label: 'Editing 编辑',
    desc: '文本、排版、撤销、格式化',
    icons: ['bold', 'italic', 'underline', 'strikethrough', 'align-left', 'align-center', 'align-right', 'list-bullet', 'list-number', 'undo', 'redo', 'text', 'tag'],
  },
  {
    key: 'status',
    label: 'Status 状态',
    desc: '成功、失败、警告、提示、加载',
    icons: ['success-circle', 'error-circle', 'warning-triangle', 'info-circle', 'help-circle', 'loading-ring', 'shield-check', 'shield-warning', 'verified', 'blocked', 'progress', 'spark'],
  },
  {
    key: 'form',
    label: 'Form 表单',
    desc: '输入、搜索、筛选、可见性、选择',
    icons: ['search', 'filter', 'eye', 'eye-off', 'lock', 'unlock', 'calendar', 'clock', 'clear', 'scan', 'slider', 'checkbox', 'radio'],
  },
  {
    key: 'file',
    label: 'File 文件',
    desc: '文件、文件夹、附件、归档',
    icons: ['file', 'file-text', 'file-code', 'file-image', 'file-pdf', 'file-zip', 'folder', 'folder-open', 'folder-add', 'folder-search', 'archive', 'attachment', 'cloud'],
  },
  {
    key: 'media',
    label: 'Media 媒体',
    desc: '图片、音视频、播放控制',
    icons: ['image', 'camera', 'video', 'mic', 'volume', 'volume-mute', 'play', 'pause', 'stop', 'music', 'crop', 'palette', 'gallery-horizontal'],
  },
  {
    key: 'communication',
    label: 'Communication 通信',
    desc: '消息、通知、邮件、电话',
    icons: ['message', 'chat', 'comment', 'mail', 'phone', 'bell', 'bell-off', 'send', 'inbox', 'at', 'link', 'unlink'],
  },
  {
    key: 'user',
    label: 'User 用户',
    desc: '账户、团队、身份、收藏',
    icons: ['user', 'user-add', 'user-check', 'user-circle', 'users', 'team', 'id-card', 'profile', 'heart', 'star', 'bookmark', 'crown', 'premium'],
  },
  {
    key: 'commerce',
    label: 'Commerce 商业',
    desc: '购物、订单、支付、票券',
    icons: ['cart', 'bag', 'wallet', 'credit-card', 'coupon', 'ticket', 'gift', 'tag-price', 'receipt', 'coin', 'safe-box', 'store'],
  },
  {
    key: 'device',
    label: 'Device 设备',
    desc: '终端、网络、电量、打印',
    icons: ['phone-device', 'tablet', 'desktop', 'watch', 'keyboard', 'mouse', 'printer', 'wifi', 'battery', 'battery-charge', 'server', 'chip'],
  },
  {
    key: 'chart',
    label: 'Chart 图表',
    desc: '数据、趋势、统计、仪表盘',
    icons: ['chart-bar', 'chart-line', 'chart-pie', 'chart-donut', 'trend-up', 'trend-down', 'dashboard', 'activity', 'rank', 'matrix', 'table', 'timeline'],
  },
  {
    key: 'map',
    label: 'Map 地图',
    desc: '位置、路线、地点、出行',
    icons: ['location', 'map', 'compass', 'navigation-pointer', 'route', 'flag', 'pin', 'globe', 'car', 'bike', 'walk', 'train'],
  },
  {
    key: 'development',
    label: 'Development 开发',
    desc: '代码、接口、分支、终端、数据库',
    icons: ['code', 'terminal', 'bug', 'branch', 'commit', 'merge', 'database', 'api', 'package', 'command', 'braces', 'brackets'],
  },
  {
    key: 'layout',
    label: 'Layout 布局',
    desc: '组件、容器、栅格、面板',
    icons: ['app', 'grid', 'columns', 'rows', 'sidebar-left', 'sidebar-right', 'panel-top', 'panel-bottom', 'window', 'layers', 'stack', 'component'],
  },
  {
    key: 'components',
    label: 'Components 组件',
    desc: 'PoemUI 已落地组件的专属图形',
    icons: ['button', 'divider', 'icon', 'popup', 'popover', 'sheet', 'action-sheet', 'dropdown-menu', 'overlay', 'badge', 'cell', 'swipe-cell', 'scroll-area', 'dialog'],
  },
  {
    key: 'abstract',
    label: 'Abstract 抽象',
    desc: '智能、灵感、玻璃、品牌氛围',
    icons: ['ai', 'codex', 'sparkles', 'atom', 'orbit', 'cube', 'hexagon', 'crystal', 'glass', 'wave', 'moon', 'sun', 'focus', 'poemcoder-mark'],
  },
];

// PoemUI keeps its public names stable while selecting the clearest Lucide glyph
// for each meaning. Direct name matches are validated below; aliases stay explicit.
const sourceAliases = {
  'caret-left': 'chevron-left',
  'caret-right': 'chevron-right',
  'more-horizontal': 'ellipsis',
  'more-vertical': 'ellipsis-vertical',
  home: 'house',
  add: 'plus',
  'add-circle': 'circle-plus',
  'minus-circle': 'circle-minus',
  premium: 'crown',
  close: 'x',
  'close-circle': 'circle-x',
  'check-circle': 'circle-check',
  edit: 'pencil',
  delete: 'trash-2',
  refresh: 'rotate-cw',
  share: 'share-2',
  'align-left': 'text-align-start',
  'align-center': 'text-align-center',
  'align-right': 'text-align-end',
  'list-bullet': 'list',
  'list-number': 'list-ordered',
  undo: 'undo-2',
  redo: 'redo-2',
  text: 'type',
  'success-circle': 'circle-check-big',
  'error-circle': 'circle-x',
  'warning-triangle': 'triangle-alert',
  'info-circle': 'info',
  'help-circle': 'circle-question-mark',
  'loading-ring': 'loader-circle',
  'shield-warning': 'shield-alert',
  verified: 'badge-check',
  blocked: 'ban',
  progress: 'circle-dashed',
  spark: 'sparkle',
  filter: 'funnel',
  unlock: 'lock-open',
  clear: 'circle-x',
  scan: 'scan-line',
  slider: 'sliders-horizontal',
  checkbox: 'square-check-big',
  radio: 'circle-dot',
  'file-pdf': 'file-text',
  'file-zip': 'file-archive',
  'folder-add': 'folder-plus',
  attachment: 'paperclip',
  volume: 'volume-2',
  'volume-mute': 'volume-x',
  stop: 'square',
  message: 'message-square',
  chat: 'messages-square',
  comment: 'message-circle',
  send: 'send-horizontal',
  at: 'at-sign',
  link: 'link-2',
  unlink: 'unlink-2',
  user: 'user-round',
  'user-add': 'user-round-plus',
  'user-check': 'user-round-check',
  'user-circle': 'circle-user-round',
  users: 'users-round',
  team: 'users',
  profile: 'contact-round',
  cart: 'shopping-cart',
  bag: 'shopping-bag',
  coupon: 'ticket-percent',
  'tag-price': 'badge-dollar-sign',
  coin: 'circle-dollar-sign',
  'safe-box': 'vault',
  'phone-device': 'smartphone',
  desktop: 'monitor',
  battery: 'battery-medium',
  'battery-charge': 'battery-charging',
  chip: 'cpu',
  'chart-bar': 'chart-no-axes-column',
  'chart-donut': 'donut',
  'trend-up': 'trending-up',
  'trend-down': 'trending-down',
  dashboard: 'gauge',
  rank: 'trophy',
  matrix: 'grid-3x3',
  table: 'table-2',
  location: 'map-pin',
  'navigation-pointer': 'navigation',
  pin: 'map-pinned',
  globe: 'earth',
  walk: 'footprints',
  train: 'train-front',
  code: 'code-xml',
  terminal: 'square-terminal',
  branch: 'git-branch',
  commit: 'git-commit-horizontal',
  merge: 'git-merge',
  api: 'webhook',
  app: 'grid-2x2',
  grid: 'layout-grid',
  columns: 'columns-3',
  rows: 'rows-3',
  'sidebar-left': 'panel-left',
  'sidebar-right': 'panel-right',
  window: 'app-window',
  stack: 'gallery-vertical-end',
  'arrow-left-right': 'arrow-left-right',
  tag: 'tag',
  'gallery-horizontal': 'gallery-horizontal',
  button: 'rectangle-horizontal',
  divider: 'separator-horizontal',
  icon: 'shapes',
  popup: 'square',
  popover: 'square',
  sheet: 'panel-bottom',
  'action-sheet': 'panel-bottom',
  'dropdown-menu': 'panel-top',
  overlay: 'square',
  badge: 'rectangle-horizontal',
  cell: 'rectangle-horizontal',
  'swipe-cell': 'rectangle-horizontal',
  'scroll-area': 'square',
  dialog: 'square',
  ai: 'brain-circuit',
  codex: 'bot',
  cube: 'box',
  crystal: 'diamond',
  glass: 'glass-water',
  wave: 'waves-horizontal',
};

const opticalAdjustments = {
  'caret-left': { transform: 'translate(2.4 2.4) scale(.8)' },
  'caret-right': { transform: 'translate(2.4 2.4) scale(.8)' },
  premium: { transform: 'translate(0 -1.5)' },
  'file-pdf': {
    take: 2,
    append: [
      ['path', { d: 'M8 17.5h1.5a1.5 1.5 0 0 0 0-3H8V19' }],
      ['path', { d: 'M12 19v-4.5h1.1a2.25 2.25 0 0 1 0 4.5H12' }],
      ['path', { d: 'M17 19v-4.5h3M17 16.75h2.2' }],
    ],
    detailStrokeWidth: '1.35',
  },
  button: {
    take: 0,
    append: [
      ['rect', { x: '4', y: '8', width: '16', height: '8', rx: '4' }],
      ['path', { d: 'M9.5 12h5' }],
    ],
  },
  divider: {
    take: 0,
    append: [
      ['path', { d: 'M3 12h7m4 0h7' }],
    ],
  },
  icon: {
    take: 0,
    append: [
      ['circle', { cx: '8', cy: '8', r: '3' }],
      ['path', { d: 'm16 12.5 3.5 3.5-3.5 3.5-3.5-3.5z' }],
    ],
  },
  popup: {
    take: 0,
    append: [
      ['path', { d: 'M9 20H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v5' }],
      ['rect', { x: '9', y: '11', width: '10', height: '10', rx: '2.5' }],
    ],
  },
  popover: {
    take: 0,
    append: [
      ['path', { d: 'M7 4h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-2.5L12 17l-2.5-3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z' }],
      ['circle', { cx: '12', cy: '20', r: '1' }],
    ],
  },
  sheet: {
    take: 0,
    append: [
      ['path', { d: 'M3 21h18v-9a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v9z' }],
      ['path', { d: 'M9 13h6' }],
    ],
  },
  'action-sheet': {
    take: 0,
    append: [
      ['path', { d: 'M3 21h18v-9a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v9z' }],
      ['path', { d: 'M9 12h6m-7 4h8' }],
    ],
  },
  'dropdown-menu': {
    take: 0,
    append: [
      ['path', { d: 'M4 5h10m3-1 2 2 2-2' }],
      ['rect', { x: '5', y: '10', width: '14', height: '10', rx: '2.5' }],
      ['path', { d: 'M8 15h8' }],
    ],
  },
  overlay: {
    take: 0,
    append: [
      ['rect', { x: '4', y: '4', width: '16', height: '16', rx: '3' }],
      ['rect', { x: '8', y: '8', width: '8', height: '8', rx: '2' }],
    ],
  },
  badge: {
    take: 0,
    append: [
      ['rect', { x: '4', y: '6', width: '15', height: '13', rx: '3' }],
      ['circle', { cx: '18.5', cy: '5.5', r: '2', fill: 'currentColor', stroke: 'none' }],
    ],
  },
  cell: {
    take: 0,
    append: [
      ['rect', { x: '3', y: '7', width: '18', height: '10', rx: '2.5' }],
      ['path', { d: 'M7 12h6m4-2 2 2-2 2' }],
    ],
  },
  'swipe-cell': {
    take: 0,
    append: [
      ['rect', { x: '3', y: '7', width: '18', height: '10', rx: '2.5' }],
      ['path', { d: 'M16 7v10m-3-7-2 2 2 2' }],
    ],
  },
  'scroll-area': {
    take: 0,
    append: [
      ['rect', { x: '4', y: '3', width: '16', height: '18', rx: '2.5' }],
      ['path', { d: 'M8 10h5m4-2v5' }],
    ],
  },
  dialog: {
    take: 0,
    append: [
      ['rect', { x: '4', y: '3', width: '16', height: '18', rx: '2.5' }],
      ['rect', { x: '7', y: '8', width: '10', height: '8', rx: '2.5' }],
      ['path', { d: 'M9.5 11h5' }],
    ],
  },
};

const catalogIcons = categories.flatMap((category) => category.icons);
const sourceMap = Object.fromEntries(catalogIcons.map((name) => [
  name,
  customIcons[name]?.source || sourceAliases[name] || name,
]));
const duplicateNames = catalogIcons.filter((name, index) => catalogIcons.indexOf(name) !== index);
const missingSources = catalogIcons.filter((name) => !customIcons[name] && !lucideNodes[sourceMap[name]]);
const staleAliases = Object.keys(sourceAliases).filter((name) => !catalogIcons.includes(name));
const staleCustomIcons = Object.keys(customIcons).filter((name) => !catalogIcons.includes(name));

if (categories.length !== 17 || catalogIcons.length !== 220 || duplicateNames.length || missingSources.length || staleAliases.length || staleCustomIcons.length) {
  throw new Error([
    categories.length !== 17 ? `Expected 17 icon categories, received ${categories.length}` : '',
    catalogIcons.length !== 220 ? `Expected 220 catalog icons, received ${catalogIcons.length}` : '',
    duplicateNames.length ? `Duplicate PoemUI names: ${duplicateNames.join(', ')}` : '',
    missingSources.length ? `Missing Lucide sources: ${missingSources.join(', ')}` : '',
    staleAliases.length ? `Stale Lucide aliases: ${staleAliases.join(', ')}` : '',
    staleCustomIcons.length ? `Stale custom icons: ${staleCustomIcons.join(', ')}` : '',
  ].filter(Boolean).join('\n'));
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function renderNode([tag, attributes], extraAttributes = {}) {
  const source = Object.entries({ ...attributes, ...extraAttributes })
    .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
    .join(' ');
  return `<${tag}${source ? ` ${source}` : ''}/>`;
}

function createIconBody(name) {
  if (customIcons[name]) return customIcons[name].body;
  const source = sourceMap[name];
  const adjustment = opticalAdjustments[name] || {};
  const nodeCount = typeof adjustment.take === 'number' ? adjustment.take : lucideNodes[source].length;
  const rendered = lucideNodes[source].slice(0, nodeCount).map((node) => renderNode(node));

  if (adjustment.append) {
    const detailAttributes = adjustment.detailStrokeWidth
      ? { 'stroke-width': adjustment.detailStrokeWidth }
      : {};
    rendered.push(...adjustment.append.map((node) => renderNode(node, detailAttributes)));
  }

  const nodes = rendered.join('');
  const content = adjustment.transform
    ? `<g transform="${adjustment.transform}">${nodes}</g>`
    : nodes;

  return `<g fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">${content}</g>`;
}

function createSvg(name, source, body) {
  const notice = customIcons[name]
    ? 'User-owned PoemCoder mark; generated by scripts/generate-icons.js.'
    : `Derived from Lucide ${source} (${lucidePackage.version}); see THIRD_PARTY_NOTICES.md`;
  return `<!-- ${notice} -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-label="${name}">
  ${body}
</svg>
`;
}

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function writePreviewSvg(icons) {
  const columns = 10;
  const cell = 96;
  const header = 56;
  const rows = Math.ceil(icons.length / columns);
  const width = columns * cell;
  const height = header + rows * cell;
  const items = icons.map((icon, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = col * cell;
    const y = header + row * cell;
    return `<g transform="translate(${x}, ${y})">
  <rect x="8" y="6" width="80" height="80" rx="8" fill="#fff" stroke="#e4e4e7"/>
  <g transform="translate(36, 22)" fill="none">${icon.body}</g>
  <text x="48" y="82" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="8.5" fill="#52525b">${icon.name}</text>
</g>`;
  }).join('\n');

  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#fafafa"/>
  <text x="28" y="34" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="22" font-weight="700" fill="#18181b">PoemUI Roundline Icons</text>
  <text x="${width - 28}" y="34" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="14" fill="#52525b">${icons.length} icons · Lucide-derived + user-owned mark</text>
  <g color="#18181b">${items}</g>
</svg>
`;
  fs.writeFileSync(path.join(root, 'assets', 'icons-preview.svg'), content, 'utf8');
}

function writeComponentIconPreview(icons) {
  const componentIcons = icons.filter((icon) => icon.category === 'components');
  const columns = 5;
  const cell = 144;
  const header = 64;
  const width = columns * cell;
  const height = header + Math.ceil(componentIcons.length / columns) * cell;
  const items = componentIcons.map((icon, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = col * cell;
    const y = header + row * cell;
    return `<g transform="translate(${x}, ${y})">
  <rect x="8" y="8" width="128" height="128" rx="10" fill="#fff" stroke="#d4d4d8"/>
  <g transform="translate(44, 16) scale(2.3333)" fill="none">${icon.body}</g>
  <g transform="translate(33, 86) scale(1.3333)" fill="none">${icon.body}</g>
  <g transform="translate(91, 92) scale(.8333)" fill="none">${icon.body}</g>
  <text x="72" y="130" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" fill="#18181b">${icon.name}</text>
</g>`;
  }).join('\n');

  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#fff"/>
  <text x="16" y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="18" font-weight="700" fill="#09090b">PoemUI Roundline · Components</text>
  <text x="16" y="48" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" fill="#18181b">减线稿 · 56 / 32 / 20 px · 每枚不超过 3 个可见图元</text>
  <g color="#09090b">${items}</g>
</svg>
`;
  fs.writeFileSync(path.join(root, 'assets', 'component-icons-preview.svg'), content, 'utf8');
}

function writePreviewData(manifest) {
  const data = {
    style: manifest.style,
    upstream: manifest.upstream,
    categories: manifest.categories,
    font: manifest.font,
    icons: manifest.icons.map(({ name, category, source, codepoint }) => ({
      name,
      category,
      source,
      codepoint,
    })),
  };
  fs.writeFileSync(
    path.join(root, 'preview', 'icons-data.js'),
    `window.POEMUI_ICON_DATA = ${JSON.stringify(data, null, 2)};\n`,
    'utf8',
  );
}

function writeMiniProgramFontCatalog(manifest) {
  const catalog = {
    categories: manifest.categories,
    icons: manifest.icons.map(({ name, category, source, codepoint }) => ({
      name,
      category,
      source,
      codepoint,
    })),
  };
  const content = `/* This file is generated by scripts/generate-icons.js. Do not edit manually. */\nmodule.exports = ${JSON.stringify(catalog, null, 2)};\n`;
  fs.writeFileSync(path.join(root, 'icon', 'icon-font-catalog.js'), content, 'utf8');
}

function parseAttributes(source) {
  const attributes = {};
  String(source || '').replace(/([:\w-]+)="([^"]*)"/g, (_match, key, value) => {
    attributes[key] = value;
    return '';
  });
  return attributes;
}

function numberAttribute(attributes, key, fallback = 0) {
  const value = Number(attributes[key]);
  return Number.isFinite(value) ? value : fallback;
}

function pointsToPath(points, close) {
  const values = String(points || '').trim().split(/[\s,]+/).map(Number);
  if (values.length < 4 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(`Invalid icon points: ${points}`);
  }
  const pairs = [];
  for (let index = 0; index < values.length; index += 2) {
    pairs.push([values[index], values[index + 1]]);
  }
  return `M${pairs.map((pair) => pair.join(' ')).join('L')}${close ? 'Z' : ''}`;
}

function shapeToPath(tag, attributes) {
  if (tag === 'path') return attributes.d || '';
  if (tag === 'line') {
    return `M${numberAttribute(attributes, 'x1')} ${numberAttribute(attributes, 'y1')}L${numberAttribute(attributes, 'x2')} ${numberAttribute(attributes, 'y2')}`;
  }
  if (tag === 'polyline') return pointsToPath(attributes.points, false);
  if (tag === 'polygon') return pointsToPath(attributes.points, true);
  if (tag === 'circle') {
    const cx = numberAttribute(attributes, 'cx');
    const cy = numberAttribute(attributes, 'cy');
    const r = numberAttribute(attributes, 'r');
    return `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`;
  }
  if (tag === 'ellipse') {
    const cx = numberAttribute(attributes, 'cx');
    const cy = numberAttribute(attributes, 'cy');
    const rx = numberAttribute(attributes, 'rx');
    const ry = numberAttribute(attributes, 'ry');
    return `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`;
  }
  if (tag === 'rect') {
    const x = numberAttribute(attributes, 'x');
    const y = numberAttribute(attributes, 'y');
    const width = numberAttribute(attributes, 'width');
    const height = numberAttribute(attributes, 'height');
    const rx = Math.min(Math.max(numberAttribute(attributes, 'rx', numberAttribute(attributes, 'ry')), 0), width / 2);
    const ry = Math.min(Math.max(numberAttribute(attributes, 'ry', rx), 0), height / 2);
    if (!rx || !ry) return `M${x} ${y}H${x + width}V${y + height}H${x}Z`;
    return [
      `M${x + rx} ${y}`,
      `H${x + width - rx}`,
      `A${rx} ${ry} 0 0 1 ${x + width} ${y + ry}`,
      `V${y + height - ry}`,
      `A${rx} ${ry} 0 0 1 ${x + width - rx} ${y + height}`,
      `H${x + rx}`,
      `A${rx} ${ry} 0 0 1 ${x} ${y + height - ry}`,
      `V${y + ry}`,
      `A${rx} ${ry} 0 0 1 ${x + rx} ${y}`,
      'Z',
    ].join('');
  }
  throw new Error(`Unsupported icon shape: ${tag}`);
}

function parseUniformTransform(body) {
  const match = String(body).match(/<g\s+transform="([^"]+)"/);
  if (!match) return { scale: 1, translateX: 0, translateY: 0 };
  const source = match[1];
  const scaleMatch = source.match(/scale\(\s*([.\d-]+)(?:[\s,]+([.\d-]+))?\s*\)/);
  const translateMatch = source.match(/translate\(\s*([.\d-]+)(?:[\s,]+([.\d-]+))?\s*\)/);
  const scaleX = scaleMatch ? Number(scaleMatch[1]) : 1;
  const scaleY = scaleMatch && scaleMatch[2] ? Number(scaleMatch[2]) : scaleX;
  if (scaleX !== scaleY || !Number.isFinite(scaleX)) {
    throw new Error(`Icon Font only supports uniform source transforms: ${source}`);
  }
  return {
    scale: scaleX,
    translateX: translateMatch ? Number(translateMatch[1]) : 0,
    translateY: translateMatch && translateMatch[2] ? Number(translateMatch[2]) : 0,
  };
}

function splitSubpaths(pathData, SVGPathCommander) {
  const absolute = SVGPathCommander.pathToAbsolute(SVGPathCommander.parsePathString(pathData));
  const subpaths = [];
  for (const segment of absolute) {
    if (segment[0] === 'M' && subpaths.length && subpaths[subpaths.length - 1].length) {
      subpaths.push([]);
    } else if (!subpaths.length) {
      subpaths.push([]);
    }
    subpaths[subpaths.length - 1].push(segment);
  }
  return subpaths.filter((subpath) => subpath.length).map((subpath) => SVGPathCommander.pathToString(subpath));
}

function splitDrawableSegments(pathData, SVGPathCommander) {
  const normalized = SVGPathCommander.normalizePath(pathData);
  const segments = [];
  let current = [0, 0];
  let start = [0, 0];
  for (const segment of normalized) {
    const command = segment[0];
    if (command === 'M') {
      current = [segment[1], segment[2]];
      start = current.slice();
      continue;
    }
    if (command === 'Z') {
      if (current[0] !== start[0] || current[1] !== start[1]) {
        segments.push(`M${current[0]} ${current[1]}L${start[0]} ${start[1]}`);
      }
      current = start.slice();
      continue;
    }
    segments.push(SVGPathCommander.pathToString([['M', current[0], current[1]], segment]));
    current = [segment[segment.length - 2], segment[segment.length - 1]];
  }
  return segments;
}

function applySourceTransform(pathData, transform, SVGPathCommander) {
  let command = new SVGPathCommander(pathData);
  if (transform.scale !== 1) command = command.transform({ scale: transform.scale, origin: [0, 0] });
  if (transform.translateX || transform.translateY) {
    command = command.transform({ translate: [transform.translateX, transform.translateY] });
  }
  return command.toString();
}

function toFontCoordinates(pathData, SVGPathCommander) {
  return new SVGPathCommander(pathData)
    .transform({ scale: fontUnits / sourceUnits, origin: [0, 0] })
    .transform({ scale: [1, -1], origin: [0, fontUnits / 2] })
    .toString();
}

function normalizeFullCircleArcs(model) {
  makerjs.model.walk(model, {
    onPath(walkedPath) {
      const source = walkedPath.pathContext;
      if (source.type !== makerjs.pathType.Arc) return;
      if (Math.abs(makerjs.angle.ofArcSpan(source) - 360) > 1e-8) return;
      walkedPath.modelContext.paths[walkedPath.pathId] = new makerjs.paths.Circle(source.origin, source.radius);
    },
  });
}

function exportFontOutline(model, preserveHoles) {
  if (preserveHoles) normalizeFullCircleArcs(model);
  return makerjs.exporter.toSVGPathData(model, {
    fillRule: preserveHoles ? 'nonzero' : 'evenodd',
    origin: [0, 0],
  });
}

function shouldPreserveCircleHole(tag, attributes, strokeWidth) {
  if (tag !== 'circle') return true;
  const radius = numberAttribute(attributes, 'r');
  return radius > strokeWidth / 2;
}

function outlineStroke(pathData, strokeWidth, transform, SVGPathCommander, preserveHoles = true) {
  const transformed = applySourceTransform(pathData, transform, SVGPathCommander);
  return splitSubpaths(transformed, SVGPathCommander).map((subpath) => {
    const outline = (source) => {
      const input = makerjs.importer.fromSVGPathData(source, { bezierAccuracy: 0.05 });
      const outlined = makerjs.model.expandPaths(input, strokeWidth * transform.scale / 2, 0);
      if (!outlined) throw new Error('Maker.js returned an empty outline.');
      makerjs.model.simplify(outlined);
      const path = exportFontOutline(outlined, preserveHoles);
      return toFontCoordinates(path, SVGPathCommander);
    };
    try {
      return outline(subpath);
    } catch (error) {
      try {
        return splitDrawableSegments(subpath, SVGPathCommander).map((segment) => {
          try {
            const input = makerjs.importer.fromSVGPathData(segment, { bezierAccuracy: 0.05 });
            const outlined = makerjs.model.expandPaths(input, strokeWidth * transform.scale / 2, 0);
            if (!outlined) throw new Error('Maker.js returned an empty segment outline.');
            makerjs.model.simplify(outlined);
            const path = exportFontOutline(outlined, preserveHoles);
            return toFontCoordinates(path, SVGPathCommander);
          } catch (segmentError) {
            throw new Error(`${segmentError.message} at "${segment}"`);
          }
        }).join(' ');
      } catch (fallbackError) {
        throw new Error(`Unable to outline icon path "${subpath}": ${error.message}; segment fallback: ${fallbackError.message}`);
      }
    }
  }).join(' ');
}

function iconBodyToGlyph(body, SVGPathCommander) {
  const groupMatch = String(body).match(/<g\s+([^>]*)>/);
  const groupAttributes = parseAttributes(groupMatch ? groupMatch[1] : '');
  const transform = parseUniformTransform(body);
  const paths = [];
  const shapePattern = /<(path|circle|rect|line|polyline|polygon|ellipse)\s+([^>]*?)\/>/g;
  let match;
  while ((match = shapePattern.exec(body))) {
    const tag = match[1];
    const attributes = { ...groupAttributes, ...parseAttributes(match[2]) };
    const pathData = shapeToPath(tag, attributes);
    if (!pathData) continue;
    const fill = attributes.fill || 'none';
    const stroke = attributes.stroke || 'none';
    if (fill !== 'none') {
      paths.push(toFontCoordinates(applySourceTransform(pathData, transform, SVGPathCommander), SVGPathCommander));
    }
    if (stroke !== 'none') {
      const strokeWidth = numberAttribute(attributes, 'stroke-width', 2.15);
      paths.push(outlineStroke(
        pathData,
        strokeWidth,
        transform,
        SVGPathCommander,
        shouldPreserveCircleHole(tag, attributes, strokeWidth),
      ));
    }
  }
  if (!paths.length) throw new Error('Icon Font glyph has no visible paths.');
  return paths.join(' ');
}

function readCodepointRegistry(iconNames) {
  let saved = {};
  if (fs.existsSync(codepointPath)) {
    saved = JSON.parse(fs.readFileSync(codepointPath, 'utf8'));
  }
  const previous = saved.glyphs && typeof saved.glyphs === 'object' ? saved.glyphs : {};
  const used = new Set();
  const glyphs = {};
  let nextCodepoint = Number.parseInt(saved.nextCodepoint || '', 16);
  if (!Number.isFinite(nextCodepoint)) {
    nextCodepoint = Math.max(firstCodepoint, ...Object.values(previous).map((value) => Number.parseInt(value, 16) + 1).filter(Number.isFinite));
  }
  for (const name of iconNames) {
    let codepoint = Number.parseInt(previous[name] || '', 16);
    if (!Number.isFinite(codepoint) || codepoint < firstCodepoint || used.has(codepoint)) {
      while (used.has(nextCodepoint)) nextCodepoint += 1;
      codepoint = nextCodepoint;
      nextCodepoint += 1;
    }
    used.add(codepoint);
    glyphs[name] = codepoint.toString(16).toUpperCase().padStart(4, '0');
  }
  return {
    fontFamily,
    range: 'Private Use Area',
    nextCodepoint: nextCodepoint.toString(16).toUpperCase().padStart(4, '0'),
    glyphs,
  };
}

function writeMiniProgramFontMap(registry) {
  const lines = Object.entries(registry.glyphs).map(([name, codepoint]) => (
    `  ${JSON.stringify(name)}: "\\u${codepoint}"`
  ));
  const content = `/* This file is generated by scripts/generate-icons.js. Do not edit manually. */\nmodule.exports = {\n${lines.join(',\n')}\n};\n`;
  fs.writeFileSync(path.join(root, 'icon', 'icon-font-map.js'), content, 'utf8');
}

async function writeIconFont(icons, registry, SVGPathCommander) {
  const glyphs = icons.map((icon) => {
    const codepoint = registry.glyphs[icon.name];
    const pathData = iconBodyToGlyph(icon.body, SVGPathCommander);
    return `    <glyph glyph-name="${escapeAttribute(icon.name)}" unicode="&#x${codepoint};" horiz-adv-x="${fontUnits}" d="${escapeAttribute(pathData)}"/>`;
  }).join('\n');
  const svgFont = `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <font id="poemui-roundline" horiz-adv-x="${fontUnits}">
      <font-face font-family="${fontFamily}" units-per-em="${fontUnits}" ascent="${fontUnits}" descent="0"/>
      <missing-glyph horiz-adv-x="0"/>
${glyphs}
    </font>
  </defs>
</svg>
`;
  const ttf = Buffer.from(svg2ttf(svgFont, {
    copyright: `Lucide-derived PoemUI Roundline ${lucidePackage.version} plus user-owned PoemCoder mark; see THIRD_PARTY_NOTICES.md`,
    description: 'PoemUI Roundline local icon font with user-owned PoemCoder mark',
    ts: 946684800,
  }).buffer);
  const woff2 = Buffer.from(await wawoff2.compress(ttf));
  const base64 = woff2.toString('base64');
  const css = `/* This file is generated by scripts/generate-icons.js. Do not edit manually. */
@font-face {
  font-family: "${fontFamily}";
  src: url("data:font/woff2;base64,${base64}") format("woff2");
  font-style: normal;
  font-weight: normal;
}
`;
  fs.writeFileSync(path.join(root, 'icon', 'icon-font.wxss'), css, 'utf8');
  fs.writeFileSync(path.join(root, 'preview', 'icon-font.css'), css, 'utf8');
  writeMiniProgramFontMap(registry);
  return {
    family: fontFamily,
    format: 'woff2',
    delivery: 'embedded-data-uri',
    unitsPerEm: fontUnits,
    glyphCount: icons.length,
    bytes: woff2.length,
    sha256: crypto.createHash('sha256').update(woff2).digest('hex'),
  };
}

async function main() {
  const commanderModule = await import('svg-path-commander');
  const SVGPathCommander = commanderModule.default;
  const codepointRegistry = readCodepointRegistry(catalogIcons);

  ensureCleanDir(iconRoot);

  const manifest = {
  style: {
    name: 'PoemUI Roundline',
    viewBox: '0 0 24 24',
    strokeWidth: '2.15',
    lineCap: 'round',
    lineJoin: 'round',
    color: 'currentColor',
    notes: 'Lucide 来源图标统一为 PoemUI 的圆线权重与光学微调；登记的用户自有品牌字标使用闭合 currentColor 填充轮廓。全部图标保持单色和 24 x 24 画布。',
  },
  upstream: {
    name: 'Lucide',
    package: 'lucide-static',
    version: lucidePackage.version,
    license: 'ISC / MIT for Feather-derived icons',
    url: 'https://lucide.dev',
  },
  custom: {
    ownership: 'User-owned',
    icons: Object.keys(customIcons),
  },
  categories: [],
  icons: [],
  };

  const previewIcons = [];
  for (const category of categories) {
    const dir = path.join(iconRoot, category.key);
    fs.mkdirSync(dir, { recursive: true });
    manifest.categories.push({
      key: category.key,
      label: category.label,
      desc: category.desc,
      count: category.icons.length,
    });

    for (const name of category.icons) {
      const source = sourceMap[name];
      const body = createIconBody(name);
      const iconPath = `${category.key}/${name}.svg`;
      fs.writeFileSync(path.join(iconRoot, iconPath), createSvg(name, source, body), 'utf8');
      manifest.icons.push({
        name,
        category: category.key,
        source,
        path: iconPath,
        codepoint: codepointRegistry.glyphs[name],
      });
      previewIcons.push({ name, category: category.key, source, body });
    }
  }

  manifest.font = await writeIconFont(previewIcons, codepointRegistry, SVGPathCommander);
  fs.writeFileSync(codepointPath, `${JSON.stringify(codepointRegistry, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(iconRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  writeMiniProgramFontCatalog(manifest);
  writePreviewSvg(previewIcons);
  writeComponentIconPreview(previewIcons);
  writePreviewData(manifest);
  console.log(`Generated ${manifest.icons.length} PoemUI Roundline icons in ${manifest.categories.length} categories and ${manifest.font.bytes} byte local WOFF2 from Lucide ${lucidePackage.version} plus registered custom sources.`);
}

module.exports = {
  createIconBody,
  iconBodyToGlyph,
  outlineStroke,
  shapeToPath,
  shouldPreserveCircleHole,
  splitDrawableSegments,
  splitSubpaths,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
