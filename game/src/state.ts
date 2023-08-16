import { PCGState } from 'fn-pcg/dist/types'
import { GameState } from './types'

export const initialState: GameState = {
  randGen: {} as PCGState,
  players: [],
  sols: [],
}
