var createComponentPage = require('../../../utils/component-page');
Page(createComponentPage({ title: 'Watermark', data: { watermarkContent: [{ text: 'POEM UI', fontSize: 24 }, { text: '内部资料', fontSize: 18 }], watermarkLayout: 'rectangular', watermarkMovable: false, watermarkStatus: '水印下方的内容仍然可以阅读和操作。' }, methods: {
  onMarkWatermarkRead: function () { this.setData({ watermarkStatus: '已标记为阅读；水印没有拦截这个操作。' }); },
  onToggleWatermarkLayout: function () { var layout = this.data.watermarkLayout === 'rectangular' ? 'hexagonal' : 'rectangular'; this.setData({ watermarkLayout: layout, watermarkStatus: layout === 'hexagonal' ? '已切换为蜂窝排列。' : '已切换为规则排列。' }); },
  onToggleWatermarkMove: function () { var movable = !this.data.watermarkMovable; this.setData({ watermarkMovable: movable, watermarkStatus: movable ? '水印将在组件自己的间隔内移动。' : '水印已停止移动。' }); }
}}));
