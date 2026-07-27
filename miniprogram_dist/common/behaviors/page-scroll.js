function getCurrentPage() {
  if (typeof getCurrentPages !== 'function') return null;
  var pages = getCurrentPages();
  return pages && pages.length ? pages[pages.length - 1] : null;
}

module.exports = function createPageScrollBehavior(methodName) {
  var handlerName = methodName || 'onPageScroll';
  return Behavior({
    lifetimes: {
      attached: function attachedPageScrollBehavior() {
        var page = getCurrentPage();
        var handler = this[handlerName];
        if (!page || typeof handler !== 'function') return;

        if (!page.__puiPageScrollDispatcher) {
          page.__puiPageScrollOriginal = typeof page.onPageScroll === 'function'
            ? page.onPageScroll
            : null;
          page.__puiPageScrollListeners = [];
          page.__puiPageScrollDispatcher = function puiPageScrollDispatcher(event) {
            var original = page.__puiPageScrollOriginal;
            if (typeof original === 'function') original.call(page, event);
            (page.__puiPageScrollListeners || []).slice().forEach(function notify(listener) {
              if (typeof listener === 'function') listener(event || {});
            });
          };
          page.onPageScroll = page.__puiPageScrollDispatcher;
        }

        this.__puiPageScrollPage = page;
        this.__puiPageScrollHandler = handler.bind(this);
        page.__puiPageScrollListeners.push(this.__puiPageScrollHandler);
      },
      detached: function detachedPageScrollBehavior() {
        var page = this.__puiPageScrollPage;
        var handler = this.__puiPageScrollHandler;
        if (!page || !Array.isArray(page.__puiPageScrollListeners)) return;
        page.__puiPageScrollListeners = page.__puiPageScrollListeners.filter(function remove(item) {
          return item !== handler;
        });
        if (!page.__puiPageScrollListeners.length) {
          if (page.onPageScroll === page.__puiPageScrollDispatcher) {
            page.onPageScroll = page.__puiPageScrollOriginal || undefined;
          }
          delete page.__puiPageScrollOriginal;
          delete page.__puiPageScrollListeners;
          delete page.__puiPageScrollDispatcher;
        }
        this.__puiPageScrollPage = null;
        this.__puiPageScrollHandler = null;
      }
    }
  });
};
