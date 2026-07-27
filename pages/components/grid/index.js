var createComponentPage = require('../../../utils/component-page');
var GRID_ITEMS = [{ label: '表单组件', description: '输入与选择', value: 'form', icon: 'edit' }, { label: '导航组件', description: '页面与路径', value: 'navigation', icon: 'route' }, { label: '反馈组件', description: '状态与结果', value: 'feedback', icon: 'message-circle' }, { label: '内部组件', description: '仅组织成员可用', value: 'locked', icon: 'lock', disabled: true }];
Page(createComponentPage({ title: 'Grid', data: { gridItems: GRID_ITEMS, gridColumn: 2, gridGutter: 16, gridError: false, gridStatus: '选择一个可用入口。' }, methods: {
  onGridClick: function (event) { var detail = event && event.detail ? event.detail : {}; this.setData({ gridStatus: '已选择“' + ((detail.item && detail.item.label) || detail.value || '') + '”。' }); },
  onToggleGridLayout: function () { var column = this.data.gridColumn === 2 ? 3 : 2; this.setData({ gridColumn: column, gridGutter: column === 2 ? 16 : 12, gridStatus: '网格已更新为 ' + column + ' 列。' }); },
  onSetGridError: function () { this.setData({ gridError: true, gridStatus: '组件目录加载失败，可尝试重新加载。' }); },
  onGridRetry: function () { this.setData({ gridStatus: '已请求重新加载，等待页面提供新内容。' }); },
  onRestoreGrid: function () { this.setData({ gridError: false, gridStatus: '组件目录已恢复。' }); }
}}));
