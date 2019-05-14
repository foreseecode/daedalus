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
    console.log("Rendering", { appConfig, appState }, state, appState.persona);

    // todo: clean up
    Object.assign(state, appState.ui);
    const setAppUIState = () => Object.assign(appState.ui, state);

    return h`
      <div class="ui-container theme-a" visible=${state.visible}>
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
      sum[nbClicks] =
        (sum[nbClicks] || 0) +
        p.mouse.clickBursts[nbClicks] * (nbClicks * 1 || 1);
    });
    return sum;
  }, {});
  const nbClicks = Object.values(clickBursts).reduce(
    (sum, item) => sum + item,
    0
  );
  // Make sure to have a minimum of columns to show
  for (let i = 0; i < 3; i++) clickBursts[i] = clickBursts[i] || 0;
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
  const nbScrolls = Object.values(scrollBursts).reduce(
    (sum, item) => sum + item,
    0
  );
  // Make sure to have a minimum of columns to show
  for (let i = 0; i < 3; i++) scrollBursts[i] = scrollBursts[i] || 0;
  // ----

  return h`<div class="content">

    <div class="leaves">
      <div class="title">
        <div class="number"><div>1</div></div>
        <div>Activity</div>
      </div>

      <ul class="content">
        <li class="page-views" title="page views">
          <div class="sub">Page views</div>
          <div class="activity-data">
            <div class="activity-count">${nbPageViews}</div>
            <${SparkGauge}
              grades=${new Array(appConfig.CBD.fidelityThreshold).fill(
                appConfig.CBD.fidelityThreshold
                //   0)
                // .reduce(
                //   (sum, itm, i) => {
                //     sum.push(sum[i] + appConfig.CBD.fidelityThreshold);
                //     return sum;
                //   },
                //   [appConfig.CBD.fidelityThreshold]
              )}
              value=${nbPageViews}
            />
          </div>
        </li>
        <li title="click bursts">
          <div class="sub">Clicks</div>
          <div class="activity-data">
            <div class="activity-count">${nbClicks}</div>
            <${SparkHistogram} columns=${clickBursts} />
          </div>
        </li>
        <li title="scroll bursts">
          <div class="sub">Scrolls</div>
          <div class="activity-data">
            <div class="activity-count">${nbScrolls}</div>
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

    <div class="personas">
      <div class="title">
        <div class="number"><div>3</div></div>
        <div>Personas</div>
      </div>

      <div class="content">
        ${Object.keys(appConfig.segmentsOfInterest).map(
          title =>
            h`<span
                class=${`persona ${title === appState.persona ? "active" : ""}`}
              >
              <img class="icon" src="asset/user.svg" />
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
  return { visible: true };
}

export { update, initData };
