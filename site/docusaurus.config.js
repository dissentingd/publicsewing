// publicsewing.org. See README.md in this folder.
import path from 'node:path'
import { themes } from 'prism-react-renderer'

const repo = 'https://github.com/dissentingd/publicsewing'

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'PublicSewing',
  tagline: 'Made-to-measure patterns for practical, timeless garments',
  url: 'https://publicsewing.org',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },
  i18n: { defaultLocale: 'en', locales: ['en'] },
  headTags: [
    // A request not to use the site for AI training (see static/robots.txt and ai.txt)
    { tagName: 'meta', attributes: { name: 'robots', content: 'noai, noimageai' } },
  ],
  presets: [
    [
      'classic',
      {
        docs: { routeBasePath: '/', sidebarPath: './sidebars.js', editUrl: undefined },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      },
    ],
  ],
  plugins: [
    // The pattern editor (@freesewing/react): Tailwind 4 + daisyUI, our designs in place of
    // FreeSewing's collection, and our design code's FreeSewing packages from this folder
    () => ({
      name: 'publicsewing-editor',
      configurePostCss(options) {
        options.plugins.unshift('@tailwindcss/postcss')
        // Keep Tailwind's cascade layers: postcss-preset-env would flatten them
        for (const p of options.plugins)
          if (Array.isArray(p) && /postcss-preset-env/.test(p[0]))
            p[1] = { ...p[1], features: { 'cascade-layers': false, 'is-pseudo-class': false } }
        return options
      },
      configureWebpack(config, isServer, { getJSLoader }) {
        return {
          module: {
            rules: [
              // @freesewing/react ships untranspiled JSX in .mjs files
              {
                test: /\.mjs$/,
                include: path.resolve('node_modules/@freesewing/react'),
                use: getJSLoader({ isServer }),
                resolve: { fullySpecified: false },
              },
            ],
          },
          resolve: {
            alias: { '@freesewing/collection$': path.resolve('src/lib/collection.mjs') },
            modules: [path.resolve('node_modules'), 'node_modules'],
          },
        }
      },
    }),
  ],
  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: 'PublicSewing',
      items: [
        { to: '/designs', label: 'Designs', position: 'left' },
        { to: '/measure', label: 'Measure', position: 'left' },
        { to: '/muslin', label: 'Sew a muslin', position: 'left' },
        { to: '/report', label: 'Report a test', position: 'left' },
        { href: repo, label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'light',
      copyright:
        'PublicSewing © David Borowski II. Code PolyForm Noncommercial 1.0.0, content CC BY-NC 4.0. ' +
        'Built on FreeSewing (MIT), not part of it. Not for AI training. No cookies, no analytics.',
    },
    prism: { theme: themes.github, darkTheme: themes.dracula },
  },
}
