var BASE_COMPONENTS = [
  {
    key: 'button',
    name: 'Button',
    description: '按钮与操作入口',
    icon: 'button',
    url: '/pages/components/button/index',
    keywords: 'button 按钮'
  },
  {
    key: 'divider',
    name: 'Divider',
    description: '内容分区与节奏',
    icon: 'divider',
    url: '/pages/components/divider/index',
    keywords: 'divider 分隔线'
  },
  {
    key: 'icon',
    name: 'Icon',
    description: '本地图形与语义展示',
    icon: 'icon',
    url: '/pages/components/icon/index',
    keywords: 'icon 图标'
  }
];

var GETTING_STARTED_ITEMS = [
  { key: 'config-provider', name: 'ConfigProvider', description: '为页面或局部区域提供统一外观配置。', icon: 'palette', url: '/pages/components/config-provider/index', keywords: 'config-provider 主题 外观 provider', kind: 'component' },
  { key: 'getting-started', name: '开始使用', description: '安装、构建 npm 与按需引用。', icon: 'package', url: '/pages/guides/getting-started/index', keywords: '开始 使用 安装 npm 构建', kind: 'guide' },
  { key: 'theme-tokens', name: '主题 Token', description: '主题变量与 Provider 的使用边界。', icon: 'palette', url: '/pages/guides/theme-tokens/index', keywords: '主题 token 深色 浅色', kind: 'guide' },
  { key: 'color', name: '颜色', description: '语义颜色与中性色层级。', icon: 'tag-price', url: '/pages/guides/color/index', keywords: '颜色 色彩 语义', kind: 'guide' },
  { key: 'spacing', name: '间距', description: '分区、内容与控件的空间节奏。', icon: 'rows', url: '/pages/guides/spacing/index', keywords: '间距 spacing gap padding', kind: 'guide' },
  { key: 'typography', name: '字体排版', description: '字号、行高、字重与截断规则。', icon: 'text', url: '/pages/guides/typography/index', keywords: '字体 排版 typography 行高', kind: 'guide' }
];

var NAVIGATION_COMPONENTS = [
  { key: 'navbar', name: 'Navbar', description: '承载页面标题与主要操作。', icon: 'menu', url: '/pages/components/navbar/index', keywords: 'navbar 导航栏 顶部导航' },
  { key: 'navigation-menu', name: 'NavigationMenu', description: '组织页面内的导航选项。', icon: 'layers', url: '/pages/components/navigation-menu/index', keywords: 'navigation-menu 导航菜单' },
  { key: 'tabs', name: 'Tabs', description: '在同级内容间切换。', icon: 'list-bullet', url: '/pages/components/tabs/index', keywords: 'tabs 标签页 分页' },
  { key: 'breadcrumb', name: 'Breadcrumb', description: '展示当前位置与返回路径。', icon: 'route', url: '/pages/components/breadcrumb/index', keywords: 'breadcrumb 面包屑 路径' },
  { key: 'tabbar', name: 'Tabbar', description: '提供应用的底部目的地。', icon: 'navigation-pointer', url: '/pages/components/tabbar/index', keywords: 'tabbar 底部导航' },
  { key: 'steps', name: 'Steps', description: '呈现任务所处的阶段。', icon: 'list-number', url: '/pages/components/steps/index', keywords: 'steps 步骤 进度' },
  { key: 'back-top', name: 'BackTop', description: '帮助长内容快速回到顶部。', icon: 'arrow-up', url: '/pages/components/back-top/index', keywords: 'back-top 回到顶部' },
  { key: 'indexes', name: 'Indexes', description: '按索引快速定位长列表。', icon: 'list-bullet', url: '/pages/components/indexes/index', keywords: 'indexes 索引 列表' },
  { key: 'sidebar', name: 'SideBar', description: '在侧边切换内容分组。', icon: 'sidebar-left', url: '/pages/components/sidebar/index', keywords: 'sidebar 侧边栏 导航' }
];

var LAYOUT_COMPONENTS = [
  { key: 'aspect-ratio', name: 'AspectRatio', description: '按固定比例承载内容。', icon: 'image', url: '/pages/components/aspect-ratio/index', keywords: 'aspect-ratio 宽高比 比例' },
  { key: 'direction', name: 'Direction', description: '统一控制内容阅读方向。', icon: 'arrow-left-right', url: '/pages/components/direction/index', keywords: 'direction 方向 ltr rtl' },
  { key: 'grid', name: 'Grid', description: '按网格排列功能入口。', icon: 'grid', url: '/pages/components/grid/index', keywords: 'grid 宫格 网格' },
  { key: 'scroll-area', name: 'ScrollArea', description: '在固定区域内滚动内容。', icon: 'scroll-area', url: '/pages/components/scroll-area/index', keywords: 'scroll-area 滚动 区域' },
  { key: 'sticky', name: 'Sticky', description: '让内容在滚动时保持可见。', icon: 'pin', url: '/pages/components/sticky/index', keywords: 'sticky 吸顶 固定' }
];

var FEEDBACK_COMPONENTS = [
  { key: 'alert', name: 'Alert', description: '页面内的短提示块。', icon: 'info-circle', url: '/pages/components/alert/index', keywords: 'alert 提示 警告' },
  { key: 'empty', name: 'Empty', description: '为空内容提供清晰的下一步。', icon: 'inbox', url: '/pages/components/empty/index', keywords: 'empty 空状态 空内容' },
  { key: 'loading', name: 'Loading', description: '表达正在处理的状态。', icon: 'loading-ring', url: '/pages/components/loading/index', keywords: 'loading 加载 处理中' },
  { key: 'notice-bar', name: 'NoticeBar', description: '连续展示页面公告。', icon: 'bell', url: '/pages/components/notice-bar/index', keywords: 'notice-bar 公告 通知' },
  { key: 'progress', name: 'Progress', description: '展示明确的任务进度。', icon: 'progress', url: '/pages/components/progress/index', keywords: 'progress 进度' },
  { key: 'result', name: 'Result', description: '呈现当前结果和下一步。', icon: 'success-circle', url: '/pages/components/result/index', keywords: 'result 结果 成功' },
  { key: 'skeleton', name: 'Skeleton', description: '在内容到达前保留结构。', icon: 'grid', url: '/pages/components/skeleton/index', keywords: 'skeleton 骨架屏 占位' },
  { key: 'toast', name: 'Toast', description: '显示短暂的操作提示。', icon: 'message', url: '/pages/components/toast/index', keywords: 'toast 轻提示 消息' },
  { key: 'dialog', name: 'Dialog', description: '在关键操作前请求确认。', icon: 'dialog', url: '/pages/components/dialog/index', keywords: 'dialog 对话框 确认 弹窗' }
];

var OVERLAY_COMPONENTS = [
  { key: 'popup', name: 'Popup', description: '从屏幕边缘展开浮层内容。', icon: 'popup', url: '/pages/components/popup/index', keywords: 'popup 浮层 弹出层' },
  { key: 'popover', name: 'Popover', description: '在触发元素旁展示轻量内容。', icon: 'popover', url: '/pages/components/popover/index', keywords: 'popover 气泡浮层' },
  { key: 'sheet', name: 'Sheet', description: '从屏幕底部承载任务内容。', icon: 'sheet', url: '/pages/components/sheet/index', keywords: 'sheet 底部面板' },
  { key: 'action-sheet', name: 'ActionSheet', description: '从底部展示一组可选操作。', icon: 'action-sheet', url: '/pages/components/action-sheet/index', keywords: 'action-sheet 动作面板' },
  { key: 'dropdown-menu', name: 'DropdownMenu', description: '从触发项下方展开选项。', icon: 'dropdown-menu', url: '/pages/components/dropdown-menu/index', keywords: 'dropdown-menu 下拉菜单' },
  { key: 'overlay', name: 'Overlay', description: '遮罩当前页面以聚焦内容。', icon: 'overlay', url: '/pages/components/overlay/index', keywords: 'overlay 遮罩' }
];

var ADVANCED_COMPONENTS = [
  { key: 'pull-refresh', name: 'PullRefresh', description: '在列表顶部发出刷新请求。', icon: 'refresh', url: '/pages/components/pull-refresh/index', keywords: 'pull-refresh 下拉刷新' },
  { key: 'virtual-list', name: 'VirtualList', description: '窗口化渲染长列表内容。', icon: 'list-bullet', url: '/pages/components/virtual-list/index', keywords: 'virtual-list 虚拟列表 长列表' },
  { key: 'watermark', name: 'Watermark', description: '在内容区域添加可配置水印。', icon: 'layers', url: '/pages/components/watermark/index', keywords: 'watermark 水印 重复' }
];

var DATA_COMPONENTS = [
  { key: 'avatar', name: 'Avatar', description: '展示人物或对象头像。', icon: 'user', url: '/pages/components/avatar/index', keywords: 'avatar 头像 图片' },
  { key: 'badge', name: 'Badge', description: '在对象旁展示数量或提醒。', icon: 'badge', url: '/pages/components/badge/index', keywords: 'badge 徽标 数量' },
  { key: 'card', name: 'Card', description: '将相关内容组织为一组。', icon: 'panel-top', url: '/pages/components/card/index', keywords: 'card 卡片 内容' },
  { key: 'image', name: 'Image', description: '加载并展示图片内容。', icon: 'image', url: '/pages/components/image/index', keywords: 'image 图片 加载' },
  { key: 'tag', name: 'Tag', description: '用简短文字标记属性或状态。', icon: 'tag', url: '/pages/components/tag/index', keywords: 'tag 标签 关闭' },
  { key: 'cell', name: 'Cell', description: '展示单行信息或操作入口。', icon: 'cell', url: '/pages/components/cell/index', keywords: 'cell 单元格 导航' },
  { key: 'list', name: 'List', description: '按顺序展示多条内容。', icon: 'list-bullet', url: '/pages/components/list/index', keywords: 'list 列表 加载' },
  { key: 'collapse', name: 'Collapse', description: '展开或收起多组内容。', icon: 'rows', url: '/pages/components/collapse/index', keywords: 'collapse 折叠 面板' },
  { key: 'collapsible', name: 'Collapsible', description: '展开或收起一段内容。', icon: 'chevron-down', url: '/pages/components/collapsible/index', keywords: 'collapsible 折叠 内容' },
  { key: 'bubble', name: 'Bubble', description: '以气泡展示对话消息。', icon: 'message', url: '/pages/components/bubble/index', keywords: 'bubble 气泡 消息' },
  { key: 'swipe-cell', name: 'SwipeCell', description: '滑动单元格显示快捷操作。', icon: 'swipe-cell', url: '/pages/components/swipe-cell/index', keywords: 'swipe-cell 滑动 单元格' },
  { key: 'count-down', name: 'CountDown', description: '展示距离目标时间的倒计时。', icon: 'clock', url: '/pages/components/count-down/index', keywords: 'count-down 倒计时 开始 暂停' },
  { key: 'swiper', name: 'Swiper', description: '轮播展示多个内容项。', icon: 'gallery-horizontal', url: '/pages/components/swiper/index', keywords: 'swiper 轮播 切换' },
  { key: 'table', name: 'Table', description: '以行列展示结构化数据。', icon: 'table', url: '/pages/components/table/index', keywords: 'table 表格 排序 选择' }
];

var FORM_COMPONENTS = [
  { key: 'form', name: 'Form', description: '组织、校验并提交表单。', icon: 'file-text', url: '/pages/components/form/index', keywords: 'form 表单 校验 提交' },
  { key: 'field', name: 'Field', description: '组合字段标签、控件与校验反馈。', icon: 'edit', url: '/pages/components/field/index', keywords: 'field 字段 标签' },
  { key: 'label', name: 'Label', description: '为表单控件提供标签。', icon: 'text', url: '/pages/components/label/index', keywords: 'label 标签 必填' },
  { key: 'input', name: 'Input', description: '输入少量单行文字。', icon: 'edit', url: '/pages/components/input/index', keywords: 'input 输入 清除' },
  { key: 'input-otp', name: 'InputOTP', description: '输入一次性验证码。', icon: 'keyboard', url: '/pages/components/input-otp/index', keywords: 'input-otp 验证码' },
  { key: 'textarea', name: 'Textarea', description: '输入多行文本内容。', icon: 'align-left', url: '/pages/components/textarea/index', keywords: 'textarea 文本域 多行' },
  { key: 'search', name: 'Search', description: '输入关键词并执行搜索。', icon: 'search', url: '/pages/components/search/index', keywords: 'search 搜索 清除 确认' },
  { key: 'checkbox', name: 'Checkbox', description: '在多个选项中进行多选。', icon: 'checkbox', url: '/pages/components/checkbox/index', keywords: 'checkbox 多选 全选' },
  { key: 'radio', name: 'Radio', description: '在一组选项中单选。', icon: 'radio', url: '/pages/components/radio/index', keywords: 'radio 单选' },
  { key: 'switch', name: 'Switch', description: '切换一个独立功能的开关。', icon: 'slider', url: '/pages/components/switch/index', keywords: 'switch 开关 loading' },
  { key: 'select', name: 'Select', description: '从预设选项中选择。', icon: 'chevron-down', url: '/pages/components/select/index', keywords: 'select 选择器' },
  { key: 'picker', name: 'Picker', description: '通过滚动列选择内容。', icon: 'list-bullet', url: '/pages/components/picker/index', keywords: 'picker 选择 确认 取消' },
  { key: 'combobox', name: 'Combobox', description: '从预设选项中选择并搜索。', icon: 'search', url: '/pages/components/combobox/index', keywords: 'combobox 搜索 多选' },
  { key: 'slider', name: 'Slider', description: '在连续范围内选择数值。', icon: 'slider', url: '/pages/components/slider/index', keywords: 'slider 滑块 数值' },
  { key: 'stepper', name: 'Stepper', description: '按固定步长增减数值。', icon: 'add', url: '/pages/components/stepper/index', keywords: 'stepper 步进器' },
  { key: 'rate', name: 'Rate', description: '对内容进行等级评分。', icon: 'star', url: '/pages/components/rate/index', keywords: 'rate 评分 半星' },
  { key: 'calendar', name: 'Calendar', description: '选择单个日期、范围或多个日期。', icon: 'calendar', url: '/pages/components/calendar/index', keywords: 'calendar 日期 范围' },
  { key: 'date-time-picker', name: 'DateTimePicker', description: '选择日期与时间。', icon: 'clock', url: '/pages/components/date-time-picker/index', keywords: 'date-time-picker 时间 选择' },
  { key: 'upload', name: 'Upload', description: '选择文件并展示受控列表。', icon: 'upload', url: '/pages/components/upload/index', keywords: 'upload 上传 文件 预览' }
];

var CATALOG_SECTIONS = [
  { key: 'getting-started', label: '开始与规范', ariaLabel: '开始与规范页面列表', items: GETTING_STARTED_ITEMS },
  { key: 'basic', label: '基础组件', ariaLabel: '基础组件列表', items: BASE_COMPONENTS },
  { key: 'overlay', label: '浮层', ariaLabel: '浮层组件列表', items: OVERLAY_COMPONENTS },
  { key: 'layout', label: '布局', ariaLabel: '布局组件列表', items: LAYOUT_COMPONENTS },
  { key: 'navigation', label: '导航', ariaLabel: '导航组件列表', items: NAVIGATION_COMPONENTS },
  { key: 'form', label: '表单组件', ariaLabel: '表单组件列表', items: FORM_COMPONENTS },
  { key: 'data', label: '数据展示', ariaLabel: '数据展示组件列表', items: DATA_COMPONENTS },
  { key: 'feedback', label: '反馈', ariaLabel: '反馈组件列表', items: FEEDBACK_COMPONENTS },
  { key: 'advanced', label: '高级', ariaLabel: '高级组件列表', items: ADVANCED_COMPONENTS }
];

var SEARCH_OVERLAY_DURATION = 500;
var HOME_OVERLAY_AUTO_EXPAND_DELAY = 2000;
var HOME_CATALOG_SECTION_STORAGE_KEY = 'poemui.home.activeCatalogSection';
var HOME_SHARE_TITLE = 'Poem UI · 原生小程序组件库';
var HOME_SHARE_IMAGE_URL = '/assets/poemui-moon-lines-black.png';
var HOME_BRAND_MARK_DARK_URL = '/assets/poemui-moon-lines-mark-dark.png';
var HOME_BRAND_MARK_LIGHT_URL = '/assets/poemui-moon-lines-mark-light.png';
var visualConfig = require('poemui-miniprogram/common/utils/visual-config');
var backgroundPreference = require('../../common/utils/page-background-preference');
var tabbarNavigation = require('../../common/utils/tabbar-navigation');

function currentVisualConfig() {
  return visualConfig.get();
}

function brandMarkForTheme(theme) {
  return theme === 'dark' ? HOME_BRAND_MARK_LIGHT_URL : HOME_BRAND_MARK_DARK_URL;
}

function isFruitFlavor(config, gradientEnabled) {
  return Boolean(
    config &&
    config.effectsEnabled !== false &&
    config.shadow === true &&
    config.frostedGlass === true &&
    config.largeRadius === true &&
    config.bordered === false &&
    gradientEnabled === false
  );
}

function allCatalogComponents() {
  return CATALOG_SECTIONS.reduce(function flatten(items, section) {
    return items.concat(section.items);
  }, []);
}

function makeCatalogSummary() {
  var items = allCatalogComponents();
  var guideCount = items.filter(function isGuide(item) {
    return item.kind === 'guide';
  }).length;
  return {
    componentCount: items.length - guideCount,
    guideCount: guideCount
  };
}

function makeSearchOptions(query) {
  var normalizedQuery = String(query == null ? '' : query).trim().toLowerCase();
  var candidates = allCatalogComponents().filter(function matches(component) {
    if (!normalizedQuery) return true;
    return [component.name, component.key, component.description, component.keywords]
      .join(' ')
      .toLowerCase()
      .indexOf(normalizedQuery) !== -1;
  });
  return candidates.map(function toOption(component) {
    return {
      label: component.name,
      value: component.url,
      description: component.kind === 'guide' ? '规范 · ' + component.description : component.description,
      icon: component.icon,
      keywords: component.keywords
    };
  });
}

function randomSearchOptions() {
  var candidates = makeSearchOptions('');
  for (var index = candidates.length - 1; index > 0; index -= 1) {
    var target = Math.floor(Math.random() * (index + 1));
    var current = candidates[index];
    candidates[index] = candidates[target];
    candidates[target] = current;
  }
  return candidates;
}

function getWindowHeight() {
  return wx.getWindowInfo ? wx.getWindowInfo().windowHeight : 0;
}

function isCatalogSectionKey(value) {
  return CATALOG_SECTIONS.some(function matches(section) {
    return section.key === value;
  });
}

function restoreCatalogSection() {
  try {
    var section = wx.getStorageSync ? wx.getStorageSync(HOME_CATALOG_SECTION_STORAGE_KEY) : '';
    return isCatalogSectionKey(section) ? section : '';
  } catch (error) {
    return '';
  }
}

function persistCatalogSection(section) {
  if (!isCatalogSectionKey(section) || !wx.setStorageSync) return false;
  try {
    wx.setStorageSync(HOME_CATALOG_SECTION_STORAGE_KEY, section);
    return true;
  } catch (error) {
    return false;
  }
}

Page({
  data: {
    brandLogo: HOME_SHARE_IMAGE_URL,
    brandMark: brandMarkForTheme(currentVisualConfig().theme),
    catalogSummary: makeCatalogSummary(),
    navbarLeftBtn: { icon: 'search', ariaLabel: '搜索组件' },
    navbarRightBtn: { icon: 'menu', ariaLabel: '打开外观设置' },
    catalogSections: CATALOG_SECTIONS,
    activeCatalogSection: '',
    homeScrollIntoView: '',
    homeScrollTop: 0,
    searchOverlayVisible: false,
    searchOverlayDuration: SEARCH_OVERLAY_DURATION,
    searchInputFocus: false,
    searchComboboxVisible: false,
    searchQuery: '',
    searchOptions: [],
    appearancePopupVisible: false,
    visualConfig: currentVisualConfig(),
    backgroundGradientEnabled: backgroundPreference.get(),
    fruitFlavorEnabled: isFruitFlavor(currentVisualConfig(), backgroundPreference.get()),
    activeTab: 'home',
    tabbarItems: tabbarNavigation.getItems(),
    scrollAreaHeight: '1px',
    layoutReady: false
  },

  onLoad: function () {
    var self = this;
    var restoredCatalogSection = restoreCatalogSection();
    if (restoredCatalogSection) {
      this._catalogSectionInteracted = true;
      this.setData({ activeCatalogSection: restoredCatalogSection });
    }
    visualConfig.restore();
    backgroundPreference.restore();
    this._unsubscribeVisualConfig = visualConfig.subscribe(function onVisualConfigChange(nextConfig) {
      self.syncAppearanceState(nextConfig, backgroundPreference.get());
    });
    this._unsubscribeBackgroundPreference = backgroundPreference.subscribe(function onBackgroundPreferenceChange(gradientEnabled) {
      self.syncAppearanceState(visualConfig.get(), gradientEnabled);
    });
    this._windowResizeHandler = this.onWindowResize.bind(this);
    if (wx.onWindowResize) wx.onWindowResize(this._windowResizeHandler);
  },

  onShow: function () {
    var restoredCatalogSection = restoreCatalogSection();
    if (restoredCatalogSection) {
      this._catalogSectionInteracted = true;
      if (this.data.activeCatalogSection !== restoredCatalogSection) {
        this.setData({ activeCatalogSection: restoredCatalogSection });
      }
      // 返回栈会保留首页 ScrollArea 的真实阅读位置。只有首次冷启动才
      // 使用分区锚点；返回时再执行 scroll-into-view 会把用户拉回分区标题。
      if (this._hasHomeScrollPosition) {
        this.setData({ homeScrollIntoView: '', homeScrollTop: this._homeScrollTop || 0 });
      } else {
        this.scheduleCatalogSectionScroll(restoredCatalogSection);
      }
    }
    this.scheduleMeasureLayout();
    this.scheduleOverlayAutoExpand();
  },

  onReady: function () {
    this.scheduleMeasureLayout();
  },

  onHide: function () {
    clearTimeout(this._overlayAutoExpandTimer);
    clearTimeout(this._catalogSectionScrollTimer);
    this._overlayAutoExpandTimer = null;
    this._catalogSectionScrollTimer = null;
    this._homeScrollTop = Math.max(0, Number(this._homeScrollTop) || Number(this.data.homeScrollTop) || 0);
    this._hasHomeScrollPosition = true;
    this.setData({ homeScrollIntoView: '', homeScrollTop: this._homeScrollTop });
  },

  onUnload: function () {
    clearTimeout(this._measureTimer);
    clearTimeout(this._searchExpandTimer);
    clearTimeout(this._overlayAutoExpandTimer);
    clearTimeout(this._catalogSectionScrollTimer);
    if (this._unsubscribeVisualConfig) this._unsubscribeVisualConfig();
    if (this._unsubscribeBackgroundPreference) this._unsubscribeBackgroundPreference();
    if (wx.offWindowResize && this._windowResizeHandler) wx.offWindowResize(this._windowResizeHandler);
  },

  onWindowResize: function () {
    this.scheduleMeasureLayout();
  },

  scheduleMeasureLayout: function () {
    clearTimeout(this._measureTimer);
    this._measureTimer = setTimeout(this.measureLayout.bind(this), 0);
  },

  scheduleOverlayAutoExpand: function () {
    if (this._overlayAutoExpanded || this._catalogSectionInteracted || this._overlayAutoExpandTimer) return;
    this._overlayAutoExpandTimer = setTimeout(function expandOverlaySection() {
      this._overlayAutoExpandTimer = null;
      if (this._overlayAutoExpanded || this._catalogSectionInteracted) return;
      this._overlayAutoExpanded = true;
      this.setData({ activeCatalogSection: 'overlay' });
    }.bind(this), HOME_OVERLAY_AUTO_EXPAND_DELAY);
  },

  scheduleCatalogSectionScroll: function (section) {
    if (!isCatalogSectionKey(section)) return;
    clearTimeout(this._catalogSectionScrollTimer);
    this.setData({ homeScrollIntoView: '' });
    this._catalogSectionScrollTimer = setTimeout(function scrollToCatalogSection() {
      this._catalogSectionScrollTimer = null;
      if (this.data.activeCatalogSection !== section) return;
      this.setData({ homeScrollIntoView: 'home-section-' + section });
    }.bind(this), 0);
  },

  measureLayout: function () {
    var windowHeight = Number(getWindowHeight());
    if (!windowHeight || !this.createSelectorQuery) return;
    var query = this.createSelectorQuery();
    query.select('#home-navbar').boundingClientRect();
    query.select('#home-tabbar').boundingClientRect();
    query.exec(function (rects) {
      var navbarHeight = rects && rects[0] ? Number(rects[0].height) : 0;
      var tabbarHeight = rects && rects[1] ? Number(rects[1].height) : 0;
      if (!navbarHeight || !tabbarHeight) return;
      this.setData({
        scrollAreaHeight: Math.max(1, Math.floor(windowHeight - navbarHeight - tabbarHeight)) + 'px',
        layoutReady: true
      });
    }.bind(this));
  },

  onOpenSearch: function () {
    clearTimeout(this._searchExpandTimer);
    this.setData({
      searchOverlayVisible: true,
      appearancePopupVisible: false,
      searchInputFocus: false,
      searchComboboxVisible: false,
      searchQuery: '',
      searchOptions: []
    });
    this._searchExpandTimer = setTimeout(function expandSearch() {
      this._searchExpandTimer = null;
      if (!this.data.searchOverlayVisible) return;
      this.setData({
        searchInputFocus: true,
        searchComboboxVisible: true,
        searchOptions: randomSearchOptions()
      });
    }.bind(this), SEARCH_OVERLAY_DURATION);
  },

  onSearchOverlayClick: function (event) {
    clearTimeout(this._searchExpandTimer);
    this._searchExpandTimer = null;
    this.setData({
      searchOverlayVisible: Boolean(event && event.detail && event.detail.visible),
      searchInputFocus: false,
      searchComboboxVisible: false,
      searchQuery: '',
      searchOptions: []
    });
  },

  onSearchChange: function (event) {
    var value = event && event.detail && event.detail.value !== undefined ? event.detail.value : '';
    this.setData({
      searchQuery: String(value),
      searchOptions: makeSearchOptions(value)
    });
  },

  onSearchVisibleInput: function (event) {
    this.setData({
      searchComboboxVisible: Boolean(event && event.detail && event.detail.visible)
    });
  },

  onSearchSelect: function (event) {
    var option = event && event.detail && event.detail.option;
    var url = option && option.value;
    var isComponentRoute = typeof url === 'string' && url.indexOf('/pages/components/') === 0;
    var isGuideRoute = typeof url === 'string' && url.indexOf('/pages/guides/') === 0;
    if (!isComponentRoute && !isGuideRoute) return;
    clearTimeout(this._searchExpandTimer);
    this._searchExpandTimer = null;
    this.setData({
      searchOverlayVisible: false,
      searchInputFocus: false,
      searchComboboxVisible: false,
      searchQuery: '',
      searchOptions: []
    });
    wx.navigateTo({ url: url });
  },

  onSearchContentTap: function () {},

  onOpenAppearance: function () {
    clearTimeout(this._searchExpandTimer);
    this._searchExpandTimer = null;
    this.setData({
      searchOverlayVisible: false,
      searchInputFocus: false,
      searchComboboxVisible: false,
      searchQuery: '',
      searchOptions: [],
      appearancePopupVisible: true
    });
  },

  onAppearancePopupVisibleChange: function (event) {
    this.setData({ appearancePopupVisible: Boolean(event && event.detail && event.detail.visible) });
  },

  onAppearanceSwitchChange: function (event) {
    var setting = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.setting : '';
    var checked = Boolean(event && event.detail && event.detail.checked);
    var patch = {};
    if (setting === 'theme') patch.theme = checked ? 'dark' : 'light';
    if (setting === 'effectsEnabled') patch.effectsEnabled = checked;
    if (setting === 'bordered') patch.bordered = checked;
    if (setting === 'shadow') patch.shadow = checked;
    if (setting === 'frostedGlass') patch.frostedGlass = checked;
    if (setting === 'largeRadius') patch.largeRadius = checked;
    if (setting === 'equalSpacing') patch.equalSpacing = checked;
    if (!Object.keys(patch).length) return;
    visualConfig.set(patch, { source: 'miniprogram-home:appearance:' + setting });
  },

  onBackgroundGradientChange: function (event) {
    backgroundPreference.set(Boolean(event && event.detail && event.detail.checked), {
      source: 'miniprogram-home:gradient'
    });
  },

  onFruitFlavorChange: function (event) {
    var enabled = Boolean(event && event.detail && event.detail.checked);
    var source = enabled ? 'miniprogram-home:fruit' : 'miniprogram-home:standard';
    backgroundPreference.set(false, { source: source });
    visualConfig.set(enabled ? {
      effectsEnabled: true,
      shadow: true,
      frostedGlass: true,
      largeRadius: true,
      bordered: false
    } : {
      effectsEnabled: true,
      shadow: true,
      frostedGlass: false,
      largeRadius: true,
      bordered: false
    }, { source: source });
  },

  onResetAppearance: function () {
    backgroundPreference.set(false, { source: 'miniprogram-home:appearance-reset' });
    visualConfig.reset({ source: 'miniprogram-home:appearance-reset' });
  },

  syncAppearanceState: function (nextVisualConfig, gradientEnabled) {
    var config = nextVisualConfig || currentVisualConfig();
    var gradient = Boolean(gradientEnabled);
    this.setData({
      visualConfig: config,
      brandMark: brandMarkForTheme(config.theme),
      backgroundGradientEnabled: gradient,
      fruitFlavorEnabled: isFruitFlavor(config, gradient)
    });
  },

  onProviderThemeChange: function (event) {
    var actualTheme = event && event.detail && event.detail.theme === 'dark' ? 'dark' : 'light';
    this.setData({ brandMark: brandMarkForTheme(actualTheme) });
  },

  onCatalogSectionChange: function (event) {
    var section = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.section : '';
    var open = Boolean(event && event.detail && event.detail.open);
    if (!section) return;
    this._catalogSectionInteracted = true;
    clearTimeout(this._overlayAutoExpandTimer);
    this._overlayAutoExpandTimer = null;
    if (open) persistCatalogSection(section);
    this.setData({ activeCatalogSection: open ? section : (this.data.activeCatalogSection === section ? '' : this.data.activeCatalogSection) });
  },

  onHomeScroll: function (event) {
    var detail = event && event.detail ? event.detail : {};
    var scrollTop = Math.max(0, Number(detail.scrollTop) || 0);
    this._homeScrollTop = scrollTop;
    // ScrollArea 会忽略与最后一次用户手势相同的受控值；同步到页面 data
    // 既不会抢走惯性，也让 navigateBack 重建时拥有真实而非初始锚点位置。
    if (this.data.homeScrollTop !== scrollTop) this.setData({ homeScrollTop: scrollTop });
  },

  onTabChange: function (event) {
    var value = event && event.detail ? event.detail.value : '';
    tabbarNavigation.navigateToTab(value, this.data.activeTab);
  },

  onShareAppMessage: function () {
    return { title: HOME_SHARE_TITLE, path: '/pages/index/index', imageUrl: HOME_SHARE_IMAGE_URL };
  },

  onShareTimeline: function () {
    return { title: HOME_SHARE_TITLE, imageUrl: HOME_SHARE_IMAGE_URL };
  }
});
