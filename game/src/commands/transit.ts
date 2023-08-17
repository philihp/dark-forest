import { GameCommandTransitParams, GameState } from '../types'

export const transit = (
  state: GameState,
  { departed, source, destination }: GameCommandTransitParams
): GameState | undefined => {
  return state
}
