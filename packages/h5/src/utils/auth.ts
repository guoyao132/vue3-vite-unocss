import { AGENTID } from '@/config/constants'

const TokenKey = `${AGENTID}-token`

export const offlineURL = `zipapp://appid.${AGENTID}/index.html` // 离线地址

export function getToken() {
  return sessionStorage.getItem(TokenKey) ?? ''
}

export function setToken(token: string) {
  return sessionStorage.setItem(TokenKey, token)
}

export function setUrlHash() {
  localStorage.setItem(`${AGENTID}urlHash`, window.location.hash)
}
