import {
  append,
  assoc,
  assocPath,
  complement,
  count,
  dissoc,
  equals,
  evolve,
  filter,
  head,
  isNotNil,
  lensProp,
  map,
  modify,
  modifyPath,
  over,
  pathSatisfies,
  pipe,
  prop,
  propSatisfies,
  reduce,
  sortBy,
  splitWhen,
  when,
} from 'ramda'
import { GameState, Sol, StateReducer, Transit } from '../../types'
import { coordinates, distance } from '../../math'

const strength =
  (sol: number) =>
  (state?: GameState): number =>
    count((thisSol: Sol): boolean => thisSol.path[thisSol.path.length - 1] === sol, state!.sols) +
    (state?.sols?.[sol].owner !== undefined && state?.sols?.[sol]?.path?.length === 0 ? 1 : 0)

const setSolToOwner = (destination: number, newOwner?: number): StateReducer =>
  when(isNotNil, (state) =>
    modifyPath<'sols', number, GameState, Sol>(
      ['sols', destination],
      when<Sol, Sol>(
        propSatisfies(complement(equals<number | undefined>(newOwner)), 'owner'),
        pipe(assoc('owner', newOwner), assoc('path', []))
      ),
      state
    )
  )

const truncateSupplyLinesNotFriendlyThrough = (owner?: number, system?: number): StateReducer =>
  when(
    isNotNil,
    modify<'sols', Sol[], Sol[]>(
      'sols',
      map<Sol, Sol>(
        // when the sol's owner is not this owner
        when<Sol, Sol>(propSatisfies(complement(equals<number | undefined>(owner)), 'owner'), (sol) => {
          // split [..., 1, 2, 3, 4] at system=3, so the result is just [..., 1, 2]
          return modify<Sol, 'path', number[]>(
            'path',
            pipe<[number[]], number[][], number[]>(
              //
              splitWhen<number>(equals(system)),
              head
            ),
            sol
          )
        })
      )
    )
  )

const extendOtherSolPaths = (source: number, destination: number): StateReducer =>
  when(
    isNotNil,
    modify(
      'sols',
      map(
        when(
          // for every sol, if the last element in the path is `source`, then append destination
          pathSatisfies(equals(source), ['path', -1]),
          over(lensProp<Sol, 'path'>('path'), append(destination))
        )
      )
    )
  )

const extendSourceToDestination = (source: number, destination: number): StateReducer =>
  when(
    // a fleet at home wont have anything in its path
    isNotNil,
    assocPath<number[], GameState>(['sols', source, 'path'], [destination])
  )

type TransitAccum = { state: GameState | undefined; disrupted: number[] }

type TransitWithArrival = Transit & {
  arrived: number
}

const addArrivalTime = (speed: number) =>
  map<Transit, TransitWithArrival>(
    (transit: Transit): TransitWithArrival =>
      assoc(
        'arrived',
        transit.departed + speed * distance(...coordinates(transit.source), ...coordinates(transit.destination)) * 1000,
        transit
      )
  )

const removeArrivalTime = map<TransitWithArrival, Transit>(dissoc('arrived'))

const filterArrivedTransits = (time: number): ((batch: TransitWithArrival[]) => TransitWithArrival[]) =>
  filter<TransitWithArrival>((transit: TransitWithArrival) => transit.arrived <= time + 1)

export const arriveTransits =
  (time: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const arrivedTransits: Transit[] = pipe(
      //
      addArrivalTime(state!.speed),
      filterArrivedTransits(time),
      sortBy(prop('arrived')),
      removeArrivalTime
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
              truncateSupplyLinesNotFriendlyThrough(srcOwner, destination),
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
