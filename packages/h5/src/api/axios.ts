import type { AxiosError } from 'axios'
import axios from 'axios'
import { showFailToast } from 'vant'

import { AGENTID } from '@/config/constants'
import { getToken } from '@/utils/auth'

function baseUrl(config: any) {
  if (config.url.includes('http')) // i国网登录接口是http的微信接口
    return ''
  if (import.meta.env.MODE === 'igw')
    return `${sessionStorage.getItem(`IgwPortURL${AGENTID}`) + import.meta.env.VITE_BASE_API}`
  else
    return import.meta.env.VITE_BASE_API
}
const Api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  withCredentials: true,
  timeout: 60000,
})

Api.interceptors.request.use((config) => {
  const token = getToken()
  config.baseURL = baseUrl(config)
  Object.assign(config.headers, {
    'Authorization': `${token.replace(/"/g, '')}`,
    'Content-Type': 'application/json;charset=utf-8',
  })
  return config
})

Api.interceptors.response.use(
  (resp) => {
    if (resp.data.code === '100001')// 登陆换取token返回状态码是100001
      return resp.data
    const { code, msg } = resp.data

    if (code === 401) {
      localStorage.clear()
      return Promise.reject(new Error(msg))
    }

    if (code !== 200) {
      showFailToast('请求失败')
      return Promise.reject(new Error(msg))
    }

    return resp.data
  },
  (error: AxiosError<any>) => {
    showFailToast('请求失败')
    return Promise.reject(error)
  },
)

export default Api
