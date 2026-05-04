/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fce4f2',
          100: '#f8c9e5',
          200: '#f19acb',
          300: '#ea6bb1',
          400: '#ee2389', // Get Set Visa pink
          500: '#b32fae', // Get Set Visa purple (mid)
          600: '#7c0bb3', // Get Set Visa purple (dark)
          700: '#6a099e',
          800: '#580889',
          900: '#470674',
        },
        gradient: {
          visa: 'linear-gradient(to left, #ee2389 0%, #7c0bb3 100%)',
        },
        gsv: {
          gradient: 'linear-gradient(to left, #ee2389 0%, #7c0bb3 100%)',
        },
        accent: {
          orange: '#fd7e14',
          green: '#198754',
          red: '#dc3545',
          gray: '#6c757d',
        },
        background: {
          DEFAULT: '#fff',
          light: '#f8f9fa',
        },
        text: {
          DEFAULT: '#212529',
          muted: '#545454',
        },
      },
      fontFamily: {
        sans: ['Lato', 'Inter var', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Merriweather', 'serif'],
        visa: ['Lato', 'Inter var', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gsv-gradient': 'linear-gradient(to left, #ee2389 0%, #7c0bb3 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 