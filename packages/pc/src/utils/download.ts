enum DOWNLOAD_TYPE {
  URL = 'url',
  BLOB = 'blob',
}

/**
 * Downloads a file using the `<a>` element.
 *
 * @param name - The name of the file to be downloaded.
 * @param type - The type of the file to be downloaded. Can be either "url" or "blob".
 * @param data - The data to be downloaded. Can be either a URL string or a blob.
 */
export const download = (name: string, type: DOWNLOAD_TYPE, data: string | Blob) => {
  let href: string | Blob = data

  if (type === DOWNLOAD_TYPE.URL) {
    href = data as string
  }
  else if (type === DOWNLOAD_TYPE.BLOB) {
    href = URL.createObjectURL(data as Blob)
  }

  const anchor = document.createElement('a')
  anchor.style.display = 'none'
  anchor.download = name
  anchor.href = href as string
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  if (type === DOWNLOAD_TYPE.BLOB) {
    URL.revokeObjectURL(href as string)
  }
}
