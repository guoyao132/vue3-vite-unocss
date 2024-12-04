# usePermission Hook 使用文档

`usePermission` 是一个 Vue 3 Hook，用于处理用户权限信息。它接受一个包含 `webPermissions` 字段的用户对象，并提供了检查用户是否具有特定权限、获取用户所有权限以及手动更新用户权限信息的功能。

## 使用

在你的 Vue 组件中使用 usePermission Hook：

```vue
// MyComponent.vue
<script>
import usePermission from './usePermission'
import useUser from './useUser'

export default {
  setup() {
    // 使用 useUser 和 usePermission hooks
    const { user, refreshUser } = useUser()
    const { userWebPermissions, hasPermission, updateUserPermissions } = usePermission(user)

    // 示例：手动更新用户权限
    const updateUserPermissions = () => {
      refreshUser() // 刷新用户数据
      updateUserPermissions(user) // 更新权限信息
    }

    return {
      userWebPermissions,
      hasPermission,
      updateUserPermissions,
    }
  },
}
</script>

<template>
  <div>
    <div v-if="hasPermission('read')">
      <!-- 根据权限展示特定内容 -->
      You have the 'read' permission!
    </div>
    <div v-else>
      You don't have the 'read' permission.
    </div>
    <button @click="updateUserPermissions">
      Update Permissions
    </button>
  </div>
</template>
```

### API

usePermission 函数接受一个用户对象作为参数，并返回一个对象，其中包含以下属性和方法：

- userWebPermissions: 一个响应式的变量，包含用户的 webPermissions 字段，即用户的权限信息。
- hasPermission(requiredPermission): 一个函数，用于检查用户是否具有特定权限。
- updateUserPermissions(newUser): 一个函数，用于手动更新用户权限信息。
