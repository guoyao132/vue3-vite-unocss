export interface BreadCrumb {
  breadcrumbName: string | undefined | symbol
  path: string
  isStop: boolean
}

export interface LogoutType {
  account: string | null
  ip: string | null
  name: string | null
}

export interface IPaginationType {
  pageNum: number
  pageSize: number
}

export interface ResponseListType<T> {
  list: T[]
  total?: number
  size?: number
  pageNum?: number
  hasNextPage?: boolean
  title?: string
}

export interface CommonListType {
  label?: string
  value: any // 值可为任意类型
  type?: string
  disabled?: boolean
  style?: string
  row?: any
  key?: string
}
