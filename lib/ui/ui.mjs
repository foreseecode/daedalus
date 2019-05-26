import { h as hPreact, render, Component } from "/asset/preactX.mjs";
import htm from "/asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

import leaf from "/lib/ui/leaf.mjs";
import cbd from "/lib/ui/cbd.mjs";

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
    // console.log("Rendering", { appConfig, appState }, state, appState.persona);

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

  componentDidUpdate(props, state) {
    setTimeout(() => {
      // Bring any active CBD into view
      this.base
        .querySelectorAll(`.cbds .content .cbd-list > .cbd-value.active`)
        .forEach(el => {
          // console.log(`scrollIntoView`, el);
          el.scrollIntoView({ behavior: "smooth", inline: "center" });
        });
    }, 10);
  }
}

function renderUIContent({ appConfig, appState }) {
  return h`<div class="content">

    <${leaf} config=${appConfig.CBD} state=${appState.leaf} />

    <${cbd} config=${appConfig.CBD} state=${appState.leaf} />

    <div class="personas">
      <div class="title">
        <div class="number"><div>3</div></div>
        <div>Personas</div>
      </div>

      <div class="content">
        ${Object.keys(appConfig.personasOfInterest).map(
          title =>
            h`<span
                class=${`persona ${title === appState.persona ? "active" : ""}`}
              >
              <img class="avatar" src="asset/avatar.svg" />
              <div>
                <div class="title">${title}</div>
                <div class="description">
                  ${
                    // use _description if available, otherwise compile the definition
                    appConfig.personasOfInterest[title][0]._description
                      ? appConfig.personasOfInterest[title][0]._description
                      : Object.values(appConfig.personasOfInterest[title][0])
                          .filter(cbd => !/^_/.test(cbd))
                          .join(", ")
                  }
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
    <button class="clear" onclick=${DD.clearState}>clear</button>
    <a class="read-more" href="ReadMore.html">Read more</a>
  </div>`;
}

function initData() {
  return { visible: true };
}

export { update, initData };
