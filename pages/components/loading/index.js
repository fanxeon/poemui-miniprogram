var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Loading',
  data: { loadingVisible: true },
  methods: {
    onToggleLoading: function () {
      this.setData({ loadingVisible: !this.data.loadingVisible });
    }
  }
}));
