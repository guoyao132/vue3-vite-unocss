const toString = Object.prototype.toString
/**
 * Determines whether the code is running in a client-side (browser) environment.
 *
 * @type {boolean}
 * @description
 * - `typeof window !== 'undefined'`: Checks if the 'window' object is defined.
 * - `typeof document !== 'undefined'`: Checks if the 'document' object is defined.
 * If both conditions are true, 'isClient' will be true, indicating a browser environment.
 * If either 'window' or 'document' is undefined, 'isClient' will be false.
 */

/**
 * @zh-cn
 * 判断代码是否在客户端（浏览器）环境中运行。
 *
 * @type {boolean}
 * @description
 * - `typeof window !== 'undefined'`: 检查 'window' 对象是否已定义。
 * - `typeof document !== 'undefined'`: 检查 'document' 对象是否已定义。
 * 如果两个条件都为真，则 'isClient' 将为真，表示在浏览器环境中。
 * 如果 'window' 或 'document' 中任何一个未定义，则 'isClient' 将为假。
 */
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * Checks if a value is an array.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is any[]} - Returns true if the value is an array, false otherwise.
 * @description
 * - Uses `Array.isArray` to determine if the value is of type 'array'.
 */

/**
 * 检查一个值是否为数组。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is any[]} - 如果值是数组，则返回 true，否则返回 false。
 * @description
 * - 使用 `Array.isArray` 判断值是否为 'array' 类型。
 */
export const isArray = Array.isArray

/**
 * Checks if a value is a map.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is Map<any, any>} - Returns true if the value is a Map, false otherwise.
 * @description
 * - Uses `Object.prototype.toString` to determine if the value is of type 'Map'.
 */

/**
 * 检查一个值是否为 Map。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is Map<any, any>} - 如果值是 Map，则返回 true，否则返回 false。
 * @description
 * - 使用 `Object.prototype.toString` 判断值是否为 'Map' 类型。
 */
export const isMap = (val: unknown): val is Map<any, any> => toString.call(val) === '[object Map]'

/**
 * Checks if a value is a set.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is Set<any>} - Returns true if the value is a Set, false otherwise.
 * @description
 * - Uses `Object.prototype.toString` to determine if the value is of type 'Set'.
 */

/**
 * 检查一个值是否为 Set。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is Set<any>} - 如果值是 Set，则返回 true，否则返回 false。
 * @description
 * - 使用 `Object.prototype.toString` 判断值是否为 'Set' 类型。
 */
export const isSet = (val: unknown): val is Set<any> => toString.call(val) === '[object Set]'

/**
 * Checks if a value is a date.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is Date} - Returns true if the value is a Date, false otherwise.
 * @description
 * - Uses `Object.prototype.toString` to determine if the value is of type 'Date'.
 */

/**
 * 检查一个值是否为 Date。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is Date} - 如果值是 Date，则返回 true，否则返回 false。
 * @description
 * - 使用 `Object.prototype.toString` 判断值是否为 'Date' 类型。
 */
export const isDate = (val: unknown): val is Date => toString.call(val) === '[object Date]'

/**
 * Checks if a value is a boolean.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is boolean} - Returns true if the value is a boolean, false otherwise.
 * @description
 * - Uses `typeof` to check if the value is of type 'boolean'.
 */

/**
 * 检查一个值是否为布尔值。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is boolean} - 如果值是布尔值，则返回 true，否则返回 false。
 * @description
 * - 使用 `typeof` 判断值是否为 'boolean' 类型。
 */
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'

/**
 * Checks if a value is a function.
 *
 * @template T - The type of the function.
 * @param {unknown} val - The value to be checked.
 * @returns {val is T} - Returns true if the value is a function, false otherwise.
 * @description
 * - Uses `typeof` to check if the value is of type 'function'.
 */

/**
 * 检查一个值是否为函数。
 *
 * @template T - 函数的类型。
 * @param {unknown} val - 要检查的值。
 * @returns {val is T} - 如果值是函数，则返回 true，否则返回 false。
 * @description
 * - 使用 `typeof` 判断值是否为 'function' 类型。
 */
export const isFunction = (val: unknown): val is (...args: any[]) => any => typeof val === 'function'

/**
 * Checks if a value is a number.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is number} - Returns true if the value is a number, false otherwise.
 * @description
 * - Uses `typeof` to check if the value is of type 'number'.
 */

/**
 * 检查一个值是否为数字。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is number} - 如果值是数字，则返回 true，否则返回 false。
 * @description
 * - 使用 `typeof` 判断值是否为 'number' 类型。
 */
export const isNumber = (val: unknown): val is number => typeof val === 'number'

/**
 * Checks if a value is a string.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is string} - Returns true if the value is a string, false otherwise.
 * @description
 * - Uses `typeof` to check if the value is of type 'string'.
 */

/**
 * 检查一个值是否为字符串。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is string} - 如果值是字符串，则返回 true，否则返回 false。
 * @description
 * - 使用 `typeof` 判断值是否为 'string' 类型。
 */
export const isString = (val: unknown): val is string => typeof val === 'string'

/**
 * Checks if a value is a symbol.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is symbol} - Returns true if the value is a symbol, false otherwise.
 * @description
 * - Uses `typeof` to check if the value is of type 'symbol'.
 */

/**
 * 检查一个值是否为符号。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is symbol} - 如果值是符号，则返回 true，否则返回 false。
 * @description
 * - 使用 `typeof` 判断值是否为 'symbol' 类型。
 */
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

/**
 * Checks if a value is an object.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is Record<any, any>} - Returns true if the value is an object, false otherwise.
 * @description
 * - Uses `Object.prototype.toString` to determine if the value is of type 'object'.
 */

/**
 * 检查一个值是否为对象。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is Record<any, any>} - 如果值是对象，则返回 true，否则返回 false。
 * @description
 * - 使用 `Object.prototype.toString` 判断值是否为 'object' 类型。
 */
export const isObject = (val: unknown): val is Record<any, any> => toString.call(val) === '[object Object]'

/**
 * Checks if the value is a Promise.
 *
 * @template T - The type of the Promise value.
 * @param {unknown} val - The value to be checked.
 * @returns {val is Promise<T>} - Returns true if the value is a Promise, false otherwise.
 * @description
 * - Checks if the value is an object.
 * - Checks if the value has 'then' and 'catch' functions, indicating it is a Promise.
 */

/**
 * 检查值是否为 Promise。
 *
 * @template T - Promise 值的类型。
 * @param {unknown} val - 要检查的值。
 * @returns {val is Promise<T>} - 如果值是 Promise，则返回 true，否则返回 false。
 * @description
 * - 检查值是否为对象。
 * - 检查值是否具有 'then' 和 'catch' 函数，表明它是一个 Promise。
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * Checks if the value is a Window object.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is Window} - Returns true if the value is a Window object, false otherwise.
 * @description
 * - Checks if the 'window' object is defined.
 * - Uses Object.prototype.toString method to determine if the value is a Window object.
 */

/**
 * 检查值是否为 Window 对象。
 *
 * @param {unknown} val - 要检查的值。
 * @returns {val is Window} - 如果值是 Window 对象，则返回 true，否则返回 false。
 * @description
 * - 检查 'window' 对象是否已定义。
 * - 使用 Object.prototype.toString 方法确定值是否为 Window 对象。
 */
export const isWindow = (val: unknown): val is Window => typeof window !== 'undefined' && toString.call(val) === '[object Window]'

/**
 * Checks if a given string is a valid HTTP or HTTPS URL.
 *
 * @param {string} path - The string to be checked.
 * @return {boolean} Returns true if the string is a valid HTTP or HTTPS URL, false otherwise.
 */
/**
 * 检查给定的字符串是否是有效的 HTTP 或 HTTPS URL。
 *
 * @param {string} path - 要检查的字符串。
 * @return {boolean} 如果字符串是有效的 HTTP 或 HTTPS URL，则返回 true，否则返回 false。
 */

export function isHttpUrl(path: string): boolean {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{1,64})?\.)+[a-z]{2,6}\/?/
  return reg.test(path)
}

/**
 * Checks if a given string is in PascalCase.
 *
 * @param {string} str - The string to be checked.
 * @return {boolean} Returns true if the string is in PascalCase, false otherwise.
 */
/**
 * 检查给定的字符串是否是 PascalCase。
 *
 * @param {string} str - 要检查的字符串。
 * @return {boolean} 如果字符串是 PascalCase，则返回 true，否则返回 false。
 */
export function isPascalCase(str: string): boolean {
  const regex = /^[A-Z][A-Za-z]*$/
  return regex.test(str)
}
