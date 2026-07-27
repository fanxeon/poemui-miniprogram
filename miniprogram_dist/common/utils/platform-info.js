function read(method) {
  try {
    if (typeof wx !== 'undefined' && typeof wx[method] === 'function') {
      return wx[method]() || {};
    }
  } catch (error) {
    // Platform information is optional runtime context. Callers keep documented defaults.
  }
  return {};
}

function getWindowInfo() {
  return read('getWindowInfo');
}

function getDeviceInfo() {
  return read('getDeviceInfo');
}

function getAppBaseInfo() {
  return read('getAppBaseInfo');
}

module.exports = {
  getWindowInfo: getWindowInfo,
  getDeviceInfo: getDeviceInfo,
  getAppBaseInfo: getAppBaseInfo,
};
