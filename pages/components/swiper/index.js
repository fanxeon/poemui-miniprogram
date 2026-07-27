var createComponentPage = require('../../../utils/component-page');
var ITEMS = [
  { title: '快速搭建页面', value: 'compose', image: 'https://images.unsplash.com/photo-1755018236992-f180f6f6b13d?auto=format&fit=crop&fm=jpg&q=80&w=1600', description: '按任务组合已经准备好的组件' },
  { title: '统一视觉语言', value: 'theme', image: 'https://images.unsplash.com/photo-1712646913801-34aed548531e?auto=format&fit=crop&fm=jpg&q=80&w=1600', description: '深浅色和间距保持一致' },
  { title: '覆盖关键状态', value: 'states', image: 'https://images.unsplash.com/photo-1757918764738-809cc1ba2fbb?auto=format&fit=crop&fm=jpg&q=80&w=1600', description: '等待、失败与恢复都有下一步' }
];
Page(createComponentPage({ title: 'Swiper', data: { swiperItems: ITEMS, swiperValue: 'compose', swiperError: true, swiperStatus: '当前查看：快速搭建页面。' }, methods: { onSwiperChange: function (event) { var value = event && event.detail ? event.detail.value : ''; var labels = { compose: '快速搭建页面', theme: '统一视觉语言', states: '覆盖关键状态' }; this.setData({ swiperValue: value, swiperStatus: '当前查看：' + (labels[value] || '') + '。' }); }, onSwiperRetry: function () { this.setData({ swiperError: false, swiperStatus: '轮播内容已重新载入。' }); } }}));
