'use strict';

var STATUS = {
  "baseline": 0,
  "currentVersion": "0.1.3",
  "previousVersion": "0.1.2",
  "total": 74,
  "previousTotal": 74,
  "incrementTotal": 0,
  "maximum": 19,
  "versions": [
    {
      "version": "0.1.0",
      "total": 71
    },
    {
      "version": "0.1.1",
      "total": 74
    },
    {
      "version": "0.1.2",
      "total": 74
    },
    {
      "version": "0.1.3",
      "total": 74
    }
  ],
  "items": [
    {
      "key": "getting-started",
      "label": "规范",
      "value": 1,
      "previousValue": 1,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 1,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "foundation",
      "label": "基础",
      "value": 3,
      "previousValue": 3,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 3,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "layout",
      "label": "布局",
      "value": 5,
      "previousValue": 5,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 5,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "navigation",
      "label": "导航",
      "value": 9,
      "previousValue": 9,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 9,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "form",
      "label": "表单",
      "value": 19,
      "previousValue": 19,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 19,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "data",
      "label": "数据展示",
      "value": 14,
      "previousValue": 14,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 14,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "feedback",
      "label": "反馈",
      "value": 9,
      "previousValue": 9,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 9,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "overlay",
      "label": "浮层",
      "value": 6,
      "previousValue": 6,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 6,
          "theme": "blue"
        }
      ]
    },
    {
      "key": "advanced",
      "label": "高级",
      "value": 8,
      "previousValue": 8,
      "increment": 0,
      "segments": [
        {
          "key": "previous",
          "label": "v0.1.2 已有",
          "value": 8,
          "theme": "blue"
        }
      ]
    }
  ]
};

function cloneSegment(segment) {
  return {
    key: segment.key,
    label: segment.label,
    value: segment.value,
    theme: segment.theme
  };
}

function items() {
  return STATUS.items.map(function clone(item) {
    return {
      key: item.key,
      label: item.label,
      value: item.value,
      previousValue: item.previousValue,
      increment: item.increment,
      segments: item.segments.map(cloneSegment)
    };
  });
}

function versions() {
  return STATUS.versions.map(function clone(version) {
    return {
      version: version.version,
      total: version.total
    };
  });
}

module.exports = {
  baseline: STATUS.baseline,
  currentVersion: STATUS.currentVersion,
  previousVersion: STATUS.previousVersion,
  total: STATUS.total,
  previousTotal: STATUS.previousTotal,
  incrementTotal: STATUS.incrementTotal,
  maximum: STATUS.maximum,
  versions: versions,
  items: items
};
