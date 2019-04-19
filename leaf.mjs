let getConfig = () => console.error("leaf.init must be called");
let getState = () => console.error("leaf.init must be called");
let saveState = () => console.error("leaf.init must be called");

//========
// Page views

const getCurrentPage = () => {
  let page = getState().pages.find(p => p.origin == location.origin);
  if (!page) {
    page = {
      origin: location.origin,
      views: { number: 0, timeOfVisit: [], durationOfVisit: [] }
    };
    getState().pages.push(page);
  }
  return page;
};

const incrementPageViews = () => {
  let thisPage = getCurrentPage();

  thisPage.views.timeOfVisit.push(Date.now());
  thisPage.views.number++;

  getState().pages[thisPage.origin] = thisPage;

  saveState();
};

const addDurationPageView = () => {
  const thisPage = getCurrentPage().views;
  if (!thisPage.timeOfVisit || !thisPage.timeOfVisit.length) return;

  thisPage.durationOfVisit.push(
    Date.now() - thisPage.timeOfVisit[thisPage.timeOfVisit.length - 1]
  );

  saveState();
};

//========
// Mouse

function watchMouse() {
  watchMouseClicks();
  watchMouseMovements();
}

function watchMouseClicks() {
  const bursts = getState().mouse.bursts;

  let burstTimeout = null;
  // number of clicks in the current burst
  let burstLength = 0;
  document.addEventListener("click", e => {
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
  });
}

function watchMouseMovements() {
  const speedResolution = getConfig().CBD.mouseSpeedResolution;
  const speeds = getState().mouse.speeds;
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

  incrementPageViews();
  watchMouse();

  window.addEventListener("unload", addDurationPageView);
}

export { init };
