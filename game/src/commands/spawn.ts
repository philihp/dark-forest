import { any, assocPath } from 'ramda'
import { GameCommandSpawnParams, GameState, StateReducer } from '../types'

export const spawn =
  ({ player, sol }: GameCommandSpawnParams): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (any((sol) => sol.owner === player, state.sols)) return undefined
    if (state.sols[sol] === undefined) return undefined
    return assocPath<number, GameState>(['sols', sol, 'owner'], player)(state)
  }
