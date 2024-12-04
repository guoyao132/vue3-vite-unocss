export interface IMenuTreeRecord {
  hasChildren: boolean
  id: string | null
  name: string
  parentId: string | null
  path: string
  code: string
  permissionType: number
  sortNumber: string
  items: IMenuTreeRecord[]
  self: IMenuTreeRecord
  children?: IMenuTreeRecord[]
}

export interface IEditOrAddMenuParams {
  code: string
  id: string | null
  name: string
  parentId: string | null
  path: string
  permissionType: number
}
