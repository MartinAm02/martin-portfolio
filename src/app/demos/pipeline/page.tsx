"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FloatingDemoChat } from "@/components/ChatPanel";
import { DemoImpact } from "@/components/DemoImpact";
import { ThemeControls } from "@/components/ThemeControls";
import { chatContent, demoChatContexts, type Locale } from "@/lib/data";
import { demoImpactContent, PIPELINE_DEMO_PROMPT } from "@/lib/demoPrompts";

type CommissionRow = {
  rep_id: string;
  name: string;
  region: string;
  tier: string;
  quota: number;
  total_sales: number;
  total_commission?: number;
  commission_amt?: number;
  num_transactions: number;
  avg_margin: number;
  quota_attainment: number;
};

type TrinoHealthcheck = {
  service?: string;
  host?: string;
  port?: number;
  query?: string;
  success?: boolean;
};

type TrinoRealData = {
  rows?: {
    category: string;
    products: number;
    avg_margin: number;
  }[];
};

type TrinoFederated = {
  success?: boolean;
  mode?: string;
  fallback_used?: boolean;
  attempted_real_federation?: boolean;
  staged_records?: {
    sales_enriched?: number;
    sales_reps?: number;
  };
  limitation?: string;
  rows?: {
    rep_name: string;
    region: string;
    tier: string;
    total_sales: number;
    num_transactions: number;
    quota_attainment_pct: number;
  }[];
};

type Layer = "bronze" | "silver" | "gold";

type Copy = {
  back: string;
  title: string;
  subtitle: string;
  badge: string;
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
    walkthrough: string;
    quality: string;
    trino: string;
    sql: string;
    runLog: string;
    note: string;
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
  trinoTables: {
    field: string;
    value: string;
    category: string;
    products: string;
    avgMargin: string;
    transactions: string;
  };
  layers: Record<Layer, {
    title: string;
    headline: string;
    badge: string;
  }>;
  outlierBadge: string;
  normalBadge: string;
  outlierTitle: (count: number) => string;
  outlierText: string;
  qualitySummary: string;
  success: string;
  validated: string;
  validatedFallback: string;
  exportPending: string;
  expectedFile: string;
  show: string;
  hide: string;
  technicalNote: string;
  sqlText: string;
  languageLabel: string;
  themeLabel: string;
  dark: string;
  light: string;
};

const copy: Record<Locale, Copy> = {
  es: {
    back: "Volver al portafolio",
    title: "Pipeline de Comisiones",
    subtitle: "Demo web interactivo con datos precomputados. El pipeline pesado corre fuera de Vercel con PySpark, Delta Lake, Great Expectations y Trino; esta página consume JSONs exportados desde public/data.",
    badge: "PySpark + Delta Lake + Data Quality",
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
      walkthrough: "Architecture Walkthrough",
      quality: "Reporte Great Expectations",
      trino: "Trino en Codespaces",
      sql: "SQL validado en Fase 9C",
      runLog: "Pipeline run log",
      note: "Nota técnica"
    },
    table: {
      rep: "Rep",
      region: "Región",
      tier: "Tier",
      sales: "Ventas",
      commission: "Comisión",
      quota: "Quota attainment",
      status: "Estado"
    },
    trinoTables: {
      field: "Campo",
      value: "Valor",
      category: "Categoría",
      products: "Productos",
      avgMargin: "Margen promedio",
      transactions: "Transacciones"
    },
    layers: {
      bronze: {
        title: "Bronze",
        headline: "3 sources ingested",
        badge: "Raw data — sin transformaciones aplicadas"
      },
      silver: {
        title: "Silver",
        headline: "10,351 records after quality filter",
        badge: "Validated — 10/10 quality checks passed"
      },
      gold: {
        title: "Gold",
        headline: "20 commission records - one per sales rep",
        badge: "Business-ready — agregado y verificado"
      }
    },
    outlierBadge: "⚠ Outlier",
    normalBadge: "Normal",
    outlierTitle: (count) => `Outlier analysis - ${count} reps flagged`,
    outlierText: "These reps have commission amounts more than 2 standard deviations above the mean. Possible causes: unusually high-margin deals, data entry errors, or quota misconfiguration.",
    qualitySummary: "10 total expectations · 10 successful · 0 unsuccessful · Success: true",
    success: "Success",
    validated: "Validado",
    validatedFallback: "Validado con fallback",
    exportPending: "Resultado pendiente de exportar",
    expectedFile: "Archivo esperado en public/data",
    show: "Mostrar",
    hide: "Ocultar",
    technicalNote: "Nota técnica: la federación directa Delta connector + SQLite connector queda como hardening futuro. La versión actual demuestra Trino real, SQL real y JOIN sobre dos fuentes del proyecto stageadas en memory.",
    sqlText: "Esta query se ejecuta en Trino sobre dos tablas separadas en memory, stageadas desde Delta Silver y SQLite. La federación directa con conectores Delta + SQLite queda como hardening futuro.",
    languageLabel: "Idioma",
    themeLabel: "Tema",
    dark: "Oscuro",
    light: "Claro"
  },
  en: {
    back: "Back to portfolio",
    title: "Sales Commission Pipeline",
    subtitle: "Interactive web demo with precomputed data. The heavy pipeline runs outside Vercel with PySpark, Delta Lake, Great Expectations and Trino; this page consumes exported JSONs from public/data.",
    badge: "PySpark + Delta Lake + Data Quality",
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
      walkthrough: "Architecture Walkthrough",
      quality: "Great Expectations Report",
      trino: "Trino in Codespaces",
      sql: "Phase 9C validated SQL",
      runLog: "Pipeline run log",
      note: "Technical note"
    },
    table: {
      rep: "Rep",
      region: "Region",
      tier: "Tier",
      sales: "Sales",
      commission: "Commission",
      quota: "Quota attainment",
      status: "Status"
    },
    trinoTables: {
      field: "Field",
      value: "Value",
      category: "Category",
      products: "Products",
      avgMargin: "Average margin",
      transactions: "Transactions"
    },
    layers: {
      bronze: {
        title: "Bronze",
        headline: "3 sources ingested",
        badge: "Raw data — no transformations applied"
      },
      silver: {
        title: "Silver",
        headline: "10,351 records after quality filter",
        badge: "Validated — 10/10 quality checks passed"
      },
      gold: {
        title: "Gold",
        headline: "20 commission records - one per sales rep",
        badge: "Business-ready — aggregated and verified"
      }
    },
    outlierBadge: "⚠ Outlier",
    normalBadge: "Normal",
    outlierTitle: (count) => `Outlier analysis - ${count} reps flagged`,
    outlierText: "These reps have commission amounts more than 2 standard deviations above the mean. Possible causes: unusually high-margin deals, data entry errors, or quota misconfiguration.",
    qualitySummary: "10 total expectations · 10 successful · 0 unsuccessful · Success: true",
    success: "Success",
    validated: "Validated",
    validatedFallback: "Validated with fallback",
    exportPending: "Export pending",
    expectedFile: "Expected file in public/data",
    show: "Show",
    hide: "Hide",
    technicalNote: "Technical note: direct Delta connector + SQLite connector federation remains a future hardening step. The current version demonstrates real Trino, real SQL and a JOIN over two project sources staged in memory.",
    sqlText: "This query runs in Trino over two separate memory tables staged from Delta Silver and SQLite. Direct Delta + SQLite connector federation remains a future hardening step.",
    languageLabel: "Language",
    themeLabel: "Theme",
    dark: "Dark",
    light: "Light"
  }
};

const bronzeSources = [
  { source: "SQLite (sales_reps.db)", format: "SQLite", records: "20" },
  { source: "CSV (transactions.csv)", format: "CSV / PySpark", records: "12,153" },
  { source: "Parquet (products.parquet)", format: "Parquet", records: "50" }
];

const qualityChecks = [
  { expectation: "expect_column_values_to_not_be_null", column: "rep_id", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_values_to_not_be_null", column: "commission_amt", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_values_to_be_between", column: "commission_rate", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_values_to_be_between", column: "amount", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_values_to_be_in_set", column: "tier", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_pair_values_a_to_be_greater_than_b", column: "amount > commission_amt", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_values_to_not_be_null", column: "product_id", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_values_to_not_be_null", column: "status", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_values_to_be_between", column: "margin_pct", result: "Passed", passRate: "100%" },
  { expectation: "expect_column_stdev_to_be_between", column: "commission_amt", result: "Passed", passRate: "100%" }
];

const sqlQuery = `SELECT
    r.name AS rep_name,
    r.region,
    r.tier,
    r.quota,
    SUM(t.amount) AS total_sales,
    COUNT(t.txn_id) AS num_transactions,
    ROUND(SUM(t.amount) / r.quota * 100, 1) AS quota_attainment_pct
FROM memory.default.sales_enriched t
JOIN memory.default.sales_reps r ON t.rep_id = r.rep_id
GROUP BY r.name, r.region, r.tier, r.quota
ORDER BY total_sales DESC
LIMIT 10;`;

const runLog = [
  "generate_sources.py - 20 reps, 12,153 transactions, 50 products",
  "ingest.py - Bronze layer created, 3 tables",
  "transform.py - Silver: 10,351 | Gold: 20",
  "quality.py - 10/10 expectations passed",
  "report.py - Excel + JSON exported",
  "trino_query.py - 9A, 9B and 9C validated in Codespaces"
];

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

function standardDeviation(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function commissionAmount(row: CommissionRow) {
  return row.total_commission ?? row.commission_amt ?? 0;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      return null;
    }
    return await response.json() as T;
  } catch {
    return null;
  }
}

function PendingResult({ file, t }: { file: string; t: Copy }) {
  return (
    <div className="pipeline-alert">
      <strong>{t.exportPending}</strong>
      <span>{t.expectedFile}: {file}</span>
    </div>
  );
}

export default function PipelineDemoPage() {
  const [locale, setLocale] = useState<Locale>("es");
  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [healthcheck, setHealthcheck] = useState<TrinoHealthcheck | null>(null);
  const [realData, setRealData] = useState<TrinoRealData | null>(null);
  const [federated, setFederated] = useState<TrinoFederated | null>(null);
  const [region, setRegion] = useState("all");
  const [tier, setTier] = useState("all");
  const [activeLayer, setActiveLayer] = useState<Layer>("bronze");
  const [showQuality, setShowQuality] = useState(false);
  const [showRunLog, setShowRunLog] = useState(false);

  const t = copy[locale];
  const demoChat = demoChatContexts.pipeline[locale];
  const contextPrompt = `${demoChat.context}\n\n${PIPELINE_DEMO_PROMPT}`;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [commissionRows, health, real, federatedResult] = await Promise.all([
        fetchJson<CommissionRow[]>("/data/commissions.json"),
        fetchJson<TrinoHealthcheck>("/data/trino_healthcheck.json"),
        fetchJson<TrinoRealData>("/data/trino_real_data_results.json"),
        fetchJson<TrinoFederated>("/data/trino_federated_results.json")
      ]);

      if (isMounted) {
        setRows(commissionRows ?? []);
        setHealthcheck(health);
        setRealData(real);
        setFederated(federatedResult);
      }
    }

    void loadData();

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

  const commissionValues = useMemo(() => rows.map(commissionAmount), [rows]);
  const commissionMean = average(commissionValues);
  const commissionThreshold = commissionMean + 2 * standardDeviation(commissionValues);

  const outlierRows = useMemo(
    () => filteredRows.filter((row) => commissionAmount(row) > commissionThreshold),
    [commissionThreshold, filteredRows]
  );

  const kpis = useMemo(() => ({
    avgQuota: average(filteredRows.map((row) => row.quota_attainment)),
    reps: filteredRows.length,
    totalCommission: filteredRows.reduce((sum, row) => sum + commissionAmount(row), 0),
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

  const topGoldRows = useMemo(
    () => [...rows].sort((a, b) => commissionAmount(b) - commissionAmount(a)).slice(0, 3),
    [rows]
  );

  function isOutlier(row: CommissionRow) {
    return commissionAmount(row) > commissionThreshold;
  }

  return (
    <main className="demo-page pipeline-page">
      <div className="demo-top">
        <Link className="back-link" href="/">{t.back}</Link>
        <ThemeControls labels={t} locale={locale} setLocale={setLocale} />
      </div>

      <section className="pipeline-hero">
        <span className="tag hi">{t.badge}</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      {rows.length === 0 && <PendingResult file="public/data/commissions.json" t={t} />}

      <DemoImpact content={demoImpactContent.pipeline[locale]} />

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
        </>
      )}

      <section className="tool-panel pipeline-walkthrough">
        <h2 className="pipeline-section-title">{t.sections.walkthrough}</h2>
        <div className="layer-tabs" role="tablist" aria-label={t.sections.walkthrough}>
          {(["bronze", "silver", "gold"] as Layer[]).map((layer) => (
            <button
              aria-selected={activeLayer === layer}
              className={activeLayer === layer ? "layer-tab active" : "layer-tab"}
              key={layer}
              onClick={() => setActiveLayer(layer)}
              role="tab"
              type="button"
            >
              {t.layers[layer].title}
            </button>
          ))}
        </div>
        <div className="layer-detail">
          <div>
            <h3>{t.layers[activeLayer].headline}</h3>
            <span className="badge b-amber">{t.layers[activeLayer].badge}</span>
          </div>

          {activeLayer === "bronze" && (
            <>
              <div className="pipeline-table-wrap">
                <table className="abc-table pipeline-mini-table">
                  <thead>
                    <tr><th>Source</th><th>Format</th><th>Records</th></tr>
                  </thead>
                  <tbody>
                    {bronzeSources.map((source) => (
                      <tr key={source.source}>
                        <td>{source.source}</td>
                        <td>{source.format}</td>
                        <td>{source.records}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="pipeline-note">transactions schema: <code>txn_id, rep_id, product_id, amount, date, status</code></p>
            </>
          )}

          {activeLayer === "silver" && (
            <div className="architecture-grid">
              <article className="architecture-card"><h3>10,351</h3><p>records after quality filter</p></article>
              <article className="architecture-card"><h3>1,802</h3><p>records dropped or excluded from commission calculation</p></article>
              <article className="architecture-card"><h3>Joins</h3><p>transactions ⋈ sales_reps ON rep_id<br />transactions ⋈ products ON product_id</p></article>
            </div>
          )}

          {activeLayer === "gold" && (
            <div className="architecture-grid">
              <article className="architecture-card"><h3>Senior</h3><p>8% × margin</p></article>
              <article className="architecture-card"><h3>Mid</h3><p>6% × margin</p></article>
              <article className="architecture-card"><h3>Junior</h3><p>4% × margin</p></article>
              {topGoldRows.map((row) => (
                <article className="architecture-card" key={row.rep_id}>
                  <h3>{row.name}</h3>
                  <p>{formatMoney(commissionAmount(row))} commission · {formatMoney(row.total_sales)} sales</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {rows.length > 0 && (
        <>
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
                    const flagged = isOutlier(row);

                    return (
                      <tr className={flagged ? "outlier-high" : ""} key={row.rep_id}>
                        <td>{row.name}</td>
                        <td>{row.region}</td>
                        <td>{row.tier}</td>
                        <td>{formatMoney(row.total_sales)}</td>
                        <td>{formatMoney(commissionAmount(row))}</td>
                        <td>{formatPercent(row.quota_attainment)}</td>
                        <td>
                          <span className={`class-pill ${flagged ? "outlier-pill-high" : "outlier-pill-normal"}`}>
                            {flagged ? t.outlierBadge : t.normalBadge}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pipeline-alert pipeline-outlier-note">
              <strong>{t.outlierTitle(outlierRows.length)}</strong>
              <span>{t.outlierText}</span>
            </div>
          </section>
        </>
      )}

      <section className="tool-panel">
        <div className="pipeline-architecture-head">
          <h2 className="pipeline-section-title">{t.sections.quality}</h2>
          <button className="chat-send" onClick={() => setShowQuality((current) => !current)} type="button">
            {showQuality ? t.hide : t.show}
          </button>
        </div>
        <p className="pipeline-note">{t.qualitySummary}</p>
        {showQuality && (
          <div className="pipeline-table-wrap">
            <table className="abc-table pipeline-table">
              <thead>
                <tr><th>Expectation</th><th>Column</th><th>Result</th><th>Pass Rate</th></tr>
              </thead>
              <tbody>
                {qualityChecks.map((check) => (
                  <tr key={`${check.expectation}-${check.column}`}>
                    <td>{check.expectation}</td>
                    <td>{check.column}</td>
                    <td><span className="class-pill outlier-pill-normal">{check.result}</span></td>
                    <td>{check.passRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="tool-panel">
        <h2 className="pipeline-section-title">{t.sections.trino}</h2>
        <div className="trino-card-grid">
          <article className="architecture-card">
            <div className="trino-card-head"><h3>9A · Healthcheck</h3><span className="badge b-amber">{t.validated}</span></div>
            <p>{locale === "es" ? "Trino levantó en GitHub Codespaces con Docker-in-Docker y ejecutó SELECT 1 desde Python." : "Trino ran in GitHub Codespaces with Docker-in-Docker and executed SELECT 1 from Python."}</p>
            {healthcheck ? (
              <dl className="meta-grid">
                <dt>service</dt><dd>{healthcheck.service}</dd>
                <dt>host</dt><dd>{healthcheck.host}</dd>
                <dt>port</dt><dd>{healthcheck.port}</dd>
                <dt>query</dt><dd>{healthcheck.query}</dd>
                <dt>success</dt><dd>{String(healthcheck.success)}</dd>
              </dl>
            ) : <PendingResult file="public/data/trino_healthcheck.json" t={t} />}
          </article>

          <article className="architecture-card">
            <div className="trino-card-head"><h3>{locale === "es" ? "9B · Consulta con datos reales" : "9B · Real data query"}</h3><span className="badge b-amber">{t.validated}</span></div>
            <p>{locale === "es" ? "Trino ejecutó SQL sobre datos del proyecto stageados desde products.parquet hacia memory." : "Trino executed SQL over project data staged from products.parquet into memory."}</p>
            {realData?.rows ? (
              <div className="pipeline-table-wrap">
                <table className="abc-table pipeline-mini-table">
                  <thead><tr><th>{t.trinoTables.category}</th><th>{t.trinoTables.products}</th><th>{t.trinoTables.avgMargin}</th></tr></thead>
                  <tbody>
                    {realData.rows.map((row) => (
                      <tr key={row.category}><td>{row.category}</td><td>{row.products}</td><td>{row.avg_margin}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <PendingResult file="public/data/trino_real_data_results.json" t={t} />}
          </article>

          <article className="architecture-card">
            <div className="trino-card-head"><h3>9C · Federation-style staged fallback</h3><span className="badge b-blue">{t.validatedFallback}</span></div>
            <p>{locale === "es" ? "Se intentó federación directa Delta + SQLite. Como ambos catálogos directos no están configurados todavía, la versión actual stagea Delta Silver y SQLite como tablas separadas en Trino memory y ejecuta el JOIN en SQL." : "Direct Delta + SQLite federation was attempted. Since both direct catalogs are not configured yet, the current version stages Delta Silver and SQLite as separate Trino memory tables and runs the JOIN in SQL."}</p>
            {federated ? (
              <dl className="meta-grid">
                <dt>mode</dt><dd>{federated.mode}</dd>
                <dt>success</dt><dd>{String(federated.success)}</dd>
                <dt>fallback_used</dt><dd>{String(federated.fallback_used)}</dd>
                <dt>attempted_real_federation</dt><dd>{String(federated.attempted_real_federation)}</dd>
                <dt>sales_enriched</dt><dd>{federated.staged_records?.sales_enriched}</dd>
                <dt>sales_reps</dt><dd>{federated.staged_records?.sales_reps}</dd>
                <dt>limitation</dt><dd>{federated.limitation}</dd>
              </dl>
            ) : <PendingResult file="public/data/trino_federated_results.json" t={t} />}
          </article>
        </div>

        {federated?.rows && (
          <div className="pipeline-table-wrap trino-top-table">
            <table className="abc-table pipeline-table">
              <thead>
                <tr>
                  <th>{t.table.rep}</th>
                  <th>{t.table.region}</th>
                  <th>{t.table.tier}</th>
                  <th>{t.table.sales}</th>
                  <th>{t.trinoTables.transactions}</th>
                  <th>{t.table.quota}</th>
                </tr>
              </thead>
              <tbody>
                {federated.rows.slice(0, 10).map((row) => (
                  <tr key={`${row.rep_name}-${row.region}`}>
                    <td>{row.rep_name}</td>
                    <td>{row.region}</td>
                    <td>{row.tier}</td>
                    <td>{formatMoney(row.total_sales)}</td>
                    <td>{row.num_transactions}</td>
                    <td>{formatPercent(row.quota_attainment_pct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="tool-panel">
        <h2 className="pipeline-section-title">{t.sections.sql}</h2>
        <p className="pipeline-note">{t.sqlText}</p>
        <pre className="sql-block"><code>{sqlQuery}</code></pre>
      </section>

      <section className="tool-panel">
        <div className="pipeline-architecture-head">
          <h2 className="pipeline-section-title">{t.sections.runLog}</h2>
          <button className="chat-send" onClick={() => setShowRunLog((current) => !current)} type="button">
            {showRunLog ? t.hide : t.show}
          </button>
        </div>
        {showRunLog && (
          <ul className="run-log">
            {runLog.map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        )}
      </section>

      <section className="pipeline-alert">
        <strong>{t.sections.note}</strong>
        <span>{t.technicalNote}</span>
      </section>

      <FloatingDemoChat
        chatContent={chatContent}
        contextPrompt={contextPrompt}
        initialMessage={demoChat.initialMessage}
        suggestions={demoChat.suggestions}
        title={demoChatContexts.pipeline.title}
      />
    </main>
  );
}
