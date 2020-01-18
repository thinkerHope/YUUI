import React from 'react'
import Animate from 'rc-animate'
import ScrollNumber from '../../util/scrollNumber'
import classNames from 'classnames'
import './style.less'

const Badge = ({
  style = {},
  className = '',
  children,
  count,
  overflowCount = 999,
  dot,
  showZero,
  offset = [],
}) => {

  const getStyleWithOffset = () => {
    return offset.length !== 0
      ? {
        right: -parseInt(offset[0], 10),
        marginTop: offset[1],
        ...style,
      }
      : style
  }

  const getNumberedDisplayCount = () => {
    const displayCount =
      count > overflowCount ? `${overflowCount}+` : count
    return displayCount
  }

  const getDisplayCount = () => {
    const _isDot = isDot()
    if (_isDot) {
      return ''
    }
    return getNumberedDisplayCount()
  }

  const isZero = () => {
    const numberedDisplayCount = getNumberedDisplayCount()
    return numberedDisplayCount === '0' || numberedDisplayCount === 0
  }

  const isDot = () => {
    const _isZero = isZero()
    return dot && !_isZero
  }

  const isHidden = () => {
    const displayCount = getDisplayCount()
    const _isZero = isZero()
    const _isDot = isDot()
    const isEmpty =
      displayCount === null ||
      displayCount === void(0) ||
      displayCount === ''
    return (isEmpty || (_isZero && !showZero)) && !_isDot
  }

  const renderDisplayComponent = () => {
    const customNode = count
    if (!customNode || typeof customNode !== 'object') {
      return void (0)
    }
    return React.cloneElement(customNode, {
      style: {
        ...this.getStyleWithOffset(),
        ...(customNode.props && customNode.props.style),
      },
    })
  }

  const getBadgeClassName = () => {
    return classNames(className, {
      [`badge`]: true,
      [`badge-not-a-wrapper`]: !children,
    })
  }

  const renderBadgeNumber = () => {
    const displayCount = getDisplayCount()
    const _isDot = isDot()
    const _isHidden = isHidden()

    const scrollNumberCls = classNames({
      [`badge-dot`]: _isDot,
      [`badge-count`]: !_isDot,
    });

    return _isHidden ? null : (
      <ScrollNumber
        data-show={!_isHidden}
        className={scrollNumberCls}
        count={displayCount}
        displayComponent={renderDisplayComponent()}
        // <Badge count={<Icon type="xxx" />}></Badge>
        style={getStyleWithOffset()}
        key="scrollNumber"
      />
    )
  }

  return (
    <span
      className={getBadgeClassName()}
    >
      {children}
      <Animate
        component=""
        componentProps={{}}
        showProp="data-show"
        transitionName={children ? `badge-zoom` : ''}
      >
        {renderBadgeNumber()}
      </Animate>
    </span>
  )
}

export default Badge
