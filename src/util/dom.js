  export const once = function(el, event, fn) {
    let cancelled = false
    const canceller = function() {
      if (cancelled) return
  
      cancelled = true
      off(el, event, listener)
    }
    const listener = function() {
      if (fn) {
        fn.apply(this, arguments)
      }
      canceller()
    }
  
    on(el, event, listener)
    return canceller
  }
  
  export const on = (() => {
    if (document.addEventListener) {
      return (element, event, handler, useCapture = false) => {
        if (element && event && handler) {
          element.addEventListener(event, handler, useCapture)
        }
      }
    } else {
      return (element, event, handler) => {
        if (element && event && handler) {
          element.attachEvent('on' + event, handler)
        }
      }
    }
  })()
  
  export const off = (() => {
    if (document.removeEventListener) {
      return (element, event, handler, useCapture = false) => {
        if (element && event) {
          element.removeEventListener(event, handler, useCapture)
        }
      }
    } else {
      return (element, event, handler) => {
        if (element && event) {
          element.detachEvent('on' + event, handler)
        }
      }
    }
  })()