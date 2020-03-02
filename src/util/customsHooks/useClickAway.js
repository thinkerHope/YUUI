import { useRef, useEffect, useCallback } from 'preact/hooks'

export default function useClickAway(
    onClickAway, 
    dom, 
    eventName = 'click'
) {
 
    const element = useRef()

    const handler = useCallback(
      event => {
        const targetElement = typeof dom === 'function' ? dom() : dom
        const el = targetElement || element.current
        if (!el || el.contains(event.target)) {
          return;
        }

        onClickAway(event)
      },
      [onClickAway, dom],
    )

    useEffect(() => {
      console.log('add')
      document.addEventListener(eventName, handler)
  
      return () => {
        console.log('remove')
        document.removeEventListener(eventName, handler)
      }
    }, [eventName, handler])

    return element
}