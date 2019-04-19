import * as leaf from "./leaf.mjs";
import * as CBD from "./cbd.mjs";
import { getToxicity } from "./toxicity.mjs";

/**
 * - speed
 * - label certain persona
 */

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
  const CBDs = {
    satisfactionDimension: CBD.getSatisfaction(
      getState().satisfactionDimension,
      config.CBD.satisfactionDimension
    ),
    rageDimension: CBD.getRage(config.CBD, getState().mouse),
    fidelityDimension: CBD.getFidelity(config.CBD, getState().pages)
  };

  const personas = [Object.values(CBDs).join("-")];
  getState().personas = personas;
  saveState(false);

  POSTPersonas(personas);

  /* HACKY */
  updateDisplay();

  return personas;
};

//========
// DOM
function updateDisplay() {
  const persona = getState().personas[0];

  const POIIndex = Object.values(personasOfInterest).findIndex(
    poi => Object.values(poi).join("-") == persona
  );

  document.querySelector("#main").innerHTML = [
    `<div class="poi">${
    POIIndex < 0 ? `---` : Object.keys(personasOfInterest)[POIIndex]
    }</div>`,
    `current personas: <pre>${persona}</pre>`,
    `current state: <pre>${JSON.stringify(getState(), 0, 2)}</pre>`
  ].join("");
}

//========
// API

window.FSR = { getState, getPersonas, clearState };

//========

window.addEventListener("unload", e => {
  POSTPersonas(getPersonas());
});

function POSTPersonas(personas) {
  let pp = getState().postedPersonas;
  let personasToSend = personas.filter(p => !pp.includes(p));

  if (!personasToSend.length) return;

  console.warn("todo: POST personas to server", personasToSend.join(", "));

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
document.getElementById("fsrTextarea").addEventListener("keypress", async e => {

  let key = e.which || e.keyCode;
  if (key === 13) { // 13 is enter
    const text = document.getElementById("fsrTextarea").value;
    const toxicity = await getToxicity(text);
    let state = getState();
    state.satisfactionDimension = toxicity.some(el => el.results[0].match);
    saveState();
  }
});
