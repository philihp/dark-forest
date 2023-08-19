import { append, assoc, assocPath, dissoc, filter, map, prop, reduce, sortBy } from 'ramda'
import { GameState, Sol, StateReducer, Transit } from '../../types'
import { coordinates, distance } from '../../math'

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

type TransitWithArrival = Transit & {
  arrived: number
}

export const arriveTransits =
  (time: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const transitsWithArrival: TransitWithArrival[] = map<Transit, TransitWithArrival>(
      (transit: Transit): TransitWithArrival => {
        const [sx, sy] = coordinates(transit.source)
        const [dx, dy] = coordinates(transit.destination)
        const len = distance(sx, sy, dx, dy)
        return {
          ...transit,
          arrived: transit.departed + state!.speed * len * 1000,
        }
      },
      state.transits
    )
    const arrivedTransitsWithArrival: TransitWithArrival[] = filter<TransitWithArrival, TransitWithArrival[]>(
      (transit: TransitWithArrival) => transit.arrived < time,
      transitsWithArrival
    )
    const sortedArrivedTransits: TransitWithArrival[] = sortBy(prop('arrived'), arrivedTransitsWithArrival)
    const arrivedTransits: Transit[] = map<TransitWithArrival, Transit>(dissoc('arrived'), sortedArrivedTransits)

    if (arrivedTransits.length === 0) return state

    const { state: newState } = reduce(
      (accum: TransitAccum, transit: Transit) => {
        const { state, disrupted } = accum
        const { destination, source } = transit
        const src = state?.sols?.[source]
        // const dst = state?.sols?.[destination]
        if (disrupted.includes(source)) return accum
        // could be use to use R.evolve here

        const s0 = state
        const s1 = setSolToOwner(destination, src?.owner)(s0)
        const s2 = extendOtherSolPaths(source, destination)(s1)
        const s3 = extendSourceToDestination(source, destination)(s2)
        const newState = s3
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
