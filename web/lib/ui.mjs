import { h as hPreact, render, Component } from "../asset/preactX.mjs";
import htm from "../asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

import { SparkGauge, SparkHistogram } from "./sparklines.mjs";

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
              ? this.setState(setAppUIState(state))
              : this.setState(
                  setAppUIState(
                    Object.assign(state, {
                      visible: !state.visible
                    })
                  )
                )}
          />

        ${
          state.visible
            ? renderUIContent({ appConfig, appState })
            : h`<div class="content" />`
        }

        ${
          state.visible
            ? renderUIControls({ appConfig, appState })
            : h`<div class="control" />`
        }
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
  // Concatenate clickBursts of all pages
  const clickBursts = appState.leaf.pages.reduce((sum, p) => {
    Object.keys(p.mouse.clickBursts).forEach(nbClicks => {
      sum[nbClicks] = (sum[nbClicks] || 0) + p.mouse.clickBursts[nbClicks];
    });
    return sum;
  }, {});
  const maxNbClicks = Math.max(0, ...Object.keys(clickBursts));
  // Make sure to have a minimum of columns to show
  for (let i = 1, id; i < 4; i++) {
    id = i * appConfig.CBD.clickBurstThreshold;
    clickBursts[id] = clickBursts[id] || 0;
  }
  // ----

  // ----
  // Prepare data for mouse click burst
  // Concatenate scrollBursts of all pages
  const scrollBursts = appState.leaf.pages.reduce((sum, p) => {
    Object.keys(p.mouse.scrollBursts).forEach(nbScrolls => {
      sum[nbScrolls] = (sum[nbScrolls] || 0) + p.mouse.scrollBursts[nbScrolls];
    });
    return sum;
  }, {});
  // Make sure to have a minimum of columns to show
  for (let i = 1, id; i < 4; i++) {
    id = i * appConfig.CBD.scrollBurstThreshold;
    scrollBursts[id] = scrollBursts[id] || 0;
  }
  // ----

  return h`<div class="content">

    <div class="leaves">
      <div class="title">
        <div class="number"><div>1</div></div>
        <div>User activity</div>
      </div>

      <ul class="content">
        <li title="page views">
          <div class="sub">Page views</div>
          <div class="activity-count">${nbPageViews}</div>
          <${SparkGauge}
            grades=${[
              appConfig.CBD.fidelityThreshold,
              appConfig.CBD.fidelityThreshold,
              appConfig.CBD.fidelityThreshold
            ]}
            value=${nbPageViews}
          />
        </li>
        <li title="click bursts">
          <div class="sub">Clicks</div>
          <div class="activity-data">
            <div class="activity-count">∞</div>
            <${SparkHistogram} columns=${clickBursts} />
          </div>
        </li>
        <li title="scroll bursts">
          <div class="sub">Scrolls</div>
          <div class="activity-data">
            <div class="activity-count">∞</div>
            <${SparkHistogram} columns=${scrollBursts} />
          </div>
        </li>
      </ul>
    </div>

    <div class="cbds">
      <div class="title">
        <div class="number"><div>2</div></div>
        <div>Dimensions</div>
      </div>

      <div class="content">
        <div>
          <div class="sub" style="margin-left: 0.5em;">Engagement</div>
          <div class="cbd-list">${appConfig.CBD["fidelity"].map(
            c =>
              h`<span class=${"cbd-value" +
                (c == appState.CBD["fidelity"] ? " active" : "")}>${c}</span>`
          )}</div>
        </div>
        <div>
          <div class="sub" style="margin-left: 0.5em;">Behaviour</div>
          <div class="cbd-list">${appConfig.CBD["rage"].map(
            c =>
              h`<span class=${"cbd-value" +
                (c == appState.CBD["rage"] ? " active" : "")}>${c}</span>`
          )}</div>
        </div>
      </div>
    </div>

    <div class="segments">
      <div class="title">Personas</div>

      <div class="content">
        ${Object.keys(appConfig.segmentsOfInterest).map(
          title =>
            h`<span
                class=${`segment ${title === appState.segment ? "active" : ""}`}
              >
              <img class="icon" src="../asset/user.svg" />
              <div>
                <div class="title">${title}</div>
                <div class="description">
                  ${Object.values(appConfig.segmentsOfInterest[title]).join(
                    ", "
                  )}
                </div>
              </div>
            </span>`
        )}
      </div>
    </div>

  </div>`;
}

function renderUIControls({ appConfig, appState }) {
  return h`<div class="control">
    <button class="clear" onclick=${FSR.clearState}>clear</button>
    <a class="read-more" href="ReadMore.html">Read more</a>
  </div>`;
}

function initData() {
  return { visible: false };
}

export { update, initData };
