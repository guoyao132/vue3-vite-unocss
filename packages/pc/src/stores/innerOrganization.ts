import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'

import { postOrganizationTableListInDepartment, postOrganizationTreeListOldSync } from '@/api/system/organization'
import type { IOrgTableType, IRoleList, ISyncTreeList, ITableList } from '@/interface/system/organization'

interface iOrgTableList {
  orgTableList: ITableList[]
  total: number
  loading: boolean
  roleList: IRoleList[]
  orgTreeList: ISyncTreeList[]
  orgId: string
}

export const useOrgTableStore = defineStore('orgTable', {
  state: (): iOrgTableList => ({
    orgTableList: [],
    total: 0,
    loading: false,
    roleList: [],
    orgTreeList: [],
    orgId: '',
  }),
  actions: {
    async getTableListAction(params: IOrgTableType) {
      this.loading = true
      const [res, err] = await to(postOrganizationTableListInDepartment(params))

      if (!err) {
        this.total = res.total
        this.orgTableList = res.list
        this.loading = false
      }
      else {
        message.error(err.message ?? '请求失败')
      }
    },
    async getRoleAndOrgTreeListAction() {
      // 组织列表
      const [orgTreeRes, orgTreeErr] = await to(
        postOrganizationTreeListOldSync({
          orgType: 0,
        }),
      )
      if (!orgTreeErr)
        this.orgTreeList = orgTreeRes
    },
    setOrgIdAction(id: string) {
      this.orgId = id
    },
    clearOrgTableList() {
      this.total = 0
      this.orgTableList = []
      this.loading = false
    },
  },
})
