var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'AspectRatio',
  data: { ratio: '16 / 9', overflow: true, ratioStatus: '当前比例为 16 / 9。' },
  methods: {
    onChangeRatio: function () {
      var ratio = this.data.ratio === '16 / 9' ? '1 / 1' : '16 / 9';
      this.setData({ ratio: ratio, ratioStatus: '当前封面比例：' + ratio + '。' });
    },
    onToggleOverflow: function () {
      this.setData({ overflow: !this.data.overflow, ratioStatus: this.data.overflow ? '内容现在允许超出比例容器。' : '内容现在裁切在比例容器内。' });
    }
  }
}));
