import * as leaf from "./leaf.mjs";
import * as CBD from "./cbd.mjs";
import { getSentiment } from "./tensorflow/sentiment.mjs";
import * as ui from "./ui/ui.mjs";
import { getCurrentPage } from "./leaf.mjs";
import * as mongodb from "./mongodb.mjs";

// IIFE to use await
(async function DaedalusApplication() {
  const renderUI = () => ui.update(config, state);

  const STATE_VALIDITY_TIME = 1000 * 60 * 60 * 3;

  //========
  // Config

  const config = Object.freeze({
    v: "0.0.2",
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
      fidelityThreshold: 3,
      // associated w
      fidelity: ["first time", "occasional", "superfan"],

      // ========

      sentiment: ["negative", "neutral", "positive"]
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

  const saveState = isFreshStart => {
    // console.warn(`saveState`, state);
    // make sure that the state contains at least the defaults before saving
    state = {
      ...getDefaultState(),
      ...state,
      t: Date.now()
    };

    getCBDs();
    getPersona();

    POSTPersona(state.persona, isFreshStart);

    localStorage.setItem("daedalus", JSON.stringify(state));

    return state;
  };

  const clearState = async () => {
    // reset Mongo connection / identity
    mongodbConnection = null;

    state = { visible: true };

    saveState(true);
    renderUI();
  };

  //========
  // Persona

  const getCBDs = () => {
    // Customer Based Dimensions
    state.CBD = {
      fidelity: CBD.getFidelity(config.CBD, state.leaf.pages),
      rage: CBD.getRage(config.CBD, { pages: state.leaf.pages }),
      sentiment: state.CBD.sentiment
    };

    return state.CDB;
  };

  const getPersona = () => {
    state.persona = Object.keys(config.personasOfInterest).find(
      personaTitle => {
        const profiles = config.personasOfInterest[personaTitle];
        return profiles.some(profile =>
          Object.keys(profile)
            .filter(k => !k.startsWith("_"))
            .every(CBDName => profile[CBDName] == state.CBD[CBDName])
        );
      }
    );

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
    version: () => config.v,
    getSentiment: debounceTextInput(async e => {
      e.target.className = "working";

      setTimeout(async () => {
        const lastSentiment = state.CBD.sentiment;

        const sentiments = await getSentiment(e.target.value);

        const max = Math.max(...sentiments);

        if (max === sentiments[0]) {
          state.CBD.sentiment = getConfig().CBD.sentiment[0];
          e.target.className = state.CBD.sentiment;
        } else if (max === sentiments[1]) {
          state.CBD.sentiment = getConfig().CBD.sentiment[1];
          e.target.className = state.CBD.sentiment;
        } else if (max === sentiments[2]) {
          state.CBD.sentiment = getConfig().CBD.sentiment[2];
          e.target.className = state.CBD.sentiment;
        }

        if (lastSentiment != state.CBD.sentiment) saveState();
      }, 10);
    })
  };

  function debounceTextInput(fn) {
    let tID = 0;
    return e => {
      clearTimeout(tID);
      tID = setTimeout(() => fn(e), 500);
    };
  }

  //========

  let mongodbConnection;

  const POSTPersona = (() => {
    return async (persona, force) => {
      if (!mongodbConnection) {
        mongodbConnection = await mongodb.init();
        state.leaf.metadata.device = mongodbConnection.client.auth.deviceInfo;

        // // todo clean this grossity
        // mongodbConnection.client.callFunction("function_ip").then(result => {
        //   state.leaf.metadata.geo = result.geo;
        // });

        saveState();
      }

      if (!force && (!persona || state.lastPersonaSent == persona)) return;
      // console.log(`Posting persona "${persona}"`);

      await mongodb.postPersona(mongodbConnection, persona);
      state.lastPersonaSent = persona;
    };
  })();

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

  //========

  renderUI();
})();
