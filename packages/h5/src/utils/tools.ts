import { AGENTID } from '@/config/constants'

// 文件拼接sign
export function IGWfileSign(url: string) {
  let fileUrl = ''

  if (!window.location.href.includes('http')) {
    fileUrl = sessionStorage.getItem(`IgwPortURL${AGENTID}`) || ''
    fileUrl = `${fileUrl}/`
  }
  else {
    fileUrl = `${
      import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_BASE_URL
        : window.location.origin
    }/`
  }
  const sign = sessionStorage.getItem('sid')
    ? JSON.parse(sessionStorage.getItem('sid') as string)
    : ''
  // 这里用的是云文档的网关；自己项目自行配置
  return `${fileUrl}digital-cloud-file-server${url}?token=${sign}`
}

export function getUrlParam(name: string) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r != null)
    return unescape(r[2])
  return null
}
