let getConfig = () => console.error("leaf.init must be called");
let getState = () => console.error("leaf.init must be called");
let saveState = () => console.error("leaf.init must be called");

//========
// Page views

const getANewPage = href =>
  Object.freeze({
    href,
    views: Object.seal({
      number: 0,
      timeOfVisit: [],
      durationOfVisit: []
    }),
    mouse: Object.freeze({
      clickBursts: {},
      scrollBursts: {}
    })
  });

const getCurrentPage = () => {
  let page = getState().leaf.pages.find(p => p.href == location.href);

  if (!page) {
    page = getANewPage(location.href);
    getState().leaf.pages.push(page);
  }

  return page;
};

const incrementPageViews = page => {
  page.views.timeOfVisit.push(Date.now());
  page.views.number++;

  return page;
};

const addDurationPageView = page => {
  const views = page.views;
  if (!views.timeOfVisit || !views.timeOfVisit.length) return;

  views.durationOfVisit.push(
    Date.now() - views.timeOfVisit[views.timeOfVisit.length - 1]
  );

  return page;
};

//========
// Mouse

function watchClicks() {
  const burstThreshold = getConfig().CBD.clickBurstThreshold;
  let burstTimeout = null;
  // number of clicks in the current burst
  let burstLength = 0;

  let _clickBursts, _burstIndex, _i;

  const burstDetector = e => {
    if (burstTimeout) {
      burstLength++;
      // reset timeout to get a sequence (burst) of clicks
      clearTimeout(burstTimeout);
    }

    // prepare for end of burst
    burstTimeout = setTimeout(() => {
      // end of burst

      // Less than threshold is not interesting
      if (burstLength >= burstThreshold) {
        _clickBursts = getCurrentPage().mouse.clickBursts;

        _burstIndex = burstLength - (burstLength % burstThreshold);

        // avoid gaps for better rendering
        for (_i = burstThreshold; _i <= _burstIndex; _i += burstThreshold) {
          _clickBursts[_i] = _clickBursts[_i] || 0;
        }

        _clickBursts[_burstIndex] = _clickBursts[_burstIndex] + 1;

        saveState();
      }

      // cleanup as this burst is over
      burstLength = 0;
    }, getConfig().CBD.clickBurstDuration);
  };

  document.addEventListener("click", burstDetector);
  document.addEventListener("touch", burstDetector);
}

function watchScrolls() {
  const burstThreshold = getConfig().CBD.scrollBurstThreshold;
  let burstTimeout = null;
  // number of scroll in the current burst
  let burstLength = 0;

  let lastScrollTop, lastDirection;

  let _thisScrollTop, _thisDirection, _hasDirectionChanged;

  const burstDetector = e => {
    _thisScrollTop = document.scrollingElement.scrollTop;
    _thisDirection = lastScrollTop - _thisScrollTop > 0 ? 1 : -1;
    _hasDirectionChanged = _thisDirection !== lastDirection;

    lastScrollTop = _thisScrollTop;
    lastDirection = _thisDirection;

    if (!_hasDirectionChanged) return;

    // A burst already started
    if (burstTimeout) {
      burstLength++;
      // reset timeout to get a sequence (burst) of scroll direction changes
      clearTimeout(burstTimeout);
    }

    // prepare for end of burst
    burstTimeout = setTimeout(() => {
      // end of burst

      // Less than threshold is not interesting
      if (burstLength >= burstThreshold) {
        const scrollBursts = getCurrentPage().mouse.scrollBursts;
        const burstIndex = burstLength - (burstLength % burstThreshold);
        // avoid gaps for better rendering
        for (let i = burstThreshold; i <= burstIndex; i += burstThreshold) {
          scrollBursts[i] = scrollBursts[i] || 0;
        }
        scrollBursts[burstIndex] = scrollBursts[burstIndex] + 1;
        saveState();
      }
      // cleanup as this burst is over
      burstLength = 0;
      lastDirection = null;
      lastScrollTop = null;
    }, getConfig().CBD.scrollBurstDuration);
  };

  document.addEventListener("scroll", burstDetector);
}

//========

function init(config, state) {
  getConfig = config.get;
  getState = state.get;
  saveState = state.save;

  incrementPageViews(getCurrentPage());

  saveState();

  watchClicks();

  watchScrolls();

  window.addEventListener("unload", () => {
    addDurationPageView(getCurrentPage());
    console.log(saveState());
  });
}

function initData() {
  return {
    pages: [getANewPage(location.href)]
  };
}

//========

export { init, initData, getCurrentPage };
