var createComponentPage = require('../../../utils/component-page');
Page(createComponentPage({ title: 'Collapsible', data: { collapsibleOpen: false, collapsibleStatus: '检查清单当前收起。' }, methods: { onCollapsibleChange: function (event) { var open = Boolean(event && event.detail && event.detail.open); this.setData({ collapsibleOpen: open, collapsibleStatus: open ? '检查清单已展开。' : '检查清单已收起。' }); } }}));
