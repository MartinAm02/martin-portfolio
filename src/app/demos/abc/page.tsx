"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { abcDemoContent, type AbcProduct, uiText } from "@/lib/data";

function getClass(cumulativeShare: number) {
  if (cumulativeShare <= 0.8) return "A";
  if (cumulativeShare <= 0.95) return "B";
  return "C";
}

export default function AbcDemoPage() {
  const [products, setProducts] = useState<AbcProduct[]>(abcDemoContent.products);

  const rows = useMemo(() => {
    const total = products.reduce((sum, product) => sum + product.revenue, 0);
    let cumulative = 0;

    return [...products]
      .sort((a, b) => b.revenue - a.revenue)
      .map((product) => {
        const share = total > 0 ? product.revenue / total : 0;
        cumulative += share;

        return {
          ...product,
          share,
          cumulative,
          className: getClass(cumulative)
        };
      });
  }, [products]);

  function updateRevenue(name: string, revenue: number) {
    setProducts((current) =>
      current.map((product) => product.name === name ? { ...product, revenue } : product)
    );
  }

  return (
    <main className="demo-page">
      <div className="demo-top">
        <Link className="back-link" href="/">{uiText.backToPortfolio}</Link>
        <span className="tag hi">{abcDemoContent.badge}</span>
      </div>
      <h1>{abcDemoContent.title}</h1>
      <p>{abcDemoContent.description}</p>

      <section className="tool-panel">
        <div className="field-grid">
          {products.map((product) => (
            <div className="field" key={product.name}>
              <label>
                <span>{product.name}</span>
                <strong>${product.revenue.toLocaleString("en-US")}</strong>
              </label>
              <input
                min="0"
                max="100000"
                onChange={(event) => updateRevenue(product.name, Number(event.target.value))}
                step="1000"
                type="range"
                value={product.revenue}
              />
            </div>
          ))}
        </div>

        <table className="abc-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
              <th>Share</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>${row.revenue.toLocaleString("en-US")}</td>
                <td>{Math.round(row.cumulative * 100)}%</td>
                <td>
                  <span className={`class-pill class-${row.className.toLowerCase()}`}>{row.className}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
