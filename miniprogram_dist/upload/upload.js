var themeBehavior = require('../common/behaviors/theme');

var DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
var STATUS_META = {
  ready: { text: '待上传', theme: 'default', icon: 'clock' },
  uploading: { text: '上传中', theme: 'primary', icon: 'upload' },
  success: { text: '已完成', theme: 'success', icon: 'check-circle' },
  error: { text: '上传失败', theme: 'danger', icon: 'error-circle' },
  paused: { text: '已暂停', theme: 'warning', icon: 'pause' }
};

function finiteNumber(value, fallback) {
  return typeof value === 'number' && isFinite(value) ? value : fallback;
}

function maxFiles(value) {
  return Math.round(Math.max(1, Math.min(9, finiteNumber(value, 9))));
}

function gridColumns(value) {
  return Math.round(Math.max(2, Math.min(4, finiteNumber(value, 3))));
}

function maxFileSize(value) {
  return Math.round(Math.max(0, Math.min(2147483648, finiteNumber(value, 0))));
}

function mediaTypes(value) {
  var types = Array.isArray(value) ? value.filter(function filter(type, index, list) {
    return (type === 'image' || type === 'video') && list.indexOf(type) === index;
  }) : [];
  return types.length ? types : ['image'];
}

function sourceTypes(value) {
  return value === 'camera' || value === 'album' ? [value] : ['album', 'camera'];
}

function pickerMode(value) {
  return value === 'message' ? 'message' : 'media';
}

function messageFileType(value) {
  return ['all', 'video', 'image', 'file'].indexOf(value) > -1 ? value : 'all';
}

function displayTheme(value) {
  return value === 'grid' ? 'grid' : 'list';
}

function extensionList(value) {
  if (!Array.isArray(value)) return [];
  return value.reduce(function reduce(result, item) {
    var extension = String(item || '').trim().toLowerCase().replace(/^\./, '');
    if (extension && /^[a-z0-9]+$/.test(extension) && result.indexOf(extension) < 0) result.push(extension);
    return result;
  }, []);
}

function fileExtension(path) {
  var match = String(path || '').toLowerCase().match(/\.([a-z0-9]+)(?:[?#].*)?$/);
  return match ? match[1] : '';
}

function fileType(file, path) {
  var type = String(file.fileType || file.type || '').toLowerCase();
  var mime = String(file.mimeType || '').toLowerCase();
  var extension = fileExtension(file.name || path);
  if (type.indexOf('/') > -1) type = type.split('/')[0];
  if (type === 'image' || type === 'video' || type === 'file') return type;
  if (mime.indexOf('image/') === 0) return 'image';
  if (mime.indexOf('video/') === 0) return 'video';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'heic'].indexOf(extension) > -1) return 'image';
  if (['mp4', 'mov', 'm4v', 'webm'].indexOf(extension) > -1) return 'video';
  return 'file';
}

function fileStatus(value) {
  return STATUS_META[value] ? value : 'ready';
}

function sizeText(size) {
  var bytes = Math.max(0, finiteNumber(size, 0));
  if (!bytes) return '大小未知';
  if (bytes >= 1024 * 1024 * 1024) return (bytes / 1024 / 1024 / 1024).toFixed(1).replace(/\.0$/, '') + ' GB';
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, '') + ' MB';
  return Math.max(1, Math.round(bytes / 1024)) + ' KB';
}

function normalizeFiles(files) {
  if (!Array.isArray(files)) return [];
  return files.reduce(function reduce(result, source, index) {
    var file = typeof source === 'string' ? { url: source } : (source || {});
    var path = String(file.tempFilePath || file.path || file.url || '');
    if (!path) return result;
    var name = String(file.name || path.split(/[\\/]/).pop() || ('文件 ' + (index + 1)));
    var type = fileType(file, path);
    var status = fileStatus(file.status);
    var progress = Math.round(Math.max(0, Math.min(100, finiteNumber(file.progress, status === 'success' ? 100 : 0))));
    var statusMeta = STATUS_META[status];
    var extension = fileExtension(name || path);
    result.push({
      id: String(file.id || file.uid || (path + '__' + index)),
      path: path,
      url: String(file.url || path),
      name: name,
      type: type,
      extension: extension,
      size: Math.max(0, finiteNumber(file.size, 0)),
      sizeText: sizeText(file.size),
      duration: Math.max(0, finiteNumber(file.duration, 0)),
      status: status,
      statusText: String(file.statusText || statusMeta.text),
      statusTheme: statusMeta.theme,
      statusIcon: statusMeta.icon,
      progress: progress,
      message: String(file.message || file.errorMessage || ''),
      canPreview: type === 'image' || type === 'video' || DOCUMENT_EXTENSIONS.indexOf(extension) > -1
    });
    return result;
  }, []);
}

function fileIdentity(file) {
  return String(file.path || file.url || '');
}

function sameFiles(left, right) {
  if (left.length !== right.length) return false;
  return left.every(function every(file, index) {
    var other = right[index];
    return !!other && fileIdentity(file) === fileIdentity(other) && file.status === other.status && file.progress === other.progress && file.message === other.message;
  });
}

function canceled(error) {
  return /cancel|取消/i.test(String((error && (error.errMsg || error.message)) || ''));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    files: { type: null, value: null },
    defaultFiles: { type: Array, value: [] },
    max: { type: Number, value: 9 },
    picker: { type: String, value: 'media' },
    mediaType: { type: Array, value: ['image'] },
    messageType: { type: String, value: 'all' },
    source: { type: String, value: '' },
    extensions: { type: Array, value: [] },
    maxSize: { type: Number, value: 0 },
    addContent: { type: String, value: '添加附件' },
    addBtn: { type: Boolean, value: true },
    theme: { type: String, value: 'list' },
    columns: { type: Number, value: 3 },
    allowDuplicate: { type: Boolean, value: false },
    preview: { type: Boolean, value: true },
    removeBtn: { type: Boolean, value: true },
    customAdd: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '附件选择' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerFiles: [],
    normalizedMax: 9,
    normalizedColumns: 3,
    canAdd: true,
    choosing: false,
    pickerMode: 'media',
    currentMessageType: 'all',
    displayTheme: 'list',
    buttonLoadingProps: { text: '选择中', ariaLabel: '选择附件处理中' },
    rootClass: 'pui-upload',
    rootStyle: '',
    semanticLabel: '附件选择'
  },
  observers: {
    'files,defaultFiles,max,picker,mediaType,messageType,source,extensions,maxSize,addContent,addBtn,theme,columns,allowDuplicate,preview,removeBtn,customAdd,disabled,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._attached = true;
      this.syncState();
    },
    detached: function detached() {
      this._attached = false;
    }
  },
  methods: {
    isControlled: function isControlled() {
      return Array.isArray(this.data.files);
    },
    applyFiles: function applyFiles(files) {
      var normalized = normalizeFiles(files).slice(0, maxFiles(this.data.max));
      this.setData({ innerFiles: normalized, canAdd: !!this.data.addBtn && normalized.length < maxFiles(this.data.max) });
    },
    syncState: function syncState() {
      var normalizedMax = maxFiles(this.data.max);
      var files;
      if (this.isControlled()) {
        files = normalizeFiles(this.data.files).slice(0, normalizedMax);
        this._lastControlledFiles = files;
        this._wasControlled = true;
      } else if (this._wasControlled) {
        files = normalizeFiles(this._lastControlledFiles).slice(0, normalizedMax);
        this._wasControlled = false;
        this._initialized = true;
      } else if (!this._initialized) {
        files = normalizeFiles(this.data.defaultFiles).slice(0, normalizedMax);
        this._initialized = true;
      } else files = normalizeFiles(this.data.innerFiles).slice(0, normalizedMax);
      var theme = displayTheme(this.data.theme);
      var classes = [
        'pui-upload',
        this.getColorSchemeClass(),
        'pui-upload--' + theme,
        this.data.disabled ? 'pui-upload--disabled' : '',
        this.data.choosing ? 'pui-upload--choosing' : '',
        !files.length ? 'pui-upload--empty' : '',
        files.length >= normalizedMax ? 'pui-upload--full' : '',
        this.data.reduceMotion ? 'pui-upload--reduced-motion' : ''
      ];
      this.setData({
        innerFiles: files,
        normalizedMax: normalizedMax,
        normalizedColumns: gridColumns(this.data.columns),
        canAdd: !!this.data.addBtn && files.length < normalizedMax,
        pickerMode: pickerMode(this.data.picker),
        currentMessageType: messageFileType(this.data.messageType),
        displayTheme: theme,
        rootClass: classes.filter(Boolean).join(' '),
        rootStyle: '--pui-upload-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;',
        semanticLabel: String(this.data.ariaLabel || '附件选择').trim() || '附件选择'
      });
    },
    requestFiles: function requestFiles(files, source, extra) {
      var previousFiles = this.data.innerFiles.slice();
      var nextFiles = normalizeFiles(files).slice(0, this.data.normalizedMax);
      if (sameFiles(previousFiles, nextFiles)) return null;
      if (!this.isControlled()) this.applyFiles(nextFiles);
      var detail = Object.assign({ files: nextFiles, previousFiles: previousFiles, source: source }, extra || {});
      this.triggerEvent('change', detail);
      return detail;
    },
    chooseFile: function chooseFile() {
      return this.choosePlatformFiles();
    },
    beginChoose: function beginChoose() {
      if (this.data.disabled || this.data.choosing || !this.data.canAdd) return false;
      this.setData({ choosing: true });
      this.syncState();
      return true;
    },
    endChoose: function endChoose() {
      if (this._attached !== false) {
        this.setData({ choosing: false });
        this.syncState();
      }
    },
    rejectFiles: function rejectFiles(rejected, source) {
      if (!rejected.length) return;
      this.triggerEvent('reject', {
        rejectedFiles: rejected,
        extensions: extensionList(this.data.extensions),
        maxSize: maxFileSize(this.data.maxSize),
        max: this.data.normalizedMax,
        source: source
      });
    },
    acceptSelectedFiles: function acceptSelectedFiles(selectedFiles, source) {
      var remain = this.data.normalizedMax - this.data.innerFiles.length;
      var normalized = normalizeFiles(selectedFiles);
      var extensions = extensionList(this.data.extensions);
      var sizeLimit = maxFileSize(this.data.maxSize);
      var selectedMediaTypes = mediaTypes(this.data.mediaType);
      var messageType = this.data.currentMessageType;
      var identities = this.data.innerFiles.map(fileIdentity);
      var accepted = [];
      var rejected = [];
      normalized.forEach(function validate(file) {
        var reason = '';
        if (source === 'choose-media' && selectedMediaTypes.indexOf(file.type) < 0) reason = 'type';
        else if (source === 'choose-message-file' && messageType !== 'all' && messageType !== file.type) reason = 'type';
        else if (extensions.length && extensions.indexOf(file.extension) < 0) reason = 'extension';
        else if (sizeLimit > 0 && file.size > sizeLimit) reason = 'size';
        else if (!this.data.allowDuplicate && identities.indexOf(fileIdentity(file)) > -1) reason = 'duplicate';
        else if (accepted.length >= remain) reason = 'max';
        if (reason) rejected.push({ file: file, reason: reason });
        else {
          accepted.push(file);
          identities.push(fileIdentity(file));
        }
      }, this);
      this.rejectFiles(rejected, source);
      if (!accepted.length) {
        this.endChoose();
        return false;
      }
      var detail = this.requestFiles(this.data.innerFiles.concat(accepted), 'add', { addedFiles: accepted, rejectedFiles: rejected, picker: this.data.pickerMode });
      if (detail) this.triggerEvent('add', detail);
      this.endChoose();
      return !!detail;
    },
    choosePlatformFiles: function choosePlatformFiles() {
      var self = this;
      var remain = this.data.normalizedMax - this.data.innerFiles.length;
      var source = this.data.pickerMode === 'message' ? 'choose-message-file' : 'choose-media';
      if (remain <= 0) {
        this.rejectFiles([{ file: null, reason: 'max' }], source);
        return false;
      }
      if (!this.beginChoose()) return false;
      if (typeof wx === 'undefined') {
        this.triggerEvent('error', { message: '微信文件选择能力不可用', source: source });
        this.endChoose();
        return false;
      }
      function success(result) {
        var selected = result.tempFiles || (result.tempFilePaths || []).map(function mapPath(path) {
          return { tempFilePath: path, fileType: 'image' };
        });
        if (!selected || !selected.length) {
          self.triggerEvent('error', { message: '文件选择器未返回有效文件', source: source });
          self.endChoose();
          return;
        }
        self.acceptSelectedFiles(selected, source);
      }
      function fail(error) {
        if (canceled(error)) self.triggerEvent('cancel', { source: source });
        else self.triggerEvent('error', Object.assign({ source: source }, error || {}));
        self.endChoose();
      }
      if (this.data.pickerMode === 'message') {
        if (!wx.chooseMessageFile) {
          this.triggerEvent('error', { message: '当前基础库不支持 wx.chooseMessageFile', source: source });
          this.endChoose();
          return false;
        }
        wx.chooseMessageFile({ count: remain, type: this.data.currentMessageType, extension: extensionList(this.data.extensions), success: success, fail: fail });
        return true;
      }
      var selectedTypes = mediaTypes(this.data.mediaType);
      if (wx.chooseMedia) {
        wx.chooseMedia({ count: remain, mediaType: selectedTypes, sourceType: sourceTypes(this.data.source), success: success, fail: fail });
        return true;
      }
      if (selectedTypes.length === 1 && selectedTypes[0] === 'image' && wx.chooseImage) {
        wx.chooseImage({ count: remain, sourceType: sourceTypes(this.data.source), success: success, fail: fail });
        return true;
      }
      this.triggerEvent('error', { message: '当前基础库不支持所选媒体能力', source: source });
      this.endChoose();
      return false;
    },
    removeFile: function removeFile(event) {
      if (this.data.disabled || this.data.choosing) return false;
      var index = Number(event.currentTarget.dataset.index);
      var item = this.data.innerFiles[index];
      if (!item) return false;
      var files = this.data.innerFiles.slice();
      files.splice(index, 1);
      var detail = this.requestFiles(files, 'remove', { file: item, index: index });
      if (detail) this.triggerEvent('remove', detail);
      return !!detail;
    },
    previewFile: function previewFile(event) {
      if (this.data.disabled || !this.data.preview) return false;
      var index = Number(event.currentTarget.dataset.index);
      var item = this.data.innerFiles[index];
      if (!item || !item.canPreview) return false;
      var self = this;
      var detail = { file: item, index: index, source: 'preview' };
      this.triggerEvent('preview', detail);
      if (typeof wx === 'undefined') return true;
      function fail(error) {
        self.triggerEvent('error', Object.assign({ source: 'preview', file: item, index: index }, error || {}));
      }
      if (item.type === 'image' && wx.previewImage) {
        wx.previewImage({ current: item.path, urls: this.data.innerFiles.filter(function onlyImage(file) { return file.type === 'image'; }).map(function mapFile(file) { return file.path; }), fail: fail });
      } else if (item.type === 'video' && wx.previewMedia) {
        wx.previewMedia({ sources: [{ url: item.path, type: 'video' }], fail: fail });
      } else if (item.type === 'file' && wx.openDocument && !/^https?:\/\//i.test(item.path)) {
        wx.openDocument({ filePath: item.path, showMenu: true, fail: fail });
      } else fail({ message: '当前文件不支持平台预览' });
      return true;
    },
    retryFile: function retryFile(event) {
      if (this.data.disabled || this.data.choosing) return false;
      var index = Number(event.currentTarget.dataset.index);
      var file = this.data.innerFiles[index];
      if (!file || file.status !== 'error') return false;
      this.triggerEvent('retry', { file: file, index: index, files: this.data.innerFiles.slice(), source: 'file' });
      return true;
    }
  }
});
