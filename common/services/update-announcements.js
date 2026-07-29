var RESOURCE_APP_ID = 'wxa1b9a4d6549c6cd1';
var RESOURCE_ENV = 'poemcoder-1gkbkid139b08f45';
var COLLECTION_NAME = 'pui_updatelog';
var CACHE_KEY = 'poemui-update-announcements';
var componentStatus = require('../data/component-status');

function categoryCounts(usePreviousValue) {
  return componentStatus.items().map(function mapCategory(item) {
    return {
      key: item.key,
      label: item.label,
      count: usePreviousValue ? item.previousValue : item.value
    };
  });
}

var CURRENT_CATEGORY_COUNTS = categoryCounts(false);
var PREVIOUS_CATEGORY_COUNTS = categoryCounts(true);

var FALLBACK_ANNOUNCEMENTS = [
  {
    id: 'pui-v0-1-2-20260729',
    version: 'v0.1.2',
    date: '2026-07-29',
    title: 'PoemUI v0.1.2 更新',
    summary: '新增高级图表，完成组件交互与跨端体验修缮。',
    componentCount: componentStatus.total,
    categoryCounts: CURRENT_CATEGORY_COUNTS,
    highlights: [
      {
        component: '高级图表',
        icon: 'activity',
        title: 'AreaChart / BarChart / Waffle',
        description: '新增三项图表，支持主题渐变、真实数据回写和可重播入场。'
      },
      {
        component: '导航与表单',
        icon: 'progress',
        title: '锚点、圆角与输入稳定',
        description: '修正导航宽度、吸顶、索引轨以及选择、步进和输入布局。'
      },
      {
        component: '展示与反馈',
        icon: 'dashboard',
        title: '状态与操作闭环',
        description: '补齐加载、更多菜单、展开、滑动、倒计时和通知动画。'
      },
      {
        component: '浮层',
        icon: 'popup',
        title: 'Header 与 Footer 统一',
        description: 'Picker、Dialog 与 Popup 统一三段结构、全宽操作和外观语义。'
      },
      {
        component: '小程序',
        icon: 'cloud',
        title: '状态页与首页修正',
        description: 'Me BarChart 按八类展示 v0.1.0、v0.1.1、v0.1.2 增量并平滑展开；首页移除无效分享配置。'
      }
    ],
    status: 'published',
    schemaVersion: 2
  },
  {
    id: 'pui-v0-1-1-20260728',
    version: 'v0.1.1',
    date: '2026-07-28',
    title: 'PoemUI v0.1.1 更新',
    summary: '新增高级图表，集中优化组件交互与小程序体验。',
    componentCount: componentStatus.versions().filter(function findVersion(item) {
      return item.version === '0.1.1';
    })[0].total,
    categoryCounts: CURRENT_CATEGORY_COUNTS,
    highlights: [
      {
        component: '高级图表',
        icon: 'activity',
        title: 'AreaChart / BarChart / Waffle',
        description: '新增三项图表，支持小程序与 H5、主题渐变和可重播入场。'
      },
      {
        component: '导航',
        icon: 'progress',
        title: '导航与布局修正',
        description: '修正连接线、菜单宽度、面包屑、底栏和索引选中态。'
      },
      {
        component: '表单',
        icon: 'search',
        title: '输入选择更稳',
        description: '统一输入、选择、步进器的间距、圆角与实机布局。'
      },
      {
        component: '展示与反馈',
        icon: 'dashboard',
        title: '状态与操作闭环',
        description: '补齐加载和更多状态，修正滑动操作、倒计时、通知与对话框。'
      },
      {
        component: '小程序',
        icon: 'cloud',
        title: '安装与状态页升级',
        description: '安装内容改为云端读取；“我的”以 AreaChart 展示 71 → 74 的真实组件增长。'
      }
    ],
    status: 'published',
    schemaVersion: 2
  },
  {
    id: 'pui-v0-1-0-20260727',
    version: 'v0.1.0',
    date: '2026-07-27',
    title: 'PoemUI v0.1.0 更新',
    summary: '小程序入口、组件体验与快速样式完成一轮系统更新。',
    componentCount: componentStatus.previousTotal,
    categoryCounts: PREVIOUS_CATEGORY_COUNTS,
    highlights: [
      {
        component: '我的',
        icon: 'user',
        title: '服务与信息页',
        description: '集中提供更新公告、授权信息与平台服务入口。'
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
    schemaVersion: 2
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

function cloneCategoryCount(category) {
  return {
    key: category.key,
    label: category.label,
    count: category.count
  };
}

function cloneAnnouncement(announcement) {
  return {
    id: announcement.id,
    version: announcement.version,
    date: announcement.date,
    title: announcement.title,
    summary: announcement.summary,
    componentCount: announcement.componentCount,
    categoryCounts: announcement.categoryCounts.map(cloneCategoryCount),
    highlights: announcement.highlights.map(cloneHighlight),
    status: announcement.status,
    schemaVersion: announcement.schemaVersion
  };
}

function normalizeCategoryCount(category) {
  var source = category && typeof category === 'object' ? category : {};
  var key = cleanText(source.key);
  var label = cleanText(source.label);
  var count = Number(source.count);
  if (!key || !label || !Number.isFinite(count) || count < 0 || Math.floor(count) !== count) return null;
  return {
    key: key,
    label: label,
    count: count
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
  var categoryCounts = Array.isArray(source.categoryCounts)
    ? source.categoryCounts.map(normalizeCategoryCount).filter(Boolean)
    : [];
  var highlights = Array.isArray(source.highlights)
    ? source.highlights.map(normalizeHighlight).filter(Boolean)
    : [];
  var id = cleanText(source._id || source.id);
  var version = cleanText(source.version);
  var date = cleanText(source.date);
  var title = cleanText(source.title);
  var componentCount = Number(source.componentCount);
  var categoryTotal = categoryCounts.reduce(function sumCategories(sum, category) {
    return sum + category.count;
  }, 0);
  var categoryKeys = {};
  var hasUniqueCategories = categoryCounts.every(function rememberCategory(category) {
    if (categoryKeys[category.key]) return false;
    categoryKeys[category.key] = true;
    return true;
  });
  if (
    !id
    || !version
    || !date
    || !title
    || !highlights.length
    || !Number.isFinite(componentCount)
    || componentCount <= 0
    || Math.floor(componentCount) !== componentCount
    || !categoryCounts.length
    || !hasUniqueCategories
    || categoryTotal !== componentCount
  ) return null;
  return {
    id: id,
    version: version,
    date: date,
    title: title,
    summary: cleanText(source.summary),
    componentCount: componentCount,
    categoryCounts: categoryCounts,
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
