var createComponentPage = require('../../../utils/component-page');
var ICON_FONT_CATALOG = require('poemui-miniprogram/icon/icon-font-catalog');

var CATEGORY_ORDER = [
  'navigation', 'action', 'editing', 'status', 'form', 'file', 'media', 'communication',
  'user', 'commerce', 'device', 'chart', 'map', 'development', 'layout', 'components', 'abstract'
];

var CATEGORY_LABELS = {
  navigation: '导航',
  action: '操作',
  editing: '编辑',
  status: '状态',
  form: '表单',
  file: '文件',
  media: '媒体',
  communication: '通信',
  user: '用户',
  commerce: '商业',
  device: '设备',
  chart: '图表',
  map: '地图',
  development: '开发',
  layout: '布局',
  components: '组件',
  abstract: '抽象'
};

var CATEGORY_DESCRIPTIONS = {
  navigation: '页面与层级移动',
  action: '常见操作与结果',
  editing: '文本与内容编辑',
  status: '状态与反馈表达',
  form: '表单与输入辅助',
  file: '文件与资源管理',
  media: '媒体内容控制',
  communication: '消息与联系渠道',
  user: '账户与身份信息',
  commerce: '交易与商品场景',
  device: '设备与系统能力',
  chart: '数据与趋势展示',
  map: '位置与地图能力',
  development: '开发与工程工具',
  layout: '布局与页面结构',
  components: 'PoemUI 已落地组件',
  abstract: '通用抽象图形'
};

function createIconCatalog() {
  return ICON_FONT_CATALOG.icons.map(function (item) {
    var name = item.name;
    var category = item.category || 'abstract';
    return {
      name: name,
      category: category,
      keywords: (name + ' ' + category + ' ' + (CATEGORY_LABELS[category] || category)).toLowerCase()
    };
  });
}

function createIconGroups(icons) {
  var groupsByCategory = {};

  icons.forEach(function (icon) {
    if (!groupsByCategory[icon.category]) {
      groupsByCategory[icon.category] = [];
    }
    groupsByCategory[icon.category].push(icon);
  });

  return CATEGORY_ORDER.filter(function (category) {
    return groupsByCategory[category] && groupsByCategory[category].length;
  }).map(function (category) {
    return {
      key: category,
      label: CATEGORY_LABELS[category] || category,
      description: CATEGORY_DESCRIPTIONS[category] || '通用图标资源',
      count: groupsByCategory[category].length,
      icons: groupsByCategory[category]
    };
  });
}

var ICON_CATALOG = createIconCatalog();

Page(createComponentPage({
  title: 'Icon',
  data: {
    iconQuery: '',
    iconCatalog: ICON_CATALOG,
    visibleIconGroups: createIconGroups(ICON_CATALOG)
  },
  methods: {
    onIconSearchChange: function (event) {
      var value = event && event.detail ? event.detail.value : '';
      this.applyIconSearch(value);
    },

    onIconSearchClear: function () {
      this.applyIconSearch('');
    },

    applyIconSearch: function (value) {
      var query = String(value == null ? '' : value);
      var normalized = query.trim().toLowerCase();
      var visibleIcons = this.data.iconCatalog.filter(function (icon) {
        return !normalized || icon.keywords.indexOf(normalized) !== -1;
      });

      this.setData({
        iconQuery: query,
        visibleIconGroups: createIconGroups(visibleIcons)
      });
    }
  }
}));
