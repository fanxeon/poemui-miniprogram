var themeBehavior = require('../common/behaviors/theme');

function textValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' && value.trim() === '') return '';
  return String(value);
}

Component({
  behaviors: [themeBehavior],
  options: {
    multipleSlots: true,
    styleIsolation: 'shared'
  },
  properties: {
    title: { type: null, value: '' },
    description: { type: null, value: '' },
    card: { type: Boolean, value: false },
    bordered: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '' }
  },
  data: {
    rootClass: 'pui-cell-group',
    rootStyle: '',
    displayTitle: '',
    displayDescription: '',
    semanticLabel: '单元格分组',
    hasHeader: false
  },
  observers: {
    'title,description,card,bordered,ariaLabel,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
    }
  },
  methods: {
    syncState: function syncState() {
      var title = textValue(this.data.title);
      var description = textValue(this.data.description);
      var label = String(this.data.ariaLabel || title || '单元格分组').trim() || '单元格分组';
      this.setData({
        displayTitle: title,
        displayDescription: description,
        semanticLabel: label,
        hasHeader: Boolean(title || description),
        rootClass: [
          'pui-cell-group',
          this.getColorSchemeClass(),
          this.data.card ? 'pui-cell-group--card' : '',
          this.data.bordered ? 'pui-cell-group--bordered' : ''
        ].filter(Boolean).join(' ')
      });
    }
  }
});
