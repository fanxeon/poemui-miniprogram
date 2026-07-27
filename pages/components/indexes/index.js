var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Indexes',
  data: {
    indexGroups: [
      { index: 'A', title: 'A', children: [{ label: 'Alert', value: 'alert', description: '页面提示', icon: 'info-circle', clickable: true }] },
      { index: 'B', title: 'B', children: [{ label: 'Badge', value: 'badge', description: '数量与提醒点', icon: 'circle', clickable: true }, { label: 'Breadcrumb', value: 'breadcrumb', description: '层级路径', icon: 'route', badge: 2, clickable: true }] },
      { index: 'C', title: 'C', children: [{ label: 'Calendar', value: 'calendar', description: '日期选择', icon: 'calendar', clickable: true }, { label: 'Checkbox', value: 'checkbox', description: '多项选择', icon: 'check-circle', clickable: true }] },
      { index: 'D', title: 'D', children: [{ label: 'Dialog', value: 'dialog', description: '居中对话框', icon: 'panel-top', clickable: true }, { label: 'Divider', value: 'divider', description: '内容分隔', icon: 'minus', clickable: true }] },
      { index: 'F', title: 'F', children: [{ label: 'Field', value: 'field', description: '表单字段', icon: 'file-text', clickable: true }, { label: 'Form', value: 'form', description: '表单与校验', icon: 'list-bullet', clickable: true }] },
      { index: 'G', title: 'G', children: [{ label: 'Grid', value: 'grid', description: '宫格入口', icon: 'grid', clickable: true }] },
      { index: 'I', title: 'I', children: [{ label: 'Icon', value: 'icon', description: '图标资源', icon: 'component', clickable: true }, { label: 'Input', value: 'input', description: '文本输入', icon: 'text', clickable: true }] },
      { index: 'L', title: 'L', children: [{ label: 'List', value: 'list', description: '连续内容列表', icon: 'list-bullet', clickable: true }, { label: 'Loading', value: 'loading', description: '加载反馈', icon: 'refresh', clickable: true }] },
      { index: 'N', title: 'N', children: [{ label: 'Navbar', value: 'navbar', description: '页面标题', icon: 'menu', clickable: true }, { label: 'NoticeBar', value: 'notice-bar', description: '页面公告', icon: 'bell', clickable: true }] },
      { index: 'P', title: 'P', children: [{ label: 'Picker', value: 'picker', description: '滚轮选择', icon: 'chevron-down', clickable: true }, { label: 'Popup', value: 'popup', description: '边缘浮层', icon: 'panel-top', clickable: true }] },
      { index: 'R', title: 'R', children: [{ label: 'Radio', value: 'radio', description: '单项选择', icon: 'circle', clickable: true }, { label: 'Rate', value: 'rate', description: '评分输入', icon: 'spark', clickable: true }] },
      { index: 'S', title: 'S', children: [{ label: 'Search', value: 'search', description: '关键词检索', icon: 'search', clickable: true }, { label: 'Switch', value: 'switch', description: '独立开关', icon: 'toggle-right', clickable: true }] },
      { index: 'T', title: 'T', children: [{ label: 'Tabs', value: 'tabs', description: '内容分类', icon: 'list-bullet', clickable: true }, { label: 'Toast', value: 'toast', description: '短暂反馈', icon: 'message-circle', clickable: true }] },
      { index: 'U', title: 'U', children: [{ label: 'Upload', value: 'upload', description: '附件选择', icon: 'upload', clickable: true }] }
    ],
    indexCurrent: 'A',
    indexesStatus: '当前分组：A。'
  },
  methods: {
    onIndexesChange: function onIndexesChange(event) {
      var value = event && event.detail ? event.detail.current : '';
      this.setData({ indexCurrent: value, indexesStatus: '当前分组：' + value + '。' });
    },
    onIndexesItemClick: function onIndexesItemClick(event) {
      var detail = event && event.detail ? event.detail : {};
      this.setData({ indexesStatus: '已选择：' + (detail.valueText || detail.value || '条目') + '。' });
    },
    onIndexesRetry: function onIndexesRetry() {
      this.setData({ indexesStatus: '正在重新加载组件索引。' });
    }
  }
}));
