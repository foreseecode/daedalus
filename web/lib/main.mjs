import * as leaf from "./leaf.mjs";
import * as CBD from "./cbd.mjs";
// import * as sentiment from "./tensorflow/sentiment.mjs";

import * as ui from "./ui.mjs";

const renderUI = () => ui.update(config, state);

const STATE_VALIDITY_TIME = 1000 * 60 * 60 * 3;

//========
// Config

const config = Object.freeze({
  v: "0.0.0",
  CBD: Object.freeze({
    // How long between two clicks to be part of a burst?
    clickBurstDuration: 400,
    // bursts buckets boundaries: the first one is a dead-zone
    // clickBurstThresholds: [a, b, c],
    // -∞ ⟶ a-1 | a ⟶ b-1 | b ⟶ c-1 | c ⟶ ∞
    clickBurstThresholds: [3, 6, 12],

    // How long between scroll direction changes to be part of a burst?
    scrollBurstDuration: 400,
    // similar to clickBursts, about scroll direction changes
    scrollBurstThresholds: [3, 5, 10],

    // associated w clickBurstThreshold & scrollBurstThreshold:
    // If any of rageBurst never reached more than the threshold,
    // rage[0] is on.
    // If any reaches twice the threshold, the "rage" will be rage[1].
    // And so on...
    rage: ["calm", "sparse", "rage"],

    // ========

    // How many page views
    fidelityThreshold: 4,
    // associated w
    fidelity: ["first time", "occasional", "superfan"],

    // ========

    sentiment: ["positive", "neutral", "negative"]
  }),

  // Possible personas to fit
  personasOfInterest: {
    Tranquil: [
      {
        _description: "Regular Visitor",
        fidelity: "first time",
        rage: "calm"
      },
      {
        fidelity: "occasional",
        rage: "calm"
      }
    ],

    "Bad impression": [
      {
        _description: "Unsuccessful",
        fidelity: "first time",
        rage: "sparse"
      },
      {
        fidelity: "occasional",
        rage: "sparse"
      },
      {
        fidelity: "first time",
        rage: "rage"
      }
    ],

    Promoter: [
      {
        _description: "Happy Superfan",
        fidelity: "fan",
        rage: "calm"
      }
    ]
  },

  ui: { visible: true }
});

const getConfig = () => config;

//========
// State

const getDefaultState = () => ({
  leaf: leaf.initData(),
  CBD: CBD.initData(),
  ui: ui.initData(),
  v: getConfig().v
});

let state = (() => {
  let initialState = JSON.parse(localStorage.getItem("daedalus") || "null");

  // Erase state if it is too old
  if (
    !initialState ||
    !initialState.v ||
    initialState.v !== getConfig().v ||
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
  getPersona();

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
// Persona

const getCBDs = () => {
  // Customer Based Dimensions
  state.CBD = {
    fidelity: CBD.getFidelity(config.CBD, state.leaf.pages),
    rage: CBD.getRage(config.CBD, { pages: state.leaf.pages }),
    sentiment: null
    // CBD.getSatisfaction(
    //   state.sentiment,
    //   config.CBD.sentiment
    // )
  };

  return state.CDB;
};

const getPersona = () => {
  state.persona =
    Object.keys(config.personasOfInterest).find(personaTitle => {
      const profiles = config.personasOfInterest[personaTitle];
      return profiles.some(profile =>
        Object.keys(profile)
          .filter(k => !k.startsWith("_"))
          .every(CBDName => profile[CBDName] == state.CBD[CBDName])
      );
    }) || "∅";

  return state.persona;
};

//========
// API

window.DD = {
  getState: () => state,
  getConfig,
  getCBDs,
  getPersona,
  clearState,
  v: () => config.v,
  version: () => config.v
};

//========

// window.addEventListener("unload", () => {
//   POSTSegments(getPersona());
// });

function POSTSegments(personas) {
  let pp = state.postedSegments;
  let segmentsToSend = personas.filter(p => !pp.includes(p));

  if (!segmentsToSend.length) return;

  segmentsToSend.forEach(p => state.postedSegments.push(p));
  saveState();

  fetch("http://localhost:3005/data", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ persona: personas[0] })
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

// state.sentiment = toxicity.some(el => el.results[0].match);
// saveState();
// renderUI();
// });

//========

renderUI();
