var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Tabs',
  data: {
    evenTabs: [
      { label: '概览', value: 'overview', icon: 'grid' },
      { label: 'API', value: 'api' },
      { label: '属性', value: 'props', badge: 2 },
      { label: '示例', value: 'examples' }
    ],
    overflowTabs: [
      { label: '布局', value: 'layout' },
      { label: '尺寸', value: 'size' },
      { label: '间距', value: 'spacing' },
      { label: '字体', value: 'typography' },
      { label: '背景', value: 'background' },
      { label: '行为', value: 'behavior', disabled: true }
    ],
    evenTabValue: 'overview',
    overflowTabValue: 'layout',
    evenTabTitle: '组件概览',
    evenTabDescription: '快速了解组件解决的问题和主要能力。',
    overflowTabTitle: '布局样式',
    overflowTabDescription: '调整元素的排列、对齐和定位方式。',
    tabsStatus: '当前查看：组件概览。'
  },
  methods: {
    onEvenTabsChange: function onEvenTabsChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      var content = {
        overview: ['组件概览', '快速了解组件解决的问题和主要能力。'],
        api: ['API', '查看公开参数、事件和组合区域。'],
        props: ['属性', '调整当前示例的可用属性。'],
        examples: ['示例', '查看真实任务中的组合方式。']
      }[value] || ['组件概览', '快速了解组件解决的问题和主要能力。'];
      this.setData({ evenTabValue: value, evenTabTitle: content[0], evenTabDescription: content[1], tabsStatus: '当前查看：' + content[0] + '。' });
    },
    onOverflowTabsChange: function onOverflowTabsChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      var content = {
        layout: ['布局样式', '调整元素的排列、对齐和定位方式。'],
        size: ['尺寸样式', '调整宽度、高度和最小尺寸。'],
        spacing: ['间距样式', '调整内边距、外边距和元素间隔。'],
        typography: ['字体样式', '调整字号、字重和行高。'],
        background: ['背景样式', '调整背景色和渐变效果。']
      }[value] || ['布局样式', '调整元素的排列、对齐和定位方式。'];
      this.setData({ overflowTabValue: value, overflowTabTitle: content[0], overflowTabDescription: content[1], tabsStatus: '当前查看：' + content[0] + '。' });
    }
  }
}));
