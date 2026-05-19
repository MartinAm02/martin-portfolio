"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/data";

type CommissionRow = {
  rep_id: string;
  name: string;
  region: string;
  tier: string;
  quota: number;
  total_sales: number;
  total_commission: number;
  num_transactions: number;
  avg_margin: number;
  quota_attainment: number;
};

type Copy = {
  back: string;
  title: string;
  subtitle: string;
  filters: {
    region: string;
    tier: string;
    all: string;
  };
  kpis: {
    sales: string;
    commission: string;
    reps: string;
    quota: string;
  };
  sections: {
    chart: string;
    table: string;
    architecture: string;
  };
  table: {
    rep: string;
    region: string;
    tier: string;
    sales: string;
    commission: string;
    quota: string;
    status: string;
  };
  outliers: {
    high: string;
    low: string;
    normal: string;
  };
  toggle: {
    show: string;
    hide: string;
  };
  codeBlocks: {
    title: string;
    text: string;
  }[];
  loading: string;
  error: string;
};

const copy: Record<Locale, Copy> = {
  es: {
    back: "← Volver al portafolio",
    title: "Pipeline de Comisiones",
    subtitle: "Demo web interactivo con datos precomputados. El pipeline real corre fuera de Vercel con PySpark, Delta Lake y validaciones de calidad; aquí solo se consume el JSON exportado para explorar resultados.",
    filters: {
      region: "Región",
      tier: "Tier",
      all: "Todos"
    },
    kpis: {
      sales: "Ventas totales",
      commission: "Comisión total",
      reps: "Reps",
      quota: "Quota attainment promedio"
    },
    sections: {
      chart: "Quota attainment por región",
      table: "Comisiones por representante",
      architecture: "Código y arquitectura"
    },
    table: {
      rep: "Rep",
      region: "Región",
      tier: "Tier",
      sales: "Ventas",
      commission: "Comisión",
      quota: "Quota attainment",
      status: "Outlier"
    },
    outliers: {
      high: "Alto",
      low: "Bajo",
      normal: "Normal"
    },
    toggle: {
      show: "Mostrar arquitectura",
      hide: "Ocultar arquitectura"
    },
    codeBlocks: [
      {
        title: "Bronze → Silver → Gold",
        text: "Bronze ingiere CSV, SQLite y Parquet. Silver filtra ventas cerradas y enriquece reps/productos. Gold agrega comisiones por representante."
      },
      {
        title: "Quality checks",
        text: "Validaciones de nulos, rangos, tiers válidos, monto mayor que comisión y desviación estándar para detectar anomalías."
      },
      {
        title: "Export JSON",
        text: "La capa Gold se exporta como public/data/commissions.json para que Vercel sirva un demo estático sin ejecutar Spark."
      }
    ],
    loading: "Cargando datos...",
    error: "No se pudieron cargar los datos del demo."
  },
  en: {
    back: "← Back to portfolio",
    title: "Sales Commission Pipeline",
    subtitle: "Interactive web demo with precomputed data. The real pipeline runs outside Vercel with PySpark, Delta Lake and data quality checks; this page only consumes the exported JSON to explore results.",
    filters: {
      region: "Region",
      tier: "Tier",
      all: "All"
    },
    kpis: {
      sales: "Total sales",
      commission: "Total commission",
      reps: "Number of reps",
      quota: "Average quota attainment"
    },
    sections: {
      chart: "Quota attainment by region",
      table: "Commissions by rep",
      architecture: "Code and architecture"
    },
    table: {
      rep: "Rep",
      region: "Region",
      tier: "Tier",
      sales: "Sales",
      commission: "Commission",
      quota: "Quota attainment",
      status: "Outlier"
    },
    outliers: {
      high: "High",
      low: "Low",
      normal: "Normal"
    },
    toggle: {
      show: "Show architecture",
      hide: "Hide architecture"
    },
    codeBlocks: [
      {
        title: "Bronze → Silver → Gold",
        text: "Bronze ingests CSV, SQLite and Parquet. Silver filters closed sales and enriches reps/products. Gold aggregates commissions by representative."
      },
      {
        title: "Quality checks",
        text: "Null checks, range checks, valid tiers, amount greater than commission and standard deviation checks for anomaly detection."
      },
      {
        title: "Export JSON",
        text: "The Gold layer is exported as public/data/commissions.json so Vercel can serve a static demo without running Spark."
      }
    ],
    loading: "Loading data...",
    error: "Could not load demo data."
  }
};

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

function average(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values: number[], percentileValue: number) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * percentileValue)));
  return sorted[index];
}

export default function PipelineDemoPage() {
  const [locale, setLocale] = useState<Locale>("es");
  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [region, setRegion] = useState("all");
  const [tier, setTier] = useState("all");
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [error, setError] = useState(false);

  const t = copy[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadRows() {
      try {
        const response = await fetch("/data/commissions.json");

        if (!response.ok) {
          throw new Error("Failed to load commissions.json");
        }

        const data = await response.json() as CommissionRow[];

        if (isMounted) {
          setRows(data);
        }
      } catch {
        if (isMounted) {
          setError(true);
        }
      }
    }

    void loadRows();

    return () => {
      isMounted = false;
    };
  }, []);

  const regions = useMemo(() => Array.from(new Set(rows.map((row) => row.region))).sort(), [rows]);
  const tiers = useMemo(() => Array.from(new Set(rows.map((row) => row.tier))).sort(), [rows]);

  const filteredRows = useMemo(
    () => rows.filter((row) => (region === "all" || row.region === region) && (tier === "all" || row.tier === tier)),
    [region, rows, tier]
  );

  const quotaValues = useMemo(() => rows.map((row) => row.quota_attainment), [rows]);
  const lowOutlier = percentile(quotaValues, 0.1);
  const highOutlier = percentile(quotaValues, 0.9);

  const kpis = useMemo(() => ({
    avgQuota: average(filteredRows.map((row) => row.quota_attainment)),
    reps: filteredRows.length,
    totalCommission: filteredRows.reduce((sum, row) => sum + row.total_commission, 0),
    totalSales: filteredRows.reduce((sum, row) => sum + row.total_sales, 0)
  }), [filteredRows]);

  const chartRows = useMemo(() => {
    const byRegion = regions.map((currentRegion) => {
      const regionRows = filteredRows.filter((row) => row.region === currentRegion);
      return {
        region: currentRegion,
        value: average(regionRows.map((row) => row.quota_attainment))
      };
    }).filter((item) => item.value > 0);

    const maxValue = Math.max(...byRegion.map((item) => item.value), 1);
    return byRegion.map((item) => ({ ...item, width: `${Math.max(6, (item.value / maxValue) * 100)}%` }));
  }, [filteredRows, regions]);

  function getOutlier(row: CommissionRow) {
    if (row.quota_attainment >= highOutlier) {
      return "high";
    }

    if (row.quota_attainment <= lowOutlier) {
      return "low";
    }

    return "normal";
  }

  return (
    <main className="demo-page pipeline-page">
      <div className="demo-top">
        <Link className="back-link" href="/">{t.back}</Link>
        <div className="lang pipeline-lang" aria-label="Language selector">
          <button className={`lb ${locale === "es" ? "on" : ""}`} onClick={() => setLocale("es")} type="button">ES</button>
          <button className={`lb ${locale === "en" ? "on" : ""}`} onClick={() => setLocale("en")} type="button">EN</button>
        </div>
      </div>

      <section className="pipeline-hero">
        <span className="tag hi">PySpark · Delta Lake · Data Quality</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      {error && <div className="pipeline-alert">{t.error}</div>}
      {!error && rows.length === 0 && <div className="pipeline-alert">{t.loading}</div>}

      {rows.length > 0 && (
        <>
          <section className="pipeline-controls">
            <label>
              {t.filters.region}
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="all">{t.filters.all}</option>
                {regions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              {t.filters.tier}
              <select value={tier} onChange={(event) => setTier(event.target.value)}>
                <option value="all">{t.filters.all}</option>
                {tiers.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </section>

          <section className="pipeline-kpis">
            <article className="metric"><span>{t.kpis.sales}</span><strong>{formatMoney(kpis.totalSales)}</strong></article>
            <article className="metric"><span>{t.kpis.commission}</span><strong>{formatMoney(kpis.totalCommission)}</strong></article>
            <article className="metric"><span>{t.kpis.reps}</span><strong>{kpis.reps}</strong></article>
            <article className="metric"><span>{t.kpis.quota}</span><strong>{formatPercent(kpis.avgQuota)}</strong></article>
          </section>

          <section className="tool-panel">
            <h2 className="pipeline-section-title">{t.sections.chart}</h2>
            <div className="quota-chart">
              {chartRows.map((item) => (
                <div className="quota-row" key={item.region}>
                  <span>{item.region}</span>
                  <div className="quota-track"><div className="quota-bar" style={{ width: item.width }} /></div>
                  <strong>{formatPercent(item.value)}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="tool-panel">
            <h2 className="pipeline-section-title">{t.sections.table}</h2>
            <div className="pipeline-table-wrap">
              <table className="abc-table pipeline-table">
                <thead>
                  <tr>
                    <th>{t.table.rep}</th>
                    <th>{t.table.region}</th>
                    <th>{t.table.tier}</th>
                    <th>{t.table.sales}</th>
                    <th>{t.table.commission}</th>
                    <th>{t.table.quota}</th>
                    <th>{t.table.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => {
                    const outlier = getOutlier(row);

                    return (
                      <tr className={outlier !== "normal" ? `outlier-${outlier}` : ""} key={row.rep_id}>
                        <td>{row.name}</td>
                        <td>{row.region}</td>
                        <td>{row.tier}</td>
                        <td>{formatMoney(row.total_sales)}</td>
                        <td>{formatMoney(row.total_commission)}</td>
                        <td>{formatPercent(row.quota_attainment)}</td>
                        <td><span className={`class-pill outlier-pill-${outlier}`}>{t.outliers[outlier]}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="tool-panel">
            <div className="pipeline-architecture-head">
              <h2 className="pipeline-section-title">{t.sections.architecture}</h2>
              <button className="chat-send" onClick={() => setShowArchitecture((current) => !current)} type="button">
                {showArchitecture ? t.toggle.hide : t.toggle.show}
              </button>
            </div>
            {showArchitecture && (
              <div className="architecture-grid">
                {t.codeBlocks.map((block) => (
                  <article className="architecture-card" key={block.title}>
                    <h3>{block.title}</h3>
                    <p>{block.text}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
