var themeBehavior = require('../common/behaviors/theme');

var MODES = ['navigation', 'menubar'];
var DIRECTIONS = ['horizontal', 'vertical'];
var PLACEMENTS = ['top', 'bottom'];
var VARIANTS = ['default', 'outline', 'soft'];
var SIZES = ['small', 'medium', 'large'];
var TYPES = ['action', 'link', 'checkbox', 'radio', 'submenu', 'separator'];
var THEMES = ['default', 'primary', 'success', 'warning', 'danger'];
var OPEN_TYPES = ['navigateTo', 'redirectTo', 'switchTab', 'reLaunch', 'navigateBack'];
var EASINGS = ['standard', 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];
var MAX_ROOT_ITEMS = 12;
var MAX_LEVEL_ITEMS = 50;
var MAX_TOTAL_ITEMS = 100;
var MAX_DEPTH = 3;

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function firstDefined(object, keys, fallback) {
  for (var index = 0; index < keys.length; index += 1) {
    if (hasOwn(object, keys[index])) return object[keys[index]];
  }
  return fallback;
}

function field(object, requested, fallbacks) {
  if (requested && hasOwn(object, requested)) return object[requested];
  return firstDefined(object, fallbacks || [], undefined);
}

function allowed(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.min(max, Math.max(min, number));
}

function nextTick(callback) {
  if (typeof wx !== 'undefined' && wx.nextTick) wx.nextTick(callback);
  else setTimeout(callback, 0);
}

function sourceOf(value, fallback) {
  if (typeof value === 'string' && value) return value;
  if (value && value.detail && value.detail.source) return value.detail.source;
  if (value && value.currentTarget && value.currentTarget.dataset && value.currentTarget.dataset.source) return value.currentTarget.dataset.source;
  return fallback || 'programmatic';
}

function valueKey(value) {
  if (value === null) return 'null:null';
  var type = typeof value;
  if (type === 'object') {
    try { return 'object:' + JSON.stringify(value); } catch (error) { return 'object:' + String(value); }
  }
  return type + ':' + String(value);
}

function sameValue(left, right) {
  return valueKey(left) === valueKey(right);
}

function uniqueValues(values) {
  if (!Array.isArray(values)) return [];
  var seen = {};
  return values.filter(function filterValue(value) {
    var key = valueKey(value);
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function normalizeRadioValues(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  var result = {};
  Object.keys(value).forEach(function copyKey(key) { result[String(key)] = value[key]; });
  return result;
}

function isControlled(data, key) {
  return data[key] !== null && data[key] !== undefined;
}

function itemChildren(item, data) {
  var configured = field(item, data.childrenKey, []);
  if (Array.isArray(configured)) return configured;
  return firstDefined(item, ['children', 'submenu', 'menu'], []);
}

function normalizeLeaf(raw, itemIndex, groupIndex, depth, parentPath, context) {
  if (context.total >= MAX_TOTAL_ITEMS) return null;
  var primitive = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean';
  var item = primitive ? { label: raw, value: raw } : (raw && typeof raw === 'object' ? raw : {});
  var childrenSource = depth < MAX_DEPTH ? itemChildren(item, context.data) : [];
  var requestedType = String(item.type || item.kind || (childrenSource.length ? 'submenu' : (item.url ? 'link' : 'action')));
  var type = allowed(requestedType, TYPES, childrenSource.length ? 'submenu' : (item.url ? 'link' : 'action'));
  if (childrenSource.length) type = 'submenu';
  if (type === 'separator') {
    return { key: 'separator-' + parentPath.concat([groupIndex, itemIndex]).join('-'), type: 'separator', hidden: Boolean(item.hidden), raw: item };
  }
  var value = field(item, context.data.itemKey, ['value', 'id', 'key']);
  if (value === undefined) value = 'item-' + parentPath.concat([groupIndex, itemIndex]).join('-');
  var typedKey = valueKey(value);
  if (context.seen[typedKey]) return null;
  context.seen[typedKey] = true;
  context.total += 1;
  var labelValue = field(item, context.data.labelKey, ['label', 'text', 'title']);
  if (labelValue === undefined) labelValue = '选项 ' + (itemIndex + 1);
  var iconValue = field(item, context.data.iconKey, ['icon']);
  var label = String(labelValue === null || labelValue === undefined ? '' : labelValue);
  var description = String(firstDefined(item, ['description', 'desc'], '') || '');
  var key = 'item-' + parentPath.concat([groupIndex, itemIndex]).join('-');
  var nextPath = parentPath.concat([key]);
  var children = childrenSource.length ? normalizeLevel(childrenSource, depth + 1, nextPath, context) : [];
  if (type === 'submenu' && !countItems(children)) type = item.url ? 'link' : 'action';
  return {
    key: key,
    typedKey: typedKey,
    value: value,
    label: label,
    description: description,
    icon: String(iconValue || ''),
    badge: firstDefined(item, ['badge', 'count'], null),
    badgeDot: Boolean(item.badgeDot || item.dot),
    shortcut: String(item.shortcut || ''),
    type: type,
    theme: allowed(String(firstDefined(item, ['theme', 'variant'], item.destructive ? 'danger' : 'default')), THEMES, 'default'),
    radioGroup: String(item.radioGroup || item.groupName || 'default'),
    disabled: Boolean(item.disabled),
    loading: Boolean(item.loading),
    hidden: Boolean(item.hidden),
    separatorBefore: Boolean(item.separatorBefore),
    close: hasOwn(item, 'close') ? Boolean(item.close) : null,
    url: String(item.url || ''),
    openType: allowed(String(item.openType || 'navigateTo'), OPEN_TYPES, 'navigateTo'),
    delta: Math.round(clamp(item.delta, 1, 99, 1)),
    raw: item,
    path: nextPath,
    parentPath: parentPath.slice(),
    children: children,
  };
}

function normalizeLevel(entries, depth, parentPath, context) {
  if (!Array.isArray(entries) || depth > MAX_DEPTH) return [];
  var groups = [];
  var loose = [];
  var limited = entries.slice(0, MAX_LEVEL_ITEMS);

  function pushGroup(rawItems, heading, description, separatorBefore) {
    if (!Array.isArray(rawItems) || context.total >= MAX_TOTAL_ITEMS) return;
    var groupIndex = groups.length;
    var items = rawItems.slice(0, MAX_LEVEL_ITEMS).map(function mapItem(raw, itemIndex) {
      return normalizeLeaf(raw, itemIndex, groupIndex, depth, parentPath, context);
    }).filter(function filterItem(item) { return item && !item.hidden; });
    if (!items.length) return;
    groups.push({
      key: 'group-' + parentPath.join('-') + '-' + groupIndex,
      heading: String(heading === null || heading === undefined ? '' : heading),
      description: String(description === null || description === undefined ? '' : description),
      separatorBefore: Boolean(separatorBefore),
      items: items,
    });
  }

  function flushLoose() {
    if (!loose.length) return;
    var pending = loose;
    loose = [];
    pushGroup(pending, '', '', false);
  }

  limited.forEach(function eachEntry(entry) {
    if (Array.isArray(entry)) {
      flushLoose();
      pushGroup(entry, '', '', true);
      return;
    }
    var configuredChildren = entry && typeof entry === 'object' ? field(entry, context.data.childrenKey, []) : undefined;
    var isGroup = entry && typeof entry === 'object' && Array.isArray(entry.items) && !Array.isArray(configuredChildren) && !Array.isArray(entry.children) && !Array.isArray(entry.submenu);
    if (isGroup) {
      flushLoose();
      pushGroup(entry.items, firstDefined(entry, ['heading', 'label', 'title'], ''), firstDefined(entry, ['description', 'desc'], ''), entry.separatorBefore);
      return;
    }
    loose.push(entry);
  });
  flushLoose();
  return groups;
}

function countItems(groups) {
  return (groups || []).reduce(function sum(total, group) {
    return total + (group.items || []).filter(function filterItem(item) { return item.type !== 'separator'; }).length;
  }, 0);
}

function flattenItems(groups, result) {
  var output = result || [];
  (groups || []).forEach(function eachGroup(group) {
    (group.items || []).forEach(function eachItem(item) {
      if (item.type !== 'separator') output.push(item);
      if (item.children && item.children.length) flattenItems(item.children, output);
    });
  });
  return output;
}

function normalizeRootItems(items, data) {
  var context = { data: data, seen: {}, total: 0 };
  return (Array.isArray(items) ? items.slice(0, MAX_ROOT_ITEMS) : []).map(function mapRoot(raw, index) {
    var primitive = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean';
    var item = primitive ? { label: raw, value: raw } : (raw && typeof raw === 'object' ? raw : {});
    if (item.hidden || context.total >= MAX_TOTAL_ITEMS) return null;
    var value = field(item, data.itemKey, ['value', 'id', 'key']);
    if (value === undefined) value = index;
    var typedKey = valueKey(value);
    if (context.seen[typedKey]) return null;
    context.seen[typedKey] = true;
    context.total += 1;
    var labelValue = field(item, data.labelKey, ['label', 'text', 'title']);
    if (labelValue === undefined) labelValue = '导航 ' + (index + 1);
    var iconValue = field(item, data.iconKey, ['icon']);
    var childrenSource = itemChildren(item, data);
    var groups = childrenSource.length ? normalizeLevel(childrenSource, 1, [], context) : [];
    var type = groups.length ? 'submenu' : allowed(String(item.type || item.kind || (item.url ? 'link' : 'action')), TYPES, item.url ? 'link' : 'action');
    return {
      key: 'root-' + index,
      typedKey: typedKey,
      value: value,
      label: String(labelValue === null || labelValue === undefined ? '' : labelValue),
      description: String(firstDefined(item, ['description', 'desc'], '') || ''),
      icon: String(iconValue || ''),
      badge: firstDefined(item, ['badge', 'count'], null),
      badgeDot: Boolean(item.badgeDot || item.dot),
      type: type,
      theme: allowed(String(firstDefined(item, ['theme', 'variant'], 'default')), THEMES, 'default'),
      disabled: Boolean(item.disabled),
      loading: Boolean(item.loading),
      url: String(item.url || ''),
      openType: allowed(String(item.openType || 'navigateTo'), OPEN_TYPES, 'navigateTo'),
      delta: Math.round(clamp(item.delta, 1, 99, 1)),
      close: hasOwn(item, 'close') ? Boolean(item.close) : null,
      raw: item,
      groups: groups,
      descendants: flattenItems(groups, []),
    };
  }).filter(Boolean);
}

function findRootByValue(roots, value) {
  var key = valueKey(value);
  return (roots || []).find(function findRoot(root) { return root.typedKey === key; }) || null;
}

function findItemByValue(roots, value) {
  var key = valueKey(value);
  for (var rootIndex = 0; rootIndex < (roots || []).length; rootIndex += 1) {
    var root = roots[rootIndex];
    if (root.typedKey === key) return root;
    var match = root.descendants.find(function findDescendant(item) { return item.typedKey === key; });
    if (match) return match;
  }
  return null;
}

function findByInternalKey(groups, key) {
  var found = null;
  (groups || []).some(function eachGroup(group) {
    return (group.items || []).some(function eachItem(item) {
      if (item.key === key) { found = item; return true; }
      if (item.children && item.children.length) {
        found = findByInternalKey(item.children, key);
        if (found) return true;
      }
      return false;
    });
  });
  return found;
}

function levelForPath(rootGroups, path) {
  var groups = rootGroups || [];
  var validPath = [];
  var parents = [];
  (path || []).some(function eachKey(key) {
    var item = findByInternalKey(groups, key);
    if (!item || item.type !== 'submenu' || !item.children.length) return true;
    validPath.push(key);
    parents.push(item);
    groups = item.children;
    return false;
  });
  return { groups: groups, validPath: validPath, parents: parents };
}

function decorateGroups(groups, checkedValues, radioValues, data) {
  var checked = {};
  uniqueValues(checkedValues).forEach(function eachValue(value) { checked[valueKey(value)] = true; });
  return (groups || []).map(function mapGroup(group, groupIndex) {
    return {
      key: group.key,
      heading: group.heading,
      description: group.description,
      showHeading: Boolean(data.showGroup && (group.heading || group.description)),
      showSeparator: Boolean(data.showSeparator && groupIndex > 0),
      items: (group.items || []).map(function mapItem(item, itemIndex) {
        var radioKey = valueKey(radioValues[item.radioGroup]);
        return Object.assign({}, item, {
          groupIndex: groupIndex,
          itemIndex: itemIndex,
          checked: item.type === 'checkbox' ? Boolean(checked[item.typedKey]) : (item.type === 'radio' ? radioKey === item.typedKey : false),
          selectable: item.type === 'checkbox' || item.type === 'radio',
          showSeparator: Boolean(data.showSeparator && item.separatorBefore),
          showArrow: item.type === 'submenu',
        });
      }),
    };
  });
}

function publicItem(item) {
  if (!item) return null;
  return {
    label: item.label,
    value: item.value,
    description: item.description,
    icon: item.icon,
    badge: item.badge,
    badgeDot: item.badgeDot,
    shortcut: item.shortcut || '',
    type: item.type,
    theme: item.theme,
    radioGroup: item.radioGroup || '',
    disabled: item.disabled,
    loading: item.loading,
    url: item.url,
    openType: item.openType,
    raw: item.raw,
  };
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    expandedValue: { type: null, value: null },
    defaultExpandedValue: { type: null, value: null },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    checkedValues: { type: null, value: null },
    defaultCheckedValues: { type: Array, value: [] },
    radioValues: { type: null, value: null },
    defaultRadioValues: { type: Object, value: {} },
    itemKey: { type: String, value: 'value' },
    labelKey: { type: String, value: 'label' },
    childrenKey: { type: String, value: 'children' },
    iconKey: { type: String, value: 'icon' },
    mode: { type: String, value: 'navigation' },
    direction: { type: String, value: 'horizontal' },
    placement: { type: String, value: 'bottom' },
    variant: { type: String, value: 'default' },
    size: { type: String, value: 'medium' },
    block: { type: Boolean, value: true },
    scrollable: { type: Boolean, value: true },
    wrap: { type: Boolean, value: false },
    showHeader: { type: Boolean, value: true },
    showIcon: { type: Boolean, value: true },
    showDescription: { type: Boolean, value: true },
    showBadge: { type: Boolean, value: true },
    showIndicator: { type: Boolean, value: true },
    indicatorIcon: { type: String, value: 'chevron-down' },
    showGroup: { type: Boolean, value: true },
    showSeparator: { type: Boolean, value: true },
    showShortcut: { type: Boolean, value: true },
    closeOnSelect: { type: Boolean, value: true },
    closeOnCheck: { type: Boolean, value: false },
    closeOnOverlayClick: { type: Boolean, value: true },
    showOverlay: { type: Boolean, value: true },
    resetSubmenuOnClose: { type: Boolean, value: true },
    autoNavigate: { type: Boolean, value: false },
    customTrigger: { type: Boolean, value: false },
    customItem: { type: Boolean, value: false },
    customHeader: { type: Boolean, value: false },
    customContent: { type: Boolean, value: false },
    customFooter: { type: Boolean, value: false },
    customEmpty: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '导航加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '导航加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无导航内容' },
    panelWidth: { type: Number, value: 0 },
    maxHeight: { type: Number, value: 560 },
    offset: { type: Number, value: 12 },
    zIndex: { type: Number, value: 1000 },
    ariaLabel: { type: String, value: '导航菜单' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    currentValue: null,
    currentExpandedValue: null,
    currentVisible: false,
    currentCheckedValues: [],
    currentRadioValues: {},
    rootItems: [],
    currentRoot: null,
    currentGroups: [],
    outgoingGroups: [],
    currentTitle: '',
    currentDescription: '',
    currentDepth: 0,
    canBack: false,
    stateType: 'empty',
    panelRendered: false,
    panelEntered: false,
    contentActive: true,
    contentDirection: 'forward',
    normalizedMode: 'navigation',
    normalizedDirection: 'horizontal',
    normalizedPlacement: 'bottom',
    normalizedVariant: 'default',
    normalizedSize: 'medium',
    rootClass: 'pui-navigation-menu pui-navigation-menu--horizontal',
    rootStyle: '--pui-navigation-menu-duration:500ms;--pui-navigation-menu-ease:var(--pui-ease-standard);--pui-navigation-menu-panel-width:100%;--pui-navigation-menu-max-height:560rpx;--pui-navigation-menu-offset:12rpx;z-index:1000;',
  },
  observers: {
    value: function observeValue() { this.syncValueControl(false); },
    expandedValue: function observeExpanded() { this.syncExpandedControl(false); },
    visible: function observeVisible() { this.syncVisibleControl(false); },
    checkedValues: function observeChecked() { this.syncCheckedControl(false); },
    radioValues: function observeRadio() { this.syncRadioControl(false); },
    'items,itemKey,labelKey,childrenKey,iconKey': function observeItems() { this.syncMenu('property'); },
    'mode,direction,placement,variant,size,block,scrollable,wrap,disabled,readonly,panelWidth,maxHeight,offset,zIndex,duration,easing,reduceMotion,colorScheme': function observePresentation() { this.syncPresentation(); },
    'showGroup,showSeparator,customContent,loading,error': function observePanel() { this.syncMenu('presentation'); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._path = [];
      this._innerValue = this.data.defaultValue;
      this._innerExpandedValue = this.data.defaultExpandedValue;
      this._innerVisible = Boolean(this.data.defaultVisible);
      this._innerCheckedValues = uniqueValues(this.data.defaultCheckedValues);
      this._innerRadioValues = normalizeRadioValues(this.data.defaultRadioValues);
      this._valueWasControlled = isControlled(this.data, 'value');
      this._expandedWasControlled = isControlled(this.data, 'expandedValue');
      this._visibleWasControlled = isControlled(this.data, 'visible');
      this._checkedWasControlled = isControlled(this.data, 'checkedValues');
      this._radioWasControlled = isControlled(this.data, 'radioValues');
      this.syncPresentation();
      this.syncMenu('initial');
      this.syncValueControl(true);
      this.syncExpandedControl(true);
      this.syncCheckedControl(true);
      this.syncRadioControl(true);
      this.syncVisibleControl(true);
    },
    detached: function detached() {
      this._ready = false;
      this.clearTimers();
    },
  },
  methods: {
    motionConfig: function motionConfig() {
      var duration = this.data.reduceMotion ? 1 : Math.round(clamp(this.data.duration, 0, 1000, 500));
      var easing = allowed(this.data.easing, EASINGS, 'standard');
      return { duration: duration, easing: easing === 'standard' ? 'var(--pui-ease-standard)' : easing };
    },
    syncPresentation: function syncPresentation() {
      var mode = allowed(this.data.mode, MODES, 'navigation');
      var direction = allowed(this.data.direction, DIRECTIONS, 'horizontal');
      var placement = allowed(this.data.placement, PLACEMENTS, 'bottom');
      var variant = allowed(this.data.variant, VARIANTS, 'default');
      var size = allowed(this.data.size, SIZES, 'medium');
      var motion = this.motionConfig();
      var panelWidth = Math.round(clamp(this.data.panelWidth, 0, 1200, 0));
      var maxHeight = Math.round(clamp(this.data.maxHeight, 240, 960, 560));
      var offset = Math.round(clamp(this.data.offset, 0, 96, 12));
      var zIndex = Math.round(clamp(this.data.zIndex, 1, 12000, 1000));
      this.setData({
        normalizedMode: mode,
        normalizedDirection: direction,
        normalizedPlacement: placement,
        normalizedVariant: variant,
        normalizedSize: size,
        rootClass: [
          'pui-navigation-menu',
          this.getColorSchemeClass(),
          'pui-navigation-menu--' + mode,
          'pui-navigation-menu--' + direction,
          'pui-navigation-menu--' + placement,
          'pui-navigation-menu--' + variant,
          'pui-navigation-menu--' + size,
          this.data.block ? 'pui-navigation-menu--block' : '',
          this.data.scrollable ? 'pui-navigation-menu--scrollable' : 'pui-navigation-menu--fixed',
          this.data.wrap ? 'pui-navigation-menu--wrap' : '',
          this.data.disabled ? 'pui-navigation-menu--disabled' : '',
          this.data.readonly ? 'pui-navigation-menu--readonly' : '',
          this.data.reduceMotion ? 'pui-navigation-menu--reduced' : '',
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-navigation-menu-duration:' + motion.duration + 'ms;--pui-navigation-menu-ease:' + motion.easing + ';--pui-navigation-menu-panel-width:' + (panelWidth ? panelWidth + 'rpx' : '100%') + ';--pui-navigation-menu-max-height:' + maxHeight + 'rpx;--pui-navigation-menu-offset:' + offset + 'rpx;z-index:' + zIndex + ';',
      });
    },
    currentValueOf: function currentValueOf() { return isControlled(this.data, 'value') ? this.data.value : this._innerValue; },
    currentExpandedOf: function currentExpandedOf() { return isControlled(this.data, 'expandedValue') ? this.data.expandedValue : this._innerExpandedValue; },
    currentVisibleOf: function currentVisibleOf() { return isControlled(this.data, 'visible') ? Boolean(this.data.visible) : Boolean(this._innerVisible); },
    currentCheckedOf: function currentCheckedOf() { return isControlled(this.data, 'checkedValues') ? uniqueValues(this.data.checkedValues) : uniqueValues(this._innerCheckedValues); },
    currentRadioOf: function currentRadioOf() { return isControlled(this.data, 'radioValues') ? normalizeRadioValues(this.data.radioValues) : normalizeRadioValues(this._innerRadioValues); },
    syncValueControl: function syncValueControl(initial) {
      if (!this._ready) return;
      var controlled = isControlled(this.data, 'value');
      if (!controlled && this._valueWasControlled) this._innerValue = this.data.defaultValue;
      this._valueWasControlled = controlled;
      var current = this.currentValueOf();
      if (initial || !sameValue(this.data.currentValue, current)) this.setData({ currentValue: current }, this.syncMenu.bind(this, 'value'));
    },
    syncExpandedControl: function syncExpandedControl(initial) {
      if (!this._ready) return;
      var controlled = isControlled(this.data, 'expandedValue');
      if (!controlled && this._expandedWasControlled) this._innerExpandedValue = this.data.defaultExpandedValue;
      this._expandedWasControlled = controlled;
      var current = this.currentExpandedOf();
      if (initial || !sameValue(this.data.currentExpandedValue, current)) {
        this._path = [];
        this.setData({ currentExpandedValue: current, outgoingGroups: [], contentActive: true }, this.syncMenu.bind(this, 'expanded'));
      }
    },
    syncVisibleControl: function syncVisibleControl(initial) {
      if (!this._ready) return;
      var controlled = isControlled(this.data, 'visible');
      if (!controlled && this._visibleWasControlled) this._innerVisible = Boolean(this.data.defaultVisible);
      this._visibleWasControlled = controlled;
      this.applyVisibility(this.currentVisibleOf(), initial ? 'initial' : 'property', initial);
    },
    syncCheckedControl: function syncCheckedControl(initial) {
      if (!this._ready) return;
      var controlled = isControlled(this.data, 'checkedValues');
      if (!controlled && this._checkedWasControlled) this._innerCheckedValues = uniqueValues(this.data.defaultCheckedValues);
      this._checkedWasControlled = controlled;
      var current = this.currentCheckedOf();
      if (initial || valueKey(this.data.currentCheckedValues) !== valueKey(current)) this.setData({ currentCheckedValues: current }, this.syncMenu.bind(this, 'checked'));
    },
    syncRadioControl: function syncRadioControl(initial) {
      if (!this._ready) return;
      var controlled = isControlled(this.data, 'radioValues');
      if (!controlled && this._radioWasControlled) this._innerRadioValues = normalizeRadioValues(this.data.defaultRadioValues);
      this._radioWasControlled = controlled;
      var current = this.currentRadioOf();
      if (initial || valueKey(this.data.currentRadioValues) !== valueKey(current)) this.setData({ currentRadioValues: current }, this.syncMenu.bind(this, 'radio'));
    },
    syncMenu: function syncMenu() {
      if (!this._ready) return;
      var roots = normalizeRootItems(this.data.items, this.data);
      var selectedKey = valueKey(this.currentValueOf());
      var expanded = findRootByValue(roots, this.currentExpandedOf());
      if ((!expanded || !expanded.groups.length) && roots.length) expanded = roots.find(function findExpandable(root) { return root.groups.length && !root.disabled; }) || null;
      if (expanded && !isControlled(this.data, 'expandedValue') && !sameValue(this._innerExpandedValue, expanded.value)) this._innerExpandedValue = expanded.value;
      var decoratedRoots = roots.map(function mapRoot(root, index) {
        var descendantSelected = root.descendants.some(function findSelected(item) { return item.typedKey === selectedKey; });
        return Object.assign({}, root, {
          index: index,
          selected: root.typedKey === selectedKey || descendantSelected,
          expanded: Boolean(expanded && root.typedKey === expanded.typedKey && this.currentVisibleOf()),
          hasChildren: Boolean(root.groups.length),
        });
      }, this);
      var rootGroups = expanded ? expanded.groups : [];
      var level = levelForPath(rootGroups, this._path || []);
      this._path = level.validPath;
      var parents = level.parents;
      var currentParent = parents.length ? parents[parents.length - 1] : null;
      var groups = decorateGroups(level.groups, this.currentCheckedOf(), this.currentRadioOf(), this.data);
      var stateType = this.data.error ? 'error' : (this.data.loading ? 'loading' : (this.data.customContent || countItems(groups) ? 'content' : 'empty'));
      this.setData({
        rootItems: decoratedRoots,
        currentRoot: expanded,
        currentExpandedValue: expanded ? expanded.value : this.currentExpandedOf(),
        currentGroups: groups,
        currentTitle: currentParent ? currentParent.label : (expanded ? expanded.label : ''),
        currentDescription: currentParent && currentParent.description ? currentParent.description : (expanded ? expanded.description : ''),
        currentDepth: this._path.length,
        canBack: this._path.length > 0,
        stateType: stateType,
      });
    },
    applyVisibility: function applyVisibility(visible, source, initial) {
      var next = Boolean(visible);
      var self = this;
      var duration = this.motionConfig().duration;
      clearTimeout(this._enterTimer);
      clearTimeout(this._panelTimer);
      clearTimeout(this._afterTimer);
      if (initial && !next) {
        this.setData({ currentVisible: false, panelRendered: false, panelEntered: false });
        return false;
      }
      if (next) {
        if (this.data.currentVisible && this.data.panelEntered) return false;
        this.setData({ currentVisible: true, panelRendered: true, panelEntered: false }, function mountPanel() {
          self._enterTimer = setTimeout(function enterPanel() {
            if (!self._ready || !self.currentVisibleOf()) return;
            self.setData({ panelEntered: true });
            self._afterTimer = setTimeout(function afterOpen() {
              if (self._ready && self.data.panelEntered) self.triggerEvent('after-open', { visible: true, expandedValue: self.currentExpandedOf(), source: source || 'property' });
            }, duration);
          }, 16);
        });
        return true;
      }
      if (!this.data.panelRendered) {
        this.setData({ currentVisible: false, panelEntered: false });
        return false;
      }
      this.setData({ currentVisible: false, panelEntered: false });
      this._panelTimer = setTimeout(function unmountPanel() {
        if (!self._ready || self.currentVisibleOf()) return;
        var path = (self._path || []).slice();
        if (self.data.resetSubmenuOnClose) self._path = [];
        self.setData({ panelRendered: false, outgoingGroups: [], contentActive: true }, function syncAfterClose() {
          if (self.data.resetSubmenuOnClose && path.length) self.syncMenu('after-close');
        });
        self.triggerEvent('after-close', { visible: false, expandedValue: self.currentExpandedOf(), path: path, source: source || 'property' });
      }, duration);
      return true;
    },
    requestVisibility: function requestVisibility(visible, source) {
      if (this.data.disabled) return false;
      var next = Boolean(visible);
      var previous = this.currentVisibleOf();
      if (next === previous) return false;
      var controlled = isControlled(this.data, 'visible');
      var detail = { visible: next, previousVisible: previous, expandedValue: this.currentExpandedOf(), source: source || 'programmatic', controlled: controlled };
      this.triggerEvent('visible-input', detail);
      this.triggerEvent('visible-change', detail);
      this.triggerEvent(next ? 'open' : 'close', detail);
      if (!controlled) {
        this._innerVisible = next;
        this.applyVisibility(next, source || 'programmatic', false);
        this.syncMenu('visibility');
      }
      return detail;
    },
    requestExpanded: function requestExpanded(item, source) {
      if (!item || !item.groups || !item.groups.length || item.disabled || item.loading || this.data.disabled || this.data.readonly) return false;
      var previous = this.currentExpandedOf();
      var changed = !sameValue(previous, item.value);
      var controlled = isControlled(this.data, 'expandedValue');
      var detail = { expandedValue: item.value, previousExpandedValue: previous, item: publicItem(item), source: source || 'programmatic', controlled: controlled, changed: changed };
      if (changed) {
        this.triggerEvent('expanded-input', detail);
        this.triggerEvent('expanded-change', detail);
        if (!controlled) {
          this._innerExpandedValue = item.value;
          this._path = [];
          this.setData({ currentExpandedValue: item.value, outgoingGroups: [], contentActive: true }, this.syncMenu.bind(this, 'expanded-request'));
        }
      }
      return detail;
    },
    requestValue: function requestValue(item, source) {
      if (!item || item.disabled || item.loading || this.data.disabled || this.data.readonly || this.data.error || this.data.loading) return false;
      var previous = this.currentValueOf();
      var changed = !sameValue(previous, item.value);
      var controlled = isControlled(this.data, 'value');
      var detail = { value: item.value, previousValue: previous, item: publicItem(item), source: source || 'select', controlled: controlled, changed: changed };
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent('select', detail);
      if (!controlled) {
        this._innerValue = item.value;
        this.setData({ currentValue: item.value }, this.syncMenu.bind(this, 'select'));
      }
      return detail;
    },
    requestChecked: function requestChecked(item, source) {
      var previous = this.currentCheckedOf();
      var key = item.typedKey;
      var next = previous.filter(function filterValue(value) { return valueKey(value) !== key; });
      var checked = next.length === previous.length;
      if (checked) next.push(item.value);
      next = uniqueValues(next);
      var controlled = isControlled(this.data, 'checkedValues');
      var detail = { checkedValues: next, previousCheckedValues: previous, value: item.value, checked: checked, item: publicItem(item), source: source || 'check', controlled: controlled };
      this.triggerEvent('checked-input', detail);
      this.triggerEvent('checked-change', detail);
      if (!controlled) {
        this._innerCheckedValues = next;
        this.setData({ currentCheckedValues: next }, this.syncMenu.bind(this, 'checked-request'));
      }
      return detail;
    },
    requestRadio: function requestRadio(item, source) {
      var previous = this.currentRadioOf();
      var group = item.radioGroup || 'default';
      if (hasOwn(previous, group) && sameValue(previous[group], item.value)) return { changed: false, radioValues: previous };
      var next = normalizeRadioValues(previous);
      next[group] = item.value;
      var controlled = isControlled(this.data, 'radioValues');
      var detail = { radioValues: next, previousRadioValues: previous, group: group, value: item.value, item: publicItem(item), source: source || 'radio', controlled: controlled, changed: true };
      this.triggerEvent('radio-input', detail);
      this.triggerEvent('radio-change', detail);
      if (!controlled) {
        this._innerRadioValues = next;
        this.setData({ currentRadioValues: next }, this.syncMenu.bind(this, 'radio-request'));
      }
      return detail;
    },
    transitionToPath: function transitionToPath(nextPath, direction, source, item) {
      var root = findRootByValue(this.data.rootItems, this.currentExpandedOf()) || this.data.currentRoot;
      var level = levelForPath(root ? root.groups : [], nextPath);
      if (level.validPath.length !== nextPath.length) return false;
      var oldGroups = this.data.currentGroups || [];
      this._path = nextPath.slice();
      var parent = level.parents.length ? level.parents[level.parents.length - 1] : null;
      var nextGroups = decorateGroups(level.groups, this.currentCheckedOf(), this.currentRadioOf(), this.data);
      var self = this;
      clearTimeout(this._contentTimer);
      this.setData({
        outgoingGroups: oldGroups,
        currentGroups: nextGroups,
        currentTitle: parent ? parent.label : (root ? root.label : ''),
        currentDescription: parent && parent.description ? parent.description : (root ? root.description : ''),
        currentDepth: this._path.length,
        canBack: this._path.length > 0,
        contentDirection: direction,
        contentActive: false,
        stateType: this.data.customContent || countItems(nextGroups) ? 'content' : 'empty',
      }, function beginTransition() {
        nextTick(function activateContent() {
          if (!self._ready) return;
          self.setData({ contentActive: true });
          self._contentTimer = setTimeout(function clearOutgoing() {
            self._contentTimer = null;
            if (self._ready) self.setData({ outgoingGroups: [] });
          }, self.motionConfig().duration);
        });
      });
      var detail = { depth: this._path.length, path: this._path.slice(), item: publicItem(item), source: source || 'submenu' };
      this.triggerEvent(direction === 'back' ? 'submenu-close' : 'submenu-open', detail);
      return true;
    },
    openSubmenuItem: function openSubmenuItem(item, source) {
      if (!item || item.type !== 'submenu' || !item.children.length || item.disabled || item.loading || this.data.disabled || this.data.readonly) return false;
      return this.transitionToPath(item.path, 'forward', source || 'submenu', item);
    },
    back: function back(source) {
      if (!this._path || !this._path.length || this.data.disabled) return false;
      var root = findRootByValue(this.data.rootItems, this.currentExpandedOf()) || this.data.currentRoot;
      var closingKey = this._path[this._path.length - 1];
      var item = findByInternalKey(root ? root.groups : [], closingKey);
      return this.transitionToPath(this._path.slice(0, -1), 'back', sourceOf(source, 'back'), item);
    },
    requestNavigation: function requestNavigation(item, source) {
      if (!item || !item.url && item.openType !== 'navigateBack') return false;
      var detail = { value: item.value, item: publicItem(item), url: item.url, openType: item.openType, delta: item.delta || 1, source: source || 'select', auto: Boolean(this.data.autoNavigate), started: false };
      this.triggerEvent('navigate', detail);
      if (!this.data.autoNavigate) return detail;
      var api = typeof wx !== 'undefined' ? wx[item.openType] : null;
      if (typeof api !== 'function') {
        var unsupported = Object.assign({}, detail, { error: { errMsg: item.openType + ':fail unsupported' } });
        this.triggerEvent('navigate-error', unsupported);
        return unsupported;
      }
      var self = this;
      var options = item.openType === 'navigateBack' ? { delta: item.delta || 1 } : { url: item.url };
      detail.started = true;
      options.success = function success(result) { self.triggerEvent('navigate-success', Object.assign({}, detail, { result: result || {} })); };
      options.fail = function fail(error) { self.triggerEvent('navigate-error', Object.assign({}, detail, { error: error || {} })); };
      api(options);
      return detail;
    },
    executeItem: function executeItem(item, source) {
      if (!item || item.disabled || item.loading || this.data.disabled || this.data.readonly || this.data.error || this.data.loading || item.type === 'separator') return false;
      var clickDetail = { value: item.value, type: item.type, item: publicItem(item), depth: (this._path || []).length, path: (this._path || []).slice(), source: source || 'select' };
      this.triggerEvent('item-click', clickDetail);
      if (item.type === 'submenu') return this.openSubmenuItem(item, source || 'select');
      var result;
      if (item.type === 'checkbox') result = this.requestChecked(item, source);
      else if (item.type === 'radio') result = this.requestRadio(item, source);
      else result = this.requestValue(item, source);
      if (item.type === 'link' || item.url) this.requestNavigation(item, source);
      var shouldClose = item.close === null || item.close === undefined ? (item.type === 'checkbox' || item.type === 'radio' ? this.data.closeOnCheck : this.data.closeOnSelect) : item.close;
      if (shouldClose) this.requestVisibility(false, item.type === 'checkbox' || item.type === 'radio' ? 'check' : 'select');
      return result || true;
    },
    open: function open(value, source) {
      if (this.data.disabled || this.data.readonly) return false;
      var root = value !== undefined && value !== null ? findRootByValue(this.data.rootItems, value) : (findRootByValue(this.data.rootItems, this.currentExpandedOf()) || this.data.currentRoot);
      if (!root || !root.groups.length) return false;
      var expanded = this.requestExpanded(root, sourceOf(source, 'programmatic'));
      if (!expanded) return false;
      return this.requestVisibility(true, sourceOf(source, 'programmatic')) || expanded;
    },
    close: function close(source) { return this.requestVisibility(false, sourceOf(source, 'programmatic')); },
    toggle: function toggle(value, source) {
      var root = value !== undefined && value !== null ? findRootByValue(this.data.rootItems, value) : (findRootByValue(this.data.rootItems, this.currentExpandedOf()) || this.data.currentRoot);
      if (!root || !root.groups.length) return false;
      if (this.currentVisibleOf() && sameValue(root.value, this.currentExpandedOf())) return this.close(sourceOf(source, 'programmatic'));
      return this.open(root.value, sourceOf(source, 'programmatic'));
    },
    select: function select(value, source) { return this.executeItem(findItemByValue(this.data.rootItems, value), sourceOf(source, 'programmatic')); },
    openSubmenu: function openSubmenu(value, source) { return this.openSubmenuItem(findItemByValue(this.data.rootItems, value), sourceOf(source, 'programmatic')); },
    reset: function reset(source) {
      if (this.data.disabled || this.data.readonly) return false;
      var origin = sourceOf(source, 'reset');
      var nextValue = this.data.defaultValue;
      var nextExpanded = this.data.defaultExpandedValue;
      var nextChecked = uniqueValues(this.data.defaultCheckedValues);
      var nextRadio = normalizeRadioValues(this.data.defaultRadioValues);
      var valueControlled = isControlled(this.data, 'value');
      var expandedControlled = isControlled(this.data, 'expandedValue');
      var checkedControlled = isControlled(this.data, 'checkedValues');
      var radioControlled = isControlled(this.data, 'radioValues');
      this.triggerEvent('input', { value: nextValue, previousValue: this.currentValueOf(), source: origin, controlled: valueControlled, reset: true });
      this.triggerEvent('change', { value: nextValue, previousValue: this.currentValueOf(), source: origin, controlled: valueControlled, reset: true });
      this.triggerEvent('expanded-input', { expandedValue: nextExpanded, previousExpandedValue: this.currentExpandedOf(), source: origin, controlled: expandedControlled, reset: true });
      this.triggerEvent('expanded-change', { expandedValue: nextExpanded, previousExpandedValue: this.currentExpandedOf(), source: origin, controlled: expandedControlled, reset: true });
      this.triggerEvent('checked-input', { checkedValues: nextChecked, previousCheckedValues: this.currentCheckedOf(), source: origin, controlled: checkedControlled, reset: true });
      this.triggerEvent('checked-change', { checkedValues: nextChecked, previousCheckedValues: this.currentCheckedOf(), source: origin, controlled: checkedControlled, reset: true });
      this.triggerEvent('radio-input', { radioValues: nextRadio, previousRadioValues: this.currentRadioOf(), source: origin, controlled: radioControlled, reset: true });
      this.triggerEvent('radio-change', { radioValues: nextRadio, previousRadioValues: this.currentRadioOf(), source: origin, controlled: radioControlled, reset: true });
      if (!valueControlled) this._innerValue = nextValue;
      if (!expandedControlled) this._innerExpandedValue = nextExpanded;
      if (!checkedControlled) this._innerCheckedValues = nextChecked;
      if (!radioControlled) this._innerRadioValues = nextRadio;
      this._path = [];
      this.setData({ currentValue: this.currentValueOf(), currentExpandedValue: this.currentExpandedOf(), currentCheckedValues: this.currentCheckedOf(), currentRadioValues: this.currentRadioOf(), outgoingGroups: [], contentActive: true }, this.syncMenu.bind(this, 'reset'));
      this.triggerEvent('reset', { value: nextValue, expandedValue: nextExpanded, checkedValues: nextChecked, radioValues: nextRadio, source: origin });
      return true;
    },
    retry: function retry(source) {
      if (!this.data.error || this.data.disabled) return false;
      this.triggerEvent('retry', { expandedValue: this.currentExpandedOf(), path: (this._path || []).slice(), source: sourceOf(source, 'programmatic') });
      return true;
    },
    getValue: function getValue() { return this.currentValueOf(); },
    getState: function getState() {
      return { value: this.currentValueOf(), expandedValue: this.currentExpandedOf(), visible: this.currentVisibleOf(), checkedValues: this.currentCheckedOf(), radioValues: this.currentRadioOf(), path: (this._path || []).slice(), depth: (this._path || []).length, stateType: this.data.stateType };
    },
    onRootTap: function onRootTap(event) {
      var index = Number(event.currentTarget.dataset.index);
      var item = this.data.rootItems[index];
      if (!item || item.disabled || item.loading || this.data.disabled || this.data.readonly) return;
      var detail = { value: item.value, item: publicItem(item), expanded: item.expanded, hasChildren: item.hasChildren, source: 'tap' };
      this.triggerEvent('click', detail);
      if (item.hasChildren) {
        this.triggerEvent('item-click', Object.assign({}, detail, { type: item.type, depth: 0, path: [] }));
        this.toggle(item.value, 'tap');
      }
      else this.executeItem(item, 'tap');
    },
    onItemTap: function onItemTap(event) {
      var groupIndex = Number(event.currentTarget.dataset.groupIndex);
      var itemIndex = Number(event.currentTarget.dataset.itemIndex);
      var group = this.data.currentGroups[groupIndex];
      var item = group && group.items ? group.items[itemIndex] : null;
      this.executeItem(item, 'tap');
    },
    onOverlayTap: function onOverlayTap() {
      var willClose = Boolean(this.data.closeOnOverlayClick && !this.data.disabled);
      this.triggerEvent('overlay-click', { source: 'overlay', close: willClose, expandedValue: this.currentExpandedOf() });
      if (willClose) this.requestVisibility(false, 'overlay');
    },
    onCloseTap: function onCloseTap() { this.close('button'); },
    onBackTap: function onBackTap() { this.back('button'); },
    onRetryTap: function onRetryTap() { this.retry('button'); },
    onRootScroll: function onRootScroll(event) { this.triggerEvent('scroll', Object.assign({}, event.detail || {}, { source: 'triggers' })); },
    onPanelScroll: function onPanelScroll(event) { this.triggerEvent('scroll', Object.assign({}, event.detail || {}, { source: 'panel', path: (this._path || []).slice() })); },
    clearTimers: function clearTimers() {
      clearTimeout(this._enterTimer);
      clearTimeout(this._panelTimer);
      clearTimeout(this._afterTimer);
      clearTimeout(this._contentTimer);
      this._enterTimer = null;
      this._panelTimer = null;
      this._afterTimer = null;
      this._contentTimer = null;
    },
    noop: function noop() {},
  },
});
