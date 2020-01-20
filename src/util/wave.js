/* eslint-disable no-use-before-define */
import { useEffect } from 'preact/hooks'
import TransitionEvents from '../../util/transitionEvents'
import raf from '../../util/raf'
import style from './style.less'

let styleForPesudo

function isHidden(element) {
  return !element || element.offsetParent === null
}

function isNotGrey(color) {
  const match = (color || '').match(/rgba?\((\d*), (\d*), (\d*)(, [.\d]*)?\)/)
  if (match && match[1] && match[2] && match[3]) {
    return !(match[1] === match[2] && match[2] === match[3])
  }
  return true
}

let timeoutId
let extraNode = null
let destory = false

let animationStart = false
let animationStartId

function Wave({ children, insertExtraNode, childrenRef }) {
  useEffect(() => {
    const node = childrenRef.current
    console.log('Wave children node', childrenRef.current)
    if (!node || node.nodeType !== 1) {
      return
    }
    const instance = bindAnimationEvent(node)

    // eslint-disable-next-line consistent-return
    return () => {
      if (instance) {
        instance.cancel()
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      destory = true
    }
  }, [])

  const onTransitionStart = e => {
    if (destory) return

    const node = childrenRef.current
    if (!e || e.target !== node) {
      return
    }
    console.log('onTransitionStart animationStart', animationStart)
    if (!animationStart) {
      resetEffect(node)
    }
  }

  const onTransitionEnd = e => {
    console.log('onTransitionEnd', e.animationName)
    if (!e || !e.animationName || e.animationName.indexOf('fadeEffect') === -1) {
      return
    }
    console.log('animationEnd -> shouldReset')
    resetEffect(e.target)
  }

  const resetEffect = node => {
    if (!node || node === extraNode || !(node instanceof Element)) {
      return
    }
    const attributeName = 'click-animating'
    node.setAttribute(attributeName, 'false')

    if (styleForPesudo) {
      styleForPesudo.innerHTML = ''
    }
    if (insertExtraNode && extraNode && node.contains(extraNode)) {
      console.log('resetEffect -> removeExtraNode')
      node.removeChild(extraNode)
    }
    TransitionEvents.removeStartEventListener(node, onTransitionStart)
    TransitionEvents.removeEndEventListener(node, onTransitionEnd)
  }

  const handleClick = (node, waveColor) => {
    if (!node || isHidden(node) || node.className.indexOf('-leave') >= 0) {
      return
    }
    extraNode = document.createElement('div')
    extraNode.className = style['click-animating-node']
    const attributeName = 'click-animating'
    node.setAttribute(attributeName, 'true')
    styleForPesudo = styleForPesudo || document.createElement('style')
    console.log('waveColor', waveColor)
    if (
      waveColor &&
            waveColor !== '#ffffff' &&
            waveColor !== 'rgb(255, 255, 255)' &&
            isNotGrey(waveColor) &&
            !/rgba\(\d*, \d*, \d*, 0\)/.test(waveColor) &&
            waveColor !== 'transparent'
    ) {
      extraNode.style.borderColor = waveColor
      styleForPesudo.innerHTML = `
            .click-animating-node {
                wave-shadow-color: ${waveColor};
            }`
      if (!document.body.contains(styleForPesudo)) {
        document.body.appendChild(styleForPesudo)
      }
    }
    if (insertExtraNode) {
      console.log('appendChild extraNode')
      node.appendChild(extraNode)
    }
    TransitionEvents.addStartEventListener(node, onTransitionStart)
    TransitionEvents.addEndEventListener(node, onTransitionEnd)
  }

  const bindAnimationEvent = node => {
    if (
      !node ||
            !node.getAttribute ||
            node.getAttribute('disabled') ||
            node.className.indexOf('disabled') >= 0
    ) {
      return
    }
    const onClick = e => {
      if ((e.target).tagName === 'INPUT' || isHidden(e.target)) {
        return
      }
      resetEffect(node)
      const waveColor =
              getComputedStyle(node).getPropertyValue('border-top-color') ||
              getComputedStyle(node).getPropertyValue('border-color') ||
              getComputedStyle(node).getPropertyValue('background-color')
      timeoutId = window.setTimeout(() => handleClick(node, waveColor), 0)

      raf.cancel(animationStartId)
      animationStart = true

      animationStartId = raf(() => {
        animationStart = false
      }, 10)
    }
    node.addEventListener('click', onClick, true)
    // eslint-disable-next-line consistent-return
    return {
      cancel: () => {
        node.removeEventListener('click', onClick, true)
      },
    }
  }

  return children
}

export default Wave
