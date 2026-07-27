module.exports = Behavior({
  properties: {
    customClass: {
      type: String,
      value: '',
    },
    customStyle: {
      type: String,
      value: '',
    },
    colorScheme: {
      type: String,
      value: '',
    },
  },
  methods: {
    getColorSchemeClass: function getColorSchemeClass() {
      if (this.data.colorScheme === 'light' || this.data.colorScheme === 'dark') {
        return 'pui-theme--' + this.data.colorScheme;
      }
      return '';
    },
  },
});
