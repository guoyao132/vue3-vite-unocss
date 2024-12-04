import type { Ref } from 'vue'
import { markRaw, readonly, ref } from 'vue'

interface UseSetActions<T> {
  add: (value: T) => void
  remove: (value: T) => void
  has: (value: T) => boolean
  clear: () => void
  reset: () => void
}

function useSet<T = any>(initialValue?: T[]): [Readonly<Ref<Set<T>>>, UseSetActions<T>]

function useSet<T = any>(initialValue?: T[]) {
  const initialState = initialValue ? new Set(initialValue) : new Set<T>()
  const state = ref<Set<T>>(initialState) as Ref<Set<T>>

  const actions: UseSetActions<T> = {
    /**
     *  Add item
     * @param value T
     */
    add: (value: T) => {
      const newState = new Set(state.value)
      newState.add(value)
      state.value = newState
    },

    /**
     *  Remove item
     * @param value T
     */
    remove: (value: T) => {
      const newState = new Set(state.value)
      newState.delete(value)
      state.value = newState
    },

    /**
     * Set has
     * @param value T
     */
    has: (value: T) => state.value.has(value),

    /**
     * Clear Set
     */
    clear: () => {
      // Assign a new empty Set to ensure reactivity
      state.value = new Set()
    },

    /**
     * Reset to default
     */
    reset: () => {
      // Reset to the initial state
      state.value = new Set(initialState)
    },
  }

  return [readonly(state), markRaw(actions)]
}

export default useSet
