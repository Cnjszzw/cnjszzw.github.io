// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  trailingSlash: false,
  // title: 'My Site',
  title: 'INFO.CENTER',
  tagline: 'Dinosaurs are cool',
  // favicon: 'img/favicon.ico',
  favicon: 'img/my-logo.svg',

  // Set the production url of your site here
  url: 'https://cnjszzw.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cnjszzw', // Usually your GitHub org/user name.
  projectName: 'cnjszzw.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Cnjszzw/cnjszzw.github.io/tree/master/',
        },
        blog: {
          blogSidebarTitle: '河流的入海口，在文字里改道', // 修改标题
          blogSidebarCount: 'ALL', // 显示所有文章
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Cnjszzw/cnjszzw.github.io/tree/master/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  //我自己加的
  markdown: {
    mermaid: true,
  },

  //我自己添加的
  themes: [
    // ... Your other themes.
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,

        // For Docs using Chinese, it is recomended to set:
        language: ["en", "zh"],

        // If you're using `noIndex: true`, set `forceIgnoreNoIndex` to enable local index:
        // forceIgnoreNoIndex: true,
      }),
    ],
    '@docusaurus/theme-mermaid'
  ],
  //我自己添加的
  plugins: [
    'docusaurus-plugin-image-zoom', // can also just be 'image-zoom'
    // ...other plugins
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true, // 调试模式（可选）
        offlineModeActivationStrategies: [
          'appInstalled', // 优先激活策略
          'standalone',
          'queryString',
        ],
        pwaHead: [ // PWA meta 标签配置
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json', // 指向你的 manifest 文件
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)', // 设置主题色
          },
        ],
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 30,
        max: 1030, // max resized image's size.
        min: 240, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-CCYCB23FSV',
        anonymizeIP: false,
      },
    ],
  ],


  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'INFO.CENTER',
        logo: {
          alt: 'My Site Logo',
          src: 'img/my-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'defaultDoc',
            position: 'left',
            label: '文档',
          },
          {
            type: 'docSidebar',
            sidebarId: 'interviewDoc',
            position: 'left',
            label: '面试',
          },
          // 暂时屏蔽这个入口
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'articleDoc',
          //   position: 'left',
          //   label: '文章',
          // },
          // 暂时屏蔽这个工具入口，这个在流金岁月公司写的，这个工具不具有适用性
          // {
          //   to: '/tools/JsonJsOutput', // 路由路径
          //   label: '工具', // 标签名称
          //   position: 'left', // 标签位置
          // },
          // blog的路由
          {to: '/blog', label: '博客', position: 'left'},
          {
            type: 'search',
            position: 'right',  // 搜索框将显示在左侧
          },
          {
            href: 'https://cnjszzw.github.io/cv/zh-cn',
            label: 'OhMyCV',
            position: 'right',
          },
          // {
          //   href: 'https://github.com/Cnjszzw',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      // footer: {
      //   style: 'dark',
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Tutorial',
      //           to: '/docs/intro',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Community',
      //       items: [
      //         {
      //           label: 'Stack Overflow',
      //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //         },
      //         {
      //           label: 'Discord',
      //           href: 'https://discordapp.com/invite/docusaurus',
      //         },
      //         {
      //           label: 'X',
      //           href: 'https://x.com/docusaurus',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'More',
      //       items: [
      //         {
      //           label: 'Blog',
      //           to: '/blog',
      //         },
      //         {
      //           label: 'GitHub',
      //           href: 'https://github.com/facebook/docusaurus',
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      // },
      //markdown-mermaid插件的配置
      mermaid: {
        theme: {light: 'forest', dark: 'forest'},
      },
      //图片缩放插件的配置
      zoom: {
        selector: '.markdown :not(em) > img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        }
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'kotlin','cpp'],
      },
    }),
};

export default config;
