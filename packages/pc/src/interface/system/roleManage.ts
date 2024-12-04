import type { IPaginationType } from '@/interface'
import type { IAccountUserInfo } from '@/interface/system/organization'

enum ORG_LEVEL_TYPE {
  company = 0,
  unit = 1,
  department = 2,
}

export enum ROLE_TYPE {
  system = 1,
  customization = 2,
}

export enum FEATURES_PERMISSIONS_TYPE {
  view = '查看',
  add = '新增',
  edit = '编辑',
  cancel = '取消',
  delete = '删除',
  export = '导出',
}

export enum DATA_PERMISSION_TYPE {
  company = 8,
  unit = 4,
  individual = 1,
}

export interface ISaveRole {
  remark: string
  roleName: string
  status: number
}

export interface ISearchFormState {
  roleName: string
  createByUsername: string
  startTime: string | number | null
  endTime: string | number | null
  status: number | undefined
  time: string[]
}

export interface SiftRoleRecord {
  startTime?: number | null
  endTime?: number | null
  roleName?: string
  remark?: string
}

export interface IRoleListParams extends IPaginationType, SiftRoleRecord {}

export interface RoleBasicMessage {
  remark?: string
  roleName: string
  id?: string | number
}

export interface RoleListInfo extends RoleBasicMessage {
  customRoleType: string
  parentId: string | number
  roleNodeType: number
  roleType: ROLE_TYPE
  createTime: number
  createByUsername: string
  status: number
}

export interface IDeleteRoleParams {
  ids: string[]
  cascadeDelete?: boolean
}

export interface AddRoleParams extends RoleBasicMessage {
  dataPermissionType?: number
  webPermissionIds: string[]
  dynamicDataPermissionRef?: {
    departmentIds: string[]
  }
}

export interface PermissionsRecord {
  code: string
  id: string
  name: string
  parentId: string | null
  path: string
  nodeType: string
  permissionType: number | null
  sortNumber: number
  checked: boolean | null
}

// 获取权限树
export interface PermissionTreeData {
  id: string
  name: string
  parentId: string | null
  path: string
  hasChildren: boolean
  idPath: string[]
  parentIdPath: string[]
  level: number
  self: PermissionsRecord
  items: PermissionTreeData[]
  value?: boolean
}

// 获取权限列表
export interface CommonPermissionRecord {
  dataPermissionType: number
  webPermissions: PermissionTreeData[]
  dynamicDataPermissionRef?: {
    departmentIds: string
  }
}

// 获取角色详情
export interface RoleInfoRecord extends RoleBasicMessage {
  createTime: string
  dataPermissionType: 1 | 4 | 8
  parentId: string
  webPermissions: PermissionTreeData[]
}

// 当前用户信息
export interface AccountInfo {
  accountUserInfo: IAccountUserInfo
  departmentInfo: unknown
  roleInfo: RoleListInfo
  tenantId?: string
  token?: string
  userId: string
  webPermissions: string[]
}

export interface FormatPermissionList {
  firstMenu: PermissionTreeData
  secondMenu: PermissionTreeData
  actions: PermissionTreeData[]
  firstMenuRowSpan?: number
}

export interface CellData extends FormatPermissionList {
  firstMenuRowSpan: number
}

export interface CheckUnit {
  label: string
  value: string
  checked?: boolean
}

export interface UnitParam extends IPaginationType {
  keyword: string
  orgLevelType: ORG_LEVEL_TYPE
}

export interface UnitRecord {
  orgId: string
  orgLevelType: number
  orgTreeNamePathMapping: string
  orgTreePathMappingList: string[]
  orgType: number
  checked: boolean
}

export interface IRoleDetail {
  [index: string]: any
  remark: string
  status: number
  roleName: string
  webPermissions: PermissionTreeData[]
}

export interface BasicDepartmentInfo {
  deptId: string
  name: string
  orgTreeNamePathMapping: string
}

export interface UnitResponse {
  total: number
  list: UnitRecord[]
}

export interface TablePageChange {
  current?: number
  pageSize?: number
}
