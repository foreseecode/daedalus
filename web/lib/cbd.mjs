function getSatisfaction(satisfaction, value) {
  return satisfaction[value ? 0 : 1];
  // return satisfaction[~~(Math.random() * 1)];
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

function getRage({ rage, clickBurstThreshold }, mouseData) {
  // using clicks and moves is hard. Each should have a different
  // weight in the final decision.

  //--------
  // rage
  let burstIndex = 0;

  const biggestBurst = Math.max(
    ...Object.keys(mouseData.bursts)
      // only consider those that occured more than 2 times
      .map(nbClicks => (mouseData.bursts[nbClicks] < 2 ? 0 : nbClicks))
  );

  burstIndex = Math.max(
    0,
    Math.min(~~(biggestBurst / clickBurstThreshold) - 1, rage.length - 1)
  );

  return rage[burstIndex];
}

//========

function initData() {
  return {
    satisfaction: null,
    rage: null,
    fidelity: null
  };
}

//========

export { initData, getSatisfaction, getFidelity, getRage };
