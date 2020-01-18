const root = typeof window === 'undefined' ? global : window 
const vendors = ['moz', 'webkit']
const suffix = 'AnimationFrame'
const raf = root[`request${suffix}`]
const caf = root[`cancel${suffix}`] || root[`cancelRequest${suffix}`]

for(let i = 0; !raf && i < vendors.length; i++) {
  raf = root[`${vendors[i]}Request${suffix}`]
  caf = root[`${vendors[i]}Cancel${suffix}`] ||
        root[`${vendors[i]}CancelRequest${suffix}`]
}

if(!raf || !caf) {
  let lastTime = 0
  let id = 0
  // 一个帧就对应一个队列, 该帧结束时就执行队列中的回调
  const queue = []
  // 帧间隔 16ms
  const frameDuration = 1000 / 60

  raf = callback => {
    if(queue.length === 0) {
      // 调整时间，让一次动画等待和执行时间在最佳循环时间间隔内完成
      const nowTime = new Date().getTime()
      const timeToCall = Math.max(0, frameDuration - (nowTime - lastTime))
      lastTime = timeToCall + nowTime
      setTimeout(() => {
        const cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(let i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try {
              cp[i].callback(lastTime)
            } catch(e) {
              setTimeout(() => { throw e }, 0)
            }
          }
        }
      }, Math.round(timeToCall))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = handle => {
    for(let i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

export { raf, caf } 