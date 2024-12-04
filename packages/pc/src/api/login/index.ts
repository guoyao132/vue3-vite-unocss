import type { LoginParam, UserData } from '@/interface/login'

import { MapApi } from '../axios'

export async function login(data: LoginParam) {
  const response = await MapApi.post<UserData>('/common/token/v1/login', data)
  return response.data
}

export async function logOut() {
  const response = await MapApi.get('/common/token/v1/logout')
  return response.data
}

// 线上环境获取token
export async function getToken() {
  const res = await MapApi.get<{ token: string }>('/common/account/v1/current-token')
  return res.data
}
