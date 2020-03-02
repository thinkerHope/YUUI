/* eslint-disable operator-linebreak */
import style from './style.less'
import { Subject, race, timer } from 'rxjs'
import { switchMap, filter, mapTo, scan, map } from 'rxjs/operators'

export const mapXY = map(e => {
  if (!e.touches.length) return { e }
  return {
    e,
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  }
})

export default function Touch({
  children,
  onPress,
  onLongPress,
  duration = 500,
  threshold = 5,
}) {
  const start$ = new Subject()
  const move$ = new Subject()
  const end$ = new Subject()

  start$
    .pipe(
      mapXY,
      switchMap(({ x: sx, y: sy }) => {
        return race(
          move$.pipe(
            mapXY,
            scan(
              (overThreshold, { x, y }) =>
                overThreshold ||
                Math.abs(x - sx) > threshold ||
                Math.abs(y - sy) > threshold,
              false,
            ),
            filter(i => i),
            mapTo('cancel'),
          ),
          timer(duration).pipe(mapTo('longpress')),
          end$.pipe(mapTo('press')),
        )
      }),
    )
    .subscribe(action => {
      // console.log('TCL: action', action)
      action === 'press' && onPress && onPress()
      action === 'longpress' && onLongPress && onLongPress()
    })

  return (
    <div
      className={style.touch}
      onTouchStart={e => { e.stopPropagation(); start$.next(e) }}
      onTouchMove={e => move$.next(e)}
      onTouchEnd={e => end$.next(e)}
      onContextMenu={e => e.preventDefault()}
    >
      {children}
    </div>
  )
}
