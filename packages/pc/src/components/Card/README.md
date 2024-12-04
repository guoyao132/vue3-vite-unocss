# 公共Card组件 使用文档

该公共Card组件是基于antd-vue中的a-card组件进行封装，用于全局统一卡片风格样式，目前支持传入标题和loading状态参数，更改过基本样式，根据不同项目UI可灵活修改样式。

### 在 Vue 3 组件中的示例

```vue
<script setup lang="ts">
//  已设置AutoImport无需再次引入组件
</script>

<template>
  <Card title="标题文本">
    <span>文本内容</span>
  </Card>
</template>
```

### 配置参数

title: card标题，支持slot。

loading: card组件内加载loading。
