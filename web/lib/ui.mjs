import { h as hPreact, render, Component } from "../asset/preactX.mjs";
import htm from "../asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

import { SparkRuler, SparkHistogram } from "./sparklines.mjs";
import { Guide } from "./guide.mjs";

const DOM_ROOT = document.querySelector(".ui-container");

function update(appConfig, appState) {
  render(
    h`<${UI} appConfig=${appConfig} appState=${appState}/>`,
    document.body,
    DOM_ROOT
  );
}

class UI extends Component {
  constructor() {
    super();
  }

  render({ appConfig, appState }, state) {
    console.log("Rendering", { appConfig, appState }, state, appState.segment);

    // todo: clean up
    Object.assign(state, appState.ui);
    const setAppUIState = () => Object.assign(appState.ui, state);

    return h`
      <div class=${"ui-container theme-a " + state.mode} visible=${
      state.visible
    }>
        <img
          class="hanger"
          src="asset/daedalus.svg"
          onclick=${e =>
            e.shiftKey
              ? this.setState(
                  setAppUIState(
                    Object.assign(state, {
                      mode: state.mode === "guide" ? "dashboard" : "guide"
                    })
                  )
                )
              : this.setState(
                  setAppUIState(
                    Object.assign(state, {
                      visible: !state.visible
                    })
                  )
                )}
          />

        ${state.visible &&
          state.mode === "dashboard" &&
          renderUIContent({ appConfig, appState })}

        ${state.visible &&
          state.mode === "dashboard" &&
          renderUIControls({ appConfig, appState })}

        ${state.visible &&
          state.mode === "guide" &&
          h`<${Guide}
           config=${appConfig.ui.guide}
          />`}
      </div>
    `;
  }
}

function renderUIContent({ appConfig, appState }) {
  const nbPageViews = appState.leaf.pages.reduce(
    (sum, p) => sum + p.views.number,
    0
  );

  // ----
  // Prepare data for mouse click burst
  // Concatenate mouseBursts of all pages
  const mouseBursts = appState.leaf.pages.reduce((sum, p) => {
    Object.keys(p.mouse.bursts).forEach(nbClicks => {
      sum[nbClicks] = (sum[nbClicks] || 0) + p.mouse.bursts[nbClicks];
    });
    return sum;
  }, {});
  const maxNbClicks = Math.max(0, ...Object.keys(mouseBursts));
  // Make sure to have a minimum of columns to show
  for (let i = 1, id; i < 4; i++) {
    id = i * appConfig.CBD.clickBurstThreshold;
    mouseBursts[id] = mouseBursts[id] || 0;
  }
  // ----

  return h`<div class="content">
    <div class="leaves">
      <div class="title">Leaf</div>
      <ul class="content dataless-step">
        <li title="page views">
          <span>pv ${nbPageViews}:</span>
          <${SparkRuler}
            grades=${[
              appConfig.CBD.fidelityThreshold,
              appConfig.CBD.fidelityThreshold,
              appConfig.CBD.fidelityThreshold
            ]}
            value=${nbPageViews}
          />
        </li>
        <li title="click bursts">
          <span>${
            maxNbClicks ? mouseBursts[maxNbClicks] + "x" + maxNbClicks : "cb"
          }:
          </span>
          <${SparkHistogram} columns=${mouseBursts} />
        </li>
      </ul>
    </div>
    <div class="arrows">⇶</div>
    <div class="cbds">
      <div class="title">C.B.D.</div>
      <div class="content dataless-step">
        <div title="fidelity">
          <span>fidelity:</span>
          <span>${appState.CBD["fidelity"] || "∅"}</span>
        </div>
        <div title="rage">
          <span>rage:</span>
          <span>${appState.CBD["rage"] || "∅"}</span>
        </div>
      </div>
    </div>
    <div class="arrows">⇉</div>
    <div class="segments">
      <div class="title">Segment</div>
      <ul class="content dataless-step">
        ${Object.keys(appConfig.segmentsOfInterest).map(
          title =>
            h`<li title=${Object.values(
              appConfig.segmentsOfInterest[title]
            ).join(", ")}>
              <span>${title == appState.segment ? "▶︎" : "-"}</span>
              <span>${title}</span>
            </li>`
        )}
      </ul>
    </div>
    <div class="arrows">→</div>
  </div>`;
}

function renderUIControls({ appConfig, appState }) {
  return h`<div class="controls">
    <button onclick=${FSR.clearState}>clear</button>
  </div>`;
}

function initData() {
  return {
    mode: "guide", // "dashboard"
    visible: true
  };
}

export { update, initData };
