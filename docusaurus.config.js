module.exports = {
  title: 'Satellite Cafe',
  tagline: 'dd',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
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
