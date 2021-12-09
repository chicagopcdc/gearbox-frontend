module.exports = {
  content: ['./src/**/*.tsx'],
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
      minWidth: {
        '1/2': '50%',
      },
      fontFamily: {
        display: 'Bebas neue',
        body: 'Lato',
      },
      colors: {
        primary: '#CC0000',
        secondary: '#AA0000',
        inherit: 'inherit',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
