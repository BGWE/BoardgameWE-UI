module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'indent': ['error', 2, {'SwitchCase': 1}],
    'quotes': ['error', 'single', {'avoidEscape': true}],
    'brace-style': ['error', 'stroustrup'],
    'array-bracket-spacing': ['error', 'never'],
    'semi': ['error', 'always'],
    'no-console': ['off']
  },
  'parserOptions': {
    'parser': 'babel-eslint'
  }
};
