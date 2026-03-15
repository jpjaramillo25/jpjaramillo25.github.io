import { useState, useEffect, useCallback } from "react";

const STATUS_CONFIG = {
  published: { label: "Publicado", color: "#1a6b4a", bg: "#e8f5ee", border: "#b8dcc8", icon: "✓" },
  review: { label: "Por Publicar", color: "#8b6914", bg: "#fef9e7", border: "#e8d88c", icon: "◷" },
  nonpeer: { label: "Sin Revisión de Pares", color: "#0ea5e9", bg: "#e0f2fe", border: "#7dd3fc", icon: "◎" },
  draft: { label: "En Construcción", color: "#6b4c8a", bg: "#f3eef8", border: "#c9b8db", icon: "✎" },
};

const RESEARCH_TYPES = [
  "Artículo de Revista", "Conferencia", "Capítulo de Libro", "Libro",
  "Tesis", "Working Paper", "Reporte Técnico", "Otro",
];

const EMPTY_FORM = {
  title: "", authors: "", abstract: "", journal: "", type: "Artículo de Revista",
  date: "", status: "draft", doi: "", keywords: "", notes: "", fileUrl: "",
};

function generateId() {
  return "r_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const SEED_PAPERS = [
  {
    id: "r_seed_delrostro2025",
    title: "Del rostro al voto: adhesiones afectivas, miedo y particularismo en las elecciones presidenciales de Ecuador 2025",
    authors: "Pino-Uribe, J.F.; Jaramillo-Ramón, J.P.",
    abstract: "Este artículo analiza las adhesiones afectivas de los principales candidatos en las elecciones presidenciales de 2025 en Ecuador. Con base en una encuesta nacional representativa (n=1200; margen de error ±3%), se utiliza una estrategia cuantitativa que combina el análisis de conglomerados y regresiones logísticas binarias para identificar perfiles de adhesión en torno a Daniel Noboa, Luisa González y Rafael Correa. Los resultados muestran dos bloques predominantes: una adhesión afectiva pro-Noboa/anti-correísta, caracterizado por disciplina electoral y coherencia entre adhesión y voto, y un perfil pro-correísta/anti-Noboa, marcado por lealtades simbólicas intensas pero menor consistencia en la intención de voto a la candidata correísta. El estudio evidencia que el miedo y la reciprocidad particularista organizan al electorado ecuatoriano en adhesiones afectivas.",
    journal: "Democracias, Vol.15(2), pp. 119-157. Instituto de la Democracia",
    type: "Artículo de Revista",
    date: "2025-11-01",
    status: "published",
    doi: "10.54887/27376192.153",
    keywords: "adhesión afectiva, elecciones presidenciales Ecuador, miedo, reciprocidad particularista, polarización afectiva",
    notes: "FLACSO Ecuador. Encuesta preelectoral CIEES (n=1200, cara a cara, 29-30 marzo 2025). Metodología: análisis jerárquico de conglomerados (Ward) + regresiones logísticas binarias. Pseudo R²=0.3455, AUC=0.8685. ISSN-E: 2737-6192 / ISSN: 1390-826X. Recibido: 05-06-2025, Aceptado: 28-08-2025.",
    fileUrl: "",
    createdAt: Date.now(),
  },
  {
    id: "r_seed_homicidios2025",
    title: "Homicidios sin fronteras: la transnacionalidad subnacional del narcotráfico en Ecuador y Colombia (2015-2022)",
    authors: "Pino-Uribe, J.F.; Jaramillo-Ramón, J.P.; Piedrahita-Bustamante, P.",
    abstract: "Este artículo explora los patrones subnacionales del crimen organizado transnacional relacionados con el narcotráfico y la violencia homicida entre el sur de Colombia y Ecuador durante el periodo 2015-2022.",
    journal: "Revista Criminalidad, 67(1): 59-77",
    type: "Artículo de Revista",
    date: "2025-01-01",
    status: "published",
    doi: "10.47741/17943108.637",
    keywords: "narcotráfico, homicidios, Ecuador, Colombia, transnacionalidad subnacional",
    notes: "FLACSO Ecuador. Metodología: modelos de regresión de efectos aleatorios y doble efecto fijo. 29 unidades territoriales.",
    fileUrl: "",
    createdAt: Date.now() - 100,
  },
  {
    id: "r_seed_cocacultivation2025",
    title: "The Impact of Coca-Cultivation and Drug Trafficking Arrests on Homicide Rates in Ecuador: A Transnational Perspective",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "coca cultivation, drug trafficking, homicide rates, Ecuador, transnational crime",
    notes: "Working paper en construcción. Pendiente de enviar a revista. Enlace Google Doc disponible.",
    fileUrl: "https://docs.google.com/document/d/1xSP3GhPpSc0WuI7vvar7i_1TfLvJVQd0ZgCwtN8W5yA/edit?usp=drivesdk",
    createdAt: Date.now() - 1000,
  },
  {
    id: "r_seed_femicidios2024",
    title: "Femicidios en Ecuador (2015-2021): un análisis subnacional del impacto de la Ley de Erradicación de la Violencia de Género",
    authors: "Castillo Fell, S.; Jaramillo-Ramón, J.P.",
    abstract: "Esta investigación analiza cuál fue el impacto de la aprobación de la Ley Orgánica de Erradicación de Violencia de Género sobre la tasa de femicidios a nivel subnacional en Ecuador. Se emplea un análisis cuantitativo de regresión con datos de panel que evidencia que la problemática de la violencia de género reaccionó a los cambios institucionales formales y revirtió la tendencia en el aumento de los femicidios, pese al incremento de la criminalidad en el país. Sin embargo, se encuentra que a nivel subnacional existen variaciones en la implementación y el cumplimiento de la Ley. Los femicidios se explican desde un comportamiento cultural arraigado y condiciones estructurales de la sociedad más profundas como la pobreza por necesidades básicas insatisfechas.",
    journal: "Reflexión Política, Vol.26(53), pp. 149-162. Universidad Autónoma de Bucaramanga (UNAB)",
    type: "Artículo de Revista",
    date: "2024-06-29",
    status: "published",
    doi: "10.29375/01240781.4995",
    keywords: "Ecuador, violencia de género, mujer, política, legislación, femicidio, análisis subnacional",
    notes: "FLACSO Ecuador. Metodología: regresión con datos de panel. Datos: FGE, Policía Nacional e INEC (2015-2021). Repositorio de datos: github.com/jpjaramillo25/Femicidios-ecuador",
    fileUrl: "https://repository.unab.edu.co/bitstream/handle/20.500.12749/27314/Art%C3%ADculo.pdf?sequence=1",
    createdAt: Date.now() - 2000,
  },
  {
    id: "r_seed_ecorganizedcrime2025",
    title: "Ecuador since 2021: Escalation in Homicides, Weak State, and Transnational-Subnational Organized Crime",
    authors: "Jaramillo-Ramón, J.P.; Pino-Uribe, J.F.; Piedrahita-Bustamante, P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "organized crime, transnational crime, subnational dynamics, Ecuador, drug trafficking",
    notes: "Working paper en construcción (versión 11.09.2025). Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1whLuYJQqMA9PDZJFdOGIuao7hA6Pgwosn2EoSzV6s-0/edit?usp=drivesdk",
    createdAt: Date.now() - 3000,
  },
  {
    id: "r_seed_noboarcp2025",
    title: "Autoritarismo competitivo en Ecuador: la presidencia de Daniel Noboa (2023-2026)",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "autoritarismo competitivo, Ecuador, Daniel Noboa, democracia, presidencialismo",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1mwlWxxM_GrOmV8v0P4kuBMPcF6s0sKlS/edit?usp=drivesdk",
    createdAt: Date.now() - 4000,
  },
  {
    id: "r_seed_instpersonalism2025",
    title: "Institutional Personalism: Charismatic Leadership, Performance Legitimacy, and Political Trust in Ecuador, 2004–2019",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "institutional personalism, charismatic leadership, performance legitimacy, political trust, Ecuador",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1Uf_0J2Hpr3H4vK8Dpb834i5E9ZSzlsSBl9_QGn31QkQ/edit?usp=drivesdk",
    createdAt: Date.now() - 5000,
  },
  {
    id: "r_seed_anchoringbias2025",
    title: "Anchoring Bias in Runoff Polls: Evidence from the 2025 Ecuadorian Election",
    authors: "Curvale, C.; Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "anchoring bias, runoff elections, polling, Ecuador, 2025 election, behavioral economics",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1CsRx6oaqjevaZMnd587pm96J8tPbN30TARM0jFOQrO0/edit?usp=drivesdk",
    createdAt: Date.now() - 6000,
  },
  {
    id: "r_seed_generationscoups2025",
    title: "Generations, Coups and Political Attitudes in Latin America: Evidence from the AmericasBarometer (2004-2019)",
    authors: "Curvale, C.; Jaramillo-Ramón, J.P.; Fierro, M.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "generations, coups, political attitudes, Latin America, AmericasBarometer, political socialization",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/16JVbvNuAxRodYsEib0_0h47rShiMoJKH9qlpGS3DTWI/edit?usp=drivesdk",
    createdAt: Date.now() - 7000,
  },
  {
    id: "r_seed_rapidslide2025",
    title: "Ecuador's Rapid Slide into Competitive Authoritarianism: The Noboa Presidency (2023–2025)",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "competitive authoritarianism, Ecuador, Noboa, democratic backsliding, presidentialism",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/17xToEhy7u-zPSl0n_dG1X3YHxBJr7zeL1wUIjUJkjsQ/edit?usp=drivesdk",
    createdAt: Date.now() - 8000,
  },
  {
    id: "r_seed_oilinstitutions2025",
    title: "Oil, Institutions, and Human Development: Evidence from a Panel of Resource-Producing Countries",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "oil, institutions, human development, resource curse, panel data, developing countries",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1vL66g9FjYwf4rEfJYS11JVt8b_iOx7en/edit?usp=drivesdk",
    createdAt: Date.now() - 9000,
  },
  {
    id: "r_seed_ideologicalcong2025",
    title: "Ideological Congruence and Democratic Support During the Pink Tide: A Cross-Level Analysis of Citizen-Government Ideology in Latin America",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "ideological congruence, democratic support, Pink Tide, Latin America, citizen-government ideology, cross-level analysis",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1qSrGiUVvapvqgbkiSNV9NiL7eOXm-hwD/edit?usp=drivesdk",
    createdAt: Date.now() - 10000,
  },
  {
    id: "r_seed_strongman2025",
    title: "When the Strongman Builds the State: Personalist Leadership and Institutional Trust in Ecuador",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "personalist leadership, institutional trust, state-building, Ecuador, strongman politics",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1w5WFCCBYVu7xv7AJ04Ch_-uf0SB1nOzlWCbzFwiMkwA/edit?usp=drivesdk",
    createdAt: Date.now() - 11000,
  },
  {
    id: "r_seed_homicidalviolence2025",
    title: "Homicidal Violence and State Capacity in Latin America: The Story of the Paper Leviathans",
    authors: "Jaramillo-Ramón, J.P.; Curvale, C.",
    abstract: "",
    journal: "Crime, Law and Social Change (Springer). Aceptado para publicación.",
    type: "Artículo de Revista",
    date: "",
    status: "review",
    doi: "",
    keywords: "homicidal violence, state capacity, Latin America, Paper Leviathans, weak states, crime",
    notes: "Aceptado para publicación en Crime, Law and Social Change (Springer). Pendiente de asignación de DOI y fecha de publicación.",
    fileUrl: "https://docs.google.com/document/d/1vmqszkkdgz0Mf6AZWWpBF8QlKIUNdlfk/edit?usp=drivesdk",
    createdAt: Date.now() - 500,
  },
  {
    id: "r_seed_militarizacion2025",
    title: "Militarización extranjera como política de seguridad interna y polarización del relato político en Ecuador: ¿Retorna la Base Militar de Manta?",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "Política Criminal. Aceptado para publicación.",
    type: "Artículo de Revista",
    date: "",
    status: "review",
    doi: "",
    keywords: "militarización, seguridad interna, polarización política, Ecuador, Base de Manta, política de defensa",
    notes: "Aceptado para publicación en Política Criminal. Pendiente de asignación de DOI y fecha de publicación.",
    fileUrl: "https://docs.google.com/document/d/12eOyzWpT_wCuNNRa-CMmTX-bLtOjfEBbukVQQF29WQ8/edit?usp=drivesdk",
    createdAt: Date.now() - 400,
  },
  {
    id: "r_seed_lateindustrialization2025",
    title: "Late Industrialization and Growth: Evidence from 94 Countries in the Global Periphery",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "CEPAL Review / Revista de la CEPAL. Aceptado para publicación.",
    type: "Artículo de Revista",
    date: "",
    status: "review",
    doi: "",
    keywords: "late industrialization, economic growth, Global Periphery, development economics, panel data",
    notes: "Aceptado para publicación en CEPAL Review (Comisión Económica para América Latina y el Caribe). Pendiente de asignación de DOI y fecha de publicación.",
    fileUrl: "https://docs.google.com/document/d/1ghNQ3pSAlinzHy0uxTkv0VkIMBPQkfuhF31GlWkHgbw/edit?usp=drivesdk",
    createdAt: Date.now() - 300,
  },
  {
    id: "r_seed_fasttrack2025",
    title: "Ecuador's Fast Track to Competitive Authoritarianism: Daniel Noboa Ruling (2023-2026)",
    authors: "Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "competitive authoritarianism, Ecuador, Daniel Noboa, democratic erosion, presidentialism",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1nhr1NGrP189BLWqKuilC2mJZ5-BS1vvS/edit?usp=drivesdk",
    createdAt: Date.now() - 12000,
  },
  {
    id: "r_seed_fiscalconfig2025",
    title: "Fiscal Configurations and the Colonial Legacy: The Impact of Tax Collection and Inequality on Welfare in Latin America",
    authors: "Jaramillo-Ramón, J.P.; Pino-Uribe, J.F.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "fiscal configurations, colonial legacy, tax collection, inequality, welfare, Latin America",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/19YpOI2pXhyCPLZtWpKPaeZZ9lct2MQA-aaZ3r0xqVEg/edit?usp=drivesdk",
    createdAt: Date.now() - 13000,
  },
  {
    id: "r_seed_taxregimes2025",
    title: "Tax Regimes in Latin America",
    authors: "Jaramillo-Ramón, J.P.; Pino-Uribe, J.F.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "tax regimes, Latin America, fiscal policy, taxation, political economy",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/1UBaVHnYT9kvP00FqdM8YbHLSkz4nU2J8PuTtqFuk3bY/edit?usp=drivesdk",
    createdAt: Date.now() - 14000,
  },
  {
    id: "r_seed_luisadesdolariza2025",
    title: "\"Luisa te desdolariza\": emociones y desinformación en el balotaje ecuatoriano de 2025",
    authors: "Jaramillo-Ramón, J.P.; Curvale, C.",
    abstract: "",
    journal: "",
    type: "Working Paper",
    date: "",
    status: "draft",
    doi: "",
    keywords: "desinformación, emociones, dolarización, balotaje, Ecuador 2025, comunicación política",
    notes: "Working paper en construcción. Pendiente de enviar a revista.",
    fileUrl: "https://docs.google.com/document/d/14VQjA2uvqZWyT9PIGtNo_FWWptrnbKvzxwgW3g4Yiaw/edit?usp=drivesdk",
    createdAt: Date.now() - 15000,
  },
  {
    id: "r_seed_ssrn_schooling2014",
    title: "The External Effect of Urban Schooling Attainment on Workers' Incomes in Ecuador",
    authors: "Breton, T.R.; Jaramillo-Ramón, J.P.",
    abstract: "",
    journal: "SSRN Working Paper",
    type: "Working Paper",
    date: "2014-12-01",
    status: "nonpeer",
    doi: "",
    keywords: "urban schooling, human capital externalities, workers' incomes, Ecuador, education economics",
    notes: "Publicación sin revisión de pares. SSRN Abstract ID: 2537544.",
    fileUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2537544",
    createdAt: Date.now() - 16000,
  },
  {
    id: "r_seed_educprivpub2015",
    title: "¿Son las instituciones educativas privadas mejores que las públicas? El caso de Ecuador, una medición a partir de Ser Bachiller 2014",
    authors: "Jaramillo-Ramón, J.P.; Velastegui, L.",
    abstract: "",
    journal: "Working Paper",
    type: "Working Paper",
    date: "2015-01-01",
    status: "nonpeer",
    doi: "",
    keywords: "educación privada, educación pública, Ecuador, Ser Bachiller, calidad educativa",
    notes: "Publicación sin revisión de pares.",
    fileUrl: "https://www.academia.edu/145331653/_Son_las_instituciones_educativas_privadas_mejores_que_las_p%C3%BAblicas_El_caso_de_Ecuador_una_medici%C3%B3n_a_partir_de_Ser_Bachiller_2014",
    createdAt: Date.now() - 17000,
  }
];

const EXTRACT_PROMPT = `You are an academic metadata extraction assistant. Analyze the following research document and extract structured metadata. Respond ONLY with a valid JSON object — no markdown fences, no preamble, no explanation. The JSON must have these fields:

{
  "title": "Full title of the paper",
  "authors": "Authors in format: Lastname, F.; Lastname, F.",
  "abstract": "The abstract or a concise summary if no abstract is present (max 300 words)",
  "journal": "Journal name, conference name, or publisher (empty string if not found)",
  "type": "One of: Artículo de Revista, Conferencia, Capítulo de Libro, Libro, Tesis, Working Paper, Reporte Técnico, Otro",
  "date": "Publication date in YYYY-MM-DD format if available, or YYYY-01-01 if only year, or empty string",
  "doi": "DOI if found, empty string otherwise",
  "keywords": "Comma-separated keywords (extract from paper or infer from content)",
  "status": "published if it has a journal/DOI/publication info, review if it mentions submission, draft otherwise"
}

Be precise. Extract real data from the document, do not fabricate.`;

async function extractMetadataFromPDF(base64Data) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64Data } },
          { type: "text", text: EXTRACT_PROMPT }
        ]
      }]
    })
  });
  const data = await response.json();
  const text = data.content?.map(i => i.text || "").join("\n") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function extractMetadataFromText(textContent) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: EXTRACT_PROMPT + "\n\n--- DOCUMENT CONTENT ---\n\n" + textContent.slice(0, 80000)
      }]
    })
  });
  const data = await response.json();
  const text = data.content?.map(i => i.text || "").join("\n") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function fetchGoogleDocText(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) throw new Error("URL de Google Doc no válida");
  const docId = match[1];
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  const res = await fetch(exportUrl);
  if (!res.ok) throw new Error("No se pudo acceder al documento. Asegúrate de que sea público (\"Cualquier persona con el enlace\").");
  return await res.text();
}

/* ═══ UI COMPONENTS ═══ */

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px",
      borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: 11 }}>{cfg.icon}</span>{cfg.label}
    </span>
  );
}

function StatCard({ label, count, color, bg, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, minWidth: 130, background: active ? bg : "#fff",
      border: active ? `2px solid ${color}` : "1.5px solid #e2ddd5",
      borderRadius: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left",
      transition: "all 0.25s ease", transform: active ? "translateY(-2px)" : "none",
      boxShadow: active ? `0 4px 16px ${color}18` : "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: 30, fontWeight: 700, color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 11, color: "#7a7168", fontWeight: 600, marginTop: 5, letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </button>
  );
}

function ResearchCard({ item, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #e8e3db", borderRadius: 16,
      padding: "22px 26px", transition: "all 0.3s ease",
      boxShadow: "0 1px 4px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.07)"; e.currentTarget.style.borderColor = "#d0c9be"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = "#e8e3db"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: STATUS_CONFIG[item.status].color, borderRadius: "16px 0 0 16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 7 }}>
            <StatusBadge status={item.status} />
            <span style={{ fontSize: 11, color: "#9a9189", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{item.type}</span>
          </div>
          <h3 onClick={() => setExpanded(!expanded)} style={{
            fontSize: 18, fontWeight: 700, color: "#2c2520", margin: "0 0 5px 0",
            lineHeight: 1.35, fontFamily: "'Playfair Display', serif", cursor: "pointer",
          }}>
            {item.title}
            <span style={{ fontSize: 12, marginLeft: 8, color: "#b5b0a8", transition: "transform 0.2s", display: "inline-block", transform: expanded ? "rotate(90deg)" : "none" }}>▶</span>
          </h3>
          <p style={{ fontSize: 13, color: "#6b6259", margin: "0 0 3px 0", fontFamily: "'DM Sans', sans-serif" }}>{item.authors}</p>
          {item.journal && (
            <p style={{ fontSize: 12.5, color: "#8a8279", margin: 0, fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>
              {item.journal}{item.date && ` · ${item.date}`}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <button onClick={() => onEdit(item)} title="Editar" style={{
            background: "none", border: "1.5px solid #ddd8d0", borderRadius: 10,
            width: 34, height: 34, cursor: "pointer", fontSize: 14, display: "flex",
            alignItems: "center", justifyContent: "center", color: "#7a7168", transition: "all 0.2s",
          }} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f2ed"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}>✎</button>
          <button onClick={() => onDelete(item.id)} title="Eliminar" style={{
            background: "none", border: "1.5px solid #ddd8d0", borderRadius: 10,
            width: 34, height: 34, cursor: "pointer", fontSize: 13, display: "flex",
            alignItems: "center", justifyContent: "center", color: "#b0756a", transition: "all 0.2s",
          }} onMouseEnter={(e) => e.currentTarget.style.background = "#fdf0ee"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}>✕</button>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #ece8e1", animation: "fadeIn 0.3s ease" }}>
          {item.abstract && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9189", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Resumen</div>
              <p style={{ fontSize: 13.5, color: "#4a4540", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{item.abstract}</p>
            </div>
          )}
          {item.keywords && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9189", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Palabras Clave</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.keywords.split(",").map((kw, i) => (
                  <span key={i} style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11.5, background: "#f5f2ed", color: "#6b6259", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{kw.trim()}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {item.doi && <div style={{ fontSize: 12, color: "#7a7168", fontFamily: "'DM Sans', sans-serif" }}><strong>DOI:</strong> {item.doi}</div>}
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#1a6b4a", textDecoration: "none", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                📄 Ver documento
              </a>
            )}
          </div>
          {item.notes && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#faf8f5", borderRadius: 10, border: "1px solid #ece8e1" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9189", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Notas</div>
              <p style={{ fontSize: 13, color: "#5a554e", margin: 0, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>{item.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Import Modal ─── */
function ImportModal({ onImport, onClose }) {
  const [mode, setMode] = useState("pdf");
  const [gdocUrl, setGdocUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handlePDF = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Por favor selecciona un archivo PDF válido.");
      return;
    }
    setError(""); setProcessing(true); setProgress("Leyendo PDF...");
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Error leyendo archivo"));
        r.readAsDataURL(file);
      });
      setProgress("Analizando contenido con IA...");
      const metadata = await extractMetadataFromPDF(base64);
      onImport(metadata, "");
    } catch (e) {
      setError("Error al procesar el PDF: " + e.message);
      setProcessing(false);
    }
  };

  const handleGDoc = async () => {
    if (!gdocUrl.includes("docs.google.com/document")) {
      setError("Introduce una URL válida de Google Docs.");
      return;
    }
    setError(""); setProcessing(true); setProgress("Obteniendo contenido del documento...");
    try {
      const text = await fetchGoogleDocText(gdocUrl);
      setProgress("Analizando contenido con IA...");
      const metadata = await extractMetadataFromText(text);
      onImport(metadata, gdocUrl);
    } catch (e) {
      setError(e.message);
      setProcessing(false);
    }
  };

  const handleText = async () => {
    if (pastedText.trim().length < 50) {
      setError("Pega al menos un fragmento significativo del documento.");
      return;
    }
    setError(""); setProcessing(true); setProgress("Analizando contenido con IA...");
    try {
      const metadata = await extractMetadataFromText(pastedText);
      onImport(metadata, "");
    } catch (e) {
      setError("Error al analizar el texto: " + e.message);
      setProcessing(false);
    }
  };

  const tabStyle = (active) => ({
    flex: 1, padding: "10px 8px", border: "none",
    borderBottom: active ? "2.5px solid #2c2520" : "2.5px solid transparent",
    background: "none", fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer",
    color: active ? "#2c2520" : "#9a9189", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
  });

  const fieldStyle = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #ddd8d0", borderRadius: 10,
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#2c2520", background: "#fff",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(30,25,20,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
      animation: "fadeIn 0.25s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fdfcfa", borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "90vh",
        overflow: "auto", padding: "28px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        border: "1px solid #e8e3db",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontFamily: "'Playfair Display', serif", color: "#2c2520" }}>
            Importar Investigación
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9a9189", padding: 4 }}>✕</button>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #e8e3db", marginBottom: 20 }}>
          <button style={tabStyle(mode === "pdf")} onClick={() => { setMode("pdf"); setError(""); }}>📄 Subir PDF</button>
          <button style={tabStyle(mode === "gdoc")} onClick={() => { setMode("gdoc"); setError(""); }}>🔗 Google Doc</button>
          <button style={tabStyle(mode === "text")} onClick={() => { setMode("text"); setError(""); }}>📋 Pegar Texto</button>
        </div>

        {processing ? (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{
              width: 48, height: 48, border: "4px solid #e8e3db", borderTop: "4px solid #1a6b4a",
              borderRadius: "50%", margin: "0 auto 18px", animation: "spin 0.9s linear infinite",
            }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2c2520", margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>{progress}</p>
            <p style={{ fontSize: 13, color: "#9a9189", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Esto puede tomar unos segundos...</p>
          </div>
        ) : (
          <>
            {mode === "pdf" && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handlePDF(e.dataTransfer.files[0]); }}
                style={{
                  border: `2px dashed ${dragOver ? "#1a6b4a" : "#d5d0c8"}`,
                  borderRadius: 16, padding: "44px 24px", textAlign: "center",
                  background: dragOver ? "#e8f5ee" : "#faf8f5", transition: "all 0.25s", cursor: "pointer",
                }}
                onClick={() => document.getElementById("pdf-input").click()}
              >
                <input id="pdf-input" type="file" accept=".pdf" style={{ display: "none" }}
                  onChange={(e) => handlePDF(e.target.files[0])} />
                <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.6 }}>📄</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2c2520", margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>
                  Arrastra un PDF aquí o haz clic para seleccionar
                </p>
                <p style={{ fontSize: 12.5, color: "#9a9189", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  La IA extraerá título, autores, resumen, palabras clave y más
                </p>
              </div>
            )}

            {mode === "gdoc" && (
              <div>
                <p style={{ fontSize: 13, color: "#6b6259", margin: "0 0 14px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                  Pega el enlace de tu Google Doc. El documento debe tener acceso público
                  (<em>"Cualquier persona con el enlace"</em>) para poder leerse.
                </p>
                <input style={fieldStyle} value={gdocUrl} onChange={(e) => setGdocUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
                <button onClick={handleGDoc} disabled={!gdocUrl.trim()} style={{
                  marginTop: 14, width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  background: gdocUrl.trim() ? "#2c2520" : "#c5c0b8", color: "#fff", fontSize: 14,
                  fontWeight: 600, cursor: gdocUrl.trim() ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Extraer Metadata</button>
              </div>
            )}

            {mode === "text" && (
              <div>
                <p style={{ fontSize: 13, color: "#6b6259", margin: "0 0 14px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                  Pega el contenido de tu investigación. La IA identificará la metadata automáticamente.
                </p>
                <textarea style={{ ...fieldStyle, minHeight: 160, resize: "vertical" }} value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Pega aquí el texto de tu investigación..."
                  onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
                <button onClick={handleText} disabled={pastedText.trim().length < 50} style={{
                  marginTop: 14, width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  background: pastedText.trim().length >= 50 ? "#2c2520" : "#c5c0b8", color: "#fff",
                  fontSize: 14, fontWeight: 600, cursor: pastedText.trim().length >= 50 ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Extraer Metadata</button>
              </div>
            )}

            {error && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#fdf0ee", borderRadius: 10, border: "1px solid #e8c0ba" }}>
                <p style={{ fontSize: 13, color: "#9c4040", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Form/Review Modal ─── */
function FormModal({ form, setForm, onSave, onClose, isEditing, isReview }) {
  const fieldStyle = {
    width: "100%", padding: "10px 14px", border: "1.5px solid #ddd8d0", borderRadius: 10,
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#2c2520", background: "#fff",
    outline: "none", transition: "border 0.2s", boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 12, fontWeight: 700, color: "#6b6259", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: 5, display: "block", fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(30,25,20,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
      animation: "fadeIn 0.25s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fdfcfa", borderRadius: 20, width: "100%", maxWidth: 620, maxHeight: "90vh",
        overflow: "auto", padding: "30px 34px", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        border: "1px solid #e8e3db",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 21, fontFamily: "'Playfair Display', serif", color: "#2c2520" }}>
              {isReview ? "Revisar Datos Extraídos" : isEditing ? "Editar Investigación" : "Nueva Investigación"}
            </h2>
            {isReview && (
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#8a8279", fontFamily: "'DM Sans', sans-serif" }}>
                Verifica y ajusta la información antes de guardar
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9a9189", padding: 4 }}>✕</button>
        </div>

        {isReview && (
          <div style={{ marginBottom: 16, padding: "10px 14px", background: "#e8f5ee", borderRadius: 10, border: "1px solid #b8dcc8" }}>
            <p style={{ fontSize: 13, color: "#1a6b4a", margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              ✓ Datos extraídos automáticamente por IA. Revisa y modifica lo que necesites.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Título *</label>
            <input style={fieldStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Título de la investigación"
              onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
          </div>
          <div>
            <label style={labelStyle}>Autores *</label>
            <input style={fieldStyle} value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })}
              placeholder="Apellido, N.; Apellido, N."
              onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Tipo</label>
              <select style={{ ...fieldStyle, cursor: "pointer" }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {RESEARCH_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Estatus *</label>
              <select style={{ ...fieldStyle, cursor: "pointer" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => <option key={key} value={key}>{cfg.icon} {cfg.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Revista / Conferencia</label>
              <input style={fieldStyle} value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })}
                placeholder="Nombre de la publicación"
                onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
            </div>
            <div style={{ width: 155 }}>
              <label style={labelStyle}>Fecha</label>
              <input style={fieldStyle} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Resumen / Abstract</label>
            <textarea style={{ ...fieldStyle, minHeight: 85, resize: "vertical" }} value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="Breve descripción..."
              onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
          </div>
          <div>
            <label style={labelStyle}>Palabras Clave</label>
            <input style={fieldStyle} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="machine learning, educación (separadas por coma)"
              onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>DOI</label>
              <input style={fieldStyle} value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })}
                placeholder="10.xxxx/xxxxx"
                onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Enlace al Documento</label>
              <input style={fieldStyle} value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="URL del PDF o Google Doc"
                onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notas Personales</label>
            <textarea style={{ ...fieldStyle, minHeight: 55, resize: "vertical" }} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas internas, pendientes..."
              onFocus={(e) => e.target.style.borderColor = "#1a6b4a"} onBlur={(e) => e.target.style.borderColor = "#ddd8d0"} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{
            padding: "10px 22px", borderRadius: 10, border: "1.5px solid #ddd8d0", background: "none",
            fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#7a7168",
          }}>Cancelar</button>
          <button onClick={onSave} disabled={!form.title.trim() || !form.authors.trim()} style={{
            padding: "10px 28px", borderRadius: 10, border: "none",
            background: form.title.trim() && form.authors.trim() ? "#1a6b4a" : "#c5c0b8",
            color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: form.title.trim() && form.authors.trim() ? "pointer" : "not-allowed",
            fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
          }}>{isReview ? "Confirmar y Guardar" : isEditing ? "Guardar Cambios" : "Registrar"}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{
      position: "fixed", inset: 0, background: "rgba(30,25,20,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001, padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fdfcfa", borderRadius: 18, padding: "28px 32px", maxWidth: 400,
        textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>⚠</div>
        <h3 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display', serif", color: "#2c2520" }}>Eliminar Investigación</h3>
        <p style={{ color: "#7a7168", fontSize: 14, margin: "0 0 22px", fontFamily: "'DM Sans', sans-serif" }}>Esta acción no se puede deshacer.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "9px 22px", borderRadius: 10, border: "1.5px solid #ddd8d0", background: "none",
            fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#7a7168",
          }}>Cancelar</button>
          <button onClick={onConfirm} style={{
            padding: "9px 22px", borderRadius: 10, border: "none", background: "#c0534f",
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Sí, Eliminar</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function ResearchRepository() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isReview, setIsReview] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteId, setDeleteId] = useState(null);
  const [sortBy, setSortBy] = useState("date_desc");

  const loadPapers = useCallback(async () => {
    try {
      const result = await window.storage.get("research-papers");
      if (result && result.value) {
        const existing = JSON.parse(result.value);
        // Check if seed papers need to be added
        const existingIds = new Set(existing.map(p => p.id));
        const newSeeds = SEED_PAPERS.filter(s => !existingIds.has(s.id));
        if (newSeeds.length > 0) {
          const merged = [...newSeeds, ...existing];
          setPapers(merged);
          await window.storage.set("research-papers", JSON.stringify(merged));
        } else {
          setPapers(existing);
        }
      } else {
        // No data yet — seed with initial papers
        setPapers(SEED_PAPERS);
        await window.storage.set("research-papers", JSON.stringify(SEED_PAPERS));
      }
    } catch {
      // Key doesn't exist — seed
      setPapers(SEED_PAPERS);
      try { await window.storage.set("research-papers", JSON.stringify(SEED_PAPERS)); } catch(e) { console.error(e); }
    }
    setLoading(false);
  }, []);

  const savePapers = useCallback(async (data) => {
    try { await window.storage.set("research-papers", JSON.stringify(data)); } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadPapers(); }, [loadPapers]);

  const handleSave = () => {
    let updated;
    if (editingId) {
      updated = papers.map((p) => (p.id === editingId ? { ...form, id: editingId, createdAt: p.createdAt } : p));
    } else {
      updated = [{ ...form, id: generateId(), createdAt: Date.now() }, ...papers];
    }
    setPapers(updated); savePapers(updated);
    setShowForm(false); setEditingId(null); setIsReview(false); setForm({ ...EMPTY_FORM });
  };

  const handleEdit = (item) => {
    setForm({ ...item }); setEditingId(item.id); setIsReview(false); setShowForm(true);
  };

  const handleDelete = () => {
    const updated = papers.filter((p) => p.id !== deleteId);
    setPapers(updated); savePapers(updated); setDeleteId(null);
  };

  const handleImport = (metadata, sourceUrl) => {
    const newForm = { ...EMPTY_FORM };
    if (metadata.title) newForm.title = metadata.title;
    if (metadata.authors) newForm.authors = metadata.authors;
    if (metadata.abstract) newForm.abstract = metadata.abstract;
    if (metadata.journal) newForm.journal = metadata.journal;
    if (metadata.type && RESEARCH_TYPES.includes(metadata.type)) newForm.type = metadata.type;
    if (metadata.date) newForm.date = metadata.date;
    if (metadata.doi) newForm.doi = metadata.doi;
    if (metadata.keywords) newForm.keywords = metadata.keywords;
    if (metadata.status && STATUS_CONFIG[metadata.status]) newForm.status = metadata.status;
    if (sourceUrl) newForm.fileUrl = sourceUrl;
    setForm(newForm); setEditingId(null); setIsReview(true); setShowImport(false); setShowForm(true);
  };

  const filtered = papers
    .filter((p) => filter === "all" || p.status === filter)
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) ||
        (p.keywords || "").toLowerCase().includes(q) || (p.journal || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return (b.date || "").localeCompare(a.date || "");
      if (sortBy === "date_asc") return (a.date || "").localeCompare(b.date || "");
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const counts = {
    all: papers.length,
    published: papers.filter((p) => p.status === "published").length,
    review: papers.filter((p) => p.status === "review").length,
    nonpeer: papers.filter((p) => p.status === "nonpeer").length,
    draft: papers.filter((p) => p.status === "draft").length,
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#9a9189" }}>
        Cargando repositorio...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #f8f5f0 0%, #f0ece5 40%, #ebe6dd 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #d0c9be; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #b5b0a8; }
      `}</style>

      <header style={{
        padding: "28px 36px 24px", borderBottom: "1px solid #e2ddd5", background: "rgba(253,252,250,0.7)",
        backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#2c2520", letterSpacing: "-0.02em" }}>
                Repositorio de Investigaciones
              </h1>
              <p style={{ margin: "3px 0 0", fontSize: 13.5, color: "#8a8279", fontWeight: 500 }}>
                {papers.length} {papers.length === 1 ? "investigación" : "investigaciones"} registrada{papers.length !== 1 && "s"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setShowImport(true)} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 12,
                border: "none", background: "#1a6b4a", color: "#fff", fontSize: 13.5, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(26,107,74,0.25)",
              }} onMouseEnter={(e) => e.currentTarget.style.background = "#15573d"} onMouseLeave={(e) => e.currentTarget.style.background = "#1a6b4a"}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>⚡</span> Importar con IA
              </button>
              <button onClick={() => { setForm({ ...EMPTY_FORM }); setEditingId(null); setIsReview(false); setShowForm(true); }} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 12,
                border: "1.5px solid #d5d0c8", background: "#fff", color: "#2c2520", fontSize: 13.5, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
              }} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f2ed"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Manual
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 36px 60px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <StatCard label="Todas" count={counts.all} color="#2c2520" bg="#f5f2ed" active={filter === "all"} onClick={() => setFilter("all")} />
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <StatCard key={key} label={cfg.label} count={counts[key]} color={cfg.color} bg={cfg.bg} active={filter === key} onClick={() => setFilter(key)} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#b5b0a8" }}>⌕</span>
            <input type="text" placeholder="Buscar por título, autores, palabras clave..." value={search}
              onChange={(e) => setSearch(e.target.value)} style={{
                width: "100%", padding: "11px 14px 11px 38px", border: "1.5px solid #e2ddd5", borderRadius: 12,
                fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#2c2520", background: "#fff", outline: "none",
              }} />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
            padding: "11px 16px", border: "1.5px solid #e2ddd5", borderRadius: 12, fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", color: "#6b6259", background: "#fff", cursor: "pointer", outline: "none",
          }}>
            <option value="date_desc">Más recientes</option>
            <option value="date_asc">Más antiguas</option>
            <option value="title">Título A–Z</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "56px 20px", color: "#9a9189", background: "#fff",
            borderRadius: 18, border: "1.5px dashed #ddd8d0",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>📚</div>
            <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", color: "#7a7168" }}>
              {papers.length === 0 ? "Tu repositorio está vacío" : "No se encontraron resultados"}
            </p>
            <p style={{ fontSize: 13.5, margin: "0 0 18px" }}>
              {papers.length === 0 ? "Importa tu primera investigación — solo sube un PDF o pega un enlace de Google Doc." : "Intenta ajustar los filtros o la búsqueda."}
            </p>
            {papers.length === 0 && (
              <button onClick={() => setShowImport(true)} style={{
                padding: "11px 28px", borderRadius: 10, border: "none", background: "#1a6b4a",
                color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>⚡ Importar primera investigación</button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((paper, i) => (
              <div key={paper.id} style={{ animation: `fadeIn 0.35s ease ${i * 0.04}s both` }}>
                <ResearchCard item={paper} onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} />
              </div>
            ))}
          </div>
        )}
      </main>

      {showImport && <ImportModal onImport={handleImport} onClose={() => setShowImport(false)} />}
      {showForm && <FormModal form={form} setForm={setForm} onSave={handleSave}
        onClose={() => { setShowForm(false); setEditingId(null); setIsReview(false); setForm({ ...EMPTY_FORM }); }}
        isEditing={!!editingId} isReview={isReview} />}
      {deleteId && <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
