import * as leaf from "./leaf.mjs";
import * as CBD from "./cbd.mjs";
import { getToxicity } from "./toxicity.mjs";

import * as ui from "./ui.mjs";

const renderUI = () => ui.update(config, state);

//========
// Config

const config = Object.freeze({
  // How long between two clicks to be part of a burst?
  clickBurstDuration: 500,

  CBD: {
    // How many clicks in a burst to be considered?
    clickBurstThreshold: 2,
    // associated w clickBurstThreshold:
    // If any of rageBurst never reached more than the threshold,
    // rageDimension[0] is on.
    // If any reaches twice the threshold, the "rage" will be rage[1].
    // And so on...
    rageDimension: ["calm", "hectic", "enraged"],

    // How many page views
    fidelityThreshold: 4,
    // associated w
    fidelityDimension: ["occasional", "regular", "fan"],

    satisfactionDimension: ["toxic", "neutral"]
  },

  // Possible segments to fit
  segmentsOfInterest: {
    sloth: {
      satisfaction: "neutral",
      rage: "calm",
      fidelity: "occasional"
    },
    tranquil: {
      satisfaction: "neutral",
      rage: "calm",
      fidelity: "regular"
    },
    hardcore: {
      satisfaction: "toxic",
      rage: "enraged",
      fidelity: "fan"
    }
  }
});

const getConfig = () => config;

//========
// State

const getDefaultState = () => ({
  leaf: leaf.initData(),
  CBD: CBD.initData()
});

let state = {
  ...getDefaultState(),
  ...JSON.parse(localStorage.getItem("daedalus"))
};

const saveState = () => {
  // make sure that the state contains at least the defaults before saving
  state = {
    ...getDefaultState,
    ...state
  };

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

const getSegments = () => {
  // Customer Based Dimensions
  state.CBD = {
    satisfactionDimension: CBD.getSatisfaction(
      state.satisfactionDimension,
      config.CBD.satisfactionDimension
    ),
    rageDimension: CBD.getRage(
      config.CBD,
      getState.leaf.pages.reduce((sum, p) => {
        Object.keys(p.mouse.bursts).forEach(nbClicks => {
          sum[nbClicks] = (sum[nbClicks] || 0) + p.mouse.bursts[nbClicks];
        });
        return sum;
      }, {})
    ),
    fidelityDimension: CBD.getFidelity(config.CBD, state.leaf.pages)
  };

  saveState();

  return Object.values(CBD).join("-");
};

//========
// API

window.FSR = { getState: () => state, getSegments, clearState };

//========

window.addEventListener("unload", () => {
  POSTSegments(getSegments());
});

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

// state.satisfactionDimension = toxicity.some(el => el.results[0].match);
// saveState();
// renderUI();
// });

//========

renderUI();
