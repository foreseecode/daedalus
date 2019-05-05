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

  const sumBigBurst = Object.keys(mouseData.clickBursts)
    // only consider those that occured more than 2 times
    .reduce(
      (sum, nbClicks) => sum + mouseData.clickBursts[nbClicks] * nbClicks,
      0
    );

  burstIndex = Math.max(
    0,
    Math.min(~~(sumBigBurst / clickBurstThreshold) - 1, rage.length - 1)
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
