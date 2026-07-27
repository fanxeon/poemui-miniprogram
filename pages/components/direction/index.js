var createComponentPage = require('../../../utils/component-page');
var DIRECTIONS = ['ltr', 'rtl', 'auto'];
Page(createComponentPage({ title: 'Direction', data: { directionValue: 'ltr', directionLanguage: 'ar', directionStatus: '当前采用 LTR 阅读方向。' }, methods: {
  onCycleDirection: function () { var index = DIRECTIONS.indexOf(this.data.directionValue); var next = DIRECTIONS[(index + 1) % DIRECTIONS.length]; var labels = { ltr: '从左到右', rtl: '从右到左', auto: '自动识别' }; this.setData({ directionValue: next, directionStatus: '当前阅读方向：' + labels[next] + '。' }); },
  onToggleLanguage: function () { var language = this.data.directionLanguage === 'ar' ? 'en' : 'ar'; this.setData({ directionLanguage: language, directionStatus: language === 'ar' ? '当前内容：阿拉伯语。' : '当前内容：英语。' }); }
}}));
