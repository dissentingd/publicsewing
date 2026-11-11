// publicsewing.org. See README.md in this folder.
import path from 'node:path'
import { themes } from 'prism-react-renderer'

const repo = 'https://github.com/dissentingd/publicsewing'

// Docusaurus's second CSS minifier, clean-css, can't parse daisyUI's @starting-style blocks: it
// leaves a stray '}' that makes the browser drop the next rule (our light-mode :root palette).
// This keeps cssnano and skips clean-css.
process.env.USE_SIMPLE_CSS_MINIFIER ??= 'true'

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'PublicSewing',
  tagline: 'Made-to-measure patterns for practical, timeless garments',
  url: 'https://publicsewing.org',
  baseUrl: '/',
  favicon: 'img/favicon.svg',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },
  i18n: { defaultLocale: 'en', locales: ['en'] },
  headTags: [
    // A request not to use the site for AI training (see static/robots.txt and ai.txt)
    { tagName: 'meta', attributes: { name: 'robots', content: 'noai, noimageai' } },
    // Home-screen icon on iPhones and iPads; browsers without SVG icons use static/favicon.ico
    { tagName: 'link', attributes: { rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png' } },
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
    // A renamed page's or design's old address
    ['@docusaurus/plugin-client-redirects', {
      redirects: [
        { from: '/muslin', to: '/sew-and-test' },
        { from: '/report', to: '/sew-and-test' },
        { from: '/designs/trousers', to: '/designs/suit-trousers' },
        { from: '/designs/shirt', to: '/designs/dress-shirt' },
        { from: '/designs/jacket', to: '/designs/suit-jacket' },
        { from: '/designs/boys-jacket', to: '/designs/boys-suit-jacket' },
        { from: '/designs/knickers', to: '/designs/boys-knickers' },
        { from: '/designs/knickerbockers', to: '/designs/bloomers' },
        { from: '/designs/hooded-smock', to: '/designs/anorak' },
        { from: '/designs/smock', to: '/designs/childrens-smock' },
        { from: '/designs/box-coat', to: '/designs/womens-box-coat' },
        { from: '/designs/military-blouse', to: '/designs/military-tunic' },
      ],
    }],
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
        options.config = false
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
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: false },
    navbar: {
      title: 'PublicSewing',
      items: [
        { to: '/designs', label: 'Historical Designs', position: 'left' },
        { to: '/inspired', label: 'Inspired Designs', position: 'left' },
        { to: '/wardrobe', label: 'Wardrobe', position: 'left' },
        { to: '/measure', label: 'Measure', position: 'left' },
        { to: '/sew-and-test', label: 'Sew & Test', position: 'left' },
        { to: '/learn', label: 'Learn', position: 'left' },
        { to: '/contribute', label: 'Contribute', position: 'left' },
        { to: '/credits', label: 'Credits', position: 'left' },
        { href: repo, label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'light',
      copyright:
        'PublicSewing © David Borowski II. <a href="/sources#licence">Code PolyForm Noncommercial 1.0.0, content CC BY-NC 4.0</a>. ' +
        '<a href="/sources#freesewing">Built on FreeSewing</a> (MIT), not part of it. Not for AI training. <a href="/sources#privacy">No cookies, no analytics</a>.',
    },
    prism: { theme: themes.github, darkTheme: themes.dracula },
  },
}
