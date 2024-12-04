import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
import type { UserConfigFn } from 'vite'
import { defineConfig, loadEnv, mergeConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import Components from 'unplugin-vue-components/vite'

import { VantResolver } from 'unplugin-vue-components/resolvers'
import pxtovw from 'postcss-px-to-viewport'
import legacy from '@vitejs/plugin-legacy'
import { defaultViteConfig } from '../../scripts/vite'

// import vue from '@vitejs/plugin-vue'
const loder_pxtovw = pxtovw({
  // 这里是设计稿宽度 自己修改
  viewportWidth: 375,
  viewportUnit: 'vw',
})
function injectHtmlScript(mode: string) {
  const scriptList: string[] = []
  if (mode === 'igw') {
    scriptList.push('<script src="./jweixin-1.0.0.js" type="text/javascript"></script>')
    scriptList.push('<script src="./vconsole.js" type="text/javascript"></script>')
  }
  scriptList.push(
    '<script type="text/javascript" src="./loading.js"></script>',
  )
  return scriptList.join('')
}
const defineCustomConfig: UserConfigFn = (env: any) => {
  const config = {
    define: {
      __PRODUCTION__: JSON.stringify(env.mode === 'production'),
    },
    base: '',
    server: {
      proxy: {
        '/construction': {
          target: 'http://192.168.0.10/',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      postcss: {
        plugins: [loder_pxtovw],
      },
      preprocessorOptions: {
        less: {
          additionalData: `@import "${path.resolve(__dirname, 'src/assets/styles/common.less')}";`,
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      AutoImport({
        dts: true,
        imports: ['vue', 'vue-router', '@vueuse/core'],
        resolvers: [VantResolver({ importStyle: false })],
      }),
      Components({
        dts: true,
        resolvers: [VantResolver({ importStyle: false })],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            ...(loadEnv(env.mode, process.cwd())),
            injectScript: injectHtmlScript(env.mode),
          },
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
            vant: ['vant'],
          },
        },
      },
    },
  }
  if (env.mode === 'igw') {
    config.plugins.push(legacy({
      targets: ['chrome > 49', 'edge > 12'],
      modernPolyfills: true,
    }))
    config.plugins.push({
      name: 'vite-plugin-file-access',
      apply: 'build',
      enforce: 'post',
      transformIndexHtml(html) {
        return html
          .replace(/<script type="module"[\s\S]+?<\/script>/g, '')
          .replace(/<link rel="modulepreload"[\s\S]+?>/g, '')
          .replace(/ nomodule/g, '')
          .replace(/ crossorigin/g, '')
      },
    })
  }
  return config
}

export default defineConfig((env: any) =>
  mergeConfig(defaultViteConfig(env), defineCustomConfig(env)),
)
