export interface LoginParam {
  password?: string
  ticket?: string
  account: string
  code?: string
  loginType: number
}

export interface UserData {
  account: string
  expireTime: number
  ip: string
  name: string
  token: string
}
