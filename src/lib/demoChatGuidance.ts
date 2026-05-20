import type { Locale } from "@/lib/data";

export type ImpactAudience = "recruiters" | "dataLeaders" | "technicalTeams" | "business";

export type ImpactCard = {
  title: string;
  text: string;
};

export type DemoImpactContent = {
  title: string;
  cards: Record<ImpactAudience, ImpactCard>;
};

const audienceRules = `
Adaptive audience rules:
- Recruiter signals: "soy reclutador", "no entiendo el impacto", "por qué importa", "qué demuestra", "por qué debería contratarlo", "qué valor tiene", "as a recruiter", "why does this matter", "what does this show", "why hire him".
  Answer with: what it demonstrates about Martin, why it matters in a company, the transferable skill, how it connects to his experience/projects, and a brief hiring-oriented conclusion.
- Senior technical signals: "arquitectura", "producción", "escalabilidad", "trade-off", "limitación", "qué falta", "federación real", "orquestación", "cuello de botella", "architecture", "production", "scalability", "limitation", "bottleneck".
  Answer with: technical decision, honest limitation, production alternative, what is missing for production, and no exaggerated claims.
- Business signals: "cómo me ayuda", "qué decisión mejora", "qué costo reduce", "qué proceso automatiza", "cómo se usa en empresa", "qué riesgo detecta", "how does it help", "what decision", "what cost", "business use".
  Answer with: use case, operational impact, decisions enabled, and a concrete example.
- Non-technical learning signals: "explícamelo fácil", "no sé de datos", "qué significa", "explícame simple", "explain simply", "I don't know data".
  Answer with: a simple analogy, an example, connection to the demo, and minimal jargon.

General rules:
- Do not sell smoke.
- Do not claim something is production-ready if it is only a demo.
- Do not answer impact questions with only technical definitions.
- If the user is non-technical, translate technology into impact.
- If the user is technical, explain decisions and limits.
- Answer in the current interface language. If the user clearly asks in another language, answer in that language.
`.trim();

export const demoImpactContent: Record<"iris" | "abc" | "pipeline", Record<Locale, DemoImpactContent>> = {
  iris: {
    es: {
      title: "¿Por qué esto importa?",
      cards: {
        recruiters: {
          title: "Para reclutadores",
          text: "Este demo no busca resolver un problema empresarial complejo; Iris es un dataset didáctico. El valor está en cómo Martín empaqueta un modelo de machine learning para que sea entendible: probabilidades, incertidumbre, contribución de variables e interacción en tiempo real. Esto demuestra criterio técnico, comunicación y enfoque de producto."
        },
        dataLeaders: {
          title: "Para líderes de datos",
          text: "Muestra que Martín no solo entrena modelos, sino que puede convertirlos en herramientas explicables para usuarios. Ese criterio es útil cuando un modelo debe ser adoptado por áreas de negocio, operaciones o atención al cliente."
        },
        technicalTeams: {
          title: "Para equipos técnicos",
          text: "El demo usa un problema pequeño y casi linealmente separable para mostrar probabilidades, coeficientes, zonas de incertidumbre y trade-offs de complejidad. No se vende como modelo productivo, sino como una pieza didáctica de interpretabilidad y UX de ML."
        },
        business: {
          title: "Para negocio",
          text: "El patrón se puede trasladar a casos como scoring de clientes, priorización de casos, riesgo o clasificación operativa. Lo importante no es la flor, sino que el usuario pueda entender cuándo confiar en una predicción y por qué."
        }
      }
    },
    en: {
      title: "Why this matters",
      cards: {
        recruiters: {
          title: "For recruiters",
          text: "This demo is not meant to solve a complex business problem; Iris is an educational dataset. The value is in how Martin packages a machine learning model into an understandable experience: probabilities, uncertainty, feature contribution and real-time interaction. It demonstrates technical judgment, communication and product thinking."
        },
        dataLeaders: {
          title: "For data leaders",
          text: "It shows that Martin does not only train models; he can turn them into explainable tools for users. That judgment matters when a model needs adoption by business, operations or customer-facing teams."
        },
        technicalTeams: {
          title: "For technical teams",
          text: "The demo uses a small, nearly linearly separable problem to show probabilities, coefficients, uncertainty zones and complexity trade-offs. It is not positioned as a production model, but as an educational piece for ML interpretability and UX."
        },
        business: {
          title: "For business",
          text: "The pattern can be transferred to use cases such as customer scoring, case prioritization, risk or operational classification. The important part is not the flower, but helping users understand when to trust a prediction and why."
        }
      }
    }
  },
  abc: {
    es: {
      title: "¿Por qué esto importa?",
      cards: {
        recruiters: {
          title: "Para reclutadores",
          text: "Este demo muestra que Martín sabe convertir análisis en decisiones. No solo clasifica productos: genera recomendaciones, simula cambios de demanda y traduce datos de inventario en acciones de compra, abastecimiento y control."
        },
        dataLeaders: {
          title: "Para líderes de datos",
          text: "Es una pieza útil para evaluar criterio aplicado: segmenta productos por valor económico, agrega sensibilidad de demanda y propone acciones por clase. Es simple, entendible y accionable, que suele ser lo que negocio necesita para adoptar analítica."
        },
        technicalTeams: {
          title: "Para equipos técnicos",
          text: "Es una lógica determinística tipo Pareto. Para producción faltaría conectarla a ERP, histórico de demanda, lead times, reglas de stock mínimo y forecast probabilístico. Aun así, como módulo analítico, está bien planteado para priorización operativa."
        },
        business: {
          title: "Para negocio",
          text: "Ayuda a saber qué productos cuidar más, cuáles revisar con menor frecuencia y dónde podría haber baja rotación o capital inmovilizado. Impacta compras, inventario, proveedores y flujo de efectivo."
        }
      }
    },
    en: {
      title: "Why this matters",
      cards: {
        recruiters: {
          title: "For recruiters",
          text: "This demo shows that Martin can turn analysis into decisions. It does not only classify products: it generates recommendations, simulates demand changes and translates inventory data into procurement, supply and control actions."
        },
        dataLeaders: {
          title: "For data leaders",
          text: "It is useful to evaluate applied judgment: it segments products by economic value, adds demand sensitivity and proposes actions by class. It is simple, understandable and actionable, which is often what business needs to adopt analytics."
        },
        technicalTeams: {
          title: "For technical teams",
          text: "It is a deterministic Pareto-style logic. For production it would need ERP integration, demand history, lead times, minimum-stock rules and probabilistic forecasting. Still, as an analytics module, it is well framed for operational prioritization."
        },
        business: {
          title: "For business",
          text: "It helps identify which products need tighter control, which can be reviewed less frequently and where low rotation or tied-up capital may exist. It impacts procurement, inventory, suppliers and cash flow."
        }
      }
    }
  },
  pipeline: {
    es: {
      title: "¿Por qué esto importa?",
      cards: {
        recruiters: {
          title: "Para reclutadores",
          text: "Este demo demuestra que Martín no solo analiza datos; también puede construir el camino para que los datos sean confiables, auditables y consumibles. Integra fuentes, transforma datos, valida calidad, genera reportes y publica resultados en una demo web."
        },
        dataLeaders: {
          title: "Para líderes de datos",
          text: "Hay señales de trabajo real: capas Bronze/Silver/Gold, validaciones con Great Expectations, separación entre procesamiento pesado y frontend, exportación a JSON para Vercel y ejecución de Trino en Codespaces para evitar depender del entorno local."
        },
        technicalTeams: {
          title: "Para equipos técnicos",
          text: "La federación directa Delta connector + SQLite connector aún no está validada. Se implementó un federation-style staged fallback: Delta Silver y SQLite se cargan como tablas separadas en Trino memory y el JOIN se ejecuta en SQL dentro de Trino. Es una demostración honesta de Trino + SQL + staged sources, no una federación directa productiva."
        },
        business: {
          title: "Para negocio",
          text: "Este flujo automatiza reportes que normalmente dependerían de archivos manuales, valida calidad antes de tomar decisiones y publica resultados en una interfaz ligera para usuarios finales. Reduce errores, tiempos de preparación y dependencia de procesos manuales."
        }
      }
    },
    en: {
      title: "Why this matters",
      cards: {
        recruiters: {
          title: "For recruiters",
          text: "This demo shows that Martin does not only analyze data; he can build the path that makes data reliable, auditable and consumable. It integrates sources, transforms data, validates quality, generates reports and publishes results into a web demo."
        },
        dataLeaders: {
          title: "For data leaders",
          text: "It shows real-work signals: Bronze/Silver/Gold layers, Great Expectations validation, separation between heavy processing and frontend, JSON export for Vercel and Trino execution in Codespaces to avoid local-environment dependency."
        },
        technicalTeams: {
          title: "For technical teams",
          text: "Direct Delta connector + SQLite connector federation is not validated yet. A federation-style staged fallback was implemented: Delta Silver and SQLite are loaded as separate Trino memory tables and joined with SQL inside Trino. This is an honest demonstration of Trino + SQL + staged sources, not production-grade direct federation."
        },
        business: {
          title: "For business",
          text: "This flow automates reports that would otherwise depend on manual files, validates quality before decisions and publishes results into a lightweight interface for end users. It reduces errors, preparation time and dependence on manual processes."
        }
      }
    }
  }
};

export const IRIS_DEMO_PROMPT = `
Demo: Iris classifier.
Technical context: Educational Iris dataset, lightweight browser-side classifier, sliders for sepal/petal measurements, probability-style outputs, uncertainty and interpretability framing. It is not a complex business problem and should not be sold as production ML.
Impact context:
${JSON.stringify(demoImpactContent.iris, null, 2)}
${audienceRules}
`.trim();

export const ABC_DEMO_PROMPT = `
Demo: ABC inventory analysis.
Technical context: Deterministic Pareto-style ABC segmentation over a simulated dental supplies catalog for Valora Data Consulting. It includes annual demand, unit costs, annual value, cumulative value, class-based recommendations and a demand sensitivity what-if scenario.
Production caveat: A production version would need ERP integration, demand history, lead times, minimum-stock rules and probabilistic forecasting.
Impact context:
${JSON.stringify(demoImpactContent.abc, null, 2)}
${audienceRules}
`.trim();

export const PIPELINE_DEMO_PROMPT = `
Demo: Sales Commission Pipeline.
Technical context: PySpark + Delta Lake medallion pipeline with Bronze/Silver/Gold, Great Expectations 10/10 checks, JSON export consumed by Vercel, and Trino validation in Codespaces.
Validated Trino state: 9A healthcheck SELECT 1 validated, 9B real-data query over products.parquet staged into memory validated, 9C federation-style staged fallback validated.
Critical limitation: Direct Delta connector + SQLite connector federation is not validated. The demo uses staged fallback: Delta Silver and SQLite are loaded into separate Trino memory tables and joined with SQL inside Trino.
Impact context:
${JSON.stringify(demoImpactContent.pipeline, null, 2)}
${audienceRules}
`.trim();
