var RESOURCE_APP_ID = 'wxa1b9a4d6549c6cd1';
var RESOURCE_ENV = 'poemcoder-1gkbkid139b08f45';
var COLLECTION_NAME = 'pui-codepage';
var PRODUCT = 'poemui';
var PAGE_KEY = 'codex';

var sharedCloud = null;
var cloudInitPromise = null;
var activeLoadPromise = null;

function cleanText(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function normalizeSortOrder(value) {
  var numeric = Number(value);
  return isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0;
}

function cloneSnippet(snippet) {
  return {
    id: snippet.id,
    title: snippet.title,
    code: snippet.code,
    ariaLabel: snippet.ariaLabel
  };
}

function normalizeSnippet(snippet, index) {
  var source = snippet && typeof snippet === 'object' ? snippet : {};
  var code = String(source.code === null || source.code === undefined ? '' : source.code);
  var id = cleanText(source.id) || 'snippet-' + (index + 1);
  var title = cleanText(source.title);
  if (!title || !code.trim()) return null;
  return {
    id: id,
    title: title,
    code: code,
    ariaLabel: cleanText(source.ariaLabel) || ('复制' + title)
  };
}

function normalizeSection(source) {
  source = source && typeof source === 'object' ? source : {};
  var title = cleanText(source.title);
  if (!title) return null;
  return {
    title: title,
    subtitle: cleanText(source.subtitle),
    description: cleanText(source.description)
  };
}

function normalizePageRecord(record) {
  var source = record && typeof record === 'object' ? record : {};
  if (cleanText(source.kind) !== 'page' || cleanText(source.status) !== 'published') return null;
  var content = source.content && typeof source.content === 'object' ? source.content : {};
  var quickStart = normalizeSection(content.quickStart);
  var skillSection = normalizeSection(content.skillSection);
  var snippets = Array.isArray(content.quickStart && content.quickStart.snippets)
    ? content.quickStart.snippets.map(normalizeSnippet).filter(Boolean)
    : [];
  if (!quickStart || !skillSection || !snippets.length) return null;
  return {
    id: cleanText(source._id || source.id),
    title: cleanText(source.title) || 'Codex',
    quickStart: {
      title: quickStart.title,
      subtitle: quickStart.subtitle,
      description: quickStart.description,
      snippets: snippets.map(cloneSnippet)
    },
    skillSection: {
      title: skillSection.title,
      subtitle: skillSection.subtitle,
      description: skillSection.description,
      emptyDescription: cleanText(content.skillSection && content.skillSection.emptyDescription) || '暂无已发布的 Skill。'
    }
  };
}

function cloneSkill(skill) {
  return {
    id: skill.id,
    name: skill.name,
    version: skill.version,
    summary: skill.summary,
    icon: skill.icon,
    capabilities: skill.capabilities.slice(),
    installCode: skill.installCode,
    installTitle: skill.installTitle,
    sortOrder: skill.sortOrder
  };
}

function normalizeSkillRecord(record) {
  var source = record && typeof record === 'object' ? record : {};
  if (cleanText(source.kind) !== 'skill' || cleanText(source.status) !== 'published') return null;
  var id = cleanText(source.skillId || source._id || source.id);
  var name = cleanText(source.name);
  var summary = cleanText(source.summary);
  if (!id || !name || !summary) return null;
  var installation = source.installation && typeof source.installation === 'object' ? source.installation : {};
  var capabilityValues = Array.isArray(source.capabilities) ? source.capabilities : [];
  var capabilities = capabilityValues.map(cleanText).filter(Boolean).slice(0, 6);
  return {
    id: id,
    name: name,
    version: cleanText(source.version),
    summary: summary,
    icon: cleanText(source.icon) || 'codex',
    capabilities: capabilities,
    installCode: String(installation.code === null || installation.code === undefined ? '' : installation.code),
    installTitle: cleanText(installation.title) || '安装方式',
    sortOrder: normalizeSortOrder(source.sortOrder)
  };
}

function normalizeDocuments(value) {
  var records = Array.isArray(value) ? value : [];
  var page = null;
  var skills = [];
  records.forEach(function normalizeRecord(record) {
    if (!page) page = normalizePageRecord(record);
    var skill = normalizeSkillRecord(record);
    if (skill) skills.push(skill);
  });
  skills.sort(function sortSkills(left, right) {
    if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
    return left.name.localeCompare(right.name);
  });
  return {
    page: page,
    skills: skills.map(cloneSkill)
  };
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
      .where({ product: PRODUCT, pageKey: PAGE_KEY, status: 'published' })
      .limit(100)
      .get();
  }).then(function normalizeResult(result) {
    var normalized = normalizeDocuments(result && result.data);
    return {
      page: normalized.page,
      skills: normalized.skills,
      source: 'cloud'
    };
  });
}

function load() {
  if (activeLoadPromise) return activeLoadPromise;
  activeLoadPromise = fetchPublished().then(function complete(result) {
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
  PRODUCT: PRODUCT,
  PAGE_KEY: PAGE_KEY,
  normalizeDocuments: normalizeDocuments,
  load: load
};
