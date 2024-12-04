import type { UserConfigFn } from 'vite'

import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, mergeConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defaultViteConfig } from '../../scripts/vite'

const defineCustomConfig: UserConfigFn = env => ({
  define: {
    __PRODUCTION__: JSON.stringify(env.mode === 'production'),
  },
  base: '',
  server: {
    proxy: {
      '/construction': {
        target: 'http://192.168.0.10',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
      resolvers: [AntDesignVueResolver()],
    }),
    createSvgIconsPlugin({
      // 指定目录
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 使用svg图标的格式
      symbolId: 'icon-[dir]-[name]',
      customDomId: '__svg__icons__dom__',
    }),
    Components({
      dts: true,
      dirs: ['src/components'],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
      extensions: ['vue'],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue': ['vue', 'vue-router'],
          'lodash': ['lodash'],
          'dayjs': ['dayjs'],
          'ant-design-vue': ['ant-design-vue'],
        },
      },
    },
  },
})

export default defineConfig(env => mergeConfig(defaultViteConfig(env), defineCustomConfig(env)))
