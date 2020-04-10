import { defineConfig } from 'umi';
//cdn地址
const cdnBaseHttp = 'https://h5public.xiaoyuanjijiehao.com/';
const token = 'UXCMQHAJOEKMQR5Q-JLJWG';
export default defineConfig({
  routes: [{ path: '/', component: '@/pages/index' }],
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  devServer: {
    port: 8082,
  },
  proxy: {
    '/api': {
      target: 'https://dev.xiaoyuanjijiehao.com:10010/',
      //target: "http://192.168.175.125:999",
      //target: 'https://h5apitest.xiaoyuanjijiehao.com:9999/',
      //target: 'http://127.0.0.1:9085',
      changeOrigin: true,
      pathRewrite: {
        '^/api': 'api',
      },
      onProxyReq: (proxyReq: {
        setHeader: (arg0: string, arg1: string) => void;
      }) => {
        proxyReq.setHeader('AccessToken', token);
      },
    },
  },
  hash: true,
  history: { type: 'hash' },
  /* 自定义antd theme */
  theme: {
    '@card-head-padding': '6px',
    '@card-head-height': '24',
  },
  externals: {
    moment: 'moment',
    axios: 'axios',
  },
  headScripts: [
    { src: 'zh-cn.js', defer: true },
  ],
  scripts: [
    `${cdnBaseHttp}moment/moment.min.js`,
    `${cdnBaseHttp}vue/axios.min.js`,
  ],
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    // 删除 umi 内置插件
    memo.plugins.delete('progress');
    memo.plugins.delete('friendly-error');
  },
});
