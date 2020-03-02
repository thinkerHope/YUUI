/* eslint-disable import/no-duplicates */
import { h } from 'preact'
import LazyRenderBox from './LazyRenderBox'
import { useEffect, useRef } from 'preact/hooks'
import style from './style.less'
import Animate from 'rc-animate'

const obj = {}
const noop = () => {}

const Dialog = ({
  wrapClassName = '',
  maskTransitionName = '',
  transitionName = '',
  visible = false,
  maskClosable = true,
  _style = obj,
  wrapStyle = obj,
  children,

  onClose = noop,
  onAnimateLeave,
  afterClose,
}) => {
  const _maskTransitionName = {
    appear: style[`${maskTransitionName}Appear`],
    enter: style[`${maskTransitionName}Enter`],
    enterActive: style[`${maskTransitionName}EnterActive`],
    leave: style[`${maskTransitionName}Leave`],
    leaveActive: style[`${maskTransitionName}LeaveActive`],
  }
  const _transitionName = {
    appear: style[`${transitionName}Appear`],
    enter: style[`${transitionName}Enter`],
    enterActive: style[`${transitionName}EnterActive`],
    leave: style[`${transitionName}Leave`],
    leaveActive: style[`${transitionName}LeaveActive`],
  }

  const wrapRef = useRef()

  useEffect(() => {
    return () => {
      console.log('componentWillUnmount')
      document.body.style.overflow = ''
      if (wrapRef.current) {
        console.log('useEffect wrapRef')
        wrapRef.current.style.display = 'none'
      }
    }
  }, [])

  const close = e => {
    if (onClose) {
      onClose(e)
    }
  }
  const handleMaskClick = e => {
    if (e.target === e.currentTarget) {
      close(e)
    }
  }

  const handleAnimateAppear = () => {
    console.log('handleAnimateAppear')
    document.body.style.overflow = 'hidden'
  }
  const handleAnimateLeave = () => {
    console.log('handleAnimateLeave')
    if (wrapRef) {
      console.log('handleAnimateLeave wrapRef')
      wrapRef.current.style.display = 'none'
    }
    if (onAnimateLeave) {
      onAnimateLeave()
    }
    if (afterClose) {
      afterClose()
    }
  }
  if (visible && wrapRef.current) {
    console.log('render wrapRef')
    // 无效 wrapStyle.display = 'flex'
    wrapRef.current.style.display = 'flex'
  }

  return (
    <div>
      <Animate
        key="mask"
        showProp="visible"
        transitionAppear
        component=""
        transitionName={_maskTransitionName}
      >
        <LazyRenderBox
          className={style.mask}
          hiddenClassName={style.hiddenMask}
          visible={visible}
        />
      </Animate>
      <div
        className={[style.wrap, wrapClassName].join(' ')}
        ref={wrapRef}
        onClick={maskClosable ? handleMaskClick : undefined}
        role="dialog"
        style={wrapStyle}
      >
        <Animate
          key="dialog"
          showProp="visible"
          onAppear={handleAnimateAppear}
          onLeave={handleAnimateLeave}
          component=""
          transitionAppear
          transitionName={_transitionName}
        >
          <LazyRenderBox
            key="dialog-element"
            role="document"
            style={_style}
            className={style.modal}
            visible={visible}
          >
            {children}
          </LazyRenderBox>
        </Animate>
      </div>
    </div>
  )
}

export default Dialog
