import type { WatchSource, watchEffect } from 'vue'
import { onUnmounted, ref } from 'vue'
import type { DependencyList } from './depsAreSame'
import depsAreSame from './depsAreSame'
import type { BasicTarget } from './domTarget'
import { getTargetElement } from './domTarget'

export type EffectCallback = () => void

function createEffectWithTarget(useEffectType: typeof watchEffect) {
  /**
   *
   * @param effect
   * @param deps
   * @param target target should compare ref.current vs ref.current, dom vs dom, ()=>dom vs ()=>dom
   */
  const useEffectWithTarget = (
    effect: EffectCallback,
    deps: WatchSource[] | any,
    target: BasicTarget<any> | BasicTarget<any>[],
  ) => {
    const hasInitRef = ref(false)

    const lastElementRef = ref<(Element | null)[]>([])
    const lastDepsRef = ref<DependencyList>([])

    const unLoadRef = ref<any>()

    useEffectType(() => {
      const targets = Array.isArray(target) ? target : [target]
      const els = targets.map(item => getTargetElement(item))

      // init run
      if (!hasInitRef.value) {
        hasInitRef.value = true
        lastElementRef.value = els
        lastDepsRef.value = deps

        unLoadRef.value = effect()
        return
      }

      if (
        els.length !== lastElementRef.value.length
        || !depsAreSame(els, lastElementRef.value)
        || !depsAreSame(deps, lastDepsRef.value)
      ) {
        unLoadRef.value?.()
        lastElementRef.value = els
        lastDepsRef.value = deps
        unLoadRef.value = effect()
      }
    })

    onUnmounted(() => {
      unLoadRef.value?.()
      hasInitRef.value = false
    })
  }

  return useEffectWithTarget
}

export default createEffectWithTarget
