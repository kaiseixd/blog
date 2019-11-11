### 阅读代码
#### 源码结构
- ReactFiberBeginWork (“entering” a component)
- ReactFiberCompleteWork (“leaving” a component)
- ReactFiberCommitWork (flushing changes to DOM)
- ReactFiberScheduler (choosing next component to work on)
- ReactChildFiber (diffing insertions/deletions of children)
> https://github.com/reactjs/reactjs.org/pull/745#issuecomment-377717600

### 参考资料
- [react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
- [Didact Fiber: Incremental reconciliation](https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec)
- [冰山一角](https://zhuanlan.zhihu.com/jheaven)
- [Inside Fiber: in-depth overview of the new reconciliation algorithm in React](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)
- [The how and why on React’s usage of linked list in Fiber to walk the component’s tree](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7)
- [In-depth explanation of state and props update in React](https://medium.com/react-in-depth/=in-depth-explanation-of-state-and-props-update-in-react-51ab94563311)