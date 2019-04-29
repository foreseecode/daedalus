import { h as hPreact, render, Component } from "../asset/preactX.mjs";
import htm from "../asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

import { SparkRuler, SparkHistogram } from "./sparklines.mjs";

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
    this.state = { visible: true };
  }

  render({ appConfig, appState }, state) {
    console.log("Rendering", { appConfig, appState }, state);

    state.visible = appState.visible;

    return h`
      <div class="ui-container theme-a" visible=${state.visible}>
        <img
          class="hanger"
          src="asset/daedalus.svg"
          onclick=${e =>
            this.setState({ visible: (appState.visible = !state.visible) })}
        />

        ${state.visible && renderUIContent({ appConfig, appState })}

        ${state.visible && renderUIControls({ appConfig, appState })}
      </div>
    `;
  }
}

function renderUIContent({ appConfig, appState }) {
  const nbPageViews = appState.leaf.pages.reduce(
    (sum, p) => sum + p.views.number,
    0
  );

  // Concatenate mouseBursts for all pages
  const mouseBursts = appState.leaf.pages.reduce((sum, p) => {
    Object.keys(p.mouse.bursts).forEach(nbClicks => {
      sum[nbClicks] = (sum[nbClicks] || 0) + p.mouse.bursts[nbClicks];
    });
    return sum;
  }, {});

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
          <span>mb:
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
          <span>${appState.CBD["fidelityDimension"] || "∅"}</span>
        </div>
        <div title="satisfaction">
          <span>satisfaction:</span>
          <span>${appState.CBD["satisfactionDimension"] || "∅"}</span>
        </div>
        <div title="rage">
          <span>rage:</span>
          <span>${appState.CBD["rageDimension"] || "∅"}</span>
        </div>
      </div>
    </div>
    <div class="arrows">⇉</div>
    <div class="segments">
      <div class="title">Segment</div>
      <ul class="content dataless-step">
        ${Object.keys(appConfig.personasOfInterest).map(title =>
          Object.values(appConfig.personasOfInterest[title]) ==
          Object.values(appState.CBD)
            ? h`<li>${title}<span style=${{
                float: "right"
              }}>→</span></li>`
            : h`<li>${title}</li>`
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

export { update };
