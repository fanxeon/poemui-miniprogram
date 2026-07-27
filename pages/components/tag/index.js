var createComponentPage = require('../../../utils/component-page');
Page(createComponentPage({ title: 'Tag', data: { tagVisible: true, tagStatus: '关闭请求由页面决定是否移除标签。' }, methods: { onTagClose: function () { this.setData({ tagVisible: false, tagStatus: '关闭请求已由页面移除标签。' }); }, onRestoreTag: function () { this.setData({ tagVisible: true, tagStatus: '标签已由页面恢复。' }); } }}));
