# useUser Hook 使用文档

`useUser` 是一个 Vue 3 Hook，用于获取当前用户的数据并集成了 SWRV 进行数据缓存。此文档将引导你如何在你的 Vue 3 项目中使用这个 Hook。

## 组件内使用

在你的 Vue 组件中使用 useUser Hook：

```vue
// MyComponent.vue
<script>
import useUser from './useUser'

export default {
  setup() {
    // 使用 useUser Hook
    const { user, error, refreshUser } = useUser()

    return {
      user,
      error,
      refreshUser,
    }
  },
}
</script>

<template>
  <div>
    <div v-if="error">
      Error loading user data
    </div>
    <div v-else-if="user">
      Hello, {{ user.name }}!
    </div>
    <div v-else>
      Loading...
    </div>
    <button @click="refreshUser">
      Refresh User
    </button>
  </div>
</template>
```

在这个示例中，MyComponent 组件使用 useUser Hook 来获取并展示当前用户的信息。根据需要，你可以根据实际情况调整 API 调用和逻辑

## API

useUser 函数返回一个对象，其中包含以下属性和方法：

- user: 一个响应式的变量，包含当前用户的数据。
- error: 一个包含错误信息的变量，如果在获取用户数据时发生错误，则会包含错误信息。
- refreshUser(): 一个函数，用于手动触发用户数据的刷新。

## 使用示例

```vue
const { user, error, refreshUser } = useUser();
```

希望这份文档能帮助你正确地使用 useUser Hook。如有其他疑问或需要进一步帮助，请随时告知！ 飞书@fuyiyang
