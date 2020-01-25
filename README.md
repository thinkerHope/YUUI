# YUUI
常用组件的封装和学习

npm i 安装依赖

Hooks 学习资源整理
 （1）React官网 -> Hooks FAQ
  
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

