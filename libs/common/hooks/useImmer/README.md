# useImmer Hook

useImmer 是一个基于 Vue 3 Composition API 的钩子，通过整合 Immer 的强大功能，简化了状态管理。它提供了一种轻松的方式在具有响应性的同时保证状态的不可变性。

### 在 Vue 3 组件中的示例

```vue
<script>
import { useImmer } from '@web/common/hooks/useImmer'

export default {
  setup() {
    // 使用 useImmer 钩子管理状态
    const [state, updateState] = useImmer({
      count: 0,
    })

    // 增加计数的方法
    const increment = () => {
      updateState((draft) => {
        draft.count += 1
      })
    }

    // 减少计数的方法
    const decrement = () => {
      updateState((draft) => {
        draft.count -= 1
      })
    }

    // 在模板中返回数据和方法
    return {
      state,
      increment,
      decrement,
    }
  },
}
</script>

<template>
  <div>
    <p>当前计数: {{ state.value.count }}</p>
    <button @click="increment">增加</button>
    <button @click="decrement">减少</button>
  </div>
</template>
```

### API

useImmer(initialValue: S | (() => S)): ImmerHook<S>

- 参数

  initialValue: 初始状态的值。可以是类型 S 的值，或者返回 S 的函数。

- 返回值:
  一个包含 [state, updateState] 的数组:
  state: 包含当前状态的响应式 Ref。
  updateState(updater: S | DraftFunction<S>): void: 一个更新状态的函数，接受值或 DraftFunction。
