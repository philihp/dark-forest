import { assoc, reject } from 'ramda'
import { StateReducer, Transit } from '../../types'

export const removeExpiredTransits =
  (time: number): StateReducer =>
  (state) =>
    state &&
    assoc(
      'transits',
      reject((transit: Transit) => transit.departed + state.speed * 1000 < time, state.transits),
      state
    )
