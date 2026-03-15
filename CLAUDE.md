# Repositorio Académico — Juan Pablo Jaramillo-Ramón

## Descripción del proyecto
Sitio web de perfil académico y repositorio de investigaciones para Juan Pablo Jaramillo-Ramón, investigador en FLACSO Ecuador.

## Archivos principales
| Archivo | Descripción |
|---------|-------------|
| `index.html` | Página HTML estática del perfil académico (dark theme, fuentes Cormorant Garamond / Outfit / JetBrains Mono, acento dorado `#d4af37`) |
| `academic-profile.jsx` | Componente React del perfil académico con lista de publicaciones y filtros |
| `research-repository.jsx` | Componente React del repositorio de investigaciones con CRUD completo (LocalStorage) |

## Tecnologías
- HTML5 / CSS3 vanilla en `index.html`
- React (JSX) en los componentes `.jsx`
- Sin bundler configurado — los `.jsx` son componentes standalone

## Perfil del investigador
- **Nombre:** Juan Pablo Jaramillo-Ramón
- **Institución:** FLACSO Ecuador (Quito)
- **Grados:** M.A. Comparative Politics · M.A. Economics (EAFIT)
- **ORCID:** 0000-0001-6161-4477
- **Email:** jpjaramillo25@gmail.com
- **Google Scholar:** https://scholar.google.com/citations?user=-LtZcTUAAAAJ&hl=es

## Áreas de investigación
- State Capacity & Violence
- Democratic Backsliding
- Political Economy of Development
- Electoral Behavior & Polarization
- Organized Crime
- Fiscal Policy & Institutions

## Estados de publicación
- `published` → Publicado
- `review` → Forthcoming / Por Publicar
- `nonpeer` → Non Peer-Reviewed / Sin Revisión de Pares
- `draft` → Work in Progress / En Construcción

## Convenciones de código
- Datos del perfil en constantes `PROFILE` / `SEED_PAPERS` en la parte superior de cada archivo
- Paleta dark: `--bg: #0c0b09`, `--text: #f0ece4`, `--accent: #d4af37`
- Los componentes React usan hooks (`useState`, `useEffect`, `useCallback`) y no dependen de librerías externas salvo React

## Workflow recomendado
- Para editar datos del investigador → modificar constante `PROFILE` en `academic-profile.jsx` y el bloque equivalente en `index.html`
- Para agregar publicaciones → agregar objeto a `FALLBACK_PAPERS` (academic-profile.jsx) y `SEED_PAPERS` (research-repository.jsx)
- Hacer commit después de cada cambio significativo: `git add . && git commit -m "descripción"`
