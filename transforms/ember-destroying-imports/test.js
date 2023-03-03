'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'ember-destroying-imports',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
