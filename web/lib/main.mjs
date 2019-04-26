import * as leaf from "./leaf.mjs";
import * as CBD from "./cbd.mjs";
import { getToxicity } from "./toxicity.mjs";

import { updateUI } from "./ui.mjs";

//========
// Config

const config = Object.freeze({
  // How long between two clicks to be part of a burst?
  clickBurstDuration: 500,

  CBD: {
    // How many times a speed is reached counts
    speedFrequencyThreshold: 10,
    mouseSpeedResolution: 4000,
    // How many clicks in a burst to be considered a "rage"?
    clickBurstThreshold: 4,
    // associated w clickBurstThreshold & mouseSpeed:
    // If any of rageBurst or mouseSpeed never reached more than the threshold,
    // rageDimension[0] is on.
    // If any reaches twice the threshold, the "rage" will be rage[1].
    // And so on...
    rageDimension: ["calm", "hectic", "enraged"],

    // How many page views
    fidelityThreshold: 4,
    // associated w
    fidelityDimension: ["occasional", "regular", "fan"],

    satisfactionDimension: ["toxic", "neutral"]
  }
});

const getConfig = () => config;

//========
// State

const defaultState = Object.freeze({
  pages: [],
  mouse: {
    bursts: {
      // nb clicks in a sequence: [time of occurences of this sequence]
      // 3: [1552587248349]
    },
    speeds: {}
  },
  postedPersonas: []
});

let state = {
  ...defaultState,
  ...JSON.parse(localStorage.getItem("daedalus"))
};
// HACKY is there a better way to spread nested objects?
state.mouse = { ...defaultState.mouse, ...state.mouse };

const getState = () => state;

const saveState = (/* HACKY */ updatePersonas = true) => {
  // make sure that the state contains at least the defaults before saving
  state = {
    ...defaultState,
    ...getState()
  };
  // HACKY is there a better way to spread nested objects?
  state.mouse = { ...defaultState.mouse, ...getState().mouse };

  localStorage.setItem("daedalus", JSON.stringify(state));

  //todo: /* HACKY */ just to update display
  if (updatePersonas) getPersonas();
};

const clearState = () => {
  state = null;
  saveState();
};

//========
// Persona

// Possible personas to fit
const personasOfInterest = {
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
};

const getPersonas = () => {
  // Customer Based Dimensions
  const currentCBDs = {
    satisfactionDimension: CBD.getSatisfaction(
      getState().satisfactionDimension,
      config.CBD.satisfactionDimension
    ),
    rageDimension: CBD.getRage(config.CBD, getState().mouse),
    fidelityDimension: CBD.getFidelity(config.CBD, getState().pages)
  };

  getState().currentCBDs = currentCBDs;

  saveState(false);

  POSTPersonas(Object.values(currentCBDs));

  /* HACKY */
  updateUI({ personasOfInterest }, getState());

  return Object.values(currentCBDs).join("-");
};

//========
// API

window.FSR = { getState, getPersonas, clearState };

//========

window.addEventListener("unload", () => {
  POSTPersonas(getPersonas());
});

function POSTPersonas(personas) {
  let pp = getState().postedPersonas;
  let personasToSend = personas.filter(p => !pp.includes(p));

  if (!personasToSend.length) return;

  personasToSend.forEach(p => state.postedPersonas.push(p));
  saveState(false);

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

leaf.init({ get: getConfig }, { get: getState, save: saveState });

// document.getElementById("fsrButton").addEventListener("click", async e => {

// document.getElementById("fsrTextarea").addEventListener("keypress", async e => {
// let key = e.which || e.keyCode;
// // 13 is enter
// if (key !== 13) {
//   return;
// }

// const text = document.getElementById("fsrTextarea").value;
// const toxicity = await getToxicity(text);

// getState().satisfactionDimension = toxicity.some(el => el.results[0].match);
// saveState();
// });
