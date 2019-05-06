import * as leaf from "./leaf.mjs";
import * as CBD from "./cbd.mjs";
// import { getToxicity } from "./toxicity.mjs";

import * as ui from "./ui.mjs";

const renderUI = () => ui.update(config, state);

const STATE_VALIDITY_TIME = 1000 * 60 * 60 * 3;

//========
// Config

const config = Object.freeze({
  CBD: Object.freeze({
    // How long between two clicks to be part of a burst?
    clickBurstDuration: 500,
    // How many clicks in a burst to be considered?
    clickBurstThreshold: 3,
    // associated w clickBurstThreshold:
    // If any of rageBurst never reached more than the threshold,
    // rage[0] is on.
    // If any reaches twice the threshold, the "rage" will be rage[1].
    // And so on...
    rage: ["normal", "sparse", "rage"],

    // How long between scroll direction changes to be part of a burst?
    scrollBurstDuration: 500,
    // similar to clickBursts, about scroll direction changes
    scrollBurstThreshold: 3,

    // How many page views
    fidelityThreshold: 4,
    // associated w
    fidelity: ["first time", "occasional", "superfan"],

    satisfaction: ["toxic", "neutral"]
  }),

  // Possible segments to fit
  segmentsOfInterest: {
    sloth: {
      fidelity: "occasional",
      rage: "calm"
    },
    tranquil: {
      fidelity: "regular",
      rage: "calm"
    },
    hardcore: {
      fidelity: "fan",
      rage: "hectic"
    }
  },

  ui: { visible: false }
});

const getConfig = () => config;

//========
// State

const getDefaultState = () => ({
  leaf: leaf.initData(),
  CBD: CBD.initData(),
  ui: ui.initData()
});

let state = (() => {
  let initialState = JSON.parse(localStorage.getItem("daedalus") || {});

  // Erase state if it is too old
  if (
    !initialState ||
    !initialState.t ||
    initialState.t < Date.now() - STATE_VALIDITY_TIME
  ) {
    console.warn(`expired state wiped`);
    initialState = {};
  }

  return {
    ...getDefaultState(),
    ...initialState,

    t: Date.now()
  };
})();

const saveState = () => {
  // make sure that the state contains at least the defaults before saving
  state = {
    ...getDefaultState,
    ...state,
    t: Date.now()
  };

  getCBDs();
  getSegment();

  localStorage.setItem("daedalus", JSON.stringify(state));

  return state;
};

const clearState = () => {
  state = getDefaultState();
  state.visible = true;
  saveState();
  renderUI();
};

//========
// Segment

const getCBDs = () => {
  // Customer Based Dimensions
  state.CBD = {
    fidelity: CBD.getFidelity(config.CBD, state.leaf.pages),
    rage: CBD.getRage(config.CBD, {
      clickBursts: state.leaf.pages.reduce((sum, p) => {
        Object.keys(p.mouse.clickBursts).forEach(nbClicks => {
          sum[nbClicks] = (sum[nbClicks] || 0) + p.mouse.clickBursts[nbClicks];
        });
        return sum;
      }, {})
    }),
    satisfaction: null
    // CBD.getSatisfaction(
    //   state.satisfaction,
    //   config.CBD.satisfaction
    // )
  };

  return state.CDB;
};

const getSegment = () => {
  state.segment =
    Object.keys(config.segmentsOfInterest).find(segmentTitle => {
      const segment = config.segmentsOfInterest[segmentTitle];
      return Object.keys(segment).every(
        CBDName => segment[CBDName] == state.CBD[CBDName]
      );
    }) || "∅";

  return state.segment;
};

//========
// API

window.FSR = { getState: () => state, getCBDs, getSegment, clearState };

//========

// window.addEventListener("unload", () => {
//   POSTSegments(getSegment());
// });

function POSTSegments(segments) {
  let pp = state.postedSegments;
  let segmentsToSend = segments.filter(p => !pp.includes(p));

  if (!segmentsToSend.length) return;

  segmentsToSend.forEach(p => state.postedSegments.push(p));
  saveState();

  fetch("http://localhost:3005/data", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ segment: segments[0] })
  });
}

//========

leaf.init(
  { get: getConfig },
  {
    get: () => state,
    save: () => {
      saveState();
      renderUI();
    }
  }
);

// document.getElementById("fsrButton").addEventListener("click", async e => {

// document.getElementById("fsrTextarea").addEventListener("keypress", async e => {
// let key = e.which || e.keyCode;
// // 13 is enter
// if (key !== 13) {
//   return;
// }

// const text = document.getElementById("fsrTextarea").value;
// const toxicity = await getToxicity(text);

// state.satisfaction = toxicity.some(el => el.results[0].match);
// saveState();
// renderUI();
// });

//========

renderUI();
