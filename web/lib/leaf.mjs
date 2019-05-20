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
      clickBursts: Array(4).fill(0),
      scrollBursts: Array(4).fill(0)
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
  const burstThresholds = getConfig().CBD.clickBurstThresholds;
  let burstTimeout = null;
  // number of clicks in the current burst
  let burstLength = 0;

  let _clickBursts, _burstIndex, _i;

  const burstDetector = e => {
    burstLength++;

    if (burstTimeout) {
      // reset timeout to get a sequence (burst) of clicks
      clearTimeout(burstTimeout);
    }

    // prepare for end of burst
    burstTimeout = setTimeout(() => {
      // end of burst

      _clickBursts = getCurrentPage().mouse.clickBursts;

      // check for dead zone
      if (burstLength < burstThresholds[0]) {
        _burstIndex = 0;
      } else if (burstLength >= burstThresholds[burstThresholds.length - 1]) {
        // check if it's after the last threshold
        _burstIndex = burstThresholds.length - 1;
      } else {
        // check between which thresholds it fits
        for (_i = 0; _i < burstThresholds.length; _i++) {
          if (
            burstLength >= burstThresholds[_i] &&
            burstLength < burstThresholds[_i + 1]
          ) {
            // +1 because 0 is the dead zone
            _burstIndex = _i + 1;
            break;
          }
        }
      }

      _clickBursts[_burstIndex] =
        (_clickBursts[_burstIndex] || 0) + burstLength;

      saveState();

      // cleanup now that this burst is over
      burstLength = 0;
    }, getConfig().CBD.clickBurstDuration);
  };

  document.addEventListener("click", burstDetector);
  document.addEventListener("touch", burstDetector);
}

function watchScrolls() {
  const burstThresholds = getConfig().CBD.scrollBurstThresholds;
  let burstTimeout = null;
  // number of scroll in the current burst
  let burstLength = 1;

  let lastScrollTop, lastDirection;

  let _thisScrollTop, _thisDirection, _hasDirectionChanged, _burstIndex, _i;

  const burstDetector = e => {
    _thisScrollTop = document.scrollingElement.scrollTop;

    if (lastScrollTop) {
      _thisDirection = lastScrollTop - _thisScrollTop > 0 ? 1 : -1;
    }

    if (lastDirection) {
      _hasDirectionChanged = lastDirection
        ? _thisDirection !== lastDirection
        : true;
    }

    lastScrollTop = _thisScrollTop;
    lastDirection = _thisDirection;

    // A burst already started
    if (burstTimeout && _hasDirectionChanged) {
      burstLength++;
      // reset timeout to get a sequence (burst) of scroll direction changes
    }

    clearTimeout(burstTimeout);

    // prepare for end of burst
    burstTimeout = setTimeout(() => {
      // end of burst
      const scrollBursts = getCurrentPage().mouse.scrollBursts;

      // check for dead zone
      if (burstLength < burstThresholds[0]) {
        _burstIndex = 0;
      } else if (burstLength >= burstThresholds[burstThresholds.length - 1]) {
        // check if it's after the last threshold
        _burstIndex = burstThresholds.length - 1;
      } else {
        // check between which thresholds it fits
        for (_i = 0; _i < burstThresholds.length; _i++) {
          if (
            burstLength >= burstThresholds[_i] &&
            burstLength < burstThresholds[_i + 1]
          ) {
            // +1 because 0 is the dead zone
            _burstIndex = _i + 1;
            break;
          }
        }
      }

      scrollBursts[_burstIndex] =
        (scrollBursts[_burstIndex] || 0) + burstLength;

      saveState();

      // cleanup as this burst is over
      burstTimeout = 0;
      burstLength = 1;
      lastDirection = 0;
      lastScrollTop = null;
      _thisDirection = 0;
      _hasDirectionChanged = false;
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
