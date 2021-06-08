module.exports = {
  stories: ['../stories/**/*.stories.@(js|ts|mdx)'],
  addons: ['@storybook/addon-essentials'],
  typescript: {
    check: false,
    checkOptions: {},
    // NOTE: https://github.com/styleguidist/react-docgen-typescript/issues/356
    reactDocgen: 'none',
  },
};
