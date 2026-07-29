Component({
  properties: {
    duration: { type: Number, value: 3000 },
    safeArea: { type: Boolean, value: true },
    reduceMotion: { type: Boolean, value: false }
  },
  methods: {
    getMessage: function getMessage() {
      return this.selectComponent('#page-feedback-message');
    },
    show: function show(options) {
      var message = this.getMessage();
      return message && typeof message.show === 'function' ? message.show(options) : '';
    },
    update: function update(key, patch) {
      var message = this.getMessage();
      return Boolean(message && typeof message.update === 'function' && message.update(key, patch));
    },
    hide: function hide(key) {
      var message = this.getMessage();
      return Boolean(message && typeof message.hide === 'function' && message.hide(key));
    },
    onMessageClick: function onMessageClick(event) {
      this.triggerEvent('click', event && event.detail ? event.detail : {});
    },
    onMessageAction: function onMessageAction(event) {
      this.triggerEvent('action', event && event.detail ? event.detail : {});
    },
    onMessageClose: function onMessageClose(event) {
      this.triggerEvent('close', event && event.detail ? event.detail : {});
    }
  }
});
