module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
    "plugin:prettier/recommended",
  ],
  // required to lint *.vue files
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-shadow': 'off',
    'no-param-reassign': 'warn',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
