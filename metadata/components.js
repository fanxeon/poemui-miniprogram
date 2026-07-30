const { shadcnComponents } = require('./shadcn');
const starterUsage = require('./component-starter-usage');

// 这是当前发布组件及规范文档的唯一源，不保留第二份历史目录。
const sourceGroups = [
  {
    key: 'getting-started',
    title: '开始与规范',
    items: [
      { id: 'getting-started', name: 'Getting Started 快速开始', status: 'done', kind: 'guide' },
      { id: 'config-provider', name: 'ConfigProvider', status: 'done', kind: 'component' },
      { id: 'direction', name: 'Direction 方向容器', status: 'done', kind: 'component' },
      { id: 'theme-tokens', name: 'Theme Tokens', status: 'done', kind: 'document' },
      { id: 'color', name: 'Color 色彩', status: 'done', kind: 'document' },
      { id: 'typography', name: 'Typography 排版', status: 'done', kind: 'document' },
      { id: 'spacing', name: 'Spacing 间距', status: 'done', kind: 'document' },
      { id: 'style-utilities', name: 'Style Utilities', status: 'done', kind: 'document' },
      { id: 'icon', name: 'Icon 图标', status: 'done', kind: 'component' },
      { id: 'button', name: 'Button 按钮', status: 'done', kind: 'component' },
      { id: 'divider', name: 'Divider 分割线', status: 'done', kind: 'component' },
    ],
  },
  {
    key: 'navigation',
    title: '导航',
    items: [
      { id: 'navbar', name: 'Navbar 导航栏', status: 'done', kind: 'component' },
      { id: 'navigation-menu', name: 'NavigationMenu 导航菜单', status: 'done', kind: 'component' },
      { id: 'tabs', name: 'Tabs 选项卡', status: 'done', kind: 'component' },
      { id: 'breadcrumb', name: 'Breadcrumb 面包屑', status: 'done', kind: 'component' },
      { id: 'tabbar', name: 'Tabbar 标签栏', status: 'done', kind: 'component' },
      { id: 'steps', name: 'Steps 步骤条', status: 'done', kind: 'component' },
      { id: 'back-top', name: 'BackTop 回到顶部', status: 'done', kind: 'component' },
      { id: 'indexes', name: 'Indexes 索引', status: 'done', kind: 'component' },
      { id: 'sidebar', name: 'SideBar 侧边导航', status: 'done', kind: 'component' },
    ],
  },
  {
    key: 'form',
    title: '输入',
    items: [
      { id: 'input', name: 'Input 输入框', status: 'done', kind: 'component' },
      { id: 'field', name: 'Field 字段容器', status: 'done', kind: 'component' },
      { id: 'label', name: 'Label 标签', status: 'done', kind: 'component' },
      { id: 'input-otp', name: 'InputOTP 验证码', status: 'done', kind: 'component' },
      { id: 'textarea', name: 'Textarea 文本域', status: 'done', kind: 'component' },
      { id: 'switch', name: 'Switch 开关', status: 'done', kind: 'component' },
      { id: 'checkbox', name: 'Checkbox 复选框', status: 'done', kind: 'component' },
      { id: 'radio', name: 'Radio 单选框', status: 'done', kind: 'component' },
      { id: 'form', name: 'Form 表单', status: 'done', kind: 'component' },
      { id: 'picker', name: 'Picker 选择器', status: 'done', kind: 'component' },
      { id: 'select', name: 'Select 选择器', status: 'done', kind: 'component' },
      { id: 'combobox', name: 'Combobox 组合框', status: 'done', kind: 'component' },
      { id: 'date-time-picker', name: 'DateTimePicker 时间选择', status: 'done', kind: 'component' },
      { id: 'search', name: 'Search 搜索', status: 'done', kind: 'component' },
      { id: 'stepper', name: 'Stepper 步进器', status: 'done', kind: 'component' },
      { id: 'slider', name: 'Slider 滑块', status: 'done', kind: 'component' },
      { id: 'rate', name: 'Rate 评分', status: 'done', kind: 'component' },
      { id: 'upload', name: 'Upload 上传', status: 'done', kind: 'component' },
    ],
  },
  {
    key: 'data',
    title: '数据展示',
    items: [
      { id: 'cell', name: 'Cell 单元格', status: 'done', kind: 'component' },
      { id: 'card', name: 'Card 卡片', status: 'done', kind: 'component' },
      { id: 'grid', name: 'Grid 宫格', status: 'done', kind: 'component' },
      { id: 'list', name: 'List 列表', status: 'done', kind: 'component' },
      { id: 'tag', name: 'Tag 标签', status: 'done', kind: 'component' },
      { id: 'badge', name: 'Badge 徽标', status: 'done', kind: 'component' },
      { id: 'avatar', name: 'Avatar 头像', status: 'done', kind: 'component' },
      { id: 'image', name: 'Image 图片', status: 'done', kind: 'component' },
      { id: 'bubble', name: 'Bubble 消息气泡', status: 'done', kind: 'component' },
      { id: 'collapse', name: 'Collapse 折叠面板', status: 'done', kind: 'component' },
      { id: 'collapsible', name: 'Collapsible 折叠内容', status: 'done', kind: 'component' },
      { id: 'swipe-cell', name: 'SwipeCell 滑动单元格', status: 'done', kind: 'component' },
      { id: 'count-down', name: 'CountDown 倒计时', status: 'done', kind: 'component' },
      { id: 'table', name: 'Table 表格', status: 'done', kind: 'component' },
      { id: 'swiper', name: 'Swiper 轮播图', status: 'done', kind: 'component' },
      { id: 'scroll-area', name: 'ScrollArea 滚动容器', status: 'done', kind: 'component' },
      { id: 'calendar', name: 'Calendar 日历', status: 'done', kind: 'component' },
      { id: 'aspect-ratio', name: 'AspectRatio 比例容器', status: 'done', kind: 'component' },
    ],
  },
  {
    key: 'feedback',
    title: '反馈',
    items: [
      { id: 'alert', name: 'Alert 提示', status: 'done', kind: 'component' },
      { id: 'loading', name: 'Loading 加载', status: 'done', kind: 'component' },
      { id: 'toast', name: 'Toast 轻提示', status: 'done', kind: 'component' },
      { id: 'dialog', name: 'Dialog 对话框', status: 'done', kind: 'component' },
      { id: 'progress', name: 'Progress 进度条', status: 'done', kind: 'component' },
      { id: 'skeleton', name: 'Skeleton 骨架屏', status: 'done', kind: 'component' },
      { id: 'empty', name: 'Empty 空状态', status: 'done', kind: 'component' },
      { id: 'notice-bar', name: 'NoticeBar 通知栏', status: 'done', kind: 'component' },
      { id: 'result', name: 'Result 结果页', status: 'done', kind: 'component' },
    ],
  },
  {
    key: 'overlay',
    title: '浮层',
    items: [
      { id: 'popup', name: 'Popup 弹出层', status: 'done', kind: 'component' },
      { id: 'popover', name: 'Popover 气泡浮层', status: 'done', kind: 'component' },
      { id: 'sheet', name: 'Sheet 底部面板', status: 'done', kind: 'component' },
      { id: 'action-sheet', name: 'ActionSheet 动作面板', status: 'done', kind: 'component' },
      { id: 'dropdown-menu', name: 'DropdownMenu 下拉菜单', status: 'done', kind: 'component' },
      { id: 'overlay', name: 'Overlay 遮罩', status: 'done', kind: 'component' },
    ],
  },
  {
    key: 'advanced',
    title: '高级',
    items: [
      { id: 'area-chart', name: 'AreaChart 面积图', status: 'done', kind: 'component' },
      { id: 'bar-chart', name: 'BarChart 条形图', status: 'done', kind: 'component' },
      { id: 'donut-chart', name: 'DonutChart 圆环图', status: 'done', kind: 'component' },
      { id: 'radar-chart', name: 'RadarChart 雷达图', status: 'done', kind: 'component' },
      { id: 'sortable-list', name: 'SortableList 排序列表', status: 'done', kind: 'component' },
      { id: 'tour', name: 'Tour 功能引导', status: 'done', kind: 'component' },
      { id: 'waffle', name: 'Waffle 组件点阵图', status: 'done', kind: 'component' },
      { id: 'top-loading', name: 'TopLoading 顶部加载', status: 'done', kind: 'component' },
      { id: 'dynamic-message', name: 'DynamicMessage 灵动通知', status: 'done', kind: 'component' },
      { id: 'pull-refresh', name: 'PullRefresh 下拉刷新', status: 'done', kind: 'component' },
      { id: 'virtual-list', name: 'VirtualList 虚拟列表', status: 'done', kind: 'component' },
      { id: 'sticky', name: 'Sticky 粘性布局', status: 'done', kind: 'component' },
      { id: 'watermark', name: 'Watermark 水印', status: 'done', kind: 'component' },
    ],
  },
];

function shadcnSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function catalogStatus(status, delivery) {
  if (delivery === 'done') return 'done';
  if (status === 'native') return 'done';
  if (status === 'adapter' || status === 'touch-adapter') return 'beta';
  if (status === 'document') return 'done';
  return 'experimental';
}

function splitCatalogName(value) {
  const name = String(value || '').trim();
  const chineseIndex = name.search(/[\u3400-\u9fff]/);
  if (chineseIndex < 0) return { nameEn: name, nameZh: '' };
  return {
    nameEn: name.slice(0, chineseIndex).trim(),
    nameZh: name.slice(chineseIndex).trim(),
  };
}

const catalogChineseFallbacks = {
  'config-provider': '配置提供器',
  'theme-tokens': '主题变量',
  'style-utilities': '样式工具',
  chart: '图表',
};

const sourceCatalogItemById = new Map(
  sourceGroups.flatMap((group) => group.items).map((item) => [item.id, item]),
);

function withCatalogLabels(item, fallbackNameZh) {
  const labels = splitCatalogName(item.name);
  return {
    ...item,
    nameEn: item.nameEn || labels.nameEn,
    nameZh: item.nameZh || labels.nameZh || fallbackNameZh || catalogChineseFallbacks[item.id] || '',
  };
}

const availableComponentIds = new Set(
  sourceGroups.flatMap((group) => group.items)
    .filter((item) => item.kind === 'component')
    .map((item) => item.id),
);

// 外部 shadcn 名称只用来做对照，不应让一个已存在的 PoemUI 实现再出现
// 第二个公开入口。四条旧链接由官网路由层迁移到下面的规范项。
const duplicateCatalogAliasTaxonomyIds = new Set(['button', 'typography', 'direction', 'chart']);

const shadcnCatalogItems = shadcnComponents
  .filter((entry) => !duplicateCatalogAliasTaxonomyIds.has(entry.poem))
  .map((entry) => {
  const mappedId = entry.poem && availableComponentIds.has(entry.poem) ? entry.poem : null;
  const documentPreviewId = entry.status === 'document' && entry.poem === 'typography' ? 'typography' : null;
  const mappedSourceItem = sourceCatalogItemById.get(entry.poem);
  const mappedChineseName = mappedSourceItem ? splitCatalogName(mappedSourceItem.name).nameZh : '';
  return withCatalogLabels({
    id: `shadcn-${shadcnSlug(entry.source)}`,
    name: entry.source,
    nameZh: mappedChineseName,
    status: catalogStatus(entry.status, entry.delivery),
    kind: entry.status === 'document' ? 'document' : 'catalog',
    packageId: mappedId,
    previewId: mappedId || documentPreviewId,
    taxonomyId: entry.poem || '',
    variantOf: mappedSourceItem?.variantOf || '',
    shadcnStatus: entry.status,
    trigger: entry.trigger,
    note: entry.note,
  }, catalogChineseFallbacks[entry.poem]);
  });

const representedComponentIds = new Set(shadcnCatalogItems.map((item) => item.packageId).filter(Boolean));

const foundationSourceItems = sourceGroups.find((group) => group.key === 'getting-started').items;
const foundationItems = foundationSourceItems
  .filter((item) => !['icon', 'button', 'divider', 'typography'].includes(item.id))
  .map((item) => withCatalogLabels(item));
const foundationItemIds = new Set(foundationItems.map((item) => item.id));
const iconItem = foundationSourceItems.find((item) => item.id === 'icon');
const typographyItem = foundationSourceItems.find((item) => item.id === 'typography');
const buttonItem = foundationSourceItems.find((item) => item.id === 'button');
const dividerItem = foundationSourceItems.find((item) => item.id === 'divider');
const foundationExcludeIds = new Set(['icon', 'button', 'divider', 'typography']);
const extensionItems = sourceGroups
  .filter((group) => group.key !== 'foundation')
  .flatMap((group) => group.items)
  .filter((item) => item.kind === 'component' && !representedComponentIds.has(item.id) && !foundationItemIds.has(item.id) && !foundationExcludeIds.has(item.id))
  .map((item) => withCatalogLabels(item));
const navigationItems = shadcnCatalogItems.concat(extensionItems, iconItem ? [withCatalogLabels(iconItem)] : [], typographyItem ? [withCatalogLabels(typographyItem)] : [], buttonItem ? [withCatalogLabels(buttonItem)] : [], dividerItem ? [withCatalogLabels(dividerItem)] : []);

// 目录按用户选择组件时的任务组织，而不是沿用早期源码目录。
// catalog 路由和原生组件都使用同一 taxonomyId，因此一个公开入口只会
// 落到一个稳定分区；外部命名映射不会另起一套分类规则。
const navigationGroupByTaxonomyId = new Map([
  ['getting-started', 'getting-started'],
  ['config-provider', 'getting-started'],
  ['theme-tokens', 'getting-started'],
  ['color', 'getting-started'],
  ['style-utilities', 'getting-started'],
  ['spacing', 'getting-started'],
  ['button', 'foundation'],
  ['icon', 'foundation'],
  ['divider', 'foundation'],
  ['typography', 'foundation'],

  ['direction', 'layout'],
  ['aspect-ratio', 'layout'],
  ['grid', 'layout'],
  ['scroll-area', 'layout'],
  ['sticky', 'layout'],

  ['navbar', 'navigation'],
  ['navigation-menu', 'navigation'],
  ['tabs', 'navigation'],
  ['breadcrumb', 'navigation'],
  ['tabbar', 'navigation'],
  ['steps', 'navigation'],
  ['back-top', 'navigation'],
  ['indexes', 'navigation'],
  ['sidebar', 'navigation'],

  ['input', 'form'],
  ['field', 'form'],
  ['label', 'form'],
  ['input-otp', 'form'],
  ['textarea', 'form'],
  ['switch', 'form'],
  ['checkbox', 'form'],
  ['radio', 'form'],
  ['form', 'form'],
  ['picker', 'form'],
  ['select', 'form'],
  ['combobox', 'form'],
  ['date-time-picker', 'form'],
  ['search', 'form'],
  ['stepper', 'form'],
  ['slider', 'form'],
  ['rate', 'form'],
  ['upload', 'form'],
  ['calendar', 'form'],

  ['cell', 'data'],
  ['card', 'data'],
  ['list', 'data'],
  ['tag', 'data'],
  ['badge', 'data'],
  ['avatar', 'data'],
  ['image', 'data'],
  ['bubble', 'data'],
  ['collapse', 'data'],
  ['collapsible', 'data'],
  ['swipe-cell', 'data'],
  ['count-down', 'data'],
  ['table', 'data'],
  ['swiper', 'data'],

  ['alert', 'feedback'],
  ['loading', 'feedback'],
  ['toast', 'feedback'],
  ['dialog', 'feedback'],
  ['progress', 'feedback'],
  ['skeleton', 'feedback'],
  ['empty', 'feedback'],
  ['notice-bar', 'feedback'],
  ['result', 'feedback'],

  ['popup', 'overlay'],
  ['popover', 'overlay'],
  ['sheet', 'overlay'],
  ['action-sheet', 'overlay'],
  ['dropdown-menu', 'overlay'],
  ['overlay', 'overlay'],

  ['pull-refresh', 'advanced'],
  ['virtual-list', 'advanced'],
  ['watermark', 'advanced'],
  ['area-chart', 'advanced'],
  ['bar-chart', 'advanced'],
  ['waffle', 'advanced'],
  ['chart', 'advanced'],
]);

function navigationGroupKey(item) {
  const taxonomyId = item.taxonomyId || item.packageId || item.id;
  return navigationGroupByTaxonomyId.get(taxonomyId) || 'advanced';
}

const navigationTaxonomy = [
  { key: 'getting-started', title: '开始与规范' },
  { key: 'foundation', title: '基础组件' },
  { key: 'layout', title: '布局' },
  { key: 'navigation', title: '导航' },
  { key: 'form', title: '表单组件' },
  { key: 'data', title: '数据展示' },
  { key: 'feedback', title: '反馈' },
  { key: 'overlay', title: '浮层' },
  { key: 'advanced', title: '高级' },
];

const catalogNavigationItems = foundationItems.concat(navigationItems);

// “表单组件”是一个高密度任务分区。保持其顶层路由归属唯一，同时让侧栏
// 按用户建表单的自然顺序呈现，避免在二十个按英文名排序的条目中猜测能力边界。
const navigationSectionsByGroupKey = new Map([
  ['form', [
    { key: 'structure', title: '结构与校验', taxonomyIds: ['form', 'field', 'label'] },
    { key: 'text', title: '文本与搜索', taxonomyIds: ['input', 'input-otp', 'textarea', 'search'] },
    { key: 'selection', title: '选择与数值', taxonomyIds: ['checkbox', 'radio', 'switch', 'select', 'picker', 'combobox', 'slider', 'stepper', 'rate', 'calendar', 'date-time-picker', 'upload'] },
  ]],
]);

function navigationSectionsFor(groupKey, items) {
  const definitions = navigationSectionsByGroupKey.get(groupKey);
  if (!definitions) return [];
  const byTaxonomyId = new Map(items.map((item) => [item.taxonomyId || item.packageId || item.id, item]));
  const assignedIds = new Set();
  const sections = definitions
    .map((section) => {
      const sectionItems = section.taxonomyIds.map((id) => byTaxonomyId.get(id)).filter(Boolean);
      sectionItems.forEach((item) => assignedIds.add(item.id));
      return { key: section.key, title: section.title, items: sectionItems };
    })
    .filter((section) => section.items.length);
  const unassigned = items.filter((item) => !assignedIds.has(item.id));
  return unassigned.length ? sections.concat({ key: 'other', title: '其他表单能力', items: unassigned }) : sections;
}

// 基础组件不是按外部目录拼接顺序排列：先给出可操作原语，再把同一分隔能力
// 的 Divider 与其他基础能力保持稳定顺序，避免目录随来源漂移。
const navigationOrderByGroupKey = new Map([
  ['getting-started', new Map([
    ['getting-started', 0],
    ['config-provider', 1],
    ['theme-tokens', 2],
    ['color', 3],
    ['style-utilities', 4],
    ['spacing', 5],
  ])],
  ['foundation', new Map([
    ['button', 0],
    ['divider', 1],
    ['icon', 2],
    ['typography', 3],
  ])],
  ['form', new Map([
    ['form', 0],
    ['field', 1],
    ['label', 2],
    ['input', 3],
    ['input-otp', 4],
    ['textarea', 5],
    ['search', 6],
    ['checkbox', 7],
    ['radio', 8],
    ['switch', 9],
    ['select', 10],
    ['picker', 11],
    ['combobox', 12],
    ['slider', 13],
    ['stepper', 14],
    ['rate', 15],
    ['calendar', 16],
    ['date-time-picker', 17],
    ['upload', 18],
  ])],
]);

function navigationItemSort(groupKey, left, right) {
  const order = navigationOrderByGroupKey.get(groupKey);
  if (order) {
    const leftTaxonomyId = left.taxonomyId || left.packageId || left.id;
    const rightTaxonomyId = right.taxonomyId || right.packageId || right.id;
    const leftOrder = order.has(leftTaxonomyId) ? order.get(leftTaxonomyId) : Number.POSITIVE_INFINITY;
    const rightOrder = order.has(rightTaxonomyId) ? order.get(rightTaxonomyId) : Number.POSITIVE_INFINITY;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  }
  const leftName = String(left.nameEn || left.name || '').toLocaleLowerCase();
  const rightName = String(right.nameEn || right.name || '').toLocaleLowerCase();
  return leftName.localeCompare(rightName, 'en');
}

const groups = navigationTaxonomy.map((group) => {
  // 开始与规范和基础组件按明确的任务顺序，
  // 其余分区按用户可见名称稳定排序，不让 shadcn/legacy 的拼接先后决定位置。
  const items = catalogNavigationItems
    .filter((item) => navigationGroupKey(item) === group.key)
    .sort((left, right) => navigationItemSort(group.key, left, right));
  return {
    key: group.key,
    title: group.title,
    items,
    sections: navigationSectionsFor(group.key, items),
  };
});

// Only these component directories have dedicated native implementations.
// The remaining historical directories stay installable for now, but their
// generated compatibility shells are not part of the public release contract.
const releaseComponentIds = new Set([
  'config-provider',
  'direction',
  'button',
  'cell',
  'tag',
  'loading',
  'top-loading',
  'dynamic-message',
  'icon',
  'alert',
  'aspect-ratio',
  'badge',
  'bubble',
  'divider',
  'breadcrumb',
  'card',
  'avatar',
  'image',
  'grid',
  'field',
  'input-otp',
  'label',
  'navbar',
  'navigation-menu',
  'popover',
  'scroll-area',
  'select',
  'combobox',
  'sheet',
  'popup',
  'action-sheet',
  'dropdown-menu',
  'overlay',
  'input',
  'switch',
  'textarea',
  'checkbox',
  'radio',
  'form',
  'search',
  'stepper',
  'slider',
  'picker',
  'date-time-picker',
  'rate',
  'upload',
  'progress',
  'skeleton',
  'empty',
  'notice-bar',
  'result',
  'tabs',
  'tabbar',
  'steps',
  'back-top',
  'indexes',
  'sidebar',
  'toast',
  'dialog',
  'list',
  'collapse',
  'collapsible',
  'swipe-cell',
  'count-down',
  'table',
  'swiper',
  'calendar',
  'area-chart',
  'bar-chart',
  'donut-chart',
  'radar-chart',
  'sortable-list',
  'tour',
  'waffle',
  'pull-refresh',
  'virtual-list',
  'sticky',
  'watermark',
]);

for (const group of groups) {
  for (const item of group.items) {
    const packageId = item.packageId || item.id;
    if (item.kind === 'component' && packageId && !releaseComponentIds.has(packageId)) {
      item.status = 'experimental';
    }
  }
}

const componentSummaries = {
  'getting-started': '安装、构建并让 AI 正确使用 PoemUI。',
  'config-provider': '统一配置组件的主题与视觉效果。',
  'theme-tokens': '查看并复用 PoemUI 设计变量。',
  color: '查看组件使用的语义色彩。',
  spacing: '查看组件使用的间距层级。',
  'style-utilities': '组合常用布局与视觉样式。',
  typography: '查看字体、字号与行高规范。',
  button: '用于触发即时操作。',
  icon: '展示本地矢量图形；操作入口请组合 Button。',
  'aspect-ratio': '按固定比例承载内容。',
  direction: '统一控制内容阅读方向。',

  'scroll-area': '在固定区域内滚动内容，并按真实滚动边缘提供渐变提示。',
  divider: '用分割线建立内容层级。',
  grid: '按网格排列功能入口。',
  sticky: '让内容在滚动时保持可见。',
  breadcrumb: '展示当前位置与返回路径。',
  'navigation-menu': '组织多层导航入口。',
  sidebar: '在侧边快速切换分类。',
  tabs: '在同层内容分类间切换。',
  navbar: '承载页面标题、返回意图与微信原生胶囊安全区。',
  tabbar: '在核心功能页之间切换。',
  steps: '展示流程进度与当前步骤。',
  'back-top': '快速返回长页顶部。',
  indexes: '按字母或分类快速定位。',
  upload: '选择文件并展示消费者回写的状态。',
  calendar: '选择单个日期、日期范围或多个日期。',
  checkbox: '在多个选项中进行多选。',
  combobox: '从预设选项中选择；搜索请组合 Search。',

  'date-time-picker': '选择日期与时间。',
  field: '组合字段标签、控件、帮助与校验反馈。',
  label: '为表单控件提供标签。',
  input: '输入少量单行文字，支持清空、状态提示与键盘确认。',
  'input-otp': '输入一次性验证码。',
  select: '从预设选项中选择。',
  radio: '在一组选项中单选。',
  slider: '在连续范围内选择数值。',
  switch: '切换一个独立功能的开关。',
  textarea: '输入多行文本内容。',


  form: '组织、校验并提交表单。',
  picker: '通过滚动列选择内容。',
  search: '输入关键词并执行搜索。',
  stepper: '按固定步长增减数值。',
  rate: '对内容进行等级评分。',
  collapse: '展开或收起多组内容。',
  avatar: '展示人物或对象头像。',
  badge: '在对象旁展示数量或提醒。',
  bubble: '以气泡展示对话消息。',
  card: '将相关内容组织为一组。',
  swiper: '轮播展示多个内容项。',
  collapsible: '展开或收起一段内容。',
  table: '以行列展示结构化数据。',
  cell: '展示单行信息或操作入口。',
  tag: '用简短文字标记属性或状态。',
  image: '加载并展示图片内容。',
  list: '按顺序展示多条内容。',
  'swipe-cell': '滑动单元格显示快捷操作。',
  'count-down': '展示距离目标时间的倒计时。',
  alert: '展示需要注意的页面消息。',
  dialog: '用于确认或承载关键操作。',
  empty: '在没有内容时提供下一步。',
  toast: '短暂反馈操作结果。',
  'notice-bar': '在页面内持续展示公告。',
  progress: '展示已知任务的确定完成进度。',
  skeleton: '为内容加载过程预示结构。',

  loading: '展示任务正在处理。',
  'top-loading': '在当前卡片或内容表面顶边反馈请求进度。',
  'dynamic-message': '在页面顶部展示可原位更新的非模态实时通知。',
  'area-chart': '用曲线与透明渐变展示连续趋势。',
  'bar-chart': '用共享零基线比较分类数值与分段增量。',
  'donut-chart': '用圆润圆环展示组成、占比与总量。',
  'radar-chart': '从多个维度比较一组或多组能力轮廓。',
  'sortable-list': '通过长按拖动调整连续列表顺序。',
  tour: '围绕页面目标逐步介绍关键操作。',
  waffle: '用圆润点阵表达总量、占比与新增单元。',
  result: '展示流程完成后的结果状态。',

  'dropdown-menu': '从触发项下方展开选项。',
  popover: '在对象旁展示轻量内容。',
  sheet: '从屏幕底部承载任务内容。',
  popup: '从屏幕边缘展开浮层内容。',
  'action-sheet': '从底部展示一组可选操作。',
  overlay: '遮罩当前页面以聚焦内容。',
  'pull-refresh': '在组件内部滚动区下拉请求刷新。',
  'virtual-list': '高效渲染大量列表数据。',
  watermark: '在内容上绘制文本或图片水印。',
};

const details = {
  'getting-started': {
    desc: '从安装、微信构建到 AI Skill 的 PoemUI 受限 Beta 接入路径。',
    path: 'https://www.npmjs.com/package/poemui-miniprogram',
    states: '发布状态、安装、构建 npm、按需引用、主题配置、AI Skill、许可证',
    props: [],
  },
  'config-provider': {
    desc: '在页面根统一控制主题、阴影、毛玻璃、大圆角、组件边框和独立 Surface 等距模式；useGlobalConfig 可订阅安装包公开 visualConfig Store，实现跨页面共享视觉配置。',
    path: 'poemui-miniprogram/config-provider/config-provider',
    states: 'theme、shadow、frostedGlass、largeRadius、bordered、equalSpacing、useGlobalConfig、visualConfig Store',
    props: [
      { key: 'theme', label: 'theme', type: 'select', value: 'light', options: ['light', 'dark', 'auto'] },
      { key: 'shadow', label: 'shadow', type: 'boolean', value: false },
      { key: 'frostedGlass', label: 'frosted-glass', type: 'boolean', value: false },
      { key: 'largeRadius', label: 'large-radius', type: 'boolean', value: false },
      { key: 'bordered', label: 'bordered', type: 'boolean', value: true },
      { key: 'equalSpacing', label: 'equal-spacing', type: 'boolean', value: false },
      { key: 'useGlobalConfig', label: 'use-global-config', type: 'boolean', value: false },
      { key: 'customClass', label: 'custom-class', type: 'text', value: '' },
      { key: 'customStyle', label: 'custom-style', type: 'text', value: '' },
    ],
  },
  direction: {
    desc: '为整个子树提供 ltr、rtl 或基于语言解析的 auto 阅读方向，映射文本起止对齐与 flex inline 起点，并保留平台级 RTL 边界。',
    path: 'poemui-miniprogram/direction/direction',
    states: 'ltr/rtl/auto、语言解析、fallback、逻辑对齐、容器 display、slot/content、变更生命周期',
  },
  'theme-tokens': {
    desc: 'PoemUI 的设计 token 入口，覆盖深浅色、表面层、圆角、阴影和语义色。',
    path: 'poemui-miniprogram/theme/theme.wxss',
    states: 'light、dark、frost/shadow/radius',
    props: [{ key: 'tokenGroup', label: 'token 组', type: 'select', value: 'surface', options: ['surface', 'color', 'radius', 'shadow'] }],
  },
  color: {
    desc: '随 npm 发布的黑白品牌色、语义色、中性色与八组精选强调色 Token；深浅色值直接由 common/style/theme.wxss 构建到文档页。',
    path: 'poemui-miniprogram/theme/theme.wxss',
    states: 'light/dark、brand 1–10、success/warning/danger/info、8 组 accent、text/surface/border',
    props: [
      { key: 'palette', label: '色板', type: 'select', value: 'brand', options: ['brand', 'semantic', 'accent', 'neutral'] },
      { key: 'mode', label: '模式', type: 'select', value: 'compare', options: ['compare', 'current', 'light', 'dark'] },
      { key: 'showValues', label: '显示色值', type: 'boolean', value: true },
      { key: 'compact', label: '紧凑排列', type: 'boolean', value: false },
    ],
  },
  typography: {
    desc: '随 npm 发布的微信小程序字体 Token 与角色工具类；官网从 theme.wxss 构建真实字号、行高、字重和截断规范。',
    path: 'poemui-miniprogram/theme/utilities.wxss',
    states: 'display/headline/title/body/label/caption、font weight、truncate/clamp',
    props: [
      { key: 'category', label: '角色', type: 'select', value: 'all', options: ['all', 'hierarchy', 'content', 'interface'] },
      { key: 'sample', label: '示例文本', type: 'select', value: 'mixed', options: ['mixed', 'chinese', 'latin', 'numeric'] },
      { key: 'showMetrics', label: '显示指标', type: 'boolean', value: true },
      { key: 'compact', label: '紧凑排列', type: 'boolean', value: false },
    ],
  },
  spacing: {
    desc: '随 npm 发布的 4–72rpx 间距 Token 与 margin、padding、gap 工具类；官网直接读取 theme.wxss 构建真实比例。',
    path: 'poemui-miniprogram/theme/utilities.wxss',
    states: 'xxs/xs/sm/normal/lg/xl/xxl/3xl、margin/padding/gap、axis utilities',
    props: [
      { key: 'scale', label: '选中档位', type: 'select', value: 'normal', options: ['xxs', 'xs', 'sm', 'normal', 'lg', 'xl', 'xxl', '3xl'] },
      { key: 'usage', label: '用法', type: 'select', value: 'padding', options: ['padding', 'gap', 'margin'] },
      { key: 'showValues', label: '显示数值', type: 'boolean', value: true },
      { key: 'compact', label: '紧凑排列', type: 'boolean', value: false },
    ],
  },
  'style-utilities': {
    desc: '面向微信小程序的 utility-first 快速样式层，提供可直接赋给 View 与容器的主题感知背景渐变，以及显式 dark 条件变体。',
    path: 'poemui-miniprogram/theme/utilities.wxss',
    states: '562 selectors、五个浏览分类、32 个精选色彩 utility、9 个背景渐变预设、32 个 dark variants、Grid 1–6 列、safe-area、reduce-motion',
    props: [
      { key: 'category', label: 'category', type: 'select', value: 'all', options: ['all', 'layout', 'size', 'spacing', 'typography', 'background'] },
      { key: 'themeView', label: 'theme-view', type: 'select', value: 'compare', options: ['compare', 'current', 'light', 'dark'] },
      { key: 'scale', label: 'scale', type: 'select', value: 'normal', options: ['xxs', 'xs', 'sm', 'normal', 'lg', 'xl', 'xxl', '3xl'] },
      { key: 'layout', label: 'layout', type: 'select', value: 'flex', options: ['flex', 'column', 'grid'] },
      { key: 'columns', label: 'columns', type: 'select', value: '3', options: ['2', '3', '4'] },
      { key: 'align', label: 'align', type: 'select', value: 'center', options: ['start', 'center', 'end', 'between'] },
      { key: 'fullWidth', label: 'full-width', type: 'boolean', value: true },
      { key: 'wrap', label: 'wrap', type: 'boolean', value: true },
      { key: 'shadow', label: 'shadow', type: 'boolean', value: true },
    ],
  },
  icon: {
    desc: 'PoemUI Roundline 叶子图标，以 Lucide 构形为底稿，将 17 个分类、209 个本地单色矢量源生成稳定码点的离线 Icon Font；其中组件分类收录 9 个已落地组件专属图形。交互请组合 Button。',
    path: 'poemui-miniprogram/icon/icon',
    states: 'Icon Font 名称、8–256rpx、currentColor/Token、未知名称回退、可访问名称、分类筛选',
  },
  button: {
    desc: '基于微信原生 button 能力的可组合操作组件，以精简核心 API 承接主题、变体、尺寸、形状、Icon、Loading 与 slot，并在独立平台分组中保留表单和 open-type 能力。',
    path: 'poemui-miniprogram/button/button',
    states: '三类主题、五种变体、独立/透明表面、尺寸/形状、加载/禁用、open-type、form-type、三类 slot、低动效',
  },

  checkbox: {
    desc: '声明式复选控件与真实 CheckboxGroup，支持严格原始值、全选半选、最大选择数、父级状态继承和三类内容 Slot。',
    path: 'poemui-miniprogram/checkbox/checkbox',
    states: '单项/组、受控/非受控、全选/半选、max、原始值、状态继承、slot、change 与低动效',
    props: [
      { key: 'checked', label: 'checked', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'defaultChecked', label: 'default-checked', type: 'boolean', value: false },
      { key: 'value', label: 'value', type: 'json', value: 'release' },
      { key: 'label', label: 'label', type: 'text', value: '同意组件发布规范' },
      { key: 'content', label: 'content', type: 'text', value: '提交前会运行站点、组件和 npm 产物检查。' },
      { key: 'icon', label: 'icon', type: 'select', value: 'circle', options: ['circle', 'line', 'rectangle', 'none'] },
      { key: 'indeterminate', label: 'indeterminate', type: 'boolean', value: false },
      { key: 'checkAll', label: 'check-all', type: 'boolean', value: false },
      { key: 'block', label: 'block', type: 'boolean', value: true },
      { key: 'borderless', label: 'borderless', type: 'nullable-boolean', value: false, apiType: 'boolean | null' },
      { key: 'contentDisabled', label: 'content-disabled', type: 'boolean', value: false },
      { key: 'disabled', label: 'disabled', type: 'nullable-boolean', value: false, apiType: 'boolean | null' },
      { key: 'readonly', label: 'readonly', type: 'nullable-boolean', value: false, apiType: 'boolean | null' },
      { key: 'name', label: 'name', type: 'text', value: 'release-terms' },
      { key: 'placement', label: 'placement', type: 'select', value: 'left', options: ['left', 'right'] },
      { key: 'maxLabelRow', label: 'max-label-row', type: 'range', value: 3, min: 1, max: 8, step: 1 },
      { key: 'maxContentRow', label: 'max-content-row', type: 'range', value: 5, min: 1, max: 12, step: 1 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '同意组件发布规范' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  collapsible: {
    desc: '单触发器、单内容区的原生折叠容器，提供受控/非受控显隐、动态高度测量、trigger/default slot、完整状态、事件和实例方法。',
    path: 'poemui-miniprogram/collapsible/collapsible',
    states: '受控/非受控、动态高度、trigger/content slot、loading/error/empty、retry、低动效',
    props: [
      { key: 'open', label: 'open', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'defaultOpen', label: 'default-open', type: 'boolean', value: true },
      { key: 'label', label: 'label', type: 'text', value: '发布设置' },
      { key: 'content', label: 'content', type: 'text', value: '调整圆角、阴影和动效后，再执行完整发布门禁。' },
      { key: 'customTrigger', label: 'custom-trigger', type: 'boolean', value: false },
      { key: 'customContent', label: 'custom-content', type: 'boolean', value: true },
      { key: 'icon', label: 'icon', type: 'text', value: 'command' },
      { key: 'expandIcon', label: 'expand-icon', type: 'boolean', value: true },
      { key: 'iconPosition', label: 'icon-position', type: 'select', value: 'right', options: ['left', 'right'] },
      { key: 'theme', label: 'theme', type: 'select', value: 'default', options: ['default', 'primary', 'success', 'warning', 'danger'] },
      { key: 'bordered', label: 'bordered', type: 'boolean', value: true },
      { key: 'shadow', label: 'shadow', type: 'boolean', value: true },
      { key: 'block', label: 'block', type: 'boolean', value: true },
      { key: 'disabled', label: 'disabled', type: 'boolean', value: false },
      { key: 'readonly', label: 'readonly', type: 'boolean', value: false },
      { key: 'loading', label: 'loading', type: 'boolean', value: false },
      { key: 'loadingText', label: 'loading-text', type: 'text', value: '设置加载中…' },
      { key: 'error', label: 'error', type: 'boolean', value: false },
      { key: 'errorText', label: 'error-text', type: 'text', value: '设置加载失败' },
      { key: 'retryText', label: 'retry-text', type: 'text', value: '重试' },
      { key: 'emptyText', label: 'empty-text', type: 'text', value: '暂无设置' },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '发布设置折叠区' },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 10 },
      { key: 'easing', label: 'easing', type: 'select', value: 'standard', options: ['standard', 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'] },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  combobox: {
    desc: '原生触摸 Combobox，提供受控/非受控选值与显隐、单选/多选、分组、固定高度滚动视口、状态、slot、事件与实例方法；搜索由独立 Search 组件组合。',
    path: 'poemui-miniprogram/combobox/combobox',
    states: '选值与显隐受控、单选/多选、分组、固定滚动视口、loading/error/empty、slot、固定高度动效',
    props: [
      { key: 'options', label: 'options', type: 'json', value: [
        { label: '框架', options: [
          { label: 'Next.js', value: 'next', description: 'React 全栈框架', icon: 'component', keywords: ['react'] },
          { label: 'Nuxt', value: 'nuxt', description: 'Vue 全栈框架', icon: 'layers', keywords: ['vue'] },
          { label: 'SvelteKit', value: 'svelte', description: 'Svelte 应用框架', icon: 'spark' },
        ] },
        { label: '工具', options: [
          { label: 'Astro', value: 'astro', description: '内容驱动站点', icon: 'orbit' },
          { label: 'Remix', value: 'remix', description: 'Web 标准框架', icon: 'route' },
          { label: '已停用', value: false, description: 'disabled + false 原始值', icon: 'lock', disabled: true },
        ] },
      ], apiType: 'ComboboxGroup[] | ComboboxOption[]' },
      { key: 'value', label: 'value', type: 'json', value: null, apiType: 'Value | Value[] | null' },
      { key: 'defaultValue', label: 'default-value', type: 'json', value: 'next', apiType: 'Value | Value[] | null' },
      { key: 'visible', label: 'visible', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'defaultVisible', label: 'default-visible', type: 'boolean', value: true },
      { key: 'multiple', label: 'multiple', type: 'boolean', value: false },
      { key: 'maxSelected', label: 'max-selected', type: 'range', value: 3, min: 0, max: 8, step: 1 },
      { key: 'placeholder', label: 'placeholder', type: 'text', value: '选择框架' },
      { key: 'clearable', label: 'clearable', type: 'boolean', value: true },
      { key: 'showIcon', label: 'show-icon', type: 'boolean', value: true },
      { key: 'showDescription', label: 'show-description', type: 'boolean', value: true },
      { key: 'showGroup', label: 'show-group', type: 'boolean', value: true },
      { key: 'showCheck', label: 'show-check', type: 'boolean', value: true },
      { key: 'closeOnSelect', label: 'close-on-select', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'customTrigger', label: 'custom-trigger', type: 'boolean', value: false },
      { key: 'customEmpty', label: 'custom-empty', type: 'boolean', value: false },
      { key: 'customFooter', label: 'custom-footer', type: 'boolean', value: true },
      { key: 'placement', label: 'placement', type: 'select', value: 'bottom', options: ['bottom', 'top'] },
      { key: 'size', label: 'size', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] },
      { key: 'shape', label: 'shape', type: 'select', value: 'rectangle', options: ['rectangle', 'round'] },
      { key: 'bordered', label: 'bordered', type: 'boolean', value: true },
      { key: 'block', label: 'block', type: 'boolean', value: true },
      { key: 'disabled', label: 'disabled', type: 'boolean', value: false },
      { key: 'readonly', label: 'readonly', type: 'boolean', value: false },
      { key: 'loading', label: 'loading', type: 'boolean', value: false },
      { key: 'loadingText', label: 'loading-text', type: 'text', value: '框架加载中…' },
      { key: 'error', label: 'error', type: 'boolean', value: false },
      { key: 'errorText', label: 'error-text', type: 'text', value: '框架加载失败' },
      { key: 'retryText', label: 'retry-text', type: 'text', value: '重试' },
      { key: 'emptyText', label: 'empty-text', type: 'text', value: '没有匹配框架' },
      { key: 'listHeight', label: 'list-height', type: 'range', value: 480, min: 160, max: 800, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '框架组合框' },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 10 },
      { key: 'easing', label: 'easing', type: 'select', value: 'standard', options: ['standard', 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'] },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },


  picker: {
    desc: '基于原生 picker-view 的滚轮选择器，支持单列、多列、级联、值与显隐双受控，以及默认 Header 操作与 Classic 底部操作。',
    path: 'poemui-miniprogram/picker/picker',
    states: '单列/多列/级联、值与显隐受控、默认 Header/Classic、Popup/内联、禁用项、loading/error/empty、事件、方法、低动效',
    props: [
      { key: 'columns', label: 'columns', type: 'json', value: [
        { label: '基础组件', value: 'basic', children: [{ label: 'Button', value: 'button', icon: 'component' }, { label: 'Icon', value: 0, icon: 'spark' }] },
        { label: '表单组件', value: 'input', children: [{ label: 'Input', value: 'input' }, { label: 'Picker', value: false }, { label: '停用项', value: '', disabled: true }] },
      ], apiType: 'PickerOption[] | PickerOption[][]' },
      { key: 'value', label: 'value', type: 'json', value: null, apiType: 'Array<string | number | boolean> | null' },
      { key: 'defaultValue', label: 'default-value', type: 'json', value: ['basic', 0], apiType: 'Array<string | number | boolean>' },
      { key: 'visible', label: 'visible', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'defaultVisible', label: 'default-visible', type: 'boolean', value: false },
      { key: 'title', label: 'title', type: 'text', value: '选择组件' },
      { key: 'type', label: 'type', type: 'select', value: 'default', options: ['default', 'classic'], apiType: "'default' | 'classic'" },
      { key: 'cancelText', label: 'cancel-text', type: 'text', value: '取消' },
      { key: 'confirmText', label: 'confirm-text', type: 'text', value: '确定' },
      { key: 'showHeader', label: 'show-header', type: 'boolean', value: true },
      { key: 'usePopup', label: 'use-popup', type: 'boolean', value: true },
      { key: 'closeOnOverlayClick', label: 'close-on-overlay-click', type: 'boolean', value: true },
      { key: 'autoClose', label: 'auto-close', type: 'boolean', value: true },
      { key: 'keys', label: 'keys', type: 'json', value: {}, apiType: '{ label?, value?, children?, disabled?, icon? }' },
      { key: 'visibleItemCount', label: 'visible-item-count', type: 'range', value: 5, min: 3, max: 7, step: 2 },
      { key: 'itemHeight', label: 'item-height', type: 'range', value: 80, min: 64, max: 112, step: 8 },
      { key: 'disabled', label: 'disabled', type: 'boolean', value: false },
      { key: 'readonly', label: 'readonly', type: 'boolean', value: false },
      { key: 'loading', label: 'loading', type: 'boolean', value: false },
      { key: 'loadingText', label: 'loading-text', type: 'text', value: '选项加载中' },
      { key: 'error', label: 'error', type: 'boolean', value: false },
      { key: 'errorText', label: 'error-text', type: 'text', value: '选项加载失败' },
      { key: 'retryText', label: 'retry-text', type: 'text', value: '重试' },
      { key: 'emptyText', label: 'empty-text', type: 'text', value: '暂无可选项' },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '组件滚轮选择器' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  'date-time-picker': {
    desc: '把日期时间范围转换为 PUI Picker 滚轮列，支持年到秒精度、范围步长、格式、值与显隐双受控、默认图标 Header / Classic 底部操作以及 Popup/内联草稿确认。',
    path: 'poemui-miniprogram/date-time-picker/date-time-picker',
    states: '年/月/日/时/分/秒、范围/步长/周几、值与显隐双受控、Popup/内联、禁用/只读、事件、方法、低动效',
    props: [
      { key: 'value', label: 'value', type: 'json', value: null, apiType: 'string | number | null' },
      { key: 'defaultValue', label: 'default-value', type: 'json', value: '2026-07-15 09:30', apiType: 'string | number | null' },
      { key: 'visible', label: 'visible', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'defaultVisible', label: 'default-visible', type: 'boolean', value: false },
      { key: 'mode', label: 'mode', type: 'json', value: ['date', 'minute'], apiType: "'year' | 'month' | 'date' | 'hour' | 'minute' | 'second' | [DateMode, TimeMode]" },
      { key: 'start', label: 'start', type: 'json', value: '2026-01-01 00:00', apiType: 'string | number | null' },
      { key: 'end', label: 'end', type: 'json', value: '2026-12-31 23:59', apiType: 'string | number | null' },
      { key: 'format', label: 'format', type: 'text', value: 'YYYY-MM-DD HH:mm' },
      { key: 'steps', label: 'steps', type: 'json', value: { minute: 15 }, apiType: 'Partial<Record<TimeUnit, number>>' },
      { key: 'showWeek', label: 'show-week', type: 'boolean', value: true },
      { key: 'title', label: 'title', type: 'text', value: '选择发布时间' },
      { key: 'type', label: 'type', type: 'select', value: 'default', options: ['default', 'classic'] },
      { key: 'cancelText', label: 'cancel-text', type: 'text', value: '取消' },
      { key: 'confirmText', label: 'confirm-text', type: 'text', value: '确定' },
      { key: 'showHeader', label: 'show-header', type: 'boolean', value: true },
      { key: 'usePopup', label: 'use-popup', type: 'boolean', value: true },
      { key: 'autoClose', label: 'auto-close', type: 'boolean', value: true },
      { key: 'closeOnOverlayClick', label: 'close-on-overlay-click', type: 'boolean', value: true },
      { key: 'disabled', label: 'disabled', type: 'boolean', value: false },
      { key: 'readonly', label: 'readonly', type: 'boolean', value: false },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '发布时间选择器' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  cell: { desc: 'Field 行的只读形态，用于列表信息、入口与轻量选择，支持内容组合、受控状态和真实微信导航。', states: '只读字段、单行、多行、媒体、选择、禁用、加载、导航、slot、低动效' },
  badge: { desc: '在对象旁展示数量、短文字或红点；交互和业务状态由 Button、Cell、Tabs、Tabbar 等宿主承担。', states: '数量/文字、dot、上限/零值、主题/变体、尺寸/形状、默认/count slot、右上角偏移' },
  tag: { desc: '用简短文字、Icon 和语义外观标记属性或状态；关闭由父级真实回写。', states: '主题/变体、尺寸/形状、Icon/Slot、安全宽度、关闭/禁用' },
  loading: { desc: '展示页面或操作正在处理的反馈，不代表业务已经完成。', states: '环形、刻度、圆点、文字、延迟、全屏、低动效' },
  'top-loading': {
    desc: '依附当前 Card 或业务 Surface 顶边的轻量加载轨道，支持未知总量、精确进度、延迟显示、最短可见时间和显式完成态。',
    path: 'poemui-miniprogram/top-loading/top-loading',
    states: 'idle/loading/success、null/0/100、delay、minimumVisible、retained node、低动效',
    props: [
      { key: 'state', label: 'state', type: 'select', value: 'idle', options: ['idle', 'loading', 'success'] },
      { key: 'progress', label: 'progress', type: 'json', value: null, apiType: 'number | null' },
      { key: 'delay', label: 'delay', type: 'range', value: 220, min: 0, max: 5000, step: 20 },
      { key: 'minimumVisible', label: 'minimum-visible', type: 'range', value: 500, min: 0, max: 60000, step: 100 },
      { key: 'successDuration', label: 'success-duration', type: 'range', value: 700, min: 0, max: 60000, step: 100 },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  'dynamic-message': {
    desc: '页面顶部非模态灵动通知，以保留节点的紧凑展开动效承接 loading 到结果的原位更新，并按 key 提供真实队列。',
    path: 'poemui-miniprogram/dynamic-message/dynamic-message',
    states: '五种主题、同 key update、不同 key 队列、自动/手动关闭、Action、安全区、低动效',
    props: [
      { key: 'theme', label: 'theme', type: 'select', value: 'info', options: ['loading', 'info', 'success', 'warning', 'error'] },
      { key: 'title', label: 'title', type: 'text', value: '' },
      { key: 'message', label: 'message', type: 'text', value: '' },
      { key: 'icon', label: 'icon', type: 'text', value: '' },
      { key: 'actionText', label: 'action-text', type: 'text', value: '' },
      { key: 'closable', label: 'closable', type: 'boolean', value: true },
      { key: 'duration', label: 'duration', type: 'range', value: 3000, min: 0, max: 60000, step: 100 },
      { key: 'safeArea', label: 'safe-area', type: 'boolean', value: true },
      { key: 'shadow', label: 'shadow', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'frostedGlass', label: 'frosted-glass', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  'area-chart': {
    desc: '使用原生 Canvas 2D 绘制连续面积趋势；强调色描边保持清晰，填充沿竖向渐变到透明，H5 使用同数据合同的 SVG 镜像。',
    path: 'poemui-miniprogram/area-chart/area-chart',
    states: '自然/线性/阶梯曲线、叠加/堆叠、共享零基线、六种强调色、横向参考线、横轴、图例、默认入场与低动效',
    props: [
      { key: 'items', label: 'items', type: 'json', value: [
        { key: 'jan', label: '1月', segments: [{ key: 'desktop', label: '桌面端', value: 186, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 80, theme: 'teal' }] },
        { key: 'feb', label: '2月', segments: [{ key: 'desktop', label: '桌面端', value: 305, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 200, theme: 'teal' }] },
        { key: 'mar', label: '3月', segments: [{ key: 'desktop', label: '桌面端', value: 237, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 120, theme: 'teal' }] },
        { key: 'apr', label: '4月', segments: [{ key: 'desktop', label: '桌面端', value: 73, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 190, theme: 'teal' }] },
        { key: 'may', label: '5月', segments: [{ key: 'desktop', label: '桌面端', value: 209, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 130, theme: 'teal' }] },
        { key: 'jun', label: '6月', segments: [{ key: 'desktop', label: '桌面端', value: 214, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 140, theme: 'teal' }] },
      ], apiType: 'AreaChartItem[]' },
      { key: 'max', label: 'max', type: 'range', value: 0, min: 0, max: 1000, step: 10 },
      { key: 'curve', label: 'curve', type: 'select', value: 'natural', options: ['natural', 'linear', 'step'] },
      { key: 'stacked', label: 'stacked', type: 'boolean', value: false },
      { key: 'size', label: 'size', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] },
      { key: 'showGrid', label: 'show-grid', type: 'boolean', value: true },
      { key: 'showXAxis', label: 'show-x-axis', type: 'boolean', value: true },
      { key: 'showLegend', label: 'show-legend', type: 'boolean', value: true },
      { key: 'showDots', label: 'show-dots', type: 'boolean', value: false },
      { key: 'animated', label: 'animated', type: 'boolean', value: true },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '访问趋势' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  'donut-chart': {
    desc: '使用原生 Canvas 2D 绘制圆润占比圆环；弧段从低透明度渐进至实色端点，H5 使用同数据合同的 SVG 镜像。',
    path: 'poemui-miniprogram/donut-chart/donut-chart',
    states: '六种强调色、圆环厚度、起始角、弧段间隔、中心总量、图例、默认入场与低动效',
    props: [
      { key: 'items', label: 'items', type: 'json', value: [
        { key: 'basic', label: '基础', value: 24, theme: 'blue' },
        { key: 'form', label: '表单', value: 18, theme: 'teal' },
        { key: 'advanced', label: '高级', value: 13, theme: 'violet' },
      ], apiType: 'DonutChartItem[]' },
      { key: 'thickness', label: 'thickness', type: 'range', value: 40, min: 16, max: 80, step: 2 },
      { key: 'startAngle', label: 'start-angle', type: 'range', value: -90, min: -180, max: 180, step: 5 },
      { key: 'gapAngle', label: 'gap-angle', type: 'range', value: 3, min: 0, max: 12, step: 1 },
      { key: 'size', label: 'size', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] },
      { key: 'showCenter', label: 'show-center', type: 'boolean', value: true },
      { key: 'centerText', label: 'center-text', type: 'text', value: '' },
      { key: 'showLegend', label: 'show-legend', type: 'boolean', value: true },
      { key: 'animated', label: 'animated', type: 'boolean', value: true },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '组件分类占比' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  'radar-chart': {
    desc: '使用原生 Canvas 2D 比较三至八个维度；网格保持低对比，数据面从中心渐变到透明边缘，H5 使用同数据合同的 SVG 镜像。',
    path: 'poemui-miniprogram/radar-chart/radar-chart',
    states: '3–8 维度、1–4 系列、2–8 网格级别、六种强调色、实色轮廓与端点、默认入场与低动效',
    props: [
      { key: 'indicators', label: 'indicators', type: 'json', value: [
        { key: 'api', label: 'API', max: 100 },
        { key: 'theme', label: '主题', max: 100 },
        { key: 'motion', label: '动效', max: 100 },
        { key: 'a11y', label: '无障碍', max: 100 },
        { key: 'docs', label: '文档', max: 100 },
      ], apiType: 'RadarIndicator[]' },
      { key: 'series', label: 'series', type: 'json', value: [
        { key: 'current', label: '当前版本', values: [88, 92, 78, 84, 90], theme: 'violet' },
        { key: 'baseline', label: '基线', values: [72, 75, 66, 70, 74], theme: 'blue' },
      ], apiType: 'RadarSeries[]' },
      { key: 'levels', label: 'levels', type: 'range', value: 4, min: 2, max: 8, step: 1 },
      { key: 'size', label: 'size', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] },
      { key: 'showGrid', label: 'show-grid', type: 'boolean', value: true },
      { key: 'showLegend', label: 'show-legend', type: 'boolean', value: true },
      { key: 'showDots', label: 'show-dots', type: 'boolean', value: true },
      { key: 'animated', label: 'animated', type: 'boolean', value: true },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '组件能力比较' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  'sortable-list': {
    desc: '由连续 Cell 组成的局部滚动排序列表；长按句柄或整项后拖动，组件只发布新顺序，持久化与业务提交由父级负责。',
    path: 'poemui-miniprogram/sortable-list/sortable-list',
    states: '句柄/整项拖动、禁用项、边缘自动滚动、受控数据回写、取消、低动效',
    props: [
      { key: 'items', label: 'items', type: 'json', value: [
        { key: 'install', title: '安装组件', description: '构建 npm 并注册组件', icon: 'download' },
        { key: 'theme', title: '配置主题', description: '挂载 ConfigProvider', icon: 'palette' },
        { key: 'ship', title: '完成验收', description: '同步 H5 与契约测试', icon: 'check-circle' },
      ], apiType: 'SortableListItem[]' },
      { key: 'itemKey', label: 'item-key', type: 'text', value: 'key' },
      { key: 'disabledKeys', label: 'disabled-keys', type: 'json', value: [], apiType: '(string | number)[]' },
      { key: 'dragFrom', label: 'drag-from', type: 'select', value: 'handle', options: ['handle', 'item'] },
      { key: 'height', label: 'height', type: 'text', value: '560rpx' },
      { key: 'bordered', label: 'bordered', type: 'boolean', value: true },
      { key: 'animated', label: 'animated', type: 'boolean', value: true },
      { key: 'duration', label: 'duration', type: 'range', value: 300, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '组件交付顺序' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  tour: {
    desc: '围绕页面中的真实 #id 或 .class 目标逐步展示引导；组件管理唯一遮罩、步骤和操作链，目标测量失败时明确报错并关闭。',
    path: 'poemui-miniprogram/tour/tour',
    states: '受控/非受控显隐与步骤、自动/四向定位、目标聚焦、跳过/完成、遮罩关闭、毛玻璃、错误闭环、低动效',
    props: [
      { key: 'steps', label: 'steps', type: 'json', value: [
        { key: 'search', selector: '#tour-search-target', title: '快速搜索', content: '在这里输入组件名称。', placement: 'bottom' },
        { key: 'appearance', selector: '#tour-appearance-target', title: '外观设置', content: '随时切换主题与视觉效果。', placement: 'left' },
      ], apiType: 'TourStep[]' },
      { key: 'visible', label: 'visible', type: 'nullable-boolean', value: null, apiType: 'boolean | null' },
      { key: 'defaultVisible', label: 'default-visible', type: 'boolean', value: false },
      { key: 'current', label: 'current', type: 'nullable-number', value: null, apiType: 'number | null' },
      { key: 'defaultCurrent', label: 'default-current', type: 'range', value: 0, min: 0, max: 8, step: 1 },
      { key: 'closeOnOverlay', label: 'close-on-overlay', type: 'boolean', value: true },
      { key: 'overlayBlur', label: 'overlay-blur', type: 'boolean', value: false },
      { key: 'showSkip', label: 'show-skip', type: 'boolean', value: true },
      { key: 'showIndicators', label: 'show-indicators', type: 'boolean', value: true },
      { key: 'zIndex', label: 'z-index', type: 'range', value: 11500, min: 1, max: 12000, step: 100 },
      { key: 'duration', label: 'duration', type: 'range', value: 400, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '功能引导' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  'bar-chart': {
    desc: '使用共享零基线比较分类数值和分段增量；由 WXML View、Flex/Grid 与语义渐变 Token 渲染，不依赖 Canvas。',
    path: 'poemui-miniprogram/bar-chart/bar-chart',
    states: '横向/纵向、堆叠/并列、共享最大值、六种强调色、图例、参考线、低动效',
    props: [
      { key: 'items', label: 'items', type: 'json', value: [{ key: 'form', label: '表单', segments: [{ key: 'existing', label: '已有', value: 19, theme: 'neutral' }, { key: 'added', label: '新增', value: 3, theme: 'violet' }] }], apiType: 'ChartItem[]' },
      { key: 'orientation', label: 'orientation', type: 'select', value: 'horizontal', options: ['horizontal', 'vertical'] },
      { key: 'mode', label: 'mode', type: 'select', value: 'stacked', options: ['stacked', 'grouped'] },
      { key: 'max', label: 'max', type: 'range', value: 0, min: 0, max: 100, step: 1 },
      { key: 'size', label: 'size', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] },
      { key: 'showValue', label: 'show-value', type: 'boolean', value: true },
      { key: 'showLegend', label: 'show-legend', type: 'boolean', value: true },
      { key: 'showGrid', label: 'show-grid', type: 'boolean', value: false },
      { key: 'animated', label: 'animated', type: 'boolean', value: true },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '组件分类数量' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  waffle: {
    desc: '用圆润点阵表达总量、占比和新增单元；超过渲染上限时显式展示每格代表的有效单位。',
    path: 'poemui-miniprogram/waffle/waffle',
    states: '4–12 列、圆润/圆形/方形、每格单位、最多 200 格、六种强调色、图例、低动效',
    props: [
      { key: 'items', label: 'items', type: 'json', value: [{ key: 'all', label: '组件总量', segments: [{ key: 'existing', label: '已有', value: 71, theme: 'neutral' }, { key: 'added', label: '新增', value: 3, theme: 'violet' }] }], apiType: 'ChartItem[]' },
      { key: 'columns', label: 'columns', type: 'range', value: 10, min: 4, max: 12, step: 1 },
      { key: 'groupColumns', label: 'group-columns', type: 'range', value: 0, min: 0, max: 12, step: 1 },
      { key: 'shape', label: 'shape', type: 'select', value: 'rounded', options: ['rounded', 'circle', 'square'] },
      { key: 'size', label: 'size', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] },
      { key: 'unit', label: 'unit', type: 'range', value: 1, min: 1, max: 20, step: 1 },
      { key: 'maxCells', label: 'max-cells', type: 'range', value: 100, min: 1, max: 200, step: 1 },
      { key: 'showValue', label: 'show-value', type: 'boolean', value: true },
      { key: 'showLegend', label: 'show-legend', type: 'boolean', value: true },
      { key: 'animated', label: 'animated', type: 'boolean', value: true },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 20 },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '组件数量点阵' },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
  popup: { desc: '从屏幕边缘或中心展开内容，按 Header、Content、Footer 组织结构；显隐与业务动作由父级回写。', states: '受控/非受控显隐、五向位置、卡片/贴边、遮罩模糊、Header/Content/Footer、滚动保护、Slot、低动效' },
  popover: { desc: '在触发元素旁显示轻量气泡，关闭请求由父级回写。', states: '受控/非受控、12 向定位、主题、箭头、外部点击、default/content slot、低动效' },
  sheet: { desc: '可组合底部面板，支持受控/非受控显隐、真实下拉关闭、内部 Button/Loading/Empty、三段 slot、内容滚动和完整进退场事件。', states: '受控/非受控、拖拽关闭、状态优先级、三段 slot、滚动、进退场完成事件、低动效' },
  bubble: {
    desc: '原生消息表面组件，映射 shadcn/ui Bubble 的七种变体、起止对齐、连续分组、回应、可折叠内容和真实触摸事件；不越权接管头像、时间、会话存储或 AI 传输。',
    path: 'poemui-miniprogram/bubble/bubble',
    states: '七种 variant、start/end、group、reaction、受控展开、slot、显隐生命周期、低动效',
    props: [
      { key: 'content', label: 'content', type: 'text', value: '我已经检查了组件注册表、原生入口和构建产物。当前 Bubble 只负责消息表面，不会伪造发送、已读或 AI 生成状态；长内容可以真实展开和收起。', apiType: 'string' },
      { key: 'text', label: 'text', type: 'text', value: '', apiType: 'string' },
      { key: 'variant', label: 'variant', type: 'select', value: 'secondary', options: ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive'] },
      { key: 'align', label: 'align', type: 'select', value: 'start', options: ['start', 'end'] },
      { key: 'groupPosition', label: 'group-position', type: 'select', value: 'single', options: ['single', 'first', 'middle', 'last'] },
      { key: 'reactions', label: 'reactions', type: 'json', value: [{ value: 'like', label: '👍', count: 2, active: true }, { value: 'fire', label: '🔥', count: 1 }], apiType: 'Reaction[]' },
      { key: 'reactionSide', label: 'reaction-side', type: 'select', value: 'bottom', options: ['top', 'bottom'] },
      { key: 'reactionAlign', label: 'reaction-align', type: 'select', value: 'end', options: ['start', 'end'] },
      { key: 'customContent', label: 'custom-content', type: 'boolean', value: false },
      { key: 'customReactions', label: 'custom-reactions', type: 'boolean', value: false },
      { key: 'collapsible', label: 'collapsible', type: 'boolean', value: true },
      { key: 'expanded', label: 'expanded', type: 'nullable-boolean', value: null },
      { key: 'defaultExpanded', label: 'default-expanded', type: 'boolean', value: false },
      { key: 'maxLines', label: 'max-lines', type: 'range', value: 3, min: 1, max: 12, step: 1 },
      { key: 'expandText', label: 'expand-text', type: 'text', value: '展开' },
      { key: 'collapseText', label: 'collapse-text', type: 'text', value: '收起' },
      { key: 'selectable', label: 'selectable', type: 'boolean', value: true },
      { key: 'visible', label: 'visible', type: 'boolean', value: true },
      { key: 'clickable', label: 'clickable', type: 'boolean', value: true },
      { key: 'disabled', label: 'disabled', type: 'boolean', value: false },
      { key: 'ariaLabel', label: 'aria-label', type: 'text', value: '组件交付状态消息' },
      { key: 'ariaLive', label: 'aria-live', type: 'select', value: 'polite', options: ['off', 'polite', 'assertive'] },
      { key: 'duration', label: 'duration', type: 'range', value: 500, min: 0, max: 1000, step: 20 },
      { key: 'easing', label: 'easing', type: 'select', value: 'standard', options: ['standard', 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'] },
      { key: 'reduceMotion', label: 'reduce-motion', type: 'boolean', value: false },
    ],
  },
};

const componentCopy = {
  alert: ['语义提示块，支持内部 Icon、soft/tinted 外观、行内纵向对齐、受控/非受控显隐、关闭回写和默认 slot。', '主题、soft/tinted、纵向居中、受控关闭、低动效'],
  'area-chart': ['以共享零基线展示连续趋势，原生 Canvas 2D 与 H5 SVG 消费同一数据合同，并提供渐变填充、默认入场与 replay()。', '自然/线性/阶梯、叠加/堆叠、渐变填充、默认入场、replay、低动效'],
  'bar-chart': ['以共享零基线比较分类数量与分段增量，条形渐变保持方向感，并提供默认级联入场与 replay()。', '横向/纵向、堆叠/并列、共享零基线、默认入场、replay、低动效'],
  'donut-chart': ['以圆润占比圆环展示组成和总量，Canvas 2D 与 H5 SVG 消费同一数据合同，并提供渐变弧段、默认入场与 replay()。', '占比、中心总量、弧段间隔、渐变端点、默认入场、replay、低动效'],
  'radar-chart': ['以低对比网格和渐变数据面比较多维能力，Canvas 2D 与 H5 SVG 消费同一数据合同，并提供默认入场与 replay()。', '3–8 维度、1–4 系列、渐变数据面、默认入场、replay、低动效'],
  'sortable-list': ['以连续 Cell、长按拖动和边缘自动滚动请求新的列表顺序；业务持久化始终由父级回写。', '句柄/整项拖动、禁用项、自动滚动、change/cancel、方法'],
  tour: ['围绕真实页面目标提供逐步引导；唯一遮罩、目标测量、定位、跳过与完成均在组件内闭环。', '受控显隐/步骤、自动定位、目标缺失错误、跳过/完成、毛玻璃、低动效'],
  waffle: ['以圆润渐变点阵表达总量、占比与新增单元，缩放时显式公开有效单位，并提供默认级联入场与 replay()。', '列数、形状、有效单位、渐变点阵、默认入场、replay、低动效'],
  'aspect-ratio': ['以 WXSS 百分比占位维持媒体、封面和嵌入内容的稳定比例；默认 slot 可组合 Icon、Tag 等内部组件。', '比例、边框、圆角、背景、溢出、平滑比例切换、低动效'],
  breadcrumb: ['可组合路径导航，支持受控/非受控值、current 兼容入口、内部 Button/Icon/Loading、前后缀 slot、状态优先级和低动效。', '受控/非受控、current 兼容、尺寸、换行、slot、loading/error/empty、事件'],
  card: ['内容分组容器，提供可显式保留的 header、content、footer 具名插槽、受控点击边界和低动效。', '具名插槽、边框、紧凑内距、分区、阴影、禁用、点击、低动效'],
  field: ['统一字段行的可编辑形态；Cell 复用同一行内核作为只读态，不接管 Slot 子控件的值或禁用状态。', '基础用法、标签与对齐、必填与帮助、校验反馈'],
  'input-otp': ['多格验证码输入，支持自动跳格、粘贴填充、完整状态和错误反馈。', '长度、遮罩、焦点、粘贴、错误、完成'],
  label: ['表单标签，支持必填、禁用和冒号格式。', '内容、必填、禁用、冒号'],
  popover: ['相对触发元素展示轻量内容；业务加载、错误和操作由消费者组合。', '受控/非受控、12 向定位、主题、箭头、外部点击、slot、低动效'],
  'scroll-area': ['轻量封装原生 scroll-view，在固定高度或有界自适应高度内定位、滚动并按真实边缘提示可继续阅读。', '固定/自适应高度、目标定位、边缘渐隐、默认 slot'],
  select: ['由 PUI Button Trigger、PUI Popup 与 PUI Button 选项组成的简单单选器，支持严格原始值、受控值、空选项、取消与只读语义。', '选项、PUI 浮层、受控、空态、只读、input/change'],
  sheet: ['可组合底部面板，支持真实拖拽关闭、内容状态、header/default/footer slot、尺寸边界与低动效。', '受控/非受控、拖拽、状态、slot、滚动、事件、低动效'],



  divider: ['内容分隔线，支持横竖布局、文字或默认 slot、对齐、虚线和语义边界。', '横向、纵向、content、Tag slot、对齐、虚线、语义'],
  badge: ['附着在对象旁的纯展示数量、短文字或红点标记；交互由宿主组件承担。', 'count、dot、上限/零值、右上角偏移、默认/count slot、主题变体'],
  bubble: ['只负责会话中的消息表面，支持七种变体、起止对齐、连续分组、受控展开、回应按钮、内容/回应 slot、真实触摸事件和低动效。', 'variant、align、group、reaction、展开/收起、slot、click/longpress、显隐生命周期'],
  avatar: ['展示图片、内部图标、文本或显式 slot 回退头像；图片等待由组件内部处理，交互由外层 Button、Cell 等宿主承担。', '基础、懒加载、图片与回退、尺寸与形状、组合用法'],
  image: ['封装原生 image 的真实资源状态，提供安全尺寸、微信解码能力、覆盖 slot 与低动效；交互由外层宿主承担。', '基础、加载与失败、裁切模式、形状与覆盖内容'],
  grid: ['数据驱动的宫格操作入口，组合 Icon、Badge、Button、Loading 与 Empty，并提供真实点击和重试请求。', '基础、列数与间距、徽标与禁用、加载/空/错误、点击/重试'],
  input: ['单行文字输入控件，支持受控/非受控值、长度限制、状态提示、Icon/Slot 组合、清空、键盘确认和低动效。', '基础、状态提示、图标与清空、尺寸与类型、change/clear/enter'],
  textarea: ['多行文本输入控件，支持受控/非受控值、字符上限、自动增高、状态提示、键盘事件和低动效。', '基础、字符计数、自动增高、状态提示、change/enter/line-change'],
  switch: ['用于控制独立功能开启或关闭的二元输入，支持原始自定义值、文字/图标、三种尺寸和加载状态。', '基础、文字与图标、状态、尺寸、change'],
  checkbox: ['用于多选与全选的声明式复选控件，提供真实 CheckboxGroup、严格原始值和父级状态继承。', '单项/组、全选/半选、max、原始值、状态继承、slot、change'],
  radio: ['用于单选的声明式输入，提供独立 RadioGroup、严格原始值、父级状态继承与唯一 change。', '基础选择、方向与布局、状态、图标与内容、change'],

  form: ['可组合表单父容器，通过真实 Form–Field 关系执行规则校验、提交、重置与错误定位，不生成固定字段或操作按钮。', 'Field 注册、规则校验、提交与重置、服务端错误、受控数据'],
  picker: ['基于原生 picker-view 的滚轮选择器，支持单列、多列、级联、值与显隐双受控、默认 Header 操作、Classic 底部操作和完整状态。', '单列/多列/级联、双受控、默认 Header/Classic、Popup/内联、禁用项、状态、事件、方法'],
  'date-time-picker': ['基于 PUI Picker 的日期时间滚轮，支持年到秒精度、范围、步长、格式、值与显隐双受控、默认图标 Header / Classic 底部操作、Popup/内联和草稿确认。', '年/月/日/时/分/秒、范围、步长、格式、双受控、默认 Header/Classic、Popup/内联、事件、方法'],
  search: ['搜索输入，支持受控/非受控值、字符限制、形状、清空、取消、确认与低动效。', '基础、形状、操作与长度、状态与受控、change/clear/search/cancel'],
  stepper: ['在明确边界内通过加减或输入调整数量。', '基础、主题与尺寸、步长与边界、状态与输入、change/overlimit'],
  slider: ['基于微信原生滑块在连续区间内选择单个数值。', '基础、边界与步长、颜色与表单、状态与受控、changing/change'],
  rate: ['点击或拖动提交星级评分，支持整星/半星、文案、受控值与只读状态。', '点击/拖动、半星、文案、受控、只读'],
  upload: ['从微信媒体或聊天文件选择器取得文件，以列表或网格展示消费者回写的真实状态；不伪造远端上传。', '基础、网格与媒体、文件状态、限制与禁用'],
  toast: ['单条轻提示，通过 show()/hide() 展示短暂反馈，可选遮罩、方向和主题。', '基础、主题与图标、方向与位置、遮罩与滚动保护'],
  'top-loading': ['依附当前卡片或内容表面顶边展示未知总量或精确请求进度；只有显式 success 才展示完成态。', '未知/精确进度、延迟与最短可见、显式完成、失败/取消、低动效'],
  'dynamic-message': ['页面顶部非模态灵动通知，支持 loading 到结果的同 key 原位更新、不同 key 队列、动作与真实退场。', '五种主题、原位 update、队列、自动/手动关闭、Action、安全区、低动效'],
  dialog: ['用于确认、选择或承载关键内容的受控模态对话框。', '受控显隐、按钮与 actions、具名 slot、遮罩关闭、低动效'],
  direction: ['为子树提供真实 ltr/rtl/auto 阅读方向，支持显式语言、系统语言 fallback、逻辑文本对齐、容器形态、slot/content、完整解析事件和低动效。', 'ltr/rtl/auto、language/fallback、逻辑对齐、display、slot/content、resolve/change/after-change、低动效'],
  progress: ['展示任务的确定完成进度，支持线形、饱满线形、环形与 label Slot。', '基础、形态、状态与颜色、label Slot'],
  skeleton: ['加载占位，支持安全行列、延迟显示、默认内容回显和低动效。', '基础用法、布局、主题和动效、内容回显'],
  empty: ['在没有内容时提供图形、说明与下一步入口位置；Image、Icon 与 Button 均由具名 Slot 组合。', '基础用法、图形内容、具名 Slot、低动效'],
  'notice-bar': ['页面内公告支持横向跑马、纵向轮播、四个内容区域与受控显隐。', '基础用法、主题、滚动、内容区域、受控显隐'],
  result: ['展示流程完成后的结果状态，支持四种主题、图形、标题和说明的替换区域。', '基础用法、组件类型、具名 Slot'],
  navbar: ['页面级导航栏，支持默认返回、标题、微信原生胶囊安全区、加载、固定占位与低动效。', '默认返回、标题与左侧组合、原生胶囊、安全区、显隐'],
  'navigation-menu': ['触摸优先的可组合导航菜单，以横向/纵向触发器和固定高度弹层统一映射 Navigation Menu 与 Menubar，支持三重选值、复选/单选、分组、钻取子菜单、真实微信导航回调、slot/generic、状态与低动效。', '导航/菜单栏模式、四重受控、复选/单选、分组、子菜单、真实导航、slot/generic、状态、事件、方法、低动效'],
  tabs: ['同层内容分类导航，支持受控/非受控值、自动横向滚动、内部 Button/Badge/Icon、内容滑动和低动效。', '基础、样式、徽标与禁用、受控与滑动'],
  tabbar: ['应用一级目的地导航，支持严格原始值、内部 Button/Badge/Icon、固定占位、安全区和低动效。', '基础、徽标与禁用、主题与形状、固定与边界值'],
  steps: ['以严格原始值表达流程进度，支持受控/非受控当前步骤、状态推导、正反序、横纵布局、横向滚动和低动效。', '受控/非受控、严格值身份、状态推导、横纵/正反序、default/dot、禁用、低动效'],
  'back-top': ['由外部滚动位置控制显隐的回顶入口。', '基础用法、显示阈值、形状与文案、主题与定位'],
  indexes: ['数据驱动的长分组索引列表，支持严格 current、侧栏点击/触摸滑选、滚动联动、Cell/Badge/Loading/Empty 组合和低动效。', '基础、索引显示、条目与状态、受控与边界'],
  sidebar: ['数据驱动的垂直同层导航，支持严格 String/Number 值、分组、Button/Badge/Icon/Loading/Empty 组合和固定低动效。', '基础、分组与徽标、主题与状态、受控与边界'],
  list: ['可组合列表容器，支持内部 Cell/Badge/Button/Empty/Loading、header/default/footer/empty slot、真实加载与重试事件、状态优先级和低动效。', '内容、slot、loading/error/empty/finished、load/retry/click、低动效'],
  collapse: ['数据驱动的多面板折叠容器，支持严格原始值、受控/非受控展开、默认/卡片主题、Generic 内容、真实状态和固定低动效。', '基础、多开与互斥、卡片与 Generic、加载/空/错误、change/retry'],
  collapsible: ['单触发器、单内容区的原生折叠容器，支持受控/非受控显隐、实测高度动画、trigger/default slot、完整状态和真实重试。', '受控/非受控、动态高度、slot、loading/error/empty、事件、低动效'],
  combobox: ['原生触摸组合框，支持受控/非受控选值与显隐、单多选、分组、固定高度滚动、状态、slot、事件与低动效；搜索由独立组件组合。', '选值与显隐、单选/多选、分组、固定滚动视口、状态、slot、事件、低动效'],


  'swipe-cell': ['在列表项左右滑动后展示操作；内容与两侧操作都可由 Slot 组合。', '基础滑动、左右操作、opened、禁用、事件与低动效'],
  'count-down': ['基于目标时间校正漂移的倒计时，支持声明式暂停、格式、毫秒、渐隐或逐位滚动、自定义内容和低动效。', '基础、主题与尺寸、渐隐与数字滚动、单位与毫秒、控制与自定义内容、change/finish、start/pause/reset/getTime'],
  table: ['小屏结构化数据表格，支持局部滚动、固定列、受控选择、稳定排序与真实状态反馈。', '基础、边线与固定列、选择与排序、加载/空/错误、行列事件与实例方法'],
  swiper: ['基于微信原生 swiper 的数据驱动轮播，支持原始值受控回写、自动播放、统一 Navigation、内部状态组合、Generic 条目和低动效。', '受控/非受控、swiper、自动播放、Navigation、状态、Generic、事件、方法、低动效'],
  calendar: ['选择单日、日期范围或多个日期。', '单选、范围、多选、日期限制、行内与弹层、状态、低动效'],
  'action-sheet': ['从底部展示一组与当前情境相关的操作。', '列表/宫格、分页、禁用项、受控显隐、事件与默认内容'],
  'dropdown-menu': ['在页面顶部展开单选或多选筛选项；选值由父级回写。', '筛选项、受控/非受控选值、禁用项、遮罩、默认/footer Slot、低动效'],
  overlay: ['以受控显隐遮罩当前页面，点击后由父级决定是否关闭。', '受控显隐、默认 Slot、点击请求、滚动保护、低动效'],
  'pull-refresh': ['在组件内部滚动区下拉请求刷新；由父级通过 value 回写结束，超时不会伪造业务成功。', '内部滚动、value/defaultValue、拖拽、timeout、header/default slot、低动效'],
  'virtual-list': ['可组合固定行高虚拟列表，支持受控/非受控单多选、Cell/Badge/Icon/Loading/Empty、泛型 item、状态优先级、窗口滚动和完整事件。', '固定行高窗口化、受控选择、内部组合、slot/generic、状态、滚动、低动效'],
  sticky: ['让默认内容在页面滚动时保持在顶部，并可限制在指定容器内。', '基础吸顶、顶部偏移、容器边界、禁用'],
  watermark: ['在内容之上绘制重复或单枚的文本、图片水印；水印不拦截内容交互。', '文字与图片、矩形/六边形、重复与单枚、移动、低动效'],
};

const apiProps = {
  'config-provider': ['theme', 'shadow', 'frostedGlass', 'largeRadius', 'bordered', 'equalSpacing', 'useGlobalConfig', 'customClass', 'customStyle'],
  alert: ['theme', 'variant', 'title', 'description', 'closable', 'visible', 'defaultVisible', 'icon', 'showIcon', 'closeIcon', 'verticalAlign', 'center', 'duration', 'easing', 'reduceMotion'],
  'aspect-ratio': ['ratio', 'bordered', 'radius', 'background', 'overflow', 'duration', 'easing', 'reduceMotion'],
  'breadcrumb': ['items', 'value', 'defaultValue', 'current', 'separator', 'separatorIcon', 'showIcon', 'size', 'wrap', 'maxLabelLength', 'currentClickable', 'customPrefix', 'customSuffix', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
  card: ['title', 'description', 'showHeader', 'bordered', 'padding', 'showFooter', 'headerBordered', 'footerBordered', 'shadow', 'clickable', 'disabled', 'menuItems', 'menuIcon', 'menuVisible', 'defaultMenuVisible', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],

  field: ['name', 'label', 'help', 'message', 'status', 'required', 'requiredMarkPosition', 'labelAlign', 'contentAlign', 'labelWidth', 'arrow', 'reduceMotion'],
  'input-otp': ['value', 'length', 'type', 'mask', 'focus', 'disabled', 'error', 'errorMessage'],
  label: ['content', 'required', 'disabled', 'colon'],
  popup: ['closeBtn', 'showHeader', 'title', 'subtitle', 'showFooter', 'contentScrollable', 'closeOnOverlayClick', 'content', 'card', 'duration', 'overlayProps', 'placement', 'preventScrollThrough', 'showOverlay', 'blurOverlay', 'usingCustomNavbar', 'visible', 'defaultVisible', 'zIndex', 'ariaLabel', 'reduceMotion'],
  popover: ['visible', 'defaultVisible', 'content', 'placement', 'showArrow', 'theme', 'closeOnClickOutside', 'fixed', 'ariaLabel', 'reduceMotion'],
  'scroll-area': ['height', 'maxHeight', 'scrollTop', 'scrollIntoView', 'gradientOverlay', 'gradientOverlayColor', 'gradientOverlaySize', 'contentPaddingBottom', 'ariaLabel'],
  select: ['options', 'value', 'defaultValue', 'placeholder', 'disabled', 'readonly', 'emptyText', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
  combobox: ['options', 'value', 'defaultValue', 'visible', 'defaultVisible', 'multiple', 'maxSelected', 'placeholder', 'clearable', 'showIcon', 'showDescription', 'showGroup', 'showCheck', 'closeOnSelect', 'customTrigger', 'customEmpty', 'customFooter', 'placement', 'size', 'shape', 'bordered', 'block', 'disabled', 'readonly', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'listHeight', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],


  sheet: ['visible', 'defaultVisible', 'title', 'description', 'content', 'showHeader', 'showClose', 'showHandle', 'draggable', 'dragThreshold', 'velocityThreshold', 'closeOnOverlayClick', 'showOverlay', 'customHeader', 'showFooter', 'customFooter', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'empty', 'emptyText', 'minHeight', 'height', 'maxHeight', 'zIndex', 'safeArea', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],



  button: ['theme', 'variant', 'surface', 'content', 'size', 'shape', 'block', 'icon', 'iconOnly', 'loading', 'loadingProps', 'disabled', 'openType', 'formType', 'lang', 'sessionFrom', 'sendMessageTitle', 'sendMessagePath', 'sendMessageImg', 'showMessageCard', 'appParameter', 'hoverClass', 'hoverStartTime', 'hoverStayTime', 'hoverStopPropagation', 'phoneNumberNoQuotaToast', 'activityType', 'entrancePath', 'needShowEntrance', 'ariaLabel', 'reduceMotion'],
  cell: ['title', 'description', 'value', 'note', 'image', 'leftIcon', 'rightIcon', 'size', 'align', 'variant', 'bordered', 'hover', 'required', 'arrow', 'clickable', 'selected', 'defaultSelected', 'selectable', 'allowUnselect', 'disabled', 'readonly', 'loading', 'url', 'jumpType', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
  tag: ['theme', 'variant', 'size', 'shape', 'content', 'icon', 'closable', 'disabled', 'maxWidth'],
  loading: ['delay', 'duration', 'fullscreen', 'indicator', 'inheritColor', 'layout', 'loading', 'pause', 'progress', 'reverse', 'size', 'text', 'theme', 'ariaLabel', 'reduceMotion'],
  'top-loading': ['state', 'progress', 'delay', 'minimumVisible', 'successDuration', 'duration', 'ariaLabel', 'reduceMotion'],
  'dynamic-message': ['theme', 'title', 'message', 'icon', 'actionText', 'closable', 'duration', 'safeArea', 'shadow', 'frostedGlass', 'ariaLabel', 'reduceMotion'],
  icon: ['name', 'size', 'color', 'ariaLabel'],
  divider: ['layout', 'align', 'content', 'showContent', 'dashed', 'decorative', 'ariaLabel'],
  badge: ['count', 'content', 'dot', 'maxCount', 'showZero', 'theme', 'variant', 'shape', 'size', 'color', 'offset', 'ariaLabel'],
  avatar: ['src', 'text', 'alt', 'icon', 'shape', 'size', 'bordered', 'hideOnLoadFailed', 'lazy', 'loading', 'useSlot', 'ariaLabel', 'reduceMotion'],
  image: ['src', 'mode', 'width', 'height', 'shape', 'lazy', 'webp', 'loading', 'error', 'text', 'showMenuByLongpress', 'showSlot', 'ariaLabel', 'reduceMotion'],
  grid: ['items', 'column', 'gutter', 'border', 'align', 'disabled', 'loading', 'error', 'loadingText', 'errorText', 'emptyText', 'retryText', 'ariaLabel', 'reduceMotion'],
  input: ['value', 'defaultValue', 'name', 'label', 'placeholder', 'type', 'maxlength', 'maxcharacter', 'size', 'align', 'bordered', 'clearable', 'clearTrigger', 'prefix', 'prefixIcon', 'suffix', 'suffixIcon', 'disabled', 'readonly', 'loading', 'focus', 'confirmType', 'status', 'tips', 'required', 'cursorSpacing', 'adjustPosition', 'holdKeyboard', 'confirmHold', 'ariaLabel', 'reduceMotion'],
  textarea: ['value', 'defaultValue', 'name', 'label', 'placeholder', 'maxlength', 'maxcharacter', 'autosize', 'indicator', 'bordered', 'size', 'disabled', 'readonly', 'loading', 'focus', 'status', 'tips', 'required', 'confirmType', 'showConfirmBar', 'cursorSpacing', 'selectionStart', 'selectionEnd', 'adjustPosition', 'holdKeyboard', 'confirmHold', 'disableDefaultPadding', 'ariaLabel', 'reduceMotion'],
  switch: ['value', 'defaultValue', 'customValue', 'label', 'icon', 'size', 'disabled', 'readonly', 'loading', 'ariaLabel', 'reduceMotion'],
  checkbox: ['checked', 'defaultChecked', 'value', 'label', 'content', 'icon', 'indeterminate', 'checkAll', 'block', 'borderless', 'contentDisabled', 'disabled', 'readonly', 'name', 'placement', 'maxLabelRow', 'maxContentRow', 'ariaLabel', 'reduceMotion'],
  radio: ['checked', 'defaultChecked', 'value', 'label', 'content', 'icon', 'allowUncheck', 'block', 'borderless', 'contentDisabled', 'disabled', 'readonly', 'name', 'placement', 'maxLabelRow', 'maxContentRow', 'ariaLabel', 'reduceMotion'],
  form: ['data', 'rules', 'showErrorMessage', 'scrollToFirstError', 'resetType', 'ariaLabel', 'reduceMotion'],
  picker: ['columns', 'value', 'defaultValue', 'visible', 'defaultVisible', 'title', 'type', 'cancelText', 'confirmText', 'showHeader', 'usePopup', 'closeOnOverlayClick', 'autoClose', 'keys', 'visibleItemCount', 'itemHeight', 'disabled', 'readonly', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion'],
  'date-time-picker': ['value', 'defaultValue', 'visible', 'defaultVisible', 'mode', 'start', 'end', 'format', 'steps', 'showWeek', 'title', 'type', 'cancelText', 'confirmText', 'showHeader', 'usePopup', 'autoClose', 'closeOnOverlayClick', 'disabled', 'readonly', 'ariaLabel', 'reduceMotion'],
  search: ['value', 'defaultValue', 'placeholder', 'clearable', 'clearTrigger', 'showCancel', 'cancelText', 'shape', 'center', 'maxlength', 'maxcharacter', 'disabled', 'readonly', 'focus', 'confirmType', 'ariaLabel', 'reduceMotion'],
  stepper: ['value', 'defaultValue', 'min', 'max', 'step', 'integer', 'inputWidth', 'size', 'theme', 'disabled', 'readonly', 'disableInput', 'ariaLabel', 'reduceMotion'],
  slider: ['value', 'defaultValue', 'min', 'max', 'step', 'color', 'trackColor', 'name', 'blockSize', 'disabled', 'readonly', 'showValue', 'showMinMax', 'valueSuffix', 'ariaLabel', 'reduceMotion'],
  rate: ['value', 'defaultValue', 'count', 'size', 'gap', 'color', 'allowHalf', 'showText', 'texts', 'disabled', 'readonly', 'ariaLabel', 'reduceMotion'],
  upload: ['files', 'defaultFiles', 'max', 'picker', 'mediaType', 'messageType', 'source', 'extensions', 'maxSize', 'addContent', 'addBtn', 'theme', 'columns', 'allowDuplicate', 'preview', 'removeBtn', 'customAdd', 'disabled', 'ariaLabel', 'reduceMotion'],
  toast: ['direction', 'duration', 'icon', 'message', 'overlayProps', 'placement', 'preventScrollThrough', 'showOverlay', 'theme', 'usingCustomNavbar', 'ariaLabel', 'reduceMotion'],
  dialog: ['visible', 'actions', 'buttonLayout', 'cancelBtn', 'closeBtn', 'closeOnOverlayClick', 'confirmBtn', 'content', 'overlayProps', 'preventScrollThrough', 'showOverlay', 'showFooter', 'title', 'usingCustomNavbar', 'zIndex', 'ariaLabel', 'reduceMotion'],
  direction: ['direction', 'language', 'fallbackDirection', 'textAlign', 'display', 'content', 'useSlot', 'selectable', 'ariaLabel', 'duration', 'easing', 'reduceMotion', 'customClass', 'customStyle'],
  progress: ['percentage', 'theme', 'label', 'size', 'status', 'strokeWidth', 'color', 'trackColor', 'ariaLabel', 'reduceMotion'],
  'area-chart': ['items', 'max', 'curve', 'stacked', 'size', 'showGrid', 'showXAxis', 'showLegend', 'showDots', 'animated', 'duration', 'ariaLabel', 'reduceMotion'],
  'bar-chart': ['items', 'orientation', 'mode', 'max', 'size', 'showValue', 'showLegend', 'showGrid', 'animated', 'duration', 'ariaLabel', 'reduceMotion'],
  'donut-chart': ['items', 'thickness', 'startAngle', 'gapAngle', 'size', 'showCenter', 'centerText', 'showLegend', 'animated', 'duration', 'ariaLabel', 'reduceMotion'],
  'radar-chart': ['indicators', 'series', 'levels', 'size', 'showGrid', 'showLegend', 'showDots', 'animated', 'duration', 'ariaLabel', 'reduceMotion'],
  'sortable-list': ['items', 'itemKey', 'disabledKeys', 'dragFrom', 'height', 'bordered', 'animated', 'duration', 'ariaLabel', 'reduceMotion'],
  tour: ['steps', 'visible', 'defaultVisible', 'current', 'defaultCurrent', 'closeOnOverlay', 'overlayBlur', 'showSkip', 'showIndicators', 'zIndex', 'duration', 'ariaLabel', 'reduceMotion'],
  waffle: ['items', 'columns', 'groupColumns', 'shape', 'size', 'unit', 'maxCells', 'showValue', 'showLegend', 'animated', 'duration', 'ariaLabel', 'reduceMotion'],
  skeleton: ['animation', 'delay', 'loading', 'rowCol', 'theme', 'ariaLabel', 'reduceMotion'],
  empty: ['description', 'icon', 'image', 'ariaLabel', 'reduceMotion'],
  'notice-bar': ['content', 'direction', 'interval', 'marquee', 'operation', 'prefixIcon', 'suffixIcon', 'theme', 'visible', 'defaultVisible', 'ariaLabel', 'reduceMotion'],
  result: ['description', 'icon', 'image', 'theme', 'title', 'ariaLabel', 'reduceMotion'],
  navbar: ['title', 'titleMaxLength', 'leftArrow', 'leftBtn', 'rightBtn', 'fixed', 'placeholder', 'safeAreaInsetTop', 'capsule', 'visible', 'zIndex', 'loading', 'transparent', 'bordered', 'disabled', 'ariaLabel', 'reduceMotion'],
  'navigation-menu': ['items', 'value', 'defaultValue', 'expandedValue', 'defaultExpandedValue', 'visible', 'defaultVisible', 'checkedValues', 'defaultCheckedValues', 'radioValues', 'defaultRadioValues', 'itemKey', 'labelKey', 'childrenKey', 'iconKey', 'mode', 'direction', 'placement', 'variant', 'size', 'block', 'scrollable', 'wrap', 'showHeader', 'showIcon', 'showDescription', 'showBadge', 'showIndicator', 'indicatorIcon', 'showGroup', 'showSeparator', 'showShortcut', 'closeOnSelect', 'closeOnCheck', 'closeOnOverlayClick', 'showOverlay', 'resetSubmenuOnClose', 'autoNavigate', 'customTrigger', 'customItem', 'customHeader', 'customContent', 'customFooter', 'customEmpty', 'disabled', 'readonly', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'panelWidth', 'maxHeight', 'offset', 'zIndex', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
  tabs: ['items', 'value', 'defaultValue', 'variant', 'showBottomLine', 'spaceEvenly', 'split', 'sticky', 'stickyOffset', 'swipeable', 'ariaLabel', 'reduceMotion'],
  tabbar: ['items', 'value', 'defaultValue', 'theme', 'shape', 'bordered', 'split', 'fixed', 'placeholder', 'safeAreaInsetBottom', 'zIndex', 'disabled', 'ariaLabel', 'reduceMotion'],
  steps: ['items', 'current', 'defaultCurrent', 'currentStatus', 'layout', 'sequence', 'theme', 'scrollable', 'readonly', 'disabled', 'ariaLabel', 'reduceMotion'],
  'back-top': ['fixed', 'icon', 'scrollTop', 'text', 'theme', 'visibilityHeight', 'ariaLabel', 'reduceMotion'],
  indexes: ['items', 'current', 'defaultCurrent', 'indexList', 'showFullIndex', 'height', 'sticky', 'stickyOffset', 'indexPosition', 'clickable', 'readonly', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion'],
  sidebar: ['items', 'value', 'defaultValue', 'theme', 'bordered', 'width', 'height', 'showGroupTitle', 'sticky', 'stickyOffset', 'showIcon', 'showDescription', 'showBadge', 'clickable', 'readonly', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion'],
  list: ['items', 'title', 'description', 'showHeader', 'customHeader', 'useSlot', 'showIcon', 'showDescription', 'showValue', 'showBadge', 'showArrow', 'clickable', 'bordered', 'divided', 'compact', 'showFooter', 'customFooter', 'customEmpty', 'disabled', 'loading', 'loadText', 'loadingText', 'finished', 'finishedText', 'error', 'errorText', 'emptyText', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
  collapse: ['items', 'value', 'defaultValue', 'theme', 'disabled', 'expandIcon', 'expandMutex', 'defaultExpandAll', 'customPanel', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion'],
  collapsible: ['open', 'defaultOpen', 'label', 'content', 'customTrigger', 'customContent', 'icon', 'expandIcon', 'iconPosition', 'theme', 'bordered', 'shadow', 'block', 'disabled', 'readonly', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
  'swipe-cell': ['disabled', 'left', 'opened', 'right', 'ariaLabel', 'reduceMotion'],
  'count-down': ['time', 'autoStart', 'paused', 'content', 'format', 'millisecond', 'size', 'theme', 'splitWithUnit', 'animation', 'ariaLabel', 'reduceMotion'],
  table: ['columns', 'data', 'rowKey', 'bordered', 'stripe', 'height', 'showHeader', 'emptyValue', 'selectable', 'selectedRowKeys', 'defaultSelectedRowKeys', 'multiple', 'selectOnRowClick', 'sortable', 'sort', 'defaultSort', 'customEmpty', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion'],
  swiper: ['items', 'value', 'defaultValue', 'height', 'circular', 'autoplay', 'interval', 'duration', 'easingFunction', 'direction', 'previousMargin', 'nextMargin', 'displayMultipleItems', 'disableTouch', 'navigation', 'imageMode', 'customItem', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion'],
  calendar: ['value', 'defaultValue', 'title', 'type', 'visible', 'defaultVisible', 'minDate', 'maxDate', 'disabledDates', 'disableWeekends', 'firstDayOfWeek', 'switchMode', 'showOutsideDays', 'allowSameDay', 'maxRange', 'maxMultiple', 'localeText', 'autoClose', 'usePopup', 'closeOnOverlayClick', 'disabled', 'readonly', 'loading', 'error', 'ariaLabel', 'reduceMotion'],
  popup: ['closeBtn', 'showHeader', 'title', 'subtitle', 'showFooter', 'contentScrollable', 'closeOnOverlayClick', 'content', 'card', 'duration', 'overlayProps', 'placement', 'preventScrollThrough', 'showOverlay', 'blurOverlay', 'usingCustomNavbar', 'visible', 'defaultVisible', 'zIndex', 'ariaLabel', 'reduceMotion'],
  'action-sheet': ['align', 'blurOverlay', 'cancelText', 'count', 'description', 'items', 'showCancel', 'showOverlay', 'theme', 'usingCustomNavbar', 'visible', 'defaultVisible', 'ariaLabel', 'reduceMotion'],
  'dropdown-menu': ['items', 'value', 'defaultValue', 'closeOnClickOverlay', 'showOverlay', 'zIndex', 'ariaLabel', 'reduceMotion'],
  overlay: ['visible', 'backgroundColor', 'blur', 'duration', 'preventScrollThrough', 'usingCustomNavbar', 'zIndex', 'ariaLabel', 'reduceMotion'],
  'pull-refresh': ['disabled', 'enableBackToTop', 'enablePassive', 'loadingBarHeight', 'loadingProps', 'loadingTexts', 'lowerThreshold', 'maxBarHeight', 'refreshTimeout', 'scrollIntoView', 'showScrollbar', 'successDuration', 'upperThreshold', 'usingCustomNavbar', 'value', 'defaultValue', 'ariaLabel', 'reduceMotion'],
  'virtual-list': ['items', 'value', 'defaultValue', 'multiple', 'selectable', 'allowUnselect', 'itemKey', 'height', 'itemHeight', 'overscan', 'scrollTop', 'scrollWithAnimation', 'upperThreshold', 'lowerThreshold', 'showScrollbar', 'bordered', 'showIndex', 'showDescription', 'showValue', 'showItemIcon', 'showItemBadge', 'activeIcon', 'customHeader', 'customFooter', 'customEmpty', 'customItem', 'clickable', 'readonly', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
  sticky: ['container', 'disabled', 'offsetTop', 'zIndex'],
  watermark: ['alpha', 'content', 'height', 'isRepeat', 'layout', 'lineSpace', 'movable', 'moveInterval', 'offset', 'rotate', 'watermarkContent', 'width', 'x', 'y', 'zIndex', 'ariaLabel', 'reduceMotion'],
};

const apiPropGroups = {
  'config-provider': [
    {
      id: 'visual',
      title: '局部视觉配置',
      description: '直接控制当前 Provider 子树；默认配置只需包裹页面内容，不必逐项声明。',
      keys: ['theme', 'shadow', 'frostedGlass', 'largeRadius', 'bordered', 'equalSpacing'],
    },
    {
      id: 'global-and-style',
      title: '全局接入与样式',
      description: '跨页面统一时启用 Store；样式逃生口仅用于业务根节点，不替代语义 Token。',
      keys: ['useGlobalConfig', 'customClass', 'customStyle'],
    },
  ],
  button: [
    {
      id: 'core',
      title: '核心属性',
      description: '日常按钮优先使用这些属性；默认 slot 是最简内容入口。',
      keys: ['theme', 'variant', 'surface', 'content', 'size', 'shape', 'block', 'icon', 'iconOnly', 'loading', 'loadingProps', 'disabled', 'ariaLabel', 'reduceMotion'],
    },
    {
      id: 'platform',
      title: '表单与微信能力',
      description: '仅在表单提交或调用微信开放能力时配置；H5 不伪造平台结果。',
      keys: ['openType', 'formType', 'lang', 'sessionFrom', 'sendMessageTitle', 'sendMessagePath', 'sendMessageImg', 'showMessageCard', 'appParameter', 'hoverClass', 'hoverStartTime', 'hoverStayTime', 'hoverStopPropagation', 'phoneNumberNoQuotaToast', 'activityType', 'entrancePath', 'needShowEntrance'],
    },
  ],
  loading: [
    {
      id: 'content',
      title: '内容与外观',
      description: 'theme、size、文字与三类 Slot 只描述可见加载反馈，不表达请求成功或失败。',
      keys: ['theme', 'size', 'text', 'indicator', 'layout', 'progress', 'inheritColor'],
    },
    {
      id: 'lifecycle',
      title: '显示与动效',
      description: 'loading 由父级控制；delay 防止闪烁，duration 同时约束指示器周期和进退场，始终不超过 500ms。',
      keys: ['loading', 'delay', 'duration', 'pause', 'reverse', 'fullscreen'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: 'ariaLabel 提供状态名称；低动效保留静态反馈并将过渡压缩到 1ms。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  'top-loading': [
    {
      id: 'state-and-progress',
      title: '状态与进度',
      description: 'idle/loading/success 是唯一状态机；progress=null 为未知总量，0–100 为精确进度，失败或取消回写 idle。',
      keys: ['state', 'progress'],
    },
    {
      id: 'timing',
      title: '反馈计时与动效',
      description: 'delay 避免短任务闪烁，minimumVisible 与 successDuration 约束反馈停留；只有 duration 是动效时长且上限 1000ms。',
      keys: ['delay', 'minimumVisible', 'successDuration', 'duration'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: 'ariaLabel 命名当前请求；低动效保留状态并把动效压缩到 1ms。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  'dynamic-message': [
    {
      id: 'content',
      title: '内容与主题',
      description: '五种主题承接实时状态；title/message/icon/actionText 只描述当前消息，真实业务结果由 show/update 写入。',
      keys: ['theme', 'title', 'message', 'icon', 'actionText', 'closable'],
    },
    {
      id: 'timing-and-position',
      title: '停留与安全区',
      description: 'duration 是进入完成后的停留时间，0 表示持续显示；safeArea 根据微信状态栏与胶囊真实定位。',
      keys: ['duration', 'safeArea'],
    },
    {
      id: 'surface-effects',
      title: '容器外观',
      description: 'shadow 与 frostedGlass 为通知 Surface 的局部覆盖；null 继承 ConfigProvider，true 强制开启，false 强制关闭。',
      keys: ['shadow', 'frostedGlass'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: 'ariaLabel 命名整条通知；低动效不改变 retained node、队列、事件或关闭原因。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  progress: [
    {
      id: 'value-and-shape',
      title: '进度与形态',
      description: 'percentage 是唯一进度值；三种形态只改变呈现，不改变任务语义。',
      keys: ['percentage', 'theme', 'label', 'size', 'strokeWidth'],
    },
    {
      id: 'status-and-color',
      title: '状态与颜色',
      description: '状态只表达视觉语义；业务成功、失败和重试仍由父级负责。',
      keys: ['status', 'color', 'trackColor'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称与低动效不改变确定进度、Slot 或业务边界。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  skeleton: [
    {
      id: 'layout',
      title: '占位布局',
      description: 'loading 决定显示占位还是默认内容；rowCol 与 theme 只描述结构，不承载请求结果。',
      keys: ['loading', 'rowCol', 'theme'],
    },
    {
      id: 'motion-and-accessibility',
      title: '动效与语义',
      description: 'animation 与 delay 只用于避免闪烁；ariaLabel 和低动效不改变父级 loading 状态。',
      keys: ['animation', 'delay', 'ariaLabel', 'reduceMotion'],
    },
  ],
  toast: [
    {
      id: 'content-and-placement',
      title: '内容、主题与位置',
      description: '单条提示的文字、图标、主题、方向与位置；复杂补充内容使用 icon/message 具名 Slot。',
      keys: ['message', 'theme', 'icon', 'direction', 'placement'],
    },
    {
      id: 'timing-and-overlay',
      title: '计时与遮罩',
      description: 'show() 后由 duration 决定自动 hide()；Overlay 只承载遮罩与滚动保护，不表示业务完成。',
      keys: ['duration', 'showOverlay', 'preventScrollThrough', 'overlayProps', 'usingCustomNavbar'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和低动效不改变 show(options)/hide() 的命令式边界。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  dialog: [
    {
      id: 'content-and-actions',
      title: '内容与操作',
      description: 'title、content 与动作定义 Dialog 的可见内容；复杂正文和按钮使用具名 Slot 组合，不把请求状态塞进 Dialog。',
      keys: ['title', 'content', 'actions', 'cancelBtn', 'confirmBtn', 'closeBtn', 'showFooter', 'buttonLayout'],
    },
    {
      id: 'visibility-and-overlay',
      title: '显隐与遮罩',
      description: 'visible 始终由父级持有；关闭请求发生后在 close 中回写 false。遮罩可控制点击关闭、滚动保护和颜色。',
      keys: ['visible', 'closeOnOverlayClick', 'showOverlay', 'overlayProps', 'preventScrollThrough', 'usingCustomNavbar', 'zIndex'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和低动效不改变父级显隐回写、事件顺序或业务处理边界。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  popup: [
    {
      id: 'structure',
      title: '结构',
      description: 'Header、Content、Footer 负责结构；Popup 不承载拖拽手柄或拖拽关闭语义。',
      keys: ['closeBtn', 'showHeader', 'title', 'subtitle', 'showFooter', 'contentScrollable'],
    },
    {
      id: 'visibility-and-overlay',
      title: '显隐与遮罩',
      description: '显隐由父级回写；遮罩、滚动保护、层级和模糊只作用于浮层基础设施。',
      keys: ['closeOnOverlayClick', 'content', 'card', 'duration', 'overlayProps', 'placement', 'preventScrollThrough', 'showOverlay', 'blurOverlay', 'usingCustomNavbar', 'visible', 'defaultVisible', 'zIndex'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和低动效不改变显隐回写或业务内容边界。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  steps: [
    {
      id: 'progress',
      title: '进度与内容',
      description: 'items 合并 StepItem 内容；current 与条目 value 使用严格原始值匹配。',
      keys: ['items', 'current', 'defaultCurrent', 'currentStatus'],
    },
    {
      id: 'layout-and-state',
      title: '布局与状态',
      description: '方向、顺序、主题、滚动与交互门禁不引入业务 loading/error/empty。',
      keys: ['layout', 'sequence', 'theme', 'scrollable', 'readonly', 'disabled', 'ariaLabel', 'reduceMotion'],
    },
  ],
  'back-top': [
    {
      id: 'core',
      title: '核心属性',
      description: 'scrollTop 由页面或滚动容器真实回写；fixed、icon、text 与主题只决定入口的位置和外观。',
      keys: ['fixed', 'icon', 'scrollTop', 'text', 'theme', 'visibilityHeight'],
    },
    {
      id: 'accessibility',
      title: '辅助与低动效',
      description: '点击先发布 to-top，再调用实际页面回顶；低动效只把过渡压缩为 1ms 和页面回顶时长置为 0。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  indexes: [
    {
      id: 'data-and-current',
      title: '分组、当前值与侧栏',
      description: 'items 提供分组 Cell；current/defaultCurrent 与 indexList 对 String/Number index 使用严格身份。',
      keys: ['items', 'current', 'defaultCurrent', 'indexList', 'showFullIndex'],
    },
    {
      id: 'layout-and-interaction',
      title: '布局与交互',
      description: '固定高度容器支持 sticky、左右侧栏、条目操作与只读/禁用边界。',
      keys: ['height', 'sticky', 'stickyOffset', 'indexPosition', 'clickable', 'readonly', 'disabled'],
    },
    {
      id: 'state-and-accessibility',
      title: '状态与辅助',
      description: 'error 优先于 loading；Empty/Retry 由共享 PUI 组件承接，动效固定 500ms/1ms。',
      keys: ['loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion'],
    },
  ],
  sidebar: [
    {
      id: 'data-and-value',
      title: '条目与当前值',
      description: 'items 对齐 SideBarItem 内容；value/defaultValue 只接受 String/Number 并严格区分数字0、字符串0与空字符串。',
      keys: ['items', 'value', 'defaultValue'],
    },
    {
      id: 'layout-and-content',
      title: '布局与内容',
      description: '固定尺寸的局部滚动导航支持分组标题、sticky、Icon、描述、Badge 与两种主题。',
      keys: ['theme', 'bordered', 'width', 'height', 'showGroupTitle', 'sticky', 'stickyOffset', 'showIcon', 'showDescription', 'showBadge'],
    },
    {
      id: 'interaction-and-state',
      title: '交互与状态',
      description: 'change 是唯一选值事件；error 优先于 loading，Retry 只发布真实请求。',
      keys: ['clickable', 'readonly', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText'],
    },
    {
      id: 'accessibility',
      title: '辅助与低动效',
      description: '辅助名称和固定500ms/1ms动效不改变当前值、状态优先级或事件合同。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  cell: [
    {
      id: 'content',
      title: '内容与外观',
      description: '日常信息单元优先使用这些属性；复杂内容通过具名 Slot 组合。',
      keys: ['title', 'description', 'value', 'note', 'image', 'leftIcon', 'rightIcon', 'size', 'align', 'variant', 'bordered', 'hover', 'required', 'arrow'],
    },
    {
      id: 'interaction',
      title: '交互与状态',
      description: '只有 Cell 承担入口或选择职责时才启用；纯展示单元无需声明。',
      keys: ['clickable', 'selected', 'defaultSelected', 'selectable', 'allowUnselect', 'disabled', 'readonly', 'loading', 'url', 'jumpType', 'ariaLabel', 'duration', 'easing', 'reduceMotion'],
    },
  ],
  badge: [
    {
      id: 'content',
      title: '内容与定位',
      description: '数量、红点、宿主内容和右上角偏移构成 Badge 的核心用法。',
      keys: ['count', 'content', 'dot', 'maxCount', 'showZero', 'offset', 'ariaLabel'],
    },
    {
      id: 'appearance',
      title: '外观',
      description: '优先使用语义主题和变体；只有品牌或业务色确实无法表达时才使用 color。',
      keys: ['theme', 'variant', 'shape', 'size', 'color'],
    },
  ],
  avatar: [
    {
      id: 'content',
      title: '内容与回退',
      description: '优先传图片；组件内部处理资源等待，失败或无图时再使用 Slot、Icon 或文字回退。',
      keys: ['src', 'text', 'alt', 'icon', 'useSlot', 'hideOnLoadFailed', 'lazy', 'loading', 'ariaLabel'],
    },
    {
      id: 'appearance',
      title: '外观',
      description: 'Avatar 只控制自身尺寸、形状、边线和低动效，不承担点击状态。',
      keys: ['shape', 'size', 'bordered', 'reduceMotion'],
    },
  ],
  image: [
    {
      id: 'resource',
      title: '资源与状态',
      description: '图片地址、原生解码能力和调用者真实请求状态共同决定可见内容。',
      keys: ['src', 'lazy', 'webp', 'loading', 'error', 'text', 'showMenuByLongpress', 'ariaLabel'],
    },
    {
      id: 'appearance',
      title: '布局与外观',
      description: '安全尺寸、裁切、形状、覆盖内容和低动效只改变图片呈现。',
      keys: ['mode', 'width', 'height', 'shape', 'showSlot', 'reduceMotion'],
    },
  ],
  tag: [
    {
      id: 'content',
      title: '内容与关闭',
      description: '静态文字优先使用默认 Slot；content 服务数据驱动组合，Close 只发布父级删除请求。',
      keys: ['content', 'icon', 'closable', 'disabled', 'maxWidth'],
    },
    {
      id: 'appearance',
      title: '外观',
      description: '主题、变体、尺寸和形状只改变 Tag 自身呈现，不赋予根节点点击或选择语义。',
      keys: ['theme', 'variant', 'size', 'shape'],
    },
  ],
  grid: [
    {
      id: 'content',
      title: '入口与布局',
      description: 'Grid 由 items 驱动入口内容；列数 0 表示横向滚动，其余值保持 1–6 列。',
      keys: ['items', 'column', 'gutter', 'border', 'align', 'disabled'],
    },
    {
      id: 'state',
      title: '加载与失败',
      description: 'error 优先于 loading；重试只派发父级请求，不会伪造加载成功。',
      keys: ['loading', 'error', 'loadingText', 'errorText', 'emptyText', 'retryText'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称与低动效不改变入口数据、点击语义或状态优先级。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  'count-down': [
    {
      id: 'clock',
      title: '时钟与控制',
      description: 'time 是唯一时长真相源；autoStart 只决定初始化和 reset，paused 用于父级声明式暂停。',
      keys: ['time', 'autoStart', 'paused'],
    },
    {
      id: 'display',
      title: '内容与显示',
      description: '格式、主题、尺寸、单位、动效风格和 Slot 只改变呈现，不改变目标时间与事件顺序。',
      keys: ['content', 'format', 'millisecond', 'size', 'theme', 'splitWithUnit', 'animation'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和固定 500ms/1ms 动效不改变计时精度。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  table: [
    {
      id: 'data',
      title: '数据与布局',
      description: 'columns 和 data 是唯一数据源；列宽决定组件内横滚，height 决定是否启用局部纵滚。',
      keys: ['columns', 'data', 'rowKey', 'bordered', 'stripe', 'height', 'showHeader', 'emptyValue'],
    },
    {
      id: 'interaction',
      title: '选择与排序',
      description: '选择与排序分别支持受控和非受控；交互只请求父级回写，不产生重复事件。',
      keys: ['selectable', 'selectedRowKeys', 'defaultSelectedRowKeys', 'multiple', 'selectOnRowClick', 'sortable', 'sort', 'defaultSort', 'disabled'],
    },
    {
      id: 'state',
      title: '加载与失败',
      description: 'error 优先于 loading；Retry 只发布请求，customEmpty 仅接管空状态。',
      keys: ['loading', 'error', 'loadingText', 'errorText', 'retryText', 'emptyText', 'customEmpty'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和固定 500ms/1ms 动效不改变数据、选择、排序或事件顺序。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  swiper: [
    {
      id: 'data',
      title: '数据与当前项',
      description: 'items 使用固定 schema；value/defaultValue 以严格原始值表达受控与非受控当前项。',
      keys: ['items', 'value', 'defaultValue', 'customItem', 'imageMode'],
    },
    {
      id: 'playback',
      title: '播放与布局',
      description: '方向、间隔、时长、露出距离和同屏数量直接镜像原生 swiper。',
      keys: ['height', 'circular', 'autoplay', 'interval', 'duration', 'easingFunction', 'direction', 'previousMargin', 'nextMargin', 'displayMultipleItems', 'disableTouch', 'navigation'],
    },
    {
      id: 'state',
      title: '加载与失败',
      description: 'error 优先于 loading；Retry 只发布请求，disabled 阻止全部写交互。',
      keys: ['disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和低动效不改变当前值与事件顺序；低动效同时停止自动播放。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  input: [
    {
      id: 'value',
      title: '值与长度',
      description: 'value/defaultValue 区分受控与非受控；maxcharacter 优先于 maxlength，且不会截断半个 emoji。',
      keys: ['value', 'defaultValue', 'name', 'maxlength', 'maxcharacter'],
    },
    {
      id: 'content',
      title: '内容与组合',
      description: '标签、占位、Icon、后缀与六类 Slot 只组合内容，不建立第二套输入状态。',
      keys: ['label', 'placeholder', 'prefix', 'prefixIcon', 'suffix', 'suffixIcon', 'required'],
    },
    {
      id: 'appearance',
      title: '外观与状态',
      description: '尺寸、对齐、边框和 status/tips 共享 PUI Token；禁用、只读和加载统一阻断用户写入。',
      keys: ['size', 'align', 'bordered', 'clearable', 'status', 'tips', 'disabled', 'readonly', 'loading'],
    },
    {
      id: 'platform',
      title: '键盘与辅助',
      description: '只公开常用微信键盘参数；确认键、页面上推、键盘保持和低动效不改变值合同。',
      keys: ['type', 'focus', 'confirmType', 'cursorSpacing', 'adjustPosition', 'holdKeyboard', 'confirmHold', 'ariaLabel', 'reduceMotion'],
    },
  ],
  textarea: [
    {
      id: 'value',
      title: '值与字符',
      description: 'value/defaultValue 区分受控与非受控；maxcharacter 优先于 maxlength，indicator 与事件共享同一计数。',
      keys: ['value', 'defaultValue', 'name', 'maxlength', 'maxcharacter', 'indicator'],
    },
    {
      id: 'content',
      title: '内容与布局',
      description: '标签、占位、尺寸、边框和 autosize 只改变真实文本域的内容与布局。',
      keys: ['label', 'placeholder', 'autosize', 'size', 'bordered', 'required'],
    },
    {
      id: 'state',
      title: '状态与交互',
      description: 'status/tips 提供反馈；disabled、readonly、loading 阻断写入。Textarea 不在输入区动态插入 Clear。',
      keys: ['status', 'tips', 'disabled', 'readonly', 'loading'],
    },
    {
      id: 'platform',
      title: '键盘与辅助',
      description: '仅保留已有真实小程序映射的常用键盘、光标、选区、语义与低动效参数。',
      keys: ['focus', 'confirmType', 'showConfirmBar', 'cursorSpacing', 'selectionStart', 'selectionEnd', 'adjustPosition', 'holdKeyboard', 'confirmHold', 'disableDefaultPadding', 'ariaLabel', 'reduceMotion'],
    },
  ],
  switch: [
    {
      id: 'value',
      title: '值',
      description: 'value/defaultValue 区分受控与非受控；customValue 保留 string、number、boolean 原始类型。',
      keys: ['value', 'defaultValue', 'customValue'],
    },
    {
      id: 'content',
      title: '内容与尺寸',
      description: 'label/icon 分别按 [开启, 关闭] 提供轨道文字与拇指图标；size 只改变真实宽高。',
      keys: ['label', 'icon', 'size'],
    },
    {
      id: 'state',
      title: '状态与辅助',
      description: 'disabled、readonly、loading 阻止写入；loading 使用 PUI Loading，低动效固定为 1ms。',
      keys: ['disabled', 'readonly', 'loading', 'ariaLabel', 'reduceMotion'],
    },
  ],
  checkbox: [
    {
      id: 'value',
      title: '值与全选',
      description: 'checked/defaultChecked 只表达单项状态；value 是严格原始选项身份，indeterminate/checkAll 由 Group 计算或父级声明。',
      keys: ['checked', 'defaultChecked', 'value', 'indeterminate', 'checkAll'],
    },
    {
      id: 'content',
      title: '内容与布局',
      description: '标签、说明、三态图标、左右位置和裁行共同表达一个选项；三类 Slot 不需要布尔开关。',
      keys: ['label', 'content', 'icon', 'placement', 'maxLabelRow', 'maxContentRow'],
    },
    {
      id: 'state',
      title: '状态与辅助',
      description: 'block 默认占满可用宽度；disabled/readonly/borderless 可由 CheckboxGroup 继承，低动效固定为 1ms。',
      keys: ['block', 'borderless', 'contentDisabled', 'disabled', 'readonly', 'name', 'ariaLabel', 'reduceMotion'],
    },
  ],
  radio: [
    {
      id: 'value',
      title: '值',
      description: 'checked/defaultChecked 只表达独立单项状态；value 是严格原始身份，组值由 RadioGroup 管理。',
      keys: ['checked', 'defaultChecked', 'value', 'allowUncheck'],
    },
    {
      id: 'content',
      title: '内容与布局',
      description: '主文案、说明、图标、左右位置和裁行共同表达一个选项；四类 Slot 不需要布尔开关。',
      keys: ['label', 'content', 'icon', 'placement', 'maxLabelRow', 'maxContentRow'],
    },
    {
      id: 'state',
      title: '状态与辅助',
      description: 'block 默认占满可用宽度；disabled/readonly/borderless 可由 RadioGroup 继承，低动效固定为1ms。',
      keys: ['block', 'borderless', 'contentDisabled', 'disabled', 'readonly', 'name', 'ariaLabel', 'reduceMotion'],
    },
  ],
  field: [
    {
      id: 'content',
      title: '字段内容',
      description: 'name 只提供字段标识；标签、帮助、反馈与五类 Slot 只负责组合内容，不接管子控件值。',
      keys: ['name', 'label', 'help', 'message'],
    },
    {
      id: 'layout',
      title: '布局与标记',
      description: '默认左标签、右控件，呈现可编辑 Cell；top 适合多行或长控件，箭头只表达后续入口。',
      keys: ['required', 'requiredMarkPosition', 'labelAlign', 'contentAlign', 'labelWidth', 'arrow'],
    },
    {
      id: 'feedback',
      title: '反馈与低动效',
      description: 'status 只控制 message 的语义颜色；子控件状态仍由消费者显式传入，低动效固定为 1ms。',
      keys: ['status', 'reduceMotion'],
    },
  ],
  form: [
    {
      id: 'data',
      title: '数据与规则',
      description: 'data 始终由父级持有；rules 按 Field name 注册，不把任意控件值复制进 Form 内部。',
      keys: ['data', 'rules'],
    },
    {
      id: 'validation',
      title: '校验与重置',
      description: '控制错误呈现、首错定位和重置策略；重置只发出下一份 data 请求，等待父级真实回写。',
      keys: ['showErrorMessage', 'scrollToFirstError', 'resetType'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: 'Form 根提供可访问名称；低动效只压缩首错平滑滚动和 Field 反馈，不改变校验结果。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  picker: [
    {
      id: 'data',
      title: '列数据与值',
      description: 'columns 以一维、二维或 children 树表达单列、多列和级联；value/defaultValue 始终使用严格原始值数组。',
      keys: ['columns', 'value', 'defaultValue', 'keys'],
    },
    {
      id: 'visibility',
      title: '显隐与操作栏',
      description: 'Popup 模式支持受控/非受控显隐；默认 Header 左确右取，classic 保留底部两列，确认后才提交值。',
      keys: ['visible', 'defaultVisible', 'title', 'type', 'cancelText', 'confirmText', 'showHeader', 'usePopup', 'closeOnOverlayClick', 'autoClose'],
    },
    {
      id: 'layout-and-state',
      title: '滚轮与状态',
      description: '滚轮高度使用 rpx 语义；error 优先于 loading，Retry 只发布父级请求，disabled/readonly 阻止写入。',
      keys: ['visibleItemCount', 'itemHeight', 'disabled', 'readonly', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和固定 500ms/1ms Popup 动效不改变草稿、确认值或事件顺序。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  'date-time-picker': [
    {
      id: 'value',
      title: '值与精度',
      description: 'value/defaultValue 区分受控与非受控；mode、format 决定真实列和公开值，不用两个输入框拼接。',
      keys: ['value', 'defaultValue', 'mode', 'format'],
    },
    {
      id: 'range',
      title: '范围与列规则',
      description: 'start/end 限制完整时间戳；steps 控制各列步长，showWeek 只扩展日列标签。',
      keys: ['start', 'end', 'steps', 'showWeek'],
    },
    {
      id: 'visibility',
      title: '显隐与操作栏',
      description: 'Popup 支持受控显隐和草稿确认；默认 Header 使用左确认图标、右关闭图标，classic 使用底部两列；内联模式始终可见。',
      keys: ['visible', 'defaultVisible', 'title', 'type', 'cancelText', 'confirmText', 'showHeader', 'usePopup', 'autoClose', 'closeOnOverlayClick'],
    },
    {
      id: 'state',
      title: '状态与辅助',
      description: 'disabled/readonly 阻止日期写入；辅助名称与 500ms/1ms 动效由内部 PUI Picker 统一实现。',
      keys: ['disabled', 'readonly', 'ariaLabel', 'reduceMotion'],
    },
  ],
  search: [
    {
      id: 'value',
      title: '值与字符',
      description: 'value/defaultValue 区分受控与非受控；maxcharacter 优先于 maxlength，空字符串、0 与 false 都是合法值。',
      keys: ['value', 'defaultValue', 'maxlength', 'maxcharacter'],
    },
    {
      id: 'content',
      title: '内容与操作',
      description: '占位、清空策略、取消文字与默认 Slot 只组合搜索字段操作，不内置业务结果列表。',
      keys: ['placeholder', 'clearable', 'clearTrigger', 'showCancel', 'cancelText'],
    },
    {
      id: 'appearance',
      title: '形状与状态',
      description: 'square/round 与居中对齐只改变字段外观；disabled/readonly 统一阻断写操作。',
      keys: ['shape', 'center', 'disabled', 'readonly'],
    },
    {
      id: 'platform',
      title: '键盘与辅助',
      description: '声明式焦点、微信确认键、辅助名称和低动效不改变值与事件顺序。',
      keys: ['focus', 'confirmType', 'ariaLabel', 'reduceMotion'],
    },
  ],
  navbar: [
    {
      id: 'content',
      title: '标题与返回',
      description: '普通页面只需标题和可选返回箭头；双图标入口通过 leftBtn/rightBtn 与对应事件直接由 Navbar 发布，右侧由微信原生胶囊保留。',
      keys: ['title', 'titleMaxLength', 'leftArrow', 'leftBtn', 'rightBtn'],
    },
    {
      id: 'layout',
      title: '固定与页面关系',
      description: 'fixed、placeholder、安全区和原生胶囊安全区共同决定页面顶部几何；visible 只控制呈现，不产生冗余显隐事件。',
      keys: ['fixed', 'placeholder', 'safeAreaInsetTop', 'capsule', 'visible', 'zIndex'],
    },
    {
      id: 'appearance',
      title: '外观与辅助',
      description: '透明、边线和禁用只改变当前导航栏；固定 500ms/1ms 动效不公开私有时序参数。',
      keys: ['loading', 'transparent', 'bordered', 'disabled', 'ariaLabel', 'reduceMotion'],
    },
  ],
  tabs: [
    {
      id: 'value',
      title: '选项与当前值',
      description: 'items 是唯一选项数据源；value/defaultValue 分别表达受控和非受控当前项，并保留 0、false、空字符串等原始值。',
      keys: ['items', 'value', 'defaultValue'],
    },
    {
      id: 'appearance',
      title: '样式与排列',
      description: 'line/tag、底线、等分和分隔只改变同一组 Tab 的视觉与排列；横向溢出自动局部滚动。',
      keys: ['variant', 'showBottomLine', 'spaceEvenly', 'split'],
    },
    {
      id: 'interaction',
      title: '吸顶与手势',
      description: '吸顶偏移只影响 Header；内容区水平滑动固定跳过禁用项且不循环。',
      keys: ['sticky', 'stickyOffset', 'swipeable'],
    },
    {
      id: 'accessibility',
      title: '辅助与低动效',
      description: '辅助名称不改变选择；固定 500ms 动效在 reduceMotion=true 时压缩为 1ms。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  tabbar: [
    {
      id: 'value',
      title: '目的地与当前值',
      description: 'items 是唯一目的地数据源；value/defaultValue 只接受单个字符串、数字或布尔值，分别表达受控和非受控当前项，并严格区分 0、字符串 0、false 与空字符串。',
      keys: ['items', 'value', 'defaultValue'],
    },
    {
      id: 'appearance',
      title: '主题与边界',
      description: 'normal/tag、normal/round、边线和分隔只改变导航视觉，不改变目的地值与事件。',
      keys: ['theme', 'shape', 'bordered', 'split'],
    },
    {
      id: 'layout',
      title: '固定与页面关系',
      description: 'fixed、placeholder 和安全区共同决定页面底部占位；zIndex 只在固定模式下决定层级。',
      keys: ['fixed', 'placeholder', 'safeAreaInsetBottom', 'zIndex'],
    },
    {
      id: 'accessibility',
      title: '状态与辅助',
      description: 'disabled 阻断所有选择；辅助名称不改变选择，固定 500ms 动效在 reduceMotion=true 时压缩为 1ms。',
      keys: ['disabled', 'ariaLabel', 'reduceMotion'],
    },
  ],
  calendar: [
    {
      id: 'selection',
      title: '选择与限制',
      description: 'value/defaultValue 区分受控与非受控；日期边界、禁用规则和选择上限共享同一严格日期解析。',
      keys: ['value', 'defaultValue', 'type', 'minDate', 'maxDate', 'disabledDates', 'disableWeekends', 'allowSameDay', 'maxRange', 'maxMultiple'],
    },
    {
      id: 'calendar',
      title: '日历与导航',
      description: '标题、周首日、导航跨度、相邻月日期和本地文案只改变日历呈现，不绕过选择规则。',
      keys: ['title', 'firstDayOfWeek', 'switchMode', 'showOutsideDays', 'localeText'],
    },
    {
      id: 'visibility',
      title: '显隐与弹层',
      description: '行内与弹层共用同一网格；显隐请求、自动关闭和遮罩策略都等待受控父级真实回写。',
      keys: ['visible', 'defaultVisible', 'usePopup', 'autoClose', 'closeOnOverlayClick'],
    },
    {
      id: 'state',
      title: '状态与辅助',
      description: 'error 优先于 loading；disabled/readonly、辅助名称和固定 500ms/1ms 动效不改变日期值。',
      keys: ['disabled', 'readonly', 'loading', 'error', 'ariaLabel', 'reduceMotion'],
    },
  ],
  collapse: [
    {
      id: 'data',
      title: '数据与展开值',
      description: 'items 使用固定 schema；value/defaultValue 只接受数组，并以严格原始值表达受控与非受控展开项。',
      keys: ['items', 'value', 'defaultValue', 'expandMutex', 'defaultExpandAll'],
    },
    {
      id: 'appearance',
      title: '呈现与组合',
      description: 'default/card 只改变分组外观；面板内容差异通过 collapse-panel Generic 组合。',
      keys: ['theme', 'expandIcon', 'customPanel'],
    },
    {
      id: 'state',
      title: '状态与门禁',
      description: 'error 优先于 loading；Retry 只发布请求，disabled 阻止展开和重试。',
      keys: ['disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: '辅助名称和固定500ms/1ms动效不改变展开值或事件顺序。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  empty: [
    {
      id: 'content',
      title: '图形与说明',
      description: 'image 优先于 icon；两者为空时由 image Slot 提供图形，description 与 description Slot 共同构成说明区域。',
      keys: ['description', 'icon', 'image'],
    },
    {
      id: 'accessibility',
      title: '辅助与低动效',
      description: '辅助名称不改变内容优先级；固定 500ms 进入在 reduceMotion=true 时压缩为 1ms。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  'notice-bar': [
    {
      id: 'content',
      title: '公告内容与方向',
      description: 'horizontal 展示单条内容，vertical 使用字符串数组作为 swiper 条目；具名 Slot 可补充四个内容区域。',
      keys: ['content', 'direction', 'interval', 'operation'],
    },
    {
      id: 'icon-and-marquee',
      title: '图标与滚动',
      description: '前后图标使用 PUI Button + Icon；横向跑马只在真实溢出时运行。',
      keys: ['prefixIcon', 'suffixIcon', 'marquee', 'theme'],
    },
    {
      id: 'visibility',
      title: '显隐、语义与低动效',
      description: 'visible 显式传入时完全由父级控制；defaultVisible 只初始化一次，低动效不启动跑马。',
      keys: ['visible', 'defaultVisible', 'ariaLabel', 'reduceMotion'],
    },
  ],
  overlay: [
    {
      id: 'visibility',
      title: '显隐与点击请求',
      description: 'visible 始终由父级控制；遮罩或默认 Slot 内点击只发出 click({ visible: false })，不会自行关闭。',
      keys: ['visible'],
    },
    {
      id: 'surface',
      title: '遮罩与页面上下文',
      description: '背景色、显式模糊、层级、滚动阻断与自定义导航栏距离都直接作用于真实遮罩根。',
      keys: ['backgroundColor', 'blur', 'duration', 'preventScrollThrough', 'usingCustomNavbar', 'zIndex'],
    },
    {
      id: 'accessibility',
      title: '语义与低动效',
      description: 'ariaLabel 提供遮罩的辅助名称；reduceMotion 将透明度过渡压缩为 1ms。',
      keys: ['ariaLabel', 'reduceMotion'],
    },
  ],
  watermark: [
    {
      id: 'content-and-layout',
      title: '内容与铺排',
      description: 'watermarkContent 描述图文图案；重复、矩形/六边形和尺寸只改变水印层，不改写 Slot 内容。',
      keys: ['watermarkContent', 'content', 'isRepeat', 'layout', 'width', 'height', 'x', 'y', 'offset', 'rotate', 'lineSpace'],
    },
    {
      id: 'appearance-and-motion',
      title: '透明度、层级与移动',
      description: 'alpha 和 zIndex 只作用于非交互水印层；movable 以 moveInterval 更新图案位置，低动效停止更新。',
      keys: ['alpha', 'zIndex', 'movable', 'moveInterval', 'reduceMotion'],
    },
    {
      id: 'accessibility',
      title: '辅助名称',
      description: 'ariaLabel 命名被覆盖的内容区域；每枚水印对读屏保持隐藏。',
      keys: ['ariaLabel'],
    },
  ],
};

const apiEvents = {
  'sortable-list': [
    { name: 'dragstart', detail: '{ index, item }', description: '可用项长按进入拖动时触发；不改变外部 items。' },
    { name: 'dragging', detail: '{ from, to }', description: '拖动跨过新的目标索引时触发；用于轻量预览反馈，不表示排序已经持久化。' },
    { name: 'change', detail: '{ from, to, items, source? }', description: '拖动结束或 move() 请求新顺序时触发；父级必须把 items 持久化并回写，组件不伪造保存成功。' },
    { name: 'cancel', detail: '{ from, to }', description: '触摸取消或 cancel() 结束当前拖动时触发，恢复开始前顺序。' },
    { name: 'scroll', detail: '{ scrollTop, dragging }', description: '唯一内部 scroll-view 真实滚动时转发当前位置。' },
  ],
  tour: [
    { name: 'visible-change', detail: '{ visible, reason, current }', description: '打开或关闭请求发生时触发；受控模式等待父级回写 visible。' },
    { name: 'current-change', detail: '{ current, previous, reason, step }', description: '步骤请求切换时触发；受控模式等待父级回写 current。' },
    { name: 'change', detail: '{ current, previous, reason, step }', description: '与 current-change 同步发布，便于消费者记录真实引导进度。' },
    { name: 'skip', detail: '{ current, step }', description: '点击跳过时触发，随后请求关闭；不替消费者写入已完成状态。' },
    { name: 'finish', detail: '{ current, step }', description: '最后一步点击完成时触发，随后请求关闭。' },
    { name: 'close', detail: '{ current, reason }', description: '关闭按钮、遮罩、跳过、完成或 close() 请求关闭时触发。' },
    { name: 'error', detail: '{ code, message, index }', description: '步骤为空、选择器非法、目标缺失或测量能力不可用时触发；组件随后 fail-closed 请求关闭。' },
  ],
  'scroll-area': [
    { name: 'scroll', detail: '{ scrollTop, scrollHeight }', description: '唯一原生 scroll-view 真实滚动时触发；可用于回写受控 scrollTop 与驱动 BackTop 显隐。' },
  ],
  card: [
    { name: 'click', detail: '{ source: "card" }', description: '仅 clickable=true 且 disabled=false 时点按 Card 内容区域触发；footer Slot 内 Button 的 click 独立处理。' },
    { name: 'menu-visible-change', detail: '{ visible, trigger }', description: '更多菜单请求显隐时触发；受控模式等待父级回写 menuVisible。' },
    { name: 'menu-select', detail: '{ index, item, value }', description: '选择可用菜单项时触发，随后只关闭菜单，不伪造业务成功。' },
  ],
  'notice-bar': [
    { name: 'change', detail: '{ current, source: "swiper" }', description: '仅 direction="vertical" 的 swiper 切换时触发；current 是当前条目索引。' },
    { name: 'click', detail: '{ trigger: "prefix-icon" | "content" | "operation" | "suffix-icon" }', description: '点击对应区域时触发一次；组件不推断跳转、关闭或业务成功，由父级处理。' },
  ],
  toast: [
    { name: 'close', detail: '无', description: 'hide() 或 duration 自动收起完成固定退场、节点实际卸载后触发；不表示业务操作成功。' },
  ],
  'dynamic-message': [
    { name: 'click', detail: '{ key, theme }', description: '用户点按当前通知 Surface 时触发；不代表动作完成或通知关闭。' },
    { name: 'action', detail: '{ key, theme }', description: '点按可选 PUI Action Button 时触发；组件不自动宣布成功，也不自动关闭。' },
    { name: 'close', detail: '{ key, theme, reason: "timeout" | "manual" | "programmatic" }', description: '当前通知完成真实退场并卸载后触发一次；排队但未展示的消息被移除时不触发。' },
  ],
  dialog: [
    { name: 'confirm', detail: '无', description: '确认按钮可用时触发；组件保持 visible，父级决定后续业务与是否关闭。' },
    { name: 'cancel', detail: '无', description: '取消按钮可用时先触发；随后固定触发 close({ trigger: "cancel" })。' },
    { name: 'close', detail: '{ trigger: "cancel" | "close-btn" | "overlay" | "programmatic" }', description: '取消、关闭按钮、允许关闭的遮罩或 close() 请求关闭时触发；父级应将 visible 回写为 false。' },
    { name: 'overlay-click', detail: '无', description: '遮罩可见且被点按时先触发；仅 closeOnOverlayClick=true 时随后请求 close。' },
    { name: 'action', detail: '{ index }', description: 'actions 中可用按钮点按时触发；不自动关闭，也不伪造业务成功。' },
  ],
  popup: [
    { name: 'visible-change', detail: '{ visible: false, trigger: "close-btn" | "overlay" }', description: '点击内置关闭按钮或允许关闭的遮罩时触发；受控模式由父级将 visible 回写为 false。Footer 内主要动作的业务事件由 Slot 内 PUI Button 发布。' },
  ],
  popover: [
    { name: 'visible-change', detail: '{ visible: boolean }', description: '外部点击请求关闭时触发；非受控模式先更新内部显隐，受控模式等待父级回写 visible。' },
  ],
  'action-sheet': [
    { name: 'visible-change', detail: '{ visible: boolean }', description: '打开、选择或遮罩关闭请求发生时触发；受控模式由父级回写 visible，非受控模式同步更新内部显隐。' },
    { name: 'cancel', detail: '无', description: '点击取消按钮时先触发；随后请求关闭面板。' },
    { name: 'close', detail: '{ trigger: "overlay" | "select" | "cancel" }', description: '遮罩、可用动作选择或取消请求关闭时，在 visible-change(false) 前触发。' },
    { name: 'selected', detail: '{ selected: string | number | boolean | ActionSheetItem, index: number }', description: '点按可用动作时触发；随后固定 close({ trigger: "select" }) → visible-change(false)，disabled 条目静默。' },
  ],
  overlay: [
    { name: 'click', detail: '{ visible: false }', description: '可见遮罩根收到点按时触发；Overlay 不自行改写 visible，父级据此决定是否回写 false。' },
  ],
  'swipe-cell': [
    { name: 'click', detail: '{ action: SwipeActionItem, source: "left" | "right" }', description: '点按数组定义的操作项时触发；默认、left、right Slot 内的自定义交互由消费者自己处理。组件随后收起，不把操作当作业务成功。' },
    { name: 'dragstart', detail: '无', description: '手势在横向移动超过 10px 时触发一次；纵向滚动不会触发。' },
    { name: 'dragend', detail: '无', description: '横向滑动结束或取消时触发；是否展开已按操作区宽度的 30% 阈值落定。' },
  ],
  steps: [
    { name: 'change', detail: '{ value, index, item, previousValue, previousIndex, source, controlled }', description: '选择不同可用步骤时触发一次；受控模式等待父级回写，重复选择、readonly、disabled 与禁用条目静默。' },
  ],
  'back-top': [
    { name: 'to-top', detail: '{ scrollTop, source: "tap" }', description: '组件处于可见状态时点击一次触发；事件先于真实 wx.pageScrollTo 调用，滚动位置仍由页面 onPageScroll 回写。' },
  ],
  sticky: [
    { name: 'scroll', detail: '{ scrollTop, isFixed }', description: '页面滚动后的真实测量结果；每次 onPageScroll 测量后触发，不替代消费者的页面滚动处理。' },
  ],
  indexes: [
    { name: 'select', detail: '{ current, previousCurrent, index, group, groupIndex, source, controlled }', description: '点击或触摸滑过侧栏索引时先触发；重复当前索引仍触发 select，但不重复 change。' },
    { name: 'change', detail: '同 select', description: '活动分组真实改变时触发；侧栏固定 select→change，用户滚动只触发 source=scroll 的 change。' },
    { name: 'item-click', detail: '{ value, valueText, item, itemIndex, group, groupIndex, current, source }', description: '点击可用 Cell 条目时触发一次；readonly、disabled、状态层和禁用项静默。' },
    { name: 'retry', detail: '{ source: "button" }', description: '错误态 Action 请求父级重试；组件保持 error，直到父级真实更新状态。' },
  ],
  sidebar: [
    { name: 'change', detail: '{ value, previousValue, label, item, index, itemIndex, group, groupIndex, source, controlled }', description: '选择不同可用条目时触发一次；受控模式等待父级回写，重复当前项与所有阻断态静默。' },
    { name: 'retry', detail: '{ source: "button" }', description: '错误态 Empty Action 请求父级重试；组件保持 error，直到父级真实更新状态。' },
  ],
  'config-provider': [
    { name: 'themechange', detail: '{ theme, source, frostedGlass, shadow, largeRadius, bordered, equalSpacing, effectsEnabled, global }', description: '解析后的 light/dark 主题实际变化后触发；只切换阴影、毛玻璃、圆角、边框或等距不会重复触发。' },
  ],
  button: [
    { name: 'click', detail: '原生 detail + { source: "button" }', description: '可交互状态点击后触发；loading 或 disabled 时不触发。' },
    { name: 'getuserinfo', detail: '微信原生 detail', description: '转发 getuserinfo 回调。' },
    { name: 'contact', detail: '微信原生 detail', description: '转发客服会话回调。' },
    { name: 'createliveactivity', detail: '微信原生 detail', description: '转发创建直播预约回调。' },
    { name: 'getphonenumber', detail: '微信原生 detail', description: '转发手机号授权回调。' },
    { name: 'getrealtimephonenumber', detail: '微信原生 detail', description: '转发实时手机号授权回调。' },
    { name: 'error', detail: '微信原生 detail', description: '转发开放能力失败信息。' },
    { name: 'opensetting', detail: '微信原生 detail', description: '转发打开授权设置回调。' },
    { name: 'launchapp', detail: '微信原生 detail', description: '转发打开 App 回调。' },
    { name: 'chooseavatar', detail: '微信原生 detail', description: '转发头像选择回调。' },
    { name: 'agreeprivacyauthorization', detail: '微信原生 detail', description: '转发隐私授权同意回调。' },
    { name: 'phoneoneclicklogin', detail: '微信原生 detail', description: '转发手机号一键登录回调。' },
  ],
  cell: [
    { name: 'click', detail: '{ value, selected, previousSelected, source, controlled, selectable, blocked, reason, url, jumpType }', description: '可点击或可选择 Cell 点按后触发；readonly 仍回传 blocked=true，disabled/loading 不触发。' },
    { name: 'input', detail: '同 click 的选择详情', description: '选择请求真实改变时先触发；受控模式需父级回写 selected。' },
    { name: 'change', detail: '同 click 的选择详情', description: '紧随 input 触发，表示同一次选择请求。' },
    { name: 'load', detail: '内部 Image 详情 + { source: "image", src }', description: 'image 资源真实加载完成后触发。' },
    { name: 'error', detail: '内部 Image 详情 + { source: "image", src }', description: 'image 资源真实加载失败后触发。' },
    { name: 'navigate-success', detail: '选择详情 + { status: "success", result }', description: '微信导航 API 真实成功回调；H5 不伪造。' },
    { name: 'navigate-fail', detail: '选择详情 + { status: "fail", result }', description: '微信导航 API 真实失败回调。' },
  ],
  grid: [
    { name: 'click', detail: '{ index, item, value, source }', description: '可用入口点击后触发；item 保留 0、false 和空字符串等原始值。' },
    { name: 'retry', detail: '{ source }', description: '错误态操作点击后触发；组件保持错误态，直到父级真实更新 error/loading/items。' },
  ],
  'count-down': [
    { name: 'change', detail: '{ time, days, hours, minutes, seconds, milliseconds, totalHours, totalMinutes, totalSeconds, formatted }', description: '真实剩余时间发生变化时触发；reset 和 pause 的精确剩余值也会回写。' },
    { name: 'finish', detail: '与 change 相同的零值时间快照', description: '自然归零时在最后一次 change 之后触发一次；time=0 初始化或 reset 不伪造完成。' },
  ],
  table: [
    { name: 'row-click', detail: '{ row, index, key, selected, source: "row" }', description: '可用内容行点按后触发；不需要 clickable 开关，disabled/loading/非内容态不触发。' },
    { name: 'cell-click', detail: '{ row, col, rowIndex, colIndex, columnKey, value, source: "cell" }', description: '数据单元格点按时先触发；随后原生冒泡继续触发 row-click。' },
    { name: 'input', detail: '选择详情 { value, selectedRowKeys, selectedRows, selected, key, row, index, source }', description: '选择请求实际变化时先触发；受控模式等待父级回写。' },
    { name: 'change', detail: '同 input 的选择详情', description: '紧随 input 触发同一次选择请求，不再重复发布 selection-change/row-select。' },
    { name: 'sort-change', detail: '{ key, order, sort, source }', description: '表头或方法请求 asc/desc/none；受控模式等待父级回写。' },
    { name: 'scroll', detail: '{ scrollLeft, scrollTop, scrollWidth, scrollHeight, deltaX, deltaY, source: "scroll" }', description: 'Table 局部 scroll-view 发生真实滚动时触发。' },
    { name: 'retry', detail: '{ source, rowCount }', description: '错误态 Button 或 retry() 请求父级重试；组件保持 error。' },
  ],
  swiper: [
    { name: 'click', detail: '{ value, index, item, active, source: "item" }', description: '点击真实可用条目后触发；disabled 根或条目静默。' },
    { name: 'input', detail: '{ value, previousValue, index, previousIndex, item, source, controlled }', description: '当前项切换请求实际变化时先触发；受控模式等待父级回写。' },
    { name: 'change', detail: '同 input 的切换详情', description: '紧随 input 触发同一次切换请求。' },
    { name: 'animationfinish', detail: '{ value, index, item, source }', description: '微信 swiper 真实切换动画结束时触发。' },
    { name: 'image-load', detail: 'Image load detail + { value, index, item }', description: '默认条目内部图片真实加载完成后触发。' },
    { name: 'image-error', detail: 'Image error detail + { value, index, item }', description: '默认条目内部图片真实加载失败后触发。' },
    { name: 'retry', detail: '{ source: "retry", errorText }', description: '错误态操作请求父级重试；组件保持 error。' },
  ],
  collapse: [
    { name: 'change', detail: '{ value, item, index, expanded, source, controlled }', description: '可用面板的展开值实际请求变化时触发；受控模式等待父级回写，不再重复发布 input/open/close。' },
    { name: 'retry', detail: '{ source: "retry", errorText }', description: '错误态操作请求父级重试；组件保持 error，直到父级真实更新状态。' },
  ],
  input: [
    { name: 'change', detail: '{ value, previousValue, source, controlled, name, cursor?, keyCode? }', description: '真实输入请求改变时触发；受控模式等待父级回写，不再重复发布 input 事件。' },
    { name: 'clear', detail: '同 change，source 为 clear 或 method-clear', description: '清空操作先触发；随后发布同一次 change。组件不会触发表单提交。' },
    { name: 'focus', detail: '{ value, source: "focus", controlled, name, detail }', description: '原生输入框实际获得焦点时触发。' },
    { name: 'blur', detail: '{ value, source: "blur", controlled, name, detail }', description: '原生输入框实际失去焦点时触发。' },
    { name: 'enter', detail: '{ value, source: "enter", controlled, name, detail }', description: '点击微信键盘确认键时触发；disabled、readonly 或 loading 时不触发。' },
  ],
  textarea: [
    { name: 'change', detail: '{ value, previousValue, count, limit, countMode, truncated, source, controlled, name, detail }', description: '真实输入请求改变时触发；受控模式等待父级回写，不再重复发布 input。' },
    { name: 'focus', detail: '值详情 + 原生 detail', description: '原生 textarea 实际获得焦点时触发。' },
    { name: 'blur', detail: '值详情 + 原生 detail', description: '原生 textarea 实际失去焦点时触发。' },
    { name: 'enter', detail: '值详情 + 原生 detail', description: '点击微信键盘确认键时触发；不与 Form submit 混用。' },
    { name: 'line-change', detail: '值详情 + { lineCount, height, heightRpx }', description: '原生 textarea 行数或高度实际变化时触发。' },
    { name: 'keyboardheightchange', detail: '{ value, height, duration, source: "keyboard", name, detail }', description: '微信键盘高度变化时转发；H5 不伪造该平台事件。' },
  ],
  switch: [
    { name: 'change', detail: '{ value, checked, previousValue, previousChecked, source, controlled }', description: '可写轨道点击且值真实请求变化时触发；受控模式等待父级回写 value。' },
  ],
  checkbox: [
    { name: 'change', detail: '{ checked, previousChecked, value, label, indeterminate, checkAll, source, controlled }', description: '单项可写区域请求改变时触发一次；受控模式等待父级回写 checked，Group 内由父组发布数组 change。' },
  ],
  radio: [
    { name: 'change', detail: '{ checked, previousChecked, value, label, source, controlled }', description: '单项可写区域请求选中或允许取消时触发一次；受控模式等待父级回写 checked，Group 内由父组发布标量 change。' },
  ],
  form: [
    { name: 'validate', detail: '{ valid, errors, warnings, data, fields, firstError, trigger }', description: '每次 validate/submit 完成后先触发；errors 与 warnings 按 Field name 保留完整消息数组。' },
    { name: 'submit', detail: '同 validate 的最终快照', description: '原生 form submit 或 submit() 在 validate 之后触发；无论通过与否都报告真实结果，不伪造业务成功。' },
    { name: 'reset', detail: '{ data, fields, type, controlled: true }', description: '原生 form reset 或 reset() 请求父级回写 initial/empty 数据；Form 不私自改写受控 data。' },
  ],
  picker: [
    { name: 'visible-change', detail: '{ visible, source, controlled }', description: 'Popup 显隐请求发生时触发；受控模式等待父级回写 visible。' },
    { name: 'open', detail: '同 visible-change 的 visible=true 详情', description: '打开请求发生时紧随 visible-change 触发；内联模式不触发。' },
    { name: 'pick', detail: '{ value, label, columns, column, index, option, source, controlled }', description: '滚轮草稿真实变化时触发；不提交 value，也不关闭面板。' },
    { name: 'confirm', detail: '{ value, label, columns, source, controlled }', description: '确认操作首先触发；即使值未变化也报告当前选择。' },
    { name: 'change', detail: '同 confirm 的值详情', description: '确认值真实变化或 reset() 请求值时触发；受控模式等待父级回写 value。' },
    { name: 'cancel', detail: '{ value, label, columns, source, controlled }', description: '取消时报告已提交值并丢弃草稿，不触发 change。' },
    { name: 'close', detail: '同 visible-change 的 visible=false 详情', description: '关闭请求紧随 visible-change 触发；source 区分确认、取消、遮罩和方法。' },
    { name: 'retry', detail: '{ source }', description: '错误态操作触发；组件保持 error，直到父级真实更新状态或列数据。' },
  ],
  'date-time-picker': [
    { name: 'visible-change', detail: '{ visible, source, controlled }', description: 'Popup 显隐请求发生时触发；受控模式等待父级回写 visible。' },
    { name: 'open', detail: '同 visible-change 的 visible=true 详情', description: '打开请求发生时紧随 visible-change 触发；内联模式不触发。' },
    { name: 'pick', detail: '{ value, timestamp, parts, mode, unit, column, index, source, controlled }', description: '年/月/日/时/分/秒滚轮草稿变化时触发，不提交 value。' },
    { name: 'confirm', detail: '{ value, timestamp, parts, mode, source, controlled }', description: '确认操作首先触发；即使值未变化也报告当前草稿。' },
    { name: 'change', detail: '同 confirm 的值详情', description: '确认值真实变化或 reset() 请求值时触发；受控模式等待父级回写。' },
    { name: 'cancel', detail: '同 confirm 的已提交值详情', description: '取消时丢弃草稿并报告已提交值，不触发 change。' },
    { name: 'close', detail: '同 visible-change 的 visible=false 详情', description: '关闭请求紧随 visible-change 触发；source 区分确认、取消、遮罩和方法。' },
  ],
  search: [
    { name: 'change', detail: '{ value, previousValue, source: "input" | "clear", controlled, detail }', description: '真实输入或清空请求改变时触发；受控模式等待父级回写，不再重复发布 input。' },
    { name: 'clear', detail: '同 change，source 为 clear', description: '非空且可写时首先触发，随后发布同一次 change。' },
    { name: 'search', detail: '{ value, previousValue, source: "confirm", controlled, detail }', description: '点击微信键盘确认键时触发；不伪造业务搜索结果。' },
    { name: 'cancel', detail: '{ value, previousValue, source: "cancel", controlled, detail }', description: '点击右侧取消操作时触发；组件不自行清空当前值。' },
    { name: 'focus', detail: '当前值详情，source 为 focus', description: '内部 PUI Input 实际获得焦点时触发。' },
    { name: 'blur', detail: '当前值详情，source 为 blur', description: '内部 PUI Input 实际失去焦点时触发。' },
  ],
  stepper: [
    { name: 'change', detail: '{ value, previousValue, source: "minus" | "plus" | "blur" | "enter", controlled }', description: '加减立即提交，直接输入仅在失焦或 Enter 后规整并提交；值未变化时不触发。' },
    { name: 'overlimit', detail: '{ type: "minus" | "plus", value, min, max, controlled }', description: '已到边界后继续向外调整时触发；不伴随 change，也不伪造数值变化。' },
    { name: 'focus', detail: '{ value, source: "focus", controlled, detail }', description: '内部 PUI Input 实际获得焦点时触发；禁用、只读或 disableInput 时不触发。' },
    { name: 'blur', detail: '{ value, source: "blur", controlled, detail }', description: '内部 PUI Input 失焦时触发；若草稿改变，事件顺序固定为 change → blur。' },
  ],
  slider: [
    { name: 'changing', detail: '{ value, previousValue, source: "drag", controlled, min, max, step }', description: '微信原生滑块拖动中的数值请求；previousValue 是上一次真实请求值，受控模式等待父级回写。' },
    { name: 'change', detail: '{ value, previousValue, source: "drag", controlled, min, max, step }', description: '拖动结束且值相对本次拖动起点真实变化时触发一次；不再重复发布 input。' },
  ],
  rate: [
    { name: 'change', detail: '{ value, source: "tap" | "drag" }', description: '点击或拖动使评分请求值真实变化时触发；相同值、disabled 与 readonly 不触发，受控模式等待父级回写。' },
  ],
  upload: [
    { name: 'change', detail: '{ files, previousFiles, source: "add" | "remove", ... }', description: '有效选择或移除使文件列表真实请求变化时先触发；受控模式等待父级回写 files。' },
    { name: 'add', detail: '{ files, previousFiles, addedFiles, rejectedFiles, picker, source: "add" }', description: '本次至少一个文件通过校验时紧随 change 触发；只表示加入列表，不表示远端上传成功。' },
    { name: 'remove', detail: '{ files, previousFiles, file, index, source: "remove" }', description: '移除一个有效文件时紧随 change 触发；受控模式等待父级回写。' },
    { name: 'preview', detail: '{ file, index, source: "preview" }', description: '调用微信真实图片、视频或本地文档预览前触发。' },
    { name: 'retry', detail: '{ file, index, files, source: "file" }', description: '错误文件 Retry 点击时触发；组件保持 error，等待消费者重启真实上传并回写 files。' },
    { name: 'cancel', detail: '{ source: "choose-media" | "choose-message-file" }', description: '用户取消系统文件选择器时触发，不改变文件列表。' },
    { name: 'reject', detail: '{ rejectedFiles: [{ file, reason }], extensions, maxSize, max, source }', description: '类型、扩展名、大小、重复或上限校验拒绝时触发；reason 为 type/extension/size/duplicate/max。' },
    { name: 'error', detail: '平台错误字段 + { source, file?, index? }', description: '选择能力不可用、无有效返回或真实平台预览失败时触发。' },
  ],
  calendar: [
    { name: 'change', detail: '{ value, values, date, source: "date" }', description: '日期点按使选择请求真实变化时触发一次；受控模式等待父级回写 value。' },
    { name: 'limit', detail: '{ type: "range" | "multiple", max, value, source: "date" }', description: '范围天数或多选数量超过上限时触发；当前选择保持不变。' },
    { name: 'panel-change', detail: '{ month, year, monthIndex, source }', description: '前后导航或“今天”入口真实改变当前月份时触发；不暗自选择日期。' },
    { name: 'visible-change', detail: '{ visible, source }', description: '弹层或行内主体请求显隐时触发；受控模式等待父级回写 visible。' },
    { name: 'confirm', detail: '{ value, values, source: "button" }', description: '确认当前选择时触发；autoClose=true 时随后请求 visible=false。' },
    { name: 'cancel', detail: '{ source: "button" }', description: '取消按钮点击时先触发，随后请求 visible=false；不改变日期值。' },
    { name: 'retry', detail: '{ source: "button", month }', description: '错误态 Retry 点击时触发；组件保持 error，等待消费者重新请求并回写。' },
  ],
  navbar: [
    { name: 'left-click', detail: '{ source: "left" }', description: '默认返回箭头可用时触发；不自动调用 wx.navigateBack。' },
    { name: 'leftBtn', detail: '{ source: "leftBtn" }', description: '配置 leftBtn 且未禁用时触发；页面可用 bind:leftBtn 直接接收该操作。' },
    { name: 'rightBtn', detail: '{ source: "rightBtn" }', description: '配置 rightBtn 且未禁用时触发；页面可用 bind:rightBtn 直接接收该操作。' },
  ],
  tabs: [
    { name: 'click', detail: '{ value, previousValue, index, item, source: "tap", controlled }', description: '可用 Tab 点击时总是触发；重复点击当前项只触发 click，不重复触发 change。' },
    { name: 'change', detail: '{ value, previousValue, index, item, source: "tap" | "swipe", controlled }', description: '当前项真实请求变化时触发一次；受控模式等待父级回写 value。' },
  ],
  tabbar: [
    { name: 'click', detail: '{ value, previousValue, previousIndex, index, item, source: "item", controlled }', description: '可用目的地点击时总是触发；重复点击当前项只触发 click，不重复触发 change。' },
    { name: 'change', detail: '{ value, previousValue, previousIndex, index, item, source: "item", controlled }', description: '目的地真实请求变化时紧随 click 触发一次；受控模式等待父级回写 value。' },
  ],
  tag: [
    { name: 'close', detail: '{ source: "close" }', description: 'closable=true 且未禁用时触发；组件不自行隐藏，消费者应真实更新父级列表或显隐状态。' },
  ],
  icon: [
    { name: 'load', detail: '{ name, source: "font" }', description: 'name 解析到本地字体码点时触发一次。' },
    { name: 'error', detail: '{ name, error }', description: '未知名称或字体映射缺失时触发，并显示首字符回退。' },
  ],
  avatar: [
    { name: 'error', detail: '{ src, ...imageDetail }', description: '原生 image 加载失败时触发；随后展示回退或按 hideOnLoadFailed 退场。' },
  ],
  image: [
    { name: 'load', detail: '{ src, ...imageDetail }', description: '原生 image 真实加载完成时触发；外部 loading/error 状态不会伪造该事件。' },
    { name: 'error', detail: '{ src, ...imageDetail }', description: '原生 image 真实加载失败时触发并展示错误回退。' },
  ],
  'pull-refresh': [
    { name: 'change', detail: '{ value, source, controlled }', description: '刷新轨道请求展开或收起时触发；value 受控时必须由父级回写。' },
    { name: 'dragstart', detail: '{ source: "touch", scrollTop }', description: '内部 scroll-view 位于顶部且开始向下拖拽时触发。' },
    { name: 'dragging', detail: '{ distance, percent, status, source: "touch" }', description: '拖拽位移变化时触发；status 为 pulling 或 ready。' },
    { name: 'dragend', detail: '{ distance, refresh, source: "touch" }', description: '拖拽结束时触发；refresh=true 后紧接 change(true) 与 refresh。' },
    { name: 'refresh', detail: '{ value: true, source, controlled }', description: '达到 loadingBarHeight 后的真实刷新请求；不表示网络成功。' },
    { name: 'scrolltolower', detail: '原生 scroll-view detail', description: '内部内容滚动到 lowerThreshold 范围时转发。' },
    { name: 'timeout', detail: '{ timeout, source: "timeout", controlled }', description: 'refreshTimeout 到期后触发；只请求收起刷新轨道，不伪造业务成功。' },
  ],
};

const apiSlots = {
  tour: [
    { name: 'default', description: '追加到当前步骤正文后的轻量 PUI 内容；不接管目标测量、步骤切换或关闭。' },
  ],
  card: [
    { name: 'default', description: 'Card 的主体内容；可组合 Cell、Tag、Button 等 PUI 组件。' },
    { name: 'header', description: '追加到标题和说明后的 Header 内容；无标题说明时需同时设置 showHeader。' },
    { name: 'header-right', description: '固定 Header 右侧轨道；最多放三个紧凑 PUI 图标按钮，超出的业务操作应进入 menuItems。' },
    { name: 'footer', description: '仅 showFooter=true 时渲染；主要业务动作由调用方的 PUI Button 处理。' },
  ],
  'config-provider': [
    { name: 'default', description: '需要继承当前主题与视觉 Token 的页面或组件子树。' },
  ],
  'scroll-area': [
    { name: 'default', description: '需要在固定区域内滚动的内容；可直接组合 pui-cell、pui-list 与其他 PoemUI 组件。给目标节点设置 id 后，可由 scrollIntoView 定位。' },
  ],
  button: [
    { name: 'default', description: '按钮文字或自定义内容；基础用法优先使用。' },
    { name: 'icon', description: '前置图标内容；简单图标也可直接使用 icon 属性。' },
    { name: 'suffix', description: '按钮尾部补充内容，例如 Badge 或方向图标。' },
  ],
  loading: [
    { name: 'default', description: '追加在文字后的简短业务状态，例如 pui-tag；不表达请求成功或失败。' },
    { name: 'indicator', description: '追加或替换指示器附近的内容；不改变 loading、delay 或动画状态。' },
    { name: 'text', description: '追加或替换文字区域的内容；与 text 属性并列时由调用者避免重复文案。' },
  ],
  toast: [
    { name: 'icon', description: '补充或替代内部 Icon/Loading 区域；不改变主题、计时或关闭边界。' },
    { name: 'message', description: '追加提示正文，例如短 Tag；调用方避免与 message 属性重复。' },
  ],
  progress: [
    { name: 'label', description: '追加在可见进度读数附近的短内容；不改变 percentage、状态或任务完成语义。' },
  ],
  skeleton: [
    { name: 'default', description: 'loading=false 时显示的真实内容；Skeleton 不管理数据请求成功、失败、空态或重试。' },
  ],
  empty: [
    { name: 'image', description: 'image 与 icon 均为空时提供图形内容；优先级低于 image 和 icon 属性。' },
    { name: 'description', description: '追加或替代 description 文字；调用方应避免重复文案。' },
    { name: 'action', description: '空状态后的下一步入口；在 Slot 内组合真实 pui-button，并由消费者处理业务回写。' },
  ],
  'notice-bar': [
    { name: 'prefix-icon', description: '通知前置图标区域；属性为 false 时不渲染默认图标，具名 Slot 可提供自定义内容。' },
    { name: 'content', description: '公告正文区域；与 content 属性并列时由调用方避免重复内容。' },
    { name: 'operation', description: '公告操作区域；业务动作由 Slot 内真实 PUI Button 或父级 click 处理。' },
    { name: 'suffix-icon', description: '通知尾部图标区域；例如由父级通过 click 事件实现关闭或跳转。' },
  ],
  result: [
    { name: 'image', description: '在 image 和 icon 均为空时提供图形内容；image 属性优先于 icon，icon=false 可显式让出该区域。' },
    { name: 'title', description: '追加或替代 title 文字；调用方应避免与 title 属性重复。' },
    { name: 'description', description: '追加或替代 description 文字；流程下一步由同级 PUI Button、Cell 或页面容器承担。' },
  ],
  'pull-refresh': [
    { name: 'header', description: '位于刷新提示轨道之后、默认内容之前的可滚动补充区域。' },
    { name: 'default', description: '实际可滚动的业务内容；可组合 Cell、List 等 PoemUI 组件。' },
  ],
  dialog: [
    { name: 'top', description: 'Dialog Surface 顶部的消费者内容；不替代遮罩、显隐或动画。' },
    { name: 'header-left', description: 'Header 左侧固定轨道；用于一个紧凑 PUI 图标按钮，并与右侧默认关闭按钮保持对称。' },
    { name: 'title', description: '追加在 title 文本后的标题内容；空左轨仍保留，标题保持几何居中。' },
    { name: 'content', description: '追加或替代正文内容；可组合 Cell、Badge、Loading、Empty 和 Button，由消费者管理请求状态。' },
    { name: 'middle', description: '正文与操作区之间的消费者内容。' },
    { name: 'actions', description: '操作区的消费者内容；与 actions/cancelBtn/confirmBtn 组合时，内部事件仍由消费者处理。' },
    { name: 'cancel-btn', description: '取消按钮后的消费者内容；取消事件仍只由内建 cancelBtn 触发。' },
    { name: 'confirm-btn', description: '确认按钮后的消费者内容；确认事件仍只由内建 confirmBtn 触发。' },
  ],
  popup: [
    { name: 'default', description: 'Popup 的完整业务内容；可组合 Cell、Form、Loading、Empty 和 Button，业务状态与事件由消费者管理。' },
    { name: 'content', description: '内容区域的具名补充或替换内容；与 default slot、content 属性并列时由调用方避免重复。' },
    { name: 'surface-top', description: '直接贴合 Popup Surface 顶边的非布局内容；推荐组合 pui-top-loading，由 Surface 提供定位上下文与圆角裁切。' },
    { name: 'header-left', description: 'Header 左侧操作区；调用方应放入圆形 PUI IconButton，并自行处理该业务动作。' },
    { name: 'close-btn', description: 'Header 右侧自定义关闭区；替换默认圆形关闭控件时，同时传入 closeBtn=false，并提供等价的可访问名称与关闭交互。' },
    { name: 'footer', description: 'Footer 主要动作区；调用方应放入真实 PUI Button，Footer 提供满宽承载轨，按钮可用 block 填满；事件由 Slot 内按钮与父级业务处理，Popup 不伪造成功。' },
  ],
  popover: [
    { name: 'default', description: 'Popover 的触发元素；调用方使用 PUI Button、Cell 等提供具体操作和可访问名称。' },
    { name: 'content', description: '气泡内的组合内容；与 content 属性并列时由调用方避免重复，业务状态由 Slot 内消费者管理。' },
  ],
  'action-sheet': [
    { name: 'default', description: '追加在 ActionSheet 自身动作列表后的消费者内容；可组合 PUI Cell、Button 等，但业务加载、错误、空态和结果由消费者管理。' },
  ],
  overlay: [
    { name: 'default', description: '遮罩上的消费者内容；可组合 Cell、Button 等 PUI 组件，点按会沿遮罩根发布 click，由父级管理 visible。' },
  ],
  watermark: [
    { name: 'content', description: '位于水印层下方的补充内容；与 content 字符串、default Slot 按自然文档流组合。' },
    { name: 'default', description: '被水印覆盖的业务内容；可组合 PUI Cell、Button、Input 等，水印层不截获其交互。' },
  ],
  'back-top': [
    { name: 'icon', description: '补充或替换 icon 属性的图标内容；应保持短小，点击仍由 BackTop 管理。' },
    { name: 'default', description: '追加在 text 后的短内容；不接管滚动、显隐或 to-top 事件。' },
  ],
  sticky: [
    { name: 'default', description: '需要吸顶的内容；推荐组合 pui-cell 等 PUI 组件，内容自身的业务交互仍由消费者处理。' },
  ],
  divider: [
    { name: 'default', description: '横向分割线中的自定义短内容；content 为空时需同时设置 showContent。' },
  ],
  cell: [
    { name: 'media', description: '最左侧自定义媒体；与 image/leftIcon 为显式并列组合。' },
    { name: 'title', description: '追加在 title 后的标题内容，例如 Tag。' },
    { name: 'description', description: '追加在 description 后的说明内容。' },
    { name: 'value', description: '追加在右侧 value 后的内容，例如 Badge 或 Tag。' },
    { name: 'note', description: '追加在正文 note 后的补充内容。' },
    { name: 'default', description: '正文末尾的扩展内容。' },
    { name: 'right', description: '最右侧独立操作；容器阻止冒泡，内部 Button 事件由消费者处理。' },
  ],
  badge: [
    { name: 'default', description: '被徽标附着的宿主内容；content 非空时由 content 文本接管。' },
    { name: 'count', description: 'count=null 时接管徽标正文；用于组合 Icon 与极短文字，dot=true 时不渲染。' },
  ],
  avatar: [
    { name: 'default', description: 'useSlot=true 时接管图片失败或未传图片时的回退内容。' },
  ],
  image: [
    { name: 'default', description: 'showSlot=true 时覆盖在图片或状态层之上的消费者内容；事件属于 Slot 自身。' },
  ],
  tag: [
    { name: 'default', description: '普通静态文字或短组合内容；与 content 并列，避免重复传入同一文案。' },
  ],
  input: [
    { name: 'label', description: 'label="slot" 时接管字段标签内容；required 星号仍由 Input 管理。' },
    { name: 'prefix', description: 'prefix="slot" 时接管输入框前置短文本或操作区域。' },
    { name: 'prefix-icon', description: 'prefixIcon="slot" 时接管输入框前置图标区域。' },
    { name: 'suffix', description: 'suffix="slot" 时接管后置短文本或操作内容。' },
    { name: 'suffix-icon', description: 'suffixIcon="slot" 时接管最右侧图标区域。' },
    { name: 'tips', description: 'tips="slot" 时接管状态提示；颜色继续跟随 status。' },
    { name: 'extra', description: '输入框下方的消费者扩展内容；不参与值、状态或事件计算。' },
  ],
  textarea: [
    { name: 'label', description: 'label="slot" 时接管字段标签内容；required 星号仍由 Textarea 管理。' },
    { name: 'tips', description: 'tips="slot" 时接管状态提示；颜色和可访问角色继续跟随 status。' },
    { name: 'extra', description: '文本域下方的消费者扩展内容；不参与值、计数或事件计算。' },
  ],
  search: [
    { name: 'default', description: '取消按钮后的自定义短操作内容；不承接结果列表、加载态或错误态。' },
  ],
  checkbox: [
    { name: 'default', description: '标签与说明后的消费者补充内容；不参与选中值计算。' },
    { name: 'label', description: '接管主标签内容；文本 label 仍可作为无障碍回退。' },
    { name: 'content', description: '接管补充说明内容；contentDisabled 仍只限制该正文区域触发。' },
  ],
  radio: [
    { name: 'default', description: '标签与说明后的消费者补充内容；不参与组值计算。' },
    { name: 'label', description: '接管主标签内容；文本 label 仍可作为无障碍回退。' },
    { name: 'content', description: '接管补充说明内容；contentDisabled 仍只限制该正文区域触发。' },
    { name: 'icon', description: 'icon="slot" 时接管选中图标；值与 change 仍由 Radio/RadioGroup 管理。' },
  ],
  field: [
    { name: 'default', description: '字段控件内容；推荐组合 pui-input、pui-select、pui-switch 等真实 PUI 控件。' },
    { name: 'label', description: 'label="slot" 时接管标签内容；required 标记仍由 Field 管理。' },
    { name: 'help', description: 'help="slot" 时接管帮助内容；不改变校验状态。' },
    { name: 'message', description: 'message="slot" 时接管反馈内容；颜色与可访问角色继续跟随 status。' },
    { name: 'extra', description: '反馈区后的消费者扩展内容；Field 不解释其业务状态或事件。' },
  ],
  form: [
    { name: 'default', description: '组合 pui-field 与真实 Input、Select、Switch、RadioGroup 等控件；提交和重置操作由消费者使用 PUI Button 组合。' },
  ],
  'count-down': [
    { name: 'default', description: 'content="slot" 时接管可见内容；计时、change/finish 和实例方法仍由 CountDown 管理。' },
  ],
  'swipe-cell': [
    { name: 'default', description: '前景内容区域；通常组合 pui-cell，SwipeCell 只管理其位移与收起手势。' },
    { name: 'left', description: '左侧滑动操作区域；与 left 数组并列渲染，Slot 内操作由消费者自行处理。' },
    { name: 'right', description: '右侧滑动操作区域；与 right 数组并列渲染，Slot 内操作由消费者自行处理。' },
  ],
  table: [
    { name: 'empty', description: 'customEmpty=true 且数据为空时接管默认 PUI Empty；不覆盖 loading/error。' },
  ],
  upload: [
    { name: 'add', description: 'customAdd=true 时接管添加入口的可见内容；点击仍调用同一个微信平台选择器。' },
  ],
  navbar: [
    { name: 'left', description: '默认返回箭头之后的左侧消费者内容；消费者自己处理业务事件。' },
    { name: 'title', description: '标题区消费者内容；使用时应省略 title，避免与文字标题并列。' },
    { name: 'right', description: '仅 capsule=false 时渲染的右侧消费者区域；默认原生胶囊模式不渲染它，避免占用右上系统区域。' },
  ],
  tabs: [
    { name: 'default', description: '当前 Tab 对应的内容面板；加载、空、错误与重试由面板内业务组件真实处理。' },
  ],
};

const apiMethods = {
  'area-chart': [
    { name: 'replay()', returns: 'void', description: '重播当前面积图的入场淡入；不改变 items、比例、主题或业务数据。' },
  ],
  'bar-chart': [
    { name: 'replay()', returns: 'void', description: '从共享零基线重播当前条形的级联入场；不改变 items 或 scaleMax。' },
  ],
  waffle: [
    { name: 'replay()', returns: 'void', description: '按当前点阵顺序重播缩放淡入；不改变数量、有效单位或主题。' },
  ],
  'donut-chart': [
    { name: 'replay()', returns: 'void', description: '重播当前圆环图的旋转缩放入场；不改变 items、比例、主题或业务数据。' },
  ],
  'radar-chart': [
    { name: 'replay()', returns: 'void', description: '从中心重播当前雷达数据面的缩放淡入；不改变维度、系列或业务数据。' },
  ],
  'sortable-list': [
    { name: 'move(from, to)', returns: 'Boolean', description: '请求把可用项从 from 移到 to 并发布 change；父级负责回写和持久化。' },
    { name: 'cancel()', returns: 'Boolean', description: '取消当前拖动并恢复开始前顺序；没有活动拖动时返回 false。' },
    { name: 'getItems()', returns: 'Array', description: '读取当前可见顺序的无内部字段快照，不触发事件。' },
  ],
  tour: [
    { name: 'open(index?)', returns: 'Boolean', description: '请求从可选步骤打开引导；受控模式等待父级回写 visible/current。' },
    { name: 'close(reason?)', returns: 'Boolean', description: '请求关闭当前引导并发布 close 与 visible-change。' },
    { name: 'next()', returns: 'Boolean', description: '请求下一步；最后一步固定发布 finish 后请求关闭。' },
    { name: 'prev()', returns: 'Boolean', description: '请求上一步；已经在第一步时返回 false。' },
  ],
  toast: [
    { name: 'show(options?)', returns: 'void', description: '合并提供的 Toast Props，挂载并在下一帧进入；duration>0 时进入完成后安排自动 hide()。' },
    { name: 'hide()', returns: 'void', description: '取消等待计时并进入退场；节点卸载后触发 close。' },
  ],
  'dynamic-message': [
    { name: 'show(options)', returns: 'String', description: '展示消息并返回 key；当前同 key 时原位更新，不同 key 时按调用顺序进入队列。loading 未显式传 duration 时持续显示。' },
    { name: 'update(key, patch)', returns: 'Boolean', description: '原位更新当前或排队消息；命中返回 true，未知 key 返回 false，不创建假消息。' },
    { name: 'hide(key?)', returns: 'Boolean', description: '当前消息进入真实退场；指定排队 key 时只移出队列。没有匹配消息时返回 false。' },
  ],
  dialog: [
    { name: 'close()', returns: 'Boolean', description: '发布 close({ trigger: "programmatic" }) 请求；父级回写 visible=false 后由 Popup 完成退场。visible 已为 false 时返回 false。' },
  ],
  form: [
    { name: 'validate(options?)', returns: 'Promise<Object>', description: '按 fields/trigger 校验当前受控 data，更新关联 Field，并触发 validate。' },
    { name: 'submit(options?)', returns: 'Promise<Object>', description: '以 submit 触发器执行校验，固定先 validate 后 submit；不代替业务提交请求。' },
    { name: 'reset(options?)', returns: 'Object', description: '按 fields 和 initial/empty 生成下一份 data，清除对应校验并触发 reset，等待父级回写。' },
    { name: 'clearValidate(fields?)', returns: 'void', description: '清除全部或指定 Field 的校验反馈，不改变 data。' },
    { name: 'setValidateMessage(messages)', returns: 'Object', description: '写入服务端或业务校验消息；支持字符串或 error/warning 消息数组，不改变 data。' },
  ],
  picker: [
    { name: 'open()', returns: 'Boolean', description: '请求打开 Popup；受控模式等待父级回写 visible，内联/禁用/只读时返回 false。' },
    { name: 'close(source?)', returns: 'Boolean', description: '请求关闭 Popup，并发布 visible-change → close；内联模式返回 false。' },
    { name: 'confirm(source?)', returns: 'Boolean', description: '提交当前滚轮草稿，固定按 confirm → change → 可选关闭顺序执行。' },
    { name: 'cancel(source?)', returns: 'Boolean', description: '丢弃草稿并发布 cancel，autoClose=true 时再请求关闭。' },
    { name: 'reset()', returns: 'Array | false', description: '请求恢复 defaultValue；禁用、只读或非内容状态返回 false，受控模式只发布 change 并等待父级回写。' },
    { name: 'getValue()', returns: 'Array', description: '读取当前已提交值，不返回尚未确认的滚轮草稿。' },
  ],
  'date-time-picker': [
    { name: 'open()', returns: 'Boolean', description: '请求打开 Popup；内联、禁用或只读时返回 false。' },
    { name: 'close(source?)', returns: 'Boolean', description: '请求关闭 Popup；内联模式返回 false。' },
    { name: 'confirm(source?)', returns: 'Boolean', description: '确认当前日期时间草稿并按固定事件顺序发布。' },
    { name: 'cancel(source?)', returns: 'Boolean', description: '丢弃草稿并按 autoClose 策略关闭；disabled 时返回 false。' },
    { name: 'reset()', returns: 'Object | false', description: '请求恢复 defaultValue；受控模式只发布 change 并等待父级回写。' },
    { name: 'getValue()', returns: 'Object', description: '读取当前已提交 value、timestamp、parts、mode 与 controlled。' },
  ],
  'count-down': [
    { name: 'start()', returns: 'Boolean', description: '从当前剩余时间继续；正在运行、paused=true 或已归零时返回 false。' },
    { name: 'pause()', returns: 'Boolean', description: '按目标时间保存精确剩余值；数值实际变化时触发 change，未运行时返回 false。' },
    { name: 'reset()', returns: 'Number', description: '恢复到 time、触发 change，并按 autoStart/paused 决定是否重新开始。' },
    { name: 'getTime()', returns: 'Number', description: '读取当前真实剩余毫秒，不触发事件也不改变运行状态。' },
  ],
  table: [
    { name: 'selectAll(selected?)', returns: 'Boolean', description: '多选模式选择或取消全部可用行；保留已选禁用行。' },
    { name: 'clearSelection()', returns: 'Boolean', description: '请求清空选择；受控模式等待父级回写。' },
    { name: 'toggleRow(key, selected?)', returns: 'Boolean', description: '按原始 rowKey 请求切换指定可用行。' },
    { name: 'sortBy(key, order?)', returns: 'Boolean', description: '请求按可排序列 asc/desc 排序，默认 asc。' },
    { name: 'clearSort()', returns: 'Boolean', description: '请求清除当前排序并恢复稳定原始顺序。' },
    { name: 'scrollTo({ left, top })', returns: '{ left, top }', description: '把局部滚动目标规整到安全范围并真实写入 scroll-view。' },
    { name: 'retry()', returns: 'Boolean', description: '仅在 error 且未禁用时发布 retry 请求。' },
    { name: 'getSelection()', returns: 'Array', description: '读取当前有效选择键，不触发事件。' },
    { name: 'getSort()', returns: 'Object | null', description: '读取当前有效排序，不触发事件。' },
  ],
  swiper: [
    { name: 'select(value)', returns: 'Boolean', description: '按严格原始值请求切换到指定条目。' },
    { name: 'next()', returns: 'Boolean', description: '按 circular 或边界规则请求下一项。' },
    { name: 'prev()', returns: 'Boolean', description: '按 circular 或边界规则请求上一项。' },
    { name: 'reset()', returns: 'Boolean', description: '请求恢复 defaultValue 或第一项。' },
    { name: 'retry()', returns: 'Boolean', description: '仅在可重试错误态发布 retry 请求。' },
    { name: 'getValue()', returns: 'unknown', description: '读取当前严格原始值，不触发事件。' },
    { name: 'getState()', returns: 'Object', description: '读取当前项、状态、方向、自动播放与禁用快照。' },
  ],
  input: [
    { name: 'focus()', returns: 'Boolean', description: '请求原生输入框聚焦；disabled、readonly 或 loading 时返回 false。' },
    { name: 'blur()', returns: 'Boolean', description: '请求原生输入框失焦，不改变当前值。' },
    { name: 'clear()', returns: 'Object | false', description: '请求清空并按 clear → change 发布；不可交互或已经为空时返回 false。' },
    { name: 'getValue()', returns: 'String', description: '读取当前真实渲染值，不触发事件。' },
  ],
  textarea: [
    { name: 'focus()', returns: 'Boolean', description: '请求原生 textarea 聚焦；disabled、readonly 或 loading 时返回 false。' },
    { name: 'blur()', returns: 'Boolean', description: '请求原生 textarea 失焦，不改变当前值。' },
    { name: 'getValue()', returns: 'String', description: '读取当前真实渲染值，不触发事件。' },
  ],
};

const packageComponents = sourceGroups
  .flatMap((group) => group.items)
  .filter((item) => item.kind === 'component')
  .map((item) => item.id)
  .filter((id, index, items) => items.indexOf(id) === index);

module.exports = {
  groups,
  details,
  componentSummaries,
  componentCopy,
  apiProps,
  apiPropGroups,
  apiEvents,
  apiSlots,
  apiMethods,
  starterUsage,
  packageComponents,
  releaseComponentIds,
};
