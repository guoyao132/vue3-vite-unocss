# useFullscreen

管理 DOM 全屏的 Hook。

### API

```typescript
const [
  isFullscreen,
  {
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isEnabled,
  }] = useFullScreen(
    target,
    options?: Options
  );
```

### 参数

| 参数   | 说明             | 类型                                                    |
| ------ | ---------------- | ------------------------------------------------------- |
| target | DOM 节点或者 ref | `Element` /`() => Element`/ `MutableRefObject<Element>` |
| option | 设置             | `Options`                                               |

### 可选项

| 参数           | 说明         | 类型                     | 默认值 |
| -------------- | ------------ | ------------------------ | ------ |
| onExit         | 退出全屏触发 | `() => void`             | -      |
| onEnter        | 全屏触发     | `() => void`             | -      |
| defaultElement | 默认全屏元素 | `Element \| HTMLElement` | `html` |

### 返回值

| 参数             | 说明         | 类型                     |
| ---------------- | ------------ | ------------------------ |
| isFullscren      | 是否全屏     | `Readonly<Ref<boolean>>` |
| enterFullscreen  | 设置全屏     | `() => void`             |
| exitFullscreen   | 退出全屏     | `() => void`             |
| toggleFullscreen | 切换全屏     | `() => void`             |
| isEnabled        | 是否支持全屏 | `boolean`                |
