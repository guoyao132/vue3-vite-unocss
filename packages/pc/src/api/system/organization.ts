import type { IPaginationType } from '@/interface'
import type {
  AllCompanyResponse,
  IAllChangeType,
  IAsyncOrgData,
  IOrgTableType,
  IOrgType,
  IRoleData,
  ISearchDate,
  ISearchOrg,
  ISyncTreeList,
  ITableData,
  InactiveUserResponse,
  TSaveMember,
  UpdateOrgTypeParam,
} from '@/interface/system/organization'

import Api from '../axios'

//  获取树形组织(同步)
export async function postOrganizationTreeListOldSync(data: IOrgType) {
  const res = await Api.post<ISyncTreeList[]>('/common/department/v1/tree', data)
  return res.data
}

//  获取树形组织(异步)
export async function postOrganizationTreeListInDepartment(data: IOrgType) {
  const res = await Api.post<IAsyncOrgData[]>('/common/department/v1/org-level', data)
  return res.data
}

//  获取树形组织——对应表格列表
export async function postOrganizationTableListInDepartment(data: IOrgTableType) {
  const res = await Api.post<ITableData>('/common/department/v1/user', data)
  return res.data
}

// 设置角色
export function postSaveOrgMember(data: TSaveMember) {
  return Api.post<Record<string, string | null | string[]>>('/common/department/v1/user/save', data)
}

// 组织搜索
export async function postSearchOrgTreeList(data: ISearchOrg) {
  const res = await Api.post<ISearchDate>('/common/department/v1/search-org', data)
  return res.data
}

// 角色_下拉框
export async function postRoleList(data: IPaginationType & { status: number }) {
  const res = await Api.post<IRoleData>('/common/role/v1/list', data)
  return res.data
}

// 获取所有单位
export async function getAllCompany() {
  const res = await Api.get<AllCompanyResponse[]>('/org/v1/list-company')
  return res.data
}

// 获取所有部门
export async function getAllDepartment() {
  const res = await Api.get<AllCompanyResponse[]>('/org/v1/list-dept')
  return res.data
}

//  更新组织层级类型
export async function updateOrgType(data: UpdateOrgTypeParam) {
  await Api.post<string>('/common/department/v1/update-org-level-type', data)
}

//  批量导出锁定账号
export async function postBatchExportLock() {
  const res = await Api.post<Blob>('/common/department/v1/user/batch-lock-export', { responseType: 'blob' })
  return res.data
}

// 页面配置删除
export async function postDeleteOrgMemberById(data: { userIds: string[] }) {
  await Api.post('/common/department/v1/user/batch-delete', data)
}

// 注销用户
export async function postDestroyUser(data: { userId: string }) {
  await Api.post('/common/department/v1/user/destroy', data)
}

// 状态更改
export async function postOrgChangeStatus(data: IAllChangeType) {
  await Api.post('/common/department/v1/user/batch-update-status', data)
}

// 不活跃账号列表
export async function inactiveUser() {
  const res = await Api.post<InactiveUserResponse[]>('/common/department/v1/user/lock-account-list')
  return res.data
}
