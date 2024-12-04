# useSet

管理 Set 类型状态的 Hook。

## API

```typescript
const [
  set,
  {
    add,
    remove,
    reset,
    has,
    clear
  }
] = useSet(initialValue?: Iterable<K>);
```

## 参数

| 参数         | 说明                        | 类型          | 默认值 |
| ------------ | --------------------------- | ------------- | ------ |
| initialValue | 可选项，传入默认的 Set 参数 | `Iterable<K>` | -      |

## 返回值

| 参数   | 说明         | 类型                 |
| ------ | ------------ | -------------------- |
| set    | Set 对象     | `Readonly<Ref<Set>>` |
| add    | 添加元素     | `(key: T) => void`   |
| remove | 移除元素     | `(key: T) => void`   |
| reset  | 重置为默认值 | `() => void`         |
| clear  | 清除 Set     | `() => void`         |
| has    | Set has      | `(key: T) => void`   |
