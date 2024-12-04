export interface IDepartmentInfo {
  deptId: string
  orgTreePathMappingList: string[]
  orgTreeNamePathMapping: string
  isDefaultDepartment: boolean
}

export interface IOrgType {
  orgType: number
  orgId?: string | null | number
}

export interface IOrgTableType {
  pageNum: number
  pageSize: number
  keyword?: string
  orgId?: string | null
  status?: number
  orgType?: number
}

export interface IAllChangeType {
  userIds: string[]
  status?: number
  validDuration?: number
}

export interface ITreeAdd {
  isEdit: boolean
  isTop?: boolean
  title?: string
  key?: string
  children?: any[] // any备注：此版本未上该功能，未对接接口
}

export interface ITreeEdit {
  title: string
  key: string
  isEdit: boolean
  children?: any[] // any备注：此版本未上该功能，未对接接口
}

export interface IAddOrgMember {
  name: string
  departmentIds: (number | string)[]
  roleIds: null | string[]
  phone: number | string | null
  account: string
  status: number
  id: string | undefined
  roleInfo: IRoleInfo[]
  userId?: string
  deptId?: string
  tenantId?: string
  orgTreePathMapping?: string
  orgTreePathMappingList?: string[]
  orgTreeNamePathMapping?: string
  roleName?: string
  statusCode?: number
  statusValue?: string
}

export interface TSaveMember {
  name: string
  departmentIds: (number | string)[]
  roleIds: (number | string)[]
  phone: number | string | null
  account: string
  userId?: string
  deptId?: string
  tenantId?: string
  orgTreePathMapping?: string
  orgTreePathMappingList?: string[]
  orgTreeNamePathMapping?: string
  roleName?: string
}

export interface ITableMember {
  account: string
  phone: string
  name: string
  roleName: string
  userId: string
  deptId: string
  tenantId: string
  orgTreeNamePathMapping: string
  status: string
}

export interface ISearchOrg {
  keyword: string
}

export interface ITableList {
  [key: string]: string | number | boolean | string[] | IRoleInfo[] | IDepartmentInfo[]
  userId: string
  deptId: string
  tenantId: string
  name: string
  phone: string
  orgTreePathMappingList: string[]
  orgTreeNamePathMapping: string
  roleInfo: IRoleInfo[]
  statusCode: number
  statusValue: string
  account: string
  createTime: string
  departmentIds: string[]
  status: number
  roleIds: string[]
  departmentInfo: IDepartmentInfo[]
  validityPeriodType: number
}

export interface ISyncTreeList {
  id: string
  name: string
  parentId: string
  level: number
  path: string
  self: ISelf
  items: ISyncTreeList[]
  idPath: string[]
  hasChildren: boolean
  parentIdPath: string[]
}

export interface ISelf {
  id: string
  parentId: string
  name: string
  nodeType: string
}

// 选择：树形组织
export interface ITreeSelect {
  orgId: string
  pageNum?: number
  pageSize?: number
  memberName: string
}

export interface ISearchList {
  dataType: string
  memberName: string
  orgId: string
  orgLevelType?: null | number
  orgTreeNamePathMapping: string
  orgTreePathMappingList: string[]
  orgType: number
  userId?: string
  isChecked?: boolean
}

export interface ISearchDate {
  pageNum: number
  size: number
  total: number
  list: ISearchList[]
  hasNextPage: boolean
}

// 表格modal：表单
export interface ITableModalFormState {
  name: string
  departmentIds: string[]
  roleIds: string
  phone: string | null
  account: string
  roleInfo: IRoleInfo[]
  userId: string
  deptId: string
  tenantId: string
  orgTreePathMappingList: string[]
  orgTreeNamePathMapping: string
  createTime: string
  departmentInfo: IDepartmentInfo[]
  validityPeriodType?: number
  validDuration?: number | null
}

export interface IRoleInfo {
  id: string
  roleName: string
  value?: string
  label?: string
}

export interface IRoleList {
  id: string
  isSelfPerm?: boolean
  parentId: string | null
  customRoleType: string
  createByUsername: string
  createTime: string
  remark: string
  roleType: number
  roleNodeType: number
  roleName: string
  status: number
  value?: string
  label?: string
}

export interface IRoleData {
  hasNextPage: boolean
  list: IRoleList[]
  pageNum: number
  size: number
  total: number
}

export interface ITableData {
  hasNextPage: boolean
  list: ITableList[]
  pageNum: number
  size: number
  total: number
}

export interface IAsyncOrgData {
  id: string
  parentId: string
  name: string
  orgLevelType: number
  isLeaf: boolean
  isManaged: boolean
  key?: string | number
  canChangeLevelType: boolean
  orgTreePathMappingList: string[]
  children: IAsyncOrgData[] | null
  orgTreeNamePath: string
}

export interface AllCompanyResponse {
  code: string
  id: string
  name: string
}

export interface IUserInfo {
  [index: string]: any
  accountUserInfo: IAccountUserInfo
  webPermissions: string[]
}

export interface IAccountUserInfo {
  account: string
  avatar: null | string
  delFlag: number
  email: null | string
  gender: null | string
  lastUseTenant: string
  name: string
  phoneNumber: string
  status: number
  dataPermissionType?: number | null
}

export interface CheckBoxItemType {
  checked: boolean
  disabled: boolean
  deptId: string
  account: string
  phone: string
  orgTreeNamePathMapping: string
  userId: string
  label: string
  value: string
  name?: string
}

export interface UpdateOrgTypeParam {
  orgId: string
  orgLevelType: number
}

export interface InactiveUserResponse {
  [key: string]: string | boolean
  account: string
  lastLoginDate: string
  name: string
  orgTreePathName: string
  phoneNumber: string
  roleName: string
  status: string
  validDate: string
}

export interface ITreeModalFormState {
  title?: string
  organization?: string
}

export interface ISearchDetail {
  memberName: string
  orgTreeNamePathMapping: string
  dataType: string
  orgType: number
  orgId: string
  orgTreePathMappingList: string[]
}
