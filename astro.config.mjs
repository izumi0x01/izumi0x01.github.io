import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
 site: process.env.SITE_URL || 'https://izumi0x01.github.io',
 base: process.env.BASE_PATH || '/', trailingSlash: 'always', output: 'static',
 markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
 integrations: [starlight({ title: 'Izumi / Research Notes', defaultLocale: 'root', locales: { root: { label: '日本語', lang: 'ja' } },
 customCss: ['./src/styles/global.css', 'katex/dist/katex.min.css'],
 components: { Header: './src/components/WikiHeader.astro' },
 sidebar: [{label:'はじめに',link:'/wiki/'}, {label:'Python',items:[{autogenerate:{directory:'wiki/python'}}]}, {label:'Robotics',items:[{autogenerate:{directory:'wiki/robotics'}}]}, {label:'Mathematics',items:[{autogenerate:{directory:'wiki/mathematics'}}]}]
 })]
});
