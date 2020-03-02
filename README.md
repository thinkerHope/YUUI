# YUUI

https://codesandbox.io/s/

常用组件的封装和学习

npm i 安装依赖

Hooks 学习资源整理
 （1）React官网 -> Hooks FAQ

```js
// Q1: 如何惰性创建昂贵的对象
// 初始 state 的创建
// 每次渲染都会被调用
const [ua] = useState(getEnv())
// React 只会在首次渲染时调用这个函数
const [ua] = useState(() => getEnv())

//避免重新创建 useRef() 的初始值
// IntersectionObserver 在每次渲染都会被创建
function Image(props) {
  const ref = useRef(new IntersectionObserver(onIntersect));
}

function Image(props) {
  const ref = useRef(null);

  // IntersectionObserver 只会被惰性创建一次
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // 当你需要时，调用 getObserver()
}

// useReducer 实现惰性传值
function init(initialCount) {
  return {count: initialCount};
}
function Counter({initialCount}) {
  // 传入第三个参数即可
  const [state, dispatch] = useReducer(reducer, initialCount, init)
}

// Q2: Hook 会因为在渲染时创建函数而变慢吗 -- NO
// 在 React 中使用内联函数对性能的影响，与每次渲染都传递新的回调会如何破坏子组件的 shouldComponentUpdate 优化有关, Hook 从三个方面解决了这个问题
1. useCallback 允许你在重新渲染之间保持对相同的回调引用
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b])
2. useMemo 使得控制具体子节点何时更新变得更容易，减少了对纯组件的需要
3. useReducer 减少了对深层传递回调的依赖

// Q3: 如何避免向下传递回调
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // dispatch 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}

function DeepChild(props) {
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}

// Q4: 如何从 useCallback 读取一个经常变化的值

```
 （2）《useEffect完全指南》

当我们想要根据前一个状态更新状态的时候，我们可以使用setState的函数形式：

```js
useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [count])
```
可以去掉count依赖
```js
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
    return () => clearInterval(id);
  }, [])
```
利用React内置方案而不是ES6参数默认值处理 DefaultProps, 
会存在因为每次渲染引用不同的风险
考虑如下：
```js
const Child = memo(({ type = { a: 1 } }) => {
  useEffect(() => {
    console.log('type', type)
  }, [type])

  return <div>Child</div>
})
```
React内置方案
```js
const Child = ({ type }) => {
  useEffect(() => {
    console.log('type', type)
  }, [type])

  return <div>Child</div>
}

Child.defaultProps = {
  type: { a: 1 }
}
```
由上引发的思考（不要坑了子组件）
```js
// 父组件
function App() {
  const [count, forceUpdate] = useState(0)

  const schema = { b: 1 }

  return (
    <div>
      <Child schema={schema} />
      <div onClick={() => forceUpdate(count + 1)}>Count {count}</div>
    </div>
  )
}
```
子组件关心的不是引用，而是值
```js
// 使用useRef就能保持引用不变了
function App() {
  const [count, forceUpdate] = useState(0)

  const schema = useRef({ b: 1 })

  return (
    <div>
      <Child schema={schema.current} />
      <div onClick={() => forceUpdate(count + 1)}>Count {count}</div>
    </div>
  )
}
```
TimeLine 
```js

```
