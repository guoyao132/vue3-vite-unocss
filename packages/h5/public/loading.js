(function () {
  // var vConsole = new VConsole()
  const _LoadingHtml = `<div id="loadingDiv"
  style="position:absolute;width: 100%;left:0;right:0;top:0;bottom:0;background:#fff;opacity:1;
  filter:alpha(opacity=80);z-index:10000;text-align: center;">
  <div>
    <img style="width: 100px;margin: 60% auto 0;" src="./logo.png" alt="" />
    <div style="color: #666666;margin-top: 10px;font-size:20px;font-weight: 500">数字基建平台</div>
    <div style="color: #ccc;margin-top: 14px;font-size:14px;">加载中...</div>
    </div>
    <div style="color: #ccc;margin-top: 14px;font-size:14px; position: fixed;display:flex;justify-content:center; align-items: center;bottom: 40px;width: 100%">
    <img src='./loading.gif' style="margin-right: 10px" width="16" height="16" alt=''>
    <span id="loadingText">加载平台基础信息，请稍后...</span>
</div>
  </div>`
  document.write(_LoadingHtml)
  setTimeout(() => {
    const dom = document.getElementById('loadingText')
    if (dom && dom.textContent === '加载平台基础信息，请稍后...')
      window.location.reload()
  }, 5000)
}
())
