import { assoc, reject } from 'ramda'
import { StateReducer, Transit } from '../../types'

export const removeExpired =
  (time: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const newTransits = reject((transit: Transit) => transit.departed + state.speed * 1000 < time, state.transits)
    if (newTransits.length === state.transits.length) return state
    return assoc('transits', newTransits, state)
  }
