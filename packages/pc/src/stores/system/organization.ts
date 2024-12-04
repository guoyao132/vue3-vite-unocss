import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'

import {
  postOrganizationTableListInDepartment,
  postOrganizationTreeListOldSync,
  postRoleList,
} from '@/api/system/organization'
import type { IOrgTableType, IRoleList, ITableList } from '@/interface/system/organization'

interface iOrgTableList {
  orgTableList: ITableList[]
  total: number
  loading: boolean
  roleList: IRoleList[]
  orgTreeList: any[]
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
      // 角色列表
      const [roleRes, roleErr] = await to(postRoleList({ pageSize: 999, pageNum: 1, status: 0 }))
      if (!roleErr)
        this.roleList = roleRes.list

      // 组织列表
      const [orgTreeRes, orgTreeErr] = await to(
        postOrganizationTreeListOldSync({
          orgType: 0,
        }),
      )
      if (!orgTreeErr)
        this.orgTreeList = orgTreeRes
      else message.error(orgTreeErr.message ?? '请求失败')
    },
    setOrgIdAction(id: string) {
      this.orgId = id
    },
  },
})
