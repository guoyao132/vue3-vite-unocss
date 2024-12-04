import { to } from '@web/common/util'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

import { getMyPermission } from '@/api/system/roleManage'
import type { IAccountUserInfo } from '@/interface/system/organization'
import type { RoleListInfo } from '@/interface/system/roleManage'
import { routerList } from '@/router'

interface permissionRecord {
  permissionList: string[]
  routerList: RouteRecordRaw[]
  userInfo: IAccountUserInfo | null
  roleInfo: RoleListInfo[]
}

export const firstRoute: string | null = null

export const usePermissionStore = defineStore('permission', {
  state: (): permissionRecord => ({
    permissionList: [],
    userInfo: null,
    routerList,
    roleInfo: [],
  }),
  actions: {
    async getPermissionAction() {
      const [data, err] = await to(getMyPermission())

      if (!err) {
        this.userInfo = data?.accountUserInfo
        if (data.webPermissions)
          this.permissionList = data?.webPermissions

        else
          this.permissionList = []
      }
    },
    clearPermissionList() {
      this.permissionList = []
      this.userInfo = null
      this.routerList = []
    },
  },
})
