var themeBehavior = require('../common/behaviors/theme');

var ALIGNS = ['left', 'center', 'right'];
var FIXED_VALUES = ['left', 'right'];
var CELL_TYPES = ['text', 'tag', 'icon'];
var TAG_THEMES = ['default', 'primary', 'success', 'warning', 'danger'];

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function toText(value, fallback) {
  if (value === null || value === undefined) return fallback === undefined ? '' : fallback;
  if (typeof value === 'object') {
    try { return JSON.stringify(value); } catch (error) { return String(value); }
  }
  return String(value);
}

function typedKey(value) {
  if (value === null) return 'null:null';
  if (value === undefined) return 'undefined:undefined';
  if (typeof value === 'object') {
    try { return 'object:' + JSON.stringify(value); } catch (error) { return 'object:' + String(value); }
  }
  return typeof value + ':' + String(value);
}

function valueAt(source, path) {
  if (!source || typeof source !== 'object') return undefined;
  var parts = String(path === null || path === undefined ? '' : path).split('.').filter(Boolean);
  var current = source;
  for (var index = 0; index < parts.length; index += 1) {
    if (current === null || current === undefined) return undefined;
    current = current[parts[index]];
  }
  return current;
}

function normalizeFixed(value) {
  if (value === true) return 'left';
  return FIXED_VALUES.indexOf(value) > -1 ? value : '';
}

function normalizeColumns(columns, options) {
  var source = Array.isArray(columns) ? columns : [];
  var leftOffset = options.selectable ? options.selectionWidth : 0;
  var normalized = source.map(function mapColumn(entry, index) {
    var column = entry && typeof entry === 'object' ? entry : { key: String(index), title: entry };
    var key = column.key !== undefined ? column.key : column.dataIndex !== undefined ? column.dataIndex : String(index);
    var width = Math.round(clamp(column.width, 96, 640, index === 0 ? 220 : 160));
    var fixed = normalizeFixed(column.fixed);
    var sortable = column.sortable === true || (options.sortable && column.sortable !== false);
    var type = CELL_TYPES.indexOf(column.type) > -1 ? column.type : 'text';
    var item = {
      id: typedKey(key) + '-' + index,
      key: key,
      path: String(key),
      title: toText(column.title !== undefined ? column.title : column.label, '列 ' + (index + 1)),
      width: width,
      align: ALIGNS.indexOf(column.align) > -1 ? column.align : 'left',
      fixed: fixed,
      fixedStyle: '',
      fixedEdge: '',
      sortable: sortable,
      sortOrder: '',
      type: type,
      ellipsis: column.ellipsis !== false,
      valueMap: column.valueMap && typeof column.valueMap === 'object' ? column.valueMap : {},
      themeMap: column.themeMap && typeof column.themeMap === 'object' ? column.themeMap : {},
      theme: TAG_THEMES.indexOf(column.theme) > -1 ? column.theme : 'default',
      headerIcon: toText(column.headerIcon),
      style: 'width:' + width + 'rpx;min-width:' + width + 'rpx;max-width:' + width + 'rpx;',
    };
    if (fixed === 'left') {
      item.fixedStyle = 'left:' + leftOffset + 'rpx;';
      leftOffset += width;
    }
    return item;
  });

  var rightOffset = 0;
  for (var reverseIndex = normalized.length - 1; reverseIndex >= 0; reverseIndex -= 1) {
    if (normalized[reverseIndex].fixed === 'right') {
      normalized[reverseIndex].fixedStyle = 'right:' + rightOffset + 'rpx;';
      rightOffset += normalized[reverseIndex].width;
    }
  }
  var leftIndexes = normalized.map(function map(item, index) { return item.fixed === 'left' ? index : -1; }).filter(function filter(index) { return index >= 0; });
  var rightIndexes = normalized.map(function map(item, index) { return item.fixed === 'right' ? index : -1; }).filter(function filter(index) { return index >= 0; });
  if (leftIndexes.length) normalized[leftIndexes[leftIndexes.length - 1]].fixedEdge = 'left';
  if (rightIndexes.length) normalized[rightIndexes[0]].fixedEdge = 'right';
  return normalized;
}

function normalizeRows(data, columns, rowKey, emptyValue) {
  var source = Array.isArray(data) ? data : [];
  return source.map(function mapRow(raw, index) {
    var objectRow = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    var key = valueAt(objectRow, rowKey);
    if (key === undefined) key = index;
    var cells = columns.map(function mapCell(column, cellIndex) {
      var value = valueAt(objectRow, column.path);
      if ((!raw || typeof raw !== 'object') && cellIndex === 0) value = raw;
      var mapped = Object.prototype.hasOwnProperty.call(column.valueMap, String(value)) ? column.valueMap[String(value)] : value;
      var text = mapped === null || mapped === undefined || mapped === '' ? emptyValue : toText(mapped);
      var mappedTheme = column.themeMap[String(value)];
      var tagTheme = TAG_THEMES.indexOf(mappedTheme) > -1 ? mappedTheme : column.theme;
      return {
        id: column.id + '-cell-' + index,
        columnKey: column.key,
        value: value,
        text: text,
        icon: column.type === 'icon' ? toText(value) : '',
        type: column.type,
        tagTheme: tagTheme,
        align: column.align,
        fixed: column.fixed,
        fixedEdge: column.fixedEdge,
        ellipsis: column.ellipsis,
        style: column.style + column.fixedStyle,
      };
    });
    return {
      id: typedKey(key) + '-row-' + index,
      key: key,
      keyId: typedKey(key),
      raw: raw,
      index: index,
      disabled: Boolean(objectRow.disabled),
      cells: cells,
      selected: false,
    };
  });
}

function normalizeSelection(values, rows) {
  var source = Array.isArray(values) ? values : [];
  var available = {};
  rows.forEach(function each(row) { available[row.keyId] = row.key; });
  var seen = {};
  var result = [];
  source.forEach(function each(value) {
    var identity = typedKey(value);
    if (!seen[identity] && Object.prototype.hasOwnProperty.call(available, identity)) {
      seen[identity] = true;
      result.push(available[identity]);
    }
  });
  return result;
}

function selectionHas(values, key) {
  var identity = typedKey(key);
  return values.some(function some(value) { return typedKey(value) === identity; });
}

function normalizeOrder(value) {
  if (value === 'ascending') return 'asc';
  if (value === 'descending') return 'desc';
  return value === 'asc' || value === 'desc' ? value : '';
}

function normalizeSort(value, columns) {
  var source = value && typeof value === 'object' ? value : {};
  var key = source.key !== undefined ? source.key : source.columnKey;
  var order = normalizeOrder(source.order);
  var column = columns.find(function find(item) { return typedKey(item.key) === typedKey(key) && item.sortable; });
  return column && order ? { key: column.key, order: order } : { key: '', order: '' };
}

function comparable(value) {
  if (typeof value === 'number' && isFinite(value)) return { type: 'number', value: value };
  var number = Number(value);
  if (value !== '' && value !== null && value !== undefined && isFinite(number)) return { type: 'number', value: number };
  return { type: 'text', value: toText(value).toLocaleLowerCase() };
}

function sortRows(rows, sort) {
  if (!sort.order) return rows.slice();
  return rows.slice().sort(function compare(left, right) {
    var leftCell = left.cells.find(function find(cell) { return typedKey(cell.columnKey) === typedKey(sort.key); });
    var rightCell = right.cells.find(function find(cell) { return typedKey(cell.columnKey) === typedKey(sort.key); });
    var leftValue = comparable(leftCell ? leftCell.value : undefined);
    var rightValue = comparable(rightCell ? rightCell.value : undefined);
    var result = 0;
    if (leftValue.type === 'number' && rightValue.type === 'number') result = leftValue.value - rightValue.value;
    else result = String(leftValue.value).localeCompare(String(rightValue.value));
    return (sort.order === 'desc' ? -result : result) || left.index - right.index;
  });
}

function signature(value) {
  try { return JSON.stringify(value); } catch (error) { return String(value); }
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },

  properties: {
    columns: { type: Array, value: [] },
    data: { type: Array, value: [] },
    rowKey: { type: String, value: 'id' },
    bordered: { type: Boolean, value: true },
    stripe: { type: Boolean, value: false },
    height: { type: Number, value: 0 },
    showHeader: { type: Boolean, value: true },
    emptyValue: { type: String, value: '—' },
    selectable: { type: Boolean, value: false },
    selectedRowKeys: { type: null, value: null },
    defaultSelectedRowKeys: { type: Array, value: [] },
    multiple: { type: Boolean, value: true },
    selectOnRowClick: { type: Boolean, value: false },
    sortable: { type: Boolean, value: false },
    sort: { type: null, value: null },
    defaultSort: { type: Object, value: {} },
    customEmpty: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '表格加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '表格加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无数据' },
    ariaLabel: { type: String, value: '数据表格' },
    reduceMotion: { type: Boolean, value: false },
  },

  data: {
    normalizedColumns: [],
    rows: [],
    rootClass: 'pui-table pui-table--empty',
    rootStyle: '',
    tableStyle: '',
    scrollStyle: '',
    stateType: 'empty',
    hasStructure: false,
    scrollY: false,
    scrollLeftValue: 0,
    scrollTopValue: 0,
    selectionCellStyle: '',
    selectionColumnClass: '',
    allSelected: false,
    someSelected: false,
    selectableCount: 0,
    selectedCount: 0,
    currentSort: { key: '', order: '' },
    semanticLabel: '数据表格',
    tableWidth: 0,
  },

  observers: {
    'columns,data,rowKey,bordered,stripe,height,showHeader,emptyValue,selectable,selectedRowKeys,defaultSelectedRowKeys,multiple,selectOnRowClick,sortable,sort,defaultSort,customEmpty,disabled,loading,loadingText,error,errorText,retryText,emptyText,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },

  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._innerSelectedRowKeys = [];
      this._innerSort = { key: '', order: '' };
      this._selectionControlled = undefined;
      this._sortControlled = undefined;
      this.syncState();
    },
    detached: function detached() { this._ready = false; },
  },

  methods: {
    syncState: function syncState() {
      if (!this._ready) return;
      var duration = this.data.reduceMotion ? 1 : 500;
      var selectionWidth = this.data.selectable ? 80 : 0;
      var columns = normalizeColumns(this.data.columns, {
        sortable: this.data.sortable,
        selectable: this.data.selectable,
        selectionWidth: selectionWidth,
      });
      var rows = normalizeRows(this.data.data, columns, this.data.rowKey || 'id', toText(this.data.emptyValue, '—'));

      var defaultSelectionSignature = signature(this.data.defaultSelectedRowKeys);
      if (this._defaultSelectionSignature !== defaultSelectionSignature) {
        this._defaultSelectionSignature = defaultSelectionSignature;
        if (this.data.selectedRowKeys === null || this.data.selectedRowKeys === undefined) this._innerSelectedRowKeys = Array.isArray(this.data.defaultSelectedRowKeys) ? this.data.defaultSelectedRowKeys.slice() : [];
      }
      var controlledSelection = this.data.selectedRowKeys !== null && this.data.selectedRowKeys !== undefined;
      if (this._selectionControlled === true && !controlledSelection) {
        this._innerSelectedRowKeys = Array.isArray(this.data.defaultSelectedRowKeys) ? this.data.defaultSelectedRowKeys.slice() : [];
      }
      this._selectionControlled = controlledSelection;
      var selectedRowKeys = normalizeSelection(controlledSelection ? this.data.selectedRowKeys : this._innerSelectedRowKeys, rows);
      if (!controlledSelection) this._innerSelectedRowKeys = selectedRowKeys.slice();

      var defaultSortSignature = signature(this.data.defaultSort);
      if (this._defaultSortSignature !== defaultSortSignature) {
        this._defaultSortSignature = defaultSortSignature;
        if (this.data.sort === null || this.data.sort === undefined) this._innerSort = this.data.defaultSort || {};
      }
      var controlledSort = this.data.sort !== null && this.data.sort !== undefined;
      if (this._sortControlled === true && !controlledSort) {
        this._innerSort = this.data.defaultSort && typeof this.data.defaultSort === 'object' ? this.data.defaultSort : {};
      }
      this._sortControlled = controlledSort;
      var currentSort = normalizeSort(controlledSort ? this.data.sort : this._innerSort, columns);
      if (!controlledSort) this._innerSort = currentSort;
      columns = columns.map(function map(column) {
        column.sortOrder = typedKey(column.key) === typedKey(currentSort.key) ? currentSort.order : '';
        return column;
      });
      rows = sortRows(rows, currentSort).map(function map(row) {
        row.selected = selectionHas(selectedRowKeys, row.key);
        return row;
      });

      var selectableRows = rows.filter(function filter(row) { return !row.disabled; });
      var selectedSelectableCount = selectableRows.filter(function filter(row) { return row.selected; }).length;
      var allSelected = Boolean(selectableRows.length && selectedSelectableCount === selectableRows.length);
      var someSelected = Boolean(selectedSelectableCount && !allSelected);
      var stateType = this.data.error ? 'error' : this.data.loading ? 'loading' : columns.length && rows.length ? 'content' : 'empty';
      var naturalWidth = columns.reduce(function sum(total, column) { return total + column.width; }, selectionWidth);
      var tableWidth = Math.round(naturalWidth);
      var headerHeight = 68;
      var rowHeight = 82;
      var height = Math.round(clamp(this.data.height, 0, 1600, 0));
      var contentMaxHeight = height || Math.min(12000, headerHeight + Math.max(1, rows.length) * rowHeight + 4);
      var rootClass = [
        'pui-table', this.getColorSchemeClass(), 'pui-table--' + stateType,
        this.data.bordered ? 'pui-table--bordered' : 'pui-table--borderless',
        this.data.stripe ? 'pui-table--stripe' : '',
        this.data.selectable ? 'pui-table--selectable' : '', this.data.disabled ? 'pui-table--disabled' : '',
        this.data.reduceMotion ? 'pui-table--reduced' : '',
      ].filter(Boolean).join(' ');

      this.setData({
        normalizedColumns: columns,
        rows: rows,
        rootClass: rootClass,
        rootStyle: '--pui-table-duration:' + duration + 'ms;--pui-table-content-max-height:' + contentMaxHeight + 'rpx;',
        tableStyle: 'width:' + tableWidth + 'rpx;min-width:100%;',
        scrollStyle: height > 0 ? 'height:' + height + 'rpx;' : '',
        stateType: stateType,
        hasStructure: Boolean(columns.length),
        scrollY: height > 0,
        selectionCellStyle: 'width:' + selectionWidth + 'rpx;min-width:' + selectionWidth + 'rpx;max-width:' + selectionWidth + 'rpx;left:0;',
        selectionColumnClass: '',
        allSelected: allSelected,
        someSelected: someSelected,
        selectableCount: selectableRows.length,
        selectedCount: selectedRowKeys.length,
        currentSort: currentSort,
        semanticLabel: toText(this.data.ariaLabel, '数据表格') || '数据表格',
        tableWidth: tableWidth,
      });
    },

    selectionDetail: function selectionDetail(keys, meta) {
      var rows = this.data.rows;
      return {
        value: keys.slice(),
        selectedRowKeys: keys.slice(),
        selectedRows: rows.filter(function filter(row) { return selectionHas(keys, row.key); }).map(function map(row) { return row.raw; }),
        selected: meta.selected,
        key: meta.key,
        row: meta.row,
        index: meta.index,
        source: meta.source,
      };
    },

    requestSelection: function requestSelection(keys, meta) {
      if (this.data.disabled || !this.data.selectable || this.data.stateType !== 'content') return false;
      var normalized = normalizeSelection(keys, this.data.rows);
      var controlled = this.data.selectedRowKeys !== null && this.data.selectedRowKeys !== undefined;
      if (!controlled) {
        this._innerSelectedRowKeys = normalized.slice();
        this.syncState();
      }
      var detail = this.selectionDetail(normalized, meta);
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      return true;
    },

    toggleRowAt: function toggleRowAt(index, selected, source) {
      var row = this.data.rows[index];
      if (!row || row.disabled || this.data.disabled || !this.data.selectable) return false;
      var current = this.data.rows.filter(function filter(item) { return item.selected; }).map(function map(item) { return item.key; });
      var shouldSelect = selected === undefined ? !row.selected : Boolean(selected);
      var next;
      if (this.data.multiple) {
        next = current.filter(function filter(key) { return typedKey(key) !== row.keyId; });
        if (shouldSelect) next.push(row.key);
      } else next = shouldSelect ? [row.key] : [];
      var meta = { selected: shouldSelect, key: row.key, row: row.raw, index: row.index, source: source };
      return this.requestSelection(next, meta);
    },

    onRowSelectionChange: function onRowSelectionChange(event) {
      return this.toggleRowAt(Math.trunc(Number(event.currentTarget.dataset.index)), Boolean(event.detail && event.detail.value), 'checkbox');
    },

    onSelectionCellTap: function onSelectionCellTap() { return false; },

    onSelectAllChange: function onSelectAllChange(event) {
      return this.selectAll(Boolean(event.detail && event.detail.value), 'checkbox');
    },

    selectAll: function selectAll(selected, source) {
      if (this.data.disabled || !this.data.selectable || !this.data.multiple) return false;
      var shouldSelect = selected === undefined ? true : Boolean(selected);
      var disabledSelected = this.data.rows.filter(function filter(row) { return row.disabled && row.selected; }).map(function map(row) { return row.key; });
      var enabled = shouldSelect ? this.data.rows.filter(function filter(row) { return !row.disabled; }).map(function map(row) { return row.key; }) : [];
      return this.requestSelection(disabledSelected.concat(enabled), { selected: shouldSelect, key: null, row: null, index: -1, source: source || 'method' });
    },

    clearSelection: function clearSelection() {
      return this.requestSelection([], { selected: false, key: null, row: null, index: -1, source: 'method' });
    },

    toggleRow: function toggleRow(key, selected) {
      var index = this.data.rows.findIndex(function find(row) { return row.keyId === typedKey(key); });
      return this.toggleRowAt(index, selected, 'method');
    },

    onRowTap: function onRowTap(event) {
      var index = Math.trunc(Number(event.currentTarget.dataset.index));
      var row = this.data.rows[index];
      if (!row || row.disabled || this.data.disabled || this.data.stateType !== 'content') return false;
      if (this.data.selectOnRowClick && this.data.selectable) this.toggleRowAt(index, undefined, 'row');
      this.triggerEvent('row-click', { row: row.raw, index: row.index, key: row.key, selected: row.selected, source: 'row' });
      return true;
    },

    onCellTap: function onCellTap(event) {
      var row = this.data.rows[Math.trunc(Number(event.currentTarget.dataset.rowIndex))];
      var cellIndex = Math.trunc(Number(event.currentTarget.dataset.cellIndex));
      var cell = row && row.cells[cellIndex];
      var column = this.data.normalizedColumns[cellIndex];
      if (!row || !cell || !column || row.disabled || this.data.disabled || this.data.loading || this.data.stateType !== 'content') return false;
      this.triggerEvent('cell-click', {
        row: row.raw,
        col: column,
        rowIndex: row.index,
        colIndex: cellIndex,
        columnKey: column.key,
        value: cell.value,
        source: 'cell',
      });
      return true;
    },

    requestSort: function requestSort(key, order, source) {
      if (this.data.disabled || this.data.stateType !== 'content') return false;
      var candidate = normalizeSort({ key: key, order: order }, this.data.normalizedColumns);
      if (order && !candidate.order) return false;
      var controlled = this.data.sort !== null && this.data.sort !== undefined;
      if (!controlled) {
        this._innerSort = candidate;
        this.syncState();
      }
      this.triggerEvent('sort-change', { key: candidate.key, order: candidate.order, sort: candidate.order ? candidate : null, source: source });
      return true;
    },

    onHeaderTap: function onHeaderTap(event) {
      var column = this.data.normalizedColumns[Math.trunc(Number(event.currentTarget.dataset.index))];
      if (!column || !column.sortable) return false;
      var current = typedKey(this.data.currentSort.key) === typedKey(column.key) ? this.data.currentSort.order : '';
      var next = current === 'asc' ? 'desc' : current === 'desc' ? '' : 'asc';
      return this.requestSort(column.key, next, 'header');
    },

    sortBy: function sortBy(key, order) { return this.requestSort(key, normalizeOrder(order) || 'asc', 'method'); },
    clearSort: function clearSort() {
      var currentKey = this.data.currentSort.key;
      if (!this.data.currentSort.order) return false;
      return this.requestSort(currentKey, '', 'method');
    },

    onScroll: function onScroll(event) {
      var detail = event.detail || {};
      this.triggerEvent('scroll', {
        scrollLeft: Number(detail.scrollLeft) || 0,
        scrollTop: Number(detail.scrollTop) || 0,
        scrollWidth: Number(detail.scrollWidth) || this.data.tableWidth,
        scrollHeight: Number(detail.scrollHeight) || 0,
        deltaX: Number(detail.deltaX) || 0,
        deltaY: Number(detail.deltaY) || 0,
        source: 'scroll',
      });
    },

    scrollTo: function scrollTo(options) {
      var source = options && typeof options === 'object' ? options : {};
      var left = Math.round(clamp(source.left, 0, Math.max(0, this.data.tableWidth), 0));
      var top = Math.round(clamp(source.top, 0, 100000, 0));
      var self = this;
      var nudgeLeft = left > 0 ? Math.max(0, left - 1) : 1;
      var nudgeTop = top > 0 ? Math.max(0, top - 1) : 1;
      this.setData({ scrollLeftValue: nudgeLeft, scrollTopValue: nudgeTop }, function applyScrollTarget() {
        if (self._ready) self.setData({ scrollLeftValue: left, scrollTopValue: top });
      });
      return { left: left, top: top };
    },
    retry: function retry(source) {
      if (!this.data.error || this.data.disabled) return false;
      this.triggerEvent('retry', { source: source || 'method', rowCount: this.data.rows.length });
      return true;
    },
    onRetry: function onRetry() { return this.retry('button'); },
    getSelection: function getSelection() { return this.data.rows.filter(function filter(row) { return row.selected; }).map(function map(row) { return row.key; }); },
    getSort: function getSort() { return this.data.currentSort.order ? { key: this.data.currentSort.key, order: this.data.currentSort.order } : null; },
  },
});
