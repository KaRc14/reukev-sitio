/**
 * ReuKev — configuración de Tailwind (tema claro, un solo acento).
 * Superficies y textos son fijos: #FFFFFF / #F8FAFC / #0F172A / #475569 / #E2E8F0.
 * El acento se define con variables CSS en src/tailwind.css:
 *   :root            -> verde (portada y demo1)
 *   [data-tema=azul]     -> demo2
 *   [data-tema=grafito]  -> demo3
 * Sin modo oscuro y sin colores de apoyo además del acento.
 */
module.exports = {
  content: [
    "./sitio-web/index.html",
    "./sitio-web/privacidad.html",
    "./sitio-web/404.html",
    "./sitio-web/demos/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#FFFFFF",
        black: "#0F172A",

        /* ---- Superficies (claras, secciones alternas #F8FAFC) ---- */
        surface: "#FFFFFF",
        "surface-dim": "#F1F5F9",
        "surface-bright": "#FFFFFF",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F8FAFC",
        "surface-container": "#F1F5F9",
        "surface-container-high": "#E2E8F0",
        "surface-container-highest": "#E2E8F0",
        "surface-variant": "#F1F5F9",
        background: "#FFFFFF",

        /* ---- Acento variable por tema (ver src/tailwind.css) ---- */
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover-rgb) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container-rgb) / <alpha-value>)",
        "primary-fixed": "rgb(var(--primary-fixed-rgb) / <alpha-value>)",
        "primary-fixed-dim": "rgb(var(--primary-fixed-dim-rgb) / <alpha-value>)",
        "on-primary": "#FFFFFF",
        "on-primary-container": "rgb(var(--on-primary-container-rgb) / <alpha-value>)",
        "on-primary-fixed": "rgb(var(--on-primary-fixed-rgb) / <alpha-value>)",

        secondary: "rgb(var(--secondary-rgb) / <alpha-value>)",
        "secondary-container": "rgb(var(--secondary-container-rgb) / <alpha-value>)",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "rgb(var(--on-secondary-container-rgb) / <alpha-value>)",

        tertiary: "#475569",
        "tertiary-container": "#E2E8F0",
        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#0F172A",
        "tertiary-fixed": "#E2E8F0",
        "on-tertiary-fixed": "#0F172A",

        /* ---- Error ---- */
        error: "#B91C1C",
        "error-container": "#FEF2F2",
        "on-error": "#FFFFFF",
        "on-error-container": "#991B1B",

        /* ---- Texto e inversos ---- */
        "on-surface": "#0F172A",
        "on-surface-variant": "#475569",
        "on-background": "#0F172A",
        inverse: "#0F172A",
        "inverse-surface": "#0F172A",
        "inverse-on-surface": "#F8FAFC",
        "inverse-primary": "rgb(var(--inverse-primary-rgb) / <alpha-value>)",

        /* ---- Bordes ---- */
        outline: "#CBD5E1",
        "outline-variant": "#E2E8F0",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        "display-hero": ["Inter", "system-ui", "sans-serif"],
        "display-hero-mobile": ["Inter", "system-ui", "sans-serif"],
        "headline-lg": ["Inter", "system-ui", "sans-serif"],
        "headline-lg-mobile": ["Inter", "system-ui", "sans-serif"],
        "headline-md": ["Inter", "system-ui", "sans-serif"],
        "headline-sm": ["Inter", "system-ui", "sans-serif"],
        "body-lg": ["Inter", "system-ui", "sans-serif"],
        "body-md": ["Inter", "system-ui", "sans-serif"],
        "label-md": ["Inter", "system-ui", "sans-serif"],
        "label-sm": ["Inter", "system-ui", "sans-serif"],
      },

      fontSize: {
        "display-hero": ["48px", { lineHeight: "56px", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-hero-mobile": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["26px", { lineHeight: "34px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-sm": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "label-sm": ["14px", { lineHeight: "20px", fontWeight: "500" }],
      },

      spacing: {
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        gutter: "1.5rem",
        margin: "2rem",
      },

      borderRadius: {
        DEFAULT: "10px",
        sm: "8px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
        full: "9999px",
      },

      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.05)",
        bar: "0 1px 8px rgba(15, 23, 42, 0.04)",
        pop: "0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)",
      },

      maxWidth: { wrap: "1200px" },
    },
  },
  plugins: [],
};
