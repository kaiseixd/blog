---
id: event-loop
title: 从规范理解 Event Loop 的执行顺序
---

这个 task 到底什么时候执行鸭？

<!--truncate-->

### 部分概念
#### Event Loop

> To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops.

Event Loop 是 JS 实现异步的方式，由 Runtime 维护。具体执行过程中，Runtime 负责函数的压栈和出栈（包括取 event queue 中的 task），JS Engine 负责执行栈顶的函数。

#### Task

* Script（整体代码）
* DOM manipulation（DOM 操作）
* User interaction（用户交互）
* Networking（网络请求）
* History traversal（History API 操作）
* GUI 渲染

task 有多个 queue，不同来源的 task 会添加到不同的 queue 中，并且在执行顺序上有不同的优先级（UI 交互会更高），同一个 queue 内的 task 按顺序执行。

#### Microtask

* Promise
* MutationObserver
* process.nextTick(Node.js)

microtask 只有一个 queue，但是在 Node.js 中 process.nextTick 的执行优先级最高。

### 执行机制
#### Runtime

    1. 执行同步任务，创建执行上下文，按顺序进入执行栈
    2. 对于异步任务，将对应 task 添加到 event loop 的 queue 中，由其他线程执行具体的异步操作（浏览器内核是多线程的）
    3. 执行栈为空后读取 event loop 中的 queue，取出并执行任务
    4. 重复以上步骤

> 补充关于浏览器 setTimeout 的部分

#### Processing model

    1. 从 task queue 中取出最老的一个 task 执行（并且一次 event loop 仅执行这一个 task）
    2. 进入 microtask 检查点
    3. 进入更新渲染阶段

> https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model

#### Microtask Checkpoint

```js
// 根据规范写的伪代码：
// flag: performing a microtask checkpoint flag
// queue: microtask queue
function microtaskCheckPoint() {
    if (flag) {
        while (queue.length) {
            const oldestMicrotask = queue.pop()
            currentlyRuningTask = oldestMicrotask
            oldestMicrotask() // 这里可能会导致再次执行 microtaskCheckPoint，所以需要 flag
            currentlyRuningTask = null
        }
        someCleanup()
        flag = false
    } else {
        return
    }
}
```

<!-- #### Rendering

> 待补充 -->

#### Microtask Queue 执行时机

除了上述模型中的 microtask 检查点，其他几种情况中 microtask 也会被执行：

1. 进入脚本执行的清理阶段
2. 创建和插入节点时
3. 解析 XML 文档时

### 来试试吧

```js
setTimeout(() => {
    console.log('a1')
    new Promise(resolve => {
        console.log('a2')
        resolve()
    }).then(() => {
        console.log('a3')
    })
})

new Promise(resolve => {
    console.log('b1')
    resolve()
}).then(() => {
    console.log('b2')
})

setTimeout(() => {
    console.log('c1')
    new Promise(resolve => {
        console.log('c2')
        resolve()
    }).then(() => {
        console.log('c3')
    })
})
```

#### 解析

1. 执行 JS 代码（也是一个 task），输出 b1，添加一个 microtask 和两个 task（瞬间完成的 setTimeout）
2. 执行所有的 microtask，输出 b2
3. 取出第一个 task 执行，输出 a1 a2，添加一个 microtask
4. 执行所有的 microtask，输出 a3
5. 取出第二个 task 执行，输出 c1 c2，添加一个 microtask
6. 执行所有的 microtask，输出 c3

#### 答案

b1 b2 a1 a2 a3 c1 c2 c3

#### 在 microtask 中添加 microtask？

也会在当前 task 中之执行完。

### 其他需要注意的地方
#### setTimeout delay 最小值

在浏览器中是 4ms，在 Node 中是 1ms。

<!-- #### 关于修改 dom 以及页面 render？

> 待补充

#### Node Event Loop

> 待补充 -->

### 参考

* https://html.spec.whatwg.org/multipage/webappapis.html#event-loops
* https://zhuanlan.zhihu.com/p/33087629
* https://github.com/fi3ework/blog/issues/29
* https://zhuanlan.zhihu.com/p/34229323
* https://github.com/aooy/blog/issues/5
