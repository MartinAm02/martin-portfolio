"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FloatingDemoChat } from "@/components/ChatPanel";
import { DemoImpact } from "@/components/DemoImpact";
import { ThemeControls } from "@/components/ThemeControls";
import { abcDemoContent, type AbcProduct, chatContent, demoChatContexts, type Locale } from "@/lib/data";
import { ABC_DEMO_PROMPT, demoImpactContent } from "@/lib/demoChatGuidance";

type AbcFilter = "ALL" | "A" | "B" | "C";
type AbcClass = "A" | "B" | "C";

type AbcRow = AbcProduct & {
  annualValue: number;
  share: number;
  cumulative: number;
  className: AbcClass;
};

const copy = {
  es: {
    back: "Volver al portafolio",
    badge: "Inventario · Pareto · Decisiones",
    title: "Análisis ABC",
    description: "Este análisis ABC replica un módulo de gestión de inventario para Valora Consultoría de Datos. El dataset simula un catálogo de insumos odontológicos con demanda anual, costos unitarios y valor acumulado para priorizar decisiones de abastecimiento.",
    businessTitle: "Explicación de negocio",
    businessText: "El análisis ABC aplica el principio de Pareto: pocos productos suelen explicar la mayoría del valor económico. Esto ayuda a decidir dónde invertir control operativo, alertas y negociación con proveedores.",
    recommendationsTitle: "Recomendaciones estratégicas",
    filter: "Filtro",
    all: "ALL",
    product: "Producto",
    demand: "Demanda anual",
    unitCost: "Costo unitario",
    annualValue: "Valor anual",
    cumulative: "Acumulado",
    className: "Clase",
    whatIfTitle: "Escenario What-if",
    whatIfSubtitle: "Análisis de impacto — sensibilidad de demanda",
    selectProduct: "Producto",
    demandChange: "Cambio en demanda anual",
    newAnnualValue: "Nuevo valor anual",
    classChange: "Clase original vs nueva",
    portfolioChange: "Cambio en valor total",
    noClassChange: "Sin cambio de clase",
    show: "Mostrar",
    hide: "Ocultar",
    languageLabel: "Idioma",
    themeLabel: "Tema",
    dark: "Oscuro",
    light: "Claro"
  },
  en: {
    back: "Back to portfolio",
    badge: "Inventory · Pareto · Decisions",
    title: abcDemoContent.title,
    description: "This ABC analysis replicates an inventory management module for Valora Data Consulting. The dataset simulates a dental supplies catalog with annual demand, unit costs and cumulative value to prioritize procurement decisions.",
    businessTitle: "Business explanation",
    businessText: "ABC analysis applies the Pareto principle: a small number of products often explains most of the economic value. This helps decide where to invest operational control, alerts and supplier negotiation.",
    recommendationsTitle: "Strategic recommendations",
    filter: "Filter",
    all: "ALL",
    product: "Product",
    demand: "Annual demand",
    unitCost: "Unit cost",
    annualValue: "Annual value",
    cumulative: "Cumulative",
    className: "Class",
    whatIfTitle: "What-if scenario",
    whatIfSubtitle: "Impact analysis — demand sensitivity",
    selectProduct: "Product",
    demandChange: "Annual demand change",
    newAnnualValue: "New annual value",
    classChange: "Original vs new class",
    portfolioChange: "Portfolio value change",
    noClassChange: "No class change",
    show: "Show",
    hide: "Hide",
    languageLabel: "Language",
    themeLabel: "Theme",
    dark: "Dark",
    light: "Light"
  }
};

function getClass(cumulativeShare: number): AbcClass {
  if (cumulativeShare <= 0.8) return "A";
  if (cumulativeShare <= 0.95) return "B";
  return "C";
}

function productAnnualValue(product: AbcProduct) {
  return product.revenue;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

function buildRows(products: AbcProduct[]): AbcRow[] {
  const total = products.reduce((sum, product) => sum + productAnnualValue(product), 0);
  let cumulative = 0;

  return [...products]
    .sort((a, b) => productAnnualValue(b) - productAnnualValue(a))
    .map((product) => {
      const annualValue = productAnnualValue(product);
      const share = total > 0 ? annualValue / total : 0;
      cumulative += share;

      return {
        ...product,
        annualValue,
        share,
        cumulative,
        className: getClass(cumulative)
      };
    });
}

function recommendation(locale: Locale, filter: AbcFilter, rows: AbcRow[]) {
  if (filter === "ALL") {
    return locale === "es"
      ? "Tienes productos Clase A que concentran la mayor parte del valor del inventario. Prioriza control, abastecimiento y stock de seguridad en esta categoría. Los productos Clase C pueden revisarse para consignación, baja rotación o racionalización de catálogo."
      : "You have Class A products driving most of the inventory value. Prioritize control, procurement and safety stock for this category. Class C products may be reviewed for consignment, low rotation or SKU rationalization.";
  }

  if (filter === "A") {
    return locale === "es"
      ? "Clase A — Protocolo de control estricto:\n• Revisión semanal de niveles de stock\n• Mantener stock de seguridad\n• Negociar descuentos por volumen\n• Configurar puntos de reorden con alertas automáticas"
      : "Class A — Tight control protocol:\n• Review stock levels weekly\n• Maintain safety stock\n• Negotiate volume discounts\n• Set reorder points with automatic alerts";
  }

  if (filter === "B") {
    return locale === "es"
      ? "Clase B — Control moderado:\n• Revisión mensual de inventario\n• Stock de seguridad moderado\n• Revisión trimestral de proveedores\n• Monitoreo de cambios en demanda"
      : "Class B — Moderate control:\n• Monthly inventory review\n• Moderate safety stock\n• Quarterly supplier review\n• Monitor demand shifts";
  }

  const totalValue = rows.reduce((sum, row) => sum + row.annualValue, 0);
  const cRows = rows.filter((row) => row.className === "C");
  const cValue = cRows.reduce((sum, row) => sum + row.annualValue, 0);
  const cShare = totalValue > 0 ? (cValue / totalValue) * 100 : 0;

  return locale === "es"
    ? `Clase C — Gestión simplificada:\n• Revisión trimestral o bajo demanda\n• Evaluar acuerdos de consignación\n• Considerar racionalización de SKUs\n• ${cRows.length} productos representan aproximadamente ${formatPercent(cShare)} del valor total`
    : `Class C — Simplified management:\n• Quarterly or on-demand review\n• Consider consignment agreements\n• Evaluate SKU rationalization\n• ${cRows.length} products represent approximately ${formatPercent(cShare)} of total value`;
}

export default function AbcDemoPage() {
  const [locale, setLocale] = useState<Locale>("es");
  const [products, setProducts] = useState<AbcProduct[]>(abcDemoContent.products);
  const [filter, setFilter] = useState<AbcFilter>("ALL");
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [scenarioProduct, setScenarioProduct] = useState(abcDemoContent.products[0]?.name ?? "");
  const [demandChange, setDemandChange] = useState(0);
  const t = copy[locale];
  const demoChat = demoChatContexts.abc[locale];
  const contextPrompt = `${demoChat.context}\n\n${ABC_DEMO_PROMPT}`;

  const rows = useMemo(() => buildRows(products), [products]);
  const filteredRows = useMemo(
    () => filter === "ALL" ? rows : rows.filter((row) => row.className === filter),
    [filter, rows]
  );

  const scenario = useMemo(() => {
    const selected = products.find((product) => product.name === scenarioProduct) ?? products[0];
    const currentValue = selected ? productAnnualValue(selected) : 0;
    const nextDemand = Math.max(0, (selected?.annualDemand ?? 0) * (1 + demandChange / 100));
    const nextValue = selected?.unitCost ? nextDemand * selected.unitCost : Math.max(0, currentValue * (1 + demandChange / 100));
    const adjustedProducts = products.map((product) => product.name === selected?.name ? { ...product, revenue: nextValue } : product);
    const adjustedRows = buildRows(adjustedProducts);
    const originalRow = rows.find((row) => row.name === selected?.name);
    const nextRow = adjustedRows.find((row) => row.name === selected?.name);
    const currentTotal = rows.reduce((sum, row) => sum + row.annualValue, 0);
    const nextTotal = adjustedRows.reduce((sum, row) => sum + row.annualValue, 0);

    return {
      currentClass: originalRow?.className ?? "A",
      nextClass: nextRow?.className ?? "A",
      nextValue,
      totalDelta: nextTotal - currentTotal
    };
  }, [demandChange, products, rows, scenarioProduct]);

  function updateRevenue(name: string, revenue: number) {
    setProducts((current) =>
      current.map((product) => product.name === name ? {
        ...product,
        annualDemand: product.unitCost ? Math.round(revenue / product.unitCost) : product.annualDemand,
        revenue
      } : product)
    );
  }

  return (
    <main className="demo-page abc-page">
      <div className="demo-top">
        <Link className="back-link" href="/">{t.back}</Link>
        <ThemeControls labels={t} locale={locale} setLocale={setLocale} />
      </div>
      <span className="tag hi">{t.badge}</span>
      <h1>{t.title}</h1>
      <p>{t.description}</p>

      <section className="tool-panel abc-business-panel">
        <h2 className="pipeline-section-title">{t.businessTitle}</h2>
        <p>{t.businessText}</p>
      </section>

      <DemoImpact content={demoImpactContent.abc[locale]} />

      <section className="tool-panel abc-main-panel">
        <div className="abc-toolbar">
          <label>
            {t.filter}
            <select value={filter} onChange={(event) => setFilter(event.target.value as AbcFilter)}>
              {(["ALL", "A", "B", "C"] as AbcFilter[]).map((item) => (
                <option key={item} value={item}>{item === "ALL" ? t.all : item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-grid">
          {products.map((product) => (
            <div className="field" key={product.name}>
              <label>
                <span>{product.name}</span>
                <strong>{formatMoney(productAnnualValue(product))}</strong>
              </label>
              <input
                min="0"
                max="140000"
                onChange={(event) => updateRevenue(product.name, Number(event.target.value))}
                step="1000"
                type="range"
                value={productAnnualValue(product)}
              />
            </div>
          ))}
        </div>

        <div className="abc-table-wrap">
          <table className="abc-table abc-analysis-table">
            <thead>
              <tr>
                <th>{t.product}</th>
                <th>{t.demand}</th>
                <th>{t.unitCost}</th>
                <th>{t.annualValue}</th>
                <th>{t.cumulative}</th>
                <th>{t.className}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.annualDemand?.toLocaleString("en-US") ?? "—"}</td>
                  <td>{typeof row.unitCost === "number" ? formatMoney(row.unitCost) : "—"}</td>
                  <td>{formatMoney(row.annualValue)}</td>
                  <td>{formatPercent(row.cumulative * 100)}</td>
                  <td><span className={`class-pill class-${row.className.toLowerCase()}`}>{row.className}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="tool-panel abc-recommendation">
        <h2 className="pipeline-section-title">{t.recommendationsTitle}</h2>
        <p>{recommendation(locale, filter, rows)}</p>
      </section>

      <section className="tool-panel">
        <div className="pipeline-architecture-head">
          <h2 className="pipeline-section-title">{t.whatIfTitle}</h2>
          <button className="chat-send" onClick={() => setShowWhatIf((current) => !current)} type="button">
            {showWhatIf ? t.hide : t.show}
          </button>
        </div>

        {showWhatIf && (
          <div className="abc-whatif">
            <h3>{t.whatIfSubtitle}</h3>
            <div className="field-grid">
              <label className="abc-select-field">
                {t.selectProduct}
                <select value={scenarioProduct} onChange={(event) => setScenarioProduct(event.target.value)}>
                  {products.map((product) => <option key={product.name} value={product.name}>{product.name}</option>)}
                </select>
              </label>
              <div className="field">
                <label>
                  <span>{t.demandChange}</span>
                  <strong>{demandChange > 0 ? "+" : ""}{demandChange}%</strong>
                </label>
                <input
                  min="-50"
                  max="50"
                  onChange={(event) => setDemandChange(Number(event.target.value))}
                  step="5"
                  type="range"
                  value={demandChange}
                />
              </div>
            </div>

            <div className="result-grid abc-scenario-grid">
              <article className="metric"><span>{t.newAnnualValue}</span><strong>{formatMoney(scenario.nextValue)}</strong></article>
              <article className="metric">
                <span>{t.classChange}</span>
                <strong className="abc-class-result">
                  {scenario.currentClass === scenario.nextClass
                    ? t.noClassChange
                    : <span className="class-pill class-a">{scenario.currentClass} → {scenario.nextClass}</span>}
                </strong>
              </article>
              <article className="metric"><span>{t.portfolioChange}</span><strong>{formatMoney(scenario.totalDelta)}</strong></article>
            </div>
          </div>
        )}
      </section>

      <FloatingDemoChat
        chatContent={chatContent}
        contextPrompt={contextPrompt}
        initialMessage={demoChat.initialMessage}
        suggestions={demoChat.suggestions}
        title={demoChatContexts.abc.title}
      />
    </main>
  );
}
