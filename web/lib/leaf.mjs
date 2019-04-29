let getConfig = () => console.error("leaf.init must be called");
let getState = () => console.error("leaf.init must be called");
let saveState = () => console.error("leaf.init must be called");

//========
// Page views

const getANewPage = href =>
  Object.freeze({
    href,
    views: Object.seal({
      number: 1,
      timeOfVisit: [],
      durationOfVisit: []
    }),
    mouse: Object.freeze({
      bursts: {}
    })
  });

const getCurrentPage = () => {
  let page = getState().leaf.pages.find(p => p.href == location.href);

  if (!page) {
    throw "NOT INITIALIZED";
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

function watchMouseClicks() {
  let burstTimeout = null;
  // number of clicks in the current burst
  let burstLength = 0;

  const burstDetector = e => {
    const burstThreshold = getConfig().CBD.clickBurstThreshold;

    if (burstTimeout) {
      burstLength++;
      // reset timeout to get a sequence (burst) of clicks
      clearTimeout(burstTimeout);
    }

    // prepare for end of burst
    burstTimeout = setTimeout(() => {
      // end of burst
      const bursts = getCurrentPage().mouse.bursts;

      // Less than threshold is not interesting
      if (burstLength >= burstThreshold) {
        const burstIndex = ~~(burstLength - (burstLength % burstThreshold));

        // avoid gaps for better rendering
        for (let i = burstThreshold; i <= burstIndex; i += burstThreshold) {
          bursts[i] = bursts[i] || 0;
        }

        bursts[burstIndex] = bursts[burstIndex] + 1;

        saveState();
      }

      // cleanup as this burst is over
      burstLength = 0;
    }, getConfig().clickBurstDuration);
  };

  document.addEventListener("click", burstDetector);
  document.addEventListener("touch", burstDetector);
}

//========

function init(config, state) {
  getConfig = config.get;
  getState = state.get;
  saveState = state.save;

  incrementPageViews(getCurrentPage());

  saveState();

  watchMouseClicks();

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
