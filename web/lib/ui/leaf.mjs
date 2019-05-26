import { h as hPreact, Component } from "/asset/preactX.mjs";
import htm from "/asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

import { SparkGauge, SparkHistogram } from "/lib/sparklines.mjs";

class leaf extends Component {
  constructor(props, state) {
    super();
  }

  render(props, state) {
    const leafState = props.state;
    const CBDConfig = props.config;

    // todo
    // leafState.metaData.geo
    // leafState.metaData.device

    // ----
    // Prepare data for page views
    const nbPageViews = leafState.pages.reduce(
      (sum, p) => sum + p.views.number,
      0
    );

    // ----
    // Prepare data for mouse click burst
    // Concatenate clickBursts of all pages
    const clickBursts = leafState.pages.reduce((sum, page) => {
      CBDConfig.clickBurstThresholds.forEach((nbClicks, i) => {
        sum[i] =
          (sum[i] || 0) + page.mouse.clickBursts[i] * (nbClicks * 1 || 1);
      });
      return sum;
    }, []);
    const nbClicks = leafState.pages.reduce(
      (sum, page) =>
        sum + page.mouse.clickBursts.reduce((sum, item) => sum + item, 0),
      0
    );
    // Make sure to have a minimum of columns to show
    for (let i = 0; i < 3; i++) clickBursts[i] = clickBursts[i] || 0;
    // ----

    // ----
    // Prepare data for mouse click burst
    // Concatenate scrollBursts of all pages
    const scrollBursts = leafState.pages.reduce((sum, page) => {
      CBDConfig.scrollBurstThresholds.forEach((nbScrolls, i) => {
        sum[i] =
          (sum[i] || 0) + page.mouse.scrollBursts[i] * (nbScrolls * 1 || 1);
      });
      return sum;
    }, []);
    const nbScrolls = leafState.pages.reduce(
      (sum, page) =>
        sum + page.mouse.scrollBursts.reduce((sum, item) => sum + item, 0),
      0
    );
    // Make sure to have a minimum of columns to show
    for (let i = 0; i < 3; i++) scrollBursts[i] = scrollBursts[i] || 0;
    // ----

    return h`<div class="leaves">
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
              grades=${new Array(CBDConfig.fidelityThreshold).fill(
                CBDConfig.fidelityThreshold
                //   0)
                // .reduce(
                //   (sum, itm, i) => {
                //     sum.push(sum[i] + CBDConfig.fidelityThreshold);
                //     return sum;
                //   },
                //   [CBDConfig.fidelityThreshold]
              )}
              value=${nbPageViews}
            />
          </div>
        </li>
        <li title="click bursts">
          <div class="sub">Clicks<span style="float:right">& bursts</span></div>
          <div class="activity-data">
            <div class="activity-count">${nbClicks}</div>
            <${SparkHistogram} columns=${clickBursts} />
          </div>
        </li>
        <li title="scroll bursts">
          <div class="sub">Scrolls<span style="float:right">& bursts</span></div>
          <div class="activity-data">
            <div class="activity-count">${nbScrolls}</div>
            <${SparkHistogram} columns=${scrollBursts} />
          </div>
        </li>
      </ul>
    </div>`;
  }
}

export default leaf;
