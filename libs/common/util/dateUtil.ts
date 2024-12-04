/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * Formats a given date to a string representation in the specified format.
 *
 * @param {dayjs.ConfigType} date - The date to be formatted. If not provided, the current date is used.
 * @param {string} format - The format string to be used for formatting. Defaults to 'YYYY-MM-DD HH:mm:ss'.
 * @return {string} The formatted date string.
 */
/**
 * 将给定日期格式化为指定格式的字符串表示。
 *
 * @param {dayjs.ConfigType} date - 要格式化的日期。如果未提供，则使用当前日期。
 * @param {string} format - 用于格式化的格式字符串。默认为 'YYYY-MM-DD HH:mm:ss'。
 * @return {string} 格式化后的日期字符串。
 */

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * Formats a given date to a string representation in the specified format.
 *
 * @param {dayjs.ConfigType} [date] - The date to be formatted. If not provided, the current date is used.
 * @param {string} [format] - The format string to be used for formatting. Defaults to 'YYYY-MM-DD'.
 * @return {string} The formatted date string.
 */
/**
 * 将给定日期格式化为指定格式的字符串表示。
 *
 * @param {dayjs.ConfigType} [date] - 要格式化的日期。如果未提供，则使用当前日期。
 * @param {string} [format] - 用于格式化的格式字符串。默认为 'YYYY-MM-DD'。
 * @return {string} 格式化后的日期字符串。
 */

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * Generates a timestamp (in milliseconds) representing the current time.
 *
 * @returns {number} - The timestamp (in milliseconds).
 * @description
 * - Uses the `Date.now()` method to get the current time's timestamp (in milliseconds).
 */
/**
 * @zh-cn
 * 生成表示当前时间的时间戳（毫秒）。
 *
 * @returns {number} - 时间戳（毫秒）。
 * @description
 * - 使用 `Date.now()` 方法获取当前时间的时间戳（毫秒）。
 */
export const timestamp = () => +Date.now()

/**
 * Generates the current timestamp using the `Date.now()` method.
 *
 * @returns {number} - The current timestamp in milliseconds.
 * @description
 * Uses the `Date.now()` method to obtain the current timestamp in milliseconds.
 */
/**
 * @zh-cn
 * 使用 `Date.now()` 方法生成当前时间戳。
 *
 * @returns {number} - 当前时间戳（毫秒）。
 * @description
 * 使用 `Date.now()` 方法获取当前时间戳（毫秒）。
 */
export const now = () => Date.now()

export const dateUtil = dayjs
