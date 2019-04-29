import { h as hPreact, render, Component } from "../asset/preactX.mjs";
import htm from "../asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

class Guide extends Component {
  constructor({ config }) {
    super();
    this.state = Object.assign({}, config);
  }

  render({}, state) {
    return h`
    <div class="content">
      <span style=${{
        fontFamily: '"Playfair Display", Georgia, sans-serif',
        fontSize: "large"
      }}>
        ${this.state.welcome}
      </span>
    </div>
    `;
  }
}

export { Guide };
