var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    layout: { type: String, value: 'horizontal' },
    align: { type: String, value: 'center' },
    content: { type: String, value: '' },
    showContent: { type: Boolean, value: false },
    dashed: { type: Boolean, value: false },
    decorative: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '分隔线' }
  },
  data: { rootClass: '', isVertical: false, orientation: 'horizontal', showContentNode: false },
  observers: {
    'layout,align,content,showContent,dashed,decorative,ariaLabel,colorScheme': function sync() { this.syncState(); }
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var layout = this.data.layout === 'vertical' ? 'vertical' : 'horizontal';
      var align = ['left', 'center', 'right'].indexOf(this.data.align) > -1 ? this.data.align : 'center';
      this.setData({
        isVertical: layout === 'vertical',
        orientation: layout,
        showContentNode: layout !== 'vertical' && (this.data.showContent || !!this.data.content),
        rootClass: [
          'pui-divider',
          this.getColorSchemeClass(),
          'pui-divider--' + layout,
          'pui-divider--' + align,
          this.data.dashed ? 'pui-divider--dashed' : ''
        ].filter(Boolean).join(' ')
      });
    }
  }
});
