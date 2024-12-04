# useKeyPress

监听键盘按键，支持组合键，支持按键别名的 Hook

## API

```typescript
const state = useKeyPress(target?: Target);
```

## 参数

| 参数         | 说明             | 类型                                                                                  |
| ------------ | ---------------- | ------------------------------------------------------------------------------------- |
| keyFilter    | 键盘输入的当前键 | `Number` \| `String` \| `Number[]`\| `String[]` \|`(event: KeyboardEvent) => boolean` |
| eventHandler | 事件处理         | `(event: KeyboardEvent) => void`                                                      |
| option       | 额外的配置项     | `Options`                                                                             |

## 可选项

| 参数       | 说明                                               | 类型                                    | 默认值 |
| ---------- | -------------------------------------------------- | --------------------------------------- | ------ |
| events     | 当所监听的事件类型触发时，接收到的一个事件通知对象 | `EventListenerOrEventListenerObject`    | -      |
| target     | DOM 节点或者 Ref                                   | `HTMLElement` \| `Document` \| `Window` | -      |
| exactMatch | 是否准确匹配                                       | `Boolean`                               | -      |
