var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Progress',
  data: { progressValue: 40 },
  methods: {
    onAdvanceProgress: function () {
      this.setData({ progressValue: Math.min(100, this.data.progressValue + 20) });
    },
    onResetProgress: function () {
      this.setData({ progressValue: 0 });
    }
  }
}));
