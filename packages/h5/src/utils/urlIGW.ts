import { closeToast, showToast } from 'vant'

import { AGENTID, ISCP_ConnectService_Data, iscpIP_ip, iscpIP_port } from '@/config/constants'

function ext_ISCP_GetLocalPort() {
  return new Promise((resolve) => {
    const dom = document.getElementById('loadingText') as HTMLElement
    dom.innerText = '获取ISC认证票据，请稍后...'
    wx.invoke('ext_ISCP_RhLocalPortCtrl', {
      data: {
        gatewayServiceId: Number(AGENTID),
        aclId: 2,
      },
    },
    (res: { err_msg: string; result: string }) => {
      if (res.err_msg === 'ext_ISCP_RhLocalPortCtrl:ok') {
        // ios的和安卓返回的不一样所以要用此方法处理
        const port = res.result.includes(':') ? res.result.split(':')[1] : res.result
        window.sessionStorage.setItem(`IgwPortURL${AGENTID}`, `http://127.0.0.1:${port}`)
        resolve(['', res])
      }
      if (res.err_msg === 'ext_ISCP_RhLocalPortCtrl:fail') {
        // 失败处理
        resolve([res, ''])
        //        console.log(res.result);
      }
      if (res.err_msg === 'ext_ISCP_RhLocalPortCtrl:cancel') {
        // 取消处理
        //        console.log(res.result);
      }
    })
  })
}

function ext_ISCP_ConnectService() {
  return new Promise((resolve) => {
    const dom = document.getElementById('loadingText') as HTMLElement
    dom.innerText = '安全链接中，请稍后...'
    wx.invoke('ext_ISCP_RhConnectCtrl', {
      data: {
        gatewayServiceId: Number(AGENTID),
        connCtrlType: 1,
      },
    },
    (res: any) => {
      closeToast()
      if (res.err_msg === 'ext_ISCP_RhConnectCtrl:ok')
        resolve(['', res])

      if (res.err_msg === 'ext_ISCP_RhConnectCtrl:fail') {
        // 失败处理
        resolve([res, ''])
      }
      if (res.err_msg === 'ext_ISCP_RhConnectCtrl:cancel') {
        // 取消处理
        //        console.log(res.result);
      }
    },
    )
  })
}

function ext_ISCP_Init() {
  return new Promise((resolve) => {
    wx.invoke('ext_ISCP_RhConfig', {
      data: {
        businessServiceInfoList: [{ gateway_id: Number(AGENTID), acl_id: 2, businessInfo: { sip: iscpIP_ip, sport: iscpIP_port } }],
        gatewayServiceInfoList: [{ gatewayInfo: { ip: ISCP_ConnectService_Data.ip, port: ISCP_ConnectService_Data.port, resource: { acl_id_list: [2], appId: ISCP_ConnectService_Data.appid }, type: 2 }, gateway_id: Number(AGENTID) }],
      },
    },
    (res: any) => {
      if (res.err_msg === 'ext_ISCP_RhConfig:ok') {
        //        console.log(JSON.stringify(res))
        resolve(['', res])
      }
      if (res.err_msg === 'ext_ISCP_RhConfig:fail') {
        // 失败处理
        resolve([res, ''])
      }
      if (res.err_msg === 'ext_ISCP_RhConfig:cancel') {
        // 取消处理
        //        console.log(res.result);
      }
    },
    )
  })
}

async function getUrl(time: number) {
  if (time < 5) {
    const [err]: any = await ext_ISCP_Init()
    if (err) {
      time += 1
      await getUrl(time)
      return
    }
    const [err1]: any = await ext_ISCP_ConnectService()
    if (err1) {
      time += 1
      await getUrl(time)
      return
    }
    const [err2]: any = await ext_ISCP_GetLocalPort()
    if (err2) {
      time += 1
      await getUrl(time)
      return
    }
    closeToast()
  }
  else {
    showToast({
      message: '安全平台连接失败。请检查网络并重新进入',
      forbidClick: true,
    })
  }
}
async function geturl() {
  const time = 1
  await getUrl(time)
}

export default geturl
