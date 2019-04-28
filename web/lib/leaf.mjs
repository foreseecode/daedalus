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
      bursts: {},
      speeds: {}
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

function watchMouse() {
  watchMouseClicks();
  watchMouseMovements();
}

function watchMouseClicks() {
  const bursts = getCurrentPage().mouse.bursts;

  let burstTimeout = null;
  // number of clicks in the current burst
  let burstLength = 0;

  const burstDetector = e => {
    if (burstTimeout) {
      burstLength++;
      // reset timeout to get a sequence of click
      clearTimeout(burstTimeout);
    }

    // prepare for end of burst
    burstTimeout = setTimeout(() => {
      // 1 would be a simple click, 2 a double-click
      if (burstLength > 2) {
        if (!bursts[burstLength]) bursts[burstLength] = 0;
        bursts[burstLength]++;
        saveState();
      }

      // cleanup as this burst is over
      burstLength = 0;
    }, getConfig().clickBurstDuration);
  };

  document.addEventListener("click", burstDetector);
  document.addEventListener("touch", burstDetector);
}

function watchMouseMovements() {
  const speedResolution = getConfig().CBD.mouseSpeedResolution;
  const speeds = getCurrentPage().mouse.speeds;
  let lastPos = null;

  document.addEventListener("mousemove", e => {
    // first time, no speed
    if (!lastPos) return (lastPos = { x: e.clientX, y: e.clientY });

    const pos = { x: e.clientX, y: e.clientY };

    let speed = Math.sqrt(
      Math.pow(pos.x - lastPos.x, 2) * Math.pow(pos.y - lastPos.y, 2)
    );
    // constrain the speed to a multiple of the speedResolution
    speed = speed - (speed % speedResolution);

    lastPos = { x: e.clientX, y: e.clientY };

    if (speed < speedResolution) return;

    if (!speeds[speed]) speeds[speed] = 1;
    else speeds[speed]++;

    saveState();
  });
}

//========

function init(config, state) {
  getConfig = config.get;
  getState = state.get;
  saveState = state.save;

  incrementPageViews(getCurrentPage());

  saveState();

  watchMouse();

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
