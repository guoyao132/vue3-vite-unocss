import type { IEditOrAddMenuParams, IMenuTreeRecord } from '@/interface/system/menuManage'

import Api from '../axios'

//  获取菜单树结构
export async function getMenuList() {
  const res = await Api.get<IMenuTreeRecord[]>('/common/web-permission/v1/tree')
  return res.data
}

//  新增菜单
export async function addMenu(data: IEditOrAddMenuParams) {
  const res = await Api.post<string>('/common/web-permission/v1/add', data)
  return res.data
}

//  编辑菜单
export async function updateMenu(data: IEditOrAddMenuParams) {
  const res = await Api.post<string>('/common/web-permission/v1/edit', data)
  return res.data
}

//  删除菜单
export async function deleteMenu(id: string) {
  const res = await Api.post<string>('/common/web-permission/v1/remove', { id, cascadeDelete: true })
  return res.data
}
