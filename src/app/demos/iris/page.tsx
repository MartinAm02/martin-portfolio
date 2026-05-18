"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { irisDemoContent, uiText } from "@/lib/data";

type IrisClass = "setosa" | "versicolor" | "virginica";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function scoreIris(sepalLength: number, sepalWidth: number, petalLength: number, petalWidth: number): Record<IrisClass, number> {
  const setosaRaw = clamp(1.2 - petalLength / 3.2 - petalWidth / 1.5 + sepalWidth / 8, 0.02, 1);
  const virginicaRaw = clamp((petalLength - 4.2) / 2.5 + (petalWidth - 1.4) / 1.2 + (sepalLength - 5.8) / 5, 0.02, 1);
  const versicolorRaw = clamp(1 - Math.abs(petalLength - 4.3) / 3 - Math.abs(petalWidth - 1.3) / 1.7, 0.02, 1);
  const total = setosaRaw + versicolorRaw + virginicaRaw;

  return {
    setosa: Math.round((setosaRaw / total) * 100),
    versicolor: Math.round((versicolorRaw / total) * 100),
    virginica: Math.round((virginicaRaw / total) * 100)
  };
}

export default function IrisDemoPage() {
  const [sepalLength, setSepalLength] = useState(irisDemoContent.measurements[0].initial);
  const [sepalWidth, setSepalWidth] = useState(irisDemoContent.measurements[1].initial);
  const [petalLength, setPetalLength] = useState(irisDemoContent.measurements[2].initial);
  const [petalWidth, setPetalWidth] = useState(irisDemoContent.measurements[3].initial);

  const controls = [
    { ...irisDemoContent.measurements[0], value: sepalLength, setter: setSepalLength },
    { ...irisDemoContent.measurements[1], value: sepalWidth, setter: setSepalWidth },
    { ...irisDemoContent.measurements[2], value: petalLength, setter: setPetalLength },
    { ...irisDemoContent.measurements[3], value: petalWidth, setter: setPetalWidth }
  ];

  const scores = useMemo(
    () => scoreIris(sepalLength, sepalWidth, petalLength, petalWidth),
    [sepalLength, sepalWidth, petalLength, petalWidth]
  );

  const prediction = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "setosa";

  return (
    <main className="demo-page">
      <div className="demo-top">
        <Link className="back-link" href="/">{uiText.backToPortfolio}</Link>
        <span className="tag hi">{irisDemoContent.badge}</span>
      </div>
      <h1>{irisDemoContent.title}</h1>
      <p>{irisDemoContent.description}</p>

      <section className="tool-panel">
        <div className="field-grid">
          {controls.map((control) => (
            <div className="field" key={control.label}>
              <label>
                <span>{control.label}</span>
                <strong>{control.value.toFixed(1)} cm</strong>
              </label>
              <input
                min={control.min}
                max={control.max}
                onChange={(event) => control.setter(Number(event.target.value))}
                step="0.1"
                type="range"
                value={control.value}
              />
            </div>
          ))}
        </div>

        <div className="result-grid">
          <div className="metric">
            <span>Prediction</span>
            <strong>{prediction}</strong>
          </div>
          <div className="metric">
            <span>Setosa</span>
            <strong>{scores.setosa}%</strong>
          </div>
          <div className="metric">
            <span>Versicolor</span>
            <strong>{scores.versicolor}%</strong>
          </div>
          <div className="metric">
            <span>Virginica</span>
            <strong>{scores.virginica}%</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
