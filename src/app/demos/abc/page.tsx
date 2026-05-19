"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FloatingDemoChat } from "@/components/ChatPanel";
import { ThemeControls } from "@/components/ThemeControls";
import { abcDemoContent, type AbcProduct, chatContent, demoChatContexts, type Locale } from "@/lib/data";

const copy = {
  es: {
    back: "← Volver al portafolio",
    badge: "Demo funcional",
    title: "Análisis ABC",
    description: "Edita ingresos por producto y observa cómo se actualizan las clases Pareto para inventario o portafolios comerciales.",
    product: "Producto",
    revenue: "Ingresos",
    share: "Acumulado",
    className: "Clase",
    languageLabel: "Idioma",
    themeLabel: "Tema",
    dark: "Oscuro",
    light: "Claro"
  },
  en: {
    back: "← Back to portfolio",
    badge: abcDemoContent.badge,
    title: abcDemoContent.title,
    description: abcDemoContent.description,
    product: "Product",
    revenue: "Revenue",
    share: "Share",
    className: "Class",
    languageLabel: "Language",
    themeLabel: "Theme",
    dark: "Dark",
    light: "Light"
  }
};

function getClass(cumulativeShare: number) {
  if (cumulativeShare <= 0.8) return "A";
  if (cumulativeShare <= 0.95) return "B";
  return "C";
}

export default function AbcDemoPage() {
  const [locale, setLocale] = useState<Locale>("es");
  const [products, setProducts] = useState<AbcProduct[]>(abcDemoContent.products);
  const t = copy[locale];
  const demoChat = demoChatContexts.abc[locale];

  const rows = useMemo(() => {
    const total = products.reduce((sum, product) => sum + product.revenue, 0);
    let cumulative = 0;

    return [...products]
      .sort((a, b) => b.revenue - a.revenue)
      .map((product) => {
        const share = total > 0 ? product.revenue / total : 0;
        cumulative += share;

        return { ...product, share, cumulative, className: getClass(cumulative) };
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
        <Link className="back-link" href="/">{t.back}</Link>
        <ThemeControls labels={t} locale={locale} setLocale={setLocale} />
      </div>
      <span className="tag hi">{t.badge}</span>
      <h1>{t.title}</h1>
      <p>{t.description}</p>

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
              <th>{t.product}</th>
              <th>{t.revenue}</th>
              <th>{t.share}</th>
              <th>{t.className}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>${row.revenue.toLocaleString("en-US")}</td>
                <td>{Math.round(row.cumulative * 100)}%</td>
                <td><span className={`class-pill class-${row.className.toLowerCase()}`}>{row.className}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <FloatingDemoChat
        chatContent={chatContent}
        contextPrompt={demoChat.context}
        initialMessage={demoChat.initialMessage}
        suggestions={demoChat.suggestions}
        title={demoChatContexts.abc.title}
      />
    </main>
  );
}
