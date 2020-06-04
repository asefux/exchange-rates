module.exports = {
  extends: 'airbnb-base',
  rules: {
    indent: ['error', 2],
    'no-tabs': 0,
    'import/no-unresolved': 1,
    camelcase: 0,
  },
  env: {
    mocha: true,
  },
  globals: {
    expect: true,
  },
};
