var visualConfig = require('poemui-miniprogram/common/utils/visual-config');

App({
  onLaunch: function () {
    visualConfig.restore();
  }
});
