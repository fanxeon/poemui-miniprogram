var themeBehavior = require('../common/behaviors/theme');

function normalizeIcon(value) {
  if (typeof value === 'string') {
    return { name: value.trim(), size: 192, color: '' };
  }
  if (value && typeof value === 'object') {
    var size = Math.round(Number(value.size));
    return {
      name: typeof value.name === 'string' ? value.name.trim() : '',
      size: isFinite(size) ? Math.max(24, Math.min(320, size)) : 192,
      color: typeof value.color === 'string' ? value.color.trim() : '',
    };
  }
  return { name: '', size: 192, color: '' };
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    description: { type: String, value: '' },
    icon: { type: null, value: '' },
    image: { type: String, value: '' },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: 'pui-empty',
    rootStyle: '',
    resolvedIconName: '',
    resolvedIconSize: 192,
    resolvedIconColor: '',
    semanticLabel: '空状态',
    entered: false,
  },
  observers: {
    'description,icon,image,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
      this.scheduleEnter();
    },
    detached: function detached() {
      clearTimeout(this.enterTimer);
      this.enterTimer = null;
    },
  },
  methods: {
    syncState: function syncState() {
      var icon = normalizeIcon(this.data.icon);
      // 空字符串是 description 的有效受控值；仅 null/undefined 才回退为空。
      var descriptionValue = this.data.description === null || this.data.description === undefined ? '' : this.data.description;
      var description = String(descriptionValue).trim();
      this.setData({
        rootClass: ['pui-empty', this.getColorSchemeClass(), this.data.entered ? 'pui-empty--entered' : ''].filter(Boolean).join(' '),
        rootStyle: '--pui-empty-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;',
        resolvedIconName: icon.name,
        resolvedIconSize: icon.size,
        resolvedIconColor: icon.color,
        semanticLabel: (String(this.data.ariaLabel || '').trim() || description || '空状态'),
      });
    },
    scheduleEnter: function scheduleEnter() {
      var self = this;
      clearTimeout(this.enterTimer);
      if (this.data.entered) return;
      this.enterTimer = setTimeout(function enter() {
        self.enterTimer = null;
        self.setData({ entered: true }, function updateEnteredClass() {
          self.syncState();
        });
      }, 16);
    },
  },
});
