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
  