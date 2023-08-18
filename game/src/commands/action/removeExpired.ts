import { assoc, reject } from 'ramda'
import { StateReducer, Transit } from '../../types'
import { coordinates, distance } from '../../math'

export const removeExpired =
  (time: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const newTransits = reject((transit: Transit) => {
      const [sx, sy] = coordinates(transit.source)
      const [dx, dy] = coordinates(transit.destination)
      const len = distance(sx, sy, dx, dy)
      return transit.departed + state.speed * len * 1000 < time
    }, state.transits)
    if (newTransits.length === state.transits.length) return state
    return assoc('transits', newTransits, state)
  }
