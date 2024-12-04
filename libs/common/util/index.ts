/**
 *
 * Asynchronously delays the execution by the specified number of milliseconds.
 *
 * @param {number} delay - The delay duration in milliseconds.
 * @returns {Promise<void>} - A Promise that resolves after the specified delay.
 * @description
 * - Uses `setTimeout` and a Promise to introduce an asynchronous delay.
 */

/**
 * @zh-cn
 * 延时指定毫秒数后解析的 Promise。
 *
 * @param {number} delay - 延时的毫秒数。
 * @returns {Promise<void>} - 一个 Promise，在延时后解析。
 * @description
 * - Uses setTimeout and Promise 实现延时。
 */

export const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

/**
 * Formats a numerical value as a percentage with two decimal places.
 *
 * @param {number} value - The numerical value to be formatted as a percentage.
 * @returns {string} - The formatted percentage string.
 * @description
 * - Uses the `toFixed` method to round the numerical value to two decimal places.
 * - Appends the result to a string with a percentage symbol.
 */

/**
 * @zh-cn
 * 将数值格式化为带有两位小数的百分比形式。
 *
 * @param {number} value - 要格式化为百分比的数值。
 * @returns {string} - 格式化后的百分比字符串。
 * @description
 * - 使用 `toFixed` 方法将数值四舍五入到两位小数。
 * - 将结果附加到带有百分号符号的字符串中。
 */
export const formatPercentage = (value: number) => `${value.toFixed(2)} %`

/**
 * Asynchronously executes a Promise and returns a Promise<[T, E]>.
 *
 * @template T - The type of the result value.
 * @template E - The type of the error value (defaults to Error).
 * @param {Promise<T>} promise - The Promise to be executed.
 * @returns {Promise<[T, E]>} - A Promise resolving to a tuple containing the result of the Promise (type T) and an error value (type E).
 * @description
 * - Uses an async function to await the resolution of the provided Promise.
 * - If the Promise resolves successfully, returns a Promise with a tuple containing the result and a null error value.
 * - If the Promise is rejected, returns a Promise with a tuple containing a null result and the error.
 */

/**
 * @zh-cn
 * 异步执行 Promise 并返回 Promise<[T, E]>。
 *
 * @template T - 结果值的类型。
 * @template E - 错误值的类型（默认为 Error）。
 * @param {Promise<T>} promise - 要执行的 Promise。
 * @returns {Promise<[T, E]>} - 一个 Promise，解析为包含 Promise 结果（类型为 T）和错误值（类型为 E）的元组。
 * @description
 * - 使用异步函数等待提供的 Promise 解析。
 * - 如果 Promise 成功解析，返回一个包含结果和空错误值的 Promise 元组。
 * - 如果 Promise 被拒绝，返回一个包含空结果和错误的 Promise 元组。
 */
export async function to<T, E = Error>(promise: Promise<T>): Promise<[T, E]> {
  try {
    const ret = await promise
    return [ret, null as unknown as E]
  }
  catch (e: any) {
    return [null as unknown as T, e]
  }
}

/**
 * Synchronously executes a function and returns a tuple [T, E].
 *
 * @template T - The type of the result value.
 * @template E - The type of the error value (defaults to Error).
 * @param {() => T} fn - The function to be executed.
 * @returns {[T, E]} - A tuple containing the result of the function (type T) and an error value (type E).
 * @description
 * - Uses a try-catch block to execute the provided function.
 * - If the function succeeds, returns a tuple with the result and a null error value.
 * - If an error occurs, returns a tuple with a null result and the error.
 */
/**
 * @zh-cn
 * 同步执行一个函数并返回元组 [T, E]。
 *
 * @template T - 结果值的类型。
 * @template E - 错误值的类型（默认为 Error）。
 * @param {() => T} fn - 要执行的函数。
 * @returns {[T, E]} - 包含函数结果（类型为 T）和错误值（类型为 E）的元组。
 * @description
 * - 使用 try-catch 块执行提供的函数。
 * - 如果函数成功执行，返回一个包含结果和空错误值的元组。
 * - 如果发生错误，返回一个包含空结果和错误的元组。
 */
export function toSync<T, E = Error>(fn: () => T): [T, E] {
  try {
    return [fn(), null as unknown as E]
  }
  catch (e: any) {
    return [null as unknown as T, e]
  }
}

/**
 * Generates a timestamp representing the current time in milliseconds.
 *
 * @returns {number} - The timestamp in milliseconds.
 * @description
 * - Uses the `Date.now()` method to obtain the current time in milliseconds.
 */

/**
 * Clamps a number within a specified range.
 *
 * @param {number} n - The number to be clamped.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} - The clamped value within the specified range.
 * @description
 * Uses Math.min and Math.max to ensure that the value falls within the specified range.
 */
/**
 * @zh-cn
 * 将数字夹在指定范围内。
 *
 * @param {number} n - 要夹住的数字。
 * @param {number} min - 范围的最小值。
 * @param {number} max - 范围的最大值。
 * @returns {number} - 在指定范围内夹住的值。
 * @description
 * 使用 Math.min 和 Math.max 确保值在指定范围内。
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/**
 * Generates a random integer within the specified range [min, max].
 *
 * @param {number} min - The minimum value of the range (inclusive).
 * @param {number} max - The maximum value of the range (inclusive).
 * @returns {number} - A random integer within the specified range.
 * @description
 * - Uses the `Math.random()` method to generate a random floating-point number.
 * - Converts the floating-point number to an integer within the specified range [min, max].
 */

/**
 * @zh-cn
 * 生成在指定范围 [min, max] 内的随机整数。
 *
 * @param {number} min - 范围的最小值（包含）。
 * @param {number} max - 范围的最大值（包含）。
 * @returns {number} - 在指定范围内的随机整数。
 * @description
 * - 使用 `Math.random()` 方法生成一个随机浮点数。
 * - 将浮点数转换为指定范围 [min, max] 内的整数。
 */
export function rand(min: number, max: number) {
  // Ensure min and max are integers
  min = Math.ceil(min)
  max = Math.floor(max)

  // Generate a random integer within the specified range
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Checks if a value is defined (not undefined).
 *
 * @template T - The type of the value (defaults to any).
 * @param {T} val - The value to be checked.
 * @returns {val is T} - Returns true if the value is defined, false otherwise.
 * @description
 * - Uses typeof to check if the value is not undefined.
 */

/**
 * @zh-cn
 * 检查一个值是否已定义（非 undefined）。
 *
 * @template T - 值的类型（默认为 any）。
 * @param {T} val - 要检查的值。
 * @returns {val is T} - 如果值已定义，则返回 true，否则返回 false。
 * @description
 * - 使用 typeof 来检查值是否非 undefined。
 */
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'

/**
 * Checks if a value is not null or undefined.
 *
 * @template T - The type of the value (defaults to any).
 * @param {T | null | undefined} val - The value to be checked.
 * @returns {val is T} - Returns true if the value is not null or undefined, false otherwise.
 * @description
 * - Uses the inequality operator (`!=`) to check if the value is not null or undefined.
 */

/**
 * @zh-cn
 * 检查一个值是否不为 null 或 undefined。
 *
 * @template T - 值的类型（默认为 any）。
 * @param {T | null | undefined} val - 要检查的值。
 * @returns {val is T} - 如果值不为 null 或 undefined，则返回 true，否则返回 false。
 * @description
 * - 使用不等号运算符 (`!=`) 来检查值是否不为 null 或 undefined。
 */
export const notNullish = <T = any>(val?: T | null | undefined): val is T => val != null
type TargetContext = '_blank' | '_self' | '_parent' | '_top'
export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string, noopener?: boolean, noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []
  if (noopener) {
    feature.push('noopener=yes')
  }
  if (noreferrer) {
    feature.push('noreferrer=yes')
  }

  window.open(url, target, feature.join(','))
}
