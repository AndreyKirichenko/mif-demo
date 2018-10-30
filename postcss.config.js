module.exports = {
  plugins: [
    require('autoprefixer')({ grid: true, browsers: ['last 2 versions', 'ie 11']  }),
    require('postcss-clean')
  ]
};
