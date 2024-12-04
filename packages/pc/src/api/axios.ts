import { message, notification } from 'ant-design-vue'
import type { AxiosError } from 'axios'
import axios from 'axios'

import router from '@/router'

const testApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API}/pcapi`,
  withCredentials: true,
  timeout: 60000,
})

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API}/papi`,
  withCredentials: true,
  timeout: 60000,
})

const MapApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API}/auth/papi`,
  withCredentials: true,
  timeout: 60000,
})

const FileOSS = axios.create({
  baseURL: '/construction-file-server',
  withCredentials: true,
  timeout: 120000,
})

Api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('SPIDER-TOKEN') ?? ''
  Object.assign(config.headers, {
    'Authorization': `${token.replace(/"/g, '')}`,
    'Content-Type':
      config.headers['Content-Type'] ?? 'application/json;charset=utf-8',
  })
  return config
})

Api.interceptors.response.use(
  (resp) => {
    const headers = resp.headers

    if (
      headers['content-type'] === 'application/octet-stream;charset=UTF-8'
      || headers['content-type'] === 'application/vnd.ms-excel;charset=utf-8'
      || headers['content-type']
      === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      || headers['content-type']
      === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    ) {
      return resp
    }

    const { code, msg } = resp.data

    if (code === 401) {
      sessionStorage.clear()
      message.warning(msg)
      router.push({ name: 'login' })
    }
    if (code !== 200)
      return Promise.reject(new Error(msg))

    return resp.data
  },
  (error: AxiosError<any>) => {
    return Promise.reject(error)
  },
)

MapApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('SPIDER-TOKEN') ?? ''
  Object.assign(config.headers, {
    'Authorization': `${token.replace(/"/g, '')}`,
    'Content-Type': 'application/json;charset=utf-8',
  })
  return config
})
MapApi.interceptors.response.use(
  (resp) => {
    const { code, msg } = resp.data

    if (code === 401) {
      sessionStorage.clear()
      message.warning(msg)
      router.push({ name: 'login' })
    }
    if (code !== 200)
      return Promise.reject(new Error(msg))

    return resp.data
  },
  (error: AxiosError<any>) => {
    return Promise.reject(error)
  },
)

FileOSS.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('SPIDER-TOKEN') ?? ''

  if (typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `${token.replace(/"/g, '')}`, false)
    config.headers.set('Content-Type', 'multipart/form-data', false)
  }
  return config
})

FileOSS.interceptors.response.use(
  (resp) => {
    return resp.data
  },
  (error: AxiosError<any>) => {
    let message = ''

    if (error.message.includes('timeout')) {
      message = '请求超时'
    }
    else if (error.message.includes('cancel')) {
      message = '取消上传'
    }
    else {
      message
        = error.response?.data?.message ?? `错误码 ${error.response?.status}`
    }

    notification.error({ message, key: error.request?.responseText })

    return Promise.reject(error)
  },
)

export { FileOSS, MapApi, testApi }

export default Api
