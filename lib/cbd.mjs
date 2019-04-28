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

function getRage(
  { rageDimension, clickBurstThreshold, speedFrequencyThreshold },
  mouseData
) {
  /* HACKY */
  // using clicks and moves is hard. Each should have a different
  // weight in the final decision.
  // And higher speeds reached should have a higher weight, etc... Lots of ideas!

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

  //--------
  // speed
  const speedIndex = Math.max(
    0,
    ...Object.keys(mouseData.speeds).map((speed, index) => {
      if (mouseData.speeds[speed] > speedFrequencyThreshold) return index;
      else return -1;
    })
  );

  return rageDimension[
    Math.min(Math.max(burstIndex, speedIndex), rageDimension.length - 1)
  ];
}

//========

function initData() {
  return {
    satisfactionDimension: 0,
    rageDimension: 0,
    fidelityDimension: 0
  };
}

//========

export { initData, getSatisfaction, getFidelity, getRage };
