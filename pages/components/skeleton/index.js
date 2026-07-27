var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Skeleton',
  data: {
    skeletonLoading: true,
    skeletonRows: [{ width: '40%' }, { width: '100%' }, { width: '76%' }],
    skeletonAvatarRows: [{ type: 'circle', size: '72rpx' }, { width: '50%' }],
    skeletonParagraphRows: [{ width: '100%' }, { width: '88%' }, { width: '62%' }]
  },
  methods: {
    onToggleSkeleton: function () {
      this.setData({ skeletonLoading: !this.data.skeletonLoading });
    }
  }
}));
