function getSatisfaction(satisfaction, satisfactionDimension) {
  return satisfactionDimension[satisfaction ? 0 : 1];
  // return satisfactionDimension[~~(Math.random() * 1)];
}

function getFidelity({ fidelityDimension, fidelityThreshold }, pages) {
  // [{
  //   href: location.href,
  //   views: { number: 0, timeOfVisit: [], durationOfVisit: [] }
  // }]
  const totalPageViews = pages.reduce(
    (agg, page) => agg + page.views.number,
    0
  );

  return fidelityDimension[
    // lower bound
    Math.max(
      0,
      // upper bound
      Math.min(
        fidelityDimension.length - 1,
        ~~(totalPageViews / fidelityThreshold)
      )
    )
  ];
}

function getRage({ rageDimension, clickBurstThreshold }, mouseData) {
  // using clicks and moves is hard. Each should have a different
  // weight in the final decision.

  //--------
  // rage
  let burstIndex = 0;

  const biggestBurst = Math.max(...Object.keys(mouseData.bursts));

  // more than minimum
  if (biggestBurst > clickBurstThreshold) {
    burstIndex = Math.min(
      ~~(biggestBurst / clickBurstThreshold),
      rageDimension.length - 1
    );
  }
}

//========

function initData() {
  return {
    satisfactionDimension: null,
    rageDimension: null,
    fidelityDimension: null
  };
}

//========

export { initData, getSatisfaction, getFidelity, getRage };
