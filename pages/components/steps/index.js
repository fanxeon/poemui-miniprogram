var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Steps',
  data: {
    stepItems: [
      { title: '填写信息', value: 'info', content: '补充基本资料' },
      { title: '确认内容', value: 'confirm', content: '检查提交内容' },
      { title: '完成发布', value: 'done', content: '等待结果' }
    ],
    stepValue: 'info',
    stepStatus: '当前步骤：填写信息。'
  },
  methods: {
    onStepsChange: function onStepsChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      var labels = { info: '填写信息', confirm: '确认内容', done: '完成发布' };
      this.setData({ stepValue: value, stepStatus: '当前步骤：' + (labels[value] || value) + '。' });
    },
    onPreviousStep: function onPreviousStep() {
      var index = this.data.stepItems.findIndex(function find(item) { return item.value === this.data.stepValue; }.bind(this));
      var next = this.data.stepItems[Math.max(0, index - 1)];
      if (next) this.setData({ stepValue: next.value, stepStatus: '当前步骤：' + next.title + '。' });
    },
    onNextStep: function onNextStep() {
      var index = this.data.stepItems.findIndex(function find(item) { return item.value === this.data.stepValue; }.bind(this));
      var next = this.data.stepItems[Math.min(this.data.stepItems.length - 1, index + 1)];
      if (next) this.setData({ stepValue: next.value, stepStatus: '当前步骤：' + next.title + '。' });
    }
  }
}));
