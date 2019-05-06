import { h as hPreact, render, Component } from "../asset/preactX.mjs";
import htm from "../asset/htm.mjs";
// https://github.com/developit/preact/search?utf8=%E2%9C%93&q=htm&type=
const h = htm.bind(hPreact);

function SparkGauge({ children, ...props }) {
  const { grades, value } = props;

  const gradesTotal = grades.reduce((s, i) => s + i, 0);
  let sumValue = 0;

  return h`<div class="sparkline sparkgauge">
      <div class="grades">
        ${Array.from({ length: grades.length }, (v, i) => {
          sumValue += grades[i];
          return h`<span class=${[
            "grade",
            value >= sumValue ? "over" : ""
          ].join(" ")} />`;
        })}
        <div
          class="marker"
          style=${{
            width: Math.min(value / gradesTotal, 1) * 100 + "%"
          }}
        />
    </div>
  </div>`;
}

function SparkRuler({ children, ...props }) {
  const { grades, value, markerStyle } = props;

  const gradesTotal = grades.reduce((s, i) => s + i, 0);
  let sumValue = 0;

  return h`<div class="sparkline sparkruler">
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
  const { columns } = props;

  const maxValue = Math.max(...Object.values(columns)) || 1;

  return h`<div class="sparkline sparkhistogram">
    <div class="columns">
      ${Object.keys(columns).map(label => {
        return h`<span class="column" title=${`${
          columns[label]
        }x${label}`} style=${{
          height: (columns[label] / maxValue) * 100 + "%"
        }}></span>`;
      })}
    </div>
  </div>`;
}

export { SparkGauge, SparkRuler, SparkHistogram };
