/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Puente semántico → tokens canónicos (src/styles/tokens.css).
      // Las utilidades de color de Tailwind salen del mismo var(--…) que el CSS.
      // Nota (Tailwind 3): var() en colores no admite <alpha-value>, así que
      // utilidades de opacidad (p. ej. bg-accent/50) no aplican; las
      // transparencias se manejan con OKLCH directo en CSS.
      colors: {
        paper: 'var(--color-paper)',
        'paper-2': 'var(--color-paper-2)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        'ink-deep': 'var(--color-ink-deep)',
        hairline: 'var(--color-hairline)',
        accent: 'var(--color-accent)',
        'accent-deep': 'var(--color-accent-deep)',
        'accent-soft': 'var(--color-accent-soft)',
        pine: 'var(--color-pine)',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
};
