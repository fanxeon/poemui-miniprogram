var createComponentPage = require('../../../utils/component-page');
var OVERLAY_SIZES = ['sm', 'md', 'lg'];
var OVERLAY_SIZE_LABELS = { sm: '小', md: '中', lg: '大' };

Page(createComponentPage({ title: 'ScrollArea', data: {
  areaScrollTop: 0,
  areaGradientOverlay: true,
  areaGradientOverlaySize: 'md',
  areaGradientOverlaySizeLabel: '中',
  areaGradientCanDecrease: true,
  areaGradientCanIncrease: true,
  areaGradientStatus: '遮罩已开启，当前为中等尺寸。',
  areaRows: [
  { title: '向上滑动查看内容', description: '上下渐变提示滚动方向，不遮挡列表操作。', icon: 'scroll' },
  { title: 'Button', description: '完善加载态与键盘可访问名称。', icon: 'component' },
  { title: 'Input', description: '补充清除、确认和错误反馈。', icon: 'edit' },
  { title: 'Tabs', description: '超过四项时露出下一项，提示横向滑动。', icon: 'layout' },
  { title: 'Navbar', description: '右侧始终为微信原生胶囊保留空间。', icon: 'navigation' },
  { title: 'NavigationMenu', description: '浮层与同层双栏使用不同工作区。', icon: 'route' },
  { title: 'Checkbox', description: '支持多项选择与最大数量限制。', icon: 'check-square' },
  { title: 'Radio', description: '同组内始终保持单选互斥。', icon: 'circle' },
  { title: 'Calendar', description: '日期限制和取消结果清晰可见。', icon: 'calendar' },
  { title: 'Upload', description: '本地文件选择不冒充服务器上传。', icon: 'upload' },
  { title: 'ScrollArea', description: '当前列表只有这一处纵向滚动区域。', icon: 'scroll' },
  { title: '继续滑动到底部', description: '到达底部后渐变提示会自然消失。', icon: 'arrow-down' }
] }, methods: {
  onAreaScroll: function (event) { var detail = event && event.detail ? event.detail : {}; this.setData({ areaScrollTop: Number(detail.scrollTop) || 0 }); },
  onAreaGradientChange: function (event) {
    var enabled = Boolean(event && event.detail && event.detail.checked);
    this.setData({
      areaGradientOverlay: enabled,
      areaGradientStatus: enabled
        ? '遮罩已开启，当前为' + this.data.areaGradientOverlaySizeLabel + '等尺寸。'
        : '遮罩已关闭，滚动内容与位置保持不变。'
    });
  },
  setAreaGradientSize: function (nextIndex) {
    var index = Math.max(0, Math.min(OVERLAY_SIZES.length - 1, Number(nextIndex) || 0));
    var size = OVERLAY_SIZES[index];
    var label = OVERLAY_SIZE_LABELS[size];
    this.setData({
      areaGradientOverlaySize: size,
      areaGradientOverlaySizeLabel: label,
      areaGradientCanDecrease: index > 0,
      areaGradientCanIncrease: index < OVERLAY_SIZES.length - 1,
      areaGradientStatus: '遮罩尺寸已调整为' + label + '。'
    });
  },
  onDecreaseAreaGradient: function () {
    this.setAreaGradientSize(OVERLAY_SIZES.indexOf(this.data.areaGradientOverlaySize) - 1);
  },
  onIncreaseAreaGradient: function () {
    this.setAreaGradientSize(OVERLAY_SIZES.indexOf(this.data.areaGradientOverlaySize) + 1);
  }
}}));
