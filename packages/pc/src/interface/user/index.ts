export interface UserLoginType {
  account: string
  password: string
}

export interface AccountUserInfo {
  account: string
  avatar: string
  avatarDefaultColor: string
  avatarFileId: string
  avatarViewPath: string
  delFlag: number
  email: string
  gender: string
  lastUseTenant: string
  name: string
  phoneNumber: string
  status: number
}

export interface DepartmentInfo {
  channelOrgId: string
  channelParentId: string
  dataSource: number
  id: string
  isDefaultDepartment: boolean
  name: string
  orgTreeNamePathMapping: string
  orgTreePathMapping: string
  orgType: number
  parentId: string
  tenantId: string
}

export interface RoleInfo {
  createByUsername: string
  createTime: number
  customRoleType: string
  id: string
  parentId: string
  relatedToCurrentUser: boolean
  remark: string
  roleName: string
  roleNodeType: number
  roleType: number
  status: number
}

export interface UserInfoType {
  accountUserInfo: AccountUserInfo
  dataPermissionType: number
  departmentInfo: DepartmentInfo[]
  roleInfo: RoleInfo[]
  tenantId: string
  token: string
  userId: string
  webPermissions: string[]
}
