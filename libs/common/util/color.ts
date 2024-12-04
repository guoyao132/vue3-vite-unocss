/**
 * Checks if a given string is a valid hex color code.
 *
 * @param {string} str - The string to be checked.
 * @return {boolean} Returns true if the string is a valid hex color code, false otherwise.
 */
/**
 * 检查给定的字符串是否是有效的十六进制颜色代码。
 *
 * @param {string} str - 要检查的字符串。
 * @return {boolean} 如果字符串是有效的十六进制颜色代码，则返回 true，否则返回 false。
 */

export function isHexColor(str) {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const hexColorPattern = /^#([A-F0-9]{6}|[A-F0-9]{3})$/i
  return hexColorPattern.test(str)
}

/**
 * Converts RGB color values to a hexadecimal color code.
 *
 * @param {number} r - The red component of the color. Must be in the range [0, 255].
 * @param {number} g - The green component of the color. Must be in the range [0, 255].
 * @param {number} b - The blue component of the color. Must be in the range [0, 255].
 * @return {string} The hexadecimal color code in the format "#RRGGBB".
 */
/**
 * 将 RGB 颜色值转换为十六进制颜色代码。
 *
 * @param {number} r - 颜色的红色成分。必须在 [0, 255] 范围内。
 * @param {number} g - 颜色的绿色成分。必须在 [0, 255] 范围内。
 * @param {number} b - 颜色的蓝色成分。必须在 [0, 255] 范围内。
 * @return {string} 格式为 "#RRGGBB" 的十六进制颜色代码。
 */

/**
 * Converts RGB color values to a hexadecimal color code.
 *
 * @param {number} red - The red component of the color. Must be in the range [0, 255].
 * @param {number} green - The green component of the color. Must be in the range [0, 255].
 * @param {number} blue - The blue component of the color. Must be in the range [0, 255].
 * @returns {string} The hexadecimal color code in the format "#RRGGBB".
 */
export function rgbToHexColor(red: number, green: number, blue: number): string {
  const hex = ((red << 16) | (green << 8) | blue).toString(16).padStart(6, '0')
  return `#${hex}`
}
/**
 * Transforms a HEX color to its RGB representation.
 *
 * @param {string} hex - The color to transform.
 * @returns {string} The RGB representation of the passed color, or the original HEX color if it is not a valid HEX color.
 */
/**
 * 将十六进制颜色转换为其 RGB 表示。
 *
 * @param {string} hex - 要转换的颜色。
 * @returns {string} 传入颜色的 RGB 表示，如果不是有效的十六进制颜色，则返回原始的十六进制颜色。
 */

export function hexToRGB(hex: string): string {
  const normalizedHex = hex.toLowerCase().replace(/^#/, '')
  const isShortHex = normalizedHex.length === 3

  const getHexValue = (hexValue: string) =>
    isShortHex ? hexValue.repeat(2) : hexValue

  const getRgbValue = (hexValue: string) =>
    Number.parseInt(`0x${getHexValue(hexValue)}`)

  const [r, g, b] = [0, 2, 4].map(index =>
    getRgbValue(normalizedHex.substring(index, index + 2)),
  )

  return `RGB(${r}, ${g}, ${b})`
}
/**
 * Determines if a given color is dark.
 *
 * @param {string} color - The color to be checked. It should be a valid hex color code.
 * @returns {boolean} Returns true if the color is dark, false otherwise.
 */
/**
 * 确定给定的颜色是否是深色。
 *
 * @param {string} color - 要检查的颜色。它应该是一个有效的十六进制颜色代码。
 * @returns {boolean} 如果颜色是深色，则返回 true，否则返回 false。
 */

export function isDarkColor(color: string): boolean {
  const sanitizedColor = color.toLowerCase().replace(/^#/, '')
  const [red, green, blue] = sanitizedColor.match(/.{2}/g)!.map(hex => Number.parseInt(hex, 16))
  const luminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255
  return luminance < 0.5
}

/**
 * Darkens a hex color by a specified percentage.
 *
 * @param {string} hexColor - The color to darken. It should be a valid hex color code.
 * @param {number} percentage - The percentage to darken by. It should be a number between 0 and 100.
 * @returns {string} The darkened color in hex format.
 */
/**
 * 按指定百分比使十六进制颜色变暗。
 *
 * @param {string} hexColor - 要变暗的颜色。它应该是一个有效的十六进制颜色代码。
 * @param {number} percentage - 变暗的百分比。它应该是一个介于 0 和 100 之间的数字。
 * @returns {string} 变暗后的十六进制格式颜色。
 */

export function darken(hexColor: string, percentage: number): string {
  const color = hexColor.replace('#', '')
  const amount = Math.trunc((255 * percentage) / 100)
  const darkenedColor = [0, 2, 4].map(
    index =>
      Math.max(
        0,
        Number.parseInt(color.substring(index, index + 2), 16) - amount,
      ).toString(16).padStart(2, '0'),
  ).join('')
  return `#${darkenedColor}`
}

/**
 * Lightens a 6-character HEX color by a specified percentage.
 *
 * @param {string} hexColor - The color to lighten. It should be a valid 6-character HEX color code.
 * @param {number} percentage - The percentage to lighten by. It should be a number between 0 and 100.
 * @returns {string} The lightened color represented as HEX.
 */
/**
 * 根据指定的百分比使6字符HEX颜色变亮。
 *
 * @param {string} hexColor - 要变亮的颜色。它应该是一个有效的6字符HEX颜色代码。
 * @param {number} percentage - 变亮的百分比。它应该是0到100之间的一个数字。
 * @returns {string} 变亮后的颜色，表示为HEX格式。
 */
export function lighten(hexColor: string, percentage: number): string {
  const withoutHash = hexColor.replace('#', '')
  const amount = Math.trunc((255 * percentage) / 100)

  const lightenChannel = (channel: string): string => {
    const channelValue = Math.min(255, Number.parseInt(channel, 16) + amount)
    const lightenedChannel = channelValue.toString(16).padStart(2, '0')
    return lightenedChannel
  }

  const lightenedColor = `${lightenChannel(withoutHash.substring(0, 2))}${lightenChannel(
    withoutHash.substring(2, 4),
  )}${lightenChannel(withoutHash.substring(4, 6))}`

  return `#${lightenedColor}`
}

/**
 * Increases the specified percentage to the R, G or B of a HEX color
 * @param {string} color - The color to modify
 * @param {number} percent - The percentage to increase the color by
 * @returns {string} The modified color part
 */
export function increaseColorValue(color: string, percent: number) {
  const colorValue = Number.parseInt(color, 16) + percent
  const modifiedColorValue = Math.min(255, colorValue)
  return modifiedColorValue.toString(16).padStart(2, '0')
}

/**
 * Calculates the luminance of an RGB color.
 *
 * @param {number} r - The red component of the color. Must be in the range [0, 255].
 * @param {number} g - The green component of the color. Must be in the range [0, 255].
 * @param {number} b - The blue component of the color. Must be in the range [0, 255].
 * @return {number} The luminance value of the RGB color.
 */
/**
 * 计算RGB颜色的亮度
 * @param {number} r - 红色分量
 * @param {number} g - 绿色分量
 * @param {number} b - 蓝色分量
 * @returns {number} 亮度值
 */
export function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * Calculates the contrast between two RGB colors.
 *
 * @param {number[]} rgb1 - An array of three numbers representing the RGB values of the first color.
 * @param {number[]} rgb2 - An array of three numbers representing the RGB values of the second color.
 * @return {number} The contrast ratio between the two colors.
 */
/**
 * 计算两个RGB颜色之间的对比度。
 *
 * @param {number[]} rgb1 - 一个包含三个字符串的数组，表示第一个颜色的RGB值。
 * @param {number[]} rgb2 - 一个包含三个数字的数组，表示第二个颜色的RGB值。
 * @return {number} 两个颜色之间的对比度比值。
 */
function contrast(rgb1: number[], rgb2: number[]): number {
  if (rgb1.length !== 3 || rgb2.length !== 3)
    throw new Error('Each RGB array must have exactly three elements.')

  const color1 = rgb1.map((value) => {
    const num = Number.parseInt(value.toString(), 10)
    if (Number.isNaN(num))
      throw new Error('RGB1 array must contain valid numbers.')

    return num
  })

  return (
    (luminance(color1[0], color1[1], color1[2]) + 0.05)
    / (luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  )
}

/**
 * Returns the best text color based on the contrast with the background color.
 *
 * @param {string} backgroundHexColor - The hexadecimal color code of the background color.
 * @return {string} The hexadecimal color code of the best text color (black or white).
 */
/**
 * 根据与背景颜色的对比度，返回最佳的文本颜色。
 *
 * @param {string} backgroundHexColor - 背景颜色的十六进制颜色代码。
 * @return {string} 最佳文本颜色的十六进制颜色代码（黑色或白色）。
 */
export function calculateBestTextColor(backgroundHexColor: string) {
  const backgroundRgbColor = hexToRGB(backgroundHexColor.substring(1))
  const [red, green, blue] = backgroundRgbColor.split(',').map(Number)
  const contrastWithBlack = contrast([red, green, blue], [0, 0, 0])

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
 * Subtracts the indicated percentage from the R, G or B of a hex color.
 * @param {string} hexColor - The color to modify.
 * @param {number} percent - The percentage to subtract from the color.
 * @returns {string} The modified color part.
 */
export function subtractLight(hexColor: string, percent: number) {
  const parsedColor = Number.parseInt(hexColor.slice(1), 16)
  const newColor = Math.max(0, parsedColor - Math.round((255 * percent) / 100))
  return newColor.toString(16).padStart(2, '0')
}
