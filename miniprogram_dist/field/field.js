var themeBehavior = require('../common/behaviors/theme');

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeLabelWidth(value) {
  var width = Math.round(Number(value));
  if (!isFinite(width)) return 160;
  return Math.max(80, Math.min(360, width));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  relations: {
    '../form/form': {
      type: 'parent',
      linked: function linked(form) {
        this._form = form;
        if (form && typeof form.registerField === 'function') form.registerField(this);
      },
      unlinked: function unlinked(form) {
        if (form && typeof form.unregisterField === 'function') form.unregisterField(this);
        this._form = null;
        this.clearFormValidation();
        this.syncFormContext({ required: false, showErrorMessage: true, reduceMotion: false });
      }
    }
  },
  properties: {
    name: { type: String, value: '' },
    label: { type: String, value: '' },
    help: { type: String, value: '' },
    message: { type: String, value: '' },
    status: { type: String, value: 'default' },
    required: { type: Boolean, value: false },
    requiredMarkPosition: { type: String, value: 'left' },
    labelAlign: { type: String, value: 'left' },
    contentAlign: { type: String, value: 'left' },
    labelWidth: { type: Number, value: 160 },
    arrow: { type: Boolean, value: false },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: '',
    rootStyle: '',
    normalizedStatus: 'default',
    normalizedLabelAlign: 'top',
    normalizedContentAlign: 'left',
    normalizedRequiredMarkPosition: 'left',
    semanticLabel: '字段',
    formRequired: false,
    formShowErrorMessage: true,
    formReduceMotion: false,
    formMessages: [],
    displayMessage: '',
    displayMessageIsSlot: false,
    effectiveRequired: false
  },
  observers: {
    'name,label,help,message,status,required,requiredMarkPosition,labelAlign,contentAlign,labelWidth,arrow,reduceMotion,colorScheme': function syncStateObserver() {
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
      var formMessages = Array.isArray(this.data.formMessages) ? this.data.formMessages : [];
      var firstFormMessage = formMessages[0] || null;
      var formStatus = firstFormMessage ? (firstFormMessage.type === 'warning' ? 'warning' : 'error') : 'default';
      var status = formStatus !== 'default' ? formStatus : normalizeEnum(this.data.status, ['default', 'success', 'warning', 'error'], 'default');
      var labelAlign = normalizeEnum(this.data.labelAlign, ['top', 'left', 'right'], 'left');
      var contentAlign = normalizeEnum(this.data.contentAlign, ['left', 'right'], 'left');
      var requiredMarkPosition = normalizeEnum(this.data.requiredMarkPosition, ['left', 'right'], 'left');
      var label = this.data.label === 'slot' ? '' : this.data.label;
      var semanticLabel = (label || this.data.name || '字段').trim() || '字段';
      var displayFormMessage = firstFormMessage && this.data.formShowErrorMessage ? String(firstFormMessage.message || '') : '';
      var displayMessage = displayFormMessage || (this.data.message === 'slot' ? 'slot' : this.data.message);
      var reduced = this.data.reduceMotion || this.data.formReduceMotion;
      var effectiveRequired = this.data.required || this.data.formRequired;
      var hasSupporting = this.data.help === 'slot' || !!this.data.help || !!displayMessage;

      this.setData({
        rootClass: [
          'pui-field',
          'pui-field-row',
          'pui-field-row--editable',
          this.getColorSchemeClass(),
          'pui-field--label-' + labelAlign,
          'pui-field--content-' + contentAlign,
          'pui-field--status-' + status,
          hasSupporting ? 'pui-field--has-supporting' : '',
          this.data.arrow ? 'pui-field--arrow' : '',
          reduced ? 'pui-field--reduced' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-field-label-width:' + normalizeLabelWidth(this.data.labelWidth) + 'rpx;--pui-field-duration:' + (reduced ? 1 : 500) + 'ms;--pui-field-ease:var(--pui-ease-standard);--pui-field-row-duration:' + (reduced ? 1 : 500) + 'ms;--pui-field-row-ease:var(--pui-ease-standard);',
        normalizedStatus: status,
        normalizedLabelAlign: labelAlign,
        normalizedContentAlign: contentAlign,
        normalizedRequiredMarkPosition: requiredMarkPosition,
        semanticLabel: semanticLabel,
        displayMessage: displayMessage,
        displayMessageIsSlot: displayMessage === 'slot' && !displayFormMessage,
        effectiveRequired: effectiveRequired
      });
    },
    getFieldName: function getFieldName() {
      return String(this.data.name || '').trim();
    },
    syncFormContext: function syncFormContext(context) {
      var next = context || {};
      this.setData({
        formRequired: next.required === true,
        formShowErrorMessage: next.showErrorMessage !== false,
        formReduceMotion: next.reduceMotion === true
      });
      this.syncState();
    },
    applyFormValidation: function applyFormValidation(messages, showErrorMessage) {
      this.setData({
        formMessages: Array.isArray(messages) ? messages.slice() : [],
        formShowErrorMessage: showErrorMessage !== false
      });
      this.syncState();
    },
    clearFormValidation: function clearFormValidation() {
      this.setData({ formMessages: [] });
      this.syncState();
    },
    scrollIntoView: function scrollIntoView(behavior, reduced) {
      if (typeof this.createSelectorQuery !== 'function' || typeof wx === 'undefined' || typeof wx.pageScrollTo !== 'function') return;
      this.createSelectorQuery().select('.pui-field').boundingClientRect().selectViewport().scrollOffset().exec(function scroll(result) {
        if (!result || !result[0] || !result[1]) return;
        wx.pageScrollTo({
          scrollTop: result[0].top + result[1].scrollTop,
          duration: behavior === 'smooth' && !reduced ? 500 : 0
        });
      });
    }
  }
});
