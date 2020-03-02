import { h, cloneElement } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { on, off } from '../../util/dom'

const Drag = ({ onClick, initPosition = {}, children }) => {
  const initPos = {
    dragPos: {
      x: 10, // right
      y: 10, // bottom
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      ...initPosition,
    },
  }
  const posRef = useRef(initPos)
  const dragDomRef = useRef()

  const handleTouchS = e => {
    console.log('posRef', posRef)
    posRef.current.dragPos.startX = e.touches[0].pageX
    posRef.current.dragPos.startY = e.touches[0].pageY
  }
  const handleTouchM = e => {
    const dom = dragDomRef.current
    const pos = posRef.current
    if (e.touches.length > 0) {
      const offsetX = e.touches[0].pageX - pos.dragPos.startX
      const offsetY = e.touches[0].pageY - pos.dragPos.startY
      let x = pos.dragPos.x - offsetX
      let y = pos.dragPos.y - offsetY

      if (x + dom.offsetWidth > document.documentElement.offsetWidth) {
        x = document.documentElement.offsetWidth - dom.offsetWidth
      }
      if (y + dom.offsetHeight > document.documentElement.offsetHeight) {
        y = document.documentElement.offsetHeight - dom.offsetHeight
      }
      if (x < 0) { x = 0 }
      if (y < 0) { y = 0 }
      dom.style.right = `${x}px`
      dom.style.bottom = `${y}px`
      pos.dragPos.endX = x
      pos.dragPos.endY = y
      e.preventDefault()
    }
  }
  const handleTouchE = e => {
    const pos = posRef.current
    pos.dragPos.x = pos.dragPos.endX
    pos.dragPos.y = pos.dragPos.endY
    pos.dragPos.startX = 0
    pos.dragPos.startY = 0
  }
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }
  const touchCallers = [
    { event: 'touchstart', handler: handleTouchS },
    { event: 'touchend', handler: handleTouchE },
    { event: 'touchmove', handler: handleTouchM },
    { event: 'click', handler: handleClick },
  ]
  useEffect(() => {
    touchCallers.forEach(caller => {
      on(dragDomRef.current, caller.event, caller.handler)
    })
    return () => {
      touchCallers.forEach(caller => {
        off(dragDomRef.current, caller.event, caller.handler)
      })
    }
  }, [])

  return (
    <div>
      { cloneElement(children, { ref: dragDomRef }) }
    </div>
  )
}

export default Drag
