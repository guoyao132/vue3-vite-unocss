import { ref } from 'vue'
import isEqual from 'lodash/isEqual'
import type { EffectCallback } from './createEffectWithTarget'
import type { DependencyList } from './depsAreSame'
import type { BasicTarget } from './domTarget'
import useEffectWithTarget from './useEffectWithTarget'

function depsEqual(aDeps: DependencyList, bDeps: DependencyList = []) {
  return isEqual(aDeps, bDeps)
}

function useDeepCompareEffectWithTarget(effect: EffectCallback, deps: DependencyList, target: BasicTarget<any> | BasicTarget<any>[]) {
  const targetRef = ref()
  const signalRef = ref<number>(0)

  if (!depsEqual(deps, targetRef.value)) {
    targetRef.value = deps
    signalRef.value += 1
  }

  useEffectWithTarget(effect, [signalRef], target)
}

export default useDeepCompareEffectWithTarget
