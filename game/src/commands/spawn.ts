import { any, assocPath, pipe } from 'ramda'
import { GameCommandSpawnParams, GameState, StateReducer } from '../types'
import { removeExpiredTransits } from './action/removeExpiredTransits'

const checkPlayerOwner =
  (player: number, sol: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (any((sol) => sol.owner === player, state.sols)) return undefined
    return state
  }

const checkSolExists =
  (sol: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (state.sols[sol] === undefined) return undefined
    return state
  }

const assignOwner =
  (player: number, sol: number): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    return assocPath<number, GameState>(['sols', sol, 'owner'], player)(state)
  }

export const spawn = ({ time, player, sol }: GameCommandSpawnParams): StateReducer =>
  pipe(
    //
    removeExpiredTransits(time),
    checkPlayerOwner(player, sol),
    checkSolExists(sol),
    assignOwner(player, sol)
  )
