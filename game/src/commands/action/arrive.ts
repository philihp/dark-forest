import { Evolvable, assoc, assocPath, evolve, filter, identity, reduce } from 'ramda'
import { GameState, Sol, StateReducer, Transit } from '../../types'

type TransitAccum = { state: GameState; disrupted: number[] }

export const arriveTransits =
  (time: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const arrivedTransits = filter((transit: Transit) => transit.departed + state.speed * 1000 < time, state.transits)
    if (arrivedTransits.length === 0) return state

    const { state: newState } = reduce(
      (accum: TransitAccum, transit: Transit) => {
        const { state, disrupted } = accum
        const { destination, source } = transit
        const src = state.sols[source]!
        const dst = state.sols[destination]!
        if (dst.owner === src.owner) return accum
        if (disrupted.includes(source)) return accum
        // could be use to use R.evolve here
        const newState = assocPath(
          ['sols', destination],
          {
            owner: src.owner,
            path: [],
          } as Sol,
          state
        )

        return {
          state: newState,
          disrupted: [...disrupted, destination],
        }
      },
      { state, disrupted: [] } as TransitAccum,
      arrivedTransits
    )

    return newState
  }
