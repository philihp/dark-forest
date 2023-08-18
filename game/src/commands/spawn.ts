import { any, assocPath, pipe } from 'ramda'
import { GameCommandSpawnParams, GameState, StateReducer, Tableau } from '../types'
import { removeExpired } from './action/removeExpired'
import { initialTableau } from '../state'

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

const createPlayer =
  (player: number): StateReducer =>
  (state) =>
    state && assocPath<Tableau, GameState>(['players', player], initialTableau, state)

export const spawn = ({ time, player, sol }: GameCommandSpawnParams): StateReducer =>
  pipe(
    //
    removeExpired(time),
    checkPlayerOwner(player, sol),
    checkSolExists(sol),
    assignOwner(player, sol),
    createPlayer(player)
  )
