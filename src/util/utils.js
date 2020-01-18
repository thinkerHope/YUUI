function isObject(obj) {
  return obj !== null &&
         typeof obj === 'object' &&
         Array.isArray(obj) === false
}

export function omit(obj, props, fn) {
  if (!isObject(obj)) return {}
  if (typeof props === 'function') {
    fn = props
    props = []
  }
  if (typeof props === 'string') {
    props = [props]
  }

  const isFunction = typeof fn === 'function'
  const res = {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      
      let val = obj[key]

      if (
          (!props || (props.indexOf(key) === -1) && 
          (!isFunction || fn(val, key, obj)))
         ) 
      {
        res[key] = val
      }
    }
  }
  return res
}
// reverse()很重要, 考虑200023 -> 23, 可以保证2和3的numberList不受影响
export function getNumberArray(num) {
  return num
    ? num
        .toString()
        .split('')
        .reverse()
        .map(i => {
          const current = Number(i);
          return isNaN(current) ? i : current;
        })
    : [];
}