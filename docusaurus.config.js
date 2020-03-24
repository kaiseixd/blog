module.exports = {
  title: 'Satellite Cafe',
  url: 'https://kaiseixd.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'kaiseixd',
  projectName: 'blog',
  themeConfig: {
    navbar: {
      title: "Satellite Cafe",
      hideOnScroll: true,
    },
    prism: {
      defaultLanguage: 'javascript',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          path: './blog',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
