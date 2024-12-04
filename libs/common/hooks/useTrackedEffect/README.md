# useTrackedEffect

追踪是哪个依赖发生变化。

### API

```typescript
useTrackedEffect(
  effect: (changes: [], previousDeps: [], currentDeps: []) => (void | (() => void | undefined)),
  deps?: deps,
)
```
