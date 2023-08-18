import { append, assoc, assocPath, filter, map, reduce } from 'ramda'
import { GameState, Sol, StateReducer, Transit } from '../../types'

const setSolToOwner =
  (destination: number, owner?: number): StateReducer =>
  (state?: GameState): GameState | undefined =>
    state &&
    assocPath<Sol, GameState>(
      ['sols', destination],
      {
        owner,
        path: [],
      } as Sol,
      state
    )

const extendOtherSolPaths =
  (source: number, destination: number): StateReducer =>
  (state) => {
    const newSols = map((sol) => {
      if (source === sol.path[sol.path.length - 1]) {
        return assoc('path', append(destination, sol.path), sol)
      }
      return sol
    }, state!.sols)

    return assoc('sols', newSols, state)
  }

const extendSourceToDestination =
  (source: number, destination: number): StateReducer =>
  (state?: GameState): GameState | undefined =>
    state &&
    assocPath<number[], GameState>(
      //
      ['sols', source, 'path'],
      [destination],
      state
    )

type TransitAccum = { state: GameState | undefined; disrupted: number[] }

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
        const src = state?.sols?.[source]
        const dst = state?.sols?.[destination]
        if (dst?.owner === src?.owner) return accum
        if (disrupted.includes(source)) return accum
        // could be use to use R.evolve here

        const s0 = state
        const s1 = setSolToOwner(destination, src?.owner)(s0)
        const s2 = extendOtherSolPaths(source, destination)(s1)
        const s3 = extendSourceToDestination(source, destination)(s2)
        const newState = s3

        // const newState = pipe(
        //   //
        //   setSolToOwner(destination, src?.owner),
        //   extendOtherSolPaths(source, destination)
        // )(state)

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
