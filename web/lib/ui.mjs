import { h as hPreact, render, Component } from "../asset/preactX.mjs";
import htm from "../asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

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
  const currentPage = appState.leaf.pages.find(p => p.href == location.href);
  const pv = appState.leaf.pages.reduce((s, p) => s + p.views.number, 0);

  return h`<div class="content">
    <div class="leaves">
      <div class="title">Leaves</div>
      <ul class="content">
        <li title="currentPage.views.number">
          <span>pv ${pv}</span>
          <span><${SparkRuler}
            grades=${[
              appConfig.CBD.fidelityThreshold,
              appConfig.CBD.fidelityThreshold,
              appConfig.CBD.fidelityThreshold
            ]}
            value=${pv}
          /></span>
        </li>
        <li title="currentPage.mouse.bursts">
          <span>mb</span>
          <span>${Object.values(currentPage.mouse.bursts).reduce(
            (s, b) => s + b,
            0
          )}
          </span>
        </li>
        <li title="currentPage.mouse.speeds">
          <span>ms</span>
          <span>${Object.values(currentPage.mouse.speeds).reduce(
            (s, b) => s + b,
            0
          )}
          </span>
        </li>
      </ul>
    </div>
    <div class="arrows">⇶</div>
    <div class="cbds">
      <div class="title">CBDs</div>
      <div class="content">
        <div title="fidelityDimension">
          <span>fidelity:</span>
          <span>${appState.CBD["fidelityDimension"] || "∅"}</span>
        </div>
        <div title="satisfactionDimension">
          <span>satisfaction:</span>
          <span>${appState.CBD["satisfactionDimension"] || "∅"}</span>
        </div>
        <div title="rageDimension">
          <span>rage:</span>
          <span>${appState.CBD["rageDimension"] || "∅"}</span>
        </div>
      </div>
    </div>
    <div class="arrows">⇉</div>
    <div class="segments">
      <div class="title">Segments</div>
      <ul class="content">
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

function SparkRuler({ children, ...props }) {
  const { grades, value, markerStyle } = props;

  const gradesTotal = grades.reduce((s, i) => s + i, 0);
  let sumValue = 0;

  return h`<div class="sparkline">
      <div class="grades">
        ${Array.from({ length: grades.length }, (v, i) => {
          const w = (grades[i] / gradesTotal) * 100;
          sumValue += grades[i];
          return h`<span class=${[
            "grade",
            value >= sumValue ? "over" : ""
          ].join(" ")} style=${{ width: w + "%" }} />`;
        })}
        <div
          class=${"marker " + (markerStyle || "")}
          style=${{
            width: Math.min(value / gradesTotal, 1) * 100 + "%"
          }}
        />
    </div>
  </div>`;
}

function SparkHistogram({ children, ...props }) {
  const { grades, values } = props;

  const gradesTotal = grades.reduce((s, i) => s + i, 0);
  let sumValue = 0;

  return h`<div class="sparkline">
      <div class="grades">
        ${Array.from({ length: grades.length }, (v, i) => {
          const w = (grades[i] / gradesTotal) * 100;
          sumValue += grades[i];
          return h`<span class=${[
            "grade",
            value >= sumValue ? "over" : ""
          ].join(" ")} style=${{ width: w + "%" }} />`;
        })}
        <div
          class=${"marker " + (markerStyle || "")}
          style=${{
            width: Math.min(value / gradesTotal, 1) * 100 + "%"
          }}
        />
    </div>
  </div>`;
}

export { update };
