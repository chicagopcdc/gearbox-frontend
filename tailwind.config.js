module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      flex: {
        2: '2 2 0%',
      },
      width: {
        '1/2': '50%',
        'screen-lg': '1024px',
      },
      maxWidth: {
        '3/5': '60%',
      },
      fontFamily: {
        display: 'Bebas neue',
        body: 'Lato',
      },
      colors: {
        primary: '#CC0000',
        secondary: '#AA0000',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
}
