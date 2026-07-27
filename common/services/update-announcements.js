var RESOURCE_APP_ID = 'wxa1b9a4d6549c6cd1';
var RESOURCE_ENV = 'poemcoder-1gkbkid139b08f45';
var COLLECTION_NAME = 'pui_updatelog';
var CACHE_KEY = 'poemui-update-announcements';

var FALLBACK_ANNOUNCEMENTS = [
  {
    id: 'pui-v0-1-0-20260727',
    version: 'v0.1.0',
    date: '2026-07-27',
    title: 'PoemUI v0.1.0 更新',
    summary: '小程序入口、组件体验与快速样式完成一轮系统更新。',
    highlights: [
      {
        component: '我的',
        icon: 'user',
        title: '账户与服务页',
        description: '支持昵称保存、更新公告与服务导航。'
      },
      {
        component: 'Popup',
        icon: 'popup',
        title: '三段式浮层',
        description: '统一 Header、唯一滚动 Content 与全宽 Footer，并支持全局或单独设置毛玻璃遮罩。'
      },
      {
        component: 'Picker',
        icon: 'calendar',
        title: 'Picker / DateTimePicker',
        description: '恢复标题与确认、取消操作，完善滚轮面板、主题与弹层表现。'
      },
      {
        component: '快速样式',
        icon: 'palette',
        title: '样式与精选颜色',
        description: '新增布局、尺寸、间距、字体、背景分类与精选颜色工具。'
      },
      {
        component: 'Codex',
        icon: 'codex',
        title: '快速开始',
        description: '新增安装代码、页面引用与真实剪贴板复制入口。'
      }
    ],
    status: 'published',
    schemaVersion: 1
  }
];

var sharedCloud = null;
var cloudInitPromise = null;
var activeLoadPromise = null;

function cleanText(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function cloneHighlight(highlight) {
  return {
    component: highlight.component,
    icon: highlight.icon,
    title: highlight.title,
    description: highlight.description
  };
}

function cloneAnnouncement(announcement) {
  return {
    id: announcement.id,
    version: announcement.version,
    date: announcement.date,
    title: announcement.title,
    summary: announcement.summary,
    highlights: announcement.highlights.map(cloneHighlight),
    status: announcement.status,
    schemaVersion: announcement.schemaVersion
  };
}

function normalizeHighlight(highlight) {
  var source = highlight && typeof highlight === 'object' ? highlight : {};
  var component = cleanText(source.component);
  var title = cleanText(source.title);
  var description = cleanText(source.description);
  if (!component || !title || !description) return null;
  return {
    component: component,
    icon: cleanText(source.icon) || 'sparkles',
    title: title,
    description: description
  };
}

function normalizeAnnouncement(announcement) {
  var source = announcement && typeof announcement === 'object' ? announcement : {};
  var highlights = Array.isArray(source.highlights)
    ? source.highlights.map(normalizeHighlight).filter(Boolean)
    : [];
  var id = cleanText(source._id || source.id);
  var version = cleanText(source.version);
  var date = cleanText(source.date);
  var title = cleanText(source.title);
  if (!id || !version || !date || !title || !highlights.length) return null;
  return {
    id: id,
    version: version,
    date: date,
    title: title,
    summary: cleanText(source.summary),
    highlights: highlights,
    status: cleanText(source.status) || 'published',
    schemaVersion: Number(source.schemaVersion) || 1
  };
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeAnnouncement).filter(function onlyPublished(announcement) {
    return announcement && announcement.status === 'published';
  }).sort(function newestFirst(left, right) {
    return right.date.localeCompare(left.date);
  });
}

function fallbackList() {
  return FALLBACK_ANNOUNCEMENTS.map(cloneAnnouncement);
}

function readCache() {
  if (typeof wx === 'undefined' || typeof wx.getStorageSync !== 'function') return [];
  try {
    return normalizeList(wx.getStorageSync(CACHE_KEY));
  } catch (error) {
    return [];
  }
}

function writeCache(announcements) {
  if (typeof wx === 'undefined' || typeof wx.setStorageSync !== 'function') return false;
  try {
    wx.setStorageSync(CACHE_KEY, announcements.map(cloneAnnouncement));
    return true;
  } catch (error) {
    return false;
  }
}

function initial() {
  var cached = readCache();
  return cached.length ? cached.map(cloneAnnouncement) : fallbackList();
}

function latest(announcements) {
  var list = Array.isArray(announcements) ? normalizeList(announcements) : initial();
  return list.length ? cloneAnnouncement(list[0]) : null;
}

function getSharedCloud() {
  if (
    typeof wx === 'undefined'
    || !wx.cloud
    || typeof wx.cloud.Cloud !== 'function'
  ) {
    return Promise.reject(new Error('shared-cloud-unavailable'));
  }
  if (sharedCloud && !cloudInitPromise) return Promise.resolve(sharedCloud);
  if (cloudInitPromise) return cloudInitPromise;

  sharedCloud = new wx.cloud.Cloud({
    resourceAppid: RESOURCE_APP_ID,
    resourceEnv: RESOURCE_ENV
  });
  cloudInitPromise = Promise.resolve(sharedCloud.init()).then(function initialized() {
    cloudInitPromise = null;
    return sharedCloud;
  }).catch(function initFailed(error) {
    sharedCloud = null;
    cloudInitPromise = null;
    throw error;
  });
  return cloudInitPromise;
}

function fetchPublished() {
  return getSharedCloud().then(function querySharedDatabase(cloud) {
    return cloud.database()
      .collection(COLLECTION_NAME)
      .where({ status: 'published' })
      .limit(20)
      .get();
  }).then(function normalizeResult(result) {
    var announcements = normalizeList(result && result.data);
    if (!announcements.length) throw new Error('shared-cloud-empty');
    writeCache(announcements);
    return {
      announcements: announcements.map(cloneAnnouncement),
      source: 'cloud',
      error: null
    };
  });
}

function load() {
  if (activeLoadPromise) return activeLoadPromise;
  activeLoadPromise = fetchPublished().catch(function fallback(error) {
    var cached = readCache();
    return {
      announcements: cached.length ? cached.map(cloneAnnouncement) : fallbackList(),
      source: cached.length ? 'cache' : 'local',
      error: error
    };
  }).then(function complete(result) {
    activeLoadPromise = null;
    return result;
  }, function completeWithError(error) {
    activeLoadPromise = null;
    throw error;
  });
  return activeLoadPromise;
}

module.exports = {
  RESOURCE_APP_ID: RESOURCE_APP_ID,
  RESOURCE_ENV: RESOURCE_ENV,
  COLLECTION_NAME: COLLECTION_NAME,
  CACHE_KEY: CACHE_KEY,
  initial: initial,
  list: initial,
  latest: latest,
  load: load
};
