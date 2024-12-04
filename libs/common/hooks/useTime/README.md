## useTime

获取本地时间的各个组成部分。

### 返回值

- `month`: [Ref](https://v3.vuejs.org/api/refs-api.html#ref) &lt;number&gt; - 当前月份。
- `day`: [Ref](https://v3.vuejs.org/api/refs-api.html#ref) &lt;number&gt; - 当前天数。
- `hour`: [Ref](https://v3.vuejs.org/api/refs-api.html#ref) &lt;number | string&gt; - 当前小时。
- `minute`: [Ref](https://v3.vuejs.org/api/refs-api.html#ref) &lt;number | string&gt; - 当前分钟。
- `second`: [Ref](https://v3.vuejs.org/api/refs-api.html#ref) &lt;number&gt; - 当前秒数。
- `week`: [Ref](https://v3.vuejs.org/api/refs-api.html#ref) &lt;string&gt; - 当前星期几。

### 样例

```javascript
import { useTime } from './useTime'

// 在组件中使用
export default {
  setup() {
    const { month, day, hour, minute, second, week } = useTime()

    // 在模板中使用
    return {
      month,
      day,
      hour,
      minute,
      second,
      week,
    }
  },
}
```
