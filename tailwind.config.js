/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
        slate: {
          DEFAULT: '#2C3E50',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        cyan: {
          DEFAULT: '#4FD1C5',
          400: '#4FD1C5',
          300: '#81E6D9',
          500: '#38B2AC',
          50: '#E6FFFA',
        },
        neutral: '#F5F7FA',
        charcoal: '#1A202C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
