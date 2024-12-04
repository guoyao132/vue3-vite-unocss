import { to } from '@web/common/util'

import { AGENTID } from '@/config/constants'
import { LOGIN_TYPE } from '@/enums/common'

import Api from './axios'

/**
 * @description: 获取ticket
 */
export async function AuthTicket(data: { CODE: string }) {
  const response = await Api.post('https://id.sgcc.com.cn:10443/igwmobile/proxy/getUserByIgwCode', { appId: AGENTID, ...data })
  return response
}

export async function getToken(userInfoEncryptedCode: string) {
  // 根据自己项目修改获取token地址接口和参数
  const response = await Api.post('/auth/mapi/common/token/v1/login', { userInfoEncryptedContent: userInfoEncryptedCode, loginType: LOGIN_TYPE.igw })
  return response.data
}

export async function AuthLogin(params: { code: string }) {
  const [userInfoEncryptedCode, ticketErr] = await to(AuthTicket({ CODE: params.code }))

  if (!ticketErr) {
    const [token, tokenErr] = await to(getToken(userInfoEncryptedCode.data))
    if (!tokenErr)
      return token
    else
      return tokenErr
  }
  else { return ticketErr }
}

export async function getTokenUrl(data: { account: string, loginType?: LOGIN_TYPE.test }) {
  const response = await Api.post('/auth/mapi/common/token/v1/login', data)
  return response.data
}
