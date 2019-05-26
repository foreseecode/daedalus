import { h as hPreact, Component } from "/asset/preactX.mjs";
import htm from "/asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

class cbd extends Component {
  constructor(props, state) {
    super();
  }

  render(props, state) {
    const CBDState = props.state;
    const CBDConfig = props.config;

    return h`<div class="cbds">
      <div class="title">
        <div class="number"><div>2</div></div>
        <div>Dimensions</div>
      </div>

      <div class="content">
        <div>
          <div class="sub" style="margin-left: 0.5em;">Engagement</div>
          <div class="cbd-list">${CBDConfig["fidelity"].map(
            c =>
              h`<span class=${"cbd-value" +
                (c == CBDState["fidelity"] ? " active" : "")}>${c}</span>`
          )}</div>
        </div>
        <div>
          <div class="sub" style="margin-left: 0.5em;">Behaviour</div>
          <div class="cbd-list">${CBDConfig["rage"].map(
            c =>
              h`<span class=${"cbd-value" +
                (c == CBDState["rage"] ? " active" : "")}>${c}</span>`
          )}</div>
        </div>
        <div>
          <div class="sub" style="margin-left: 0.5em;">Sentiment</div>
          <div class="cbd-list">
            <span class=${"cbd-value" +
              (CBDState.sentiment == "positive"
                ? " active"
                : "")}><img class="avatar" src="asset/emoji-happy.svg" /></span>
            <span class=${"cbd-value" +
              (!CBDState.sentiment || CBDState.sentiment == "neutral"
                ? " active"
                : "")}><img class="avatar" src="asset/emoji-neutral.svg" /></span>
            <span class=${"cbd-value" +
              (CBDState.sentiment == "negative"
                ? " active"
                : "")}><img class="avatar" src="asset/emoji-sad.svg" /></span>
          </div>
        </div>
      </div>
    </div>`;
  }
}

export default cbd;
