import { assoc, assocPath, filter, reduce } from 'ramda'
import { GameState, Sol, StateReducer, Transit } from '../../types'

type TransitAccum = { state: GameState; disrupted: number[] }

export const arriveTransits =
  (time: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const arrivedTransits = filter((transit: Transit) => transit.departed + state.speed * 1000 < time, state.transits)
    if (arrivedTransits.length === 0) return state

    const { state: newState } = reduce(
      (trs: TransitAccum, transit: Transit) => {
        const { destination, source } = transit
        const { state, disrupted } = trs
        const src = state.sols[source]!
        const dst = state.sols[destination]!
        if (dst.owner === src.owner) return trs
        const newAccum = assocPath(
          ['state', 'sols', destination],
          {
            owner: src.owner,
            path: [],
          } as Sol,
          { state, disrupted } as TransitAccum
        )
        return newAccum
      },
      { state, disrupted: [] } as TransitAccum,
      arrivedTransits
    )

    return newState
  }
