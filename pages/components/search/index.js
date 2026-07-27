var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Search',
  data: { searchValue: '', searchStatus: '输入中文名或英文名开始查找。' },
  methods: {
    onSearchChange: function (event) { var value = event && event.detail ? String(event.detail.value || '') : ''; this.setData({ searchValue: value, searchStatus: value ? '准备查找“' + value + '”。' : '关键词已清空。' }); },
    onSearchConfirm: function (event) { var value = event && event.detail ? String(event.detail.value || '') : this.data.searchValue; this.setData({ searchStatus: value ? '正在查找“' + value + '”。' : '请先输入关键词。' }); },
    onSearchCancel: function () { this.setData({ searchValue: '', searchStatus: '已取消搜索，显示完整目录。' }); }
  }
}));
