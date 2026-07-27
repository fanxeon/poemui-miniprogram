var createComponentPage = require('../../../utils/component-page');
Page(createComponentPage({ title: 'Avatar', data: { avatarShape: 'circle', avatarStatus: '当前使用圆形头像。' }, methods: { onToggleAvatarShape: function () { var shape = this.data.avatarShape === 'circle' ? 'round' : 'circle'; this.setData({ avatarShape: shape, avatarStatus: shape === 'circle' ? '当前使用圆形头像。' : '当前使用圆角头像。' }); } }}));
