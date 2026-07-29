'use strict';

// Starter Usage 只描述“复制后立即可见、可理解”的最小调用。
// 它不是组件运行时默认值，也不参与小程序独立组件页或 H5 Showcase 的初始状态。
const starterUsage = {
  'config-provider': {
    wxml: '<pui-config-provider>\n  <view>页面内容</view>\n</pui-config-provider>',
  },
  direction: {
    wxml: '<pui-direction content="PoemUI Direction 内容" />',
  },
  icon: {
    wxml: '<pui-icon name="spark" size="40" />',
  },
  button: {
    wxml: '<pui-button theme="primary">按钮</pui-button>',
  },
  divider: {
    wxml: '<pui-divider content="分区标题" show-content />',
  },
  navbar: {
    wxml: '<pui-navbar title="页面标题" />',
  },
  'navigation-menu': {
    data: {
      navigationItems: [
        { label: '组件', value: 'components', icon: 'component' },
        { label: '指南', value: 'guides', icon: 'file-text' },
        { label: '关于', value: 'about', icon: 'info' },
      ],
    },
    wxml: '<pui-navigation-menu items="{{navigationItems}}" default-value="components" />',
  },
  tabs: {
    data: {
      tabItems: [
        { label: '概览', value: 'overview' },
        { label: 'API', value: 'api' },
        { label: '属性', value: 'props' },
      ],
    },
    wxml: '<pui-tabs items="{{tabItems}}" default-value="overview" />',
  },
  breadcrumb: {
    data: {
      breadcrumbItems: [
        { label: '首页', value: 'home', icon: 'home' },
        { label: '组件', value: 'components' },
        { label: '面包屑', value: 'breadcrumb' },
      ],
    },
    wxml: '<pui-breadcrumb items="{{breadcrumbItems}}" default-value="breadcrumb" />',
  },
  tabbar: {
    data: {
      tabbarItems: [
        { label: '首页', value: 'home', icon: 'home' },
        { label: '安装', value: 'install', icon: 'code' },
        { label: '我的', value: 'me', icon: 'profile' },
      ],
    },
    wxml: '<pui-tabbar items="{{tabbarItems}}" default-value="home" fixed="{{false}}" />',
  },
  steps: {
    data: {
      stepItems: [
        { title: '创建项目', value: 'create' },
        { title: '安装组件', value: 'install' },
        { title: '开始使用', value: 'ready' },
      ],
    },
    wxml: '<pui-steps items="{{stepItems}}" current="{{1}}" />',
  },
  'back-top': {
    wxml: '<pui-back-top fixed="{{false}}" scroll-top="{{320}}" text="返回顶部" />',
  },
  indexes: {
    data: {
      contactGroups: [
        { index: 'A', items: [{ title: 'Alice', value: 'alice' }] },
        { index: 'B', items: [{ title: 'Bob', value: 'bob' }] },
        { index: 'C', items: [{ title: 'Carol', value: 'carol' }] },
      ],
    },
    wxml: '<pui-indexes items="{{contactGroups}}" height="720rpx" />',
  },
  sidebar: {
    data: {
      sidebarItems: [
        { label: '基础组件', value: 'basic', icon: 'component' },
        { label: '表单组件', value: 'form', icon: 'edit' },
        { label: '反馈组件', value: 'feedback', icon: 'bell' },
        { label: '高级组件', value: 'advanced', icon: 'premium' },
      ],
    },
    wxml: '<pui-sidebar items="{{sidebarItems}}" default-value="basic" height="560rpx" />',
  },
  input: {
    wxml: '<pui-input placeholder="请输入内容" />',
  },
  field: {
    components: {
      'pui-input': 'poemui-miniprogram/input/input',
    },
    wxml: '<pui-field label="组件名称" required>\n  <pui-input placeholder="请输入组件名称" />\n</pui-field>',
  },
  label: {
    wxml: '<pui-label content="字段名称" required />',
  },
  'input-otp': {
    wxml: '<pui-input-otp length="{{6}}" />',
  },
  textarea: {
    wxml: '<pui-textarea placeholder="请输入详细说明" maxlength="{{200}}" indicator />',
  },
  switch: {
    wxml: '<pui-switch default-value="{{true}}" aria-label="启用功能" />',
  },
  checkbox: {
    wxml: '<pui-checkbox content="同意服务协议" />',
  },
  radio: {
    wxml: '<pui-radio content="选择此项" />',
  },
  form: {
    components: {
      'pui-field': 'poemui-miniprogram/field/field',
      'pui-input': 'poemui-miniprogram/input/input',
      'pui-button': 'poemui-miniprogram/button/button',
    },
    data: {
      formData: { name: '' },
      formRules: { name: [{ required: true, message: '请输入组件名称' }] },
    },
    wxml: '<pui-form data="{{formData}}" rules="{{formRules}}">\n  <pui-field name="name" label="组件名称">\n    <pui-input name="name" value="{{formData.name}}" placeholder="请输入组件名称" />\n  </pui-field>\n  <pui-button theme="primary" form-type="submit" block>提交</pui-button>\n</pui-form>',
  },
  picker: {
    data: {
      pickerColumns: [
        { label: '选项一', value: 'one' },
        { label: '选项二', value: 'two' },
        { label: '选项三', value: 'three' },
        { label: '选项四', value: 'four' },
      ],
    },
    wxml: '<pui-picker columns="{{pickerColumns}}" visible="{{true}}" title="请选择" />',
  },
  select: {
    data: {
      selectOptions: [
        { label: '选项一', value: 'one' },
        { label: '选项二', value: 'two' },
        { label: '选项三', value: 'three' },
        { label: '选项四', value: 'four' },
      ],
    },
    wxml: '<pui-select options="{{selectOptions}}" placeholder="请选择" />',
  },
  combobox: {
    data: {
      comboboxOptions: [
        { label: 'Button 按钮', value: 'button', icon: 'command' },
        { label: 'Popup 弹出层', value: 'popup', icon: 'layers' },
        { label: 'Tabs 选项卡', value: 'tabs', icon: 'component' },
        { label: 'Input 输入框', value: 'input', icon: 'edit' },
      ],
    },
    wxml: '<pui-combobox options="{{comboboxOptions}}" placeholder="搜索组件" />',
  },
  'date-time-picker': {
    wxml: '<pui-date-time-picker visible="{{true}}" title="选择日期" mode="date" />',
  },
  search: {
    wxml: '<pui-search placeholder="搜索组件" />',
  },
  stepper: {
    wxml: '<pui-stepper default-value="{{1}}" min="{{0}}" max="{{10}}" />',
  },
  slider: {
    wxml: '<pui-slider default-value="{{40}}" show-value />',
  },
  rate: {
    wxml: '<pui-rate default-value="{{4}}" show-text />',
  },
  upload: {
    wxml: '<pui-upload add-content="选择文件" />',
  },
  cell: {
    wxml: '<pui-cell title="组件标题" value="说明" arrow />',
  },
  card: {
    wxml: '<pui-card title="卡片标题" description="用于组织相关内容" show-header>\n  <view>卡片内容</view>\n</pui-card>',
  },
  grid: {
    data: {
      gridItems: [
        { label: '组件', value: 'components', icon: 'component' },
        { label: '指南', value: 'guides', icon: 'file-text' },
        { label: '安装', value: 'install', icon: 'code' },
        { label: '设置', value: 'settings', icon: 'settings' },
      ],
    },
    wxml: '<pui-grid items="{{gridItems}}" />',
  },
  list: {
    data: {
      listItems: [
        { title: 'Button 按钮', description: '触发用户操作', leftIcon: 'command' },
        { title: 'Input 输入框', description: '输入文字内容', leftIcon: 'edit' },
        { title: 'Popup 弹出层', description: '承载临时内容', leftIcon: 'layers' },
        { title: 'Tabs 选项卡', description: '切换内容分类', leftIcon: 'component' },
      ],
    },
    wxml: '<pui-list items="{{listItems}}" show-icon show-description />',
  },
  tag: {
    wxml: '<pui-tag theme="primary">标签</pui-tag>',
  },
  badge: {
    components: {
      'pui-icon': 'poemui-miniprogram/icon/icon',
    },
    wxml: '<pui-badge count="{{3}}">\n  <pui-icon name="bell" size="44" />\n</pui-badge>',
  },
  avatar: {
    wxml: '<pui-avatar text="PUI" aria-label="PoemUI 头像" />',
  },
  image: {
    wxml: '<pui-image width="200rpx" height="200rpx" text="暂无图片" />',
  },
  bubble: {
    wxml: '<pui-bubble content="这是一条 PoemUI 消息。" />',
  },
  collapse: {
    data: {
      collapseItems: [
        { label: '什么是 PoemUI？', value: 'about', description: '面向微信小程序的原生组件库。' },
        { label: '如何安装？', value: 'install', description: '通过 npm 安装后在开发者工具中构建 npm。' },
      ],
    },
    wxml: '<pui-collapse items="{{collapseItems}}" default-value="{{[\'about\']}}" />',
  },
  collapsible: {
    wxml: '<pui-collapsible label="查看详情" content="这里是可展开的内容。" default-open />',
  },
  'swipe-cell': {
    components: {
      'pui-cell': 'poemui-miniprogram/cell/cell',
    },
    data: {
      swipeActions: [
        { text: '收藏', value: 'favorite', icon: 'star' },
        { text: '删除', value: 'delete', theme: 'danger', icon: 'delete' },
      ],
    },
    wxml: '<pui-swipe-cell right="{{swipeActions}}">\n  <pui-cell title="向左滑动" description="显示可用操作" />\n</pui-swipe-cell>',
  },
  'count-down': {
    wxml: '<pui-count-down time="{{3661000}}" split-with-unit />',
  },
  table: {
    data: {
      tableColumns: [
        { key: 'name', title: '组件' },
        { key: 'category', title: '分类' },
        { key: 'status', title: '状态' },
      ],
      tableData: [
        { id: 1, name: 'Button', category: '基础', status: '稳定' },
        { id: 2, name: 'Popup', category: '浮层', status: '稳定' },
        { id: 3, name: 'Tabs', category: '导航', status: '稳定' },
      ],
    },
    wxml: '<pui-table columns="{{tableColumns}}" data="{{tableData}}" />',
  },
  swiper: {
    data: {
      swiperItems: [
        { value: 'one', title: '第一张', description: '组件预览' },
        { value: 'two', title: '第二张', description: '交互状态' },
        { value: 'three', title: '第三张', description: '主题外观' },
      ],
    },
    wxml: '<pui-swiper items="{{swiperItems}}" height="{{320}}" />',
  },
  'scroll-area': {
    components: {
      'pui-cell': 'poemui-miniprogram/cell/cell',
    },
    wxml: '<pui-scroll-area height="400rpx">\n  <pui-cell title="第一项" description="滚动区域内容" />\n  <pui-cell title="第二项" description="继续向下滚动" />\n  <pui-cell title="第三项" description="观察边缘提示" />\n  <pui-cell title="第四项" description="滚动区域底部" />\n</pui-scroll-area>',
  },
  calendar: {
    wxml: '<pui-calendar visible="{{true}}" title="选择日期" />',
  },
  'aspect-ratio': {
    wxml: '<pui-aspect-ratio ratio="16 / 9" background="var(--pui-bg-muted)">\n  <view>16:9 内容</view>\n</pui-aspect-ratio>',
  },
  alert: {
    wxml: '<pui-alert theme="primary" title="提示" description="这里是需要关注的信息。" />',
  },
  loading: {
    wxml: '<pui-loading text="加载中" />',
  },
  toast: {
    pageJs: "Page({\n  onReady() {\n    this.selectComponent('#starter-toast').show({ message: '操作完成' })\n  }\n})",
    wxml: '<pui-toast id="starter-toast" />',
  },
  dialog: {
    wxml: '<pui-dialog visible="{{true}}" title="确认操作" content="请确认是否继续。" show-footer />',
  },
  progress: {
    wxml: '<pui-progress percentage="{{64}}" label status="active" />',
  },
  skeleton: {
    wxml: '<pui-skeleton loading />',
  },
  empty: {
    wxml: '<pui-empty icon="inbox" description="暂无内容" />',
  },
  'notice-bar': {
    wxml: '<pui-notice-bar theme="warning" content="这是一条重要通知。" />',
  },
  result: {
    wxml: '<pui-result theme="success" title="操作完成" description="结果已经保存。" />',
  },
  popup: {
    wxml: '<pui-popup visible="{{true}}" content="Popup 内容" />',
  },
  popover: {
    components: {
      'pui-button': 'poemui-miniprogram/button/button',
    },
    wxml: '<pui-popover default-visible content="Popover 内容">\n  <pui-button variant="outline">打开 Popover</pui-button>\n</pui-popover>',
  },
  sheet: {
    wxml: '<pui-sheet visible="{{true}}" title="Sheet 标题" content="Sheet 内容" />',
  },
  'action-sheet': {
    data: {
      actionItems: [
        { label: '编辑', value: 'edit', icon: 'edit' },
        { label: '分享', value: 'share', icon: 'share' },
        { label: '删除', value: 'delete', icon: 'delete', theme: 'danger' },
      ],
    },
    wxml: '<pui-action-sheet items="{{actionItems}}" visible="{{true}}" description="请选择操作" />',
  },
  'dropdown-menu': {
    data: {
      dropdownItems: [
        {
          label: '排序',
          value: 'sort',
          options: [
            { label: '默认排序', value: 'default' },
            { label: '最新发布', value: 'latest' },
          ],
        },
      ],
    },
    wxml: '<pui-dropdown-menu items="{{dropdownItems}}" />',
  },
  overlay: {
    wxml: '<pui-overlay visible="{{true}}" />',
  },
  'area-chart': {
    data: {
      areaItems: [
        { label: '1 月', value: 12 },
        { label: '2 月', value: 18 },
        { label: '3 月', value: 15 },
        { label: '4 月', value: 26 },
      ],
    },
    wxml: '<pui-area-chart items="{{areaItems}}" />',
  },
  'bar-chart': {
    data: {
      barItems: [
        { label: '基础', value: 18 },
        { label: '表单', value: 20 },
        { label: '反馈', value: 12 },
        { label: '高级', value: 8 },
      ],
    },
    wxml: '<pui-bar-chart items="{{barItems}}" />',
  },
  waffle: {
    data: {
      waffleItems: [
        { label: '稳定组件', value: 58, theme: 'primary' },
        { label: '新增组件', value: 16, theme: 'success' },
      ],
    },
    wxml: '<pui-waffle items="{{waffleItems}}" />',
  },
  'top-loading': {
    wxml: '<pui-top-loading state="loading" progress="{{64}}" />',
  },
  'dynamic-message': {
    pageJs: "Page({\n  onReady() {\n    this.selectComponent('#starter-message').show({\n      theme: 'info',\n      title: '更新提示',\n      message: '组件数据已刷新。'\n    })\n  }\n})",
    wxml: '<pui-dynamic-message id="starter-message" />',
  },
  'pull-refresh': {
    components: {
      'pui-cell': 'poemui-miniprogram/cell/cell',
    },
    wxml: '<pui-pull-refresh>\n  <pui-cell title="下拉刷新" description="刷新结果由父级真实回写" />\n  <pui-cell title="组件目录" value="74 个组件" />\n</pui-pull-refresh>',
  },
  'virtual-list': {
    data: {
      virtualItems: Array.from({ length: 20 }, (_, index) => ({
        value: `component-${index + 1}`,
        title: `组件 ${index + 1}`,
        description: '可滚动的虚拟列表条目',
      })),
    },
    wxml: '<pui-virtual-list items="{{virtualItems}}" height="{{560}}" item-height="{{112}}" />',
  },
  sticky: {
    components: {
      'pui-cell': 'poemui-miniprogram/cell/cell',
    },
    wxml: '<pui-sticky offset-top="{{0}}">\n  <pui-cell title="吸顶标题" description="随页面滚动保持可见" />\n</pui-sticky>',
  },
  watermark: {
    wxml: '<pui-watermark content="PoemUI">\n  <view>受水印保护的页面内容</view>\n</pui-watermark>',
  },
};

module.exports = starterUsage;
