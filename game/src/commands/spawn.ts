import { any, assocPath } from 'ramda'
import { GameCommandSpawnParams, GameState } from '../types'

export const spawn = (state: GameState, { sol, player }: GameCommandSpawnParams): GameState | undefined => {
  if (any((sol) => sol.owner === player, state.sols)) return undefined
  if (state.sols[sol] === undefined) return undefined
  return assocPath(['sols', sol, 'owner'], player, state)
}
