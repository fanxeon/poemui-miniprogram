var createComponentPage = require('../../../utils/component-page');

var avatarSources = [
  'https://lg-1sobdtqg-1254094290.cos.ap-shanghai.myqcloud.com/user_img/QX_girl.png',
  '/assets/poemui-moon-lines-mark-light.png',
];

Page(createComponentPage({
  title: 'Avatar',
  data: {
    avatarShape: 'circle',
    avatarSource: avatarSources[0],
    avatarSourceIndex: 0,
  },
  methods: {
    onToggleAvatarShape: function onToggleAvatarShape() {
      this.setData({ avatarShape: this.data.avatarShape === 'circle' ? 'round' : 'circle' });
    },
    onChangeAvatarSource: function onChangeAvatarSource() {
      var nextIndex = this.data.avatarSourceIndex === 0 ? 1 : 0;
      this.setData({
        avatarSourceIndex: nextIndex,
        avatarSource: avatarSources[nextIndex],
      });
    },
  },
}));
