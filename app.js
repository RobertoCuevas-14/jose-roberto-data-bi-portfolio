const grid = document.querySelector("#project-grid");
const search = document.querySelector("#search");
const filterButtons = [...document.querySelectorAll(".filter")];
const dialog = document.querySelector("#project-dialog");
const detail = document.querySelector("#project-detail");
const closeDialog = document.querySelector(".dialog-close");

let projects = [];
let activeFilter = "all";

if (window.location.protocol === "file:") {
  const notice = document.createElement("div");
  notice.className = "local-notice";
  notice.innerHTML = `
    <strong>Modo local:</strong>
    Para descargar workbooks o notebooks sin bloqueos, abre la versión en
    <code>http://localhost:4173</code>.
  `;
  document.body.prepend(notice);
}

const sqlSnippets = {
  "mercadolibre-funnel-retention": `-- MercadoLibre Funnel & Retention Analysis
-- Applied analytics SQL for cohort retention and conversion funnel analysis.

-- 1) Cohort retention by signup month.
WITH cohort AS (
  SELECT
    user_id,
    TO_CHAR(DATE_TRUNC('month', MIN(signup_date)), 'YYYY-MM') AS cohort
  FROM mercadolibre_retention
  GROUP BY user_id
),
activity AS (
  SELECT
    r.user_id,
    c.cohort,
    r.day_after_signup,
    r.active
  FROM mercadolibre_retention r
  LEFT JOIN cohort c
    ON r.user_id = c.user_id
  WHERE r.activity_date BETWEEN '2025-01-01' AND '2025-08-31'
)
SELECT
  cohort,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN day_after_signup >= 7 AND active = 1 THEN user_id END) / NULLIF(COUNT(DISTINCT user_id), 0), 1) AS retention_d7_pct,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN day_after_signup >= 14 AND active = 1 THEN user_id END) / NULLIF(COUNT(DISTINCT user_id), 0), 1) AS retention_d14_pct,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN day_after_signup >= 21 AND active = 1 THEN user_id END) / NULLIF(COUNT(DISTINCT user_id), 0), 1) AS retention_d21_pct,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN day_after_signup >= 28 AND active = 1 THEN user_id END) / NULLIF(COUNT(DISTINCT user_id), 0), 1) AS retention_d28_pct
FROM activity
GROUP BY cohort
ORDER BY cohort;

-- 2) Conversion funnel by country.
WITH first_visits AS (
  SELECT DISTINCT user_id, country
  FROM mercadolibre_funnel
  WHERE event_name = 'first_visit'
    AND event_date BETWEEN '2025-01-01' AND '2025-08-31'
),
select_item AS (
  SELECT DISTINCT user_id, country
  FROM mercadolibre_funnel
  WHERE event_name IN ('select_item', 'select_promotion')
    AND event_date BETWEEN '2025-01-01' AND '2025-08-31'
),
add_to_cart AS (
  SELECT DISTINCT user_id, country
  FROM mercadolibre_funnel
  WHERE event_name = 'add_to_cart'
    AND event_date BETWEEN '2025-01-01' AND '2025-08-31'
),
begin_checkout AS (
  SELECT DISTINCT user_id, country
  FROM mercadolibre_funnel
  WHERE event_name = 'begin_checkout'
    AND event_date BETWEEN '2025-01-01' AND '2025-08-31'
),
add_shipping_info AS (
  SELECT DISTINCT user_id, country
  FROM mercadolibre_funnel
  WHERE event_name = 'add_shipping_info'
    AND event_date BETWEEN '2025-01-01' AND '2025-08-31'
),
add_payment_info AS (
  SELECT DISTINCT user_id, country
  FROM mercadolibre_funnel
  WHERE event_name = 'add_payment_info'
    AND event_date BETWEEN '2025-01-01' AND '2025-08-31'
),
purchase AS (
  SELECT DISTINCT user_id, country
  FROM mercadolibre_funnel
  WHERE event_name = 'purchase'
    AND event_date BETWEEN '2025-01-01' AND '2025-08-31'
),
funnel_counts AS (
  SELECT
    fv.country,
    COUNT(fv.user_id) AS usuarios_first_visit,
    COUNT(si.user_id) AS usuarios_select_item,
    COUNT(a.user_id) AS usuarios_add_to_cart,
    COUNT(bc.user_id) AS usuarios_begin_checkout,
    COUNT(asi.user_id) AS usuarios_add_shipping_info,
    COUNT(api.user_id) AS usuarios_add_payment_info,
    COUNT(p.user_id) AS usuarios_purchase
  FROM first_visits fv
  LEFT JOIN select_item si
    ON fv.user_id = si.user_id
   AND fv.country = si.country
  LEFT JOIN add_to_cart a
    ON fv.user_id = a.user_id
   AND fv.country = a.country
  LEFT JOIN begin_checkout bc
    ON fv.user_id = bc.user_id
   AND fv.country = bc.country
  LEFT JOIN add_shipping_info asi
    ON fv.user_id = asi.user_id
   AND fv.country = asi.country
  LEFT JOIN add_payment_info api
    ON fv.user_id = api.user_id
   AND fv.country = api.country
  LEFT JOIN purchase p
    ON fv.user_id = p.user_id
   AND fv.country = p.country
  GROUP BY fv.country
)
SELECT
  country,
  usuarios_select_item * 100.0 / NULLIF(usuarios_first_visit, 0) AS conversion_select_item,
  usuarios_add_to_cart * 100.0 / NULLIF(usuarios_first_visit, 0) AS conversion_add_to_cart,
  usuarios_begin_checkout * 100.0 / NULLIF(usuarios_first_visit, 0) AS conversion_begin_checkout,
  usuarios_add_shipping_info * 100.0 / NULLIF(usuarios_first_visit, 0) AS conversion_add_shipping_info,
  usuarios_add_payment_info * 100.0 / NULLIF(usuarios_first_visit, 0) AS conversion_add_payment_info,
  usuarios_purchase * 100.0 / NULLIF(usuarios_first_visit, 0) AS conversion_purchase
FROM funnel_counts
ORDER BY conversion_purchase DESC;`
};


const fallbackProjects = [
  {
    id: "executive-bi-dashboard",
    name: "Executive BI Performance Dashboard",
    category: "Business Intelligence",
    status: "Confidential Case",
    filterGroup: "BI & Reporting",
    year: "2026",
    summary: "Dashboard ejecutivo para monitorear desempeño operativo, eficiencia y tendencias de negocio mediante SQL, Power BI y Python.",
    result: "Centralizó KPIs críticos, redujo tiempos de reporting manual y habilitó decisiones más rápidas para stakeholders ejecutivos y operativos.",
    stack: ["SQL", "Power BI", "Python"],
    tags: ["Business Intelligence", "Executive Reporting", "Automatización", "KPIs", "Stakeholders"],
    repo: "",
    demo: "",
    confidential: true,
    visual: "linear-gradient(135deg, #14171f 0%, #2563eb 44%, #0f8f6f 100%)",
    caseStudy: {
      context: "El área de negocio necesitaba una visión ejecutiva confiable para evaluar desempeño, detectar desviaciones y priorizar acciones operativas con base en datos actualizados.",
      problem: "Los reportes se construían de forma manual desde múltiples fuentes, generando diferencias entre versiones, retrasos en la entrega y baja visibilidad sobre los factores que impactaban los resultados.",
      objective: "Diseñar un dashboard ejecutivo que consolidara KPIs clave, automatizara el flujo de datos y permitiera a stakeholders analizar resultados por periodo, segmento, canal y unidad operativa.",
      kpis: [
        "Cumplimiento contra meta",
        "Volumen operativo",
        "Tasa de conversión",
        "Tiempo promedio de atención",
        "Productividad por equipo",
        "Backlog operativo",
        "Variación mensual",
        "Indicadores de calidad"
      ],
      analysisProcess: "Se integraron fuentes transaccionales mediante SQL, se aplicaron reglas de negocio para homologar métricas y se desarrollaron transformaciones en Python para limpieza, validación y generación de datasets analíticos. En Power BI se construyó un modelo semántico con medidas DAX, segmentadores ejecutivos y visualizaciones orientadas a lectura rápida.",
      automation: "Se automatizó la extracción, depuración y actualización de datos para reducir la intervención manual en la preparación del reporte. El flujo permitió estandarizar cortes de información, disminuir errores de consolidación y acelerar la disponibilidad del dashboard para reuniones de seguimiento.",
      insights: [
        "Se identificaron desviaciones recurrentes entre cumplimiento de meta y capacidad operativa disponible.",
        "El análisis por segmento reveló concentraciones de bajo desempeño que no eran visibles en reportes agregados.",
        "La evolución mensual mostró patrones de saturación operativa asociados a incrementos en backlog.",
        "La productividad por equipo permitió distinguir brechas de eficiencia y oportunidades de redistribución de carga."
      ],
      impact: "El proyecto mejoró la trazabilidad de KPIs, redujo el tiempo dedicado a reporting manual y fortaleció la toma de decisiones basada en datos. Los stakeholders pudieron pasar de revisar cifras aisladas a analizar causas, tendencias y prioridades de acción.",
      recommendations: [
        "Establecer umbrales de alerta para KPIs críticos y activar revisiones tempranas ante desviaciones.",
        "Priorizar planes de mejora en segmentos con bajo desempeño sostenido.",
        "Automatizar la distribución ejecutiva del dashboard antes de comités de seguimiento.",
        "Complementar el análisis con indicadores predictivos para anticipar saturación operativa."
      ],
      solution: "Se creó una solución de BI que conecta datos preparados con SQL y Python a un dashboard Power BI ejecutivo, estructurado para monitorear desempeño, detectar riesgos y comunicar recomendaciones accionables."
    }
  },
  {
    id: "customer-speech-analytics",
    name: "Customer Conversation Insights",
    category: "Speech Analytics",
    status: "Confidential Case",
    filterGroup: "Customer Insights",
    year: "2026",
    summary: "Análisis de conversaciones de clientes para identificar tendencias de sentimiento, pain points, problemas operativos y drivers de satisfacción.",
    result: "Transformó interacciones no estructuradas en insights accionables para mejorar customer experience, eficiencia operativa y priorización estratégica.",
    stack: ["SQL", "Power BI", "Python", "AI Tools"],
    tags: ["Customer Insights", "Speech Analytics", "Sentiment Analysis", "Customer Experience", "AI"],
    repo: "",
    demo: "",
    confidential: true,
    visual: "linear-gradient(135deg, #0f172a 0%, #0f8f6f 46%, #38bdf8 100%)",
    caseStudy: {
      context: "La organización necesitaba entender de forma más profunda las conversaciones con clientes para detectar señales tempranas de fricción, oportunidades de mejora y factores que influían en la satisfacción.",
      problem: "La retroalimentación del cliente se encontraba distribuida en llamadas, transcripciones y reportes operativos. Esto dificultaba identificar tendencias reales, cuantificar pain points y conectar la voz del cliente con acciones de negocio.",
      objective: "Desarrollar un modelo analítico de Speech Analytics que consolidara conversaciones, clasificara temas relevantes, midiera sentimiento y entregara dashboards ejecutivos orientados a customer experience y mejora operativa.",
      kpis: [
        "Sentimiento positivo, neutral y negativo",
        "Volumen de conversaciones por motivo de contacto",
        "Principales pain points por segmento",
        "Frecuencia de problemas operativos",
        "Drivers de satisfacción e insatisfacción",
        "Tendencia semanal de sentimiento",
        "Casos con riesgo de escalamiento",
        "Oportunidades de mejora por proceso"
      ],
      dashboardIdeas: [
        "Executive CX Overview con sentimiento, volumen, temas críticos y evolución por periodo.",
        "Pain Point Heatmap por producto, canal, segmento y motivo de contacto.",
        "Operational Issues Tracker para monitorear fallas recurrentes y áreas responsables.",
        "Customer Satisfaction Drivers con temas asociados a experiencias positivas y negativas.",
        "AI Topic Explorer para revisar clusters de conversación y ejemplos representativos."
      ],
      analysisProcess: "Se estructuraron transcripciones y metadatos de contacto mediante SQL, se aplicaron procesos de limpieza y clasificación con Python, y se utilizaron herramientas de AI para apoyar el etiquetado de temas, extracción de intención y análisis de sentimiento. En Power BI se diseñaron vistas ejecutivas para conectar tendencias de conversación con métricas operativas y prioridades de negocio.",
      automation: "Se automatizó la preparación de datasets, el etiquetado inicial de categorías, la consolidación de métricas de sentimiento y la actualización de reportes. Esto permitió pasar de revisiones manuales de muestras a un monitoreo continuo de patrones relevantes en la voz del cliente.",
      insights: [
        "Los picos de sentimiento negativo se concentraban en procesos específicos, no en toda la experiencia del cliente.",
        "Ciertos motivos de contacto mostraban alta frecuencia pero bajo impacto emocional, mientras otros tenían menor volumen y mayor riesgo reputacional.",
        "Los drivers de satisfacción estaban relacionados con resolución clara, tiempos de respuesta y comunicación proactiva.",
        "Las conversaciones con señales de confusión revelaron oportunidades para mejorar scripts, autoservicio y comunicación operativa.",
        "La segmentación por canal permitió identificar diferencias en expectativa y fricción entre perfiles de clientes."
      ],
      impact: "El proyecto permitió convertir conversaciones no estructuradas en una fuente sistemática de inteligencia de negocio. Los stakeholders pudieron priorizar mejoras con base en evidencia, reducir fricciones recurrentes y alinear decisiones operativas con la experiencia real del cliente.",
      recommendations: [
        "Implementar un comité mensual de Voice of Customer basado en tendencias de sentimiento y pain points críticos.",
        "Priorizar mejoras operativas en temas con alto sentimiento negativo y alta recurrencia.",
        "Crear alertas tempranas para conversaciones con riesgo de escalamiento o deterioro de experiencia.",
        "Alinear scripts, capacitación y contenidos de autoservicio con los principales motivos de confusión.",
        "Integrar Speech Analytics con KPIs de operación para medir el impacto de las acciones correctivas."
      ],
      solution: "Se diseñó una solución enterprise de Customer Insights que combina SQL, Python, Power BI y herramientas de AI para analizar conversaciones, detectar temas críticos y traducir la voz del cliente en recomendaciones estratégicas."
    }
  },
  {
    id: "ai-analytics-automation",
    name: "AI-Assisted Reporting & Insights Automation",
    category: "AI Analytics",
    status: "Confidential Case",
    filterGroup: "BI & Reporting",
    year: "2026",
    summary: "Solución conceptual y operativa para usar inteligencia artificial y prompt engineering en automatización de reportes, generación de insights y análisis ejecutivo de KPIs.",
    result: "Diseñó un flujo de analytics asistido por IA para acelerar diagnósticos, estandarizar narrativas ejecutivas y mejorar la productividad del reporting.",
    stack: ["SQL", "Power BI", "Python", "AI Tools", "Prompt Engineering"],
    tags: ["AI Analytics", "Prompt Engineering", "Automation", "Executive Insights", "KPI Analysis"],
    repo: "",
    demo: "",
    confidential: true,
    visual: "linear-gradient(135deg, #111827 0%, #7c3aed 44%, #14b8a6 100%)",
    caseStudy: {
      context: "Los equipos de analytics suelen invertir tiempo significativo en preparar reportes recurrentes, interpretar variaciones de KPIs y redactar resúmenes ejecutivos para distintos stakeholders.",
      problem: "El análisis manual de KPIs puede generar retrasos, diferencias en la narrativa de negocio y dependencia de revisiones individuales. Esto limita la velocidad con la que los stakeholders reciben explicaciones claras sobre cambios relevantes, riesgos y oportunidades.",
      objective: "Diseñar un flujo de automatización analítica apoyado por IA que ayude a detectar variaciones relevantes, generar borradores de insights, resumir hallazgos ejecutivos y priorizar recomendaciones de negocio.",
      tools: [
        "SQL para extracción y preparación de métricas",
        "Python para validación, reglas analíticas y automatización",
        "Power BI para visualización y distribución ejecutiva",
        "AI Tools para generación asistida de insights y resúmenes",
        "Prompt Engineering para estandarizar criterios, tono y estructura de análisis"
      ],
      automationExamples: [
        "Generación automática de resúmenes ejecutivos a partir de variaciones de KPIs.",
        "Identificación de anomalías o cambios relevantes contra periodos anteriores.",
        "Clasificación de insights por prioridad, impacto y área responsable.",
        "Creación de narrativas adaptadas para comités ejecutivos, equipos operativos y stakeholders funcionales.",
        "Sugerencia de preguntas de seguimiento para profundizar en causas raíz.",
        "Preparación de bullets ejecutivos para reportes semanales o mensuales."
      ],
      kpis: [
        "Tiempo de preparación de reportes",
        "Número de insights generados por ciclo",
        "Porcentaje de KPIs con explicación automática",
        "Reducción de tareas manuales",
        "Consistencia del storytelling ejecutivo",
        "Velocidad de entrega a stakeholders"
      ],
      analysisProcess: "Se definió una capa de métricas confiables con SQL y Power BI, complementada con scripts en Python para detectar variaciones, validar umbrales y preparar datasets resumidos. Sobre esa salida se diseñaron prompts estructurados para generar explicaciones, hipótesis y recomendaciones en lenguaje ejecutivo, manteniendo revisión humana antes de su distribución.",
      automation: "La automatización conecta datos preparados con reglas analíticas y prompts reutilizables. El flujo puede generar borradores de insights, alertas de desviación, comentarios ejecutivos y recomendaciones preliminares, reduciendo el esfuerzo repetitivo sin reemplazar el criterio del analista.",
      insights: [
        "La IA aporta mayor valor cuando trabaja sobre métricas gobernadas y contexto de negocio bien definido.",
        "Los prompts estructurados reducen variabilidad en la calidad del análisis y mejoran la consistencia del reporting.",
        "La automatización permite enfocar al analista en validación, causa raíz y toma de decisiones, no solo en producción de reportes.",
        "Los stakeholders reciben mensajes más claros cuando cada insight incluye impacto, posible causa y siguiente acción sugerida."
      ],
      impact: "El impacto esperado incluye reducción del tiempo de preparación de reportes, mayor velocidad para explicar cambios en KPIs, mejor consistencia en la comunicación ejecutiva y mayor capacidad del equipo para escalar análisis sin aumentar carga operativa.",
      stakeholderBenefits: [
        "Executives: resúmenes claros, priorizados y orientados a decisión.",
        "Operations: detección temprana de desviaciones y oportunidades de eficiencia.",
        "Analytics teams: menor carga manual y mayor foco en análisis estratégico.",
        "Business owners: recomendaciones accionables alineadas a objetivos y KPIs."
      ],
      recommendations: [
        "Implementar controles de revisión humana antes de distribuir insights generados por IA.",
        "Usar prompts versionados para mantener consistencia en tono, criterios y estructura.",
        "Conectar la generación de insights únicamente a métricas validadas y fuentes confiables.",
        "Medir productividad del flujo con indicadores de tiempo ahorrado, calidad de insight y adopción por stakeholders."
      ],
      solution: "Se propuso una arquitectura de analytics asistida por IA que combina SQL, Python, Power BI y prompt engineering para transformar KPIs en narrativas ejecutivas, alertas y recomendaciones accionables."
    }
  },
  {
    id: "mercadolibre-funnel-retention",
    name: "MercadoLibre Funnel & Retention Analysis",
    category: "Product Analytics",
    status: "Applied Project",
    filterGroup: "Applied Projects",
    year: "2026",
    summary: "Análisis de embudo y retención para identificar caídas de conversión, diferencias por país y oportunidades de mejora en la experiencia de compra.",
    result: "Detectó el principal punto de fuga entre selección de producto y carrito, además de brechas de retención temprana que pueden priorizar acciones de growth y customer experience.",
    stack: ["SQL", "Excel", "Cohort Analysis", "Funnel Analysis"],
    tags: ["Product Analytics", "Retention", "Conversion Funnel", "Cohorts", "Growth"],
    repo: "",
    demo: "",
    code: "assets/sql/mercadolibre_funnel_retention.sql",
    workbook: "assets/files/mercadolibre_funnel_retention.xlsx",
    preview: "assets/previews/mercadolibre_preview.png",
    gallery: ["assets/previews/mercadolibre_sheet_context.png"],
    visual: "linear-gradient(135deg, #111827 0%, #facc15 48%, #2563eb 100%)",
    caseStudy: {
      context: "Proyecto aplicado de analytics orientado a entender el comportamiento de usuarios dentro de un flujo de e-commerce, desde la visita inicial hasta la compra final.",
      problem: "El negocio necesitaba identificar en qué etapa del funnel se perdía mayor volumen de usuarios y cómo variaba la conversión y retención por país para priorizar acciones de mejora.",
      objective: "Analizar conversiones por etapa, detectar caídas críticas, comparar desempeño por país y medir retención en D7, D14, D21 y D28 para generar recomendaciones accionables.",
      kpis: [
        "Conversión de first visit a select item",
        "Conversión de select item a add to cart",
        "Conversión a checkout",
        "Conversión final a purchase",
        "Retención D7, D14, D21 y D28",
        "Conversión por país",
        "Retención por cohorte"
      ],
      dashboardIdeas: [
        "Vista ejecutiva del funnel completo por etapa.",
        "Comparativo de conversión final por país.",
        "Cohort retention matrix D7-D28.",
        "Ranking de países con mayor fuga o mejor desempeño."
      ],
      analysisProcess: "Se estructuraron métricas de conversión por etapa del funnel y métricas de retención por cohorte. El análisis comparó desempeño general contra cortes por país para distinguir problemas sistémicos de oportunidades localizadas.",
      insights: [
        "La mayor caída se ubicó entre select item y add to cart, con impacto directo en revenue potencial.",
        "La conversión final fue baja frente al volumen inicial de usuarios, lo que sugiere fricción antes de completar compra.",
        "Uruguay mostró una conversión final superior al promedio, funcionando como benchmark interno.",
        "Algunos países presentaron 0% de conversión final, señalando posibles problemas de método de pago, disponibilidad o experiencia local.",
        "La retención cae de forma relevante entre D7 y D14, indicando una oportunidad de activación temprana."
      ],
      impact: "El análisis permite priorizar mejoras en la etapa más crítica del funnel, enfocar esfuerzos por país y diseñar acciones de retención temprana para reducir abandono y mejorar conversión.",
      recommendations: [
        "Priorizar optimización del paso select item a add to cart.",
        "Investigar países con 0% de purchase para detectar fricciones operativas o de pago.",
        "Replicar prácticas de países con mejor conversión final.",
        "Implementar campañas de activación entre D7 y D14.",
        "Monitorear cohorts mensuales para evaluar impacto de mejoras."
      ],
      solution: "Se construyó un análisis de product analytics con enfoque en funnel, cohorts y segmentación geográfica para traducir comportamiento de usuarios en decisiones de growth y experiencia."
    }
  },
  {
    id: "walmart-sales-performance",
    name: "Walmart Sales Performance Dashboard",
    category: "Retail Analytics",
    status: "Applied Project",
    filterGroup: "Applied Projects",
    year: "2026",
    summary: "Dashboard analítico de ventas retail para evaluar eficiencia por departamento, participación de ventas y desempeño comercial por metro cuadrado.",
    result: "Identificó categorías de alto rendimiento, departamentos por debajo de su potencial y oportunidades para orientar decisiones comerciales y de marketing.",
    stack: ["Excel", "Pivot Tables", "Data Cleaning", "Dashboarding"],
    tags: ["Retail Analytics", "Sales Performance", "Dashboard", "Data Cleaning", "Commercial Insights"],
    repo: "",
    demo: "",
    workbook: "assets/files/walmart_sales_performance.xlsx",
    preview: "assets/previews/walmart_preview.png",
    gallery: ["assets/previews/walmart_sheet_context.png"],
    visual: "linear-gradient(135deg, #0f172a 0%, #16a34a 48%, #f8fafc 100%)",
    caseStudy: {
      context: "Proyecto aplicado de retail analytics basado en ventas semanales por tienda y departamento, con catálogos de tiendas, departamentos y métricas comerciales.",
      problem: "El negocio necesitaba distinguir qué departamentos generaban mayor eficiencia comercial y cuáles estaban por debajo de su potencial para orientar decisiones de inventario, marketing y seguimiento comercial.",
      objective: "Limpiar, integrar y resumir datos de ventas para construir una lectura ejecutiva del desempeño por departamento, incluyendo ventas por metro cuadrado y participación sobre ventas totales.",
      kpis: [
        "Ventas semanales",
        "Ventas por metro cuadrado",
        "Participación del departamento",
        "Departamentos de mayor contribución",
        "Departamentos por debajo de potencial",
        "Eficiencia comercial por categoría"
      ],
      dashboardIdeas: [
        "Menú por departamento con KPIs dinámicos.",
        "Ranking de ventas por metro cuadrado.",
        "Participación de ventas por departamento.",
        "Vista comparativa de categorías eficientes vs. rezagadas."
      ],
      analysisProcess: "Se integraron datos crudos de ventas, tiendas y departamentos, se aplicaron fórmulas de limpieza y enriquecimiento, y se construyeron pivots y visualizaciones para resumir desempeño comercial.",
      insights: [
        "Una mayoría de departamentos concentró la mayor parte de la participación en ventas.",
        "Departamentos como Jardín y Vida al Aire Libre, Juguetes y Juegos, y Oficina/Escuela/Manualidades mostraron menor rendimiento relativo.",
        "Las ventas por metro cuadrado ayudaron a comparar eficiencia más allá del volumen absoluto.",
        "El dashboard permite revisar desempeño por departamento y detectar áreas que requieren estrategia comercial específica."
      ],
      impact: "El proyecto convierte datos transaccionales extensos en una herramienta de lectura ejecutiva para apoyar decisiones de marketing, surtido y seguimiento de desempeño por categoría.",
      recommendations: [
        "Profundizar en departamentos con baja participación y baja eficiencia por metro cuadrado.",
        "Revisar estrategias comerciales y de promoción para categorías rezagadas.",
        "Mantener monitoreo periódico de departamentos con alta contribución.",
        "Complementar el análisis con margen, inventario y temporalidad para priorización comercial."
      ],
      solution: "Se diseñó un dashboard de ventas retail con limpieza de datos, pivots y métricas ejecutivas para evaluar rendimiento comercial y oportunidades por departamento."
    }
  },
  {
    id: "financial-performance-sql",
    name: "SQL Financial Performance & ROI Analysis",
    category: "Financial Analytics",
    status: "Evidence Available",
    filterGroup: "SQL / Python",
    year: "2026",
    summary: "Análisis financiero con SQL para evaluar ingresos, costos, beneficio bruto, margen y ROI por territorio.",
    result: "Consolidó métricas financieras clave para comparar desempeño por país y detectar oportunidades de rentabilidad y eficiencia de inversión.",
    stack: ["SQL", "Excel", "Financial Analysis", "ROI"],
    tags: ["SQL", "Financial Analytics", "ROI", "Margin Analysis", "Executive Reporting"],
    repo: "",
    demo: "",
    workbook: "assets/files/financial_performance_sql.xlsx",
    preview: "assets/previews/financial_sql_preview.png",
    gallery: ["assets/previews/financial_sheet_context.png"],
    visual: "linear-gradient(135deg, #1f2937 0%, #0ea5e9 46%, #22c55e 100%)",
    caseStudy: {
      context: "Proyecto aplicado de análisis financiero orientado a medir desempeño por territorio y conectar ingresos, costos e inversión comercial con rentabilidad.",
      problem: "Los stakeholders necesitaban una vista consolidada para comparar países, entender márgenes y evaluar si la inversión en campañas estaba generando retorno suficiente.",
      objective: "Usar SQL para preparar métricas financieras y construir un resumen ejecutivo de ingresos, costos, beneficio bruto, margen porcentual y ROI por territorio.",
      kpis: [
        "Ingresos",
        "Costos",
        "Costo de campañas",
        "Beneficio bruto",
        "Margen porcentual",
        "ROI",
        "Desempeño por país",
        "Comparativo por territorio"
      ],
      dashboardIdeas: [
        "Tabla ejecutiva por país con ingresos, costos, margen y ROI.",
        "Ranking de territorios por beneficio bruto.",
        "Mapa de oportunidades por margen vs. ROI.",
        "Panel de insights financieros para stakeholders."
      ],
      analysisProcess: "Se preparó una tabla ejecutiva con métricas financieras calculadas a nivel territorio. El análisis se enfocó en comparar rentabilidad, eficiencia de campañas y contribución financiera por país.",
      insights: [
        "Los territorios con mayores ingresos no necesariamente presentan el mejor ROI.",
        "El margen porcentual permite detectar diferencias de rentabilidad que no se observan solo con ingresos.",
        "La relación entre costo de campañas y beneficio bruto ayuda a identificar oportunidades de optimización presupuestal.",
        "Una vista por territorio facilita priorizar mercados con mayor eficiencia financiera."
      ],
      impact: "El proyecto aporta una lectura ejecutiva para decisiones de inversión, control de costos y priorización de territorios con mejor potencial financiero.",
      recommendations: [
        "Comparar ROI y margen antes de incrementar inversión en campañas.",
        "Priorizar territorios con rentabilidad sólida y espacio de crecimiento.",
        "Investigar países con ingresos altos pero ROI bajo.",
        "Complementar el análisis con tendencias mensuales y escenarios de inversión."
      ],
      solution: "Se construyó un análisis financiero con SQL y resumen ejecutivo para traducir métricas de ingresos, costos y campañas en decisiones de rentabilidad."
    }
  },
  {
    id: "urban-mobility-economy-python",
    name: "Urban Mobility & Economic Productivity Analysis",
    category: "Python Analytics",
    status: "Evidence Available",
    filterGroup: "SQL / Python",
    year: "2026",
    summary: "Análisis exploratorio en Python para evaluar la relación entre movilidad urbana, congestión, productividad económica y calidad de vida en ciudades latinoamericanas.",
    result: "Integró fuentes de tráfico y economía urbana para identificar ciudades donde la inversión en movilidad puede tener mayor relevancia estratégica.",
    stack: ["Python", "Pandas", "Seaborn", "Matplotlib", "Jupyter Notebook"],
    tags: ["Python", "EDA", "Urban Analytics", "Data Cleaning", "Economic Analysis"],
    repo: "",
    demo: "",
    notebook: "assets/notebooks/urban_mobility_economy_analysis.ipynb",
    notebookView: "assets/notebooks/urban_mobility_economy_analysis.html",
    preview: "assets/previews/python_notebook_preview.png",
    gallery: ["assets/previews/python_notebook_context.png"],
    visual: "linear-gradient(135deg, #0f172a 0%, #38bdf8 48%, #f97316 100%)",
    caseStudy: {
      context: "Proyecto aplicado de análisis exploratorio orientado a estudiar cómo la movilidad urbana se relaciona con productividad económica en ciudades latinoamericanas.",
      problem: "Los indicadores de tráfico, congestión y economía urbana suelen analizarse por separado, lo que dificulta priorizar ciudades donde las mejoras de transporte podrían tener mayor impacto económico y social.",
      objective: "Limpiar, combinar y analizar datasets de movilidad y economía urbana para detectar patrones, relaciones y oportunidades de inversión en infraestructura de transporte.",
      tools: [
        "Python para análisis exploratorio y preparación de datos",
        "Pandas para limpieza, transformación y combinación de datasets",
        "Seaborn y Matplotlib para visualización",
        "Jupyter Notebook para documentación reproducible del análisis"
      ],
      kpis: [
        "Traffic Index",
        "Jams Delay",
        "Jams Count",
        "Travel Time per 10 km",
        "GDP per capita",
        "Unemployment rate",
        "Population",
        "PM2.5"
      ],
      analysisProcess: "Se cargaron datasets de tráfico y economía urbana, se exploraron tipos de datos, valores faltantes y columnas inconsistentes, se estandarizaron nombres, se transformaron variables numéricas y temporales, y se combinaron fuentes para habilitar análisis comparativo entre ciudades.",
      insights: [
        "La limpieza de tipos de datos fue clave para convertir variables económicas y ambientales en métricas analizables.",
        "La integración de movilidad y economía permitió evaluar ciudades desde una perspectiva más estratégica que solo congestión.",
        "El análisis exploratorio facilitó identificar relaciones potenciales entre eficiencia urbana, actividad económica y presión ambiental.",
        "La documentación en notebook permitió dejar trazabilidad del proceso analítico, decisiones de limpieza y visualizaciones."
      ],
      impact: "El proyecto demuestra capacidad para trabajar con datos públicos, preparar datasets analíticos y traducir análisis exploratorio en criterios para priorización estratégica.",
      recommendations: [
        "Priorizar análisis adicional en ciudades con alta congestión y alta relevancia económica.",
        "Complementar el estudio con datos de inversión pública, transporte masivo y tiempos históricos.",
        "Construir un score de priorización que combine movilidad, productividad, población y sostenibilidad.",
        "Convertir los hallazgos en un dashboard ejecutivo para escenarios de inversión urbana."
      ],
      solution: "Se desarrolló un notebook reproducible en Python que documenta carga, limpieza, preparación, análisis exploratorio y visualización de datos de movilidad y economía urbana."
    }
  }
];

const statusClass = (status) => status.toLowerCase().replace(/\s+/g, "-");

const normalize = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const toWindowsPath = (relativePath) => {
  const decodedPath = decodeURIComponent(window.location.pathname);
  const currentFile = decodedPath.replace(/^\/([A-Za-z]:)/, "$1").replace(/\//g, "\\");
  const currentDir = currentFile.replace(/\\index\.html$/i, "");
  return `${currentDir}\\${relativePath.replace(/\//g, "\\")}`;
};

const projectMatches = (project) => {
  const query = normalize(search.value.trim());
  const haystack = normalize([
    project.name,
    project.summary,
    project.category,
    project.filterGroup || "",
    project.result,
    project.stack.join(" "),
    project.tags.join(" ")
  ].join(" "));

  const matchesFilter = activeFilter === "all" || project.category === activeFilter;
  const matchesGroup = activeFilter === "all" || project.filterGroup === activeFilter;
  const matchesSearch = !query || haystack.includes(query);

  return (matchesFilter || matchesGroup) && matchesSearch;
};

const renderMetrics = () => {
  const evidence = projects.filter((project) => project.workbook || project.notebook || project.code || project.readme || project.reportPdf || project.powerBi).length;
  const stack = new Set(projects.flatMap((project) => project.stack));

  document.querySelector("#metric-total").textContent = projects.length;
  document.querySelector("#metric-live").textContent = evidence;
  document.querySelector("#metric-stack").textContent = stack.size;
};

const renderProjects = () => {
  const visibleProjects = projects.filter(projectMatches);

  grid.innerHTML = visibleProjects.map((project) => `
    <article class="project-card">
      <div class="project-visual" style="--visual: ${project.visual}">
        ${project.preview
          ? `<img src="${project.preview}" alt="Preview de ${project.name}">`
          : `<div class="visual-window" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>`
        }
      </div>
      <div class="project-body">
        <div class="card-meta">
          <span>${project.category} · ${project.year}</span>
          <span class="status ${statusClass(project.status)}">${project.status}</span>
        </div>
        <h3>${project.name}</h3>
        <p>${project.summary}</p>
        ${project.confidential ? `<p class="confidential-note">Caso laboral anonimizado. Sin datos, código ni repositorios confidenciales.</p>` : ""}
        <div class="tags">
          ${project.stack.map((item) => `<span class="tag">${item}</span>`).join("")}
        </div>
        <div class="card-actions">
          <button type="button" data-project="${project.id}">Detalles</button>
          ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noreferrer">Repo</a>` : ""}
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noreferrer">Demo</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");

  if (!visibleProjects.length) {
    grid.innerHTML = '<p class="empty">No hay proyectos con esos filtros todavía.</p>';
  }
};

const openCode = (projectId) => {
  const project = projects.find((item) => item.id === projectId);
  const code = sqlSnippets[projectId];
  if (!project || !code) return;

  detail.innerHTML = `
    <article class="detail">
      <p class="eyebrow">SQL · ${project.name}</p>
      <h2>Código SQL</h2>
      <p>Consulta preparada para análisis de retención por cohorte y conversión de funnel por país.</p>
      <pre class="code-block"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
    </article>
  `;

  dialog.showModal();
};

const openWorkbookInfo = (projectId) => {
  const project = projects.find((item) => item.id === projectId);
  if (!project?.workbook) return;

  const filePath = toWindowsPath(project.workbook);

  detail.innerHTML = `
    <article class="detail">
      <p class="eyebrow">Workbook · ${project.name}</p>
      <h2>Archivo incluido en el portafolio</h2>
      <p>Este workbook ya está copiado dentro de la carpeta del sitio. Cuando publiques el portafolio completo, el archivo viajará con la página y no dependerá de una conexión a tu computadora.</p>
      <div class="file-path">${project.workbook}</div>
      <div class="detail-actions">
        <button type="button" data-download-path="${project.workbook}" data-download-name="${project.workbook.split("/").pop()}">Descargar workbook</button>
      </div>
      <p>Mientras trabajas localmente en Windows, si el navegador integrado bloquea la descarga, usa esta ruta de respaldo:</p>
      <div class="file-path">${filePath}</div>
      <div class="detail-actions">
        <button type="button" data-copy-path="${filePath}">Copiar ruta</button>
      </div>
    </article>
  `;

  dialog.showModal();
};

const openNotebookInfo = (projectId) => {
  const project = projects.find((item) => item.id === projectId);
  if (!project?.notebook) return;

  const filePath = toWindowsPath(project.notebook);

  detail.innerHTML = `
    <article class="detail">
      <p class="eyebrow">Jupyter Notebook · ${project.name}</p>
      <h2>Notebook incluido en el portafolio</h2>
      <p>Este notebook ya está dentro de la carpeta del sitio. Al publicar el portafolio completo, podrá descargarse como evidencia técnica sin depender de tu equipo local.</p>
      <div class="file-path">${project.notebook}</div>
      <div class="detail-actions">
        ${project.notebookView ? `<a href="${project.notebookView}" target="_blank" rel="noreferrer">Ver notebook</a>` : ""}
        <button type="button" data-download-path="${project.notebook}" data-download-name="${project.notebook.split("/").pop()}">Descargar notebook</button>
      </div>
      <p>Mientras trabajas localmente en Windows, si el navegador integrado bloquea la descarga, usa esta ruta de respaldo:</p>
      <div class="file-path">${filePath}</div>
      <div class="detail-actions">
        <button type="button" data-copy-path="${filePath}">Copiar ruta</button>
      </div>
    </article>
  `;

  dialog.showModal();
};

const openProject = (projectId) => {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return;

  const evidenceActions = `
    ${project.code ? `<button type="button" data-code="${project.id}">Ver SQL</button>` : ""}
    ${project.workbook ? `<button type="button" data-workbook="${project.id}">Ver workbook</button>` : ""}
    ${project.notebook ? `<button type="button" data-notebook="${project.id}">Ver notebook</button>` : ""}
    ${project.reportPdf ? `<a href="${project.reportPdf}" target="_blank" rel="noreferrer">Ver reporte PDF</a>` : ""}
    ${project.reportPdf ? `<button type="button" data-download-path="${project.reportPdf}" data-download-name="${project.reportPdf.split("/").pop()}">Descargar PDF</button>` : ""}
    ${project.powerBi ? `<button type="button" data-download-path="${project.powerBi}" data-download-name="${project.powerBi.split("/").pop()}">Descargar PBIX</button>` : ""}
    ${project.readmeView ? `<a href="${project.readmeView}" target="_blank" rel="noreferrer">Ver README</a>` : ""}
    ${project.readme ? `<button type="button" data-download-path="${project.readme}" data-download-name="${project.readme.split("/").pop()}">Descargar README</button>` : ""}
  `.trim();

  const optionalSection = (title, content) => {
    if (!content) return "";
    if (Array.isArray(content)) {
      return `
        <article>
          <strong>${title}</strong>
          <ul>
            ${content.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `;
    }

    return `
      <article>
        <strong>${title}</strong>
        <p>${content}</p>
      </article>
    `;
  };

  detail.innerHTML = `
    <article class="detail">
      <p class="eyebrow">${project.category} · ${project.year}</p>
      <h2>${project.name}</h2>
      <p>${project.caseStudy.context}</p>
      ${project.preview ? `<img class="detail-preview" src="${project.preview}" alt="Preview visual de ${project.name}">` : ""}
      ${project.gallery?.length ? `
        <div class="visual-context">
          <strong>Contexto del archivo</strong>
          <div class="context-gallery">
            ${project.gallery.map((image) => `<img src="${image}" alt="Vista de hoja de cálculo de ${project.name}">`).join("")}
          </div>
        </div>
      ` : ""}
      ${project.confidential ? `<p class="confidential-note detail-note">Proyecto presentado como caso anonimizado, respetando confidencialidad de datos, código, repositorios y procesos internos.</p>` : ""}
      ${evidenceActions ? `
        <div class="evidence-panel">
          <strong>Evidencia técnica opcional</strong>
          <div class="detail-actions">${evidenceActions}</div>
        </div>
      ` : ""}
      <div class="tags">
        ${project.tags.map((item) => `<span class="tag">${item}</span>`).join("")}
      </div>
      <div class="detail-grid">
        <article>
          <strong>My role</strong>
          <p>${project.role || "Data Analytics contributor"}</p>
        </article>
        <article>
          <strong>Problema</strong>
          <p>${project.caseStudy.problem}</p>
        </article>
        <article>
          <strong>Solución</strong>
          <p>${project.caseStudy.solution}</p>
        </article>
        <article>
          <strong>Resultado</strong>
          <p>${project.result}</p>
        </article>
      </div>
      <div class="detail-stack">
        ${optionalSection("Objetivo", project.caseStudy.objective)}
        ${optionalSection("My contribution", project.contribution)}
        ${optionalSection("Herramientas utilizadas", project.caseStudy.tools)}
        ${optionalSection("KPIs monitoreados", project.caseStudy.kpis)}
        ${optionalSection("Ideas de dashboards", project.caseStudy.dashboardIdeas)}
        ${optionalSection("Ejemplos de automatización", project.caseStudy.automationExamples)}
        ${optionalSection("Proceso de análisis", project.caseStudy.analysisProcess)}
        ${optionalSection("Automatización realizada", project.caseStudy.automation)}
        ${optionalSection("Insights encontrados", project.caseStudy.insights)}
        ${optionalSection("Impacto en el negocio", project.caseStudy.impact)}
        ${optionalSection("What I learned", project.learning)}
        ${optionalSection("Beneficios para stakeholders", project.caseStudy.stakeholderBenefits)}
        ${optionalSection("Recomendaciones para stakeholders", project.caseStudy.recommendations)}
      </div>
    </article>
  `;

  dialog.showModal();
};

const loadProjects = async () => {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("No se pudo cargar la base de proyectos.");
    projects = await response.json();
  } catch {
    projects = fallbackProjects;
  }

  renderMetrics();
  renderProjects();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProjects();
  });
});

search.addEventListener("input", renderProjects);

grid.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-project]");
  const codeButton = event.target.closest("[data-code]");
  const workbookButton = event.target.closest("[data-workbook]");
  const notebookButton = event.target.closest("[data-notebook]");

  if (detailButton) openProject(detailButton.dataset.project);
  if (codeButton) openCode(codeButton.dataset.code);
  if (workbookButton) openWorkbookInfo(workbookButton.dataset.workbook);
  if (notebookButton) openNotebookInfo(notebookButton.dataset.notebook);
});

closeDialog.addEventListener("click", () => dialog.close());

detail.addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy-path]");
  const downloadButton = event.target.closest("[data-download-path]");
  const codeButton = event.target.closest("[data-code]");
  const workbookButton = event.target.closest("[data-workbook]");
  const notebookButton = event.target.closest("[data-notebook]");

  if (copyButton) {
    await navigator.clipboard.writeText(copyButton.dataset.copyPath);
    copyButton.textContent = "Ruta copiada";
  }

  if (downloadButton) {
    try {
      const response = await fetch(downloadButton.dataset.downloadPath);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadButton.dataset.downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      downloadButton.textContent = "Descarga iniciada";
    } catch {
      downloadButton.textContent = "No se pudo descargar";
    }
  }

  if (codeButton) openCode(codeButton.dataset.code);
  if (workbookButton) openWorkbookInfo(workbookButton.dataset.workbook);
  if (notebookButton) openNotebookInfo(notebookButton.dataset.notebook);
});

loadProjects();
