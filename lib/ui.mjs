import { h as hPreact, render, Component } from "../asset/preactX.mjs";
import htm from "../asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

const DOM_ROOT = document.querySelector(".ui-container");

function updateUI(appConfig, appState) {
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
    const currentPage = appState.pages.find(p => p.href == location.href);
    const pv = appState.pages.reduce((s, p) => s + p.views.number, 0);
    const styleTitleDimension = {
      color: "var(--c-sub)",
      marginRight: 0.3 + "em"
    };

    return h`
      <div class="ui-container theme-a" visible=${state.visible}>
        <img
          class="hanger"
          src="asset/maze.png"
          onclick=${e => this.setState({ visible: !this.state.visible })}
        />
        <div class="leaves">
          <div class="title">Leaves</div>
          <ul class="content">
            <li title="currentPage.views.number">
              pv ${pv}
              <${SparkRuler}
                grades=${[
                  appConfig.CBD.fidelityThreshold,
                  appConfig.CBD.fidelityThreshold,
                  appConfig.CBD.fidelityThreshold
                ]}
                value=${pv}
              />
            </li>
            <li title="currentPage.mouse.bursts">mb ${Object.values(
              currentPage.mouse.bursts
            ).reduce((s, b) => s + b, 0)}</li>
            <li title="currentPage.mouse.speeds">ms ${Object.values(
              currentPage.mouse.speeds
            ).reduce((s, b) => s + b, 0)}</li>
          </ul>
        </div>
        <div class="arrows">⇶</div>
        <div class="cbds">
          <div class="title">CBDs</div>
          <div class="content">
            <div title="fidelityDimension">
              <span style=${styleTitleDimension}>fidelity:</span>
              <span>${appState.currentCBDs["fidelityDimension"] || "∅"}</span>
            </div>
            <div title="satisfactionDimension">
              <span style=${styleTitleDimension}>satisfaction:</span>
              <span>${appState.currentCBDs["satisfactionDimension"] ||
                "∅"}</span>
            </div>
            <div title="rageDimension">
              <span style=${styleTitleDimension}>rage:</span>
              <span>${appState.currentCBDs["rageDimension"] || "∅"}</span>
            </div>
          </div>
        </div>
        <div class="arrows">⇉</div>
        <div class="segments">
          <div class="title">Segments</div>
          <ul class="content">
            ${Object.keys(appConfig.personasOfInterest).map(title =>
              Object.values(appConfig.personasOfInterest[title]) ==
              Object.values(appState.currentCBDs)
                ? h`<li>${title}<span style=${{ float: "right" }}>→</span></li>`
                : h`<li>${title}</li>`
            )}
          </ul>
        </div>
        <div class="arrows">→</div>
      </div>
    `;
  }
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

export { updateUI };
