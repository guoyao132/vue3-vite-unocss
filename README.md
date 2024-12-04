# spider-cloud-frontend-vue

<p align='center'>
基于 Vue 3 + TypeScript 的现代化前端开发模板
</p>

<br>

## 特性

- 🚀 基于 Monorepo 的项目结构,统一管理多端项目

- 📱 支持 PC、H5、小程序等多端开发

- 🔄 支持 IE11 兼容版本构建

- 📦 组件库按需加载

- 🎨 支持主题定制

- 🔧 完善的开发工具链和规范

## 项目结构

```bash
packages
├── pc/ # PC端项目
├── h5/ # H5项目
├── common/ # 公共代码
└── components/ # 公共组件
```

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 开发

PC端:

```bash
开发： pnpm start:pc
生产构建： pnpm build:pc
测试构建： pnpm build-test:pc
```

移动端:

```bash
开发：  pnpm start:h5
生产构建： pnpm build:h5
测试构建： pnpm build-test:h5
```

### 提交代码

```bash
pnpm commit
```
## 开发规范
### Git 提交规范
本项目使用 commitlint 规范 git 提交信息:
- ✨feat: 新功能
- 🐛fix: 修复bug
- 📚docs: 文档更新
- 💎style: 代码格式调整
- 📦refactor: 重构代码
- 🚀perf: 性能优化
- 🚨test: 测试相关
- 🛠build: 构建相关
- ⚙️ci: CI配置相关
- 🗑revert: 回退提交
### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 StyleLint 进行样式代码检查

## 技术栈

- [Vue 3](https://cn.vuejs.org/) - 渐进式 JavaScript 框架
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库
- [Axios](https://axios-http.com/) - 基于 Promise 的 HTTP 客户端
- [SWRV](https://docs-swrv.netlify.app/) - 用于数据请求的 Vue Hooks 库
- [Less](https://lesscss.org/) - CSS 预处理器
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [UnoCSS](https://github.com/unocss/unocss) - 原子 CSS 引擎
- [OxLint](https://github.com/oxc-project/oxlint) - 代码检查工具
- [Ant-design-vue](https://antdv.com/docs/vue/introduce) - 企业级 UI 组件库
- [VueUse](https://vueuse.org/) - Vue 的实用函数库

## 配置

查看 [Vite 配置参考](https://vitejs.dev/config/)。
查看 [UnoCSS 入门参考](https://juejin.cn/post/7388672594483249203?searchId=202411011439031A6A7E993F636D0B7371)。

## 环境要求

- Node.js >= 16.18
- pnpm >= 7.x
- Vue >= 3.4
- TypeScript >= 5.0
