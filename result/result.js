var themeBehavior = require('../common/behaviors/theme');

var THEMES = ['default', 'success', 'warning', 'error'];
var THEME_ICONS = {
  default: 'info-circle',
  success: 'success-circle',
  warning: 'warning-triangle',
  error: 'error-circle',
};

function oneOf(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeIcon(value, theme) {
  var fallback = THEME_ICONS[theme] || THEME_ICONS.default;
  if (value === false) return { name: '', size: 96, color: '' };
  if (typeof value === 'string') {
    return { name: value.trim() || fallback, size: 96, color: '' };
  }
  if (value && typeof value === 'object') {
    var size = Math.round(Number(value.size));
    return {
      name: typeof value.name === 'string' && value.name.trim() ? value.name.trim() : fallback,
      size: isFinite(size) ? Math.max(24, Math.min(320, size)) : 96,
      color: typeof value.color === 'string' ? value.color.trim() : '',
    };
  }
  return { name: fallback, size: 96, color: '' };
}

function stringValue(value) {
  return value === null || value === undefined ? '' : String(value);
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    description: { type: String, value: '' },
    icon: { type: null, value: true },
    image: { type: String, value: '' },
    theme: { type: String, value: 'default' },
    title: { type: String, value: '' },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: 'pui-result pui-result--default',
    rootStyle: '',
    resolvedIconName: 'info-circle',
    resolvedIconSize: 96,
    resolvedIconColor: '',
    semanticLabel: '结果',
    rootRole: 'status',
    ariaLive: 'polite',
    entered: false,
  },
  observers: {
    'description,icon,image,theme,title,ariaLabel,reduceMotion,colorScheme': function sync() {
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
      var theme = oneOf(this.data.theme, THEMES, 'default');
      var icon = normalizeIcon(this.data.icon, theme);
      var title = stringValue(this.data.title).trim();
      var description = stringValue(this.data.description).trim();
      this.setData({
        rootClass: ['pui-result', this.getColorSchemeClass(), 'pui-result--' + theme, this.data.entered ? 'pui-result--entered' : ''].filter(Boolean).join(' '),
        rootStyle: '--pui-result-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;',
        resolvedIconName: icon.name,
        resolvedIconSize: icon.size,
        resolvedIconColor: icon.color,
        semanticLabel: stringValue(this.data.ariaLabel).trim() || title || description || '结果',
        rootRole: theme === 'error' ? 'alert' : 'status',
        ariaLive: theme === 'error' ? 'assertive' : 'polite',
      });
    },
    scheduleEnter: function scheduleEnter() {
      var self = this;
      clearTimeout(this.enterTimer);
      if (this.data.entered) return;
      this.enterTimer = setTimeout(function enterResult() {
        self.enterTimer = null;
        self.setData({ entered: true }, function updateEnteredClass() {
          self.syncState();
        });
      }, 16);
    },
  },
});
