var themeBehavior = require('../../common/behaviors/theme');

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    theme: { type: String, value: 'default' },
    variant: { type: String, value: 'base' },
    icon: { type: String, value: '' },
    content: { type: String, value: '' },
    size: { type: String, value: 'medium' },
    loading: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: 'pui-fab pui-fab--default pui-fab--base pui-fab--medium',
    buttonTheme: 'default',
    buttonShape: 'circle',
    semanticLabel: '浮动操作'
  },
  observers: {
    'theme,variant,icon,content,size,loading,disabled,ariaLabel,reduceMotion,colorScheme': function syncObserver() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() { this.syncState(); }
  },
  methods: {
    syncState: function syncState() {
      var theme = normalizeEnum(this.data.theme, ['default', 'primary', 'danger', 'inverse'], 'default');
      var variant = normalizeEnum(this.data.variant, ['base', 'outline', 'text', 'ghost', 'transparent'], 'base');
      var size = normalizeEnum(this.data.size, ['extra-small', 'small', 'medium', 'large'], 'medium');
      var content = String(this.data.content || '');
      var buttonTheme = theme === 'inverse' ? 'default' : theme;
      var semanticLabel = String(this.data.ariaLabel || content || '浮动操作').trim() || '浮动操作';
      this.setData({
        rootClass: [
          'pui-fab',
          this.getColorSchemeClass(),
          'pui-fab--' + theme,
          'pui-fab--' + variant,
          'pui-fab--' + size,
          content ? 'pui-fab--extended' : '',
          this.data.loading ? 'pui-fab--loading' : '',
          this.data.disabled ? 'pui-fab--disabled' : '',
          this.data.reduceMotion ? 'pui-fab--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        buttonTheme: buttonTheme,
        buttonShape: content ? 'round' : 'circle',
        semanticLabel: semanticLabel
      });
    },
    onButtonClick: function onButtonClick(event) {
      if (this.data.disabled || this.data.loading) return false;
      var detail = event && event.detail && typeof event.detail === 'object' ? event.detail : {};
      this.triggerEvent('click', Object.assign({}, detail, { source: 'fab' }));
      return true;
    }
  }
});
