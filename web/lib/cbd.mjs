function getSatisfaction(sentiment, value) {
  return sentiment[value ? 0 : 1];
  // return sentiment[~~(Math.random() * 1)];
}

function getFidelity({ fidelity, fidelityThreshold }, pages) {
  // [{
  //   href: location.href,
  //   views: { number: 0, timeOfVisit: [], durationOfVisit: [] }
  // }]
  const totalPageViews = pages.reduce(
    (agg, page) => agg + page.views.number,
    0
  );

  return totalPageViews
    ? fidelity[
        // lower bound
        Math.max(
          0,
          // upper bound
          Math.min(fidelity.length - 1, ~~(totalPageViews / fidelityThreshold))
        )
      ]
    : "∅";
}

function getRage(
  { rage, clickBurstThresholds, scrollBurstThresholds },
  { pages }
) {
  let clickRage = 0;
  let scrollRage = 0;

  pages.forEach(page => {
    clickRage = Math.max(
      clickRage,
      // nb click bursts in the small section
      page.mouse.clickBursts[1] / clickBurstThresholds[0],
      // nb click bursts in the middle section
      page.mouse.clickBursts[2] / clickBurstThresholds[1],
      // nb click bursts in the big section
      page.mouse.clickBursts[3] / clickBurstThresholds[2]
    );
    scrollRage = Math.max(
      scrollRage,
      // nb click bursts in the small section
      page.mouse.scrollBursts[1] / scrollBurstThresholds[0],
      // nb click bursts in the middle section
      page.mouse.scrollBursts[2] / scrollBurstThresholds[1],
      // nb click bursts in the big section
      page.mouse.scrollBursts[3] / scrollBurstThresholds[2]
    );
  });

  return rage[Math.max(clickRage, scrollRage, 0)];
}

//========

function initData() {
  return {
    sentiment: null,
    rage: null,
    fidelity: null
  };
}

//========

export { initData, getSatisfaction, getFidelity, getRage };
