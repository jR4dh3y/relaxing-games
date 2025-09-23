/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'gradient-rage': 'linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)'
      }
    }
  },
  plugins: []
}
