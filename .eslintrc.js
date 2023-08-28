module.exports = {
  'env': {
    commonjs: true,
    es2021: true,
    node: true
  },
  'extends': 'standard',
  'overrides': [
  ],
  'parserOptions': {
    ecmaVersion: 'latest'
  },
  'rules': {
    'semi': ['error', 'always'],
    'semi-spacing': ['error', {
      'before': false,
      'after': true
    }],
    'semi-style': ['error', 'last'],
    'no-extra-semi': 'error',
    'comma-dangle': ['warn', 'never'],
    'quote-props': ['error', 'consistent', {
      'keywords': true
    }],
    'quotes': ['error', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
    'strict': ['error', 'never'],
    'camelcase': ['off']
  }

};
