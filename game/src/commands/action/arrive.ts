import { append, assoc, assocPath, count, dissoc, evolve, filter, map, pipe, prop, reduce, sortBy } from 'ramda'
import { GameState, Sol, StateReducer, Transit } from '../../types'
import { coordinates, distance } from '../../math'

const strength =
  (sol: number) =>
  (state?: GameState): number =>
    count((thisSol: Sol): boolean => thisSol.path[thisSol.path.length - 1] === sol, state!.sols) +
    (state?.sols[sol].owner !== undefined ? 1 : 0)

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
    const arrivedTransits: Transit[] = pipe(
      //
      map<Transit, TransitWithArrival>((transit: Transit): TransitWithArrival => {
        const [sx, sy] = coordinates(transit.source)
        const [dx, dy] = coordinates(transit.destination)
        const len = distance(sx, sy, dx, dy)
        return {
          ...transit,
          arrived: transit.departed + state!.speed * len * 1000,
        }
      }),
      filter<TransitWithArrival>((transit: TransitWithArrival) => transit.arrived <= time + 1) as (
        arr: TransitWithArrival[]
      ) => TransitWithArrival[],
      sortBy(prop('arrived')),
      map<TransitWithArrival, Transit>(dissoc('arrived'))
    )(state.transits)
    if (arrivedTransits.length === 0) return state
    const { state: newState } = reduce(
      (accum: TransitAccum, transit: Transit) => {
        const { state, disrupted } = accum
        const { destination, source } = transit
        if (disrupted.includes(source)) return accum

        const srcOwner = state?.sols?.[source]?.owner
        const dstOwner = state?.sols?.[destination]?.owner
        const srcStrength = strength(source)(state)
        const dstStrength = strength(destination)(state)

        // landing force must overpower to displace
        if (srcOwner !== dstOwner && srcStrength <= dstStrength) return accum

        // the transit lands at the destination
        return evolve(
          {
            state: pipe(
              setSolToOwner(destination, srcOwner),
              extendOtherSolPaths(source, destination),
              extendSourceToDestination(source, destination)
            ),
            disrupted: append(destination),
          },
          accum
        )
      },
      { state, disrupted: [] } as TransitAccum,
      arrivedTransits
    )

    return newState
  }
