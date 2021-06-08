module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      // add your custom rules.
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    ],
  },
};
