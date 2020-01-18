import React, { useState, useEffect, useRef, useMemo } from 'react'
import Badge from '../../components/badge'
import './style.less'

const BadgeDemo = () => {
  const [count, setCount] = useState(50)
  
  const BadgeMemo = useMemo(
    () => (
      <Badge count={count}>
        <a className="head-example" />
      </Badge>
    ), [count])

  return (
    <div>
      {BadgeMemo}
      <label />
      <input type="textarea" onChange={(e) => setCount(e.target.value) }/>
    </div>
  )
} 

export default BadgeDemo