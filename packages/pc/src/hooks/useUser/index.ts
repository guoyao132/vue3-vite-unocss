// useUser.ts
import useSWRV from 'swrv'
import { ref, watch } from 'vue'

import { getMyPermission } from '@/api/system/roleManage'

export default function useUser() {
  const cacheKey = 'current-user'

  const { data: user, error, mutate } = useSWRV(cacheKey, getMyPermission)

  watch(user, (newValue) => {
    if (newValue)
      sessionStorage.setItem('spider-permissionList', JSON.stringify(newValue.webPermissions ?? []))
  })

  const refreshUser = () => {
    mutate()
  }

  // Return the current user data and related functions
  return {
    user: ref(user),
    error,
    refreshUser,
  }
}
