var STORAGE_KEY = 'poemui-user-profile';
var DEFAULT_NICKNAME = 'PoemUI 用户';

function text(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function normalizeNickname(value) {
  return text(value).slice(0, 20);
}

function storage() {
  if (typeof wx === 'undefined') return null;
  if (typeof wx.getStorageSync !== 'function' || typeof wx.setStorageSync !== 'function') return null;
  return wx;
}

function readStoredProfile() {
  var target = storage();
  if (!target) return { nickname: '', error: null };
  try {
    var saved = target.getStorageSync(STORAGE_KEY);
    var profile = saved && typeof saved === 'object' ? saved : {};
    return {
      nickname: normalizeNickname(profile.nickname),
      error: null
    };
  } catch (error) {
    return { nickname: '', error: error };
  }
}

function restore() {
  var saved = readStoredProfile();
  return {
    nickname: saved.nickname || DEFAULT_NICKNAME,
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
  return persist({ nickname: nickname });
}

module.exports = {
  DEFAULT_NICKNAME: DEFAULT_NICKNAME,
  STORAGE_KEY: STORAGE_KEY,
  restore: restore,
  setNickname: setNickname
};
