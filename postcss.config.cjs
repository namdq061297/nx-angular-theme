const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'apps/sk-106/tailwind.config.js'),
    },
    autoprefixer: {},
  },
};