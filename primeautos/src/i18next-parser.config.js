module.exports = {
    locales: ['en', 'es'],
    output: 'src/locales/$LOCALE.json',
    options: {
      debug: false,
      sort: true,
      indentation: 2,
      keySeparator: '.',
      nsSeparator: ':',
      defaultValue: '',
      skipDefaultValues: false,
      removeUnusedKeys: false,
      keepRemoved: false,
      // Otras opciones según tus necesidades
    },
  };
  