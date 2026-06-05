/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand accent — Clay / Terracotta (warm). OKLCH.
        brand: {
          50:  'oklch(96.5% 0.018 55)',
          100: 'oklch(93% 0.035 53)',
          200: 'oklch(87% 0.060 50)',
          300: 'oklch(79% 0.090 48)',
          400: 'oklch(68% 0.115 46)',
          500: 'oklch(60% 0.135 45)',
          600: 'oklch(54% 0.135 44)',
          700: 'oklch(47% 0.125 43)',  // botones (AA con texto crema)
          800: 'oklch(39% 0.100 42)',
          900: 'oklch(32% 0.070 44)',
          950: 'oklch(24% 0.045 46)',
        },
        // Secondary — Pine / Growth. Uso mínimo.
        accent: {
          50:  'oklch(96% 0.020 160)',
          100: 'oklch(92% 0.035 160)',
          200: 'oklch(85% 0.055 162)',
          300: 'oklch(75% 0.070 162)',
          400: 'oklch(65% 0.078 160)',
          500: 'oklch(55% 0.078 159)',
          600: 'oklch(48% 0.070 158)',
          700: 'oklch(41% 0.060 158)',
          800: 'oklch(34% 0.048 158)',
          900: 'oklch(28% 0.038 159)',
        },
        // Neutral redefined to WARM grays (was cool slate). Harmonizes with cream paper.
        slate: {
          50:  'oklch(97.6% 0.009 83)',
          100: 'oklch(94.5% 0.011 80)',
          200: 'oklch(88% 0.012 78)',
          300: 'oklch(80% 0.012 75)',
          400: 'oklch(64% 0.014 65)',
          500: 'oklch(52% 0.015 60)',
          600: 'oklch(44% 0.016 58)',
          700: 'oklch(36% 0.017 56)',
          800: 'oklch(29% 0.018 54)',
          900: 'oklch(23% 0.018 52)',
          950: 'oklch(18% 0.016 50)',
        },
        paper: 'oklch(97.6% 0.009 83)',
        ink: 'oklch(24% 0.018 55)',
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
      },
      letterSpacing: {
        tightish: '-0.02em',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
