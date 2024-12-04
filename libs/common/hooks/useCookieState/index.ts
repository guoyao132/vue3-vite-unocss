import Cookies from 'js-cookie'
import { readonly, ref } from 'vue'
import { isFunction } from '../utils/isFunction'

export type UseCookieStateType = string | undefined

export interface UseCookieStateOptions extends Cookies.CookieAttributes {
  defaultValue?: UseCookieStateType | (() => UseCookieStateType)
}

function useCookieState(cookieKey: string, options: UseCookieStateOptions = {}) {
  const defaultValue = () => {
    const cookieValue = Cookies.get(cookieKey)

    if (typeof cookieValue === 'string')
      return cookieValue

    if (isFunction(options.defaultValue)) {
      // @ts-expect-error xxx
      return options.defaultValue() as UseCookieStateType | (() => UseCookieStateType)
    }
    return options.defaultValue as UseCookieStateType | (() => UseCookieStateType)
  }
  const state = ref(defaultValue())

  const updateState = (
    newValue: UseCookieStateType | ((prevState: UseCookieStateType) => UseCookieStateType),
    newOptions: Cookies.CookieAttributes = {},
  ) => {
    const { defaultValue, ...restOptions } = { ...options, ...newOptions }
    const getValue = () => {
      // @ts-expect-error xxx
      const value = isFunction(newValue) ? newValue(state.value) : newValue
      if (value === undefined) {
        Cookies.remove(cookieKey)
      }
      else {
        Cookies.set(cookieKey, value, restOptions)
      }
      return value
    }
    state.value = getValue()
  }

  return [readonly(state), updateState] as const
}

export default useCookieState
