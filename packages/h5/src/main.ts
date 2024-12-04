import { createPinia } from 'pinia'
import qs from 'qs'
import vant from 'vant'
import { createApp } from 'vue'

import 'vant/lib/index.css'
import './assets/styles/main.less'
import { AuthLogin, getTokenUrl } from '@/api/auth'
import { AGENTID, APPID, IGWcode } from '@/config/constants'
import { LOGIN_TYPE } from '@/enums/common'
import { getToken, setToken } from '@/utils/auth'
import { getUrlParam } from '@/utils/tools'
import getUrl from '@/utils/urlIGW'
import '@unocss/reset/tailwind-compat.css'
import 'uno.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const code = getUrlParam('code')

if (
  import.meta.env.MODE === 'igw'
) {
  if (code) {
    import('./wxconfig').then(async (e) => {
      e.WXconfig()
      wx.ready(async () => {
        wx.invoke(
          'ext_SGMap_init',
          {
            data: {
              function: 'init',
              data: {},
            },
          },
        )

        if (!getToken()) {
          await getUrl()
          const token = await AuthLogin({ code })
          setToken(token.token)
        }
        const loadingMask: any = document.getElementById('loadingDiv')
        if (loadingMask)
          loadingMask.parentNode.removeChild(loadingMask)
        app.use(createPinia())
        app.use(router)
        app.use(vant)
        app.mount('#app')
      })
    })
  }
  else {
    window.localStorage.setItem(`${AGENTID}urlhash`, window.location.hash)
    const _baseEn = 'zipapp://local.host/index.html'
    const URL = `${IGWcode}?appid=${APPID}&redirect_uri=${_baseEn}&response_type=code&scope=SCOPE&state=STATE&agentid=${AGENTID}#wechat_redirect`
    window.location.href = URL
  }
}
else {
  const account = window.location.href.split('?')[1]
  const obj = qs.parse(account)
  if (account && obj.account)
    localStorage.setItem('account', JSON.stringify(obj))

  let accounts = ''
  if (account && obj.account)
    accounts = obj.account
  else
    accounts = JSON.parse(localStorage.getItem('account') || '{}').account

  if (accounts) {
    // 不支持使用顶层await  所以这里用.then
    getTokenUrl({ account: accounts, loginType: LOGIN_TYPE.test }).then((data) => {
      setToken(data.token)
      const loadingMask: any = document.getElementById('loadingDiv')
      if (loadingMask)
        loadingMask.parentNode.removeChild(loadingMask)

      app.use(createPinia())
      app.use(router)
      app.use(vant)
      app.mount('#app')
    })
  }
}
