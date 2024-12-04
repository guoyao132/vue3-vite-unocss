import { dataURLtoBlob, urlToBase64 } from './base64Conver'
import { openWindow } from '.'

/**
 * Downloads an image from a given URL and saves it as a file with the specified filename.
 *
 * @param {string} url - The URL of the image to be downloaded.
 * @param {string} filename - The name of the file to be saved.
 * @param {string} [mime] - The MIME type of the file. Defaults to 'application/octet-stream'.
 * @param {blobPrepend} [bom] - The BlobPart to be added to the beginning of the file.
 * @return {void} This function does not return a value.
 */
/**
 * 从给定的 URL 下载图像并以指定的文件名保存为文件。
 *
 * @param {string} url - 要下载的图像的 URL。
 * @param {string} filename - 要保存的文件名。
 * @param {string} [mime] - 文件的 MIME 类型。默认为 'application/octet-stream'。
 * @param {blobPrepend} [bom] - 要添加到文件开头的 BlobPart。
 * @return {void} 此函数没有返回值。
 */

export async function downloadFromUrl(url: string, filename: string, mimeType = 'application/octet-stream', blobPrepend?: BlobPart) {
  const base64Image = await urlToBase64(url)
  downloadByBase64(base64Image, filename, mimeType, blobPrepend)
}

/**
 * Downloads a file by converting a base64 string to a Blob and then downloading it.
 *
 * @param {string} buf - The base64 string to be converted to a Blob.
 * @param {string} filename - The name of the file to be downloaded.
 * @param {string} [mime] - The MIME type of the file. Defaults to 'application/octet-stream'.
 * @param {BlobPart} [bom] - The BlobPart to be added to the beginning of the file.
 * @return {void} This function does not return a value.
 */
/**
 * 通过将 base64 字符串转换为 Blob 并下载文件。
 *
 * @param {string} buf - 要转换为 Blob 的 base64 字符串。
 * @param {string} filename - 要下载的文件名。
 * @param {string} [mime] - 文件的 MIME 类型。默认为 'application/octet-stream'。
 * @param {BlobPart} [bom] - 要添加到文件开头的 BlobPart。
 * @return {void} 此函数没有返回值。
 */

export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf)
  downloadByData(base64Buf, filename, mime, bom)
}

/**
 * Downloads data as a file with the specified filename.
 *
 * @param {BlobPart} data - The data to be downloaded.
 * @param {string} filename - The name of the file to be downloaded.
 * @param {string} [mime] - The MIME type of the file. Defaults to 'application/octet-stream'.
 * @param {BlobPart} [bom] - The BlobPart to be added to the beginning of the file.
 * @return {void} This function does not return a value.
 */
/**
 * 将数据下载为指定文件名的文件。
 *
 * @param {BlobPart} data - 要下载的数据。
 * @param {string} filename - 要下载的文件名。
 * @param {string} [mime] - 文件的 MIME 类型。默认为 'application/octet-stream'。
 * @param {BlobPart} [bom] - 要添加到文件开头的 BlobPart。
 * @return {void} 此函数没有返回值。
 */

export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  const blobURL = window.URL.createObjectURL(blob)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined')
    tempLink.setAttribute('target', '_blank')

  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

/**
 * Downloads a file from a given URL.
 *
 * @param {object} options - The options for downloading the file.
 * @param {string} options.url - The URL of the file to be downloaded.
 * @param {TargetContext} [options.target] - The target for the downloaded file.
 * @param {string} [options.fileName] - The name of the downloaded file.
 * @return {boolean} Returns true if the download is successful, false otherwise.
 */
/**
 * 从给定的 URL 下载文件。
 *
 * @param {object} options - 下载文件的选项。
 * @param {string} options.url - 要下载的文件的 URL。
 * @param {TargetContext} [options.target] - 下载文件的目标。
 * @param {string} [options.fileName] - 下载文件的名称。
 * @return {boolean} 如果下载成功则返回 true，否则返回 false。
 */

export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string
  target?: TargetContext
  fileName?: string
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome')
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari')

  if (/iP/.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target

    if (link.download !== undefined)
      link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (!url.includes('?'))
    url += '?download'

  openWindow(url, { target })
  return true
}
