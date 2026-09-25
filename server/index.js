const babelRegister = require('@babel/register');
const register = babelRegister.default || babelRegister;

register({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
    ['@babel/plugin-transform-class-properties', { loose: true }]
  ]
});

require('./src/main');