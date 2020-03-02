import { h } from 'preact'
import { createPortal, useRef, useEffect } from 'preact/compat'
import Dialog from './dialog'

const DialogWrap = ({ visible = false, onAnimateLeave, ...restProps }) => {
  console.log('DialogWrap visible', visible)
  const componentRef = useRef()
  const containerRef = useRef()

  const removeContainer = () => {
    if (componentRef.current) {
      containerRef.current.parentNode.removeChild(containerRef.current)
      containerRef.current = null
    }
  }

  const getComponent = visible => {
    return (
      <Dialog
        visible={visible}
        onAnimateLeave={removeContainer}
        ref={componentRef}
        {...restProps}
      />
    )
  }

  const getContainer = () => {
    if (!containerRef.current) {
      const container = document.createElement('div')
      const containerId = `container-${(new Date().getTime())}`
      container.setAttribute('id', containerId)
      document.body.appendChild(container)
      containerRef.current = container
    }
    return containerRef.current
  }

  useEffect(() => {
    return () => {
      removeContainer()
    }
  }, [])

  return (visible || containerRef.current) ?
    createPortal(
      getComponent(visible),
      getContainer(),
    ) : null
}

export default DialogWrap
