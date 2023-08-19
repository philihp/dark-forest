import { append, assoc, assocPath, equals, includes, map, nth, pipe, reject, splitAt, splitWhen } from 'ramda'
import { GameCommandTransitParams, Sol, StateReducer, Transit } from '../types'
import { tick } from './tick'

const checkPlayerOwner =
  (player: number, source: number): StateReducer =>
  (state) => {
    if (state?.sols?.[source]?.owner !== player) return undefined
    return state
  }

const addTransitDeparture =
  (departed: number, source: number, destination: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    return {
      ...state,
      transits: [
        ...state.transits,
        {
          departed,
          source,
          destination,
        },
      ],
    }
  }

const abandonExistingTransits =
  (source: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const newTransits = reject<Transit, Transit[]>((transit) => transit.source === source, state.transits)
    if (state.transits.length === newTransits.length) return state
    return assoc('transits', newTransits, state)
  }

const truncatePaths =
  (source: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    let dirty = false
    const newState = assoc(
      'sols',
      map((sol): Sol => {
        if (!includes(source, sol.path)) return sol
        dirty = true
        const newPath = append(source, nth(0, splitWhen(equals(source), sol.path))!)
        // const truncatedPath = nth(0, splitAt(-1, newPath)) ?? []
        return assoc<'path', Sol>('path', newPath, sol)
      }, state.sols),
      state
    )
    return dirty ? newState : state
  }

const clearSourcePath =
  (source: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (state.sols[source].path.length === 0) return state
    return assocPath(['sols', source, 'path'], [], state)
  }

export const transit = ({ player, time, source, destination }: GameCommandTransitParams): StateReducer =>
  pipe(
    //
    tick({ time }),
    checkPlayerOwner(player, source),
    abandonExistingTransits(source),
    truncatePaths(source),
    clearSourcePath(source),
    addTransitDeparture(time, source, destination)
  )
