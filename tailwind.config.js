module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      flex: {
        '2': '2 2 0%',
      },
      width: {
        'screen-lg': '1024px',
      },
      maxWidth: {
        '3/5': '60%',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/custom-forms')],
}
