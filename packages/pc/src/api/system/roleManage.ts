import type { IRoleData, IUserInfo } from '@/interface/system/organization'
import type { AddRoleParams, CommonPermissionRecord, IDeleteRoleParams, IRoleDetail, IRoleListParams, UnitParam, UnitResponse } from '@/interface/system/roleManage'

import Api from '../axios'

// 获取当前用户角色信息、权限集合（登录后马上调用）
export async function getMyPermission() {
  const res = await Api.get<IUserInfo>('/common/account/v1/current/user-info')
  return res.data
}

//  获取角色列表
export async function getRoleList(data: IRoleListParams) {
  const res = await Api.post<IRoleData>('/common/role/v1/list', data)
  return res.data
}

// 获取角色详情
export async function getRoleDetail(roleId: string) {
  const res = await Api.get<IRoleDetail>('/common/role/v1/complex/details', { params: { roleId } })
  return res.data
}

// 获取权限列表
export async function getPermissionList() {
  const res = await Api.get<CommonPermissionRecord>('/common/role/v1/inheritable-permission')
  return res.data
}

//  保存角色
export async function postSaveRole(data: AddRoleParams) {
  return await Api.post<string>('/common/role/v1/complex/save', data)
}

//  删除角色
export async function deleteRole(data: IDeleteRoleParams) {
  return await Api.post('/common/role/v1/batch-remove', data)
}

//  获取单位列表
export async function getUnitList(data: UnitParam) {
  const res = await Api.post<UnitResponse>('/common/department/v1/search-org-only', data)
  return res.data
}

//  获取角色列表(鉴权)
export async function getRoleListByPermission(data: IRoleListParams) {
  const res = await Api.post<IRoleData>('/common/role/v1/open-list', data)
  return res.data
}
