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
    this.state = { visible: false };
  }

  render({ appConfig, appState }, state) {
    const currentPage = appState.pages.find(p => p.href == location.href);

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
            <li title="currentPage.views.number">pv ${
              currentPage.views.number
            }</li>
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
              <div style="color:var(--c-sub);text-align:left">fidelity:</div>
              <div style="text-align:right">${appState.currentCBDs[
                "fidelityDimension"
              ] || "∅"}</div>
            </div>
            <div title="satisfactionDimension">
              <div style="color:var(--c-sub);text-align:left">satisfaction:</div>
              <div style="text-align:right">${appState.currentCBDs[
                "satisfactionDimension"
              ] || "∅"}</div>
            </div>
            <div title="ragDimension">
              <div style="color:var(--c-sub);text-align:left">rage:</div>
              <div style="text-align:right">${appState.currentCBDs[
                "rageDimension"
              ] || "∅"}</div>
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
                ? h`<li>${title}<span style="float:right">→</span></li>`
                : h`<li>${title}</li>`
            )}
          </ul>
        </div>
        <div class="arrows">→</div>
      </div>
    `;
  }
}

export { updateUI };
