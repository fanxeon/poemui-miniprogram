var createComponentPage = require('../../../utils/component-page');

var INITIAL_ROWS = [
  { title: 'Tabs', description: '超过四项时会露出下一项，引导横向滑动。', icon: 'tabs' },
  { title: 'Input', description: '补充只读、禁用与错误状态示例。', icon: 'edit' },
  { title: 'Table', description: '新增排序、选择和空结果边界。', icon: 'table' },
  { title: 'Watermark', description: '深色模式下保持内容与水印可读。', icon: 'image' },
  { title: 'Toast', description: '处理中的提示不再提前表达成功。', icon: 'message-circle' },
  { title: 'Calendar', description: '周末不可选时仍保留清楚说明。', icon: 'calendar' }
];

Page(createComponentPage({
  title: 'PullRefresh',
  data: {
    pullRefreshing: false,
    pullRows: INITIAL_ROWS,
    pullStatus: '在列表顶部向下拖动，查看刷新过程。'
  },
  methods: {
    onPullRefresh: function () {
      this.setData({
        pullRefreshing: true,
        pullStatus: '正在获取最新动态；示例等待你结束本次刷新。'
      });
    },
    onPullRefreshChange: function (event) {
      var value = Boolean(event && event.detail && event.detail.value);
      this.setData({
        pullRefreshing: value,
        pullStatus: value ? '正在获取最新动态。' : '本次刷新已经结束。'
      });
    },
    onCompleteLocalRefresh: function () {
      this.setData({
        pullRefreshing: false,
        pullRows: [
          { title: '刚刚更新', description: '组件示例已同步到最新状态。', icon: 'check-circle' }
        ].concat(INITIAL_ROWS),
        pullStatus: '已获取最新动态；本页只演示交互，不会连接服务器。'
      });
    },
    onPullTimeout: function () {
      this.setData({
        pullRefreshing: false,
        pullStatus: '等待时间过长，本次刷新已结束，可以再次下拉。'
      });
    }
  }
}));
