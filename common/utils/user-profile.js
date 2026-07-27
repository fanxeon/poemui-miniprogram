var STORAGE_KEY = 'poemui-user-profile';
var LEGACY_OPENID_KEY = 'openid';
var DEFAULT_NICKNAME = 'PoemUI 用户';

function text(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function normalizeNickname(value) {
  return text(value).slice(0, 20);
}

function normalizeOpenId(value) {
  return text(value).slice(0, 128);
}

function storage() {
  if (typeof wx === 'undefined') return null;
  if (typeof wx.getStorageSync !== 'function' || typeof wx.setStorageSync !== 'function') return null;
  return wx;
}

function readStoredProfile() {
  var target = storage();
  if (!target) return { nickname: '', openid: '', error: null };
  try {
    var saved = target.getStorageSync(STORAGE_KEY);
    var profile = saved && typeof saved === 'object' ? saved : {};
    var legacyOpenId = normalizeOpenId(target.getStorageSync(LEGACY_OPENID_KEY));
    return {
      nickname: normalizeNickname(profile.nickname),
      openid: normalizeOpenId(profile.openid) || legacyOpenId,
      error: null
    };
  } catch (error) {
    return { nickname: '', openid: '', error: error };
  }
}

function appOpenId() {
  if (typeof getApp !== 'function') return '';
  try {
    var app = getApp();
    var globalData = app && app.globalData && typeof app.globalData === 'object' ? app.globalData : {};
    return normalizeOpenId(globalData.openid || globalData.openId);
  } catch (error) {
    return '';
  }
}

function restore() {
  var saved = readStoredProfile();
  return {
    nickname: saved.nickname || DEFAULT_NICKNAME,
    openid: appOpenId() || saved.openid,
    error: saved.error
  };
}

function persist(nextProfile) {
  var target = storage();
  if (!target) return { saved: false, profile: nextProfile, error: new Error('storage-unavailable') };
  try {
    target.setStorageSync(STORAGE_KEY, nextProfile);
    return { saved: true, profile: nextProfile, error: null };
  } catch (error) {
    return { saved: false, profile: nextProfile, error: error };
  }
}

function setNickname(value) {
  var nickname = normalizeNickname(value);
  if (!nickname) {
    return { saved: false, profile: restore(), error: new Error('nickname-required') };
  }
  var current = restore();
  return persist({ nickname: nickname, openid: current.openid });
}

function setOpenId(value) {
  var openid = normalizeOpenId(value);
  if (!openid) {
    return { saved: false, profile: restore(), error: new Error('openid-required') };
  }
  var current = restore();
  return persist({ nickname: current.nickname, openid: openid });
}

module.exports = {
  DEFAULT_NICKNAME: DEFAULT_NICKNAME,
  STORAGE_KEY: STORAGE_KEY,
  restore: restore,
  setNickname: setNickname,
  setOpenId: setOpenId
};
