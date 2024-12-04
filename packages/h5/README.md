# train-admin-frontend

## 目录结构

```

src
├── api          // 接口
├── assets       // 资源文件
├── components   // 组件
├── constant     // 全局通用定义
├── img          // 图片
├── interface    // ts 相关定义
├── views        // 页面
└── store        // store

```

## 开发相关

1. 安装 git

2. 安装 node

3. 开发前安装依赖
  pnpm i

4. 启动服务
  pnpm start

## 配置相关

1. wxconfig.ts
   * 配置开发需要的接口相关参数

2. zipAppConfig.json
   * 配置离线应用相关（主要是更换应用名称和appid）

3. src/config/constants.ts
   * 配置离线应用安全交互平台相关（申请离线应用过后会得到此配置）

4. src/utils/urlIGW.ts
   * 离线应用与安全交互平台建立连接相关配置
