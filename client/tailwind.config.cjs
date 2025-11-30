// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'primary-hover': '#ffffff',
        'text': '#000000',
        'text-muted': '#6b7280',
        'border': '#e6e6e6',
        'card-bg': '#ffffff',
        'input-bg': '#ffffff',
        'error': '#dc2626',
        'success': '#000000',
      },
      boxShadow: {
        'sm': '0 4px 18px rgba(2, 6, 23, 0.04)',
        'md': '0 12px 36px rgba(2, 6, 23, 0.06)',
      },
      borderRadius: {
        'btn': '10px',
      },
    },
  },
  plugins: [],
}