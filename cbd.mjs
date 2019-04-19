function getSatisfaction(satisfaction, satisfactionDimension) {

  return satisfactionDimension[satisfaction ? 0 : 1];

  console.error(`TODO: guess customer satisfaction`);
  return satisfactionDimension[~~(Math.random() * 1)];
}

function getFidelity({ fidelityDimension, fidelityThreshold }, pages) {
  // [{
  //   origin: location.origin,
  //   views: { number: 0, timeOfVisit: [], durationOfVisit: [] }
  // }]
  const totalPageViews = pages.reduce(
    (agg, page) => agg + page.views.number,
    0
  );

  return fidelityDimension[~~(totalPageViews / fidelityThreshold)];
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

export { getSatisfaction, getFidelity, getRage };
