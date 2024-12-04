/**
 * Picks specified keys from an object and creates a new object with those keys.
 *
 * @template O - The type of the input object.
 * @template T - The type of the keys to be picked.
 * @param {O} obj - The input object.
 * @param {T[]} keys - An array of keys to be picked from the object.
 * @param {boolean} [omitUndefined=false] - If true, omits keys with undefined values from the resulting object.
 * @returns {Pick<O, T>} - A new object containing only the specified keys.
 * @description
 * - Uses the `reduce` function to iterate over the keys array and create a new object with the specified keys.
 * - Optionally omits keys with undefined values based on the 'omitUndefined' parameter.
 */

/**
 * @zh-cn
 * 从对象中挑选指定的键，并创建一个只包含这些键的新对象。
 *
 * @template O - 输入对象的类型。
 * @template T - 要挑选的键的类型。
 * @param {O} obj - 输入对象。
 * @param {T[]} keys - 从对象中挑选的键的数组。
 * @param {boolean} [omitUndefined] - 如果为 true，则从结果对象中省略具有 undefined 值的键。
 * @returns {Pick<O, T>} - 一个只包含指定键的新对象。
 * @description
 * - 使用 `reduce` 函数遍历键数组，并使用指定的键创建一个新对象。
 * - 根据 'omitUndefined' 参数，可选择省略具有 undefined 值的键。
 */
export function objectPick<O extends object, T extends keyof O>(
  obj: O,
  keys: T[],
  omitUndefined = false,
): Pick<O, T> {
  return keys.reduce((newObj, key) => {
    // Check if the key is in the object and, if specified, omit undefined values
    if (key in obj && (!omitUndefined || obj[key] !== undefined))
      newObj[key] = obj[key]

    return newObj
  }, {} as Pick<O, T>)
}

/**
 * Creates a new object by omitting specified keys from the input object.
 *
 * @template O - The type of the input object.
 * @template T - The type of the keys to be omitted.
 * @param {O} obj - The input object.
 * @param {T[]} keys - An array of keys to be omitted from the object.
 * @param {boolean} [omitUndefined=false] - If true, omits keys with undefined values from the resulting object.
 * @returns {Omit<O, T>} - A new object containing all keys except the specified ones.
 * @description
 * - Uses `Object.entries` and `Object.fromEntries` to filter and reconstruct the object based on the specified keys.
 * - Optionally omits keys with undefined values based on the 'omitUndefined' parameter.
 */

/**
 * @zh-cn
 * 通过省略输入对象中的指定键来创建一个新对象。
 *
 * @template O - 输入对象的类型。
 * @template T - 要省略的键的类型。
 * @param {O} obj - 输入对象。
 * @param {T[]} keys - 从对象中省略的键的数组。
 * @param {boolean} [omitUndefined] - 如果为 true，则从结果对象中省略具有 undefined 值的键。
 * @returns {Omit<O, T>} - 包含除指定键以外的所有键的新对象。
 * @description
 * - 使用 `Object.entries` 和 `Object.fromEntries` 过滤并根据指定的键重构对象。
 * - 根据 'omitUndefined' 参数，可选择省略具有 undefined 值的键。
 */
export function objectOmit<O extends object, T extends keyof O>(
  obj: O,
  keys: T[],
  omitUndefined = false,
): Omit<O, T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      // Check if the key should be omitted based on the 'keys' array and, if specified, omit undefined values
      return (!omitUndefined || value !== undefined) && !keys.includes(key as T)
    }),
  ) as Omit<O, T>
}

/**
 * Retrieves an array of [key, value] pairs from an object.
 *
 * @template T - The type of the input object.
 * @param {T} obj - The input object.
 * @returns {Array<[keyof T, T[keyof T]]>} - An array of [key, value] pairs from the object.
 * @description
 * - Uses `Object.entries` to get an array of [key, value] pairs from the input object.
 * - The resulting array has a type of Array<[keyof T, T[keyof T]]>.
 */

/**
 * @zh-cn
 * 从对象中提取 [key, value] 对的数组。
 *
 * @template T - 输入对象的类型。
 * @param {T} obj - 输入对象。
 * @returns {Array<[keyof T, T[keyof T]]>} - 包含对象中 [key, value] 对的数组。
 * @description
 * - 使用 `Object.entries` 从输入对象中获取 [key, value] 对的数组。
 * - 结果数组的类型为 Array<[keyof T, T[keyof T]]>。
 */
export function objectEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/**
 * Checks if an object has its own property with the specified key.
 *
 * @template T - The type of the object.
 * @template K - The type of the property key.
 * @param {T} val - The object to be checked.
 * @param {K} key - The property key to check for.
 * @returns {key is K} - Returns true if the object has its own property with the specified key, false otherwise.
 * @description
 * - Uses Object.prototype.hasOwnProperty.call to check if the object has its own property with the specified key.
 */

/**
 * @zh-cn
 * 检查对象是否具有指定键的自有属性。
 *
 * @template T - 对象的类型。
 * @template K - 属性键的类型。
 * @param {T} val - 要检查的对象。
 * @param {K} key - 要检查的属性键。
 * @returns {key is K} - 如果对象具有指定键的自有属性，则返回 true，否则返回 false。
 * @description
 * - 使用 Object.prototype.hasOwnProperty.call 来检查对象是否具有指定键的自有属性。
 */
export function hasOwn<T extends object, K extends keyof T>(val: T, key: K): key is K {
  return Object.prototype.hasOwnProperty.call(val, key)
}
