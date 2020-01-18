import React, { useState, useEffect } from 'react'
import { usePrevious } from '../util/customsHooks'
import classNames from 'classnames'
import { omit, getNumberArray } from './utils'

// 基本逻辑: count -> num -> position -> renderNumberList
function ScrollNumber(props) {

  const {
    className,
    count,
    displayComponent,
    component = 'sup',
    onAnimated = () => {},
  } = props

  const lastCount = usePrevious(count)

  // 修复渲染(每次页面重新渲染都会执行getPositionByNum, 
  // 此时currentCount = lastCount就会bug, 而且animateStarted是不用动画的)bug
  const [animateStarted, setAnimateStarted] = useState(true)

  useEffect(() => {
    animateStarted && setAnimateStarted(false)
  })

  useEffect(() => {
    (animateStarted && onAnimated) && onAnimated()
  }, [animateStarted])
  // 核心实现
  const getPositionByNum = (num, i) => {
    const _currentCount = Math.abs(Number(count));
    console.log('_currentCount', _currentCount)
    const _lastCount = Math.abs(Number(lastCount))
    console.log('_lastCount', _lastCount)
    const currentDigit = Math.abs(getNumberArray(_currentCount)[i]);
    const lastDigit = Math.abs(getNumberArray(_lastCount)[i]);

    if (animateStarted) {
      return 10 + num;
    }
    // 同方向则在同一侧切换数字
    if (_currentCount > _lastCount) {
      if (currentDigit >= lastDigit) {
        return 10 + num;
      }
      return 20 + num;
    }
    if (currentDigit <= lastDigit) {
      return 10 + num;
    }
    // 考虑从20 -> 19, currentDigit > lastDigit
    return num;
  }

  const renderNumberList = position => {
    const childrenToReturn = [];
    for (let i = 0; i < 30; i++) {
      const currentClassName = position === i ? 'current' : '';
      childrenToReturn.push(
        <p key={i.toString()} className={currentClassName}>
          {i % 10}
        </p>,
      );
    }

    return childrenToReturn;
  }

  const renderCurrentNumber = (num, i) => {
    if (typeof num === 'number') {
      const position = getPositionByNum(num, i)
      const _lastCount =  Math.abs(Number(lastCount))
      const removeTransition = 
        animateStarted || getNumberArray(_lastCount)[i] === void(0)
        return React.createElement(
          'span',
          {
            id: i,
            className: `scroll-number-only`,
            style: {
              transition: removeTransition ? 'none' : void(0),
              msTransform: `translateY(${-position * 100}%)`,
              WebkitTransform: `translateY(${-position * 100}%)`,
              transform: `translateY(${-position * 100}%)`,
            },
            key: i,
          },
          renderNumberList(position),
        );
    } 
    return (
      <span key="symbol" className="badge-symbol">
        {num}
      </span>
    )
  }

  const renderNumberElement = () => {
    if (count && Number(count) % 1 === 0) {
      return getNumberArray(count)
        .map((num, i) => renderCurrentNumber(num, i))
        .reverse();
    }
    // 99+
    return count
  }

  const renderScrollNumber = () => {

    const restProps = omit(props, [
      'count',
      'onAnimated',
      'component',
      'displayComponent',
    ])
    const newProps = {
      ...restProps,
      className: classNames(className, 'scroll-number')
    }
    console.log('newProps', newProps)
    if (displayComponent) {
      return React.cloneElement(displayComponent, {
        className: classNames(
          'badge-custom-component',
          displayComponent.props && 
          displayComponent.props.className,
        )
      })
    }
    return React.createElement(component, newProps, renderNumberElement())
  }
  return renderScrollNumber()
}

export default ScrollNumber