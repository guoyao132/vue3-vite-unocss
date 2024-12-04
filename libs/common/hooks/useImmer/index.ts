import type { Draft } from 'immer'
import { freeze, produce } from 'immer'
import type { Ref } from 'vue'
import { isRef, shallowRef } from 'vue'

export type DraftFunction<S> = (draft: Draft<S>) => void

export type Updater<S> = (arg: S | DraftFunction<S>) => void

export type ImmerHook<S> = [Ref<S>, Updater<S>]

export function useImmer<S = any>(initialValue: S | (() => S)): ImmerHook<S> {
  const state: Ref<S> = shallowRef(
    freeze(isRef(initialValue) ? (initialValue as Ref<S>).value : initialValue, true),
  ) as Ref<S>

  const update: Updater<S> = (updater: any) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
