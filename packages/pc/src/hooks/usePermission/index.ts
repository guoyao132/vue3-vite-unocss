import { ref } from 'vue'

import type { UserInfoType } from '@/interface/user'

export default function usePermission(user: UserInfoType) {
  // 获取用户的 webPermissions 字段
  const userWebPermissions = ref(user ? user.webPermissions : [])

  // 检查是否具有特定权限
  const hasPermission = (requiredPermission: string) => {
    return userWebPermissions.value.includes(requiredPermission)
  }

  // 更新权限信息
  const updateUserPermissions = (newUser: UserInfoType) => {
    userWebPermissions.value = newUser ? newUser.webPermissions : []
  }

  // 返回需要暴露给组件使用的函数和数据
  return {
    userWebPermissions,
    hasPermission,
    updateUserPermissions,
  }
}
