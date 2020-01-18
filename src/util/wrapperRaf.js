import { raf, caf } from './raf'

let id = 0
const ids = {}
// Support call raf with delay specified frame
export default function WrapperRaf(callback, delayFrames = 1) {
  const myId = ++id
  let restFrames = delayFrames 

  function internalCallback() {
    restFrames--
    if (restFrames <= 0) {
      callback()
      delete ids[myId]
    } else {
      ids[myId] = raf(internalCallback)
    }
  }
  ids[myId] = raf(internalCallback)

  return myId
}

WrapperRaf.cancel = function(pId) {
  if (pid === undefined) return

    caf(ids[pId])
    delete ids[myId] 
}