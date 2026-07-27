var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'SideBar',
  data: {
    sidebarItems: [
      {
        title: '组件分类',
        children: [
          { label: '基础组件', value: 'basic', description: '按钮、图标和分割线', icon: 'grid', badge: 3 },
          { label: '导航组件', value: 'navigation', description: '页面与内容导航', icon: 'route', badge: 9 },
          { label: '反馈组件', value: 'feedback', description: '状态与结果反馈', icon: 'info-circle' }
        ]
      }
    ],
    sidebarValue: 'basic',
    sidebarCurrent: { title: '基础组件', description: '用于构成页面的最小交互和展示单元。', examples: '代表组件：Button、Icon、Divider。' },
    sidebarStatus: '当前分类：基础组件。'
  },
  methods: {
    onSidebarChange: function onSidebarChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      var content = {
        basic: { title: '基础组件', description: '用于构成页面的最小交互和展示单元。', examples: '代表组件：Button、Icon、Divider。' },
        navigation: { title: '导航组件', description: '帮助用户理解当前位置并前往下一处内容。', examples: '代表组件：Navbar、Tabs、Tabbar。' },
        feedback: { title: '反馈组件', description: '清楚说明进行中、失败、空内容和完成结果。', examples: '代表组件：Alert、Loading、Result。' }
      }[value];
      this.setData({ sidebarValue: value, sidebarCurrent: content || this.data.sidebarCurrent, sidebarStatus: '当前分类：' + ((content && content.title) || value) + '。' });
    }
  }
}));
