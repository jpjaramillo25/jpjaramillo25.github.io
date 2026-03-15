import { useState, useEffect, useCallback } from "react";

const STATUS_CONFIG = {
  published: { label: "Published", color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.25)" },
  review: { label: "Forthcoming", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" },
  nonpeer: { label: "Non Peer-Reviewed", color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)" },
  draft: { label: "Work in Progress", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
};

const PROFILE = {
  name: "Juan Pablo",
  surname: "Jaramillo-Ramón",
  degree: "M.A. Comparative Politics · M.A. Economics",
  affiliation: "FLACSO Ecuador",
  location: "Quito, Ecuador",
  bio: "I hold a Master's degree in Comparative Politics from FLACSO Ecuador and an M.A. in Economics from Universidad EAFIT (Colombia). My research sits at the intersection of democratic legitimacy, state capacity, political economy, and violence in Latin America. I employ quantitative methods—including panel data analysis, cluster analysis, and survey-based approaches—to study how weak institutions, personalist leadership, and organized crime reshape democratic governance across the region.",
  areas: ["State Capacity & Violence", "Democratic Backsliding", "Political Economy of Development", "Electoral Behavior & Polarization", "Organized Crime", "Fiscal Policy & Institutions"],
  orcid: "0000-0001-6161-4477",
  email: "jpjaramillo25@gmail.com",
  scholar: "https://scholar.google.com/citations?user=-LtZcTUAAAAJ&hl=es",
  twitter: "jpjaramillo25",
};

const FALLBACK_PAPERS = [
  {
    id: "pub_1",
    title: "Del rostro al voto: adhesiones afectivas, miedo y particularismo en las elecciones presidenciales de Ecuador 2025",
    authors: "Pino-Uribe, J.F.; Jaramillo-Ramón, J.P.",
    journal: "Democracias, Vol.15(2), pp. 119-157",
    date: "2025-11-01",
    status: "published",
    doi: "10.54887/27376192.153",
    keywords: "adhesión afectiva, elecciones presidenciales Ecuador, miedo, reciprocidad particularista, polarización afectiva",
    abstract: "Este artículo analiza las adhesiones afectivas de los principales candidatos en las elecciones presidenciales de 2025 en Ecuador. Con base en una encuesta nacional representativa (n=1200; margen de error ±3%), se utiliza una estrategia cuantitativa que combina el análisis de conglomerados y regresiones logísticas binarias para identificar perfiles de adhesión en torno a Daniel Noboa, Luisa González y Rafael Correa.",
  },
  {
    id: "pub_2",
    title: "Homicidios sin fronteras: la transnacionalidad subnacional del narcotráfico en Ecuador y Colombia (2015-2022)",
    authors: "Pino-Uribe, J.F.; Jaramillo-Ramón, J.P.; Piedrahita-Bustamante, P.",
    journal: "Revista Criminalidad, 67(1): 59-77",
    date: "2025-01-01",
    status: "published",
    doi: "10.47741/17943108.637",
    keywords: "narcotráfico, homicidios, Ecuador, Colombia, transnacionalidad subnacional",
    abstract: "Este artículo explora los patrones subnacionales del crimen organizado transnacional relacionados con el narcotráfico y la violencia homicida entre el sur de Colombia y Ecuador durante el periodo 2015-2022.",
  },
  {
    id: "pub_3",
    title: "The Impact of Coca-Cultivation and Drug Trafficking Arrests on Homicide Rates in Ecuador: A Transnational Perspective",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "coca cultivation, drug trafficking, homicide rates, Ecuador, transnational crime",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1xSP3GhPpSc0WuI7vvar7i_1TfLvJVQd0ZgCwtN8W5yA/edit",
  },
  {
    id: "pub_4",
    title: "Femicidios en Ecuador (2015-2021): un análisis subnacional del impacto de la Ley de Erradicación de la Violencia de Género",
    authors: "Castillo Fell, S.; Jaramillo-Ramón, J.P.",
    journal: "Reflexión Política, Vol.26(53), pp. 149-162",
    date: "2024-06-29",
    status: "published",
    doi: "10.29375/01240781.4995",
    keywords: "Ecuador, violencia de género, mujer, política, legislación, femicidio, análisis subnacional",
    abstract: "Esta investigación analiza el impacto de la Ley Orgánica de Erradicación de Violencia de Género sobre la tasa de femicidios a nivel subnacional en Ecuador. Se emplea un análisis cuantitativo de regresión con datos de panel que evidencia que la violencia de género reaccionó a los cambios institucionales formales y revirtió la tendencia en el aumento de los femicidios, pese al incremento de la criminalidad en el país.",
  },
  {
    id: "pub_5",
    title: "Ecuador since 2021: Escalation in Homicides, Weak State, and Transnational-Subnational Organized Crime",
    authors: "Jaramillo-Ramón, J.P.; Pino-Uribe, J.F.; Piedrahita-Bustamante, P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "organized crime, transnational crime, subnational dynamics, Ecuador, drug trafficking",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1whLuYJQqMA9PDZJFdOGIuao7hA6Pgwosn2EoSzV6s-0/edit?usp=drivesdk",
  },
  {
    id: "pub_6",
    title: "Autoritarismo competitivo en Ecuador: la presidencia de Daniel Noboa (2023-2026)",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "autoritarismo competitivo, Ecuador, Daniel Noboa, democracia, presidencialismo",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1mwlWxxM_GrOmV8v0P4kuBMPcF6s0sKlS/edit?usp=drivesdk",
  },
  {
    id: "pub_7",
    title: "Institutional Personalism: Charismatic Leadership, Performance Legitimacy, and Political Trust in Ecuador, 2004–2019",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "institutional personalism, charismatic leadership, performance legitimacy, political trust, Ecuador",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1Uf_0J2Hpr3H4vK8Dpb834i5E9ZSzlsSBl9_QGn31QkQ/edit?usp=drivesdk",
  },
  {
    id: "pub_8",
    title: "Anchoring Bias in Runoff Polls: Evidence from the 2025 Ecuadorian Election",
    authors: "Curvale, C.; Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "anchoring bias, runoff elections, polling, Ecuador, 2025 election, behavioral economics",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1CsRx6oaqjevaZMnd587pm96J8tPbN30TARM0jFOQrO0/edit?usp=drivesdk",
  },
  {
    id: "pub_9",
    title: "Generations, Coups and Political Attitudes in Latin America: Evidence from the AmericasBarometer (2004-2019)",
    authors: "Curvale, C.; Jaramillo-Ramón, J.P.; Fierro, M.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "generations, coups, political attitudes, Latin America, AmericasBarometer, political socialization",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/16JVbvNuAxRodYsEib0_0h47rShiMoJKH9qlpGS3DTWI/edit?usp=drivesdk",
  },
  {
    id: "pub_10",
    title: "Ecuador's Rapid Slide into Competitive Authoritarianism: The Noboa Presidency (2023–2025)",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "competitive authoritarianism, Ecuador, Noboa, democratic backsliding, presidentialism",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/17xToEhy7u-zPSl0n_dG1X3YHxBJr7zeL1wUIjUJkjsQ/edit?usp=drivesdk",
  },
  {
    id: "pub_11",
    title: "Oil, Institutions, and Human Development: Evidence from a Panel of Resource-Producing Countries",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "oil, institutions, human development, resource curse, panel data, developing countries",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1vL66g9FjYwf4rEfJYS11JVt8b_iOx7en/edit?usp=drivesdk",
  },
  {
    id: "pub_12",
    title: "Ideological Congruence and Democratic Support During the Pink Tide: A Cross-Level Analysis of Citizen-Government Ideology in Latin America",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "ideological congruence, democratic support, Pink Tide, Latin America, citizen-government ideology, cross-level analysis",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1qSrGiUVvapvqgbkiSNV9NiL7eOXm-hwD/edit?usp=drivesdk",
  },
  {
    id: "pub_13",
    title: "When the Strongman Builds the State: Personalist Leadership and Institutional Trust in Ecuador",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "personalist leadership, institutional trust, state-building, Ecuador, strongman politics",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1w5WFCCBYVu7xv7AJ04Ch_-uf0SB1nOzlWCbzFwiMkwA/edit?usp=drivesdk",
  },
  {
    id: "pub_14",
    title: "Homicidal Violence and State Capacity in Latin America: The Story of the Paper Leviathans",
    authors: "Jaramillo-Ramón, J.P.; Curvale, C.",
    journal: "Crime, Law and Social Change (Springer). Aceptado.",
    date: "",
    status: "review",
    doi: "",
    keywords: "homicidal violence, state capacity, Latin America, Paper Leviathans, weak states, crime",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1vmqszkkdgz0Mf6AZWWpBF8QlKIUNdlfk/edit?usp=drivesdk",
  },
  {
    id: "pub_15",
    title: "Militarización extranjera como política de seguridad interna y polarización del relato político en Ecuador: ¿Retorna la Base Militar de Manta?",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "Política Criminal. Aceptado.",
    date: "",
    status: "review",
    doi: "",
    keywords: "militarización, seguridad interna, polarización política, Ecuador, Base de Manta, política de defensa",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/12eOyzWpT_wCuNNRa-CMmTX-bLtOjfEBbukVQQF29WQ8/edit?usp=drivesdk",
  },
  {
    id: "pub_16",
    title: "Late Industrialization and Growth: Evidence from 94 Countries in the Global Periphery",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "CEPAL Review / Revista de la CEPAL. Aceptado.",
    date: "",
    status: "review",
    doi: "",
    keywords: "late industrialization, economic growth, Global Periphery, development economics, panel data",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1ghNQ3pSAlinzHy0uxTkv0VkIMBPQkfuhF31GlWkHgbw/edit?usp=drivesdk",
  },
  {
    id: "pub_nonpeer_1",
    title: "The External Effect of Urban Schooling Attainment on Workers' Incomes in Ecuador",
    authors: "Breton, T.R.; Jaramillo-Ramón, J.P.",
    journal: "SSRN Working Paper",
    date: "2014-12-01",
    status: "nonpeer",
    doi: "",
    keywords: "urban schooling, human capital externalities, workers' incomes, Ecuador, education economics",
    abstract: "",
    fileUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2537544",
  },
  {
    id: "pub_nonpeer_2",
    title: "¿Son las instituciones educativas privadas mejores que las públicas? El caso de Ecuador, una medición a partir de Ser Bachiller 2014",
    authors: "Jaramillo-Ramón, J.P.; Velastegui, L.",
    journal: "Working Paper",
    date: "2015-01-01",
    status: "nonpeer",
    doi: "",
    keywords: "educación privada, educación pública, Ecuador, Ser Bachiller, calidad educativa",
    abstract: "",
    fileUrl: "https://www.academia.edu/145331653/_Son_las_instituciones_educativas_privadas_mejores_que_las_p%C3%BAblicas_El_caso_de_Ecuador_una_medici%C3%B3n_a_partir_de_Ser_Bachiller_2014",
  },
  {
    id: "pub_17",
    title: "Ecuador's Fast Track to Competitive Authoritarianism: Daniel Noboa Ruling (2023-2026)",
    authors: "Jaramillo-Ramón, J.P.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "competitive authoritarianism, Ecuador, Daniel Noboa, democratic erosion, presidentialism",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1nhr1NGrP189BLWqKuilC2mJZ5-BS1vvS/edit?usp=drivesdk",
  },
  {
    id: "pub_18",
    title: "Fiscal Configurations and the Colonial Legacy: The Impact of Tax Collection and Inequality on Welfare in Latin America",
    authors: "Jaramillo-Ramón, J.P.; Pino-Uribe, J.F.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "fiscal configurations, colonial legacy, tax collection, inequality, welfare, Latin America",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/19YpOI2pXhyCPLZtWpKPaeZZ9lct2MQA-aaZ3r0xqVEg/edit?usp=drivesdk",
  },
  {
    id: "pub_19",
    title: "Tax Regimes in Latin America",
    authors: "Jaramillo-Ramón, J.P.; Pino-Uribe, J.F.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "tax regimes, Latin America, fiscal policy, taxation, political economy",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/1UBaVHnYT9kvP00FqdM8YbHLSkz4nU2J8PuTtqFuk3bY/edit?usp=drivesdk",
  },
  {
    id: "pub_20",
    title: "\"Luisa te desdolariza\": emociones y desinformación en el balotaje ecuatoriano de 2025",
    authors: "Jaramillo-Ramón, J.P.; Curvale, C.",
    journal: "",
    date: "",
    status: "draft",
    doi: "",
    keywords: "desinformación, emociones, dolarización, balotaje, Ecuador 2025, comunicación política",
    abstract: "",
    fileUrl: "https://docs.google.com/document/d/14VQjA2uvqZWyT9PIGtNo_FWWptrnbKvzxwgW3g4Yiaw/edit?usp=drivesdk",
  },
];

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      letterSpacing: "0.03em", fontFamily: "var(--mono)",
    }}>
      {cfg.label}
    </span>
  );
}

function PaperCard({ paper, index }) {
  const [open, setOpen] = useState(false);
  const year = paper.date ? new Date(paper.date).getFullYear() : "—";
  return (
    <div
      style={{
        padding: "28px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
        animation: `slideUp 0.5s ease ${0.1 + index * 0.08}s both`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent)", fontWeight: 700,
            }}>{year}</span>
            <StatusPill status={paper.status} />
          </div>
          <h3
            onClick={() => setOpen(!open)}
            style={{
              fontSize: 18, fontWeight: 600, color: "#f0ece4", margin: "0 0 6px",
              lineHeight: 1.4, fontFamily: "var(--display)", cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.target.style.color = "#f0ece4"}
          >
            {paper.title}
          </h3>
          <p style={{ fontSize: 13.5, color: "rgba(240,236,228,0.55)", margin: "0 0 4px", fontFamily: "var(--body)" }}>
            {paper.authors}
          </p>
          {paper.journal && (
            <p style={{ fontSize: 13, color: "rgba(240,236,228,0.4)", margin: 0, fontStyle: "italic", fontFamily: "var(--body)" }}>
              {paper.journal}
            </p>
          )}
        </div>
        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)",
              textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap",
              transition: "all 0.2s", background: "rgba(255,255,255,0.03)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.target.style.background = "rgba(212,175,55,0.1)"; e.target.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            DOI ↗
          </a>
        )}
        {!paper.doi && paper.fileUrl && (
          <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" style={{
            padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(167,139,250,0.3)",
            fontSize: 11, fontFamily: "var(--mono)", color: "#a78bfa",
            textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
          }}>
            Draft ↗
          </a>
        )}
      </div>
      {open && (paper.abstract || paper.keywords) && (
        <div style={{ marginTop: 14, paddingLeft: 0, animation: "fadeIn 0.3s ease" }}>
          {paper.abstract && (
            <p style={{ fontSize: 13.5, color: "rgba(240,236,228,0.5)", lineHeight: 1.7, margin: "0 0 10px", fontFamily: "var(--body)" }}>
              {paper.abstract}
            </p>
          )}
          {paper.keywords && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {paper.keywords.split(",").map((kw, i) => (
                <span key={i} style={{
                  padding: "2px 9px", borderRadius: 6, fontSize: 11,
                  background: "rgba(255,255,255,0.04)", color: "rgba(240,236,228,0.4)",
                  fontFamily: "var(--mono)", border: "1px solid rgba(255,255,255,0.06)",
                }}>{kw.trim()}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AcademicProfile() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadPapers = useCallback(async () => {
    try {
      const result = await window.storage.get("research-papers");
      if (result && result.value) {
        const stored = JSON.parse(result.value);
        setPapers(stored.length > 0 ? stored : FALLBACK_PAPERS);
      } else {
        setPapers(FALLBACK_PAPERS);
      }
    } catch {
      setPapers(FALLBACK_PAPERS);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadPapers(); }, [loadPapers]);

  const filtered = papers
    .filter((p) => filter === "all" || p.status === filter)
    .sort((a, b) => {
      const statusOrder = { published: 0, review: 1, nonpeer: 2, draft: 3 };
      const sa = statusOrder[a.status] ?? 3;
      const sb = statusOrder[b.status] ?? 3;
      if (sa !== sb) return sa - sb;
      return (b.date || "").localeCompare(a.date || "");
    });

  const counts = {
    all: papers.length,
    published: papers.filter((p) => p.status === "published").length,
    review: papers.filter((p) => p.status === "review").length,
    nonpeer: papers.filter((p) => p.status === "nonpeer").length,
    draft: papers.filter((p) => p.status === "draft").length,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0b09",
      color: "#f0ece4",
      fontFamily: "var(--body)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        :root {
          --display: 'Cormorant Garamond', serif;
          --body: 'Outfit', sans-serif;
          --mono: 'JetBrains Mono', monospace;
          --accent: #d4af37;
          --bg: #0c0b09;
        }
        * { box-sizing: border-box; margin: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lineGrow { from { width: 0; } to { width: 64px; } }
        @keyframes grain {
          0%, 100% { transform: translate(0,0); }
          10% { transform: translate(-5%,-10%); }
          30% { transform: translate(3%,5%); }
          50% { transform: translate(-8%,2%); }
          70% { transform: translate(5%,-5%); }
          90% { transform: translate(-3%,8%); }
        }
        body { background: #0c0b09; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 3px; }
        a { color: var(--accent); }
      `}</style>

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        animation: "grain 8s steps(10) infinite",
      }} />

      {/* Accent line top */}
      <div style={{ height: 2, background: "linear-gradient(90deg, transparent, var(--accent), transparent)", opacity: 0.5 }} />

      {/* Header */}
      <header style={{
        maxWidth: 800, margin: "0 auto", padding: "80px 32px 60px",
        position: "relative", zIndex: 1,
      }}>
        {/* Overline */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
          animation: "fadeIn 0.6s ease 0.1s both",
        }}>
          <div style={{ width: 64, height: 1.5, background: "var(--accent)", animation: "lineGrow 0.8s ease 0.3s both" }} />
          <span style={{
            fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)",
          }}>
            Researcher · {PROFILE.affiliation}
          </span>
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: "var(--display)", fontWeight: 600, fontSize: 58,
          lineHeight: 1.05, margin: "0 0 6px", letterSpacing: "-0.02em",
          animation: "slideUp 0.7s ease 0.15s both",
        }}>
          {PROFILE.name}<br />
          <span style={{ color: "var(--accent)" }}>{PROFILE.surname}</span>
        </h1>

        <p style={{
          fontFamily: "var(--mono)", fontSize: 13, color: "rgba(240,236,228,0.4)",
          margin: "12px 0 0", fontWeight: 400,
          animation: "slideUp 0.7s ease 0.25s both",
        }}>
          {PROFILE.degree} · {PROFILE.location}
        </p>

        {/* Bio */}
        <p style={{
          fontSize: 16.5, lineHeight: 1.75, color: "rgba(240,236,228,0.6)",
          maxWidth: 600, margin: "28px 0 0", fontWeight: 300,
          animation: "slideUp 0.7s ease 0.35s both",
        }}>
          {PROFILE.bio}
        </p>

        {/* Research areas */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24,
          animation: "slideUp 0.7s ease 0.45s both",
        }}>
          {PROFILE.areas.map((area, i) => (
            <span key={i} style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
              background: "rgba(212,175,55,0.08)", color: "var(--accent)",
              border: "1px solid rgba(212,175,55,0.15)", fontFamily: "var(--body)",
            }}>{area}</span>
          ))}
        </div>

        {/* Links */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 20, marginTop: 28,
          animation: "slideUp 0.7s ease 0.55s both",
        }}>
          {[
            { label: "ORCID", href: `https://orcid.org/${PROFILE.orcid}` },
            { label: "Google Scholar", href: PROFILE.scholar },
            { label: `@${PROFILE.twitter}`, href: `https://x.com/${PROFILE.twitter}` },
            { label: PROFILE.email, href: `mailto:${PROFILE.email}` },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12.5, fontFamily: "var(--mono)", color: "rgba(240,236,228,0.45)",
                textDecoration: "none", fontWeight: 500, transition: "color 0.2s",
                borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 2,
              }}
              onMouseEnter={(e) => { e.target.style.color = "var(--accent)"; e.target.style.borderColor = "var(--accent)"; }}
              onMouseLeave={(e) => { e.target.style.color = "rgba(240,236,228,0.45)"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </header>

      {/* Divider */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Publications */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px 80px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          flexWrap: "wrap", gap: 16, marginBottom: 12,
          animation: "slideUp 0.6s ease 0.6s both",
        }}>
          <div>
            <span style={{
              fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)",
            }}>
              Academic Output
            </span>
            <h2 style={{
              fontFamily: "var(--display)", fontSize: 36, fontWeight: 600,
              margin: "6px 0 0", letterSpacing: "-0.01em",
            }}>
              Publications & Working Papers
            </h2>
          </div>
          <p style={{
            fontFamily: "var(--mono)", fontSize: 12, color: "rgba(240,236,228,0.35)",
          }}>
            {counts.all} papers · {counts.published} published
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap",
          animation: "slideUp 0.6s ease 0.65s both",
        }}>
          {[
            { key: "all", label: `All (${counts.all})` },
            { key: "published", label: `Published (${counts.published})` },
            { key: "review", label: `Forthcoming (${counts.review})` },
            { key: "nonpeer", label: `Non Peer-Reviewed (${counts.nonpeer})` },
            { key: "draft", label: `In Progress (${counts.draft})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "1px solid",
                borderColor: filter === tab.key ? "var(--accent)" : "rgba(255,255,255,0.08)",
                background: filter === tab.key ? "rgba(212,175,55,0.1)" : "transparent",
                color: filter === tab.key ? "var(--accent)" : "rgba(240,236,228,0.4)",
                fontSize: 12, fontFamily: "var(--mono)", fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Papers list */}
        {loading ? (
          <p style={{ textAlign: "center", padding: 60, color: "rgba(240,236,228,0.3)", fontFamily: "var(--mono)", fontSize: 13 }}>
            Loading publications...
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: 60, color: "rgba(240,236,228,0.3)", fontFamily: "var(--mono)", fontSize: 13 }}>
            No publications found in this category.
          </p>
        ) : (
          <div>
            {filtered.map((paper, i) => (
              <PaperCard key={paper.id} paper={paper} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        maxWidth: 800, margin: "0 auto", padding: "0 32px 48px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 11, color: "rgba(240,236,228,0.2)",
          }}>
            © {new Date().getFullYear()} {PROFILE.name} {PROFILE.surname}
          </span>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 11, color: "rgba(240,236,228,0.15)",
          }}>
            Synced with research repository
          </span>
        </div>
      </footer>
    </div>
  );
}
