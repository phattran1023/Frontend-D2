/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        border: '#f3f3f3',
        background: '#F7F8F9',
        white: '#FFFFFF',
        black: '#000000',
      },
      fontSize: {
        small: [
          '12px',
          {
            lineHeight: '18px',
          },
        ],
        medium: [
          '14px',
          {
            lineHeight: '22px',
          }
        ],
        large: [
          '16px',
          {
            lineHeight: '24px'
          }
        ]
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}

