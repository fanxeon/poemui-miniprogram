var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    content: { type: String, value: '' },
    required: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    colon: { type: Boolean, value: false }
  }
});
