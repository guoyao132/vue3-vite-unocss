export async function WXconfig() {
  (window as any).wx.config({
    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'ww4d11a39991ebffdc', // 必填，企业微信的corpID
    timestamp: '1660807209', // 必填，生成签名的时间戳
    nonceStr: '73f7239520734303ae5ba200bb874066', // 必填，生成签名的随机串
    signature: 'fa30a6de5907d2d9505f81567fb13d6ce628119d', // 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: [
      'shareWechatMessage', // (分享到微信)
      // 'onMenuShareWechat',//获取“微信”按钮点击状态及自定义分享内容接口）
      'shareAppMessage', // (分享到i国网)
      // 'onMenuShareAppMessage',//获取“转发”按钮点击状态及自定义分享内容接口)
      'scanQRCode', // 扫一扫
      'getLocalImgData', // 获取本地图片接口
      'chooseImage', // 拍照或从手机相册中选图接口
      // 'previewFile',//预览文件
      'ext_ISCP_Init',
      'ext_ISCP_ConnectService',
      'ext_ISCP_GetLocalPort',
      'ext_ISCP_Close',
      'ext_ISCP_Status',
      'getZipAppDirectory',
      'ext_SGMap_init', // 思极地图
      'ext_SGMap_Operation', // 地图操作类
      'ext_SGMap_Search',
      'closeWindow',
    ],
  })
}
